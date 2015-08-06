import React from 'react';

class GroupSearchResult extends React.Component {

    static propTypes = {
        group: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
        details: {
            display: 'block',
        },
    }

    render() {
        const group = this.props.group;
        return (
            <div className="row">
                <div className="col-xs" style={this.styles.detailsContainer}>
                    <span style={this.styles.details}>{group.name}</span>
                    <span style={this.styles.details}>{group.email}</span>
                </div>
            </div>
        );
    }
}

export default GroupSearchResult;
