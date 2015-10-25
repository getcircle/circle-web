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

export function routeToEditPost(router, post) {
    router.transitionTo(`/post/${post.id}/edit`);
}

export function routeToNewPost(router) {
    router.transitionTo('/new-post');
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
