import {myBrowser, SOUPE} from '../../utils/utils.js'
import {SAVEBUTTON,LOGTEXT, PWDTEXT} from '../../utils/lexicon.js'
import {EMPTY, EMPTYCHAMP, IDSAV, LOGINPUT, PWDINPUT} from '../../utils/lexicon.js'
import {CREDENTIALSNAME} from '../../background/backgroundStorage.js'


//init object text with i18n in option.html page
document.getElementById(LOGTEXT).textContent = myBrowser.i18n.getMessage(LOGTEXT);
document.getElementById(PWDTEXT).textContent = myBrowser.i18n.getMessage(PWDTEXT);
document.getElementById(SAVEBUTTON).textContent = myBrowser.i18n.getMessage(SAVEBUTTON);

//buttons functions
saveButton.onclick = saveData;

const O = "0";

//check if instance fields aren't empty then save them after conversion
export function saveData(){
	if(document.getElementById(LOGINPUT).value === undefined || document.getElementById(LOGINPUT).value == EMPTY ||
		document.getElementById(PWDINPUT).value === undefined || document.getElementById(PWDINPUT).value == EMPTY){
		alert(myBrowser.i18n.getMessage(EMPTYCHAMP));
	}else{
		save(convert(document.getElementById(LOGINPUT).value),convert(document.getElementById(PWDINPUT).value));
	}
	//document.getElementById(LOGINPUT).value = EMPTY;
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


//convert input data as crypted data instead of row data 
function convert(data){
	const theCipher = cipher(SOUPE);
	data = theCipher(data);
	return data;
}

//crypto
function cipher(salt){
    //convertit le message en un tableau de nombre (code asci des chars du msg)
	const textToChars = text => text.split(EMPTY).map(c => c.charCodeAt(0));
    //converti en hexa avec un pas de -2
	const byteHex = n => (O + Number(n).toString(16)).substr(-2);
    //ajoute le salt au resultat
	const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
	//'merge' le tableau
    return text => text.split(EMPTY)
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join(EMPTY);
}