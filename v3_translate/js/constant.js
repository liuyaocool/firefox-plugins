var GLOBAL = {
    CONTAINER_ID: 'ly_translate_en2ch',
    EVENT: {
        SRC: "SRC", // 触发翻译事件
        ADD_BOX: "ADD_BOX", // 开始翻译 添加结果盒子
        ADD_BOX_BODY: "ADD_BOX_BODY", // 向结果盒子添加结果
        BOX_BULING: "BOX_BULING", // 盒子 闪烁
    },
    LAN_PAT: {
        en: [/^[a-zA-Z]+$/, 'ch'],
        ch: [/[\u4e00-\u9fff]/, 'en'],
        jp: [/[\u3040-\u30ff]/, 'ch'],
    },
};