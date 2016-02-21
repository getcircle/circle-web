import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';

import DetailTabs from '../DetailTabs';
import Tab from '../Tab';

const { LISTED, DRAFT } = services.post.containers.PostStateV1;

const Tabs = ({ onRequestChange, state, ...other }, { store: { dispatch } }) => {
    function handleRequestChange(e, nextState) {
        //dispatch(updateKnowledgeState(state, nextState));
        onRequestChange(nextState);
    }

    return (
        <DetailTabs
            onRequestChange={handleRequestChange}
            slug={state}
            {...other}
        >
            <Tab label={t('Published')} value={LISTED} />
            <Tab label={t('Drafts')} value={DRAFT} />
        </DetailTabs>
    );
};

Tabs.propTypes = {
    onRequestChange: PropTypes.func.isRequired,
    state: PropTypes.oneOf([LISTED, DRAFT]).isRequired,
};

Tabs.contextTypes = {
    store: PropTypes.object.isRequired,
};

export default Tabs;
