function addTip(innerHtml) {
    let tip = document.createElement('div');
    tip.classList.add('tbc-tip');
    tip.innerHTML = innerHtml;
    document.body.appendChild(tip);
}