import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardColumns from './CardColumns';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import StyleableComponent from './StyleableComponent';

import ProfileAvatar from './ProfileAvatar';

class DetailMembers extends StyleableComponent {

    static propTypes = {
        actionText: PropTypes.string,
        itemsPerCollapsedColumn: PropTypes.number,
        itemsPerColumn: PropTypes.number,
        members: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
        numberOfColumns: PropTypes.number,
        onClickActionText: PropTypes.func,
        onClickMember: PropTypes.func,
    }

    renderColumn(members) {
        const children = members.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    leftAvatar={<ProfileAvatar profile={item} />}
                    onTouchTap={this.props.onClickMember.bind(null, item)}
                    primaryText={item.full_name}
                    secondaryText={item.title}
                />
            );
        });
        return (
            <CardList>
                {children}
            </CardList>
        );
    }

    renderFooter() {
        return (
            <CardFooter
                actionText={this.props.actionText}
                onClick={this.props.onClickActionText}
            />
        );
    }

    render() {
        const {
            actionText,
            itemsPerCollapsedColumn,
            itemsPerColumn,
            members,
            onClickMember,
            ...other,
        } = this.props;
        return (
            <Card {...other}>
                <CardColumns
                    items={members}
                    itemsPerCollapsedColumn={itemsPerCollapsedColumn}
                    itemsPerColumn={itemsPerColumn}
                    renderColumn={::this.renderColumn}
                />
                {this.renderFooter()}
            </Card>
        );
    }

}

export default DetailMembers;
