import { merge } from 'lodash';
import React, { Component, PropTypes } from 'react';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import AutoCompleteProfile, { createProfileWithTitle } from '../AutoCompleteProfile';
import SelectedProfile from './SelectedProfile';

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

    handleSelectItem = (profile) => {
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
            ignoreProfileIds,
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
                height: 'initial',
                padding: 0,
                zIndex: 10000,
            },
            autoCompleteInput: {
                borderLeft: `1px solid ${Colors.minBlack}`,
                borderRadius: 2,
                borderRight: `1px solid ${Colors.minBlack}`,
                padding: '10px',
            },
            container: {
                flexWrap: 'wrap',
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                position: 'relative',
            },
            listContainerStyle: {
                borderLeft: `1px solid ${Colors.minBlack}`,
                borderRight: `1px solid ${Colors.minBlack}`,
                borderBottom: `1px solid ${Colors.minBlack}`,
                boxShadow: '0px 12px 24px black',
                marginTop: 0,
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
                    ignoreProfileIds={ignoreProfileIds}
                    inputContainerStyle={{height: 'none'}}
                    inputStyle={styles.autoCompleteInput}
                    listContainerStyle={listStyle}
                    onBlur={this.handleBlurAutoComplete}
                    onSelectItem={this.handleSelectItem}
                    placeholder={t('Search by Name')}
                    resultFactoryFunction={createProfileWithTitle}
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
    ignoreProfileIds: PropTypes.arrayOf(PropTypes.string),
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
