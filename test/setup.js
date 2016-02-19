import jsdom from 'jsdom';

if (!global.document || !global.window) {
    global.__DEVELOPMENT__ = true;
    global.__DEVTOOLS__ = false;
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = Object.assign({}, window.navigator, {userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36'});
    global.mixpanel = {
      init: () => {},
    };
    global.__CLIENT__ = true;
    global.__SERVER__ = false;
    global.localStorage = null;
    // since we're using a real user agent, React will try and debug some messages
    global.console.debug = () => {};
    window.addEventListener('load', () => {
        console.log('JSDom setup completed: document, window and navigator are now on global scope.');
    });
}
