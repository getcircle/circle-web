import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';

import DetailSection from '../DetailSectionV2';
import DetailListProfiles from '../DetailListProfiles';
import DetailListTeamsMinimal from '../DetailListTeamsMinimal';

import Bio from './Bio';
import ContactMethods from './ContactMethods';
import Items from './Items';

export const Teams = ({ teams }) => {
    return (
        <DetailSection title={'Teams'}>
            <DetailListTeamsMinimal teams={teams} />
        </DetailSection>
    );
};

Teams.propTypes = {
    teams: PropTypes.array.isRequired,
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
    const { directReports, manager, peers, profile, teams } = props;
    const theme = muiTheme.luno.detail;
    const styles = {
        section: {
            padding: 0,
        },
    };

    const managerSection = manager ? <Manager profiles={[manager]} /> : null;
    const peersSection = peers && peers.length ? <Peers profiles={peers} /> : null;
    const directReportsSection = directReports && directReports.length ? <DirectReports profiles={directReports} /> : null;
    const itemsSection = profile.items && profile.items.length ? <Items items={profile.items} /> : null;
    const teamsSection = teams && teams.length ? <Teams teams={teams} /> : null;
    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('About')}</h1>
            </section>
            <section className="row">
                <section className="col-xs-8" style={styles.section}>
                    <Bio profile={profile} />
                    {managerSection}
                    {peersSection}
                    {directReportsSection}
                </section>
                <section className="col-xs-offset-1 col-xs-3">
                    <ContactMethods profile={profile} />
                    {itemsSection}
                    {teamsSection}
                </section>
            </section>
        </div>
    );
};

ProfileDetailAbout.propTypes = {
    directReports: PropTypes.array,
    manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    peers: PropTypes.array,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    teams: PropTypes.array,
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
