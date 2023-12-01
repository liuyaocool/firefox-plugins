document.getElementById('ly_proxy_config').onblur = e => {
    if (!e.target.value) return;
    try {
        e.target.value = JSON.stringify(JSON.parse(e.target.value), null, 4);
        showMsg('I', "格式化完成");
    } catch (e) {
        showMsg('E', "格式化失败: " + e);
    }
};

let cacheIds = [STORE_KEY_CONFIG, 'ly_proxy_remote_url'];
window.onbeforeunload = ev => {
    sessionStorage.sign = 1;
    cacheIds.forEach(id => sessionStorage[id] = document.getElementById(id).value) || '';
}
if (sessionStorage[cacheIds[0]]) {
    cacheIds.forEach(id => document.getElementById(id).value = sessionStorage[id]);
    showMsg('I', "配置已从 session 加载");
} else {
    browser.storage.local.get(cacheIds).then(res => {
        if (!res) return;
        for (let id in res) document.getElementById(id).value = res[id];
        showMsg('I', "配置已从 storage 加载");
    });
}

document.getElementById('ly_proxy_save').onclick = e => {
    try {
        let text = document.getElementById('ly_proxy_config').value;
        browser.runtime.sendMessage({type: 'save_proxy', data: text});
        let saveObj = {};
        saveObj[STORE_KEY_CONFIG] = text;
        browser.storage.local.set(saveObj);
        showMsg('I',"保存完成");
    } catch (e) {
        showMsg('E', "保存失败: " + e);
    }
}

document.getElementById('ly_proxy_temp').onclick = e => {
    getConfig(browser.runtime.getURL('config.json'), resp => {
        document.getElementById('ly_proxy_config').value = resp;
        showMsg('I', '已加载本地配置模板, 请点击保存');
    });
}

document.getElementById('ly_proxy_remote_url').onblur = e => {
    browser.storage.local.set({'ly_proxy_remote_url': e.target.value});
};

document.getElementById('ly_proxy_remote').onclick = e => {
    let url = document.getElementById('ly_proxy_remote_url').value;
    if (!url) {
        showMsg('E', '远程配置url 为空');
        return;
    }
    getConfig(url, resp => {
        document.getElementById('ly_proxy_config').value = resp;
        showMsg('I', '已加载远程配置, 请点击保存');
    }, failResp => {
        showMsg('E', failResp);
    });
}

document.getElementById('ly_proxy_check_proxy').oninput = e => {
    if (!e.target.value) {
        showMsg('I', '');
        return;
    }
    let cfg = handleConfig(document.getElementById('ly_proxy_config').value);
    showMsg('I', JSON.stringify(matchProxy(e.target.value.split('.'), cfg)));
}

function getConfig(url, success, fail) {
    if (!url) return;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                success && success(xhr.response);
            } else {
                fail && fail(xhr.response);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send(null);
}

function showMsg(type, str) {
    var msg = document.getElementById('ly_proxy_msg');
    msg.innerHTML = str;
    switch (type) {
        case "I": msg.style.color = "#00ffd0fa"; break;
        case "E": msg.style.color = "#ff3333fa"; break;
    }
}