let pageTabList, pageCurTab, curTabList, pageTabIdx;
const SELECT_CLASS = 'ly-hotkey-select';
(async function() {
    pageCurTab = await getActiveTab();
    pageTabList = await browser.tabs.query({"lastFocusedWindow": true});
    let command = (await storageGet(GLOBAL.CACHE_KEY.COMAND)) || GLOBAL.COMMAND.SEARCH_TAB;
    storageRm(GLOBAL.CACHE_KEY.COMAND);
    switch(command) {
        case GLOBAL.COMMAND.PREV_TAB_LAST:
        case GLOBAL.COMMAND.NEXT_TAB_LAST:
            tabLastInit();
            break;
        case GLOBAL.COMMAND.NEXT_TAB_SITE:
        case GLOBAL.COMMAND.PREV_TAB_SITE:
            tabSiteInit()
            break;
        case GLOBAL.COMMAND.SEARCH_TAB:
            tabSearchInit();
            break;
        default: return;
    }
    console.log('command init: ' + command);
})();

function tabLastInit() {
    pageTabList.sort((a, b) => b.lastAccessed - a.lastAccessed);
    baseSwitchInit();
}

function tabSiteInit() {
    // pageTabList = await browser.tabs.query({
    //     lastFocusedWindow: true,
    //     url: `*://${new URL(pageCurTab.url).hostname}/*`
    // });
    let isok = false;
    for(let start of ['https://', 'http://', 'file://', 'moz-extension://']) {
        if (pageCurTab.url.indexOf(start) < 0) {
            continue;
        }
        let startStr = pageCurTab.url.substring(0, pageCurTab.url.indexOf('/', start.length) + 1);
        pageTabList = pageTabList.filter(tab => tab.url.startsWith(startStr));
        isok = true;
        break;
    }
    if ( !isok && pageCurTab.url.startsWith('about:') ) {
        pageTabList = pageTabList.filter(tab => tab.url === pageCurTab.url);
    }
    baseSwitchInit();
}

function baseSwitchInit() {
    browser.commands.onCommand.addListener(cmd => {
        switch(cmd) {
            case GLOBAL.COMMAND.PREV_TAB_LAST: focusTab(-1); break;
            case GLOBAL.COMMAND.NEXT_TAB_LAST: focusTab(+1); break;
            case GLOBAL.COMMAND.PREV_TAB_SITE: focusTab(-1); break;
            case GLOBAL.COMMAND.NEXT_TAB_SITE: focusTab(+1); break;
        }
    });
    document.addEventListener('keyup', (e) => {
        /*
        Chrome：快捷键必须包含 Ctrl 或 Alt（Mac 上是 Command 或 MacCtrl）。Shift 是可选的修饰键，不能单独使用。
        Firefox：要求类似，组合键必须包含一个非 Shift 的修饰键（Ctrl、Alt、Command 或 MacCtrl），Shift 可以作为附加修饰符，但不能是唯一修饰键。
        */
        if (!e.altKey && !e.ctrlKey) {
            jumpToTab();
        };
    });
    fillTabList(pageTabList);
}

function tabSearchInit() {
    let inputDom = document.getElementById('tabInput')
    document.onkeydown = e => {
        switch(e.code) {
            case 'ArrowUp':   focusTab(-1); break;
            case 'ArrowDown': focusTab(+1); break;
            case 'Enter': jumpToTab(); break;
            default: return;
        }
        e.preventDefault();
    }
    inputDom.style.display = '';
    inputDom.oninput = e => filterTab(e.target.value);
    inputDom.focus();
    fillTabList(pageTabList);
}

function filterTab(key) {
    if (!(key = key.trim())) {
        fillTabList(pageTabList);
        return;
    }
    let tabList = [];
    let keySp = hl_keys(key);
    for(let tab of pageTabList) {
        if (!hl_check(keySp, tab.title, tab.url)) continue;
        tab.titleHtml = hl_replace(tab.title, keySp);
        tab.urlHtml = hl_replace(tab.url, keySp);
        tabList.push(tab);
    }
    fillTabList(tabList);
}

// 处理 keys, 排除包含
function hl_keys(keys) {
    keys = keys.toLowerCase().split(' ');
    for (let i = 0; i < keys.length - 1; i++) {
        if (!keys[i]) continue;
        for (let j = i + 1; j < keys.length; j++) {
            if (!keys[j]) continue;
            if (keys[i].indexOf(keys[j]) >= 0) {
                keys[j] = '';
            }
        }
    }
    return keys.filter(k => k);
}

/**
 * 校验 strs中任意一个有key都ok
 * @test hl_check_arr([], s1, s2)
 * @param hl_key_arr ['str1', 'str2'], 要全部存在才行
 * @return bool
 */
function hl_check(hl_key_arr, title, url) {
    title = title.toLowerCase();
    url = url.toLowerCase();
    for(let k of hl_key_arr) {
        if (title.indexOf(k) < 0 && url.indexOf(k) < 0) return false;
    }
    return true;
}

/**
 * 只管高亮（不区分大小写）
 * @param hl_key_arr = hl_keys(keystr), 全小写
 * @return array, 如果需要字符串, 调用 .join('');
 */
function hl_replace(str_origin, hl_key_arr, hl_start = '<hl>', hl_end = '</hl>') {
    let str_lower = str_origin.toLowerCase();
    let key_bit = new Array(str_lower.length).fill(0), key_idx;
    for (let k of hl_key_arr) {
        key_idx = -1;
        while((key_idx = str_lower.indexOf(k, key_idx + 1)) >= 0) {
            // 设置匹配到的标志位为1
            key_bit.fill(1, key_idx, key_idx + k.length);
        }
    }
    let res = [], prev_bit = 0;
    // 合并 且 加上高亮字符串
    for (let i = 0; i < str_lower.length; i++) {
        // 原始字符 对位到 结果数组
        res[i] = str_origin[i];
        // 前后相同 无需额外操作
        if (key_bit[i] == prev_bit) continue;
        // 根据后一位0/1判断追加的是头还是尾
        res[i] = (key_bit[i] == 0 ? hl_end : hl_start ) + str_origin[i];
        prev_bit = key_bit[i];
    }
    // 尾部补漏
    if (key_bit[key_bit.length-1] == 1) {
        res[res.length-1] += hl_end; 
    }
    return res ? res.join('') : '';
}

/**
 * @param showOrigin: 显示原字符
 */
function fillTabList(tabList) {
    curTabList = tabList;
    // 根据active排序: 第一个肯定是当前页, 这条能用
    // 其他情况: 避开当前页是0位置的情况即可
    pageTabIdx = (curTabList.length > 1 && pageCurTab.id == curTabList[0].id) ? 1 : 0;
    // 是否为过滤列表
    let isOrigin = tabList == pageTabList
    let domStr = '';
    for (var i = 0; i < tabList.length; i++) {
        if (isOrigin) {
            tabList[i].urlHtml = '';
            tabList[i].titleHtml = '';
        }
        domStr += `<div id="tab-item-${i}" 
            class="ly-hotkey-tabs-tab ${tabList[i].id == pageCurTab.id ? 'cur-tab ' : ''} ${pageTabIdx == i ? SELECT_CLASS : ''}"
        >
            <img src="${tabList[i].favIconUrl || GLOBAL.IMG.TAB_ICON_WHITE}"/>
            <div class="ly-hotkey-tabs-name">${tabList[i].titleHtml || tabList[i].title}</div>
            <div class="ly-hotkey-tabs-url">${tabList[i].urlHtml || tabList[i].url}</div>
        </div>`;
    }
    document.getElementById('tabList').innerHTML = domStr;
    let tabItemDoms = document.querySelectorAll('#tabList > div');
    for (var i = 0; i < tabItemDoms.length; i++) {
        let j = i;
        tabItemDoms[i].onclick = e => jumpToTab(j);
    };
}

function focusTab(offset) {
    if (!offset || 0 == offset) return;
    document.getElementById('tab-item-' + pageTabIdx).classList.remove(SELECT_CLASS);
    pageTabIdx = (pageTabIdx + offset + curTabList.length) % curTabList.length;
    document.getElementById('tab-item-' + pageTabIdx).classList.add(SELECT_CLASS);
    // 焦点超出后 自动回归视野
    document.getElementById('tab-item-' + pageTabIdx).scrollIntoView({ block: 'nearest' ,   behavior: 'smooth',});
}

function jumpToTab(tabIdx = pageTabIdx) {
    if (curTabList[tabIdx]) {
        gotoTab(curTabList[tabIdx].id);
    }
    window.close();
}