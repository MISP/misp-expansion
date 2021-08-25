import {EMPTY} from '../utils/lexicon.js'
import {myBrowser} from '../utils/utils.js'
import {contexteMenuFunction,createContexteMenu} from './backgroundContextMenu.js'
import {initStorage} from './backgroundStorage.js'

//////////////////////INIT SECTION//////////////////////////////////////////////////////

// when extension is installed
myBrowser.runtime.onInstalled.addListener(init);

//When browser is started
myBrowser.runtime.onStartup.addListener(init);

//context menu listener
myBrowser.contextMenus.onClicked.addListener(contexteMenuFunction)

myBrowser.browserAction.setPopup({popup:EMPTY});  //disable browserAction's popup

myBrowser.browserAction.onClicked.addListener(()=>{
    myBrowser.runtime.openOptionsPage();
});

//prepare extension
function init(){
	createContexteMenu();
	initStorage();
};