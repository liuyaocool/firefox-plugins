
function genPartUrl(partUri, m3u8URL) {
    if (partUri.indexOf('http') === 0) {
        return partUri;
    }
    let domain = (m3u8URL.origin + m3u8URL.pathname).split('/');
    if (partUri[0] === '/') {
        return domain[0] + '//' + domain[2] + partUri;
    } else {
        domain.pop();
        domain.push(partUri);
        return domain.join('/');
    }
}

/**
 * ajax
 * @param options
 *  {
 *      url: '',
 *      type: type || 'file',
 *      headers: {
 *          key: value
 *      },
 *      timeout: 2000 || null;
 *      progress(e) {},
 *      success(response) {},
 *      fail(status){};
 *  }
 * @return {Promise<unknown>}
 */
function ajax(options) {
    if (!options) return;
    let xhr = new XMLHttpRequest();
    if (options.type === 'file') {
        xhr.responseType = 'arraybuffer';
    }
    xhr.onprogress = ev =>
        typeof options.progress === 'function' && options.progress(ev);
    xhr.onreadystatechange = function () {
        // console.log(`${xhr.readyState}/${xhr.status}`)
        if (xhr.readyState === 4) {
            let status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.response);
            } else {
                options.fail && options.fail(status);
            }
        }
    };
    xhr.open("GET", options.url, true);
    if (options.headers) {
        for(let k in options.headers) {
            xhr.setRequestHeader(k, options.headers[k]);
        }
    }
    xhr.send(null);
}