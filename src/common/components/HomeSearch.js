import React, { PropTypes } from 'react';

import { FlatButton } from 'material-ui';

import Colors from '../styles/Colors';
import t from '../utils/gettext';
import * as routes from '../utils/routes';

import InternalPropTypes from './InternalPropTypes';
import AutoComplete from './AutoComplete';
import SearchIcon from './SearchIcon';

const SEARCH_BUTTON_CLASSNAME = 'search-button';

// TODO if we require the component to be mounted before displaying placeholder
// text, we can use moment.js to get local time for the user
function getPlaceHolderText(profile) {
    let text;
    if (profile.full_name) {
        text = t(`Hello ${profile.first_name}, what can we help you find today?`);
    } else {
        text = t('Search People, Knowledge & Teams');
    }
    return text;
};

const HomeSearch = (props, { auth, muiTheme }) => {
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

    function handleBlur(event, query) {
        if (
            event &&
            query &&
            event.relatedTarget &&
            event.relatedTarget.className === SEARCH_BUTTON_CLASSNAME
        ) {
            routes.routeToSearch(query);
        }
    }
    return (
        <div {...props}>
            <AutoComplete
                className="col-xs"
                hasItemDivider={false}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                onBlur={handleBlur}
                placeholder={getPlaceHolderText(auth.profile)}
                style={styles.autoComplete}
            />
            <FlatButton
                backgroundColor={muiTheme.luno.tintColor}
                className="search-button"
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
    auth: InternalPropTypes.AuthContext,
    muiTheme: PropTypes.object.isRequired,
};

export default HomeSearch;
