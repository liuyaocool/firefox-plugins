addMessageListener((req, sender, response) => {
    switch(req.event) {
        case GLOBAL.EVENT.ADD_BOX: translate(request.data); break;
        default: break;
    }
});

(() => {
    var div = document.createElement('div');
    div.id = divId;
    document.body.append(div);
    console.log('translate inject success');
})()

for (let i = 0; i < 0; i++) {
    document.getElementById(divId).innerHTML += `
<div id="1695101791448479">
        <div class="ly_trnslate_src">样式</div>
        <div class="ly_trnslate_ret">
        <p>style</p>
        <p>noun:<span>style</span><span>pattern</span><span>form</span><span>type</span></p>
        <p></p>
        </div>
        <span class="ly_trnslate_close">
            关闭(<span id="1695101791448479_tim">1</span>s)
        </span>
    </div>
        <div id="aaaa_${i}">
            <div class="ly_trnslate_src">swaylock is a screen locking utility for Wayland compositors. It is compatible with any Wayland compositor which implements the ext-session-lock-v1 Wayland protocol.</div>
            <div class="ly_trnslate_ret"><p>result</p><p>noun:<span>result</span><span>outcome</span><span>consequence</span><span>effect</span><span>consequent</span><span>upshot</span><span>payoff</span><span>sequel</span><span>educt</span><span>bottom line</span><span>event</span></p><p>verb:<span>slay</span><span>finish off</span><span>kill</span></p><p><span>Results</span></p></div>
            <span class="ly_trnslate_close">关闭(5s)</span>
        </div>
        <div id="bbbb_${i}">
            <div class="ly_trnslate_src">this is page</div>
            <div class="ly_trnslate_ret"><p>车轮</p><p>noun:<span>轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮</span><span>车轮</span><span>轮子</span><span>毂</span><span>轱</span></p><p>verb:<span>盘旋</span><span>翔</span></p><p><span>推</span></p></div>
            <span class="ly_trnslate_close">关闭(5s)</span>
        </div>
`;
}

// <need, {tim:,id:,}>
const ING = {};

function addBox(src) {
    ING[src] = { id: uuid(), tim: 5, leave: false }
    let addDiv = document.createElement('div');
    addDiv.id = ING[src].id;
    addDiv.innerHTML = `
        <div class="ly_trnslate_src">${src}</div>
        <div class="ly_trnslate_ret"></div>
        <span class="ly_trnslate_close">
            关闭(<span id="${ING[src].id}_tim">${ING[src].tim}</span>s)
        </span>
    `;
    addDiv.querySelector('span').onclick = e => rmv(src);
    addDiv.onmouseover = e => ING[src].leave = true;
    addDiv.onmouseleave = e => ING[src].leave = false;
    let divDom = document.getElementById(divId);
    divDom.insertBefore(addDiv, divDom.firstChild);
}

function fillBox(src, transHtml) {
    let addDiv = document.getElementById(ING[src].id);
    if (!addDiv) return;
    addDiv.children[1].innerHTML = transHtml;
    addDiv.style.height = addDiv.clientHeight + 'px';
    if (!ING[src].intv) ING[src].intv = setInterval(() => {
        if (ING[src].leave) return;
        if (ING[src].tim == 1) {
            rmv(src);
        } else {
            let a = document.getElementById(ING[src].id+'_tim');
            if (a) a.innerText = --ING[src].tim;
        }
    }, 1000);
}

function rmv(src) {
    if (!ING[src]) return ;
    clearInterval(ING[src].intv);
    let resDiv = document.getElementById(ING[src].id);
    delete ING[src];
    if (!resDiv) return;
    let timout = 500;
    if (resDiv.nextElementSibling) {
        // 非最后一个
        resDiv.style.transition = `all ${timout}ms cubic-bezier(0.19, 1, 0.22, 1)`;
        resDiv.style['margin-bottom'] = 0;
        resDiv.style.height = 0;
        resDiv.style.opacity = 0;
    } else {
        // 最后一个
        resDiv.style.transition = `all ${timout}ms cubic-bezier(0.6, 0.04, 0.98, 0.335)`;
        resDiv.style.opacity = 0;
    }
    setTimeout(() => resDiv.remove(), timout*1.5);
}

function translate(src) {
    if (!src || !src.trim()) return;
    src = src.trim();
    if (ING[src]) {
        buling(ING[src].id);
        ING[src].tim = 6;
        return;
    }
    let lan = checkAndGetLan(src);
    if (!lan) return;
    addBox(src);
    enToChGoogle(src, lan);
}

function enToChGoogle(str, lan) {
    switch (lan) {
        case 'en': lan = 'en'; break;
        case 'ch': lan = 'zh-CN'; break;
        default: fillBox(str, '请选择 中文或英文'); return;
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
            fillBox(str, trans);
        }
    };
    xhr.open("GET",
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lan}&dj=1&dt=t&dt=bd&dt=qc&dt=rm&dt=ex&dt=at&dt=ss&dt=rw&dt=ld&q=${str}&tk=389519.389519`,
        true);
    xhr.send(null);
}

function buling(id) {
    let classList = document.getElementById(id).classList;
    classList.add('buling');
    setTimeout(() => classList.remove('buling'), 500);
}