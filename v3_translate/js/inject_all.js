document.onmouseup = function (e) {
    let sel = document.getSelection(), sss;
    let onlyAnswer = true;
    outfor:
    for (let i = 0; i < sel.rangeCount; i++) {
        sss = sel.getRangeAt(i).startContainer;
        do {
            if (GLOBAL.CONTAINER_ID == sss.id) {
                continue outfor;
            }
        } while((sss = sss.parentElement).tagName.toUpperCase() != 'BODY')
        // 有其他节点
        onlyAnswer = false;
        break;
    }
    if (onlyAnswer) {
        return;
    }
    sendToBackground('src', document.getSelection().toString());
}

function sendToBackground(type, data) {
    browser.runtime.sendMessage({type: type, data: data}, {})
        .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}
