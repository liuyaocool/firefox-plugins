document.onmouseup = function (e) {
    sendToBackground('src', document.getSelection().toString());
}

function sendToBackground(type, data) {
    browser.runtime.sendMessage({type: type, data: data}, {})
        .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}
