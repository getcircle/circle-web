import React from 'react';

const styles = {
    root: {
        boxShadow: '1px 1px 3px -2px',
        backgroundColor: 'white',
        borderRadius: 3,
        padding: 20,
    },
};

class Card extends React.Component {

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <div style={Object.assign({}, styles.root, style)} {...other}>
                {this.props.children}
            </div>
        );
    }
}

export default Card;
