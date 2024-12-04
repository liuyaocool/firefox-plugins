/**
 * 触发翻译事件 并确定语言并向background发送消息
 * @param {*} e 
 * @returns 
 */
document.onmouseup = function (e) {
    let str = document.getSelection().toString();
    if (!str || !(str = str.trim())) {
        return;
    }
    let lan = checkAndGetLan(str);
    if (!lan) {
        return;
    }
    sendToBackground(GLOBAL.EVENT.SRC, {lan: lan, str: str});
}

function checkAndGetLan(str) {
    if (!str || !str.trim()) return '';
    const lanPat = GLOBAL.LAN_PAT;
    if (str.indexOf('http://') == 0
        || str.indexOf('https://') == 0
    ) return '';
    for (let i = 0; i < str.length; i++)
        for (let lan in lanPat)
            if (lanPat[lan][0].test(str.charAt(i)))
                return lanPat[lan][1];
    return '';
}
