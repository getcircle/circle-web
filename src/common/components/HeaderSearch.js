import React from 'react';

import AutoComplete from './AutoComplete';

const HeaderSearch = (props) => {
    const style = {
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'relative',
        maxWidth: 550,
    };
    return (
        <AutoComplete
            focused={false}
            hasItemDivider={false}
            inputContainerStyle={{border: '1px solid rgba(0, 0, 0, 0.2)'}}
            listContainerStyle={{position: 'absolute'}}
            style={style}
            {...props}
        />
    );
}

export default HeaderSearch;
