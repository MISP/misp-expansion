import {myBrowser} from '../utils/utils.js'
import {NOB, CREDENTIALSNAME, ADVANCEREQUIRED, initStorage} from '../background/backgroundStorage.js'
import {VIEW, INSTANCE, ERASE, ERASEDONE, ERASECONFIRM, OPTREQUEST, CLICK, DOMLOADED} from '../utils/lexicon.js'

const INSTANCEADDER = './instance/optionAddInstance.html';
const INSTANCEVIWER = './instance/optionInstance.html';
const OPTREQ = 'optionRequest.html';
  
//wait loading document element
document.addEventListener(DOMLOADED, function () {
	//elements names define
	document.getElementById(VIEW).textContent = myBrowser.i18n.getMessage(VIEW);
	document.getElementById(INSTANCE).textContent = myBrowser.i18n.getMessage(INSTANCE);
	document.getElementById(OPTREQUEST).textContent = myBrowser.i18n.getMessage(OPTREQUEST);
	document.getElementById(ERASE).textContent = myBrowser.i18n.getMessage(ERASE);

	//buttons actions
	document.getElementById(VIEW).addEventListener(CLICK, openViewInstance);
	document.getElementById(ERASE).addEventListener(CLICK, clear);
	document.getElementById(OPTREQUEST).addEventListener(CLICK, openOptionRequest);
	document.getElementById(INSTANCE).addEventListener(CLICK, openAddInstance);
});
  
//open optionAddInstance.html
function openAddInstance(){
	window.location.href= INSTANCEADDER;
}

//open optionRequest.html
function openOptionRequest(){
	window.location.href= OPTREQ;
}

//open optionViewInstance.html
function openViewInstance(){
	window.location.href= INSTANCEVIWER;
}

//erase saved data
function clear(){
	if (window.confirm(myBrowser.i18n.getMessage(ERASECONFIRM))) {
		//myBrowser.storage.sync.clear();
		myBrowser.storage.sync.remove(CREDENTIALSNAME);
		myBrowser.storage.sync.remove(NOB);
		myBrowser.storage.sync.remove(ADVANCEREQUIRED);
		initStorage();
		alert(myBrowser.i18n.getMessage(ERASEDONE));
	}
}