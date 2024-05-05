const M3U8_NOT = ['js', 'css', 'ts', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'woff2', 'ts', 'svg', 'json', 'html'];
const M3U8_MAP = {};
let httpUtil = document.createElement('div');
httpUtil.id = 'm3u8-main';
httpUtil.style.display = 'none';
httpUtil.innerHTML = `
    <div id="m3u8_down_list"></div>
    <textarea id="m3u8_link" readonly placeholder="这里显示链接"></textarea>
    <div id="m3u8_btns">
        <button id="m3u8_down_btn">下载</button>
        <button id="m3u8_refresh_btn">刷新</button>
    </div>
    <div id="m3u8_response"></div>
    <div id="m3u8_segments"></div>
`;
document.body.appendChild(httpUtil);

document.getElementById('m3u8_refresh_btn').onclick = e => {
    m3u8BtnRefresh();
}

document.getElementById('m3u8_down_btn').onclick = e => {
    downClick(false);
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
        case 'application/vnd.apple.mpegurl':
            M3U8_MAP[url] = new M3u8Handler(url, getName()).init();
            break;
        case 'video/mp4':
        case 'video/webm':
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

function downClick(isStream) {
    let link = document.getElementById('m3u8_link').value;
    link && M3U8_MAP[link] && M3U8_MAP[link].startDownload(isStream);
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
            case 'application/vnd.apple.mpegurl':
                M3U8_MAP[url] = new M3u8Handler(url, getName()).init();
                return;
            case 'video/mp4':
            case 'video/webm':
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
