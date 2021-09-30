import {myBrowser, notify,notifyI18n} from '../utils/utils.js'
import {INFOTITLE,RESFAIL,WARNING,WRNMESSAGE, RETOURCHARIOT, EVENTNAME, NBOFELEMENT, NBOFOBJECT, NBOFEVENT, NBOFRES, EMPTYRESULT} from '../utils/lexicon.js'
import {CREDENTIALSNAME, KEY, URLFORFETCH, unconvert} from './backgroundStorage.js'

//those const depend of the MISP response format///////////////////////// 
const REST = "/attributes/restSearch";
const OMIT = "omit";
const EVENTINFO = "event_info: ";
const EVENTID = "event_id: ";
const UUID = "UUID: ";
const IDD = "ID: ";
const VIEW = "/events/view/";
const PATH = "./htmlAdvancedFetch/advancedRes.html";

/////////////////////////HTML ID & CLASS/////////////////////////////
const VALUE = "value";
const ID = "id";
const RESPONSE = "response";
const URL = "url";
const ERROR = "error";
const CLASS = "class";
const OBJECT =  "object";
const INFO = "info";
const EMPTY = "empty";
const INFOOBJECT = "infoObject";
const INFORES = "infoRes";
const ENAME = "evName";
const NBEV = "nbEv";
const NBELE = "nbEle";
const A = "resLink";
const EVINFO = "evInfo";
const EVID = "evID";
const EVUUID = "evuuid";
const EV_ID = "ev_ID";
//////////////////////////////////////////////////////////////////////



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
							print += IDD+formatedResponse.response.Attribute[i].id+RETOURCHARIOT;
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
	let newElement;
	let promises = [];
	//let newTab =  myBrowser.tabs.create({url: PATH},function(thisTab){
	wdw.document.body.onload = function(){
		newElement = wdw.document.createElement("div");
		newElement.setAttribute(ID, RESPONSE);
		wdw.document.body.appendChild(newElement);	
		wdw.document.getElementById(RESPONSE).style.display = "none";		
		newElement = wdw.document.createElement("h1");
		newElement.setAttribute(ID, VALUE);
		wdw.document.getElementById(RESPONSE).appendChild(newElement);
		wdw.document.getElementById(VALUE).textContent = value;	
		for(let i = 0; i < res[CREDENTIALSNAME].length;i++){ 
			let url = unconvert(res[CREDENTIALSNAME][i][URLFORFETCH]);
			let link = url + VIEW;
			newElement = wdw.document.createElement("div");
			newElement.setAttribute(ID, RESPONSE+""+i);
			wdw.document.getElementById(RESPONSE).appendChild(newElement);	
			newElement = wdw.document.createElement("h2");
			newElement.setAttribute(ID, URL+""+i);
			newElement.setAttribute(CLASS,URL);
			wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
			wdw.document.getElementById(URL+""+i).textContent = url;	
			promises.push(
			doFetch(url,page, value,unconvert(res[CREDENTIALSNAME][i][KEY]),mthd)
			.then(function(response) {
				if(!response.ok){
					newElement = wdw.document.createElement("h3");
					newElement.setAttribute(ID, ERROR+""+i);
					newElement.setAttribute(CLASS,ERROR);
					wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
					wdw.document.getElementById(ERROR+""+i).textContent = myBrowser.i18n.getMessage(WRNMESSAGE);	
				}else{
					response.json().then(function(formatedResponse) {
						let nbOfObject = formatedResponse.response.Attribute.length;//use mutliple time
						if(nbOfObject == 0){
							newElement = wdw.document.createElement("h3");
							newElement.setAttribute(ID, OBJECT+""+i);
							newElement.setAttribute(CLASS, EMPTY);
							wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
							wdw.document.getElementById(OBJECT+""+i).textContent = myBrowser.i18n.getMessage(EMPTYRESULT);
						}else{
							newElement = wdw.document.createElement("h4");
							newElement.setAttribute(ID, INFOOBJECT+""+i);
							newElement.setAttribute(CLASS, INFO);
							wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
							wdw.document.getElementById(INFOOBJECT+""+i).textContent = myBrowser.i18n.getMessage(NBOFOBJECT)+nbOfObject;
							newElement = wdw.document.createElement("h4");
							newElement.setAttribute(ID, INFORES+""+i);
							newElement.setAttribute(CLASS, INFO);
							wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
							wdw.document.getElementById(INFORES+""+i).textContent = myBrowser.i18n.getMessage(NBOFRES)+nbOfRes;
							for(let j = 0;j<nbOfRes;j++){
								if(formatedResponse.response.Attribute[j] != undefined){
									let uuid = formatedResponse.response.Attribute[i].Event.uuid; //use multiple time 
									let Currentlink = link+uuid;
									newElement = wdw.document.createElement("div");
									newElement.setAttribute(ID, i+""+OBJECT+""+j);
									newElement.setAttribute(CLASS, OBJECT);
									wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
									newElement = wdw.document.createElement("h3");
									newElement.setAttribute(ID,i+""+ENAME+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+ENAME+""+j).textContent = myBrowser.i18n.getMessage(EVENTNAME)+": "+(j+1);
									newElement = wdw.document.createElement("h4");
									newElement.setAttribute(ID,i+""+NBELE+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+NBELE+""+j).textContent = myBrowser.i18n.getMessage(NBOFELEMENT)+Object.keys(formatedResponse.response.Attribute[j]).length;
									newElement = wdw.document.createElement("h4");
									newElement.setAttribute(ID,i+""+NBEV+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+NBEV+""+j).textContent = myBrowser.i18n.getMessage(NBOFEVENT)+Object.keys(formatedResponse.response.Attribute[j].Event).length;
									newElement = wdw.document.createElement("a");
									newElement.setAttribute(ID,i+""+A+""+j);
									newElement.setAttribute('href', Currentlink);
									newElement.setAttribute('target', "_blank");
									newElement.setAttribute('rel',"noopener noreferrer");
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+A+""+j).textContent = Currentlink;
									newElement = wdw.document.createElement("p");
									newElement.setAttribute(ID,i+""+EVINFO+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+EVINFO+""+j).textContent = EVENTINFO+(formatedResponse.response.Attribute[i].Event.info);
									newElement = wdw.document.createElement("p");
									newElement.setAttribute(ID,i+""+EVUUID+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+EVUUID+""+j).textContent = UUID+uuid;
									newElement = wdw.document.createElement("p");
									newElement.setAttribute(ID,i+""+EVID+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+EVID+""+j).textContent = IDD+formatedResponse.response.Attribute[i].id;
									newElement = wdw.document.createElement("p");
									newElement.setAttribute(ID,i+""+EV_ID+""+j);
									wdw.document.getElementById(i+""+OBJECT+""+j).appendChild(newElement);
									wdw.document.getElementById(i+""+EV_ID+""+j).textContent = EVENTID+formatedResponse.response.Attribute[i].event_id;
								}
							}
						}
					});
				}
			}).catch(function(error) {
				newElement = wdw.document.createElement("h3");
				newElement.setAttribute(ID, ERROR+""+i);
				newElement.setAttribute(CLASS,ERROR);
				wdw.document.getElementById(RESPONSE+""+i).appendChild(newElement);
				wdw.document.getElementById(ERROR+""+i).textContent = myBrowser.i18n.getMessage(RESFAIL)+" "+error.message;
			}));
		};
		Promise.allSettled(promises)
		.then(function(){
			wdw.document.getElementById("before").remove();
			wdw.document.getElementById(RESPONSE).style.display = "block";
		});
    }
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