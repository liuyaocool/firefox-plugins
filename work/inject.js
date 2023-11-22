
const keyCodes = [
    ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Delete'],
    ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
    ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
    ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
    ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
    ['ControlLeft','MetaLeft','AltLeft','Space','AltRight','PrintScreen','ControlRight',]
];

if(location.href.indexOf('/redis') >= 0) {
    const tbc_redis_list = ['V4_mdm(V4原6382)', 'V4_common(V4原6379)', 'V5_common(V5原6379)', 'V5_mdm(V5原6382)'];
    let tbc_redis_idx = 0;
    document.onkeydown = function (ev) {
        switch(ev.code) {
            case 'AltLeft':
                tbc_redis_idx = (tbc_redis_idx+1) % tbc_redis_list.length;
                document.getElementById('redis_name').value = tbc_redis_list[tbc_redis_idx];
                ev.preventDefault();
                break;
            case 'Escape': document.getElementById('redis_key').focus(); if (ev) ev.preventDefault(); break;
            case 'AltRight':
                let tbc_a = document.getElementById('result_tbody').children;
                tbc_a = JSON.parse(JSON.parse(tbc_a[tbc_a.length-1].children[2].innerText)).jdbcUrl.split('//')[1].split(':');
                window.open(`http://127.0.0.1:8083/static/html/db/ssh.html#${tbc_a[0]}:${tbc_a[1].split('/').join(':')}`);
                ev.preventDefault();
                break;
            case "Enter": document.getElementById('btn_query').click(); break;
            default: break;
        }
    }
    document.getElementById('redis_name').value = tbc_redis_list[0];
    document.getElementById('redis_key').focus();
    addTip(`
        <span style="color:#91671c;font-weight:bold;"> 左Alt </span>:
            <span style="color:red"> ${tbc_redis_list.join('，')} </span>之间快速切换<br>
        <span style="color:#91671c;font-weight:bold;"> 右Alt </span>:转到sql查询；
        <span style="color:#91671c;font-weight:bold;"> Esc </span>:定位到输入框；
        <span style="color:#91671c;font-weight:bold;"> 回车 </span>:查询<br>
    `)
}

if(location.href.indexOf('/login/login.init.do') >= 0
    || location.href.indexOf('/login/login.logout.do') >= 0
) {
    document.getElementsByClassName('erweima')[0].click();
    document.getElementById('corpCode').focus();
    document.getElementsByClassName('yanClose')[0].click();
}

if('jenkins.21tb.com' ==location.host) {
    if ('/' == location.pathname) {
        let tbc_jenkins_list = [
            ['#job_上海云环境备用-jdk1\\.8', ' > td:nth-child(7) > a'],
            ['#job_上海云环境-jdk1\\.8', ' > td:nth-child(7) > a'],
            0
        ];
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    tbc_jenkins_list[2] = (tbc_jenkins_list[2] + 1) % (tbc_jenkins_list.length-1);
                    for (let i = 0; i < tbc_jenkins_list.length - 1; i++) {
                        document.querySelector(tbc_jenkins_list[i][0]).style.backgroundColor = '';
                    }
                    let tbc_jenkins_e = document.querySelector(tbc_jenkins_list[tbc_jenkins_list[2]].join(''));
                    tbc_jenkins_e.parentElement.parentElement.style.backgroundColor = 'seagreen';
                    tbc_jenkins_e.focus();
                    break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 云环境-jdk1.8, 云环境备用-jdk1.8 之间来回聚焦
        `)
    } else if (location.pathname.indexOf('/build') >= 0){
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    document.querySelector("#main-panel > form > div.parameters > div:nth-child(1) > div.setting-main > div > input.setting-input").focus();
                    break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 定位到 “item_name”
        `);
    } else {
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    document.querySelector("#tasks > div:nth-child(4) > span > a").focus();
                break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 定位到 ”Build with Parameters“
        `);
    }
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

if (location.href.indexOf('/os/html/deskTop.init.do?goV5Desk=true') >= 0) {
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

function addTip(innerHtml) {
    let tip = document.createElement('div');
    tip.classList.add('tbc-tip');
    tip.innerHTML = innerHtml;
    document.body.appendChild(tip);
}