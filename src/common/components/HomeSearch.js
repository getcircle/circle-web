import React, { PropTypes } from 'react';

import { FlatButton } from 'material-ui';

import Colors from '../styles/Colors';
import t from '../utils/gettext';

import AutoComplete from './AutoComplete';
import SearchIcon from './SearchIcon';

const HomeSearch = (props, { muiTheme }) => {
    const styles = {
        autoComplete: {
            flexGrow: 1,
            maxWidth: 550,
        },
        button: {
            borderRadius: '0px 4px 4px 0px',
            backgroundColor: '#7A8EFF',
            width: 50,
            height: 50,
            minWidth: 0,
        },
        icon: {
            marginLeft: 0,
        },
        inputContainer: {
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRight: '0px',
            borderRadius: '4px 0px 0px 4px',
        },
        inputStyle: {
            paddingLeft: 17,
        },
    };
    return (
        <div {...props}>
            <AutoComplete
                className="col-xs"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                placeholder={t('Search your coworker\'s knowledge')}
                searchContainerWidth={550}
                style={styles.autoComplete}
            />
            <FlatButton
                backgroundColor={muiTheme.luno.tintColor}
                style={styles.button}
            >
                <div className="row center-xs middle-xs">
                    <SearchIcon
                        height={30}
                        stroke={Colors.white}
                        strokeWidth={2.5}
                        style={styles.icon}
                        width={30}
                    />
                </div>
            </FlatButton>
        </div>
    );
};

HomeSearch.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default HomeSearch;
