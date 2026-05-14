window.onbeforeunload = ev => {
    sessionStorage.config = config.value || '';
}

if (sessionStorage.config) {
    config.value = sessionStorage.config;
} else {
    storageGet(GLOBAL.OPTIONS_KEY).then(val => {
        if (!val) return;
        config.value = val;
    });
}

save.onclick = e => {
    storageSet(GLOBAL.OPTIONS_KEY, config.value);
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