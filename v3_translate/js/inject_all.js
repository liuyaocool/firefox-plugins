/**
 * 触发翻译事件 并确定语言并向background发送消息
 */

document.onmouseup = function (e) {
    let sel = document.getSelection(), 
        sss, str = sel.toString(),
        // 选中只有 结果box
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

console.log('translate inject_all success');