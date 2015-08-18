import React from 'react';

import PureComponent from './PureComponent';

const styles = {
    root: {
        width: 1,
        backgroundColor: 'rgba(0, 0, 0, .1)',
        marginTop: 20,
        marginBottom: 20,
    },
};

class CardVerticalDivider extends PureComponent {

    render() {
        return <div style={styles.root} />
    }

}

export default CardVerticalDivider;
