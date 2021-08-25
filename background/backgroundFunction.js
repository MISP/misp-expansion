import {myBrowser, notify,notifyI18n} from '../utils/utils.js'
import {INFOTITLE,RESFAIL,WARNING,WRNMESSAGE, RETOURCHARIOT, EVENTNAME, NBOFELEMENT, NBOFOBJECT, NBOFEVENT, NBOFRES, EMPTYRESULT} from '../utils/lexicon.js'
import {CREDENTIALSNAME, KEY, URLFORFETCH, unconvert} from './backgroundStorage.js'

//those const depend of the MISP response format///////////////////////// 
const REST = "/attributes/restSearch";
const OMIT = "omit";
const EVENTINFO = "event_info: ";
const EVENTID = "event_id: ";
const UUID = "UUID: ";
const ID = "ID: ";
const VIEW = "/events/view/";
const PATH = "./htmlAdvancedFetch/advancedRes.html";
/////////////////////////////////////////////////

//send a request, return notification
export function sendRequest(value,nbOfRes,page,url,authKey,mthd){
	let link = url + VIEW;
	let print = value+RETOURCHARIOT;
	doFetch(url,page, value,authKey,mthd)
	.then(function(response) {
		if(!response.ok){
			notifyI18n(WARNING, WRNMESSAGE);
		}else{
			response.json().then(function(formatedResponse) {
				let nbOfObject = formatedResponse.response.Attribute.length;//use mutliple time
				if(nbOfObject == 0){
					print += myBrowser.i18n.getMessage(EMPTYRESULT)+RETOURCHARIOT;
				}else{
					print += myBrowser.i18n.getMessage(NBOFOBJECT)+nbOfObject+RETOURCHARIOT;
					print += myBrowser.i18n.getMessage(NBOFRES)+nbOfRes+RETOURCHARIOT;
					for(let i = 0;i<nbOfRes;i++){
						if(formatedResponse.response.Attribute[i] != undefined){
							print += myBrowser.i18n.getMessage(EVENTNAME)+(i+1)+RETOURCHARIOT;
							let uuid = formatedResponse.response.Attribute[i].Event.uuid; //use multiple time 
							print += EVENTINFO+(formatedResponse.response.Attribute[i].Event.info)+RETOURCHARIOT;
							print += link+uuid+RETOURCHARIOT;
							print += myBrowser.i18n.getMessage(NBOFELEMENT)+Object.keys(formatedResponse.response.Attribute[i]).length+RETOURCHARIOT;
							print += myBrowser.i18n.getMessage(NBOFEVENT)+Object.keys(formatedResponse.response.Attribute[i].Event).length+RETOURCHARIOT;
							print += ID+formatedResponse.response.Attribute[i].id+RETOURCHARIOT;
							print += EVENTID+formatedResponse.response.Attribute[i].event_id+RETOURCHARIOT;
							print += UUID+uuid+RETOURCHARIOT;	
						}
					}
				}
				notify(url,print);	
			});
		}
	})
	.catch(function(error) {
		notify(url,myBrowser.i18n.getMessage(RESFAIL)+" "+error.message);
	});
}

//send a request, return new html page
export function sendRequestAdvanced(value,nbOfRes,page,res,mthd){
	let wdw = window.open(PATH,"_blank", "width=300,height=400,status=no, menubar=false,scrollbars=yes,resizable=yes");	
	let isWrong = false; //avoid double url (can't change the content = url to keep a nice result)
	let content = "<h1> Value: "+value+"</h1>";
	let promises = [];
	res[CREDENTIALSNAME].forEach(function(element){ 
		let url = unconvert(element[URLFORFETCH]);
		let link = url + VIEW;
		promises.push(doFetch(url,page, value,unconvert(element[KEY]),mthd)
		.then(function(response) {
			if(!response.ok){
				content += "<h2> Instance: "+url+"</h2>";
				content += "<h3>"+myBrowser.i18n.getMessage(WRNMESSAGE)+"</h3>";
				isWrong = true;
			}else{
				isWrong = false;
				return response.json();
			}
		}).catch(function(error) {
			content += "<h2> Instance: "+url+"</h2>";
			content += "<h3>"+myBrowser.i18n.getMessage(RESFAIL)+" "+error.message+"</h3>";
			isWrong = true;
		})
		.then(function(formatedResponse) {
			if(!isWrong){
				content += "<h2> Instance: "+url+"</h2>";
				let nbOfObject = formatedResponse.response.Attribute.length;//use mutliple time
				if(nbOfObject == 0){
					content += "<h3>"+ myBrowser.i18n.getMessage(EMPTYRESULT)+"<h3>";
				}else{
					content += "<h4>"+myBrowser.i18n.getMessage(NBOFOBJECT)+nbOfObject+"</h4>";
					content += "<h4>"+myBrowser.i18n.getMessage(NBOFRES)+nbOfRes+"</h4>";
					for(let i = 0;i<nbOfRes;i++){
						if(formatedResponse.response.Attribute[i] != undefined){
							let uuid = formatedResponse.response.Attribute[i].Event.uuid; //use multiple time 
							link = link+uuid;
							content += "<h3>"+myBrowser.i18n.getMessage(EVENTNAME)+": "+(i+1)+"</h3>";
							content += "<b>"+myBrowser.i18n.getMessage(NBOFELEMENT)+Object.keys(formatedResponse.response.Attribute[i]).length+"</b><br>";
							content += "<b>"+myBrowser.i18n.getMessage(NBOFEVENT)+Object.keys(formatedResponse.response.Attribute[i].Event).length+"</b><br>";
							content += "<a href="+link+" target=\"_blank\" rel=\"noopener noreferrer\">"+link+"</a>";
							content += "<p>"+EVENTINFO+(formatedResponse.response.Attribute[i].Event.info)+"</p>";
							content += "<p>"+UUID+uuid+"</p>";
							content += "<p>"+ID+formatedResponse.response.Attribute[i].id+"</p>";
							content += "<p>"+EVENTID+formatedResponse.response.Attribute[i].event_id+"</p>";
							content += "<br>";
						}
					}	
				}
			}
		}));
	});
	Promise.allSettled(promises)
	.then(function(){
		wdw.document.getElementById("before").remove();
		wdw.document.getElementById("response").innerHTML = content;
		//wdw.document.styleSheets[0].cssRules[0].style.backgroundImage= myBrowser.runtime.getURL("resources/MISPBackground.png");
	})
}

//fetch function used 
function doFetch(url,page, value,authKey,mthd){
	return fetch(url+ REST , {
		body: JSON.stringify({"returnFormat":"json","page":page,"value":value}),
		headers: {
			Accept: "application/json",
			Authorization: authKey,
			"Content-Type": "application/json"
		},
		method: mthd,
		credentials: OMIT
	});	
}