import {myBrowser} from '../utils/utils.js'
import {EMPTY} from '../utils/lexicon.js'

const ADVANCEREQUIRED = "MISPExpansionAdvanceFetch";
const CREDENTIALSNAME = "MISPExpansionLoginTab";
const NOB = "MispNumberOfRes"
const URLFORFETCH = 0;
const KEY = 1;

const O ="0";

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
	const theDCipher = decipher("qsdsdlkgjslkfgjfgsfsfqdfxhsgjyiuyoupukjqrG");
	data =  theDCipher(data);
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

//convert input data as crypted data instead of row data 
function convert(data){
	const theCCipher = cipher("qsdsdlkgjslkfgjfgsfsfqdfxhsgjyiuyoupukjqrG");
	data = theCCipher(data);
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

export { initStorage, unconvert, convert};
export { CREDENTIALSNAME, NOB, KEY, URLFORFETCH, ADVANCEREQUIRED};