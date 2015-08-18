import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React from 'react';
import { services } from 'protobufs';

import { loadExtendedTeam } from '../actions/teams';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import PureComponent from '../components/PureComponent'; 
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [selectors.extendedTeamsSelector, selectors.routerSelector],
    (extendedTeamsState, routerState) => {
        return {
            extendedTeam: extendedTeamsState.getIn(['objects', routerState.params.teamId]),
        }
    }
);

@connect(selector)
class Team extends React.Component {

    static propTypes = {
        extendedTeam: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    _loadTeam(props) {
        props.dispatch(loadExtendedTeam(props.params.teamId));
    }

    componentWillMount() {
        this._loadTeam(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            this._loadTeam(nextProps);
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _renderTeam() {
        const {
            extendedTeam,
        } = this.props;
        if (extendedTeam) {
            return <TeamDetail extendedTeam={extendedTeam} />;
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this._renderTeam()}
            </Container>
        );
    }

}

export default Team;
