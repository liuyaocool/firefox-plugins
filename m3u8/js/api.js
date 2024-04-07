
function storageSet(map) {
    for(let k in map) {
        localStorage.setItem(k, map[k]);
    }
}

function storageGet(keys, getFunc) {
    let keyMap = {};
    for (let i = 0; i < keys.length; i++) {
        keyMap[keys[i]] = localStorage.getItem(keys[i]);
    }
    getFunc(keyMap);
}


function addListenerClickPluginButtonOpenPage(page) {
    browser.browserAction.onClicked.addListener((tab) => {
        browser.tabs.create({url: page});
    });
}

function addListenerOnMessage(listener) {
    browser.runtime.onMessage.addListener((request, sender, response) => {
        listener(request.type, request.data, sender, response);
    });
}

/**
 * @param {*} listener listener(e)
 * @param {*} options {urls: ["<all_urls>"]}
 * @param {*} types [ 'responseHeaders', 'blocking' ]
 */
function addListenerRequestOnHeadersReceived(listener, options, types) {
    browser.webRequest.onHeadersReceived.addListener(listener, options, types);
}

function sendToTab(tabId, type, data) {
    browser.tabs.sendMessage(tabId, { type: type, data: data });
}

async function getActiveTab(getFunc) {
    browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => getFunc(tabs));
}

async function sendToActiveTab(type, data) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, type, data);
}

function sendToBackground(type, data) {
    browser.runtime.sendMessage({type: type, data: data}, {})
        .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}