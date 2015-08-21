export function routeToProfile(router, profile) {
    router.transitionTo(`/profile/${profile.id}`);
}

export function routeToTeam(router, team) {
    router.transitionTo(`/team/${team.id}`);
}

export function routeToLocation(router, location) {
    router.transitionTo(`/location/${location.id}`);
}
