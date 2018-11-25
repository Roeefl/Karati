window.addEventListener('hashchange', e => {
    onRouteChange(getViewName(e.newURL));
});
window.addEventListener('load', e => {
    onRouteChange(getViewName(e.target.location.hash));
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    let loginModal = document.getElementById('loginModal');
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
}