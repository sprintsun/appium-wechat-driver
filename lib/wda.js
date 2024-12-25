import { JWProxy } from 'appium-base-driver'
import { logger } from 'appium-support'
import { waitForCondition } from 'asyncbox'

const log = logger.getLogger('WechatDriverAgent')

const STARTUP_TIMEOUT_MS = 120000
const DEFAULT_SYSTEM_PORT = 10100
const DEFAULT_SYSTEM_HOST = '127.0.0.1'

class WDAServer {
  constructor() {
    this.serverStartupTimeoutMs = STARTUP_TIMEOUT_MS
    this.proxy = null

    // To handle if the WDAMac server is proxying requests to a remote WDAMac app instance
    this.isProxyingToRemoteServer = true
  }

  async isProxyReady(throwOnExit = true) {
    if (!this.proxy) {
      return false
    }

    try {
      await this.proxy.command('/status', 'GET')
      return true
    } catch (err) {
      if (throwOnExit) {
        throw new Error(err.message)
      }
      return false
    }
  }

  /**
   * @typedef {Object} ProxyProperties
   *
   * @property {string} scheme - The scheme proxy to.
   * @property {string} host - The host name proxy to.
   * @property {number} port - The port number proxy to.
   * @property {string} path - The path proxy to.
   */

  /**
   * Returns proxy information where WDAServer proxy to.
   *
   * @param {Object} caps - The capabilities in the session.
   * @return {ProxyProperties}
   */
  parseProxyProperties(caps) {
    let scheme = 'http'
    return {
      scheme,
      server: caps.systemHost ?? DEFAULT_SYSTEM_HOST,
      port: caps.systemPort ?? DEFAULT_SYSTEM_PORT,
      path: '',
    }
  }

  async startSession(caps, sessionId) {
    this.serverStartupTimeoutMs =
      caps.serverStartupTimeout ?? this.serverStartupTimeoutMs

    if (!this.proxy) {
      const { scheme, server, port, path } = this.parseProxyProperties(caps)
      this.proxy = new JWProxy({
        scheme,
        server,
        port,
        base: path,
        keepAlive: true,
      })

      try {
        await waitForCondition(async () => await this.isProxyReady(), {
          waitMs: this.serverStartupTimeoutMs,
          intervalMs: 1000,
        })
      } catch (e) {
        if (/Condition unmet/.test(e.message)) {
          const msg =
            `No response from '${scheme}://${server}:${port}${path}' within ${this.serverStartupTimeoutMs}ms timeout.` +
            `Please make sure the remote server is running and accessible by Appium`
          throw new Error(msg)
        }
        throw e
      }
    } else {
      log.info(
        'The host process has already been listening. Proceeding with session creation'
      )
    }

    await this.proxy.command('/session', 'POST', {
      sessionId,
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: caps,
      },
    })
  }

  async stopSession() {
    if (this.proxy?.sessionId) {
      try {
        await this.proxy.command(`/session/${this.proxy.sessionId}`, 'DELETE')
      } catch (e) {
        log.info(
          `WechatDriver session cannot be deleted. Original error: ${e.message}`
        )
      }
    }
  }
}

const WDA_SERVER = new WDAServer()

export default WDA_SERVER
