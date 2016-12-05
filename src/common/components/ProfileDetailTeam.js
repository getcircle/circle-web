import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';
import { PAGE_TYPE } from '../constants/trackerProperties';

import Card from './Card';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailSection from './DetailSection';
import DetailViewAll from './DetailViewAll';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';

class ProfileDetailTeam extends CSSComponent {

    static propTypes = {
        manager: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        onClickManager: PropTypes.func,
        onClickPeer: PropTypes.func,
        onClickTeam: PropTypes.func,
        peers: PropTypes.arrayOf(services.profile.containers.ProfileV1),
        team: PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    classes() {
        return {
            default: {
                IconContainer: {
                    stroke: 'rgba(0, 0, 0, .4)',
                },
            },
        };
    }

    renderTeam() {
        const { team } = this.props;
        return (
            <CardList>
                <CardListItem
                    leftAvatar={<IconContainer IconClass={GroupIcon} {...this.styles().IconContainer} />}
                    onTouchTap={this.props.onClickTeam}
                    primaryText={team.display_name}
                    secondaryText={getTeamLabel(team)}
                />
            </CardList>
        );
    }

    renderManager() {
        const { manager } = this.props;
        return (
            <CardList>
                <CardListItem
                    leftAvatar={<ProfileAvatar profile={manager} />}
                    onTouchTap={this.props.onClickManager}
                    primaryText={manager.full_name}
                    secondaryText={manager.display_title}
                />
            </CardList>
        );
    }

    renderFooter() {
        if (this.props.peers.length === 0) {
            return;
        }

        let footerActionText = '';
        if (this.props.peers.length === 1) {
            footerActionText = 'Works with 1 Peer';
        }
        else {
            footerActionText = `Works with ${this.props.peers.length} Peers`;
        }

        return (
            <CardFooter
                actionText={footerActionText}
                onClick={() => this.refs.peers.show()}
            />
        );
    }

    render() {

        return (
            <div>
                <DetailSection
                    {...this.props}
                    firstCard={(
                        <Card title="Reports To">
                            {this.renderManager()}
                        </Card>
                    )}
                    footer={this.renderFooter()}
                    secondCard={(
                        <Card title="Team">
                            {this.renderTeam()}
                        </Card>
                    )}
                />
                <DetailViewAll
                    filterPlaceholder="Search Peers"
                    items={this.props.peers}
                    pageType={PAGE_TYPE.PEERS}
                    ref="peers"
                    searchAttribute={services.search.containers.search.AttributeV1.TEAM_ID}
                    searchAttributeValue={this.props.team.id}
                    searchCategory={services.search.containers.search.CategoryV1.PROFILES}
                    title={`Peers (${this.props.peers.length})`}
                />
            </div>
        );
    }

}

export default ProfileDetailTeam;
