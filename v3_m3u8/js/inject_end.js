const M3U8_NOT = ['js', 'css', 'ts', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'woff2', 'ts', 'svg', 'json', 'html'];
const M3U8_MAP = {};
const SOURCE_TYPE = {
    M3U8: 'application/vnd.apple.mpegurl',
    MP4: 'video/mp4',
    WEBM: 'video/webm'
};
let httpUtil = document.createElement('table');
httpUtil.id = 'm3u8-main';
httpUtil.style.display = 'none';
httpUtil.innerHTML = `
    <tr>
        <td style="width:60px;">
            <button class="ly-m3u8-btn" id="m3u8_down_btn">下载</button>
            <button class="ly-m3u8-btn" id="ly_m3u8_save_btn">保存</button>
            <button class="ly-m3u8-btn" id="m3u8_refresh_btn">刷新</button>
        </td>
        <td style="height:100px;">
            <div id="m3u8_down_list" style="height: 100%;overflow: auto;"></div>
        </td>
    </tr>
    <tr style="height:36px;">
        <td><button class="ly-m3u8-btn" id="ly_m3u8_add_btn">添加</button></td>
        <td><input id="ly_m3u8_add_input" type="text" placeholder="输入m3u8链接添加到列表"
            style="width: 100%;background: transparent;color: #ecc90d;outline: none;"></td>
    </tr>
    <tr><td colspan="2" style="height: 60px;">
        <textarea id="m3u8_link" readonly placeholder="这里显示链接"></textarea>
    </td></tr>
    <tr class="border"><td colspan="2" style="position: relative;">
        <div id="m3u8_response"></div>
        <div id="m3u8_segments"></div>
    </td></tr>
`;
document.body.appendChild(httpUtil);

document.getElementById('m3u8_refresh_btn').onclick = e => {
    m3u8BtnRefresh();
}

document.getElementById('m3u8_down_btn').onclick = e => {
    downClick();
}

document.getElementById('ly_m3u8_save_btn').onclick = e => {
    saveClick();
}

document.getElementById('ly_m3u8_add_btn').onclick = e => {
    addM3u8(document.getElementById('ly_m3u8_add_input').value, SOURCE_TYPE.M3U8);
    m3u8BtnRefresh();
}

httpUtil = document.createElement('div');
httpUtil.id = 'ly_m3u8_top_btns'
httpUtil.innerHTML = `
    <button id="ly-m3u8-btn-open">m3u8</button>
    <button id="ly-m3u8-btn-open-page">open child</button>
`;
document.body.appendChild(httpUtil);
document.getElementById('ly-m3u8-btn-open').onclick = e => {
    var aa = document.getElementById('m3u8-main').style;
    if (aa.display == 'none') {
        aa.display = '';
        m3u8BtnRefresh();
    } else {
        aa.display = 'none';
    }
}
document.getElementById('ly-m3u8-btn-open-page').onclick = e => {
    window.open(location.href);
}

function addM3u8(url, contentType) {
    if (M3U8_MAP[url]) return;
    console.log(url);
    switch (contentType) {
        case SOURCE_TYPE.M3U8:
            M3U8_MAP[url] = new M3u8Handler(url, getName()).init();
            break;
        case SOURCE_TYPE.MP4:
        case SOURCE_TYPE.WEBM:
            M3U8_MAP[url] = new Mp4Handler(url, getName());
            break;
        default:
    }
}

function getName() {
    try {
        return window.top == window ? window.document.title : window.top.document.title;
    } catch (e) {
        return 'video';
    }
}

function saveClick() {
    let link = document.getElementById('m3u8_link').value;
    link && M3U8_MAP[link] && M3U8_MAP[link].save();
}

function downClick() {
    let link = document.getElementById('m3u8_link').value;
    link && M3U8_MAP[link] && M3U8_MAP[link].startDownload();
}

function m3u8BtnRefresh() {
    // add m3u8
    let url, urll, res = window.performance.getEntriesByType('resource');
    for (let i = 0; i < res.length; i++) {
        url = res[i].name;
        if (M3U8_MAP[url]) continue;
        urll = new URL(url);
        switch(res[i].initiatorType) {
            case "xmlhttprequest":
                if(urll.pathname.endsWith('.m3u8')) {
                    M3U8_MAP[url] = new M3u8Handler(url, getName()).init();
                } else {
                    handleOther(url, urll.pathname);
                }
                break;
            case "other":
                if(urll.pathname.endsWith('.webm') || urll.pathname.endsWith('.mp4')) {
                    M3U8_MAP[url] = new Mp4Handler(url, getName());
                } else {
                    handleOther(url, urll.pathname);
                }
                break;
            case "video":
                M3U8_MAP[url] = new Mp4Handler(url, getName());
                break;
        }
    }

    let tmp = '', i = 0;
    for (const url in M3U8_MAP) {
        if ('demo' == M3U8_MAP[url].type) continue;
        tmp += `<button id="${url}" class="${M3U8_MAP[url].class}">${i++}:${M3U8_MAP[url].type}</button>`;
    }
    document.getElementById('m3u8_down_list').innerHTML = tmp;
    tmp = document.getElementById('m3u8_down_list').children;
    for (i = 0; i < tmp.length; i++) {
        tmp[i].onclick = e => {
            M3U8_MAP[e.target.id].showInfo();
        }
    }
}

function handleOther(url, path) {
    for (let i = 0; i < M3U8_NOT.length; i++) {
        if(path.endsWith(`.${M3U8_NOT[i]}`)) {
            return;
        }
    }
    console.log(`m3u8 check url: ${url}`);
    singleRequest('HEAD', url, function(xhr, e) {
        let type = xhr.getResponseHeader('Content-Type');
        switch (type) {
            case SOURCE_TYPE.M3U8:
                M3U8_MAP[url] = new M3u8Handler(url, getName()).init();
                return;
            case SOURCE_TYPE.MP4:
            case SOURCE_TYPE.WEBM:
                M3U8_MAP[url] = new Mp4Handler(url, getName());
                return;
            default:
                if (type.indexOf('video/') >= 0) break;
                if (type.indexOf('application/javascript') >= 0) break;
                singleRequest('GET', url, (getXhr, getEv) => {
                    let status = getXhr.status;
                    if (status < 200 || status > 300) {
                        console.log(`m3u8 check url fail(${status}): ${url}`);
                        return;               
                    }
                    if (getXhr.response.startsWith('#EXTM3U')) {
                        M3U8_MAP[url] = new M3u8Handler(url, getName()).init(getXhr.response);
                    }
                });
        }
    });
}

function singleRequest(method, url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) callback(xhr, e);
    }
    xhr.send();
}

console.log("m3u8_end 插件已监听消息");
