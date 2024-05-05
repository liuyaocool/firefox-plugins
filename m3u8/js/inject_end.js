checkIfExclude(location.host, () => {
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

    // <button id="m3u8_stream_down_btn">下载(流)</button>
    // document.getElementById('m3u8_stream_down_btn').onclick = e => {
    //     downClick(true);
    // }

    httpUtil = document.createElement('div');
    httpUtil.id = 'ly_m3u8_top_btns'
    httpUtil.innerHTML = `
        <button id="ly-m3u8-btn-open">m3u8下载</button>
        <button id="ly-m3u8-btn-exclude">排除本域名</button>
        <button id="ly-m3u8-btn-open-page">新窗打开本页</button>
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
    document.getElementById('ly-m3u8-btn-exclude').onclick = e => {
        storageGet(["ly_m3u8_options"], res => {
            let config = res['ly_m3u8_options'] || '';
            config += `\n${location.host}`;
            storageSet({"ly_m3u8_options": config});
        });
    }

    function downClick(isStream) {
        let link = document.getElementById('m3u8_link').value;
        link && M3U8_MAP[link] && M3U8_MAP[link].startDownload(isStream);
    }

    function m3u8BtnRefresh() {
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

    console.log("m3u8_end 插件已监听消息");
});