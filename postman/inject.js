if (document.getElementById('http-main')) {
    let aa = document.getElementById('http-main').style;
    aa.display =  aa.display == 'none' ? '' : 'none';
} else {
    let httpUtil = document.createElement('form');
    httpUtil.classList.add('http-main');
    httpUtil.id = 'http-main';

    httpUtil.innerHTML = `
        <input type="text" name="url" spellcheck="false" class="http-input" style="width: calc(100% - 196px);">
        <select name="method" class="http-input">
            <option class="option" value="get">get</option>
            <option class="option" value="post">post</option>
            <option class="option" value="put">put</option>
            <option class="option" value="patch">patch</option>
            <option class="option" value="delete">delete</option>
        </select>
        <button id="http_util_submit" type="button" class="http-button">send</button>
        <button type="button" class="http-button" style="color: #efe802;" onclick="this.parentElement.style.display='none'">ㄨ</button>
        <br><br>headers: 
        <span id="http_add_headers">
            <button type="button" class="http-button"> + </button>
            <button type="button" class="http-button" 
                k="Content-Type" v="application/json;charset=utf-8"> +json </button>
        </span>
        <br>
        <div id="http_headers"></div>
        <br>body: <br>
        <textarea name="body" spellcheck="false" style="height: 100px;" class="http-input" placeholder="body"
            onfocusout="try{this.value=JSON.stringify(JSON.parse(this.value), null, 4);}catch(e){}"></textarea>
        <br><br>response: <br>
        <textarea name="responseText" placeholder="responseText" spellcheck="false" style="height: 50%;" class="http-input"></textarea>
    `;
    document.body.appendChild(httpUtil);

    document.getElementById('http_util_submit').onclick = e => {
        let pp = e.target.parentElement;
        // req.body = '{"page":{"pageNo":1,"pageSize":8},"keyword":""}';
        let http = new XMLHttpRequest();
        let url = pp['url'].value;
        url = '/' === url.charAt(0) ? (location.origin + url) : url;
        http.open(pp.querySelector('select[name="method"]').value, url, true);
        let hds = pp['header-name'];
        if (hds) {
            if (hds.length)
                for (let i = 0; i < hds.length; i++)
                    http.setRequestHeader(hds[i].value, pp['header-value'][i].value);
            else
                http.setRequestHeader(hds.value, pp['header-value'].value);
        }
        http.send(pp['body'].value);
        http.onreadystatechange = res => {
            switch (http.readyState) {
                case 4:
                    try {
                        pp['responseText'].value = JSON.stringify(JSON.parse(res.target.response), null, 4);
                    } catch (e) {
                        pp['responseText'].value = res.target.response;
                    }
                    break;
                default: break;
            }
        }
    }

    document.querySelectorAll('#http_add_headers button').forEach(btn => {
        btn.onclick = e => {
            let k = e.target.getAttribute('k'),
                v = e.target.getAttribute('v'),
                hddiv = document.createElement('div');
                // 这里button不换行 就不会产生空隙
            hddiv.innerHTML = `
                <input name="header-name" type="text" class="http-input" value="${k||''}" placeholder="header name"> : 
                <input name="header-value" type="text" class="http-input" value="${v||''}" placeholder="header value">
                <button type="button" class="http-button" onclick="this.parentElement.remove();">删除</button>
            `;
            document.getElementById('http_headers').appendChild(hddiv);
        }
    });
}