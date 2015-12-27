import { getTrackingParameter } from './tracker';
import t from './gettext';

const TEAM_DESCRIPTION_ASK_ME = 'team_description_askme';
const POST_SHARE = 'post_share_email';
const POST_FEEDBACK = 'post_feedback';

function sentFrom() {
    return encodeURI(t(`\n\n\nSent from ${window.location.host}`));
}

export function mailto(email) {
    return `mailto:${email}?body=${sentFrom()}`;
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

export function mailtoTeamDescription(team, manager, fromProfile) {
    return mailtoTeam(TEAM_DESCRIPTION_ASK_ME, team, manager, fromProfile);
}

export function mailtoSharePost(post, fromProfile) {
    console.log('fromProfile: %s', fromProfile);
    console.log('post: %s', post);
    console.log('post by_profile: %s', post.by_profile);
    const subject = encodeURI(t('Check out "' + post.title + '" on Luno'));
    const sourceParameter = getTrackingParameter(POST_SHARE);
    const link = `${window.location.host}/post/${post.id}?${sourceParameter}`;
    const byAuthorString = post.by_profile.id === fromProfile.id ? '' : ' by ' + post.by_profile.first_name;
    const body = encodeURI(t(
        `"${post.title}" post${byAuthorString} might be helpful to you. Check it out on Luno!
        \n${link}
        \nCheers!\n${fromProfile.first_name}`
    ));

    return `mailto:?subject=${subject}&body=${body}${sentFrom()}`;
}

export function mailToPostFeedback(post, fromProfile) {
    const subject = encodeURI(t('Thoughts on your Luno post "' + post.title + '"'));
    const sourceParameter = getTrackingParameter(POST_FEEDBACK);
    const link = `${window.location.host}/post/${post.id}?${sourceParameter}`;
    const body = encodeURI(t(
        `Hey ${post.by_profile.first_name},
        \nI had a few thoughts on your "${post.title}" (${link}) post on Luno:
        \n
        \nThanks!\n${fromProfile.first_name}`
    ));

    return `mailto:${post.by_profile.email}?subject=${subject}&body=${body}${sentFrom()}`;

}

