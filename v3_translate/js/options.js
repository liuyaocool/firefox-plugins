window.onbeforeunload = ev => {
    sessionStorage.config = config.value || '';
    sessionStorage.ollama_api = ollama_api.value || '';
    sessionStorage.ollama_model = ollama_model.value || '';
}

if (sessionStorage.config) {
    config.value = sessionStorage.config;
    ollama_api.value = sessionStorage.ollama_api;
    ollama_model.value = sessionStorage.ollama_model;
} else {
    storageGet(GLOBAL.OPTIONS_KEY).then(val => config.value = val || '');
    storageGet(GLOBAL.OLAMA_CACHE_KEY.API).then(val => ollama_api.value = val || '');
    storageGet(GLOBAL.OLAMA_CACHE_KEY.MODEL).then(val => ollama_model.value = val || '');
}

add_this.onclick = e => {
    getActiveTab().then(tab => {
        let a = new URL(tab.url);
        if (config.value.split('\n').indexOf(a.hostname) >= 0) {
            return;
        }
        config.value = `${config.value}\n${a.hostname}`.trim();
    })
}

rm_this.onclick = e => {
    getActiveTab().then(tab => {
        let a = new URL(tab.url);
        let val = `\n${config.value}\n`;
        let host = `\n${a.hostname}\n`;
        if (val.indexOf(host) < 0) {
            return;
        }
        config.value = val.replaceAll(host, '\n').trim();
    })
}

save.onclick = e => {
    storageSet(GLOBAL.OPTIONS_KEY, config.value);
    storageSet(GLOBAL.OLAMA_CACHE_KEY.API, ollama_api.value);
    storageSet(GLOBAL.OLAMA_CACHE_KEY.MODEL, ollama_model.value);
}