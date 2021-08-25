import {myBrowser, SOUPE} from '../utils/utils.js'
import {EMPTY} from '../utils/lexicon.js'

const ADVANCEREQUIRED = "MISPExpansionAdvanceFetch";
const CREDENTIALSNAME = "MISPExpansionLoginTab";
const NOB = "MispNumberOfRes"
const URLFORFETCH = 0;
const KEY = 1;

function initStorage(){
	myBrowser.storage.sync.get(ADVANCEREQUIRED, function(res){
	if(res[ADVANCEREQUIRED] === undefined){
				myBrowser.storage.sync.set({[ADVANCEREQUIRED]:false},function(){});
			}
	});
	myBrowser.storage.sync.get(NOB, function(res){
	if(res[NOB] === undefined){
				myBrowser.storage.sync.set({[NOB]:1},function(){});
			}
	});
	myBrowser.storage.sync.get(CREDENTIALSNAME, function(data){
			if(data[CREDENTIALSNAME] === undefined){
				myBrowser.storage.sync.set({[CREDENTIALSNAME]:new Array()},function(){});
			}
	});
}

//unCBC init
function unconvert(data){
	const theCipher = decipher(SOUPE);
	data =  theCipher(data);
	return data;
}

//unCBC
function decipher (salt){
    const textToChars = text => text.split(EMPTY).map(c => c.charCodeAt(0));
		const applySaltToChar = code => textToChars(salt). reduce((a,b) => a ^ b, code);
			return encoded => encoded.match(/.{1,2}/g)
				.map(hex => parseInt(hex, 16))
				.map(applySaltToChar)
				.map(charCode => String.fromCharCode(charCode))
				.join(EMPTY);
}

export { initStorage, unconvert};
export { CREDENTIALSNAME, NOB, KEY, URLFORFETCH, ADVANCEREQUIRED};