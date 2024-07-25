if ('/' == location.pathname) {
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
} else if (location.pathname.indexOf('/build') >= 0){
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
} else {
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
}


console.log('work jenkins inject');