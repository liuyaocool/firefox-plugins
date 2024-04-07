browser.webRequest.onBeforeRequest.addListener(
    (a, b, c) => {
        console.log(a);
    },             //  object
    {
        urls: ["<all_urls>"],
    }
    // , ['blocking']
)


