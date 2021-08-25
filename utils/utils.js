const SOUPE = "U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=";
const URL = "./resources/icon48.png";

const TYPE = "basic";
const UNDEF = "undefined";

const myBrowser = findBrowser();

//check if chrome or firefox is used
function findBrowser(){
	if( typeof InstallTrigger !== UNDEF){
		return window.browser;
	}else{
		return window.chrome;
	}
} 


export {myBrowser,SOUPE};
export {notifyI18n, notify};

////////////////////////////////////////////////////////////////////////////////////////

//create an notification with the specified message,title,icon
function notify(title,message) {
  myBrowser.notifications.create({
    "type": TYPE,
    "iconUrl": myBrowser.runtime.getURL(URL),
    "title":title,
    "message": message
  });
}

//notify with i18n
function notifyI18n(title,message){
	notify(myBrowser.i18n.getMessage(title),myBrowser.i18n.getMessage(message));
}