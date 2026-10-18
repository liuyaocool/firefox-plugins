console.log('tab switch init');

// 如果回调函数async, 则不能用resp()
addMessageListener((method, data, sender, resp) => {
    switch (method) {
        case GLOBAL.EVENT.GOTO_TAB: gotoTab(data); break;
        case "test": 
            browser.tabs.query({"lastFocusedWindow": true}).then(res => console.log(res));
            break;
        default: break;
    }
});

browser.commands.onCommand.addListener(async (command) => {
    const curTab = await getActiveTab();
    switch(command) {
        case GLOBAL.COMMAND.PREV_TAB_LAST:
        case GLOBAL.COMMAND.NEXT_TAB_LAST:
        case GLOBAL.COMMAND.SEARCH_TAB:
            await storageSet(GLOBAL.CACHE_KEY.COMAND, command);
            browser.action.openPopup().catch(e => console.log(e));
            break;
        case "prev_tab": gotoNextTab(curTab, -1); break;
        case "next_tab": gotoNextTab(curTab,  1); break;
        case "duplicate_tab": browser.tabs.duplicate(currentTab.id); break;
    }
});

browser.menus.create(
    {
        id: "ly_hotkey_copy",
        title: "Copy",
        contexts: ["selection"],
    }, () => {}
);

browser.menus.onClicked.addListener((info, tab) => {
    let text = info.selectionText;
    switch(info.menuItemId) {
        case "ly_hotkey_copy":
            navigator.clipboard.writeText(text);
            break;
    }
});

async function gotoNextTab(curTab, offset) {
    const winTabs = await browser.tabs.query({ windowId: curTab.windowId });
    if (winTabs.length < 2) return;
    let index = (curTab.index + offset + winTabs.length) % winTabs.length;
    gotoTab(winTabs[index].id);
}

function gotoTab(tabId) {
    browser.tabs.update(tabId, { active: true });
}