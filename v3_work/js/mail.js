
document.onkeydown = function (ev) {
    switch(ev.code) {
        case 'AltRight':
            break;
        case 'AltLeft':
            // 抄送按钮
            if (document.getElementById('cc-link')) {
                document.getElementById('cc-link').click();
                return;
            }
            // 发送邮件页面也有此id 新邮件按钮
            if (document.getElementById('rcmbtn109')) {
                document.getElementById('rcmbtn109').click();
                return;
            }
            break;
        case 'Escape':
            document.getElementById('composebody').focus();
            break;
        default: break;
    }
}
addTip(`
    <span style="color:#91671c;font-weight:bold;"> 左Alt </span>: 添加抄送/新邮件；
    <span style="color:#91671c;font-weight:bold;"> Esc </span>:定位到输入；
    <br>
`)

console.log('work mail inject');