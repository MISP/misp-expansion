import {myBrowser} from '../../utils/utils.js'
import {LOGTEXT, PWDTEXT, CAP, VIEW, TABLE, EMPTY} from '../../utils/lexicon.js'
import {CREDENTIALSNAME, URLFORFETCH, KEY} from '../../background/backgroundStorage.js'
import {unconvert} from '../../background/backgroundStorage.js'
import {urlChecker} from '../../utils/utils.js'

const ERROR = "error";
const INSTANCE = "Instance";
const NBOFELEMENTTOREMOVE = 1;
const GREEN = "#32CD32";
const RED = "#FF0000";
const CHECK = "/servers/getVersion";
const GET = "GET";
const OMIT = "omit";

//init object text with i18n in option.html page
document.getElementById(CAP).textContent = myBrowser.i18n.getMessage(VIEW);
document.getElementById(LOGTEXT).textContent = myBrowser.i18n.getMessage(LOGTEXT);
document.getElementById(PWDTEXT).textContent = myBrowser.i18n.getMessage(PWDTEXT);

//count and print element of instance
myBrowser.storage.sync.get(CREDENTIALSNAME, function(res){
	if(res[CREDENTIALSNAME] !== undefined){
		createTable(res[CREDENTIALSNAME]);
	}
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
function removeElement(element, data, index){
	document.getElementById(TABLE).removeChild(element.parentNode);
	if(data.length-1 <= 0){
		myBrowser.storage.sync.set({[CREDENTIALSNAME]:new Array()},function(){});
	}else{
		data.splice(index, NBOFELEMENTTOREMOVE);
		myBrowser.storage.sync.set({[CREDENTIALSNAME]:data},function(){});
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
	fetch(urlChecker(unconvert(element[i][URLFORFETCH])) + CHECK , {
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
	htmlElement.innerHTML = '<td>'+ INSTANCE +' '+j+'</td><td>'+ val +'</td><td>'+ unconvert(element[i][URLFORFETCH]) +'</td><td>'+ sub4(unconvert(element[i][KEY])) +'</td><td><input type="button" style="width:100%; height:100%;" id="'+j+'" value="X"></td>';
	document.getElementById(TABLE).appendChild(htmlElement);
	document.getElementById(j).onclick = function(){removeElement(document.getElementById(j).parentNode,element,i)};		
}