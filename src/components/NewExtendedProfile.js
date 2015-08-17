import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react';
import { services } from 'protobufs';

import autoBind from '../utils/autoBind';

import Card from './Card';
import ExtendedProfileHeader from './ExtendedProfileHeader';
import ExtendedProfileStatus from './ExtendedProfileStatus';

const {
    Avatar,
    Paper,
} = mui;
const { StylePropable } = mui.Mixins;

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
};

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class ExtendedProfile extends React.Component {

    static propTypes = {
        extendedProfile: React.PropTypes.object.isRequired,
        organization: React.PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
    }

    _renderStatus() {
        return <ExtendedProfileStatus />;
    }

    _renderContactInfo() {
        return <ExtendedProfileContactInfo />;
    }

    render() {
        const {
            locations,
            profile,
            team,
        } = this.props.extendedProfile;
        const { organization } = this.props;
        return (
            <div style={this.mergeAndPrefix(styles.root)}>
                <ExtendedProfileHeader
                    location={locations[0]}
                    organization={organization}
                    profile={profile}
                    team={team}
                />
                <section className="wrap" style={this.mergeAndPrefix(styles.content)}>
                    {this._renderStatus()}
                    {this._renderContactInfo()}
                </section>
            </div>
        );
    }

}

export default ExtendedProfile;