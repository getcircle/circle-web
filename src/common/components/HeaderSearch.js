import React, { Component } from 'react';

import AutoComplete from './AutoComplete';

class HeaderSearch extends Component {

    state = {
        focused: false,
    }

    handleFocus = () => {
        this.setState({focused: true});
    }

    handleBlur = () => {
        this.setState({focused: false});
    }

    render() {
        const style = {
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
            position: 'relative',
            maxWidth: 550,
        };
        return (
            <AutoComplete
                focused={this.state.focused}
                hasItemDivider={false}
                inputContainerStyle={{border: '1px solid rgba(0, 0, 0, 0.2)'}}
                listContainerStyle={{position: 'absolute'}}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                style={style}
                {...this.props}
            />
        );
    }
}

export default HeaderSearch;
