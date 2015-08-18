import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import autoBind from '../utils/autoBind';

const { ListItem } = mui;
const { StylePropable } = mui.Mixins;

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

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class CardListItem extends Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        leftAvatar: React.PropTypes.element,
        primaryText: React.PropTypes.string,
        secondaryText: React.PropTypes.string,
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
