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
let keyUpFunction = {};
document.addEventListener("keydown", function (ev) {
    switch(ev.key) {
        case 'Escape': 
            sendToBackground(GLOBAL.KEY.ESC, null); 
            keyUpFunction = {};
            break;
        case 'o': 
            if (ev.altKey) {
                sendToBackground(GLOBAL.KEY.SEARCH_PANEL, null);
                break;
            }
            return;
        case 'd': 
            if (ev.ctrlKey) {
                sendToBackground(GLOBAL.KEY.DUPLICATE_TAB, null);
                break;
            }
            return;
        case 'Tab':
            if (ev.altKey) {
                sendToBackground(GLOBAL.KEY.SWITCH_PANEL_DOWN, null);
                keyUpFunction["Alt"] = () => sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
                break;
            }
            return;
        case '`':
            if (ev.altKey) {
                sendToBackground(GLOBAL.KEY.SWITCH_PANEL_UP, null);
                keyUpFunction["Alt"] = () => sendToBackground(GLOBAL.KEY.SWITCH_PANEL_GOTO, null);
                break;
            }
            return;
        default: return;
    }
    ev.preventDefault();
});

document.addEventListener("keyup", function (ev) {
    if (keyUpFunction[ev.key]) {
        keyUpFunction[ev.key]();
        keyUpFunction[ev.key] = null;
    }
})

console.log('hotkey all injected');