document.addEventListener("keydown", function (ev) {
    switch(ev.code) {
        case 'Escape': escPress(); break;
    }
    if (!ev.altKey) {
        return;
    }
    funckey1Events(ev.code);
})

addMessageListener((req, sender, resp) => {
    switch (req.method) {
        case GLOBAL.METHOD.TABS: setTabList(req.data); break;
        default: break;
    }
})

/**
    ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Delete'],
    ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
    ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
    ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
    ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
    ['ControlLeft','MetaLeft','AltLeft','Space','AltRight','PrintScreen','ControlRight',]
 */

const basePrefix = 'ly-hotkey-';
const selectClass = `${basePrefix}select`;
const tabsPrefix = `${basePrefix}tabs-`;

function funckey1Events(code) {
    switch(code) {
        case 'KeyO': showTabsPanel(true); break;
    }
}

function escPress() {
    showTabsPanel(false);
}

const tabsId = `${tabsPrefix}id`;
const tabsInputId = `${tabsPrefix}input`;
let tabs = [];
let tabsSelectIndex = 0;

function showTabsPanel(show) {
    const tabsDivId = `${tabsPrefix}div`;
    if (!document.getElementById(tabsDivId)) {
        let tabPanel = document.createElement('div');
        tabPanel.id = tabsDivId;
        tabPanel.style.display = 'none';
        tabPanel.innerHTML = `
            <input id="${tabsInputId}" type="text" placeholder="input for filter tabs">
            <div id="${tabsId}"></div>`;
        document.body.appendChild(tabPanel);
        document.getElementById(tabsInputId).oninput = e => fillTabsList(e.target.value);
        document.getElementById(tabsInputId).onkeydown = e=> {
            switch(e.code) {
                case 'ArrowUp': selectTab(-1); break;
                case 'ArrowDown': selectTab(1); break;
                case 'Enter': chooseTab(); break;
                default: console.log(e.code); break;
            }
        }
    }
    document.getElementById(tabsDivId).style.display = show === true ? '' : 'none';
    if (show) {
        document.getElementById(tabsInputId).focus();
    }
    // get tab list
    sendToBackground(GLOBAL.METHOD.TABS, null);
}

function setTabList(tabList) {
    tabs = tabList;
    tabsSelectIndex = 0;
    fillTabsList();
}

function chooseTab() {
    let choose = document.querySelectorAll(`#${tabsId} > .${selectClass}`)[0];
    if (!choose) {
        return;
    }
    let tabc = tabs[choose.getAttribute('tabIdx')*1];
    // jump to tab
    sendToBackground(GLOBAL.METHOD.GOTO_TAB, tabc.id);
}

function selectTab(offset) {
    if (!offset || 0 == offset)
        return;
    let tabDoms = document.querySelectorAll(`#${tabsId} > .${tabsPrefix}tab`);
    let j = 0;
    for (let i = tabDoms.length-1; i >= 0; i--) {
        if (tabDoms[i].classList.contains(selectClass)) j = i;
        tabDoms[i].classList.remove(selectClass);
    }
    j = (j + offset % tabDoms.length + tabDoms.length) % tabDoms.length;
    tabsSelectIndex = tabDoms[j].getAttribute('tabIdx') * 1;
    tabDoms[j].classList.add(selectClass);
}

function fillTabsList(key) {
    console.log(tabs);
    let tabListDom = '', tabInnerDom;
    for (let i = 0, j = 0; i < tabs.length && j < 11; i++) {
        if (!key) {
            tabInnerDom = [tabs[i].title, tabs[i].url];
        } else if (matchKey(tabs[i].title, key)) {
            tabInnerDom = [highLightChar(tabs[i].title, key), tabs[i].url];
        } else if (matchKey(tabs[i].url, key)) {
            tabInnerDom = [tabs[i].title, highLightChar(tabs[i].url, key)];
        } else {
            continue;
        }
        j++;
        tabListDom += `<div class="${tabsPrefix}tab ${tabsSelectIndex == i ? (basePrefix + 'select') : ''}" tabIdx=${i}>
            <div class="${tabsPrefix}name">${tabInnerDom[0]}</div>
            <div class="${tabsPrefix}url">${tabInnerDom[1]}</div>
        </div>`;
    }
    document.getElementById(tabsId).innerHTML = tabListDom;
}


function highLightChar(str, word) {
    if (!str || !word) {
        return str;
    }
    str = str.split('');
    for (let i = 0, j = 0; i < str.length; i++) {
        if (str[i] == word[j]) {
            str[i] = `<span class="${basePrefix}high-light">${str[i]}</span>`;
            j++;
        }
    }
    return str.join('');
}

/**
 * 匹配字符串 非连续存在也返回true
 *  例 matchKey('Hello World', 'eord') = true
 * @param str 原字符串
 * @param key 包含的关键字
 * @returns {boolean} true:匹配上了, false:未匹配上
 */
function matchKey(str, key) {
    let matchedCount = 0;
    for (let keyI = 0, ki = 0; keyI < key.length && ki < str.length; keyI++) {
        while (ki < str.length) {
            if (key[keyI] == str[ki++]) {
                matchedCount++;
                break;
            }
        }
    }
    return matchedCount == key.length;
}



console.log('hotkey injected');