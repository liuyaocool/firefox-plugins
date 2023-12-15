const STORE_KEY_CONFIG = 'ly_proxy_config';

function matchProxyByUrl(url, config) {
    return matchProxy(getUrlHostSplit(url), config);
}

/**
 * 
 * @param {*} hostSplit 
 * @param {*} config handleConfig#return
 * @returns 
 */
function matchProxy(hostSplit, config) {
    if(config['exclude_localhost'] && hostSplit.length == 1) {
        if('localhost' === hostSplit[0].split(':')[0]) {
            return config['proxy_list'][0];;
        }
    }
    let i, tmp = config['suffix'];
    for (i = hostSplit.length -1; i >= 0; i--)
        if(tmp && typeof (tmp = tmp[hostSplit[i]]) == 'number')
            return config['proxy_list'][tmp];
    for (tmp = config['prefix'], i = 0; i < hostSplit.length; i++)
        if(tmp && typeof (tmp = tmp[hostSplit[i]]) == 'number')
            return config['proxy_list'][tmp];
    return config['proxy_list'][config['global']];
}

/**
 * 
 * @param {*} text 
 * @returns 
 *  {
 *      "proxy_list": [
 *          {type: "direct"},
 *          [{type: "https" ...}, {type: "http", ...}], // global
 *          [{type: "https" ...}, {type: "http", ...}], // special
 *          // special...
 *      ],
 *      "global": 1 or 0,
 *      "exclude_localhost": true,
 *      "suffix": {
 *          "com": {
 *              "baidu": 0,
 *              "bilibili": 0,
 *              "21tb": 0,
 *              "openai": 2
 *          },
 *          "link": {
 *              "liuyao": 0,
 *          }
 *      },
 *      "prefix": {
 *          "127": {
 *              "1": 0,
 *          },
 *          "172": {
 *              "21": 0,
 *          }
 *      }
 *  };
 */
function handleConfig(text) {
    let config = JSON.parse(text), suffix = {}, prefix = {}, 
        proxy_list = [{type: "direct"}], globalIdx = 0;
    // global open, set idx = 1
    if(config['global_proxy'].toLowerCase(0) != 'direct') 
        globalIdx = proxy_list.push(newProxyInfo(config['global_proxy'])) - 1;
    let convert = (proxyIdx, host) => {
        let tmp = suffix, hs = host.split('.');
        for (let i = hs.length -1; i >= 0; i--) {
            // no child set proxy (proxyIdx: proxy_list index)
            if (!tmp[hs[i]]) tmp[hs[i]] = 0 == i ? proxyIdx : {};
            tmp = tmp[hs[i]];
        }
    }
    config['exclude_prefix'].forEach(h => {
        let tmp = prefix, hs = h.split('.');
        for (let i = 0; i < hs.length; i++) {
            // no child set proxy (0: proxy_list index)
            if (!tmp[hs[i]]) tmp[hs[i]] = i == (hs.length-1) ? 0 : {};
            tmp = tmp[hs[i]];
        }
    });
    config['exclude_suffix'].forEach(h => convert(0, h));
    for (const proxy in config['special_proxy']) {
        config['special_proxy'][proxy].forEach(h => convert(proxy_list.push(newProxyInfo(proxy)) - 1, h));
    }
    return {
        "proxy_list": proxy_list,
        "global": globalIdx,
        "exclude_localhost": config['exclude_localhost'],
        "prefix": prefix,
        "suffix": suffix
    }
}

function newProxyInfo(ipPort) {
    ipPort = ipPort.split(':');
    ipPort = [
        {type: "http", host: ipPort[0], port: ipPort[1]*1},
        {type: "https", host: ipPort[0], port: ipPort[1]*1}
    ];
    return ipPort;
}

function getUrlHostSplit(url) {
    let c, hosts = [[]], hostsIdx = 0;
    out:
    for (let i = url[7] == '/' ? 8 : 7; i < url.length; i++) {
        switch (c = url[i]) {
            case '.':
                hosts[hostsIdx] = hosts[hostsIdx].join('');
                hosts[++hostsIdx] = [];
                continue;
            // case ':': // 不忽略端口, 如果是socket协议的端口
            case '/': break out;
            default: hosts[hostsIdx].push(c);
        }
    }
    if(hosts[hostsIdx] && typeof hosts[hostsIdx] != 'string') {
        hosts[hostsIdx] = hosts[hostsIdx].join('');
    }
    return hosts;
}