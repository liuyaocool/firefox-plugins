addMessageListener((method, data, sender, resp) => {
    switch(method) {
        case "VIDEO_CAPTURE": 
            console.log(data);
            break;
    }
});

(function() {
    let curVdo;
    const CONTEXT_ID = 'ly-video-context', CONTEXT_W = 100,
        DOM_TYPE = {
            "VIDEO": 'VIDEO'
        };
    pageEscListener(() => {
        rmvContext(CONTEXT_ID);
    });
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
                    // console.log(vdos[i]);
                    break;
                }
            }    
        }
        if (curVdo) {
            addContext(CONTEXT_ID, e.x, e.y, CONTEXT_W, curVdo);
        }
        // console.log(`${e.x} ${e.y}`);
    });


    function rmvContext(id) {
        let a = document.getElementById(id);
        if (a) a.remove();
    }
    function addContext(id, x, y, w, dom) {
        let div = document.createElement('div');
        div.id = id;
        div.style.width = w + 'px';
        div.style.top = y + 'px';
        div.style.left = (x - w) + 'px';
        switch(dom.tagName) {
            case "VIDEO":
                div.innerHTML += `
                <div ly_video_tool_func="ly_video_capture">Capture</div>
                ${dom.classList.contains('ly-video-full-screen') 
                    ? '<div ly_video_tool_func="ly_video_unfull">Page UnFull</div>'
                    : '<div ly_video_tool_func="ly_video_full">Page Full</div>'
                }
                `;
                break;
            default: return;
        }
        document.body.appendChild(div);
    }
})()

function unfull(video) {
    video.classList.remove('ly-video-full-screen');
    video.removeEventListener("mouseenter", vdoMouseEnter)
    document.body.classList.remove('ly-video-no');
    if ('false' == video.getAttribute('ly_video_has_controls')) {
        video.removeAttribute('controls');
    }
}

function full(video) {
    document.body.classList.add('ly-video-no');
    video.classList.add('ly-video-full-screen');
    video.addEventListener("mouseenter", vdoMouseEnter)
}

function vdoMouseEnter(e) {
    addControls(e.target);
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