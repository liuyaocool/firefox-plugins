console.log('tab switch init');

browser.commands.onCommand.addListener(async (command) => {
    const curTab = await getActiveTab();
    switch(command) {
        case GLOBAL.COMMAND.PREV_TAB_LAST:
        case GLOBAL.COMMAND.NEXT_TAB_LAST:
        case GLOBAL.COMMAND.PREV_TAB_SITE:
        case GLOBAL.COMMAND.NEXT_TAB_SITE:
        case GLOBAL.COMMAND.SEARCH_TAB:
            await storageSet(GLOBAL.CACHE_KEY.COMAND, command);
            browser.action.openPopup().catch(e => console.log(e));
            break;
        case GLOBAL.COMMAND.PREV_TAB: gotoNextTab(curTab, -1); break;
        case GLOBAL.COMMAND.NEXT_TAB: gotoNextTab(curTab,  1); break;
        case GLOBAL.COMMAND.DUPLICATE_TAB: browser.tabs.duplicate(curTab.id); break;
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