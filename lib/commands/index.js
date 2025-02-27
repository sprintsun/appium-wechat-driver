import findCmds from './find'
import executeCmds from './execute'
import gestureCmds from './gestures'
import sourceCmds from './source'
import appManagementCmds from './app-management'
import windowCmds from './window'

const commands = {}
Object.assign(
  commands,
  findCmds,
  executeCmds,
  gestureCmds,
  sourceCmds,
  appManagementCmds,
  windowCmds
  // add other command types here
)

export { commands }
export default commands
