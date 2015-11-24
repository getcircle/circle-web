import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    container: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 13,
    },
    negativeValue: {
        color: 'rgba(255, 0, 0, 0.7)',
    },
}

class CharacterCounter extends StyleableComponent {

    static propTypes = {
        counterLimit: PropTypes.number.isRequired,
        counterValue: PropTypes.number.isRequired,
    }

    render() {
        const {
            counterLimit,
            counterValue,
        } = this.props;

        return (
            <span style={this.mergeAndPrefix(styles.container, counterValue < 0 ? styles.negativeValue : {})}>
                {counterValue}&nbsp;/&nbsp;{counterLimit}
            </span>
        );
    }
}

export default CharacterCounter;
