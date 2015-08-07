import domReady from 'domready';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

// Selected arbitrarily via experimentation
const infiniteScrollBoundaryHeight = 800;

class InfiniteCardGrid extends React.Component {

    static propTypes = {
        objects: ImmutablePropTypes.list.isRequired,
        getMore: React.PropTypes.func,
        loading: React.PropTypes.bool.isRequired,
        ComponentClass: React.PropTypes.func.isRequired,
        componentAttributeName: React.PropTypes.string.isRequired,
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

    // NB: `bind` generates a new function reference. If we added the event
    // listeners above with `window.addEventListener('scroll',
    // this._loadMore.bind(this))` we wouldn't be able to remove it.
    _loadMore = this._loadMore.bind(this)
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
