import React, { PropTypes } from 'react';
import InfiniteScroll from 'redux-infinite-scroll';

import { List } from 'material-ui';

import t from '../utils/gettext';

const Loader = ({ theme }) => {
    const styles = {
        row: {
            paddingTop: 20,
        },
        span: {
            color: theme.tintColor,
        },
    };
    return (
        <div className="col-xs-12">
            <div className="row center-xs" style={styles.row}>
                <span style={styles.span}>{t('loading...')}</span>
            </div>
        </div>
    );
};

Loader.propTypes = {
    theme: PropTypes.object.isRequired,
};

const InfiniteGrid = ({ children, hasMore, loading, onLoadMore, ...other }, { muiTheme }) => {
    return (
        <List {...other}>
            <InfiniteScroll
                className="row"
                elementIsScrollable={false}
                hasMore={hasMore}
                loadMore={onLoadMore}
                loader={<Loader theme={muiTheme.luno}/>}
                loadingMore={loading}
                threshold={100}
            >
                {children}
            </InfiniteScroll>
        </List>
    );
};

InfiniteGrid.propTypes = {
    children: PropTypes.node,
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func.isRequired,
};

InfiniteGrid.defaultProps = {
    loading: false,
};

InfiniteGrid.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default InfiniteGrid;
