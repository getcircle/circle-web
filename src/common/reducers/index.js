import { reducer as formReducer } from 'redux-form';

export { default as authentication } from './authentication';
export { default as autocomplete } from './autocomplete';
export { default as cache } from './cache';
export { default as collectionItems } from './collectionItems';
export { default as collections } from './collections';
export { default as deleteCollection } from './deleteCollection';
export { default as deletePost } from './deletePost';
export { default as editableCollections } from './editableCollections';
export { default as editor } from './editor';
export { default as explore } from './explore';
// TODO delete
export { default as extendedProfiles } from './extendedProfiles';
// TODO delete
export { default as extendedTeams } from './extendedTeams';
export { default as files } from './files';
export { default as filterCollections } from './filterCollections';
export { default as formDialogs } from './formDialogs';
// TODO delete
export { default as locationMembers } from './locationMembers';
// TODO delete
export { default as locations } from './locations';
// TODO delete
export { default as mediaUpload } from './media';
export { default as post } from './post';
export { default as posts } from './posts';
export { default as postCollections } from './postCollections';
export { default as profileMemberships } from './profileMemberships';
// TODO delete
export { default as profiles } from './profiles';
export { default as responsive } from './responsive';
export { default as search } from './search';
export { default as teamCoordinators } from './teamCoordinators';
export { default as teamMembers } from './teamMembers';
export { default as teamMembership } from './teamMembership';

// external reducers
export function form(state, action) {
    return formReducer(state, action)
};
export { routeReducer as routing } from 'react-router-redux';
