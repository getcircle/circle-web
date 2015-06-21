'use strict';

import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {

	static propTypes = {
		flux: React.PropTypes.object.isRequired,
	}

    getStyles() {
        return {
            link: {
                display: 'block',
                marginTop: 10,
            },
        };
    }

	render() {
        const styles = this.getStyles();
		return (
			<header className='app--header'>
				<Link to='company' style={styles.link}>Company</Link>
				<Link to='feed' style={styles.link}>Feed</Link>
			</header>
		);
	}
}

export default Header;
