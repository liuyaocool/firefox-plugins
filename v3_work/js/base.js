function addTip(innerHtml) {
    let clz = 'ly-work-tbc-tip';
    document.querySelectorAll(`.${clz}`).forEach(dvi => dvi.remove());
    let tip = document.createElement('div');
    tip.classList.add(clz);
    tip.innerHTML = innerHtml;
    document.body.appendChild(tip);
}