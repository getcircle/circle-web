import { getTrackingParameter } from './tracker';
import t from './gettext';

const PROFILE_ASK_ME = 'profile_askme';
const TEAM_STATUS_ASK_ME = 'team_status_askme';
const TEAM_DESCRIPTION_ASK_ME = 'team_description_askme';

function sentFrom() {
    return encodeURI(t(`\n\n\nSent from ${window.location.host}`));
}

export function mailto(email) {
    return `mailto:${email}?body=${sentFrom()}`;
}

export function mailtoProfileStatus(profile, fromProfile) {
    const subject = encodeURI(t('Working on in Luno'));
    const sourceParameter = getTrackingParameter(PROFILE_ASK_ME);
    const link = `${window.location.host}/profile/${profile.id}?${sourceParameter}`;
    const body = encodeURI(t(
        `Hey ${profile.first_name},
        \nCan you update what you're working on in Luno?
        \n${link}
        \nThanks!
        \n${fromProfile.first_name}`
    ));
    return `mailto:${profile.email}?subject=${subject}&body=${body}${sentFrom()}`;
}

function getEmptyTeamFields(team) {
    let emptyFields = [];
    [[team.name, t('name')], [team.description, t('description')], [team.status, t('status')]].forEach((field) => {
        let [value, label] = field;
        if (value === null || value === '' || value === undefined) {
            emptyFields.push(label);
        } else {
            // handle description and status that might have empty value
            if (value && value.value !== undefined && (value.value === null || value.value === '')) {
                emptyFields.push(label);
            }
        }
    });
    let suffix = '';
    if (emptyFields.length > 1) {
        const lastIndex = emptyFields.length - 1;
        suffix = t(` and ${emptyFields[lastIndex]}`)
        emptyFields = emptyFields.slice(0, lastIndex);
    }
    return emptyFields.join(', ') + suffix;
}

function mailtoTeam(source, team, manager, fromProfile) {
    const subject = encodeURI(t('Update your team\'s info in Luno'));
    const sourceParameter = getTrackingParameter(source);
    const link = `${window.location.host}/team/${team.id}?${sourceParameter}`;
    const emptyFields = getEmptyTeamFields(team);
    const body = encodeURI(t(
        `Hey ${manager.first_name},
        \nCan you update your team's ${emptyFields} in Luno?
        \n${link}
        \nThanks!
        \n${fromProfile.first_name}`
    ));
    return `mailto:${manager.email}?subject=${subject}&body=${body}${sentFrom()}`;

}

export function mailtoTeamStatus(team, manager, fromProfile) {
    return mailtoTeam(TEAM_STATUS_ASK_ME, team, manager, fromProfile);
}

export function mailtoTeamDescription(team, manager, fromProfile) {
    return mailtoTeam(TEAM_DESCRIPTION_ASK_ME, team, manager, fromProfile);
}
