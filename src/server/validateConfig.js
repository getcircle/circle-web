/**
 * Validate that process.env defines all of our required fields. This is useful
 * to ensure that we won't start the server until we have these fields. This
 * can help avoid bugs were we start serving traffic with no config values set
 * (ie. for session secret).
 *
 * @param {string[]} - an array of required keys that we'll enforce must be
 * defined in process.env
 * @throws {Error} will throw an error if one of the required keys isn't
 * present in process.env
 */
export default function (requiredKeys) {
    for (let key of requiredKeys) {
        if (!process.env[key]) {
            throw new Error(`missing required env variable: ${key}`);
        }
    }
}
