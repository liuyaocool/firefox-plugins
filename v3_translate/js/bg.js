addMessageListener((req, sender, resp) => {
    switch (req.event) {
        case GLOBAL.EVENT.SRC: translate(req.data.lan, req.data.str); break;
        default: break;
    }
});

browser.menus.create(
    {
      id: "ly_translate_translate",
      title: "Translate",
      contexts: ["selection"],
    }, () => {

    }
);

browser.menus.onClicked.addListener((info, tab) => {
    let text = info.selectionText;
    switch(info.menuItemId) {
        case "ly_translate_translate":
            let lan = checkAndGetToLan(text);
            if (!lan) return;
            translate(lan, text);
            break;
    }
});

function translate(lan, str) {
    sendToActiveTab(GLOBAL.EVENT.SRC, {lan: lan, str: str});
        switch (lan) {
            case GLOBAL.LAN.EN: lan = 'en'; break;
            case GLOBAL.LAN.CH: lan = 'zh-CN'; break;
            default: return;
        }
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let trans = '';
                if (xhr.status >= 200 && xhr.status < 300) {
                    let i, word, a = [], list, res = JSON.parse(xhr.response);
                    (list = res.sentences) && list.forEach(e => trans += e.trans || '');
                    a.push(trans);
                    trans = `<p>${trans}</p>`;
                    // console.log(res.dict);
                    (list = res.dict) && list.forEach(e => {
                        trans += `<p>${e.pos}:`;
                        for (let j = 0; j < e.entry.length; j++) {
                            if (a.indexOf(word = e.entry[j].word) >= 0) continue;
                            trans += `<span>${word}</span>`;
                            a.push(word);
                        }
                        trans += '</p>';
                    });
                    let words = [];
                    for (list = res.alternative_translations, i = 0; list && i < list.length; i++) {
                        for (let j = 0; j < list[i].alternative.length; j++) {
                            (words[j] || (words[j] = [])).push(list[i].alternative[j].word_postproc);
                        }
                    }
                    trans += `<p>`;
                    words.forEach(e => {
                        if (a.indexOf(word = e.join('')) >= 0) return;
                        trans += `<span>${word}</span>`
                        a.push(word);
                    });
                    trans += '</p>';
                } else {
                    trans = `<p>请求出错: ${xhr.response}</p>`;
                }
                sendToActiveTab(GLOBAL.EVENT.TRANSLATE_RESULT, {str: str, trans: trans});
            }
        };
        xhr.open("GET",
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lan}&dj=1&dt=t&dt=bd&dt=qc&dt=rm&dt=ex&dt=at&dt=ss&dt=rw&dt=ld&q=${str}&tk=389519.389519`,
            true);
        xhr.send(null);
}