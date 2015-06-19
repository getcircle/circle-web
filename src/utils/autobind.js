'use strict';

const autoBind = (Mixin) => {
	return {
		componentWillMount() {
			Object.keys(Mixin).forEach((name) => {
				if (typeof this[name] === 'function') {
					this[name] = this[name].bind(this);
				}
			});
		},
	};
};

export default autoBind;
