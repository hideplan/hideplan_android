import { eventEmitter, initialMode } from 'react-native-dark-mode';

const DarkMode = { currentMode: initialMode }
eventEmitter.on('currentModeChanged', newMode => (DarkMode.currentMode = newMode))
 
export default DarkMode
