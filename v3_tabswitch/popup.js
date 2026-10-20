let pageTabList, pageCurTab, curTabList, pageTabIdx;
const SELECT_CLASS = 'ly-hotkey-select';
(async function() {
    pageCurTab = await getActiveTab();
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

async function tabLastInit() {
    pageTabList = await browser.tabs.query({"lastFocusedWindow": true});
    pageTabList.sort((a, b) => b.lastAccessed - a.lastAccessed);
    baseSwitchInit();
}

async function tabSiteInit() {
    let startStr = null, idx, startDomain = ['https://', 'http://', 'file://', 'moz-extension://'];
    let tabList = await browser.tabs.query({"lastFocusedWindow": true});
    // pageTabList = await browser.tabs.query({
    //     lastFocusedWindow: true,
    //     url: `*://${new URL(pageCurTab.url).hostname}/*`
    // });
    for(let start of startDomain) {
        if (pageCurTab.url.indexOf(start) < 0) {
            continue;
        }
        startStr = pageCurTab.url.substring(0, pageCurTab.url.indexOf('/', start.length) + 1);
        pageTabList = tabList.filter(tab => tab.url.startsWith(startStr));
        break;
    }
    if ( !pageTabList && pageCurTab.url.startsWith('about:') ) {
        pageTabList = tabList.filter(tab => tab.url === pageCurTab.url);
    }
    if ( !pageTabList ) {
        pageTabList = tabList;
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

async function tabSearchInit() {
    pageTabList = await browser.tabs.query({"lastFocusedWindow": true});
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
    setTimeout(() => inputDom.focus(), 500);
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
        let titleHtml = hl_replace(tab.title, keySp);
        let urlHtml = hl_replace(tab.url, keySp);
        if (!titleHtml && !urlHtml) continue;
        tab.titleHtml = titleHtml ? titleHtml.join('') : '';
        tab.urlHtml = urlHtml ? urlHtml.join('') : '';
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
    return keys;
}

/**
 * 匹配并高亮
 * @param hl_key_arr = hl_keys(keystr), 全小写
 * @return array, 如果需要字符串, 调用 .join('');
 */
function hl_replace(line_origin, hl_key_arr, hl_start = '<hl>', hl_end = '</hl>') {
    let line = line_origin.toLowerCase();
    let key_bit = new Array(line.length).fill(0), key_idx;
    for (let k of hl_key_arr) {
        if (!k) continue;
        // 不存在k 返回
        if ((key_idx = line.indexOf(k)) < 0) return null;
        do {
            // 设置匹配到的标志位为1
            for (let i = 0; i < k.length; i++) {
                key_bit[key_idx + i] = 1;
            }
            // 没有下一个跳出循环
        } while ((key_idx = line.indexOf(k, key_idx + 1)) >= 0)
    }
    let res = [], prev_bit = 0;
    // 合并 且 加上高亮字符串
    for (let i = 0; i < line.length; i++) {
        // 原始字符 对位到 结果数组
        res[i] = line_origin[i];
        // 前后相同 无需额外操作
        if (key_bit[i] == prev_bit) continue;
        // 根据后一位0/1判断追加的是头还是尾
        res[i] = (key_bit[i] == 0 ? hl_end : hl_start ) + line_origin[i];
        prev_bit = key_bit[i];
    }
    // 尾部补漏
    if (key_bit[key_bit.length-1] == 1) {
        res[res.length-1] += hl_end; 
    }
    return res;
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