'use strict';

import _ from 'lodash';
import domReady from 'domready';
import React from 'react';

import bindThis from '../utils/bindThis';
import ThemeManager from '../utils/ThemeManager';

// Selected arbitrarily via experimentation
const infiniteScrollBoundaryHeight = 300;

class CardGrid extends React.Component {

    static propTypes = {
        objects: React.PropTypes.array.isRequired,
        nextRequest: React.PropTypes.object,
        loading: React.PropTypes.bool.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        // If we refresh we don't want a bunch of AJAX requests to fire due to scroll position
        domReady(() => {
            window.scrollTo(0, 0);
        });

        this.setState({
            elements: []
        });

        this._loadMore();
    }

    componentDidMount() {
        window.addEventListener('scroll', this._loadMore);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._loadMore);
    }

    @bindThis
    _loadMore(event) {
        const bottomYScrollPosition = window.innerHeight + document.body.scrollTop;
        const bodyHeight = document.body.offsetHeight;

        if (this.props.loading) {
            return
        }

        if (bottomYScrollPosition + infiniteScrollBoundaryHeight < bodyHeight) {
            return;
        }

        this.props.getMore().then(() => {
            this.setState({
                elements: this.state.elements.concat(
                    this._renderCards(
                        _.slice(this.props.objects, this.state.elements.length)
                    )
                ),
            });
        });
    }

    _renderCards(objects) {
        return objects.map((obj, index) => {
            let args = {}
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
            <div className="row">
                {this.state.elements}
            </div>
        );
    }

}

export default CardGrid;
