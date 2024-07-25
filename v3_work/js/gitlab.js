
document.onkeydown = function (ev) {
    switch(ev.code) {
        case 'AltRight':
            break;
        case 'AltLeft':
            break;
        case 'Escape':
            let dom = document.getElementById('project-filter-form-field');
            dom.focus();
            dom.select();
            break;
        default: break;
    }
}
addTip(`
    <span style="color:#91671c;font-weight:bold;"> Esc </span>:定位到输入；
    <br>
`)

console.log('work gitlab inject');