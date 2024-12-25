const commands = {}

// getWindowRect 命令转换为 getWindowSize，为何还不知道
commands.getWindowRect = async function getWindowRect() {
  const endpoint = `/session/${this.wda.proxy.sessionId}/window/current/size`
  return await this.wda.proxy.command(endpoint, 'GET')
}

export { commands }
export default commands
