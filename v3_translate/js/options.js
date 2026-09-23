window.onbeforeunload = ev => {
    sessionStorage.config = JSON.stringify(form2Json(main_form));
}

(async function() {
    let str = '';
    if (!(str = sessionStorage.config)) {
        str = await storageGet(GLOBAL.CONFIG_CACHE_KEY);
    }
    console.log(await storageGet(GLOBAL.EXCLUDE_DOMAIN_CACHE_KEY))
    if (str) {
        json2Form(main_form, JSON.parse(str));
    };
})()


add_this.onclick = e => {
    getActiveTab().then(tab => {
        let a = new URL(tab.url);
        if (exclude_domain.value.split('\n').indexOf(a.hostname) >= 0) {
            return;
        }
        exclude_domain.value = `${exclude_domain.value}\n${a.hostname}`.trim();
    })
}

rm_this.onclick = e => {
    getActiveTab().then(tab => {
        let a = new URL(tab.url);
        let val = `\n${exclude_domain.value}\n`;
        let host = `\n${a.hostname}\n`;
        if (val.indexOf(host) < 0) {
            return;
        }
        exclude_domain.value = val.replaceAll(host, '\n').trim();
    })
}

save.onclick = e => {
    let formJson = form2Json(main_form);
    storageSet(GLOBAL.CONFIG_CACHE_KEY, JSON.stringify(formJson));
    storageSet(GLOBAL.EXCLUDE_DOMAIN_CACHE_KEY, formJson.exclude_domain);
}

function json2Form(formd, json) {
    for(let input of formd) {
        if (input.name) {
            input.value = json[input.name] || '';
        }
    }
}

function form2Json(formd) {
    let formData = new FormData(formd), data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    return data;
}