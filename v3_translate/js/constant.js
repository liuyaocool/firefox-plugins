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