'use strict';

import React from 'react';

class Feed extends React.Component {

	static propTypes = {
		categories: React.PropTypes.array.isRequired
	}

	_renderCategories() {
		return this.props.categories.map((category, index) => {
			return (
				<div key={index}>
					<h1>{category.title}</h1>
					<h1>{category.total_count}</h1>
					<h1>{category.content_key}</h1>
				</div>
			);
		});
	}

	render() {
		return (
			<div>
				{this._renderCategories()}
			</div>
		);
	}

}

export default Feed;
