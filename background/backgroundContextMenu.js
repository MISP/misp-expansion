import {myBrowser} from '../utils/utils.js'
import {notifyI18n} from '../utils/utils.js'
import {INFOTITLE,NOCRED} from '../utils/lexicon.js'
import {myAlert,sendRequest} from './backgroundFunction.js'
import {CREDENTIALSNAME, NOB, KEY, URLFORFETCH, unconvert} from './backgroundStorage.js'

//////////////////INIT//////////////////////////////////////

const SELECTION = "selection";
const PAGE = "page";
const LINK = "link";
const NORMAL = "normal";
const POST = "POST";

//create context menu 
export function createContexteMenu(){
	myBrowser.contextMenus.create({
		title: myBrowser.i18n.getMessage(SELECTION)+" %s", 
		contexts:[SELECTION], 
		type: NORMAL,
		id: SELECTION
  
	});
	myBrowser.contextMenus.create({
		title:  myBrowser.i18n.getMessage(PAGE), 
		contexts:[PAGE], 
		type: NORMAL,
		id: PAGE
  
	});
	myBrowser.contextMenus.create({
		title:  myBrowser.i18n.getMessage(LINK), 
		contexts:[LINK], 
		type: NORMAL,
		id: LINK
  
	});
}

///////////////////////////SELECTION///////////////////////

//check if connected, otherwise user can't use context menu
export function contexteMenuFunction(info,tab) {
	selector(info,tab);
}

//call the context menu function
function selector(info,tab){
	if (info.menuItemId == SELECTION) {
			searchBySelection(info.selectionText);
		}
		if (info.menuItemId == LINK) {
			searchBySelection(info.linkUrl);
		}
		if (info.menuItemId == PAGE) {
			searchBySelection(info.pageUrl);
		}	
}

//when user select text on a page
function searchBySelection(selec){
	myBrowser.storage.sync.get(CREDENTIALSNAME, function(res){
		if(res[CREDENTIALSNAME].length > 0 ){
			myBrowser.storage.sync.get(NOB, function(resNumber){
				res[CREDENTIALSNAME].forEach(function(element){ 
					sendRequest(selec,resNumber[NOB],1,unconvert(element[URLFORFETCH]),unconvert(element[KEY]),POST);
				});
			});
		}else{
			notifyI18n(INFOTITLE,NOCRED);
		}
	});
}