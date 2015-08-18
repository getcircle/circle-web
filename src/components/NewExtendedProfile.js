import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react';
import { services } from 'protobufs';

import autoBind from '../utils/autoBind';

import ExtendedProfileContactInfo from './ExtendedProfileContactInfo';
import ExtendedProfileHeader from './ExtendedProfileHeader';
import ExtendedProfileStatus from './ExtendedProfileStatus';
import ExtendedProfileTeam from './ExtendedProfileTeam';

const {
    Avatar,
    Paper,
} = mui;
const { StylePropable } = mui.Mixins;
const { ContactMethodV1 } = services.profile.containers;

const styles = {
    section: {
        marginTop: 20,
    },
    content: {
        paddingTop: 40,
        boxSizing: 'border-box',
        maxWidth: 800,
        margin: '0px auto',
        backgroundColor: 'rgba(247, 249, 250)',
    },
    root: {
        backgroundColor: '#F7F9FA',
        minHeight: '100vh',
        paddingBottom: 100,
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
        return <ExtendedProfileStatus style={this.mergeAndPrefix(styles.section)}/>;
    }

    _renderContactInfo(contactMethods=[], locations=[]) {
        return (
            <ExtendedProfileContactInfo
                style={this.mergeAndPrefix(styles.section)}
                contactMethods={contactMethods}
                locations={locations}
            />
        );
    }

    _renderTeam(manager, peers, team) {
        return (
            <ExtendedProfileTeam
                style={this.mergeAndPrefix(styles.section)}
                manager={manager}
                peers={peers}
                team={team}
            />
        );

    }

    _getContactMethods() {
        const { profile } = this.props.extendedProfile;
        let contactMethods = [new ContactMethodV1({
            label: "Email",
            value: profile.email,
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.EMAIL,
        })];
        return contactMethods.concat(profile.contact_methods);
    }

    render() {
        const {
            direct_reports,
            locations,
            manager,
            peers,
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
                    {this._renderContactInfo(this._getContactMethods(), locations)}
                    {this._renderTeam(manager, peers, team)}
                </section>
            </div>
        );
    }

}

export default ExtendedProfile;