import React from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import DetailViewAll from './DetailViewAll';
import StyleableComponent from './StyleableComponent';

import ProfileAvatar from './ProfileAvatar';

const styles = {}

class TeamDetailTeamMembers extends StyleableComponent {

    static propTypes = {
        managerId: React.PropTypes.string,
        members: React.PropTypes.arrayOf(
            React.PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
        onClickMember: React.PropTypes.func,
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

    _handleClickAction() {
        this.refs.modal.show();
    }

    _renderFooter(members) {
        if (members.length) {
            return (
                <div>
                    <CardFooter actionText="view all team members" onClick={this._handleClickAction.bind(this)}>
                        <CardFooterProfiles profiles={members} />
                    </CardFooter>
                    <DetailViewAll
                        ref="modal"
                        title="Team Members"
                        onClickItem={this.props.onClickMember}
                        items={this.props.members}
                    />
                </div>
            );
        }
    }

    render() {
        const { members } = this.props;
        // break out members into two columns, with a max of three profiles each
        const firstColumn = members.slice(0, 3);
        const secondColumn = members.slice(3, 6);
        return (
            <Card {...this.props} title="Team Members">
                <CardRow>
                    {this._renderColumn(firstColumn)}
                    {() => {
                        if (secondColumn.length) {
                            return <CardVerticalDivider />;
                        }
                    }}
                    {this._renderColumn(secondColumn)}
                </CardRow>
                {this._renderFooter(members.slice(6))}
            </Card>
        );
    }

}

export default TeamDetailTeamMembers;
