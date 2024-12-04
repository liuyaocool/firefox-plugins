function sendToBackground(event, data) {
    browser.runtime.sendMessage({event: event, data: data}, {})
        .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}

function addMessageListener(listener) {
    browser.runtime.onMessage.addListener(listener);
}

async function sendToActiveTab(event, data) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, {event: event, data: data});
}

function uuid() {
    return crypto.randomUUID().replaceAll('-', '');
}