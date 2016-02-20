import { merge } from 'lodash';
import React, { Component, PropTypes } from 'react';

import Colors from '../styles/Colors';
import t from '../utils/gettext';

import CrossIcon from './CrossIcon';
import AutoCompleteProfile, { createProfileWithTitle } from './AutoCompleteProfile';

const Token = ({ index, profile, onRemove }) => {
    const styles = {
        container: {
            alignItems: 'center',
            backgroundColor: '#E6E6E6',
            cursor: 'pointer',
            height: 22,
            marginTop: 10,
            marginRight: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 5,
            paddingTop: 10,
        },
        text: {
            fontSize: '1.3rem',
            paddingRight: 5,
        },
    };

    const handleTouchTap = () => {
        onRemove(index);
    }

    return (
        <div className="row" onTouchTap={handleTouchTap} style={styles.container}>
            <div style={styles.text}>
                <span>{profile.full_name}</span>
            </div>
            <CrossIcon
                height={16}
                stroke={Colors.mediumBlack}
                width={16}
            />
        </div>
    );
};

Token.propTypes = {
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        /*eslint-disable camelcase*/
        full_name: PropTypes.string.isRequired,
        /*eslint-enable camelcase*/
    }),
};

class FormPeopleSelector extends Component {

    state = {
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

    render() {
        const { active, listContainerStyle, onChange, value, ...other } = this.props;
        const { muiTheme } = this.context;
        const styles = {
            autoComplete: {
                height: 'initial',
                marginTop: 10,
                marginBottom: 10,
            },
            container: {
                flexWrap: 'wrap',
                ...muiTheme.luno.form.field,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 0,
                paddingBottom: 0,
                position: 'relative',
            },
            listContainerStyle: {
                boxShadow: '0px 12px 24px black',
                position: 'absolute',
            },
        };

        const profiles = value || [];
        const handleSelectProfile = (profile) => {
            profiles.push(profile);
            onChange(profiles);
        };

        const handleRemove = (index) => {
            _.pullAt(profiles, index);
            onChange(profiles);
        };

        const tokens = profiles.map((profile, index) => {
            return (
                <Token
                    index={index}
                    key={index}
                    onRemove={handleRemove}
                    profile={profile}
                />
            );
        });

        const listStyle = merge({}, listContainerStyle, styles.listContainerStyle);

        return (
            <div style={styles.container}>
                {tokens}
                <AutoCompleteProfile
                    focused={active}
                    hasItemDivider={false}
                    ignoreProfileIds={profiles.map(profile => profile.id)}
                    inputContainerStyle={{height: 'none'}}
                    inputStyle={{paddingLeft: 0}}
                    listContainerStyle={listStyle}
                    onSelectProfile={handleSelectProfile}
                    placeholder={t('Search by Name')}
                    resultFactoryFunction={createProfileWithTitle}
                    style={styles.autoComplete}
                    {...other}
                />
            </div>
        );
    }
};

FormPeopleSelector.propTypes = {
    active: PropTypes.bool,
    listContainerStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    value: PropTypes.array,
};

FormPeopleSelector.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

FormPeopleSelector.childContextTypes = {
    muiTheme: PropTypes.object,
};

export default FormPeopleSelector;
