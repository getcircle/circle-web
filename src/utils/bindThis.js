const bindThis = (context, key, descriptor) => {
    let fn = descriptor.value;

    return {
        configurable: true,
        get() {
            let boundFn = fn.bind(this);

            Object.defineProperty(this, key, {
                value: boundFn,
                configurable: true,
                writable: true
            });

            return boundFn;
        }
    };
}

export default bindThis;
