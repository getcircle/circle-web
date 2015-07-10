'use strict';

import mui from 'material-ui';
import React from 'react';

import t from '../utils/gettext';

import TagSearchResult from './TagSearchResult';

const { List } = mui;

class TagSearchResults extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        title: React.PropTypes.string,
        tags: React.PropTypes.array.isRequired,
    }

    _renderTagResults() {
        return this.props.tags.map((tag, index) => {
            return <TagSearchResult key={index} tag={tag} flux={this.props.flux} />;
        });
    }

    render() {
        const title = this.props.title ? this.props.title : t('Tags');
        return (
            <List subheader={title}>
                {this._renderTagResults()}
            </List>
        );
    }
}

export default TagSearchResults;
