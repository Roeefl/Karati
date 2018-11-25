'use strict';

if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = {
      onRouteChange,
      getViewName
    };
  }

function getViewName(url) {
    return (url || '').split('#')[1] || views.default;
}

function onAction(viewName, actionName, e) {
    let view = views[viewName];
    view[actionName](e, () => {
      render(viewName);
    });
}

function render(viewName) {
    let main = document.querySelector('main');
    main.innerHTML = views.loading();

    let view = views[viewName];
    if ('render' in view) {
        view = view.render;
    }

    view(html => {
        main.innerHTML = html;
    });
}

function onRouteChange(viewName) {
    render(viewName);
};

function reRender(viewName) {
    render(viewName);
};