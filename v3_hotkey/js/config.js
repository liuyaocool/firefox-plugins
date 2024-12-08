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

let ksIds = [
    'ly-hotkey-tabs-copy',
    'ly-hotkey-tabs-switch',
    'ly-hotkey-tabs-search',
]
const key_highlight_css = 'key-select';
const key_highlight_cursor_css = 'key-select-cursor';
const func_key_index = [
    [0, 'ctrlKey', GLOBAL.FUNC_KEY_ENUM.CTRL],
    [1, 'altKey', GLOBAL.FUNC_KEY_ENUM.ALT],
    [2, 'shiftKey', GLOBAL.FUNC_KEY_ENUM.SHIFT],
    [3, 'metaKey', GLOBAL.FUNC_KEY_ENUM.META],
];
for (let i = 0; i < ksIds.length; i++) {
    document.getElementById(ksIds[i]).addEventListener('keydown', keyDownHandler);
    document.getElementById(ksIds[i]).addEventListener('keyUp', keyUpHandler);
}
document.querySelectorAll('.func-key').forEach(ele => ele.addEventListener('click', funcKeyClick));
document.getElementById('save').addEventListener('click', save);

function keyDownHandler(e) {
    e.preventDefault();
    let fks = e.target.parentElement.querySelectorAll('span');
    // 删除‘功能按键’的样式
    func_key_index.forEach(k => {
        fks[k[0]].classList[e[k[1]] ? "add" : "remove"](key_highlight_css);
    })
    console.log(e);
    if (e.code.startsWith('Digit')) {
        e.target.value = e.code.substring(5);        
    } else if (e.code.startsWith('Key')) {
        e.target.value = e.code.substring(3);
    } else if (keyMapShow[e.code]) {
        e.target.value = keyMapShow[e.code];
    } else {
        e.target.value = '';
    }
    e.target.setAttribute('keycode', e.code);
}

function funcKeyClick(e) {
    let cls = e.target.classList;
    cls[cls.contains(key_highlight_cursor_css) ? "remove" : "add"](key_highlight_cursor_css);
}

function keyUpHandler(e) {

}

function save() {
    
}