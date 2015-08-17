import mui from 'material-ui';
import React from 'react';
import { services } from 'protobufs';

import Card from './Card';
import ExtendedProfileHeader from './ExtendedProfileHeader';
import ExtendedProfileStatus from './ExtendedProfileStatus';

const {
    Avatar,
    Paper,
} = mui;

const styles = {
    content: {
        paddingTop: 60,
        boxSizing: 'border-box',
        maxWidth: 800,
        margin: '0px auto',
        backgroundColor: 'rgba(247, 249, 250)',
    },
    root: {
        backgroundColor: '#F7F9FA',
        minHeight: '100vh',
    },
    status: {
        height: 112,
    },
};

class ExtendedProfile extends React.Component {

    static propTypes = {
        extendedProfile: React.PropTypes.object.isRequired,
        organization: React.PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
    }

    _renderStatus() {
        return <ExtendedProfileStatus />;
    }

    render() {
        const {
            locations,
            profile,
            team,
        } = this.props.extendedProfile;
        const { organization } = this.props;
        return (
            <div style={styles.root}>
                <ExtendedProfileHeader
                    location={locations[0]}
                    organization={organization}
                    profile={profile}
                    team={team}
                />
                <section className="wrap" style={styles.content}>
                    {this._renderStatus()}
                </section>
            </div>
        );
    }

}

export default ExtendedProfile;