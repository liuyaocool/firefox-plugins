
const tbc_redis_list = ['V4_mdm(V4原6382)', 'V4_common(V4原6379)', 'V5_common(V5原6379)', 'V5_mdm(V5原6382)'];
let tbc_redis_idx = 0;
document.onkeydown = function (ev) {
    switch(ev.code) {
        case 'AltLeft':
            tbc_redis_idx = (tbc_redis_idx+1) % tbc_redis_list.length;
            document.getElementById('redis_name').value = tbc_redis_list[tbc_redis_idx];
            ev.preventDefault();
            break;
        case 'Escape': document.getElementById('redis_key').focus(); if (ev) ev.preventDefault(); break;
        case 'AltRight':
            let tbc_a = document.getElementById('result_tbody').children;
            tbc_a = JSON.parse(JSON.parse(tbc_a[tbc_a.length-1].children[2].innerText)).jdbcUrl.split('//')[1].split(':');
            window.open(`http://172.21.1.6:8083/static/html/db/ssh.html#${tbc_a[0]}:${tbc_a[1].split('/').join(':')}`);
            ev.preventDefault();
            break;
        case "Enter": document.getElementById('btn_query').click(); break;
        default: break;
    }
}
document.getElementById('redis_name').value = tbc_redis_list[0];
document.getElementById('redis_key').focus();
addTip(`
    <span style="color:#91671c;font-weight:bold;"> 左Alt </span>:
        <span style="color:red"> ${tbc_redis_list.join('，')} </span>之间快速切换<br>
    <span style="color:#91671c;font-weight:bold;"> 右Alt </span>:转到sql查询；
    <span style="color:#91671c;font-weight:bold;"> Esc </span>:定位到输入框；
    <span style="color:#91671c;font-weight:bold;"> 回车 </span>:查询<br>
`)


console.log('work yufaredis inject');