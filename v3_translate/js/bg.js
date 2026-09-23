console.log('translate background start');
const OLLAMA = {API: 'http://127.0.0.1/ollama/generate', MODEL: 'deepseek-v2:16b'};
// 划词自动翻译长度
let AUTO_TRANS_LEN = 300;

// options.html 中 name
storageGet(GLOBAL.CONFIG_CACHE_KEY).then(val => {
    let json = JSON.parse(val);
    OLLAMA.API = json.ollama_api || OLLAMA.API;
    OLLAMA.MODEL = json.ollama_model || OLLAMA.MODEL;
    AUTO_TRANS_LEN = json.auto_trans_len || AUTO_TRANS_LEN;
    console.log(`${JSON.stringify(OLLAMA)} ${val} ${AUTO_TRANS_LEN}`)
});

addMessageListener((req, sender, resp) => {
    switch (req.event) {
        case GLOBAL.EVENT.SRC: triggerTranslate(req.data.str); break;
        case GLOBAL.EVENT.TRANSLATE: translate(req.data.lan, req.data.str); break;
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
        case "ly_translate_translate": triggerTranslate(text, false); break;
    }
});

// 触发翻译
function triggerTranslate(str, checkLen = true) {
    // {lan, str, str_width}
    let lan = getLan(str);
    if (checkLen && lan.str.length > AUTO_TRANS_LEN) return;
    sendToActiveTab(GLOBAL.EVENT.SRC, lan);
}
function sendTranslateResult(str, trans) {
    sendToActiveTab(GLOBAL.EVENT.TRANSLATE_RESULT, {str, trans});
}

/**
 * @param lan 原始语言
 * @param str 原始字符串去符号等
 */
function translate(lan, str) {
    const destLan = GLOBAL.LAN_CHECK[lan][0];
    googleTranslate(destLan, str)
        .then(trans => sendTranslateResult(str, trans) )
        .catch(err => {
            // 'http://127.0.0.1/deep/generate', 'deepseek-v2:16b'
            if (!OLLAMA.API || !OLLAMA.MODEL) {
                sendTranslateResult(str, err);
                return;
            }
            deepTranslate(OLLAMA.API, OLLAMA.MODEL, GLOBAL.LAN_CHECK[lan][3], str)
                .then(trans => sendTranslateResult(str, trans) )
                .catch(err2 => sendTranslateResult(str, err + '<br>' + err2) );
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

function getLan(str) {
    for(const item of ['http://', 'https://', 'magnet:?']) {
        if (str.indexOf(item) == 0) return null
    }
    let lanCount = {}, str_res = [], str_width = 0;
    for(const lan in GLOBAL.LAN_CHECK) lanCount[lan] = 0;
    for (let i = 0; i < str.length; i++) {
        str_res[i] = ' ';
        for (const la in GLOBAL.LAN_CHECK) {
            if (!GLOBAL.LAN_CHECK[la][1].test(str.charAt(i))) continue;
            lanCount[la]++;
            str_res[i] = str[i];
            str_width += GLOBAL.LAN_CHECK[la][2];
        }
    }
    str = str_res.join('');
    let lan = GLOBAL.LAN1, lanLen = lanCount[lan];
    for(var k in lanCount) {
        if (lanCount[k] > lanCount[lan]) {
            lan = k;
            lanLen = lanCount[lan];
        }
    }
    if (lanLen <= 0) return null;
    // 把连续空格改成单一空格
    str = str.replace(/\s+/g, " ").trim();
    return {lan, str, str_width};
}
