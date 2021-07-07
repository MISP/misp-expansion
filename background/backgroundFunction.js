import {myBrowser, notify,notifyI18n} from '../utils/utils.js'
import {INFOTITLE,RESFAIL,WARNING,WRNMESSAGE, RETOURCHARIOT, EVENTNAME, NBOFELEMENT, NBOFOBJECT, NBOFEVENT, NBOFRES, EMPTYRESULT} from '../utils/lexicon.js'

//those const depend of the MISP response format///////////////////////// 
const REST = "/attributes/restSearch";
const OMIT = "omit";
const EVENTINFO = "event_info: ";
const EVENTID = "event_id: ";
const UUID = "UUID: ";
const ID = "ID: ";
const VIEW = "/events/view/";
/////////////////////////////////////////////////

//send a request
export function sendRequest(value,nbOfRes,page,url,authKey,mthd){
	let link = url + VIEW;
	let print = value+RETOURCHARIOT;
	fetch(url+ REST , {
		body: JSON.stringify({"returnFormat":"json","page":page,"value":value}),
		headers: {
			Accept: "application/json",
			Authorization: authKey,
			"Content-Type": "application/json"
		},
		method: mthd,
		credentials: OMIT
	})
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
							let uuid = formatedResponse.response.Attribute[i].uuid; //use multiple time 
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