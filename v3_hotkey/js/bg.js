
browser.action.onClicked.addListener((tab) => {
    browser.tabs.create({url: "config.html"});
});

addMessageListener((req, sender, resp) => {
    if (GLOBAL.KEY[req.method]) {
        // forwardToActiveTab(req);
        sendMessageToTab(sender.tab.id, req);
        return;
    }
    switch (req.method) {
        case GLOBAL.METHOD.TABS_HIS: 
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