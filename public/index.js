window.addEventListener('hashchange', e => {
    currentRoute = getViewName(e.newURL);
    onRouteChange(currentRoute);
});
window.addEventListener('load', e => {
    currentRoute = getViewName(e.target.location.hash)
    onRouteChange(currentRoute);
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    let loginModal = document.getElementById('loginModal');
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
}