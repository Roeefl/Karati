'use strict';

let root;
let currentRoute;

if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = {
        onRouteChange,
        getViewName,
        reRender,
        setState,
        onAction
    };
}

function findById(root, id) {
    if (root.id === id) {
      return root;
    }
    if (root.children) {
      let view;
      for (let child of root.children) {
        view = findById(child, id);
        if (view) {
          return view;
        }
      }
    }
  }

function getViewName(url) {
    return (url || '').split('#')[1] || views.default;
}

function setState(viewId, newState, callback) {
    let view = findById(root, viewId);
    view.state = newState;
    reRenderRoot();
    callback(true);
}

function onAction(id, actionName, e) {
    let view = findById(root, id);
    view[actionName](e, () => {
        reRenderRoot();
    });
}

function render(viewName) {
    let main = document.querySelector('main');

    let view = views[viewName];
    // if (viewName == views.default && !root) {
        if ('new' in view) {
            root = view.new();
        } else {
            root = view;
        }
        console.log(root);
    // }

    root.render(html => {
        main.innerHTML = html;
    });
}

function onRouteChange(viewName) {
    let main = document.querySelector('main');
    
    views.loading.render(loading => {
        main.innerHTML = loading;
        render(viewName);
    })
};

function reRenderRoot() {
    let main = document.querySelector('main');
    root.render(html => {
        main.innerHTML = html;
    });
}

function reRender(view) {
    console.log(view);
    let main = document.querySelector('main');
    view.render(html => {
        main.innerHTML = html;
    });
};