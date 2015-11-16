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
    POST_PUBLISHED: 'Post Published',
    POST_REMOVED: 'Post Removed',
    PROFILE_UPDATE: 'Profile Update',
    SEARCH_RESULT_TAP: 'Search Result Tap',
    SEARCH_START: 'Search Start',
    SHARE: 'Share',
    TEAM_UPDATE: 'Team Update',
};

// Page Types (Convention: Titlecase, Separator - Space)
export const PAGE_TYPE = {
    // Global pages
    HOME: 'Home',
    BILLING: 'Billing',
    MY_KNOWLEDGE: 'My Knowledge',
    NEW_POST: 'New Post',
    SETTINGS: 'Settings',

    // Detail pages
    LOCATION_DETAIL: 'Location Detail',
    POST_DETAIL: 'Post Detail',
    PROFILE_DETAIL: SharedConstants.PROFILE_DETAIL,
    PROFILE_STATUS_DETAIL: 'Profile Status Detail',
    TEAM_DETAIL: 'Team Detail',

    // List pages
    CHANGE_POST_OWNER: 'Change Post Owner',
    PEERS: 'Peers',
    DIRECT_REPORTS: SharedConstants.DIRECT_REPORTS,
    TEAM_MEMBERS: SharedConstants.TEAM_MEMBERS,
    LOCATION_MEMBERS: SharedConstants.LOCATION_MEMBERS,
    LOCATION_POINTS_OF_CONTACT: 'Location Points of Contact',
    TEAM_SUBTEAMS: SharedConstants.TEAM_SUBTEAMS,

    // Editable Form
    EDIT_POST: 'Edit Post',
    EDIT_PROFILE: 'Edit Profile',
    EDIT_TEAM: 'Edit Team',

    // Selector pages
    PROFILE_SELECTOR: 'Profile Selector'
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
    PROFILE_STATUS: 'Profile Status',
    POST: 'Post',

    // Smart Actions (NOTE: Contact methods are captured separately)
    LOCATION_ADDRESS: 'Location Address',
    EMAIL_PROFILE: 'Email Person',

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
    POST_FEEDBACK: 'Post Detail Feedback',
    PROFILE_DETAIL: SharedConstants.PROFILE_DETAIL,
    PROFILE_DETAIL_STATUS: 'Profile Detail Status',
    SEARCH_SMART_ACTION: 'Search Smart Action',
    TEAM_DETAIL_STATUS: 'Team Detail Status',
    TEAM_DETAIL_DESCRIPTION: 'Team Detail Description',
};

// Post creation source
// This will track where the post was originally created. For e.g., Slack
// or Email or Bookmarklet.
export const POST_SOURCE = {
    WEB_APP: 'Web App',
    SLACK: 'Slack',
};

// Type of content being shared
export const SHARE_CONTENT_TYPE = {
    POST: 'Post',
};

// Method use to share content
export const SHARE_METHOD = {
    EMAIL: 'Email',
};
