
browser.action.onClicked.addListener((tab) => {
    // browser.action.disable(tab.id);
    // console.log(tab.url);
    // browser.tabs.sendMessage(tab.id, {method: 'show'});
    
});

addMessageListener((req, sender, resp) => {
    switch (req.method) {
        case GLOBAL.METHOD.TABS: 
            getTabs(req.data).then(res => {
                req.data = res;
                sendMessageToTab(sender.tab.id, req)
                // resp(req); ??
            });
            break;
        case GLOBAL.METHOD.GOTO_TAB: gotoTab(req.data); break;
        default: break;
    }
});