import { ListItem } from 'material-ui';
import merge from 'merge';
import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';

import CSSComponent from './CSSComponent';

class CardListItem extends CSSComponent {

    static propTypes = {
        innerDivStyle: PropTypes.object,
        leftAvatar: PropTypes.element,
        primaryText: PropTypes.string,
        primaryTextStyle: PropTypes.object,
        secondaryText: PropTypes.string,
    }

    styles() {
        return this.css({
            singleLine: !this.props.secondaryText || this.props.secondaryText.trim() === '',
        });
    }

    classes() {
        return {
            default: {
                avatar: {
                    height: 60,
                    width: 60,
                    top: '18px',
                },
                innerDivStyle: {
                    paddingLeft: 90,
                    paddingTop: 30,
                    paddingBottom: 30,
                },
                primaryTextStyle: {
                    fontSize: '16px',
                    ...fontColors.dark,
                },
                secondaryTextStyle: {
                    fontSize: '12px',
                    ...fontColors.light,
                },
            },
            singleLine: {
                avatar: {
                    top: '18px',
                },
                innerDivStyle: {
                    height: 96,
                },
                primaryTextStyle: {
                    marginTop: 10,
                },
            },
        };
    }

    mergeAvatarStyles(element, baseStyles) {
        const styles = merge.recursive(baseStyles, element.props.style);
        return React.cloneElement(element, {style: styles});
    }

    render() {
        const {
            innerDivStyle,
            leftAvatar,
            primaryTextStyle,
            ...other,
        } = this.props;

        let avatar;
        if (leftAvatar) {
            avatar = this.mergeAvatarStyles(leftAvatar, this.styles().avatar);
        }
        const innerStyle = {...this.styles().innerDivStyle, ...innerDivStyle};
        const primaryStyle = {...this.styles().primaryTextStyle, ...primaryTextStyle};
        const secondaryStyle = {...this.styles().secondaryTextStyle};
        return (
            <ListItem
                className="middle-xs"
                {...other}
                innerDivStyle={innerStyle}
                leftAvatar={avatar}
                primaryTextStyle={primaryStyle}
                secondaryTextStyle={secondaryStyle}
            />
        );
    }



}

export default CardListItem;
