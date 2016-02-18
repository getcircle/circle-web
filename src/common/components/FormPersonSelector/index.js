import merge from 'lodash.merge';
import React, { Component, PropTypes } from 'react';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import AutoCompleteProfile from '../AutoCompleteProfile';
import SelectedProfile from './SelectedProfile';

const createResult = ({ profile, highlight }) => {
    const styles = {
        name: {
            fontSize: '1.4rem',
        },
        title: {
            color: Colors.mediumBlack,
            fontSize: '1.1rem',
        },
    };

    let fullName, title;
    if (highlight && highlight.get('full_name')) {
        fullName = <span style={styles.name} dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />;
    } else {
        fullName = <span style={styles.name}>{profile.full_name}</span>;
    }

    if (highlight && highlight.get('title')) {
        title = <span dangerouslySetInnerHTML={{__html: highlight.get('title')}} />;
    } else {
        title = <span>{profile.title}</span>;
    }

    const primaryText = (
        <div>
            {fullName}<span style={styles.title}>{' ('}{title}{')'}</span>
        </div>
    );
    const item = {
        primaryText: primaryText,
        innerDivStyle: {
            paddingTop: 10,
            paddingLeft: 20,
        },
        style: {
            fontSize: '1.4rem',
        },
    };
    return {
        item,
        type: 'profile',
        payload: profile,
    };

};

class FormPersonSelector extends Component {

    state = {
        expanded: false,
        selectedHovered: false,
        muiTheme: this.context.muiTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        }
    }

    componentWillMount() {
        const muiTheme = merge({}, this.state.muiTheme);
        muiTheme.paper.backgroundColor = Colors.offWhite,
        this.setState({muiTheme});
    }

    handleSelectedTouchTap = () => {
        const { onBlur, onFocus } = this.props;
        const { expanded } = this.state;
        expanded ? onBlur() : onFocus();
        this.setState({expanded: !expanded});
    }

    handleSelectedHoverChange = (hover) => {
        this.setState({selectedHovered: hover});
    }

    handleSelectProfile = (profile) => {
        this.props.onChange(profile);
        this.setState({expanded: false})
    }

    handleBlurAutoComplete = () => {
        // Prevent collapsing when the selected profile is hovered, since
        // onTouchTap will fire immediately afterward and do the collapse
        if (!this.state.selectedHovered) {
            this.setState({expanded: false});
            this.props.onBlur();
        }
    }

    render() {
        const {
            listContainerStyle,
            onBlur,
            onChange,
            onFocus,
            value,
            ...other
        } = this.props;
        const { expanded } = this.state;
        const styles = {
            autoComplete: {
                borderTop: `1px solid ${Colors.minBlack}`,
                height: 'initial',
                padding: '10px',
                zIndex: 10000,
            },
            container: {
                border: `1px solid ${Colors.minBlack}`,
                borderRadius: '2px',
                flexWrap: 'wrap',
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                position: 'relative',
            },
            listContainerStyle: {
                boxShadow: '0px 12px 24px black',
                position: 'absolute',
                zIndex: 10,
            },
        };

        const listStyle = merge({}, listContainerStyle, styles.listContainerStyle);

        let autoComplete;
        if (expanded) {
            autoComplete = (
                <AutoCompleteProfile
                    focused={true}
                    hasItemDivider={false}
                    ignoreProfileIds={[value && value.id]}
                    inputContainerStyle={{height: 'none'}}
                    inputStyle={{paddingLeft: 0}}
                    listContainerStyle={listStyle}
                    onBlur={this.handleBlurAutoComplete}
                    onSelectProfile={this.handleSelectProfile}
                    placeholder={t('Search by Name')}
                    resultFactoryFunction={createResult}
                    style={styles.autoComplete}
                    {...other}
                />
            );
        }

        return (
            <div style={styles.container}>
                <SelectedProfile
                    expanded={expanded}
                    onHoverChange={this.handleSelectedHoverChange}
                    onTouchTap={this.handleSelectedTouchTap}
                    profile={value}
                />
                {autoComplete}
            </div>
        );
    }
};

FormPersonSelector.propTypes = {
    listContainerStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    value: PropTypes.object,
};

FormPersonSelector.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

FormPersonSelector.childContextTypes = {
    muiTheme: PropTypes.object,
};

export default FormPersonSelector;
