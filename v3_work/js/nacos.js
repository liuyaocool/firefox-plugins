let keyHandler, editFocusIdx = 0;;
window.addEventListener('hashchange', init);
document.addEventListener('keydown', ev => keyHandler(ev));

init();

function init() {
    switch(location.hash.substring(0, location.hash.indexOf('?'))) {
        case "#/serviceManagement": 
            keyHandler = defaultHandler;
            addTip(`
                <span class="ly-work-key"> Esc </span>: 定位第一搜索框；
            `);
            break;
        case "#/configurationManagement": 
            keyHandler = configManageHandler; 
            addTip(`
                <span class="ly-work-key"> Esc </span>: 定位第一搜索框；
                <span class="ly-work-key"> AlrRight </span>: 聚焦‘编辑’；
            `);
            break;
        default: 
            addTip('');
            break;
    }
}

function defaultHandler(ev) {
    switch(ev.code) {
        case 'Escape': 
            focusFirstSearch();
            break;
        default: break;
    }
}

function configManageHandler(ev) {
    let selData = document.querySelectorAll('.ly-work-select');
    switch(ev.code) {
        case 'Escape': 
            focusFirstSearch();
            break;
        case 'Enter': 
            selData.length > 0 && selData[0].click();
            break;
        case 'AltRight':
            if (selData.length == 0) {
                editFocusIdx = 0;
            } else {
                selData.forEach(a => a.classList.remove('ly-work-select'));
            }
            let dataTr = document.querySelectorAll('table > tbody > tr');
            editFocusIdx %= dataTr.length;
            let editButton = dataTr[editFocusIdx++].children[4].querySelectorAll('a')[2];
            editButton.classList.add('ly-work-select');
            break;
        default: break;
    }
}
            // document.getElementById('container').focus();
            // document.querySelectorAll('#container .view-line')[1].focus();
            // document.querySelectorAll('#container .view-line')[1].click();



function focusFirstSearch() {
    let dom = document.querySelectorAll('.next-form input')[0];
    if (dom) {
        dom.focus();
        dom.select();            
    }
}

console.log('work nacos inject');