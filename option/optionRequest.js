import {myBrowser} from '../utils/utils.js'
import {EMPTY, NORI, NBOFRES, ADVANCEDRES,DOMLOADED ,CLICK} from '../utils/lexicon.js'
import {NOB, ADVANCEREQUIRED} from '../background/backgroundStorage.js'

const MINDISPLAYEDELEMENT = 1;
const CHANGE = "change";
const LABELCHECKBOXID = "ar";


//wait loading document element
document.addEventListener(DOMLOADED, function () {
	//elements names define
	document.getElementById(NBOFRES).textContent = myBrowser.i18n.getMessage(NBOFRES);
	document.getElementById(LABELCHECKBOXID).textContent = myBrowser.i18n.getMessage(ADVANCEDRES);

	//if checked init info 
	myBrowser.storage.sync.get(ADVANCEREQUIRED, function(bool){
		if(bool[ADVANCEREQUIRED]){
			document.getElementById(ADVANCEDRES).checked = true;
		}else{
			document.getElementById(ADVANCEDRES).checked = false;
		}
	});
	
	//numberOfResDisplayed init info
	myBrowser.storage.sync.get(NOB, function(res){
		document.getElementById(NORI).placeholder = res[NOB];
	});
	
	//buttons actions
	document.getElementById(ADVANCEDRES).addEventListener(CLICK, checkCheckBox);
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

//checkbox function
function checkCheckBox(){
	if (document.getElementById(ADVANCEDRES).checked){
		myBrowser.storage.sync.set({[ADVANCEREQUIRED]:true},function(){});
	}else {
		myBrowser.storage.sync.set({[ADVANCEREQUIRED]:false},function(){});
	}		
}