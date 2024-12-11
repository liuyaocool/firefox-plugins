let keyUpFunction = () => {};
let keyUpHot;
document.addEventListener("keydown", async function (ev) {
    switch(ev.key) {
        case 'Escape': 
            sendToBackground(GLOBAL.KEY.ESC, null);
            keyUpFunction = null;
            break;
    }
    let keyBind = JSON.parse(await storageGet(GLOBAL.KEY_BIND_CACHE));
    let keyType = "", keyCountObj = {}, keyCount = 0;
    for1:
    for(var k1 in keyBind) {
        for(var k2 in keyBind[k1]) {
            if (!keyCountObj[k1]) 
                keyCountObj[k1] = [0, 0];
            keyCountObj[k1][0]++;
            if (keyBind[k1][k2] === ev[k2]) {
                keyCountObj[k1][1]++;
            }
        }
    }
    for(var k in keyCountObj) {
        if (keyCountObj[k][1] >= keyCountObj[k][0] && keyCountObj[k][1] > keyCount) {
            keyType = k;
            keyCount = keyCountObj[k][1];
        }
    }
    // console.log(keyType);
    if (!keyType) {
        // console.log(keyBind)
        return;
    }
    keyUpHot = keyBind[keyType];
    switch(keyType) {
        case GLOBAL.FUNC.COPY: 
            sendToBackground(GLOBAL.KEY.DUPLICATE_TAB, null);
            break;
        case GLOBAL.FUNC.SEARCH: 
            sendToBackground(GLOBAL.KEY.SEARCH_PANEL, null);
            break;
        case GLOBAL.FUNC.SWITCH_NEXT: 
            sendToBackground(GLOBAL.KEY.SWITCH_PANEL_DOWN, null);
            keyUpFunction = gotoTab;
            break;
        case GLOBAL.FUNC.SWITCH_PREV: 
            sendToBackground(GLOBAL.KEY.SWITCH_PANEL_UP, null);
            keyUpFunction = gotoTab;
            break;
        default: return;
    }
    ev.preventDefault();
});

document.addEventListener("keyup", function (ev) {
    hotKeyUpHandle(ev);
})

function hotKeyUpHandle(ev) {
    if (!keyUpFunction) {
        return;
    }
    console.log(keyUpHot)
    for(var k in keyUpHot) {
        console.log(`${k} ${ev[k]}`);
        if (false !== keyUpHot[k] && keyUpHot[k] == ev[k]) {
            return;
        }
    }
    keyUpFunction();
    keyUpFunction = null;
}

function gotoTab() {
    sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
}

async function storageGet(k) {
    return (await browser.storage.local.get([k]))[k];
}

function sendToBackground(method, data) {
    browser.runtime.sendMessage({method: method, data: data}, {});
}

console.log('hotkey all injected');