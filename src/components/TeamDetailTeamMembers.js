import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardColumns from './CardColumns';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';

import ProfileAvatar from './ProfileAvatar';

class TeamDetailTeamMembers extends CSSComponent {

    static propTypes = {
        managerId: PropTypes.string,
        members: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
        onClickMember: PropTypes.func,
    }

    renderColumn(members) {
        if (members.length) {
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
    }

    handleClickAction() {
        this.refs.modal.show();
    }

    renderFooter(members) {
        if (members.length) {
            return (
                <CardFooter
                    actionText="view all team members"
                    onClick={::this.handleClickAction}
                />
            );
        }
    }

    render() {
        const { members } = this.props;
        return (
            <Card {...this.props} title="Team Members">
                <CardColumns
                    items={members}
                    itemsPerColumn={2}
                    numberOfColumns={2}
                    renderColumn={::this.renderColumn}
                />
                {this.renderFooter(members.slice(6))}
            </Card>
        );
    }

}

export default TeamDetailTeamMembers;
