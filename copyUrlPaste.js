'use strict';

function appendSuffixToUrl(tabUrl, TabId, suffixToAdd) {
  var newUrl = tabUrl + suffixToAdd;
  chrome.tabs.update(TabId, {url: newUrl});
}

function checkUrlAndSelectedTextAreValid(item) {
    console.assert(typeof item == 'string', 'url/selected text should be a string');
}

function checkSelectetTextValid(tabUrl, selectedText) {
    [tabUrl, selectedText].forEach(checkUrlAndSelectedTextAreValid);
    if(!selectedText.startsWith('/') && !tabUrl.endsWith('/')) {
        selectedText = '/' + selectedText;
    } else if (selectedText.startsWith('/') && tabUrl.endsWith('/')) {
        selectedText = selectedText.substr(1);
    }
    return selectedText;
}


function redirectUrlToPasteSuffixContent(selectedText) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        selectedText = checkSelectetTextValid(tabs[0].url, selectedText);
        appendSuffixToUrl(tabs[0].url, tabs[0].id, selectedText);
    });
}

function sendCopySelectedTextMessage() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var message = 'get_selected_text';
        chrome.tabs.sendMessage(tabs[0].id, {data: message}, function(data) {
            redirectUrlToPasteSuffixContent(data.selectedText);
        });
    });
}

chrome.commands.onCommand.addListener(sendCopySelectedTextMessage);