(function() {
    let dom = document.createElement('div');
    dom.id = 'ly_missav_capture';
    dom.innerText = '截图';
    document.body.appendChild(dom);
    document.getElementById('ly_missav_capture').onclick = function() {
        capture(document.getElementsByClassName('player')[0]);
    }
})()

function capture(video) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // 设置 canvas 尺寸为 video 尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // 将视频的当前帧绘制到 canvas 上
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'frame.png';
        a.click();
        URL.revokeObjectURL(url); // 释放对象URL
    });
}
console.log('work missav inject');