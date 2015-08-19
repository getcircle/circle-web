import React from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import DetailViewAll from './DetailViewAll';
import StyleableComponent from './StyleableComponent';

import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
};

class ExtendedProfileManages extends StyleableComponent {

    static propTypes = {
        team: React.PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
        directReports: React.PropTypes.arrayOf(services.profile.containers.ProfileV1),
        onClickTeam: React.PropTypes.func,
        onClickDirectReport: React.PropTypes.func,
    }

    _renderTeam() {
        const { team } = this.props;
        return (
            <CardList>
                <CardListItem
                    primaryText={team.display_name}
                    secondaryText={getTeamLabel(team)}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
                    onTouchTap={this.props.onClickTeam}
                />
            </CardList>
        );
    }

    _handleClickAction() {
        this.refs.modal.show();
    }

    _renderFooter() {
        const { directReports } = this.props;
        if (directReports && directReports.length) {
            return (
                <div>
                    <CardFooter actionText="view all direct reports" onClick={this._handleClickAction.bind(this)}>
                        <CardFooterProfiles profiles={directReports} />
                    </CardFooter>
                    <DetailViewAll
                        ref="modal"
                        title="Direct Reports"
                        onClickItem={this.props.onClickDirectReport}
                        items={directReports}
                    />
                </div>
            );
        }
    }

    render() {
        return (
            <Card {...this.props} title="Manages">
                <CardRow>
                    {this._renderTeam()}
                </CardRow>
                {this._renderFooter()}
            </Card>
        );
    }

}

export default ExtendedProfileManages;
