const NEXT_PATHNAME_KEY = 'n:p';

export function routeToProfile(history, profile) {
    history.pushState(null, `/profile/${profile.id}`);
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

export function getNextPathname(query, defaultValue) {
    let next = defaultValue || '/';
    if (query === null || query === undefined) {
        next = localStorage.getItem(NEXT_PATHNAME_KEY);
        localStorage.removeItem(NEXT_PATHNAME_KEY);
    } else {
        if (query.next !== undefined || query.next !== null) {
            next = query.next;
        }
    }
    return next;
}
