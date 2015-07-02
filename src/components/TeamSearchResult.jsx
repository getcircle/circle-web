'use strict';

import React from 'react';

class TeamSearchResult extends React.Component {

    static propTypes = {
        team: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    render() {
        const team = this.props.team;
        return (
            <div className="row">
                <div className="col-xs" style={this.styles.detailsContainer}>
                    <span>{team.name}</span>
                </div>
            </div>
        );
    }
}

export default TeamSearchResult;
