let keyUpFunction = () => {}, keyUpHot, keyBind,
    cacheLoad = () => storageGet(GLOBAL.KEY_BIND_CACHE).then(res => keyBind = JSON.parse(res));

cacheLoad();
addMessageListener((method, data, sender, resp) => {
    switch (method) {
        case GLOBAL.METHOD.CACHE_LOAD: 
            console.log("cache upload");
            cacheLoad();
            break;
    }
});

document.addEventListener("keydown", function (ev) {
    switch(ev.key) {
        case 'Escape': 
            sendToBackground(GLOBAL.KEY.ESC, null);
            keyUpFunction = null;
            break;
    }
    let keyType = "", keyCountObj = {}, keyCount = 0;
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
    if (!keyType) return;
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
    for(var k in keyUpHot) {
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

console.log('hotkey all injected');