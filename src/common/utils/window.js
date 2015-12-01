export function resetScroll() {
    if (__CLIENT__) {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }
}
