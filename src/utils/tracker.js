import { services } from 'protobufs';

import logger from './logger';

import {
    EVENTS,
} from '../constants/trackerProperties';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;
const { AttributeV1, CategoryV1 } = services.search.containers.search;
const LUNO_SOURCE = 'ls';

export function getTrackingParameter(source) {
    return `${LUNO_SOURCE}=${source}`;
}

/**
 *   This class acts as a wrapper for our mixpanel implementation.
 *   It is named generically such that there are no conflicts with the libraries.
 *
 *   ASSUMPTION: It assumes the needed libraries (Mixpanel in this case) has been globally
 *   added to the page and will be present before any call to this class is made.
 *
 *   CONVENTIIONS:
 *   - All event tracking methods are named as track{Event in present tense}.
 *     Its best to imagine a suffix Event when trying to name these.
 *
 *   NOTE:
 *   The entire implementation here SHOULD be keept in sync with the spec.
 *   @see https://docs.google.com/a/lunohq.com/spreadsheets/d/1_UrLo5KccI9pcJ8p5K--9URwOmcZwE4W2uVc5F3B5sA/edit?usp=sharing
 */
class Tracker {

    constructor() {
        this._mixpanelLoaded = false;
        this._callbacks = [];
        this._sessionInitialized = false;
        mixpanel.init(process.env.MIXPANEL_TOKEN, {loaded: () => {
            this._mixpanelLoaded = true;
            this.flushQueue();
        }});
    }

    // Session methods

    /**
     *  Initializes the session.
     *
     *  - Sets the session identifier
     *  - Adds attributes to a person profile
     *  - Registers super properties.
     *
     * @param {ProfileV1} profile Profile of the logged in user
     * @param {OrganizationV1} organization Organization of the the logged in user
     */
    initSession(profile, organization) {
        this.withMixpanel(() => {
            if (this._sessionInitialized && mixpanel.cookie) {
                return;
            }

            if (!profile) {
                logger.error('Logged in user profile needs to be set for starting tracking session.');
                return;
            }

            if (!organization) {
                logger.error('Logged in user organization needs to be set for starting tracking session.');
                return;
            }

            logger.log('Initialized Tracker');

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
                'Organization Domain': organization.domain.toLowerCase(),
                'Profile ID': profile.id,
                'Title': profile.title,
                'User ID': profile.user_id,
            });

            // Add super properties, which should be included with event event
            mixpanel.register({
                'Organization ID': profile.organization_id,
                'Organization Domain': organization.domain.toLowerCase(),
                'Profile ID': profile.id,
                'User ID': profile.user_id,
            });

            this._sessionInitialized = true;
        });
    }

    /**
     * Removes all the cookies from Mixpanel.
     *
     * This resets the user session info and the super properties that
     * are added to each event.
     *
     * NOTE: The behavior if called in mid-session is unknown.
     */
    clearSession() {
        this.withMixpanel(() => {
            // Clears entire session
            // This should be called only on LOGOUT and not in mid-session.
            if (mixpanel.cookie && mixpanel.cookie.clear) {
                mixpanel.cookie.clear();
                this._sessionInitialized = false;
            }
        });
    }

    flushQueue() {

        if (this._mixpanelLoaded) {
            let length = this._callbacks.length;
            for (let i = 0; i < length; i++) {
                (this._callbacks.shift())();
            }
        }
    }

    withMixpanel(callback) {
        this._callbacks.push(callback);
        this.flushQueue();
    }

    // If we get an integer enum value, trying using the key in the expected
    // object as the string.
    getStringKeyValue(object, value) {
        if (typeof value === 'string') {
            return value;
        }

        let matchedKeys = Object.keys(object).filter(key => object[key] === value);
        if (matchedKeys.length === 0) {
            return value;
        }

        return matchedKeys[0];
    }

    getLunoSource() {
        const regex = new RegExp(`[[\\?&]${LUNO_SOURCE}=([^&#]*)`);
        const results = regex.exec(window.location.search);
        if (results !== null || (results && typeof(results[1]) === 'string' && results[1].length)) {
            return decodeURIComponent(results[1]).replace(/\+/g, ' ');
        };
    }

    // Events

    /**
     * Tracks the page view event.
     *
     * @param {string} pageType One of the PAGE_TYPE constants
     * @param {?string} pageId Optional identifier for the page (can be the PK
     *         of the associated object)
     */
    trackPageView(pageType, pageId) {
        this.withMixpanel(() => {
            logger.log('Track page view');
            if (!pageType) {
                logger.error('Page Type needs to be set for tracking page views.');
                return;
            }

            const attributes = {
                'Page Type': pageType,
                'Page ID': pageId && pageId !== '' ? pageId : undefined,
            };
            const source = this.getLunoSource();
            if (source) {
                attributes['Page Source'] = source;
            }
            mixpanel.track(EVENTS.PAGE_VIEW, attributes);

            // Increment global page views count for the user.
            mixpanel.people.increment('Page Views');
        });
    }

    /**
     * Tracks the taps on seach results.
     *
     * Note: This should not be used to track that a search was performed.
     * It is only if a user selected something from the suggested results.
     *
     * @param {string} query Search term when the result was tapped
     * @param {string} source One of the SEARCH_RESULT_SOURCE constants
     * @param {string} searchResultType One of the SEARCH_RESULT_TYPE constants
     * @param {number} resultIndex Position of the result when tapped
     * @param {string} searchLocation Location from where the search was performed. Constant value of SEARCH_LOCATION
     * @param {?string} resultId ID of the object tapped
     * @param {?search.CategoryV1} category Category for search
     * @param {?search.AttributeV1} attribute Search filter attribute
     * @param {?string} value Search filter attribute value
     */
    trackSearchResultTap(query, source, searchResultType, resultIndex, searchLocation, resultId, category, attribute, value) {
        this.withMixpanel(() => {
            if (!source) {
                logger.error('Search source needs to be set for tracking search result taps.');
                return;
            }

            if (!searchResultType) {
                logger.error('Search result type needs to be set for tracking search result taps.');
                return;
            }

            if (!searchLocation) {
                logger.error('Search location needs to be set for tracking search result taps.');
                return;
            }

            mixpanel.track(EVENTS.SEARCH_RESULT_TAP, {
                'Search Query': query === '' ? undefined : query,
                'Search Source': source,
                'Search Location': searchLocation,
                'Search Result Type': searchResultType,
                'Search Result ID': resultId && resultId !== '' ? resultId : undefined,
                'Search Result Index': resultIndex ? resultIndex : undefined,
                'Search Category': category !== null ? this.getStringKeyValue(CategoryV1, category) : undefined,
                'Search Attribute': attribute !== null ? this.getStringKeyValue(AttributeV1, attribute) : undefined,
                'Search Attribute Value': value ? value : undefined,
            });
        });
    }


    /**
     * Tracks the start of a search.
     *
     * @param {string} query Search term when the result was tapped
     * @param {string} searchLocation Location from where the search was performed. Constant value of SEARCH_LOCATION
     * @param {?search.CategoryV1} category Category for search
     * @param {?search.AttributeV1} attribute Search filter attribute
     * @param {?string} value Search filter attribute value
     */
    trackSearchStart(query, searchLocation, category, attribute, value) {
        this.withMixpanel(() => {
            if (!searchLocation) {
                logger.error('Search location needs to be set for tracking start of a search.');
                return;
            }

            mixpanel.track(EVENTS.SEARCH_START, {
                'Search Query': query === '' ? undefined : query,
                'Search Location': searchLocation,
                'Search Category': category !== null ? this.getStringKeyValue(CategoryV1, category) : undefined,
                'Search Attribute': attribute !== null ? this.getStringKeyValue(AttributeV1, attribute) : undefined,
                'Search Attribute Value': value ? value : undefined,
            });
        });
    }

    /**
     * Tracks the taps on contact methods.
     *
     * @param {number} contactMethod Constant value of type ContactMethodTypeV1
     * @param {string} contactId Identifier of the profile whose contact method was tapped
     * @param {string} contactLocation Constant value of CONTACT_LOCATION capturing where the tap happened
     */
    trackContactTap(contactMethod, contactId, contactLocation) {
        this.withMixpanel(() => {
            if (contactMethod === undefined || contactMethod === null) {
                logger.error('Contact Method needs to be set for tracking contact taps.');
                return;
            }

            if (!contactId) {
                logger.error('Contact ID needs to be set for tracking contact taps.');
                return;
            }

            if (!contactLocation) {
                logger.error('Contact Location needs to be set for tracking contact taps.');
                return;
            }

            mixpanel.track(EVENTS.CONTACT_TAP, {
                'Contact Method': this.getStringKeyValue(ContactMethodTypeV1, contactMethod),
                'Contact ID': contactId,
                'Contact Location': contactLocation,
            });
        });
    }

    /**
     * Tracks updates to a profile
     *
     * NOTE:
     * - Parameter and key are name "objectId" & "Object ID" to avoid conflict with the "Profile ID" super property.
     * - Fields should contain only fields that were REALLY updated to make analytics relevant and useful, which would
     *   be nice.
     *
     * @param {string} objectId ID of the profile being updated
     * @param {array} fields Array of fields that were updated. Fields can be the actual protobuf fields.
     *                       For nested structures, provide a string that represents the data.
     *                       All fields should be lower case and separated by underscore.
     */
    trackProfileUpdate(objectId, fields) {
        this.withMixpanel(() => {
            if (!objectId) {
                logger.error('Object ID needs to be set for tracking profile updates.');
                return;
            }

            if (!fields ||
                fields === undefined ||
                !(fields instanceof Array) ||
                fields.length === 0
            ) {
                logger.error('Fields that were updated need to be set and as an array for tracking profile updates.');
                return;
            }

            mixpanel.track(EVENTS.PROFILE_UPDATE, {
                'Object ID': objectId,
                'Fields': fields,
            });
        });
    }

    /**
     * Tracks updates to a team
     *
     * NOTE:
     * - Fields should contain only fields that were REALLY updated to make analytics relevant and useful, which would
     *   be nice.
     *
     * @param {string} teamId ID of the team being updated
     * @param {array} fields Array of fields that were updated. Fields can be the actual protobuf fields.
     *                       For nested structures, provide a string that represents the data.
     *                       All fields should be lower case and separated by underscore.
     */
    trackTeamUpdate(teamId, fields) {
        this.withMixpanel(() => {
            if (!teamId) {
                logger.error('Team ID needs to be set for tracking team updates.');
                return;
            }

            if (!fields ||
                fields === undefined ||
                !(fields instanceof Array) ||
                fields.length === 0
            ) {
                logger.error('Fields that were updated need to be set and as an array for tracking team updates.');
                return;
            }

            mixpanel.track(EVENTS.TEAM_UPDATE, {
                'Team ID': teamId,
                'Fields': fields,
            });
        });
    }
}

// NOTE: This is not a singleton and a new instance is generated each time.
export default new Tracker();
