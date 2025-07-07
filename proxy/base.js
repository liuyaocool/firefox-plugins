const STORE_KEY_CONFIG = 'ly_proxy_config';
const DIRECT_PROXY = [{type: "direct"}];

function matchProxyByUrl(url, config) {
    // get url host split
    let i, c, hostSplit = [[]], hostsIdx = 0;
    if (url[2] == ':') i = 5; // ws://xxx
    else if (url[4] == ':') i = 7; // http://xxx
    else if (url[5] == ':') i = 8; // https://xxx
    else return DIRECT_PROXY;
    
    for (; i < url.length; i++) {
        // case ':': // 不忽略端口, 如果是socket协议的端口
        if ('.' == (c = url[i]) || '/' == c) {
            hostSplit[hostsIdx] = hostSplit[hostsIdx].join('');
            if ('/' == c) break;
            hostSplit[++hostsIdx] = [];
            continue;
        }
        hostSplit[hostsIdx].push(c);
    }
    for (c = config['special'], i = hostSplit.length -1; i >= 0; i--)
        if (c && (c = c[hostSplit[i]]) && Array.isArray(c))
            return c;
    if (true === config['equals'][hostSplit.join('.')]) 
        return DIRECT_PROXY;
    for (c = config['prefix'], i = 0; i <  hostSplit.length; i++)
        if (c && true === (c = c[hostSplit[i]])) 
            return DIRECT_PROXY;
    for (c = config['suffix'], i = hostSplit.length -1; i >= 0; i--)
        if (c && true === (c = c[hostSplit[i]]))
            return DIRECT_PROXY;
    return config['global'];
}

/**
 * 
 * @param {*} text 
 * @returns 
 *  {
 *      "global": [proxy array],
 *      "special": {
 *          "com": {
 *              "baidu": [proxy array],
 *              "bilibili": [proxy array]
 *          },
 *      },
 *      "equals": {
 *          "localhost": true
 *      },
 *      "suffix": {
 *          "com": {
 *              "baidu": true,
 *              "bilibili": true,
 *              "openai": true,
 *          },
 *          "link": {
 *              "liuyao": true,
 *          }
 *      },
 *      "prefix": {
 *          "127": {
 *              "1": true,
 *          },
 *          "172": {
 *              "21": true,
 *          }
 *      }
 *  };
 */
function handleConfig(text) {
    let config = JSON.parse(text), 
        special= {}, suffix = {}, prefix = {}, equals = {}, 
        ipPort, tmp, hs, next;
    for (const p in config['special_proxy']) {
        if (!(ipPort = newProxyInfo(p))) continue;
        config['special_proxy'][p].forEach(h => {
            tmp = special;
            hs = splitHost(h);
            for (let i = hs.length-1; i > 0; i--) {
                if (!hs[i]) continue;
                if (Array.isArray(next = tmp[hs[i]])) return;
                tmp = next ? next : (tmp[hs[i]] = {});
            }
            tmp[hs[0]] = ipPort;
        });
    }
    config['exclude_equals'].forEach(host => equals[host] = true);
    config['exclude_prefix'].forEach(h => {
        tmp = prefix;
        hs = splitHost(h);
        for (let i = 0; i < hs.length-1; i++) {
            if (!hs[i]) continue;
            if (true === (next = tmp[hs[i]])) return;
            tmp = next ? next : (tmp[hs[i]] = {});
        }
        tmp[hs[hs.length-1]] = true;
    });
    // todo
    config['exclude_suffix'].forEach(h => {
        tmp = suffix;
        hs = splitHost(h);
        for (let i = hs.length-1; i > 0; i--) {
            if (true === (next = tmp[hs[i]])) return;
            tmp = next ? next : (tmp[hs[i]] = {});
        }
        tmp[hs[0]] = true;
    });
    return {
        "global": newProxyInfo(config['global_proxy']),
        special, equals, prefix, suffix
    }
}

function newProxyInfo(ipPort) {
    if (ipPort.toLowerCase() == 'direct') {
        return DIRECT_PROXY;
    }
    if((ipPort = ipPort.split(':')).length != 2) return null;
    return [
        {type: "http", host: ipPort[0], port: ipPort[1]*1},
        {type: "https", host: ipPort[0], port: ipPort[1]*1}
    ];
}

function splitHost(host) {
    let hs = host.split('.');
    let hs1 = [];
    hs.filter(e => e).forEach(e => hs1.push(e));
    return hs1;
}