browser.action.onClicked.addListener((tab) => {
    // browser.action.disable(tab.id);
    // console.log(tab.url);
    browser.tabs.sendMessage(tab.id, {method: 'show'});
});