/**
    e.code: 
    ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Delete'],
    ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
    ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
    ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
    ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
    ['ControlLeft','MetaLeft','AltLeft','Space','AltRight','PrintScreen','ControlRight',]

    e.key: 
    Escape  F1  F2  F3  F4  F5  F6  F7  F8  F9  F10  F11  F12  Delete
    `~    1!  2@  3#  4$  5%  6^  7&  8*  9(  0)   -_   =+  Backspace
    Tab    Qq  Ww           ~~~                Pp   [{   ]}      \|
    CapsLock Aa            ~~~              Ll   ;:   '"        Enter
    Shift      Zz         ~~~         Mm  ,<  .>     /?         Shift
    Control, Meta, Alt, ' ', Alt, Meta, Control,    ArrowLeft, ArrowRight, ArrowUp, ArrowDown]
 */
const keyMapShow = {
    "Backquote": '`',
    "Tab": 'Tab',
    "Delete": 'Del',
    "Semicolon": ';',
    "Quote": '"',
    "Enter": 'Enter',
    "Minus": '-',
    "Equal": '=',
    "Backspace": 'Back',
    "Comma": ',',
    "Period": '.',
    "Slash": '/',
    "BracketLeft": '[',
    "BracketRight": ']',
    "Backslash": '\\',
    "ArrowLeft": 'Left', 
    "ArrowRight": 'Right', 
    "ArrowUp": 'Up', 
    "ArrowDown": 'Down'
}

storageGet(GLOBAL.KEY_BIND_CACHE).then(res => {
    if (!res) {
        console.log('cache init');
        res = '{"COPY":{"code":"KeyD","altKey":true},"SWITCH_PREV":{"code":"Backquote","altKey":true},"SWITCH_NEXT":{"code":"Tab","altKey":true},"SEARCH":{"code":"KeyO","altKey":true}}';
        storageSet(GLOBAL.KEY_BIND_CACHE, res);
    }
    setKeyBinds(JSON.parse(res));
});

const key_highlight_css = 'key-select';
const key_highlight_cursor_css = 'key-select-cursor';

document.querySelectorAll('[key]').forEach(e => {
    e.addEventListener('keydown', keyDownHandler);
    e.addEventListener('keyUp', keyUpHandler);
});
document.querySelectorAll('.func-key').forEach(ele => ele.addEventListener('click', funcKeyClick));
document.getElementById('save').addEventListener('click', save);

function keyDownHandler(e) {
    // 刷新‘功能按键’的样式
    e.target.parentElement.querySelectorAll('span').forEach(sp => {
        sp.classList[e[sp.getAttribute('ev')] ? "add": "remove"](key_highlight_css);
    });
    handlKeyCode(e.target, e.code);
    if (e.target.value) {
        e.preventDefault();        
    }
}

function handlKeyCode(target, code) {
    if (code.startsWith('Digit')) {
        target.value = code.substring(5);
    } else if (code.startsWith('Key')) {
        target.value = code.substring(3);
    } else if (keyMapShow[code]) {
        target.value = keyMapShow[code];
    } else {
        target.value = '';
        code = '';
    }
    target.setAttribute('code', code);
}

function funcKeyClick(e) {
    let cls = e.target.classList;
    cls[cls.contains(key_highlight_cursor_css) ? "remove" : "add"](key_highlight_cursor_css);
}

function keyUpHandler(e) {

}

function getKeyBinds() {
    let keyBinds = {}, kb;
    let handlerSel = sel => {
        kb[sel.getAttribute('ev')] = sel.classList.contains(key_highlight_css) || sel.classList.contains(key_highlight_cursor_css);
    };
    document.querySelectorAll('[key]').forEach(e => {
        kb = keyBinds[e.getAttribute('key')] = {code: e.getAttribute('code')};
        e.parentElement.querySelectorAll('.func-key').forEach(handlerSel);
        // e.parentElement.querySelectorAll('.' + key_highlight_css)
        // e.parentElement.querySelectorAll('.' + key_highlight_cursor_css).forEach(handlerSel);
    });
    return keyBinds;
}

function setKeyBinds(keyBinds) {
    console.log(keyBinds);
    document.querySelectorAll('[key]').forEach(e => {
        let kb = keyBinds[e.getAttribute('key')];
        handlKeyCode(e, kb.code);
        for(let k in kb) {
            if (k != 'code' && true === kb[k]) {
                e.parentElement.querySelector(`[ev=${k}`).classList.add(key_highlight_css);
            }
        }
    });
}

function save() {
    let keyBinds = getKeyBinds();
    storageSet(GLOBAL.KEY_BIND_CACHE, JSON.stringify(keyBinds));
    showMsg('save ok');
}

function storageSet(k, v) {
    let o = {};
    o[k] = v;
    return browser.storage.local.set(o);
}

async function storageGet(k) {
    return (await browser.storage.local.get([k]))[k];
}

function showMsg(msg) {
    document.getElementById('msg').innerText = msg;
    setTimeout(() => {
        document.getElementById('msg').innerText = '';
    }, 1000);
}