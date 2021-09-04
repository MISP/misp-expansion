import {myBrowser} from '../../utils/utils.js'
import {SAVEBUTTON,LOGTEXT, PWDTEXT} from '../../utils/lexicon.js'
import {EMPTY, EMPTYCHAMP, IDSAV, LOGINPUT, PWDINPUT, PROTOCOLID, CLICK,DOMLOADED} from '../../utils/lexicon.js'
import {CREDENTIALSNAME, convert} from '../../background/backgroundStorage.js'

//wait loading document element
document.addEventListener(DOMLOADED, function () {
	//init object text with i18n in option.html page
	document.getElementById(LOGTEXT).textContent = myBrowser.i18n.getMessage(LOGTEXT);
	document.getElementById(PWDTEXT).textContent = myBrowser.i18n.getMessage(PWDTEXT);
	document.getElementById(SAVEBUTTON).textContent = myBrowser.i18n.getMessage(SAVEBUTTON);

	//buttons functions
	document.getElementById(SAVEBUTTON).addEventListener(CLICK, saveData);
});

//check if instance fields aren't empty then save them after conversion
export function saveData(){
	if(document.getElementById(LOGINPUT).value === undefined || document.getElementById(LOGINPUT).value == EMPTY ||
		document.getElementById(PWDINPUT).value === undefined || document.getElementById(PWDINPUT).value == EMPTY){
		alert(myBrowser.i18n.getMessage(EMPTYCHAMP));
	}else{
		save(convert(document.getElementById(PROTOCOLID).value + document.getElementById(LOGINPUT).value),convert(document.getElementById(PWDINPUT).value));
	}
	document.getElementById(LOGINPUT).value = EMPTY;
	document.getElementById(PWDINPUT).value = EMPTY;
	
}

//save given data
//datas should be encrypted before saved
function save(el1,el2){
	myBrowser.storage.sync.get(CREDENTIALSNAME, function(res){
		res[CREDENTIALSNAME].push(new Array(el1,el2));
		myBrowser.storage.sync.set({[CREDENTIALSNAME]:res[CREDENTIALSNAME]},function(){});
	});
	alert(myBrowser.i18n.getMessage(IDSAV));
}