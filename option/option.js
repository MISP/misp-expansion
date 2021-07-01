import {myBrowser} from '../utils/utils.js'
import {NOB, CREDENTIALSNAME, initStorage} from '../background/backgroundStorage.js'
import {VIEW, INSTANCE, ERASE, ERASEDONE, ERASECONFIRM, OPTREQUEST} from '../utils/lexicon.js'

const INSTANCEADDER = './instance/optionAddInstance.html';
const INSTANCEVIWER = './instance/optionInstance.html';
const OPTREQ = 'optionRequest.html';

//elements names define
document.getElementById(VIEW).textContent = myBrowser.i18n.getMessage(VIEW);
document.getElementById(INSTANCE).textContent = myBrowser.i18n.getMessage(INSTANCE);
document.getElementById(OPTREQUEST).textContent = myBrowser.i18n.getMessage(OPTREQUEST);
document.getElementById(ERASE).textContent = myBrowser.i18n.getMessage(ERASE);

//buttons actions
instance.onclick= openAddInstance;
view.onclick= openViewInstance;
optionRequest.onclick= openOptionRequest;
erase.onclick = clear;

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
		initStorage();
		alert(myBrowser.i18n.getMessage(ERASEDONE));
	}
}