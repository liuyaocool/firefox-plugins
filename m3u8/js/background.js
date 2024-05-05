addListenerClickPluginButtonOpenPage('config.html');

const M3U8_OK = [
    'application/vnd.apple.mpegurl',
    'video/mp4',
    'video/webm'
];
const M3U8_NOT = ['js', 'css', 'ts', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'woff2', 'ts', 'svg', 'json', 'html'];

addListenerHeadersReceived(
    e => {
        if('GET' != e.method) return;
        let type = getContentType(e);
        if(M3U8_OK.indexOf(type) < 0) {
            // if(type.endsWith('.m3u8')) {
            //     return M3U8_OK[0];
            // }
            // if (type.endsWith('.mp4')) {
            //     return M3U8_OK[1];
            // }
            return
        };
        if(e.url.indexOf('cccdn') >= 0) {
            // debugger;
        }
        if(e.tabId < 0) {
            getActiveTab(tabs => {
                if(tabs[0].id < 0) {
                    console.log(`${tabs[0].id} ${e.url} ${type}`)
                    return;
                }
                sendToTab(tabs[0].id, 'url', { url: e.url, contentType: type });    
            })
            // sendToActiveTab('url', { url: e.url, contentType: type });
        } else {
            sendToTab(e.tabId, 'url', { url: e.url, contentType: type });
        }
    },
    { urls: ["<all_urls>"] },
    [ 'responseHeaders' ]
);

function getContentType(e) {
    let type = e.url.split('?')[0];
    for (let i = 0; i < e.responseHeaders.length; i++) {
        if('content-type' == (type = e.responseHeaders[i]).name.toLowerCase()) {
            return type.value.toLowerCase();            
        }
    }
    return '';
}