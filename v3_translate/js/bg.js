addMessageListener((req, sender, resp) => {
    switch (req.event) {
        case GLOBAL.EVENT.SRC: translate(req.data.str); break;
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
        case "ly_translate_translate": translate(text); break;
    }
});

function translate(str) {
    if (str.indexOf('http://') == 0
        || str.indexOf('https://') == 0
    ) return;
    let lanCount = {}, str_res = [], str_width = 0;
    for (const la of GLOBAL.LAN_CHECK) lanCount[la[0]] = 0;
    for (let i = 0; i < str.length; i++) {
        for (const la of GLOBAL.LAN_CHECK) {
            if (!la[1].test(str.charAt(i))) continue;
            lanCount[la[0]]++;
            str_res[i] = str[i];
            str_width += la[2];
        }
    }
    for (let i = 0; i < str_res.length; i++) {
        str_res[i] = str_res[i] || ' ';
    }
    str = str_res.join('');
    let lan, lanLen;
    for(var k in lanCount) {
        if (!lan) {
            lan = k;
            lanLen = lanCount[lan];
            continue;
        }
        if (lanCount[k] > lanCount[lan]) {
            lan = k;
            lanLen = lanCount[lan];
        }
    }
    if (lanLen <= 0) return;

    sendToActiveTab(GLOBAL.EVENT.SRC, {lan: lan, str: str, str_width: str_width});
        switch (lan) {
            case GLOBAL.LAN.EN: lan = 'en'; break;
            case GLOBAL.LAN.CH: lan = 'zh-CN'; break;
            default: return;
        }
        let xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        xhr.ontimeout = function() {
            sendToActiveTab(GLOBAL.EVENT.TRANSLATE_RESULT, {str: str, trans: `<div>请求超时</div>`});
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
                let trans = '';
                if (xhr.status >= 200 && xhr.status < 300) {
                    let i, word, a = [], list, res = JSON.parse(xhr.response);
                    (list = res.sentences) && list.forEach(e => trans += e.trans || '');
                    a.push(trans);
                    trans = `<div>${trans}</div>`;
                    // console.log(res.dict);
                    (list = res.dict) && list.forEach(e => {
                        trans += `<div>${e.pos}:`;
                        for (let j = 0; j < e.entry.length; j++) {
                            if (a.indexOf(word = e.entry[j].word) >= 0) continue;
                            trans += `<span>${word}</span>`;
                            a.push(word);
                        }
                        trans += '</div>';
                    });
                    let words = [];
                    for (list = res.alternative_translations, i = 0; list && i < list.length; i++) {
                        for (let j = 0; j < list[i].alternative.length; j++) {
                            (words[j] || (words[j] = [])).push(list[i].alternative[j].word_postproc);
                        }
                    }
                    trans += `<div>`;
                    words.forEach(e => {
                        if (a.indexOf(word = e.join('')) >= 0) return;
                        trans += `<span>${word}</span>`
                        a.push(word);
                    });
                    trans += '</div>';
                } else {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(xhr.response, 'text/html');
                        trans = `<div>请求出错: ${doc.body.innerText.trim()}</div>`;
                    } catch(e) {
                        trans = `<div>请求出错: ${xhr.response}</div>`;
                    }
                }
                sendToActiveTab(GLOBAL.EVENT.TRANSLATE_RESULT, {str: str, trans: trans});
        };
        xhr.open("GET",
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lan}&dj=1&dt=t&dt=bd&dt=qc&dt=rm&dt=ex&dt=at&dt=ss&dt=rw&dt=ld&q=${str}&tk=389519.389519`,
            true);
        xhr.send(null);
}