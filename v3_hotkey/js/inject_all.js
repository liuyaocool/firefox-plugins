let keyUpFunction = {};
document.addEventListener("keydown", function (ev) {
    switch(ev.key) {
        case 'Escape': 
            sendToBackground(GLOBAL.KEY.ESC, null); 
            keyUpFunction = {};
            break;
    }
    storageGet(GLOBAL.KEY_BIND_CACHE).then(res => {
        let keyBind = JSON.parse(res);
        let keyType = "";
        for1:
        for(var type in keyBind) {
            for(var k in keyBind[type]) {
                if (keyBind[type][k] !== ev[k]) {
                    continue for1;
                }
            }
            keyType = type;
            break;
        }
        // console.log(keyType);
        if (!keyType) {
            // console.log(keyBind)
            return;
        }
        switch(keyType) {
            case GLOBAL.FUNC.COPY: 
                sendToBackground(GLOBAL.KEY.DUPLICATE_TAB, null);
                break;
            case GLOBAL.FUNC.SEARCH: 
                sendToBackground(GLOBAL.KEY.SEARCH_PANEL, null);
                break;
            case GLOBAL.FUNC.SWITCH_NEXT: 
                sendToBackground(GLOBAL.KEY.SWITCH_PANEL_DOWN, null);
                keyUpFunction["Alt"] = () => sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
                break;
            case GLOBAL.FUNC.SWITCH_PREV: 
                sendToBackground(GLOBAL.KEY.SWITCH_PANEL_UP, null);
                keyUpFunction["Alt"] = () => sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
                break;
            default: return;
        }
    });
    // switch(ev.key) {
    //     case 'Escape': 
    //         sendToBackground(GLOBAL.KEY.ESC, null); 
    //         keyUpFunction = {};
    //         break;
    //     case 'o': 
    //         if (ev.altKey) {
    //             sendToBackground(GLOBAL.KEY.SEARCH_PANEL, null);
    //             break;
    //         }
    //         return;
    //     case 'd': 
    //         if (ev.ctrlKey) {
    //             sendToBackground(GLOBAL.KEY.DUPLICATE_TAB, null);
    //             break;
    //         }
    //         return;
    //     case 'Tab':
    //         if (ev.altKey) {
    //             sendToBackground(GLOBAL.KEY.SWITCH_PANEL_DOWN, null);
    //             keyUpFunction["Alt"] = () => sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
    //             break;
    //         }
    //         return;
    //     case '`':
    //         if (ev.altKey) {
    //             sendToBackground(GLOBAL.KEY.SWITCH_PANEL_UP, null);
    //             keyUpFunction["Alt"] = () => sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
    //             break;
    //         }
    //         return;
    //     default: return;
    // }
    ev.preventDefault();
});

document.addEventListener("keyup", function (ev) {
    if (keyUpFunction[ev.key]) {
        keyUpFunction[ev.key]();
        keyUpFunction[ev.key] = null;
    }
})

async function storageGet(k) {
    return (await browser.storage.local.get([k]))[k];
}

function sendToBackground(method, data) {
    browser.runtime.sendMessage({method: method, data: data}, {});
}

console.log('hotkey all injected');