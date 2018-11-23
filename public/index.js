window.addEventListener('hashchange', e => {
    onRouteChange(getViewName(e.newURL));
});
window.addEventListener('load', e => {
    onRouteChange(getViewName(e.target.location.hash));
});