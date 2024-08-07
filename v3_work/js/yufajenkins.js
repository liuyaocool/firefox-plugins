switch(location.pathname) {
    case "/":
        let yjIdx = 0, yjList = [
            '#job_cld-上海云环境-jdk1\\.8',
            '#job_cld-上海云环境-jdk1\\.8备用'
        ];
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    for (let i = 0; i < yjList.length; i++) {
                        document.querySelector(yjList[i]).style.backgroundColor = '';
                    }
                    let tbc_jenkins_e = document.querySelector(`${yjList[yjIdx++]} > td:nth-child(7) > a`);
                    tbc_jenkins_e.parentElement.parentElement.style.backgroundColor = 'seagreen';
                    tbc_jenkins_e.focus();
                    yjIdx %= yjList.length;
                    break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: ${yjList.join(', ')} 之间来回聚焦
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
    case "/job/cld-%E4%B8%8A%E6%B5%B7%E4%BA%91%E7%8E%AF%E5%A2%83-jdk1.8/build":
    case "/job/cld-%E4%B8%8A%E6%B5%B7%E4%BA%91%E7%8E%AF%E5%A2%83-jdk1.8%E5%A4%87%E7%94%A8/build":
        document.onkeydown = function (ev) {
            switch(ev.code) {
                case 'Escape':
                    document.querySelector('[name=value]').focus();
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
                    document.querySelector("#tasks > div:nth-child(4) > a:nth-child(2)").focus();
                    break
                default: break;
            }
        }
        addTip(`
            <span style="color:#91671c;font-weight:bold;"> Esc </span>: 定位到 ”Build with Parameters“
        `);    
        break;
}

console.log('work yufajenkins inject');