var GLOBAL = {
    CONTAINER_ID: "ly_translate_en2ch",
    EVENT: {
        SRC: "SRC", // 触发翻译事件
        CHECK_BOX: "CHECK_BOX",
        TRANSLATE: "TRANSLATE",
        TRANSLATE_RESULT: "TRANSLATE_RESULT",
    },
    EXCLUDE_DOMAIN_CACHE_KEY: 'ly_translate_EXCLUDE_DOMAIN_CACHE_KEY',
    CONFIG_CACHE_KEY: 'ly_translate_CONFIG_CACHE_KEY',
    OPTIONS_KEY: "",
    LAN1: 'EN',
    LAN_CHECK: {
        // 当前语言: [转换到哪个语言, regex, 占用宽度, ollama提示词]
        EN: ["zh-CN", /^[a-zA-Z]+$/, 1, "将以下英文翻译为中文,只要结果:"],
        CH: ["en", /[\u4e00-\u9fff]/, 2, "将以下中文翻译为英文,只要结果:"],
        JP: ["zh-CN", /[\u3040-\u30ff]/, 2, "将以下日文翻译为中文,只要结果:"],
    }
};

/**
 * @param exclude_domain: 换行分割
 */
async function checkIfExclude(storageKey, func) {
    let domains = await storageGet(storageKey);
    if (val) {
        // options.html 中 name
        val = JSON.parse(val).exclude_domain;
        if (val && `\n${val}\n`.indexOf(`\n${location.hostname}\n`) >= 0)
            return;
    }
    func();
}

// ==================================================================
// ============ v3_api ==============================================
// ==================================================================

function sendToBackground(event, data) {
    browser.runtime.sendMessage({event, data}, {})
        // .then(e => console.log(e))
        .catch(e => console.log(e))
    ;
}

function addMessageListener(listener) {
    browser.runtime.onMessage.addListener(listener);
}

async function forwardToActiveTab(message) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await browser.tabs.sendMessage(tab.id, message);
}

async function sendToActiveTab(event, data) {
    forwardToActiveTab({event, data});
}

async function getActiveTab() {
    return (await browser.tabs.query({ active: true, lastFocusedWindow: true }))[0];
}

function uuid() {
    // 不好用 http站点没这个函数
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID().replaceAll('-', '');
    }
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let radix = chars.length, uuid = '', i;
    len = 32;
    for (i = 0; i < len; i++) uuid += chars.charAt(0 | Math.random() * radix);
    return uuid;
}

function storageSet(k, v) {
    return browser.storage.local.set({[k]: v});
}

async function storageGet(k) {
    return (await browser.storage.local.get([k]))[k];
}