import { ListItem } from 'material-ui';
import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    avatar: {
        height: 60,
        width: 60,
    },
    innerDivStyle: {
        paddingLeft: 90,
        paddingTop: 30,
        paddingBottom: 30,
    },
}

class CardListItem extends StyleableComponent {

    static propTypes = {
        leftAvatar: PropTypes.element,
        primaryText: PropTypes.string,
        secondaryText: PropTypes.string,
    }

    _mergeElementStyles(element, baseStyles) {
        const styles = this.mergeStyles(baseStyles, element.props.style);
        return React.cloneElement(element, {style: styles});
    }

    render () {
        const {
            innerDivStyle,
            leftAvatar,
            ...other,
        } = this.props;
        let avatar;
        if (leftAvatar) {
            avatar = this._mergeElementStyles(leftAvatar, styles.avatar);
        }
        let innerStyle = this.mergeAndPrefix(styles.innerDivStyle, innerDivStyle);
        return (
            <ListItem
                {...other}
                leftAvatar={avatar}
                innerDivStyle={innerStyle}
            />
        );
    }



}

export default CardListItem;
