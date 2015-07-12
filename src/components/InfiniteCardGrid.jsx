'use strict';

import domReady from 'domready';
import React from 'react';

import bindThis from '../utils/bindThis';

// Selected arbitrarily via experimentation
const infiniteScrollBoundaryHeight = 300;

class InfiniteCardGrid extends React.Component {

    static propTypes = {
        objects: React.PropTypes.array.isRequired,
        nextRequest: React.PropTypes.object,
        loading: React.PropTypes.bool.isRequired,
    }

    componentWillMount() {
        // If we refresh we don't want a bunch of AJAX requests to fire due to scroll position
        domReady(() => {
            window.scrollTo(0, 0);
        });
    }

    componentDidMount() {
        window.addEventListener('scroll', this._loadMore);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._loadMore);
    }

    @bindThis
    _loadMore(event) {
        if (!this.props.getMore) {
            return;
        }

        const bottomYScrollPosition = window.innerHeight + document.body.scrollTop;
        const bodyHeight = document.body.offsetHeight;

        if (this.props.loading) {
            return;
        }

        if (bottomYScrollPosition + infiniteScrollBoundaryHeight < bodyHeight) {
            return;
        }

        this.props.getMore();
    }

    _renderCards(objects) {
        return objects.map((obj, index) => {
            let args = {};
            args[this.props.componentAttributeName] = obj;

            return (
                <div key={obj.id} className="col-xs-12 col-sm-6 col-md-4">
                    <this.props.ComponentClass {...args} />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="row stack__item">
                {this._renderCards(this.props.objects)}
            </div>
        );
    }

}

export default InfiniteCardGrid;
