'use strict';

/**
Add listener for messages from the background script to return the marked text
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data == 'get_selected_text') {
        var selectedText = window.getSelection().toString();
        sendResponse({selectedText: selectedText});
    }
});