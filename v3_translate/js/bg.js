addMessageListener((req, sender, resp) => {
    switch (req.event) {
        case GLOBAL.EVENT.SRC:
            translate(req.data.lan, req.data.str);
            break;
        default: break;
    }
});

// <need, id}>
const ING = {};

function translate(lan, src) {
    if (ING[src]) {
        // 盒子闪烁
        sendToActiveTab(GLOBAL.EVENT.BOX_BULING, {id: ING[src].id});
        return;
    }
    // 添加盒子
    sendToActiveTab(GLOBAL.EVENT.ADD_BOX, {id: id, str: str});


    enToChGoogle(src, lan);
}

function enToChGoogle(str, lan) {
    return new Promise((resolve, reject) => {
        switch (lan) {
            case 'en': lan = 'en'; break;
            case 'ch': lan = 'zh-CN'; break;
            default: resolve('请选择 中文或英文'); return;
        }
        let xhr = new XMLHttpRequest();
        console.log(str);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let trans = '';
                if (xhr.status >= 200 && xhr.status < 300) {
                    let i, word, a = [], list, res = JSON.parse(xhr.response);
                    (list = res.sentences) && list.forEach(e => trans += e.trans || '');
                    a.push(trans);
                    trans = `<p>${trans}</p>`;
                    console.log(res.dict);
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
                resolve(trans);
            }
        };
        xhr.open("GET",
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lan}&dj=1&dt=t&dt=bd&dt=qc&dt=rm&dt=ex&dt=at&dt=ss&dt=rw&dt=ld&q=${str}&tk=389519.389519`,
            true);
        xhr.send(null);
    });
}