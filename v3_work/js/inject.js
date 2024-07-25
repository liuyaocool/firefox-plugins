
const keyCodes = [
    ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Delete'],
    ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
    ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
    ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
    ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
    ['ControlLeft','MetaLeft','AltLeft','Space','AltRight','PrintScreen','ControlRight',]
];

console.log('work inject...');

if(location.href.indexOf('/login/login.init.do') >= 0
    || location.href.indexOf('/login/login.logout.do') >= 0
) {
    document.getElementsByClassName('erweima')[0].click();
    document.getElementById('corpCode').focus();
    document.getElementsByClassName('yanClose')[0].click();
    document.getElementById('language').value='zh_CN';
    document.getElementById('language').dispatchEvent(new Event('change', { bubbles: true }))
}

if(location.href.indexOf('/rtr') >= 0
    || location.href.indexOf('/os/html/task/todayTask.index.do') >= 0
) {
    document.onkeydown = function (ev) {
        switch(ev.code) {
            case 'AltRight': location.href = '/os/html/deskTop.init.do?goV5Desk=true'; break;
            default: break;
        }
    }
    addTip(`<span style="color:#91671c;font-weight:bold;"> 右Alt </span>:前往5.0桌面`);
}

if (location.href.indexOf('/os/html/deskTop.init.do') >= 0) {
    const tbc_os_focus_search = () => {
        let tbc_os_sf = document.getElementsByClassName('tbc-os-btm-search-form')[0];
        tbc_os_sf.parentElement.classList.add('focus');
        tbc_os_sf.getElementsByTagName('input')[0].focus();
    }
    document.onkeydown = function (ev) {
        let tbc_a = document.getElementsByClassName('asb-results');
        let tbc_os_open_search_panel = tbc_a.length > 0 && tbc_a[0].clientWidth > 0;
        tbc_a = document.getElementsByClassName('tbc_selected');
        switch(ev.code) {
            case 'AltRight':
                tbc_a = document.getElementsByTagName('iframe');
                for (let i = 0; i < tbc_a.length; i++) {
                    if (tbc_a[i].clientWidth > 0) {
                        window.open(tbc_a[i].src);
                        break;
                    }
                }
                break;
            case 'AltLeft':
                let tbc_b;
                if (0 == tbc_a.length || !(tbc_b = tbc_a[tbc_a.length-1].nextElementSibling)) {
                    tbc_b = document.querySelectorAll('.asb-results li')[0];
                }
                for (let i = 0; i < tbc_a.length; i++)
                    tbc_a[i].classList.remove('tbc_selected');
                tbc_b.classList.add('tbc_selected');
                break;
            case "Enter":
                if (tbc_a.length > 0) {
                    tbc_a[tbc_a.length-1].click();
                } else if(tbc_os_open_search_panel) {
                    document.querySelectorAll('.asb-header .asb-button-submit')[0].click()
                }
                break;
            case 'Escape':
                if(tbc_os_open_search_panel) {
                    document.querySelectorAll('.asb-header .asb-keyword')[0].focus();
                } else {
                    tbc_os_focus_search();
                }
                break;
            default: break;
        }
    }
    tbc_os_focus_search();

    addTip(`
        <span style="color:#91671c;font-weight:bold;"> 左Alt </span>:定位搜索结果；
        <span style="color:#91671c;font-weight:bold;"> 右Alt </span>:新窗口打开iframe内页面；
        <span style="color:#91671c;font-weight:bold;"> Esc </span>:定位到输入框；
        <span style="color:#91671c;font-weight:bold;"> 回车 </span>:查询、转到定位app<br>
    `)
}

