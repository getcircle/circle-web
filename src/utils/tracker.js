import {
    EVENTS,
    PAGE_TYPE,
} from '../constants/trackerProperties';

/*
    This class acts as a wrapper for our mixpanel implementation.
    It is named generically such that there are no conflicts with the libraries.

    ASSUMPTION: It assumes the needed libraries (Mixpanel in this case) has been globally
    added to the page and will be present before any call to this class is made.
*/
class Tracker {

    constructor() {
    }

    // Session methods

    /**
     *  Initializes the session.
     *
     *  - Sets the session identifier.
     *  - Adds attributes to a person profile.
     *  - Registers super properties.
     */
    initSession(profile) {

        // Identify user is Mixpanel
        // Unique identifier for the user
        mixpanel.identify(profile.user_id);

        // Add attributes for this person
        // NOTE: $first_name does not follow the convention
        // because it a reserved mixpanel property and
        // is supposed to be defined this way.
        mixpanel.people.set({
            '$first_name': profile.first_name,
            'Organization ID': profile.organization_id,
            'Profile ID': profile.id,
            'Title': profile.title,
            'User ID': profile.user_id,
        });

        // Add super properties, which should be included with event event
        mixpanel.register({
            'Organization ID': profile.organization_id,
            'Profile ID': profile.id,
            'User ID': profile.user_id,
        });
    }

    clearSession() {
        // Clears entire session
        // This should be called only on LOGOUT and not in mid-session.
        if (mixpanel.cookie && mixpanel.cookie.clear) {
            mixpanel.cookie.clear();
        }
    }

    // Events

    /**
     * Tracks the page view event.
     *
     * pageType should be one of the page type constants.
     * pageId is an optional identifier for the page. This should be the primary key
     *         of the associated object.
     */
    trackPageView(pageType, pageId) {
        if (!pageType) {
            console.error('pageType needs to be set for this function.');
            return;
        };

        mixpanel.track(EVENTS.PAGE_VIEW, {
            'Page Type': pageType,
            'Page ID': pageId && pageId !== '' ? pageId : undefined,
        });
        mixpanel.people.increment('Page Views');
    }

}

// NOTE: This is not a singleton and a new instance is generated each time.
export default new Tracker();
