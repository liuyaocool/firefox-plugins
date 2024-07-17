document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        escPress();
    }
});
window.addEventListener('blur', function() {
    // 窗口失去焦点
    escPress();
});

addMessageListener((req, sender, resp) => {
    switch (req.method) {
        case GLOBAL.METHOD.TABS: setTabList(tabsSearchId, 10, req.data); break;
        case GLOBAL.METHOD.TABS_HIS: setTabHisList(req.data); break;
        case GLOBAL.KEY.ESC: escPress(); break;
        case GLOBAL.KEY.SEARCH_PANEL: showTabsSearchPanel(true); break;
        case GLOBAL.KEY.SWITCH_PANEL_DOWN: showTabsSwitchPanel(1); break;
        case GLOBAL.KEY.SWITCH_PANEL_UP: showTabsSwitchPanel(-1); break;
        case GLOBAL.KEY.SWITCH_PANEL_GOTO: gotoTabsSwitchPanel(); break;
        default: break;
    }
})

const basePrefix = 'ly-hotkey-';
const selectClass = `${basePrefix}select`;
const boxClass = `${basePrefix}box`;
const tabsPrefix = `${basePrefix}tabs-`;

function escPress() {
    showTabsSearchPanel(false);
    showTabsSwitchPanel(0);
}

const tabsSearchId = `${tabsPrefix}sid`;
const tabsSwitchId = `${tabsPrefix}swid`;
let tabs = [];
let tabsSelectIndex = 0;

function gotoTabsSwitchPanel() {
    jumpToTab(tabsSwitchId);
    showTabsSwitchPanel(0);
}
function showTabsSwitchPanel(offset) {
    if (!document.getElementById(tabsSwitchId)) {
        let tabPanel = document.createElement('div');
        tabPanel.id = tabsSwitchId;
        tabPanel.style.display = 'none';
        tabPanel.classList.add(boxClass);
        document.body.appendChild(tabPanel);
    }
    let containerDom =  document.getElementById(tabsSwitchId);
    if (0 == offset) {
        containerDom.style.display = 'none';
        return;
    }
    if ('none' == containerDom.style.display) {
        containerDom.style.display = '';
        // get tab list
        sendToBackground(GLOBAL.METHOD.TABS_HIS, null);
    } else{
        focusTab(tabsSwitchId, offset);
    }
}

function setTabHisList(tabList) {
    // todo sort
    // lastAccessed 上次访问时间
    tabList.sort((a, b) => b.lastAccessed - a.lastAccessed);
    tabList.shift();
    setTabList(tabsSwitchId, 5, tabList);
}

function showTabsSearchPanel(show) {
    const tabsInputId = `${tabsPrefix}input`;
    const tabsDivId = `${tabsPrefix}div`;
    if (!document.getElementById(tabsDivId)) {
        let tabPanel = document.createElement('div');
        tabPanel.id = tabsDivId;
        tabPanel.style.display = 'none';
        tabPanel.classList.add(boxClass);
        tabPanel.innerHTML = `
            <input id="${tabsInputId}" type="text" placeholder="input for filter tabs">
            <div id="${tabsSearchId}"></div>`;
        document.body.appendChild(tabPanel);
        document.getElementById(tabsInputId).oninput = e => fillTabsList(tabsSearchId, 10, e.target.value);
        document.getElementById(tabsInputId).onkeydown = e=> {
            switch(e.code) {
                case 'ArrowUp': focusTab(tabsSearchId, -1); break;
                case 'ArrowDown': focusTab(tabsSearchId, 1); break;
                case 'Enter': jumpToTab(tabsSearchId); break;
                default: return;
            }
            e.preventDefault();
        }
    }
    document.getElementById(tabsDivId).style.display = show === true ? '' : 'none';
    if (show) {
        document.getElementById(tabsInputId).focus();
        document.getElementById(tabsInputId).value = '';
        // get tab list
        sendToBackground(GLOBAL.METHOD.TABS, null);
    }
}

function setTabList(containerId, maxLen, tabList) {
    tabs = tabList;
    tabsSelectIndex = 0;
    fillTabsList(containerId, maxLen);
}

function jumpToTab(containerId) {
    let choose = document.querySelectorAll(`#${containerId} > .${selectClass}`)[0];
    if (!choose) return;
    let tabc = tabs[choose.getAttribute('tabIdx')*1];
    // jump to tab
    sendToBackground(GLOBAL.METHOD.GOTO_TAB, tabc.id);
    escPress();
}

function focusTab(containerId, offset) {
    if (!offset || 0 == offset)
        return;
    let tabDoms = document.querySelectorAll(`#${containerId} > .${tabsPrefix}tab`);
    let j = 0;
    for (let i = tabDoms.length-1; i >= 0; i--) {
        if (tabDoms[i].classList.contains(selectClass)) j = i;
        tabDoms[i].classList.remove(selectClass);
    }
    j = (j + offset % tabDoms.length + tabDoms.length) % tabDoms.length;
    tabsSelectIndex = tabDoms[j].getAttribute('tabIdx') * 1;
    tabDoms[j].classList.add(selectClass);
}

function fillTabsList(containerId, maxLen, key) {
    let tabDomList = [], tabInnerDom, hasSelect = false, firstDom;
    for (let i = 0, j = 0; i < tabs.length && j < maxLen; i++) {
        if (!key) {
            tabInnerDom = [tabs[i].title, tabs[i].url, i];
        } else if (matchKey(tabs[i].title, key)) {
            tabInnerDom = [highLightChar(tabs[i].title, key), tabs[i].url, i];
        } else if (matchKey(tabs[i].url, key)) {
            tabInnerDom = [tabs[i].title, highLightChar(tabs[i].url, key), i];
        } else {
            continue;
        }
        if (!firstDom) firstDom = tabInnerDom;
        hasSelect = hasSelect || tabsSelectIndex == i;
        tabDomList.push(`<div class="${tabsPrefix}tab ${tabsSelectIndex == i ? selectClass : ''}" tabIdx=${i}>
            <div class="${tabsPrefix}name">${tabInnerDom[0]}</div>
            <div class="${tabsPrefix}url">${tabInnerDom[1]}</div>
        </div>`);
        j++;
    }
    if (!hasSelect) {
        tabDomList[0] = `<div class="${tabsPrefix}tab ${selectClass}" tabIdx=${firstDom[2]}>
            <div class="${tabsPrefix}name">${firstDom[0]}</div>
            <div class="${tabsPrefix}url">${firstDom[1]}</div>
        </div>`;
        tabsSelectIndex = firstDom[2];
    }
    document.getElementById(containerId).innerHTML = tabDomList.join('');
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


/**
 * 匹配字符串
 * @param str 原字符串
 * @param key 空格分割的多个关键字
 * @returns {boolean} true:匹配上了, false:未匹配上
 */
function matchAndHighlightTab(tab, key) {
    key = key.split(' ');
    let titlee = tab.title, urll = tab.url, ttok, urlok;
    for (let i = 0; i < key.length; i++) {
        ttok = titlee.indexOf(key[i]) < 0;
        urlok = urll.indexOf(key[i]) < 0;
        if (!ttok && !urlok) {
            return false;
        }
        // 只需要替换第一个匹配的就好了


    }
    tab.titleHtml = titlee;
    tab.urlHtmk = urll;
}

console.log('hotkey injected');