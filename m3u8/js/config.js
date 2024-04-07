window.onbeforeunload = ev => {
    sessionStorage.config = document.getElementById('ly_m3u8_config').value || '';
}

if (sessionStorage.config) {
    document.getElementById('ly_m3u8_config').value = sessionStorage.config;
    showMsg("info", "配置已从 session 加载");
} else {
    storageGet(["ly_m3u8_options"], res => {
        if (!res['ly_m3u8_options']) return;
        document.getElementById('ly_m3u8_config').value = res['ly_m3u8_options'];
        showMsg("info", "配置已从 storage 加载")
    });
}

document.getElementById('ly_m3u8_save').onclick = function (e) {
    let text = document.getElementById('ly_m3u8_config').value;
    storageSet({"ly_m3u8_options": text});
    showMsg("info","保存完成");
}

function showMsg(type, str) {
    var msg = document.getElementById('ly_m3u8_msg');
    msg.innerHTML = str;
    switch (type) {
        case "info": msg.style.color = "#00ffd0fa"; break;
        case "error": msg.style.color = "#ff3333fa"; break;
        case "warn": msg.style.color = "#FFE433"; break;
    }
}
