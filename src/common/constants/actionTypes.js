// Auth Actions
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE';
export const GET_AUTHENTICATION_INSTRUCTIONS = 'GET_AUTHENTICATION_INSTRUCTIONS';
export const GET_AUTHENTICATION_INSTRUCTIONS_SUCCESS = 'GET_AUTHENTICATION_INSTRUCTIONS_SUCCESS';
export const GET_AUTHENTICATION_INSTRUCTIONS_FAILURE = 'GET_AUTHENTICATION_INSTRUCTIONS_FAILURE';
export const GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS = 'GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS';
export const GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS_SUCCESS = 'GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS_SUCCESS';
export const GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS_FAILURE = 'GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS_FAILURE';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const LOAD_AUTH = 'LOAD_AUTH';
export const LOAD_AUTH_SUCCESS = 'LOAD_AUTH_SUCCESS';
export const LOAD_AUTH_FAILURE = 'LOAD_AUTH_FAILURE';
export const REQUEST_ACCESS = 'REQUEST_ACCESS';
export const REQUEST_ACCESS_SUCCESS = 'REQUEST_ACCESS_SUCCESS';
export const REQUEST_ACCESS_FAILURE = 'REQUEST_ACCESS_FAILURE';

// Profile Actions
export const LOAD_PROFILES = 'LOAD_PROFILES';
export const LOAD_PROFILES_SUCCESS = 'LOAD_PROFILES_SUCCESS';
export const LOAD_PROFILES_FAILURE = 'LOAD_PROFILES_FAILURE';
export const LOAD_EXTENDED_PROFILE = 'LOAD_EXTENDED_PROFILE';
export const LOAD_EXTENDED_PROFILE_SUCCESS = 'LOAD_EXTENDED_PROFILE_SUCCESS';
export const LOAD_EXTENDED_PROFILE_FAILURE = 'LOAD_EXTENDED_PROFILE_FAILURE';
export const GET_PROFILE = 'GET_PROFILE';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE';
export const GET_PROFILE_REPORTING_DETAILS = 'GET_PROFILE_REPORTING_DETAILS';
export const GET_PROFILE_REPORTING_DETAILS_SUCCESS = 'GET_PROFILE_REPORTING_DETAILS_SUCCESS';
export const GET_PROFILE_REPORTING_DETAILS_FAILURE = 'GET_PROFILE_REPORTING_DETAILS_FAILURE';
export const UPDATE_PROFILE_SLUG = 'UPDATE_PROFILE_SLUG';

// Collection actions
export const CREATE_COLLECTION = 'CREATE_COLLECTION';
export const CREATE_COLLECTION_SUCCESS = 'CREATE_COLLECTION_SUCCESS';
export const CREATE_COLLECTION_FAILURE = 'CREATE_COLLECTION_FAILURE';
export const SHOW_CREATE_COLLECTION_MODAL = 'SHOW_CREATE_COLLECTION_MODAL';
export const HIDE_CREATE_COLLECTION_MODAL = 'HIDE_CREATE_COLLECTION_MODAL';

// Update Profile Actions
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
export const MODAL_UPDATE_PROFILE_SHOW = 'MODAL_UPDATE_PROFILE_SHOW';
export const MODAL_UPDATE_PROFILE_HIDE = 'MODAL_UPDATE_PROFILE_HIDE';

// Location Actions
export const LOAD_LOCATION = 'LOAD_LOCATION';
export const LOAD_LOCATION_SUCCESS = 'LOAD_LOCATION_SUCCESS';
export const LOAD_LOCATION_FAILURE = 'LOAD_LOCATION_FAILURE';
export const LOAD_LOCATION_MEMBERS = 'LOAD_LOCATION_MEMBERS';
export const LOAD_LOCATION_MEMBERS_SUCCESS = 'LOAD_LOCATION_MEMBERS_SUCCESS';
export const LOAD_LOCATION_MEMBERS_FAILURE = 'LOAD_LOCATION_MEMBERS_FAILURE';

// Update Location Actions
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const UPDATE_LOCATION_SUCCESS = 'UPDATE_LOCATION_SUCCESS';
export const UPDATE_LOCATION_FAILURE = 'UPDATE_LOCATION_FAILURE';

// Header Actions
export const TOGGLE_DISPLAY_HEADER = 'TOGGLE_DISPLAY_HEADER';

// Search Actions
export const SEARCH = 'SEARCH';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';
export const VIEW_SEARCH_RESULT = 'VIEW_SEARCH_RESULT';
export const NO_SEARCH_RESULTS = 'NO_SEARCH_RESULTS';
export const NO_SEARCH_RESULTS_SUCCESS = 'NO_SEARCH_RESULTS_SUCCESS';
export const NO_SEARCH_RESULTS_FAILURE = 'NO_SEARCH_RESULTS_FAILURE';
export const AUTOCOMPLETE = 'AUTOCOMPLETE';
export const AUTOCOMPLETE_SUCCESS = 'AUTOCOMPLETE_SUCCESS';
export const AUTOCOMPLETE_FAILURE = 'AUTOCOMPLETE_FAILURE';
export const CLEAR_AUTOCOMPLETE_RESULTS = 'CLEAR_AUTOCOMPLETE_RESULTS';

// Explore actions
export const EXPLORE = 'EXPLORE';
export const EXPLORE_SUCCESS = 'EXPLORE_SUCCESS';
export const EXPLORE_FAILURE = 'EXPLORE_FAILURE';

// Team actions
export const LOAD_EXTENDED_TEAM = 'LOAD_EXTENDED_TEAM';
export const LOAD_EXTENDED_TEAM_SUCCESS = 'LOAD_EXTENDED_TEAM_SUCCESS';
export const LOAD_EXTENDED_TEAM_FAILURE = 'LOAD_EXTENDED_TEAM_FAILURE';
export const LOAD_TEAM_MEMBERS = 'LOAD_TEAM_MEMBERS';
export const LOAD_TEAM_MEMBERS_SUCCESS = 'LOAD_TEAM_MEMBERS_SUCCESS';
export const LOAD_TEAM_MEMBERS_FAILURE = 'LOAD_TEAM_MEMBERS_FAILURE';
export const CLEAR_TEAM_MEMBERS_CACHE = 'CLEAR_TEAM_MEMBERS_CACHE';
export const CREATE_TEAM = 'CREATE_TEAM';
export const CREATE_TEAM_SUCCESS = 'CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = 'CREATE_TEAM_FAILURE';
export const GET_TEAM = 'GET_TEAM';
export const GET_TEAM_SUCCESS = 'GET_TEAM_SUCCESS';
export const GET_TEAM_FAILURE = 'GET_TEAM_FAILURE';
export const GET_TEAM_MEMBERS = 'GET_TEAM_MEMBERS';
export const GET_TEAM_MEMBERS_SUCCESS = 'GET_TEAM_MEMBERS_SUCCESS';
export const GET_TEAM_MEMBERS_FAILURE = 'GET_TEAM_MEMBERS_FAILURE';
export const GET_TEAM_MEMBERS_BAIL = 'GET_TEAM_MEMBERS_BAIL';
export const GET_TEAM_COORDINATORS = 'GET_TEAM_COORDINATORS';
export const GET_TEAM_COORDINATORS_SUCCESS = 'GET_TEAM_COORDINATORS_SUCCESS';
export const GET_TEAM_COORDINATORS_FAILURE = 'GET_TEAM_COORDINATORS_FAILURE';
export const GET_TEAM_MEMBERS_FOR_PROFILE = 'GET_TEAM_MEMBERS_FOR_PROFILE';
export const GET_TEAM_MEMBERS_FOR_PROFILE_SUCCESS = 'GET_TEAM_MEMBERS_FOR_PROFILE_SUCCESS';
export const GET_TEAM_MEMBERS_FOR_PROFILE_FAILURE = 'GET_TEAM_MEMBERS_FOR_PROFILE_FAILURE';
export const MODAL_CREATE_TEAM_SHOW = 'MODAL_CREATE_TEAM_SHOW';
export const MODAL_CREATE_TEAM_HIDE = 'MODAL_CREATE_TEAM_HIDE';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const UPDATE_TEAM_SUCCESS = 'UPDATE_TEAM_SUCCESS';
export const UPDATE_TEAM_FAILURE = 'UPDATE_TEAM_FAILURE';
export const REMOVE_MEMBERS = 'REMOVE_MEMBERS';
export const REMOVE_MEMBERS_SUCCESS = 'REMOVE_MEMBERS_SUCCESS';
export const REMOVE_MEMBERS_FAILURE = 'REMOVE_MEMBERS_FAILURE';
export const UPDATE_MEMBERS = 'UPDATE_MEMBERS';
export const UPDATE_MEMBERS_SUCCESS = 'UPDATE_MEMBERS_SUCCESS';
export const UPDATE_MEMBERS_FAILURE = 'UPDATE_MEMBERS_FAILURE';
export const MODAL_TEAM_EDIT_SHOW = 'MODAL_TEAM_EDIT_SHOW';
export const MODAL_TEAM_EDIT_HIDE = 'MODAL_TEAM_EDIT_HIDE';
export const UPDATE_TEAM_SLUG = 'UPDATE_TEAM_SLUG';
export const MODAL_ADD_MEMBERS_SHOW = 'MODAL_ADD_MEMBERS_SHOW';
export const MODAL_ADD_MEMBERS_HIDE = 'MODAL_ADD_MEMBERS_HIDE';
export const ADD_MEMBERS = 'ADD_MEMBERS';
export const ADD_MEMBERS_SUCCESS = 'ADD_MEMBERS_SUCCESS';
export const ADD_MEMBERS_FAILURE = 'ADD_MEMBERS_FAILURE';

// Device Actions
export const DEVICE_RESIZED = 'DEVICE_RESIZED';
export const CLIENT_MOUNTED = 'CLIENT_MOUNTED';

// Billing Actions
export const STORE_TOKEN = 'STORE_TOKEN';
export const STORE_TOKEN_SUCCESS = 'STORE_TOKEN_SUCCESS';
export const STORE_TOKEN_FAILURE = 'STORE_TOKEN_FAILURE';

// Media Upload Actions
export const MEDIA_UPLOAD = 'MEDIA_UPLOAD';
export const MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS';
export const MEDIA_UPLOAD_FAILURE = 'MEDIA_UPLOAD_FAILURE';

// Share Post Actions
export const SHOW_POST_LINK_COPIED_SNACKBAR = 'SHOW_POST_LINK_COPIED_SNACKBAR';
export const HIDE_POST_LINK_COPIED_SNACKBAR = 'HIDE_POST_LINK_COPIED_SNACKBAR';

// Create Post Actions
export const CREATE_POST = 'CREATE_POST';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_FAILURE = 'CREATE_POST_FAILURE';

// Update Post Actions
export const UPDATE_POST = 'UPDATE_POST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

// Delete Post Actions
export const DELETE_POST = 'DELETE_POST';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';
export const SHOW_CONFIRM_DELETE_MODAL = 'SHOW_CONFIRM_DELETE_MODAL';
export const HIDE_CONFIRM_DELETE_MODAL = 'HIDE_CONFIRM_DELETE_MODAL';

// Get Post Actions
export const GET_POST = 'GET_POST';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';

// Get Posts Actions
export const GET_POSTS = 'GET_POSTS';
export const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
export const GET_POSTS_FAILURE = 'GET_POSTS_FAILURE';
export const GET_POSTS_BAIL = 'GET_POSTS_BAIL';

// Clear Posts Action
export const CLEAR_POSTS_CACHE = 'CLEAR_POSTS_CACHE';

// File Upload Actions
export const FILE_UPLOAD = 'FILE_UPLOAD';
export const FILE_UPLOAD_SUCCESS = 'FILE_UPLOAD_SUCCESS';
export const FILE_UPLOAD_FAILURE = 'FILE_UPLOAD_FAILURE';
export const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';

// File Delete Actions
export const FILE_DELETE = 'FILE_DELETE';
export const FILE_DELETE_SUCCESS = 'FILE_DELETE_SUCCESS';
export const FILE_DELETE_FAILURE = 'FILE_DELETE_FAILURE';

// Clear file uploads
export const CLEAR_FILE_UPLOADS = 'CLEAR_FILE_UPLOADS';

// Editor actions
export const EDITOR_TITLE_CHANGED = 'EDITOR_TITLE_CHANGED';
export const EDITOR_CONTENT_CHANGED = 'EDITOR_BODY_CHANGED';
export const EDITOR_RESET = 'EDITOR_RESET'
