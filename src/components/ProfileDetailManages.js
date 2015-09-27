import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';
import { PAGE_TYPE } from '../constants/trackerProperties';

import Card from './Card';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailViewAll from './DetailViewAll';

import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';

class ProfileDetailManages extends CSSComponent {

    static propTypes = {
        directReports: PropTypes.arrayOf(services.profile.containers.ProfileV1),
        largerDevice: PropTypes.bool.isRequired,
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

    renderFooter() {
        const { directReports } = this.props;
        if (directReports && directReports.length) {
            let actionText = '';
            if (directReports.length === 1) {
                actionText = 'View 1 Direct Report';
            }
            else {
                actionText = `View ${directReports.length} Direct Reports`;
            }

            return (
                <div>
                    <CardFooter
                        actionText={actionText}
                        onClick={() => this.refs.directReports.show()}
                    />
                    <DetailViewAll
                        filterPlaceholder="Search Direct Reports"
                        items={directReports}
                        largerDevice={this.props.largerDevice}
                        pageType={PAGE_TYPE.DIRECT_REPORTS}
                        ref="directReports"
                        title={`Direct Reports (${this.props.directReports.length})`}
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
