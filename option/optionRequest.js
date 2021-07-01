import {myBrowser} from '../utils/utils.js'
import {EMPTY, NORI, NBOFRES} from '../utils/lexicon.js'
import {NOB} from '../background/backgroundStorage.js'

const MINDISPLAYEDELEMENT = 1;
const CHANGE = "change";

document.getElementById(NBOFRES).textContent = myBrowser.i18n.getMessage(NBOFRES);

//numberOfResDisplayed init info
myBrowser.storage.sync.get(NOB, function(res){
	document.getElementById(NORI).placeholder = res[NOB];
});

//save on change
document.getElementById(NORI).addEventListener(CHANGE, (event) => {
	saveNOB();
});

//save number of displayed result from fetch request
//if nbRes empty then do nothing else save it too (unconverted for sure)
function saveNOB(){
	if(document.getElementById(NORI).value != EMPTY){
		if(document.getElementById(NORI).value < MINDISPLAYEDELEMENT ){
			myBrowser.storage.sync.set({[NOB]:MINDISPLAYEDELEMENT},function(){});
		}else{
			myBrowser.storage.sync.set({[NOB]:document.getElementById(NORI).value},function(){});
		}
	}	
}
