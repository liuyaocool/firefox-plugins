function translate(src) {
    if (!src || !src.trim()) return;
    src = src.trim();
    if (ING[src]) {
        buling(ING[src].id);
        ING[src].tim = 6;
        return;
    }
    let lan = checkAndGetLan(src);
    if (!lan) return;
    addBox(src);
    enToChGoogle(src, lan);
}