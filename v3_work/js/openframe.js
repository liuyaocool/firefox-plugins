if(window.parent != window) {
    let btn = document.createElement('div');
    btn.style = 'position: fixed; top: 0; z-index: 99999999;left:calc(50% - 31px);';
    btn.innerHTML = '<button id="ly_work_open_frame" style="line-height:12px;">新窗打开</button>';
    document.body.appendChild(btn);
    document.getElementById('ly_work_open_frame').onclick = e => {
        window.open(location.href);
    }
}