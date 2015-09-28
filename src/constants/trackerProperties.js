// Shared constants are values that are shared
// across multiple attributes to ensure consistency
// of data
const SharedConstants = {
    DIRECT_REPORTS: 'Direct Reports',
    TEAM_MEMBERS: 'Team Members',
    LOCATION_MEMBERS: 'Location Members',
    TEAM_SUBTEAMS: 'Team Sub-Teams',
};

// Events (Convention: Titlecase, Separator - Space)
export const EVENTS = {
    PAGE_VIEW: 'Page View',
    SEARCH_RESULT_TAPPED: 'Search Result Tapped',
};

// Page Types (Convention: Titlecase, Separator - Space)
export const PAGE_TYPE = {
    // Global pages
    HOME: 'Home',
    SETTINGS: 'Settings',
    BILLING: 'Billing',

    // Detail pages
    PROFILE_DETAIL: 'Profile Detail',
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
export const SEARCH_RESULT_SOURCE = {
    RECENTS: 'Recents',
    EXPLORE: 'Explore',
    SUGGESTION: 'Suggestion',
    SMART_ACTION: 'Smart Action',
};

// Search Result Types (Convention: Titlecase, Separator - Space)
export const SEARCH_RESULT_TYPE = {

    // Suggestions - Explore and Regular
    PROFILE : 'Profile',
    TEAM : 'Team',
    LOCATION : 'Location',

    // Smart Actions
    EMAIL : 'Email',
    CALL : 'Call',
    TEXT_MESSAGE: 'Text Message',
    LOCATION_ADDRESS: 'Location Address',

    // Extended Results
    REPORTS_TO : SharedConstants.DIRECT_REPORTS,
    TEAM_MEMBERS: SharedConstants.TEAM_MEMBERS,
    TEAM_SUBTEAMS: SharedConstants.TEAM_SUBTEAMS,
    LOCATION_MEMBERS: SharedConstants.LOCATION_MEMBERS,
};
