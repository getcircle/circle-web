import React from 'react';

import Card from './Card';
import FlatProfileCardContent from './FlatProfileCardContent';

class Category extends React.Component {

    static proptypes = {
        category: React.PropTypes.object.isRequired
    }

    render() {
        const {category} = this.props;
        return (
            <Card title={category.title} count={category.total_count}>
                <FlatProfileCardContent profiles={category.profiles} />
            </Card>
        );
    }

}

export default Category;
