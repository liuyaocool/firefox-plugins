if(window.parent != window) {
    let btn = document.createElement('div');
    btn.style = 'position: fixed; top: 0; width: 100%; z-index: 99999999; text-align: center;';
    btn.innerHTML = '<button id="ly_work_open_frame" style="line-height:12px;">新窗打开</button>';
    document.body.appendChild(btn);
    document.getElementById('ly_work_open_frame').onclick = e => {
        window.open(location.href);
    }
}