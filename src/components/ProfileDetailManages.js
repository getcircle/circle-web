import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';

import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';

class ProfileDetailManages extends CSSComponent {

    static propTypes = {
        directReports: PropTypes.arrayOf(services.profile.containers.ProfileV1),
        onClickDirectReport: PropTypes.func,
        onClickTeam: PropTypes.func,
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
                    leftAvatar={<IconContainer IconClass={GroupIcon} is="IconContainer" />}
                    onTouchTap={this.props.onClickTeam}
                    primaryText={team.display_name}
                    secondaryText={getTeamLabel(team)}
                />
            </CardList>
        );
    }

    handleClickAction() {
        this.refs.modal.show();
    }

    renderFooter() {
        const { directReports } = this.props;
        if (directReports && directReports.length) {
            return (
                <div>
                    <CardFooter
                        actionText="view all direct reports"
                        onClick={::this.handleClickAction}
                    />
                </div>
            );
        }
    }

    render() {
        return (
            <Card {...this.props} title="Manages">
                <CardRow>
                    {this.renderTeam()}
                </CardRow>
                {this.renderFooter()}
            </Card>
        );
    }

}

export default ProfileDetailManages;
