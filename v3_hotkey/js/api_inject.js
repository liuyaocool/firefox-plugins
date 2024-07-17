function addMessageListener(listener) {
    browser.runtime.onMessage.addListener((req, sender, resp) => {
        listener(req, sender, resp);
    });
}

function sendToBackground(method, data) {
    browser.runtime.sendMessage({method: method, data: data}, {});
}