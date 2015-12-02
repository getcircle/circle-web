import jsdom from 'jsdom';

if (!global.document || !global.window) {
    global.__DEVELOPMENT__ = true;
    global.__DEVTOOLS__ = false;
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = window.navigator;
    global.mixpanel = {
      init: () => {},
    };

    window.addEventListener('load', () => {
    console.log('JSDom setup completed: document, window and navigator are now on global scope.');
    });
}
