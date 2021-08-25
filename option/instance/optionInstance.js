import {myBrowser} from '../../utils/utils.js'
import {LOGTEXT, PWDTEXT, CAP, VIEW, TABLE, EMPTY, NBOFINSTANCE, DOMLOADED, VALUE, MDP, URL, INSTANCE} from '../../utils/lexicon.js'
import {CREDENTIALSNAME, URLFORFETCH, KEY} from '../../background/backgroundStorage.js'
import {unconvert} from '../../background/backgroundStorage.js'

const ERROR = "error";
const NBOFELEMENTTOREMOVE = 1;
const GREEN = "#32CD32";
const RED = "#FF0000";
const CHECK = "/servers/getVersion";
const GET = "GET";
const OMIT = "omit";
const BUTTON = "button";


//wait loading document element
document.addEventListener(DOMLOADED, function () {
	//init object text with i18n in option.html page
	document.getElementById(CAP).textContent = myBrowser.i18n.getMessage(VIEW);
	document.getElementById(LOGTEXT).textContent = myBrowser.i18n.getMessage(LOGTEXT);
	document.getElementById(PWDTEXT).textContent = myBrowser.i18n.getMessage(PWDTEXT);
	
	//count and print element of instance
	//also define the number of element of table inside html page
	myBrowser.storage.sync.get(CREDENTIALSNAME, function(res){
		if(res[CREDENTIALSNAME] !== undefined){
			document.getElementById(NBOFINSTANCE).textContent =  "MISP Instance :" +res[CREDENTIALSNAME].length;
			createTable(res[CREDENTIALSNAME]);
		}
	});
});

//init each element (number of instance in storage) into the option table
function createTable(data){
	for(let i = 0; i < data.length;i++){ 
		let j = i+1;
		let newRow = document.createElement('tr');
		checkConnection(data,newRow,i,j);
	}
}

//remove an instance from storage
function removeElement(element, tab, index){
	document.getElementById(TABLE).removeChild(element.parentNode);
	if(tab.length-1 <= 0){
		myBrowser.storage.sync.set({[CREDENTIALSNAME]:new Array()},function(){});
	}else{
		tab.splice(index, NBOFELEMENTTOREMOVE);
		myBrowser.storage.sync.set({[CREDENTIALSNAME]:tab},function(){});
	}
}

//print key at MISP format
function sub4(message){
	let part2 = message.slice(message.length - 4)
	let part1 = message.slice(0,4);
	let star = "";
	for(let i =0; i <= message.length -4; i++){
		star = star+"*";
	}
	return 	part1 + star + part2;
}

//check if login are correct or not
function checkConnection(element, htmlElement,i,j){
	fetch(unconvert(element[i][URLFORFETCH]) + CHECK , {
		headers: {
			Accept: "application/json",
			Authorization: unconvert(element[i][KEY]),
			"Content-Type": "application/json"
		},
		method: GET,
		credentials: OMIT
	})
	.then(function(response) {
		if(!response.ok){
			appendElement(htmlElement,element,ERROR,i,j);
			htmlElement.style.backgroundColor = RED;
		}else{
			response.json().then(function(formatedResponse) {
				if(formatedResponse.version != undefined){
					appendElement(htmlElement,element,formatedResponse.version,i,j);
				}else{
					//this case should not happen 
					appendElement(htmlElement,element,EMPTY,i,j);
				}
				htmlElement.style.backgroundColor = GREEN;
			});
		}
	})
	.catch(function(error) {
		appendElement(htmlElement,element,ERROR,i,j);
		htmlElement.style.backgroundColor = RED;
	});
}

//set and append the storage instance element to the current document
function appendElement(htmlElement,element,val,i,j){
	htmlElement.innerHTML = '<td id="'+INSTANCE+j+'"></td><td id="'+VALUE+j+'"></td><td id="'+URL+j+'"></td><td id = "'+MDP+j+'"></td><td><input type="button" style="width:100%; height:100%;" id="'+BUTTON+j+'"></td>';
	document.getElementById(TABLE).appendChild(htmlElement);
	document.getElementById(INSTANCE+j).textContent = INSTANCE +' '+j;	
	document.getElementById(VALUE+j).textContent = val;	
	document.getElementById(URL+j).textContent = unconvert(element[i][URLFORFETCH]);	
	document.getElementById(MDP+j).textContent = sub4(unconvert(element[i][KEY]));	
	document.getElementById(BUTTON+j).value = "X";	
	document.getElementById(BUTTON+j).onclick = function(){removeElement(document.getElementById(BUTTON+j).parentNode,element,i)};
}