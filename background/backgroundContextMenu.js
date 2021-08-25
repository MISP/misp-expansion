import {myBrowser} from '../utils/utils.js'
import {notifyI18n} from '../utils/utils.js'
import {INFOTITLE,NOCRED} from '../utils/lexicon.js'
import {sendRequest, sendRequestAdvanced} from './backgroundFunction.js'
import {CREDENTIALSNAME, NOB, KEY, URLFORFETCH, ADVANCEREQUIRED, unconvert} from './backgroundStorage.js'

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

//call the context menu function
export function contexteMenuFunction(info,tab) {
	if (info.menuItemId == SELECTION) {
		searchBySelection(info.selectionText);
	}
	else if (info.menuItemId == LINK) {
		searchBySelection(info.linkUrl);
	}
	else if (info.menuItemId == PAGE) {
		searchBySelection(info.pageUrl);
	}	
}

//when user select text on a page
function searchBySelection(selec){
	myBrowser.storage.sync.get(CREDENTIALSNAME, function(res){
		if(res[CREDENTIALSNAME].length > 0 ){
			myBrowser.storage.sync.get(NOB, function(resNumber){	
				myBrowser.storage.sync.get(ADVANCEREQUIRED, function(isAdvanced){
					if(isAdvanced[ADVANCEREQUIRED]){
						//window.open();
						sendRequestAdvanced(selec,resNumber[NOB],1,res,POST);
					}else{
						res[CREDENTIALSNAME].forEach(function(element){ 
							sendRequest(selec,resNumber[NOB],1,unconvert(element[URLFORFETCH]),unconvert(element[KEY]),POST);
						});
					}
				});
			});
		}else{
			notifyI18n(INFOTITLE,NOCRED);
		}
	});
}