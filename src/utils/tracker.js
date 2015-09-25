/*
    This class acts as a wrapper for our mixpanel implementation.
    It is named generically such that there are no conflicts with the libraries.

    ASSUMPTION: It assumes the needed libraries (Mixpanel in this case) has been globally
    added to the page and will be present before any call to this class is made.
*/
class Tracker {

    constructor() {
    }

    initSession(profile) {

        // Identify user is Mixpanel
        // Unique identifier for the user
        mixpanel.identify(profile.user_id);

        // Add attributes for this person
        mixpanel.people.set({
            'first_name': profile.first_name,
            'organization_id': profile.organization_id,
            'profile_id': profile.id,
            'title': profile.title,
            'user_id': profile.user_id,
        });

        // Add super properties, which should be included with event event
        mixpanel.register({
            'organization_id': profile.organization_id,
            'profile_id': profile.id,
            'user_id': profile.user_id,
        });
    }

    clearSession() {
        // Clears entire session
        // This should be called only on LOGOUT and not in mid-session.
        if (mixpanel.cookie && mixpanel.cookie.clear) {
            mixpanel.cookie.clear();
        }
    }
}

// NOTE: This is not a singleton and a new instance is generated each time.
export default new Tracker();
