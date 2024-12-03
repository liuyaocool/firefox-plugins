browser.runtime.onMessage.addListener((req, sender, resp) => {
    switch (req.type) {
        case 'src': forwardToActiveTab(req); break;
        default: break;
    }
})

async function forwardToActiveTab(message) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, message);
}
