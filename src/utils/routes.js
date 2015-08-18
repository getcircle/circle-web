export function routeToProfile(profile) {
    this.transitionTo(`/profile/${profile.id}`);
}

export function routeToTeam(team) {
    this.transitionTo(`/team/${team.id}`);
}