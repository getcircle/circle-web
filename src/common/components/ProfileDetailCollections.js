import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CollectionIcon from './CollectionIcon';
import DetailSection from './DetailSectionV2';
import DetailTitle from './DetailTitle';
import InfiniteCollectionsGrid from './InfiniteCollectionsGrid';

const ProfileDetailCollections = ({ collections, hasMore, loaded, loading, onLoadMore }, { muiTheme }) => {
    let grid;
    if (collections) {
        grid = (
            <InfiniteCollectionsGrid
                collections={collections}
                hasMore={hasMore}
                loaded={loaded}
                loading={loading}
                onLoadMore={onLoadMore}
            />
        );
    }
    return (
        <div>
            <DetailTitle
                IconComponent={CollectionIcon}
                title={t('Collections')}
            />
            <DetailSection
                dividerStyle={muiTheme.luno.collections.divider}
                style={{paddingTop: 0}}
            >
                {grid}
            </DetailSection>
        </div>
    );
};

ProfileDetailCollections.propTypes = {
    collections: PropTypes.array,
    hasMore: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func,
};

ProfileDetailCollections.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ProfileDetailCollections;
