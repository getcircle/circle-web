import { List } from 'material-ui';
import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class CardList extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
    }

    static defaultProps = {
        className: 'col-xs',
    }

    classes() {
        return {
            default: {
                root: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    width: '100%',
                },
            },
        };
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;

        return (
            <List {...other} style={{...this.styles().root, ...style}}>
                {this.props.children}
            </List>
        );
    }

}

export default CardList;
