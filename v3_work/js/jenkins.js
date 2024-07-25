switch(location.pathname) {
    case "/":
        let tbc_jenkins_list = [
            ['#job_上海云环境备用-jdk1\\.8', ' > td:nth-child(7) > a'],
            ['#job_上海云环境-jdk1\\.8', ' > td:nth-child(7) > a'],
            0
        ];
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    tbc_jenkins_list[2] = (tbc_jenkins_list[2] + 1) % (tbc_jenkins_list.length-1);
                    for (let i = 0; i < tbc_jenkins_list.length - 1; i++) {
                        document.querySelector(tbc_jenkins_list[i][0]).style.backgroundColor = '';
                    }
                    let tbc_jenkins_e = document.querySelector(tbc_jenkins_list[tbc_jenkins_list[2]].join(''));
                    tbc_jenkins_e.parentElement.parentElement.style.backgroundColor = 'seagreen';
                    tbc_jenkins_e.focus();
                    break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 云环境-jdk1.8, 云环境备用-jdk1.8 之间来回聚焦
        `)
        break;
    case "/login":
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'AltRight': 
                    let uninp = document.getElementById('j_username');
                    uninp.value = 'dev';
                    uninp.parentElement.nextElementSibling.querySelector('input').value = 'dev';
                    uninp.parentElement.parentElement.submit();
                default: break;
            }
        }
        addTip(`<span style="color:#91671c;font-weight:bold;"> 右Alt </span>:自动登录`);
        break;
    case "/job/%E4%B8%8A%E6%B5%B7%E4%BA%91%E7%8E%AF%E5%A2%83%E5%A4%87%E7%94%A8-jdk1.8/build":
    case "/job/%E4%B8%8A%E6%B5%B7%E4%BA%91%E7%8E%AF%E5%A2%83-jdk1.8/build":
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    document.querySelector("#main-panel > form > div.parameters > div:nth-child(1) > div.setting-main > div > input.setting-input").focus();
                    break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 定位到 “item_name”
        `);
        break;
    default:
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    document.querySelector("#tasks > div:nth-child(4) > span > a").focus();
                break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 定位到 ”Build with Parameters“
        `);    
        break;
}

console.log('work jenkins inject');