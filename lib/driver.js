import _ from 'lodash'
import { BaseDriver, DeviceSettings } from 'appium-base-driver'
import WDA_SERVER from './wda'
import { desiredCapConstraints } from './desired-caps'
import commands from './commands/index'

const NO_PROXY = [
  ['GET', new RegExp('^/session/[^/]+/appium')],
  ['POST', new RegExp('^/session/[^/]+/appium')],
  ['POST', new RegExp('^/session/[^/]+/element/[^/]+/elements?$')],
  ['POST', new RegExp('^/session/[^/]+/elements?$')],
  ['POST', new RegExp('^/session/[^/]+/execute')],
  ['POST', new RegExp('^/session/[^/]+/execute/sync')],
  ['GET', new RegExp('^/session/[^/]+/timeouts$')],
  ['POST', new RegExp('^/session/[^/]+/timeouts$')],
  ['GET', new RegExp('^/session/[^/]+/window/rect$')],
  ['GET', new RegExp('^/session/[^/]+/context$')],
  ['GET', new RegExp('^/session/[^/]+/log$')],
]

class WechatDriver extends BaseDriver {
  constructor(opts = {}) {
    super(opts)
    this.desiredCapConstraints = desiredCapConstraints
    this.locatorStrategies = [
      'id',
      'name',
      'tag name',
      'accessibility id',

      'xpath',

      'class name',
      'css selector',
    ]
    this.resetState()
    this.settings = new DeviceSettings({}, this.onSettingsUpdate.bind(this))

    for (const [cmd, fn] of _.toPairs(commands)) {
      WechatDriver.prototype[cmd] = fn
    }
  }

  async onSettingsUpdate(key, value) {
    return await this.wda.proxy.command('/appium/settings', 'POST', {
      settings: { [key]: value },
    })
  }

  resetState() {
    this.wda = null
    this.proxyReqRes = null
    this.isProxyActive = false
    this._screenRecorder = null
  }

  proxyActive() {
    return this.isProxyActive
  }

  getProxyAvoidList() {
    return NO_PROXY
  }

  canProxy() {
    return true
  }

  async createSession(...args) {
    const [sessionId, caps] = await super.createSession(...args)
    this.wda = WDA_SERVER
    try {
      await this.wda.startSession(caps, sessionId)
    } catch (e) {
      await this.deleteSession()
      throw e
    }
    this.proxyReqRes = this.wda.proxy.proxyReqRes.bind(this.wda.proxy)
    this.isProxyActive = true
    return [sessionId, caps]
  }

  async deleteSession() {
    await this._screenRecorder?.stop(true)
    await this.wda?.stopSession()

    this.resetState()

    await super.deleteSession()
  }

  async installApp(appPath) {
    return await this.wda.proxy.command('/appium/device/install_app', 'POST', {
      appPath,
    })
  }

  async getCurrentContext(...args) {
    // 暂时先写死，后续可以判断是否返回WEBVIEW
    return 'NATIVE_APP'
  }

  async getLog(...args) {
    // const [jsonwpCaps, reqCaps, w3cCapabilities] = args
    return []
  }
}

export default WechatDriver
