var GLOBAL = {
    CONTAINER_ID: "ly_translate_en2ch",
    EVENT: {
        SRC: "SRC", // 触发翻译事件
        TRANSLATE: "TRANSLATE",
        TRANSLATE_RESULT: "TRANSLATE_RESULT",
    },
    LAN: {
        CH: "CH",
        EN: "EN",
        JP: "JP",
    },
    LAN_CHECK: [
        // [转换到哪个语言 LAN, regex]
        ["CH", /^[a-zA-Z]+$/],
        ["EN", /[\u4e00-\u9fff]/], // 中文
        ["CH", /[\u3040-\u30ff]/], // 日文
    ],
};

function checkAndGetToLan(str) {
    if (str.indexOf('http://') == 0
        || str.indexOf('https://') == 0
    ) return '';
    let lanCount = {};
    for (let i = 0; i < str.length; i++) {
        GLOBAL.LAN_CHECK.forEach(la => {
            if (!la[1].test(str.charAt(i))) return;
            if (!lanCount[la[0]]) lanCount[la[0]] = 0;
            lanCount[la[0]]++;
        });
    }
    let maxLan;
    for(var k in lanCount) {
        if (!maxLan) {
            maxLan = k;
            continue;
        }
        maxLan = lanCount[k] > lanCount[maxLan] ? k : maxLan;
    }
    return maxLan;
}