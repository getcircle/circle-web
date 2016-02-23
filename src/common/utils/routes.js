import { browserHistory } from 'react-router';
import { getPostStateURLString } from './post';

const NEXT_PATHNAME_KEY = 'n:p';

export function getProfilePath(profile) {
    return `/profile/${profile.id}`;
}

export function routeToProfile(profile) {
    browserHistory.push(getProfilePath(profile));
}

export function replaceProfileSlug(profile, slug) {
    if (slug && typeof slug === 'string') {
        browserHistory.replace(`/profile/${profile.id}/${slug}`);
    }
}

export function replaceTeamSlug(team, slug) {
    browserHistory.replace(`/team/${team.id}/${slug}`);
}

export function replacePostState(state) {
    const stateString = getPostStateURLString(state);
    browserHistory.replace(`/posts/${stateString}`);
}

export function routeToTeam(team) {
    browserHistory.push(`/team/${team.id}`);
}

export function routeToLocation(location) {
    browserHistory.push(`/location/${location.id}`);
}

export function routeToEditPost(post) {
    browserHistory.push(`/post/${post.id}/edit`);
}

export function replaceWithEditPost(post) {
    browserHistory.replace(`/post/${post.id}/edit`);
}

export function routeToNewPost() {
    browserHistory.push('/new-post');
}

export function routeToDrafts() {
    browserHistory.push('/posts/drafts');
}

export function routeToPost(post) {
    browserHistory.push(`/post/${post.id}`);
}

export function routeToSearch(query) {
    query = encodeURIComponent(query);
    browserHistory.push(`/search/${query}`);
}

export function replaceSearchQuery(query) {
    browserHistory.replace(`/search/${query}`);
}

export function routeToAddIntegration(history, integration) {
    browserHistory.push(`/add-integration/${integration}`);
}

// TODO check if we still use this
export function routeToURL(url, nextPathname = null) {
    if (nextPathname !== null) {
        localStorage.setItem(NEXT_PATHNAME_KEY, nextPathname);
    }
    window.location = url;
}

export function getNextPathname(location, defaultValue) {
    let next = defaultValue || '/';
    if (
        (location === null || location === undefined) &&
        localStorage !== undefined &&
        localStorage !== null
    ) {
        next = localStorage.getItem(NEXT_PATHNAME_KEY);
        localStorage.removeItem(NEXT_PATHNAME_KEY);
    } else if (
        location !== undefined &&
        location !== null &&
        location.query !== null &&
        location.query !== undefined &&
        location.query.next !== undefined &&
        location.query.next !== null
    ) {
        next = location.query.next;
    }
    return next;
}
