document.onkeydown = function (ev) {
    switch(ev.code) {
        case 'Escape':
            // let dom = document.querySelectorAll('.next-form')[0].children[1].querySelector('input');
            let dom = document.querySelectorAll('.next-form input')[0];
            dom.focus();
            dom.select();
            break
        default: break;
    }
}
addTip(`
    <span style="color:#91671c;font-weight:bold;"> Esc </span>: 定位到 第一个搜索框
`);

console.log('work nacos inject');