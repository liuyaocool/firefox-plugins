/**
 * 触发翻译事件 并确定语言并向background发送消息
 */

document.onmouseup = function (e) {
    let sel = document.getSelection(), 
        sss, str = sel.toString(),
        onlyAnswer = true;
    if (!str || !(str = str.trim())) return;
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
    if (onlyAnswer) return;
    let lan = checkAndGetToLan(str);
    if (!lan) return;
    sendToBackground(GLOBAL.EVENT.SRC, {lan: lan, str: str});
}

function checkAndGetToLan(str) {
    if (str.indexOf('http://') == 0
        || str.indexOf('https://') == 0
    ) return '';
    let lanCount = {};
    for (let i = 0; i < str.length; i++) {
        GLOBAL.LAN_CHECK.forEach(la => {
            if (!la[1].test(str.charAt(i))) return;
            if (!lanCount[la[0]]) lanCount[la[0]] = 0;
            lanCount[la[0]]++;
        });
    }
    let maxLan;
    for(var k in lanCount) {
        if (!maxLan) {
            maxLan = k;
            continue;
        }
        maxLan = lanCount[k] > lanCount[maxLan] ? k : maxLan;
    }
    return maxLan;
}

console.log('translate inject_all success');