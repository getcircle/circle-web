const NEXT_PATHNAME_KEY = 'n:p';

export function routeToProfile(router, profile) {
    router.transitionTo(`/profile/${profile.id}`);
}

export function routeToTeam(router, team) {
    router.transitionTo(`/team/${team.id}`);
}

export function routeToLocation(router, location) {
    router.transitionTo(`/location/${location.id}`);
}

export function routeToStatus(router, status) {
    router.transitionTo(`/status/${status.id}`);
}

export function routeToPosts(router, postState) {
    router.transitionTo(`/posts/${postState}`);
}

export function routeToPost(router, post) {
    router.transitionTo(`/post/${post.id}`);
}

export function routeToURL(url, nextPathname = null) {
    if (nextPathname !== null) {
        localStorage.setItem(NEXT_PATHNAME_KEY, nextPathname);
    }
    window.location = url;
}

export function getNextPathname() {
    const nextPathname = localStorage.getItem(NEXT_PATHNAME_KEY);
    localStorage.removeItem(NEXT_PATHNAME_KEY);
    return nextPathname;
}
