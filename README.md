# MISP Expansion (browser extension)

MISP browser extension (Firefox and Chrome) to lookup selected text on one or more MISP instances.

MISP browser expansion is an open source extension for Firefox and Chrome to simplify the use of MISP. It allows users to quickly check if something on the page is a known event by selecting and then right clicking on the web page text.

# Features

- An event 'getter'

  Select text, link (or nothing for the page url) then use the "search with MISP" menu to see if there is an event associated with the selected data.

## Requirements

- Chrome browser or Firefox (>= 55) browser
- At least one profile with an authentication key for MISP

## Install

- **CHROME** 

  Open chrome browser, go to the option menu (upper right by default) select 'more tools' menu then the extension one. Activate developer Mode if it is off (off by default) then 'load unactivated extension' and as final step, select the file named "manifest.json" from the extension folder.

- **FIREFOX**

  Open Firefox browser, go to "about:debugging#/runtime/this-firefox" then 'load a temporary add-on' and as final step, select the file named "manifest.json" from the extension folder.

## Use

​	Now you need to save at least one MISP profile into this extension. Go to the extension option menu by clicking the extension icon (upper right by default) or with the option link (same way than the install process) from Chrome or at "about:addons" from Firefox. You have now four buttons

- clear all : Clear the extension storage, same as if you uninstall the extension but way faster (please keep in mind that firefox may remove the temporary extension from your browser but the storage stand still).
- Request Option : work in progress, this is where you can set the option request as the number of element you want in fetch responses.
- Instance Viewer : You can check (and delete) here all of the instance you have saved and  if they are OK or not (authKey are displayed as the way they are displayed in the profile section of MISP account).
- Instance Adder : there is where you add your profiles, just fill the fields. The browser.storage is called here (not window.storage) so storage is unique too the extension but keep in mind the storage is not encrypted (this extension does for the credentials but it isn't the safest thing ever) so you must register the authKey, you **MUST NOT REGISTER YOUR MISP ACCOUNT** (it won't work anyway).



If you have at least one valid instance, you can now search element with MISP, The response is a notification from your browser so you **should allow notifications**.

# License

The software is free software/open source under 2-clause BSD license.
