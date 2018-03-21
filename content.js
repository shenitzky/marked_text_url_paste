'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data == 'get_selected_text') {
        var selectedText = window.getSelection().toString();
        sendResponse({selectedText: selectedText});
    }
});