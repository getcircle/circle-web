'use strict';

import React from 'react';

import InfiniteCardGrid from './InfiniteCardGrid';
import TeamTile from './TeamTile';

class TeamsOverview extends React.Component {

    static propTypes = {
        teams: React.PropTypes.array.isRequired,
    }

    styles = {
        gridContainer: {
            paddingBottom: 50,
        },
    }

    render() {
        return (
            <div style={this.styles.gridContainer}>
                <InfiniteCardGrid
                    objects={this.props.teams}
                    loading={false}
                    ComponentClass={TeamTile}
                    componentAttributeName="team"
                />
            </div>
        );
    }
}

export default TeamsOverview;
