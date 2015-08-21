import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import StyleableComponent from './StyleableComponent';

import ProfileAvatar from './ProfileAvatar';

class DetailMembers extends StyleableComponent {

    static propTypes = {
        actionText: PropTypes.string,
        members: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
        perColumn: PropTypes.number,
        onClickMember: PropTypes.func,
        onClickActionText: PropTypes.func,
    }

    static defaultProps = {
        perColumn: 3,
    }

    _renderColumn(members) {
        if (members.length) {
            const children = members.map((item, index) => {
                return (
                    <CardListItem
                        key={index}
                        primaryText={item.full_name}
                        secondaryText={item.title}
                        leftAvatar={<ProfileAvatar profile={item} />}
                        onTouchTap={this.props.onClickMember.bind(null, item)}
                    />
                );
            });
            return (
                <CardList>
                    {children}
                </CardList>
            );
        }
    }

    _renderFooter(members) {
        if (members.length) {
            return (
                <CardFooter actionText={this.props.actionText} onClick={this.props.onClickActionText}>
                    <CardFooterProfiles profiles={members} />
                </CardFooter>
            );
        }
    }

    render() {
        const {
            actionText,
            members,
            onClickMember,
            perColumn,
            ...other,
        } = this.props;
        // break out members into two columns, with a max of "perColumn" profiles each
        const firstColumn = members.slice(0, perColumn);
        const secondColumn = members.slice(perColumn, perColumn * 2);
        return (
            <Card {...other}>
                <CardRow>
                    {this._renderColumn(firstColumn)}
                    {() => {
                        if (secondColumn.length) {
                            return <CardVerticalDivider />;
                        }
                    }}
                    {this._renderColumn(secondColumn)}
                </CardRow>
                {this._renderFooter(members.slice(perColumn * 2))}
            </Card>
        );
    }

}

export default DetailMembers;
