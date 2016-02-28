import React, { Component } from 'react';

const Hoverable = Wrapped => class extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hover: false,
        };
    }

    handleMouseEnter = () => {
        this.setState({hover: true});
    };

    handleMouseLeave = () => {
        this.setState({hover: false});
    };

    render() {
        const { hover } = this.state;
        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <Wrapped
                    hover={hover}
                    {...this.props}
                />
            </div>
        );
    }
};

export default Hoverable;
