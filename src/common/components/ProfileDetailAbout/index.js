import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';

import DetailSection from '../DetailSectionV2';
import DetailListProfiles from '../DetailListProfiles';
import DetailListTeamMemberships from '../DetailListTeamMemberships';

import Bio from './Bio';
import EditButton from './EditButton';
import ContactMethods from './ContactMethods';
import Items from './Items';
import ProfileDetailForm from '../ProfileDetailForm';

export const Teams = ({ members }) => {
    return (
        <DetailSection dividerStyle={{marginBottom: 0}} title={'Teams'}>
            <DetailListTeamMemberships members={members} />
        </DetailSection>
    );
};

Teams.propTypes = {
    members: PropTypes.array.isRequired,
};

function buildProfileList(title) {
    return ({ profiles }) => {
        return (
            <DetailSection dividerStyle={{marginBottom: 0}} title={title}>
                <DetailListProfiles profiles={profiles} />
            </DetailSection>
        )
    };
}

const DirectReports = buildProfileList(t('Direct Reports'));
const Manager = buildProfileList(t('Manager'));
const Peers = buildProfileList(t('Peers'));

const ProfileDetailAbout = (props, { muiTheme }) => {
    const {
        dispatch,
        directReports,
        isAdmin,
        isLoggedInUser,
        manager,
        peers,
        profile,
        memberships
    } = props;
    const theme = muiTheme.luno.detail;

    const canEdit = isLoggedInUser || isAdmin;
    const editButton = canEdit ? <EditButton dispatch={dispatch} /> : null;
    const managerSection = manager ? <Manager profiles={[manager]} /> : null;
    const peersSection = peers && peers.length ? <Peers profiles={peers} /> : null;
    const directReportsSection = directReports && directReports.length ? <DirectReports profiles={directReports} /> : null;
    const itemsSection = profile.items && profile.items.length ? <Items items={profile.items} /> : null;
    const teamsSection = memberships && memberships.length ? <Teams members={memberships} /> : null;
    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('About')}</h1>
                {editButton}
            </section>
            <section className="row">
                <section className="col-xs-8" style={theme.section}>
                    <Bio canEdit={canEdit} dispatch={dispatch} profile={profile} />
                    {managerSection}
                    {peersSection}
                    {directReportsSection}
                </section>
                <section className="col-xs-4" style={theme.secondarySection}>
                    <ContactMethods canEdit={canEdit} dispatch={dispatch} profile={profile} />
                    {itemsSection}
                    {teamsSection}
                </section>
            </section>
            <ProfileDetailForm manager={manager} profile={profile} />
        </div>
    );
};

ProfileDetailAbout.propTypes = {
    directReports: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    isLoggedInUser: PropTypes.bool,
    manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    memberships: PropTypes.array,
    peers: PropTypes.array,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
};

ProfileDetailAbout.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

// export for testing
export {
    DirectReports,
    Manager,
    Peers,
    Teams,
};
export default ProfileDetailAbout;
