'use strict';

import React from 'react';

import Category from './Category';

class Feed extends React.Component {

	static propTypes = {
		categories: React.PropTypes.array.isRequired
	}

	_renderCategories() {
		return this.props.categories.map((category, index) => {
			return (
				<Category key={index} category={category} />
			);
		});
	}

	render() {
		return (
			<section>
				{this._renderCategories()}
			</section>
		);
	}

}

export default Feed;
