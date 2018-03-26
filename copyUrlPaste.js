'use strict';

/**
Append the selected text to the end of the URL and redirect to the new address.
*/
function appendSuffixToUrl(tabUrl, TabId, suffixToAdd) {
  var newUrl = tabUrl + suffixToAdd;
  chrome.tabs.update(TabId, {url: newUrl});
}

/**
Verify that the URL and the selected text are strings
*/
function checkUrlAndSelectedTextAreValid(item) {
    console.assert(typeof item == 'string', 'url/selected text should be a string');
}

/**
Run verifications on the selected text and the URL.
Add '/' in case it is missing and will cause to invalid address, 
or remove '/' in case of duplication. 
*/
function checkSelectetTextValid(tabUrl, selectedText) {
    [tabUrl, selectedText].forEach(checkUrlAndSelectedTextAreValid);
    if(!selectedText.startsWith('/') && !tabUrl.endsWith('/')) {
        selectedText = '/' + selectedText;
    } else if (selectedText.startsWith('/') && tabUrl.endsWith('/')) {
        selectedText = selectedText.substr(1);
    }
    return selectedText;
}

/**
Redirect to the new address that composed from the URL and the selected text
*/
function redirectUrlToPasteSuffixContent(selectedText) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        selectedText = checkSelectetTextValid(tabs[0].url, selectedText);
        appendSuffixToUrl(tabs[0].url, tabs[0].id, selectedText);
    });
}

/**
Send message to the content script to fetch the marked text and redirect to
the new address
*/
function sendCopySelectedTextMessage(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var message = 'get_selected_text';
        chrome.tabs.sendMessage(tabs[0].id, {data: message}, function(data) {
            callback(data.selectedText);
        });
    });
}

function commandSelector(command) {
    if (command == "add-marked-text-to-url") {
        sendCopySelectedTextMessage(redirectUrlToPasteSuffixContent);
    }
}

chrome.commands.onCommand.addListener(commandSelector);