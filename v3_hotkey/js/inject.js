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
        case GLOBAL.METHOD.TABS: setTabSearchList(req.data); break;
        case GLOBAL.METHOD.TABS_HIS: setTabHisList(req.data); break;
        case GLOBAL.KEY.ESC: escPress(); break;
        case GLOBAL.KEY.DUPLICATE_TAB: window.open(location.href); break;
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
const tabsDataId = `${tabsPrefix}data_id`;

function escPress() {
    showTabsSearchPanel(false);
    showTabsSwitchPanel(0);
}

let tabs = [];
let tabsSelectIndex = 0;

function gotoTabsSwitchPanel() {
    jumpToTab();
    showTabsSwitchPanel(0);
}

function showTabsSwitchPanel(offset) {
    const tabsSwitchId = tabsDataId;
    if (0 == offset) {
        let a = document.getElementById(tabsSwitchId);
        if (a) a.remove();
        return;
    }
    if (!document.getElementById(tabsSwitchId)) {
        let tabPanel = document.createElement('div');
        tabPanel.id = tabsSwitchId;
        tabPanel.classList.add(boxClass);
        document.body.appendChild(tabPanel);
        // get tab list
        sendToBackground(GLOBAL.METHOD.TABS_HIS, null);
    } else{
        focusTab(offset);
    }
}

function setTabHisList(tabList) {
    // todo sort
    // lastAccessed 上次访问时间
    tabList.sort((a, b) => b.lastAccessed - a.lastAccessed);
    // tabList.shift();
    tabs = tabList;
    tabsSelectIndex = 1;
    fillTabsList(10);
}

function showTabsSearchPanel(show) {
    const tabsInputId = `3c88a577464c4f839d1f56fd0b1c22f2`;
    const tabsPanelId = 'f2ff4831683d499ca8aba45ef9355b51';
    if (!show) {
        let a = document.getElementById(tabsPanelId);
        if (a) a.remove();
        return;
    }
    if (!document.getElementById(tabsPanelId)) {        
        let tabPanel = document.createElement('div');
        tabPanel.id = tabsPanelId;
        tabPanel.classList.add(boxClass);
        tabPanel.innerHTML = `
            <input id="${tabsInputId}" class="ly-hotkey-tabs-input" type="text" placeholder="input for filter tabs ('%' start support discontinuous)">
            <div id="${tabsDataId}"></div>`;
        document.body.appendChild(tabPanel);
        document.getElementById(tabsInputId).oninput = e => fillTabsList(10, e.target.value);
        document.getElementById(tabsInputId).onkeydown = e=> {
            switch(e.code) {
                case 'ArrowUp': focusTab(-1); break;
                case 'ArrowDown': focusTab(1); break;
                case 'Enter': jumpToTab(); break;
                default: return;
            }
            e.preventDefault();
        }
    }
        document.getElementById(tabsInputId).focus();
        document.getElementById(tabsInputId).value = '';
        // get tab list
        sendToBackground(GLOBAL.METHOD.TABS, null);
}

function setTabSearchList(tabList) {
    tabs = tabList;
    tabsSelectIndex = 0;
    fillTabsList(10);
}

function jumpToTab() {
    let choose = document.querySelectorAll(`#${tabsDataId} > .${selectClass}`)[0];
    if (!choose) return;
    let tabc = tabs[choose.getAttribute('tabIdx')*1];
    // jump to tab
    sendToBackground(GLOBAL.METHOD.GOTO_TAB, tabc.id);
    escPress();
}

function focusTab(offset) {
    if (!offset || 0 == offset)
        return;
    let tabDoms = document.querySelectorAll(`#${tabsDataId} > .${tabsPrefix}tab`);
    let j = 0;
    for (let i = tabDoms.length-1; i >= 0; i--) {
        if (tabDoms[i].classList.contains(selectClass)) j = i;
        tabDoms[i].classList.remove(selectClass);
    }
    j = (j + offset % tabDoms.length + tabDoms.length) % tabDoms.length;
    tabsSelectIndex = tabDoms[j].getAttribute('tabIdx') * 1;
    tabDoms[j].classList.add(selectClass);
}

function fillTabsList(maxLen, key) {
    // tabInnerDom[titleHtml, urlHtml, index, icon]
    let tabDomList = [], tabInnerDom, hasSelect = false, firstDom, 
        key1 = key && key.substring(1), isDis = key && key.startsWith('%');
    for (let i = 0, j = 0; i < tabs.length && j < maxLen; i++) {
        if (!key) {
            tabInnerDom = [tabs[i].title, tabs[i].url, i, tabs[i].favIconUrl];
        } else if (isDis){
            if(matchKey(tabs[i].title, key1)) {
                tabInnerDom = [highLightChar(tabs[i].title, key1), tabs[i].url, i, tabs[i].favIconUrl];
            } else if (matchKey(tabs[i].url, key1)) {
                tabInnerDom = [tabs[i].title, highLightChar(tabs[i].url, key1), i, tabs[i].favIconUrl];
            } else{
                continue;
            }
        } else if (matchAndHighlightTab(tabs[i], key)) {
            tabInnerDom = [tabs[i].titleHtml, tabs[i].urlHtml, i, tabs[i].favIconUrl];
        } else {
            continue;
        }
        if (!firstDom) firstDom = tabInnerDom;
        hasSelect = hasSelect || tabsSelectIndex == i;
        tabDomList.push(`<div class="${tabsPrefix}tab ${tabsSelectIndex == i ? selectClass : ''}" tabIdx=${i}>
            <img src="${tabInnerDom[3] || GLOBAL.IMG.TAB_ICON_WHITE}"/>
            <div class="${tabsPrefix}name">${tabInnerDom[0]}</div>
            <div class="${tabsPrefix}url">${tabInnerDom[1]}</div>
        </div>`);
        j++;
    }
    if (!hasSelect && firstDom) {
        tabDomList[0] = `<div class="${tabsPrefix}tab ${selectClass}" tabIdx=${firstDom[2]}>
            <img src="${firstDom[3] || GLOBAL.IMG.TAB_ICON_WHITE}"/>
            <div class="${tabsPrefix}name">${firstDom[0]}</div>
            <div class="${tabsPrefix}url">${firstDom[1]}</div>
        </div>`;
        tabsSelectIndex = firstDom[2];
    }
    document.getElementById(tabsDataId).innerHTML = tabDomList.join('');
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
 * 匹配字符串 不区分大小写
 * @param str 原字符串
 * @param key 空格分割的多个关键字
 * @returns {boolean} true:匹配上了, false:未匹配上
 */
function matchAndHighlightTab(tab, key) {
    key = key.toLowerCase().split(' ');
    // [key, index]
    let keyTtIdx = [], keyUrlIdx = [], 
        ttStr = tab.title.toLowerCase(), 
        urlStr = tab.url.toLowerCase(), 
        tt, urll;
    for (let i = 0; i < key.length; i++) {
        if (!key[i]) 
            continue;
        tt = ttStr.indexOf(key[i]);
        urll = urlStr.indexOf(key[i]);
        if (tt < 0 && urll < 0) {
            return false;
        }
        if (tt >= 0) {
            keyTtIdx.push([key[i], tt])            
        }
        if (urll >= 0) {
            keyUrlIdx.push([key[i], urll]);            
        }
    }
    tab.titleHtml = getHighLight(keyTtIdx, tab.title);
    tab.urlHtml = getHighLight(keyUrlIdx, tab.url);
    return true;
}

/**
 * 
 * @param {Array} keyIdx [ [key, index], ... ]
 * @param {string} str 
 * @returns high light str
 */
function getHighLight(keyIdx, str) {
    if (!keyIdx || keyIdx.length <= 0 || !str)
        return str;
    keyIdx.sort((a, b) => a[1] - b[1]);
    // 如果有重叠 合并
    let merge = []; // [start, end]
    for (let i = 0, startIdx; i < keyIdx.length; i++) {
        if ((key = keyIdx[i])[1] < 0)
            continue;
        startIdx = i;
        while(keyIdx[i+1] && (key[1] + key[0].length) >= keyIdx[i+1][1]) {
            i++;
        }
        merge.push([keyIdx[startIdx][1], keyIdx[i][1] + keyIdx[i][0].length]);
    }
    let htmlStr = str.substring(0, merge[0][0]);
    for (let i = 0; i < merge.length; i++) {
        //如果换行 会有空格
        htmlStr += `<span class="${basePrefix}high-light">${str.substring(merge[i][0], merge[i][1])}</span>${str.substring(merge[i][1], merge[i+1] ? merge[i+1][0] : str.length)}`;
    }
    return htmlStr;
}

console.log('hotkey injected');