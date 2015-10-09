import { getTrackingParameter } from './tracker';
import t from './gettext';

const PROFILE_ASK_ME = 'profile_askme';

function sentFrom() {
    return encodeURI(t(`\n\n\nSent from ${window.location.host}`));
}

export function mailto(email) {
    return `mailto:${email}?body=${sentFrom()}`;
}

export function mailtoProfileStatus(profile, fromProfile) {
    const subject = encodeURI(t('Working on in Luno'));
    const sourceParameter = getTrackingParameter(PROFILE_ASK_ME)
    const link = `${window.location.host}/profile/${profile.id}?${sourceParameter}`
    const body = encodeURI(t(`Hey ${profile.first_name},\n\nCan you update what you're working on in Luno?\n\n${link}\n\nThanks!\n\n${fromProfile.first_name}`));
    return `mailto:${profile.email}?subject=${subject}&body=${body}${sentFrom()}`;
}
