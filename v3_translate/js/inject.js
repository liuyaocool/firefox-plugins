addMessageListener((req, sender, resp) => {
    switch(req.event) {
        case GLOBAL.EVENT.SRC: addBox(req.data.str, req.data.str_width); break;
        case GLOBAL.EVENT.TRANSLATE_RESULT: fillBox(req.data.str, req.data.trans); break;
        default: break;
    }
});

console.log('translate inject success');

for (let i = 0; i < 0; i++) {
    if (!document.getElementById(GLOBAL.CONTAINER_ID)) {
        var div = document.createElement('div');
        div.id = GLOBAL.CONTAINER_ID;
        document.body.append(div);
    }
    document.getElementById(GLOBAL.CONTAINER_ID).innerHTML += `
<div id="1695101791448479">
        <div class="ly_trnslate_src big">样式</div>
        <div class="ly_trnslate_ret">
            <div>style</div>
            <div>noun:<span>style</span><span>pattern</span><span>form</span><span>type</span></div>
            <div></div>
        </div>
        <span class="ly_trnslate_close">
            关闭(<span id="1695101791448479_tim">1</span>s)
        </span>
    </div>
        <div id="aaaa_${i}">
            <div class="ly_trnslate_src small">swaylock is a screen locking utility for Wayland compositors. It is compatible with any Wayland compositor which implements the ext-session-lock-v1 Wayland protocol.</div>
            <div class="ly_trnslate_ret">
                <div>result resultresultresultresultresult resultresultresultresultresult result result result result result</div>
                <div>noun:<span>result</span><span>consequent</span><span>upshot</span><span>bottom line</span><span>event</span></div>
                <div>verb:<span>slay</span><span>finish off</span><span>kill</span></div>
                <div><span>Results</span></div>
            </div>
            <span class="ly_trnslate_close">关闭(5s)</span>
        </div>
        <div id="bbbb_${i}">
            <div class="ly_trnslate_src big">this is page</div>
            <div class="ly_trnslate_ret">
                <div>车轮</div>
                <div>noun:<span>轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮轮</span><span>车轮</span><span>轮子</span><span>毂</span><span>轱</span></div>
                <div>verb:<span>盘旋</span><span>翔</span></div>
                <div><span>推</span></div>
            </div>
            <span class="ly_trnslate_close">关闭(5s)</span>
        </div>
`;
}

// <need, {tim:,id:,}>
const ING = {};

function addBox(src, src_width) {
    if (ING[src]) {
        buling(ING[src].id);
        ING[src].tim = 6;
        return;
    }
    console.log(src_width)
    ING[src] = { id: uuid(), tim: 5, leave: false }
    let addDiv = document.createElement('div');
    addDiv.id = ING[src].id;
    addDiv.innerHTML = `
        <div class="ly_trnslate_src ${src_width < 19 ? 'big' : 'small'}">${src}</div>
        <div class="ly_trnslate_ret"></div>
        <span class="ly_trnslate_close">
            关闭(<span id="${ING[src].id}_tim">${ING[src].tim}</span>s)
        </span>
    `;
    addDiv.querySelector('span').onclick = e => rmv(src);
    addDiv.onmouseover = e => ING[src].leave = true;
    addDiv.onmouseleave = e => ING[src].leave = false;
    let divDom = document.getElementById(GLOBAL.CONTAINER_ID);
    if (!divDom) {
        var div = document.createElement('div');
        div.id = GLOBAL.CONTAINER_ID;
        document.body.append(div);
        divDom = document.getElementById(GLOBAL.CONTAINER_ID);
    }
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

function buling(id) {
    let classList = document.getElementById(id).classList;
    classList.add('buling');
    setTimeout(() => classList.remove('buling'), 500);
}