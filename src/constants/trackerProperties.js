// Shared constants are values that are shared
// across multiple attributes to ensure consistency
// of data
const SharedConstants = {
    DIRECT_REPORTS: 'Direct Reports',
    LOCATION_MEMBERS: 'Location Members',
    PROFILE_DETAIL: 'Profile Detail',
    TEAM_MEMBERS: 'Team Members',
    TEAM_SUBTEAMS: 'Team Sub-Teams',
};

// Events (Convention: Titlecase, Separator - Space)
// Do not use past tense
export const EVENTS = {
    CONTACT_TAP: 'Contact Tap',
    PAGE_VIEW: 'Page View',
    SEARCH_RESULT_TAP: 'Search Result Tap',
};

// Page Types (Convention: Titlecase, Separator - Space)
export const PAGE_TYPE = {
    // Global pages
    HOME: 'Home',
    SETTINGS: 'Settings',
    BILLING: 'Billing',

    // Detail pages
    PROFILE_DETAIL: SharedConstants.PROFILE_DETAIL,
    TEAM_DETAIL: 'Team Detail',
    LOCATION_DETAIL: 'Location Detail',

    // List pages
    PEERS: 'Peers',
    DIRECT_REPORTS: SharedConstants.DIRECT_REPORTS,
    TEAM_MEMBERS: SharedConstants.TEAM_MEMBERS,
    LOCATION_MEMBERS: SharedConstants.LOCATION_MEMBERS,
    LOCATION_POINTS_OF_CONTACT: 'Location Points of Contact',
    TEAM_SUBTEAMS: SharedConstants.TEAM_SUBTEAMS,

    // Editable Form
    EDIT_PROFILE: 'Edit Profile',
};

// Search Result Sources (Convention: Titlecase, Separator - Space)
// Section under which the result was listed
export const SEARCH_RESULT_SOURCE = {
    RECENTS: 'Recents',
    EXPLORE: 'Explore',
    SUGGESTION: 'Suggestion',
    SMART_ACTION: 'Smart Action',
};

// Search Result Types (Convention: Titlecase, Separator - Space)
// Type of the result tapped
export const SEARCH_RESULT_TYPE = {

    // Suggestions - Explore and Regular
    PROFILE : 'Profile',
    TEAM : 'Team',
    LOCATION : 'Location',

    // Smart Actions (NOTE: Contact methods are captured separately)
    LOCATION_ADDRESS: 'Location Address',

    // Extended Results
    REPORTS_TO : SharedConstants.DIRECT_REPORTS,
    TEAM_MEMBERS: SharedConstants.TEAM_MEMBERS,
    TEAM_SUBTEAMS: SharedConstants.TEAM_SUBTEAMS,
    LOCATION_MEMBERS: SharedConstants.LOCATION_MEMBERS,
};

// Search Location (Convention: Titlecase, Separator - Space)
// Where the search was performed
export const SEARCH_LOCATION = {
    HOME: 'Home',
    // This is web specific.
    PAGE_HEADER: 'Page Header',
    // This really represents a filtered list view's header
    // but 'modal' can imply that and is a cleaner way to represent
    // it even if we can how the visuals work.
    MODAL: 'Modal',
};

// Contact Location (Convention: Titlecase, Separator - Space)
// Where the contact method was tapped
export const CONTACT_LOCATION = {
    PROFILE_DETAIL: SharedConstants.PROFILE_DETAIL,
    SEARCH_SMART_ACTION: 'Search Smart Action',
};

// Contact Method (Convention: Titlecase, Separator - Space)
// Method of contact. We have Contact Methods as part of
// the protobufs but they are defined as a member of enum and have
// numerical values which
// a. make it easier to change them in the future which doesn't work for tracking
// b. make the processing of data in the Dashboard very hard
// c. are more granular than needed for analytics. E.g., work vs home email/phone.
export const CONTACT_METHOD = {
    EMAIL: 'Email',
    PHONE: 'Phone',
};
