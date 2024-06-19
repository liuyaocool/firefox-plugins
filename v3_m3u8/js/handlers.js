class M3u8Handler {
    constructor(url, name) {
        this.url = url;
        this.name = name + '.ts';
        this.type = 'm3u8';
        this.class = 'ly-m3u8-m3u8';
        this.m3u8RespHtml = '';
        this.m3u8Status = -1;
        this.tsUrls = []; // 分段链接地址
        this.tsFiles = []; // ts分段文件
        this.downloadCount = 0; // 下载个数
        this.downloadIndex = 0; // 下一个需要下载的下标
        this.saveIndex = 0; // 下一个需要保存的下标
        this.fileWriter = null;
        this.aesMethod = null;
        this.aesKey = null;
        this.aesIv = null;
        this.decryptor = new Decryptor(url);
    }

    init(m3u8Str) {
        if (m3u8Str) {
            this.handle(m3u8Str);
        } else {
            this.getM3u8Content();
        }
        return this;
    }

    getM3u8Content() {
        let that = this;
        ajax({
            url: that.url,
            headers: {
                "Origin": location.origin,
                "Referer": location.origin
            },
            success: m3u8Str => {
                if (!m3u8Str) return;
                that.handle(m3u8Str);
            },
            fail: status => {
                that.m3u8Status = status;
            }
        });
    }

    handle(m3u8Str) {
        let m3u8URL = new URL(this.url), i = 1, tdHtm, tsUrls = [], respHtm = '<table>';
        // 提取 ts 视频片段地址
        m3u8Str.split('\n').forEach(line => {
            if (line.startsWith('#EXT-X-KEY')) {
                this.decryptor.init(line);
                return;
            }
            if (!(line = line.trim())) return;
            if ('#' !== line[0]) {
                tsUrls.push(tdHtm = genPartUrl(line, m3u8URL));
                respHtm += `<tr><td>${i++}:</td><td><a href="${tdHtm}">${line}</a></td></tr>`
            } else {
                respHtm += `<tr><td>-:</td><td><note>${line}</note></td></tr>`
            }
        });
        this.m3u8RespHtml = respHtm + '</table>';
        this.tsUrls = tsUrls;
        return this;
    }

    nextIndex() {
        let idx = this.downloadIndex++;
        return (idx < this.tsUrls.length) ? idx : -1;
    }

    showInfo() {
        document.getElementById('m3u8_link').value = this.url;
        document.getElementById('m3u8_response').innerHTML = this.m3u8RespHtml;
        if (!this.m3u8RespHtml) {
            document.getElementById('m3u8_response').innerHTML = this.m3u8Status;
        }
        let segsHtm = '';
        for (let j = 0; j < this.tsUrls.length; j++) {
            segsHtm += `<span class="${this.tsFiles[j] ? 'downloaded' : ''}">${j + 1}</span>`;
        }
        document.getElementById('m3u8_segments').innerHTML = segsHtm;
        let segs = document.querySelectorAll('#m3u8_segments span');
        let that = this;
        for (let i = 0; i < segs.length; i++) {
            segs[i].onclick = function (e) {
                that.downloadPart(e.target.innerText-1, () => that.serializeSave());
            }
        }
    }

    startDownload() {
        for (let i = 0; i < 5; i++) {
                this.downloadSer();
        }
    }

    downloadSer(index, retryNum) {
        let that = this;
        index = (index && index >= 0) ? index : that.nextIndex();
        if (index == -1) return;
        that.downloadPart(index, ()=> {
            // 异步并发
            that.downloadSer();
            that.serializeSave();
        }, () => {
            if ((retryNum = retryNum || 0) < 5) {
                that.downloadSer(index, retryNum + 1);
            } else {
                that.downloadSer();
            }
        });
    }

    downloadPart(index, success, fail) {
        let that = this;
        if (index < 0 || index >= that.tsUrls.length) return;
        that.partStart(index);
        ajax({
            url: that.tsUrls[index],
            type: "file",
            progress(ev) {
                that.partProgress(index, ev.loaded / ev.total);
            },
            success(file) {
                // 串行
                that.setFile(index, file);
                that.partEnd(index);
                success && success();
            },
            fail() {
                fail && fail();
            }
        });
    }

    partStream(idx) {
        let classList = document.getElementById('m3u8_segments').children[idx].classList;
        classList.remove('downloaded');
        classList.add('stream');
    }

    partStart(idx) {
        document.getElementById('m3u8_segments').children[idx].classList.add('downloading');
    }

    partProgress(idx, progress) {
        let pct = (progress*100).toFixed();
        if (pct % 10 != 0) return;
        let seg = document.getElementById('m3u8_segments').children[idx];
        seg.style.background = seg.classList.contains('downloaded')
            ? '' : `linear-gradient(to right, #eee205 0%, #eee205 ${pct}%, #2c4b44 0%)`;
    }

    partEnd(idx) {
        let seg = document.getElementById('m3u8_segments').children[idx];
        seg.style.background = '';
        seg.classList.remove('downloading');
        seg.classList.add('downloaded');
    }

    setFile(index, file) {
        if (this.tsFiles[index]) return;
        this.tsFiles[index] = this.decryptor.decode(index, file);
        this.downloadCount++;
    }

    streamSave(index) {
        let file;
        if (index != this.saveIndex) return;
        for (; index < this.tsFiles.length && (file = this.tsFiles[index]); index++) {
            // todo: stream save
            // m3u8Map[id].fileWriter.write(file);
            this.partStream(index);
            this.tsFiles[index] = null;
        }
        this.saveIndex = index;
        if (this.saveIndex == this.tsUrls.length) {
            // todo finish download
        }
    }

    serializeSave() {
        if (this.downloadCount < this.tsUrls.length) return;
        this.save();
    }

    save() {
        let blob = new Blob(this.tsFiles, {type: 'video/MP2T'});
        let a = document.createElement('a');
        a.download = this.name;
        a.href = URL.createObjectURL(blob);
        a.click();
    }
}

class Mp4Handler {
    constructor(url, name) {
        this.url = url;
        this.name = name + '.mp4';
        this.type = 'mp4';
        this.class = 'ly-m3u8-mp4';
    }

    showInfo() {
        document.getElementById('m3u8_link').value = this.url;
        document.getElementById('m3u8_response').innerHTML = '';
        document.getElementById('m3u8_segments').innerHTML =
            `<iframe src="${this.url}"></iframe>`;
    }

    save(){
        this.startDownload();
    }
    
    startDownload() {
        let that = this;
        ajax({
            url: that.url,
            type: "file",
            progress(ev) {
                document.getElementById('m3u8_response').innerHTML =
                    `<span>${(ev.loaded / ev.total * 100).toFixed(2)}%</span>`;
            },
            success(file) {
                let blob = new Blob([file], {type: 'video/MP2T'});
                let a = document.createElement('a');
                a.download = that.name;
                a.href = URL.createObjectURL(blob);
                a.click();
            },
            fail(statusCode) {
                document.getElementById('m3u8_response').innerHTML = `<span>${statusCode}%</span>`;
            }
        })
    }
}

class VideoRecordHandler {
    constructor(url, name) {
        this.type = 'dom';
    }
    showInfo() {

    }
    save(){

    }
    startDownload() {

    }
    videoRecord(videoDom) {
        let mediaRecorder = new MediaRecorder(videoDom.captureStream(), { mimeType: 'video/x-matroska'});
        mediaRecorder.ondataavailable = function(event){
            let videoUrl = URL.createObjectURL(event.data,{type: 'video/x-matroska'});
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = `${document.title.replaceAll('.', '') || new Date().getTime()}.webm`;
            a.click();
            setTimeout(() => window.URL.revokeObjectURL(videoUrl), 5000);
        };
        mediaRecorder.start();
        videoDom.currentTime = 0;
        videoDom.play();
        console.log('开始录制.');
        let intv = setInterval(() => console.log('录制中...'), 10000);
        // 到点停止录制
        setTimeout(()=> {
            mediaRecorder.stop();
            clearInterval(intv);
            console.log('结束录制.');
        }, (videoDom.duration + 10) * 1000);
    }
}

class DemoHandler {
    constructor(url, name) {
        this.type = 'demo';
    }
    showInfo() {}
    startDownload() {}
    save(){}
}
