addMessageListener((method, data, sender, resp) => {
    switch(method) {
        case "VIDEO_CAPTURE": 
            console.log(data);
            break;
    }
});

(function() {
    let curVdo;
    const CONTEXT_ID = 'ly-video-context',
        DOM_TYPE = {
            "VIDEO": 'VIDEO'
        };
    pageEscListener(escPress);
    document.addEventListener('click', e => {
        let func = e.target.getAttribute('ly_video_tool_func');
        rmvContext(CONTEXT_ID);
        if (!func) return;
        switch(func) {
            case "ly_video_capture": capture(curVdo); break;
            case "ly_video_full": full(curVdo); break;
            case "ly_video_unfull": unfull(curVdo); break;
        }
    });
    document.body.addEventListener('contextmenu', e => {
        rmvContext(CONTEXT_ID);
        console.log(e.target);
        if ('VIDEO' == e.target.tagName) {
            curVdo = e.target;
        } else {
            curVdo = null;
            let vdos = document.getElementsByTagName('video');
            for (let i = 0, rect; i < vdos.length; i++) {
                rect = vdos[i].getClientRects()[0];
                if (rect && rect.x < e.x && e.x < (rect.x + rect.width) 
                    && rect.y < e.y && e.y < (rect.y + rect.height)) {
                    curVdo = vdos[i];
                    break;
                }
            }
        }
        if (curVdo) {
            addContext(CONTEXT_ID, e.x, e.y, curVdo);
        }
    });

    function rmvContext(id) {
        let a = document.getElementById(id);
        if (a) a.remove();
    }
    function addContext(id, x, y, dom) {
        let div = document.createElement('div');
        div.id = id;
        div.style.top = y + 'px';
        div.style.right = (window.innerWidth - x) + 'px';
        switch(dom.tagName) {
            case "VIDEO":
                div.innerHTML += `
                <div ly_video_tool_func="ly_video_capture">截图</div>
                ${dom.classList.contains('ly-video-full-screen') 
                    ? '<div ly_video_tool_func="ly_video_unfull">退出全屏</div>'
                    : '<div ly_video_tool_func="ly_video_full">页面全屏</div>'
                }
                <div onclick="this.parentElement.remove()">关闭菜单</div>
                `;
                break;
            default: return;
        }
        document.body.appendChild(div);
    }

    function unfull(video) {
        // document.body.classList.remove('ly-video-no');
        video.classList.remove('ly-video-full-screen');
        video.removeEventListener("mouseenter", vdoMouseEnter);
        rmControls(video);
        replaceSign(video);
    }

    function full(video) {
        // document.body.classList.add('ly-video-no');
        addSign(video);
        video.classList.add('ly-video-full-screen');
        video.remove();
        document.body.appendChild(video);
        video.addEventListener("mouseenter", vdoMouseEnter);
    }

    function vdoMouseEnter(e) {
        addControls(e.target);
    }

    function rmControls(video) {
        if ('false' == video.getAttribute('ly_video_has_controls')) {
            video.removeAttribute('controls');
        }
    }
    function addControls(video) {
        let has = video.hasAttribute('ly_video_has_controls');
        if (video.hasAttribute('controls')) {
            if (!has) video.setAttribute('ly_video_has_controls', "true");
        } else {
            video.setAttribute('controls', "true");
            if (!has) video.setAttribute('ly_video_has_controls', "false");
        }
    }

    function escPress() {
        rmvContext(CONTEXT_ID);
    }

})()

function addSign(dom) {
    let sp = document.createElement('span');
    sp.id = 'ly-video-vdodom-sign';
    dom.parentNode.insertBefore(sp, dom);
}

function replaceSign(dom) {
    let sign = document.getElementById('ly-video-vdodom-sign');
    sign.parentNode.insertBefore(dom, sign);
    sign.remove();
}

function capture(video) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'frame.png';
        a.click();
        URL.revokeObjectURL(url); // 释放对象URL
    });
}

function addMessageListener(listener) {
    browser.runtime.onMessage.addListener(
        (req, sender, resp) => listener(req.method, req.data, sender, resp)
    );
}

function pageEscListener(listener) {
    let func = () => listener();
    window.addEventListener('blur', func);
    document.addEventListener('scroll', func); 
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') listener();
    });
    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') listener();
    });
}

console.log('video tool injected');