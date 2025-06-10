
browser.action.onClicked.addListener((tab) => {
    browser.tabs.create({url: "config.html"});
});
console.log('hotkey init');
storageGet(GLOBAL.KEY_BIND_CACHE).then(c => {
    if (c) return;
    console.log('cache init');
    storageSet(GLOBAL.KEY_BIND_CACHE, 
        '{"COPY":{"code":"KeyD","ctrlKey":true},"SWITCH_PREV":{"code":"Backquote","altKey":true},"SWITCH_NEXT":{"code":"Tab","altKey":true},"SEARCH":{"code":"KeyO","altKey":true}}'
    );
});

browser.menus.create(
    {
      id: "ly_hotkey_copy",
      title: "Copy",
      contexts: ["selection"],
    }, () => {
    }
);

browser.menus.onClicked.addListener((info, tab) => {
    let text = info.selectionText;
    switch(info.menuItemId) {
        case "ly_hotkey_copy":
            navigator.clipboard.writeText(text)
            .catch((e) => {
                console.error(e);
                console.log(text);
            });
            break;
    }
});

addMessageListener((method, data, sender, resp) => {
    if (GLOBAL.KEY[method]) {
        sendMessageToTab(sender.tab.id, method, data);
        return;
    }
    switch (method) {
        case GLOBAL.METHOD.CACHE_LOAD:
            getTabsAll().then(tabs => {
                tabs.forEach(tb => {
                    sendMessageToTab(tb.id, method);
                });
            });
            break;
        case GLOBAL.METHOD.TABS_HIS: 
        case GLOBAL.METHOD.TABS: 
            getTabs().then(res => {
                sendMessageToTab(sender.tab.id, method, res);
                // resp(req); ??
            });
            break;
        case GLOBAL.METHOD.GOTO_TAB: gotoTab(data); break;
        default: break;
    }
});

async function getTabs() {
    return (await browser.tabs.query({
        "lastFocusedWindow": true
    })).filter(tb => 
        !tb.url.startsWith('moz-extension://') && !tb.url.startsWith('about:')
    );
}

async function getTabsAll() {
    return (await browser.tabs.query({})).filter(tb => 
        !tb.url.startsWith('moz-extension://') && !tb.url.startsWith('about:')
    );
}

function gotoTab(tabId) {
    browser.tabs.update(tabId, { active: true });
}


async function forwardToActiveTab(message) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, message);
}