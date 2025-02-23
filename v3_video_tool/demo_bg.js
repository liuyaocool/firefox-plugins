browser.contextMenus.create(
    {
      id: "ly_video_tool_VIDEO_CAPTURE",
      title: "ly video tool",
      contexts: ["video"],
    },
    (a, b, c) => {
        console.log(a);
        console.log(b);
        console.log(c);
    }
);

browser.contextMenus.onClicked.addListener((info, tab) => {
    let targetId = info.targetElementId;
    let method = info.menuItemId;
    sendMessageToTab(tab.id, method, {targetId});
    // menus.getTargetElement()
});

async function sendMessageToTab(tabId, method, data) {
    return await browser.tabs.sendMessage(tabId, {method: method, data: data});
}