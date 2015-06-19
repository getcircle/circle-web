'use strict';

import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {

	static propTypes = {
		flux: React.PropTypes.object.isRequired,
	}

	render() {
		return (
			<header className='app--header'>
				<Link to='company'>Company</Link>
				<Link to='feed'>Feed</Link>
			</header>
		);
	}
}

export default Header;
