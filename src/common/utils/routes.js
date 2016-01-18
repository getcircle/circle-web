const NEXT_PATHNAME_KEY = 'n:p';

export function routeToProfile(history, profile, slug) {
    if (slug && typeof slug === 'string') {
        history.pushState(null, `/profile/${profile.id}/${slug}`);
    } else {
        history.pushState(null, `/profile/${profile.id}`);
    }
}

export function routeToTeam(history, team) {
    history.pushState(null, `/team/${team.id}`);
}

export function routeToLocation(history, location) {
    history.pushState(null, `/location/${location.id}`);
}

export function routeToEditPost(history, post) {
    history.pushState(null, `/post/${post.id}/edit`);
}

export function routeToNewPost(history) {
    history.pushState(null, '/new-post');
}

export function routeToPosts(history, postState) {
    history.pushState(null, `/posts/${postState}`);
}

export function routeToPost(history, post) {
    history.pushState(null, `/post/${post.id}`);
}

export function routeToSearch(history, query) {
    history.pushState(null, `/search/${query}`);
}

export function replaceSearchQuery(history, query) {
    history.replaceState(null, `/search/${query}`);
}

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
