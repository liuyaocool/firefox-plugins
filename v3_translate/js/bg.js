console.log('translate background start');
const OLLAMA = {API: '', MODEL: ''};
storageGet(GLOBAL.OLAMA_CACHE_KEY.API).then(val => OLLAMA.API = val || '');
storageGet(GLOBAL.OLAMA_CACHE_KEY.MODEL).then(val => OLLAMA.MODEL = val || '');

addMessageListener((req, sender, resp) => {
    switch (req.event) {
        case GLOBAL.EVENT.SRC: triggerTranslate(req.data.str); break;
        case GLOBAL.EVENT.TRANSLATE: translate(req.data.src, req.data.lan, req.data.str); break;
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
        case "ly_translate_translate": triggerTranslate(text); break;
    }
});

// 触发翻译
function triggerTranslate(src) {
    sendToActiveTab(GLOBAL.EVENT.SRC, {src} );
}
function sendTranslateResult(src, trans) {
    sendToActiveTab(GLOBAL.EVENT.TRANSLATE_RESULT, {src, trans});
}

/**
 * @param src 原始字符串
 * @param lan 原始语言
 * @param str 原始字符串去符号等
 */
function translate(src, lan, str) {
    const destLan = GLOBAL.LAN_CHECK[lan][0];
    googleTranslate(destLan, str)
        .then(trans => sendTranslateResult(src, trans) )
        .catch(err => {
            // 'http://127.0.0.1/deep/generate', 'deepseek-v2:16b'
            if (!OLLAMA.API || !OLLAMA.MODEL) {
                sendTranslateResult(src, err);
                return;
            }
            deepTranslate(OLLAMA.API, OLLAMA.MODEL, GLOBAL.LAN_CHECK[lan][3], str)
                .then(trans => sendTranslateResult(src, trans) )
                .catch(err2 => sendTranslateResult(src, err + '<br>' + err2) );
        });
}

function googleTranslate(lan, str) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        xhr.ontimeout = () => reject(`请求超时`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                let trans = '';
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
                resolve(trans + '</div>');
            } else {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(xhr.response, 'text/html');
                    doc.querySelectorAll("style, script").forEach(el => el.remove());
                    reject(`请求出错: ${doc.body.innerText.trim()}`);
                } catch(e) {
                    reject(`请求出错: ${xhr.response}`);
                }
            }
        };
        xhr.open("GET",
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lan}&dj=1&dt=t&dt=bd&dt=qc&dt=rm&dt=ex&dt=at&dt=ss&dt=rw&dt=ld&q=${str}&tk=389519.389519`,
            true);
        xhr.send(null);
    });
}

async function deepTranslate(api, model, promptPrefix, str) {
    const response = await fetch(api, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            model,
            prompt: promptPrefix + str,
            stream: false
        })
    });
    if (!response.ok) {
        throw new Error(`请求出错: ${response.status}`);
    }
    return `<div>${(await response.json()).response}</div>`;
}