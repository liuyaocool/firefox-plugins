if (location.href.indexOf('/app/discover') >= 0) {
    document.onkeydown = function (ev) {
        switch(ev.code) {
            case 'AltRight':
                break;
            case 'AltLeft':
                break;
            case 'Escape':
                document.getElementById('savedQueryPopover').nextElementSibling.querySelectorAll('textarea')[0].focus()
                break;
            default: break;
        }
    }
    addTip(`
        <span style="color:#91671c;font-weight:bold;"> Esc </span>:定位到输入；
        <br>
    `)
}

console.log('work kibana inject');