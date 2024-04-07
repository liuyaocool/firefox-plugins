browser.webRequest.onBeforeRequest.addListener(
    (e) => {
        // console.log(e);
    },
    {
        urls: ["<all_urls>"],
    }
    // , ['blocking']
)


browser.webRequest.onHeadersReceived.addListener(
    (e) => {
        let headerMap = {tabId: e.tabId, url: e.url};
        for (let i = 0; i < e.responseHeaders.length; i++) {
            headerMap[e.responseHeaders[i].name.toLowerCase()] = e.responseHeaders[i].value;
        }
        console.log(headerMap);
    },
    { urls: ["<all_urls>"] }, 
    [ 'responseHeaders' ]
)

/*
browser.webRequest.onBeforeRequest.addListener(
  listener,             // function
  filter,               //  object
  extraInfoSpec         //  optional array of strings
)

browser.webRequest.onHeadersReceived.addListener(
  listener,             // function
  filter,               //  object
  extraInfoSpec         //  optional array of strings
)
*/
