import { services } from 'protobufs';

/**
 * Create a team
 *
 * @param {Object} client the service client
 * @param {services.team.containers.TeamV1} team a team container
 *
 * Example of how to call:
 *
 * const name = 'team name';
 * const descriptionText = 'description here';
 * const team = new services.team.containers.TeamV1({name: name, description: {value: descriptionText});
 * createTeam(client, team);
 */
export function createTeam(client, team) {
    const request = new services.team.actions.create_team.RequestV1({team});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                const { team } = response.result;
                resolve({team})
            })
            .catch(error => reject(error));
    });
}
