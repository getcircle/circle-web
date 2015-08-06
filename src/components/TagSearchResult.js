'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

const { ListItem } = mui;

@decorate(Navigation)
class TagSearchResult extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        tag: React.PropTypes.object.isRequired,
    }

    _handleTouchTap(tag) {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/people`, {tagId: tag.id});
    }

    render() {
        const tag = this.props.tag;
        return (
            <ListItem onTouchTap={this._handleTouchTap.bind(this, tag)}>
                {tag.name}
            </ListItem>
        );
    }
}

export default TagSearchResult;
