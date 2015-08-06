import React from 'react';

import Category from './Category';

class Feed extends React.Component {

    static propTypes = {
        categories: React.PropTypes.array.isRequired,
    }

    _renderCategories() {
        return this.props.categories.map((category, index) => {
            return (
                <div key={index} className="row">
                    <div className="col-xs-offset-2 col-xs-8">
                        <Category category={category} />
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <section>
                {this._renderCategories()}
            </section>
        );
    }

}

export default Feed;
