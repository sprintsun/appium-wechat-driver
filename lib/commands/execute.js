import _ from 'lodash'
import { errors } from 'appium-base-driver'
import log from '../logger'

const commands = {}

const EXTENSION_COMMANDS_MAPPING = {
  setValue: 'macosSetValue',
  click: 'macosClick',
  scroll: 'macosScroll',
  swipe: 'macosSwipe',
  rightClick: 'macosRightClick',
  hover: 'macosHover',
  doubleClick: 'macosDoubleClick',
  clickAndDrag: 'macosClickAndDrag',
  clickAndDragAndHold: 'macosClickAndDragAndHold',
  keys: 'macosKeys',

  tap: 'macosTap',
  doubleTap: 'macosDoubleTap',
  press: 'macosPress',
  pressAndDrag: 'macosPressAndDrag',
  pressAndDragAndHold: 'macosPressAndDragAndHold',

  source: 'macosSource',

  launchApp: 'macosLaunchApp',
  activateApp: 'macosActivateApp',
  terminateApp: 'macosTerminateApp',
  queryAppState: 'macosQueryAppState',

  startRecordingScreen: 'startRecordingScreen',
  stopRecordingScreen: 'stopRecordingScreen',
}

commands.execute = async function execute(script, args) {
  if (script.match(/^macos:/)) {
    log.info(`Executing extension command '${script}'`)
    script = script.replace(/^macos:/, '').trim()
    return await this.executeMacosCommand(
      script,
      _.isArray(args) ? args[0] : args
    )
  }
  throw new errors.NotImplementedError()
}

commands.executeMacosCommand = async function executeMacosCommand(
  command,
  opts = {}
) {
  if (!_.has(EXTENSION_COMMANDS_MAPPING, command)) {
    throw new errors.UnknownCommandError(
      `Unknown extension command "${command}". ` +
        `Only ${_.keys(EXTENSION_COMMANDS_MAPPING)} commands are supported.`
    )
  }
  return await this[EXTENSION_COMMANDS_MAPPING[command]](opts)
}

export default commands
