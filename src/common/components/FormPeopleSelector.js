import merge from 'lodash.merge';
import React, { Component, PropTypes } from 'react';

import t from '../utils/gettext';

import CrossIcon from './CrossIcon';
import AutoCompleteProfile from './AutoCompleteProfile';

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
            fontSize: '13px',
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
                stroke={'#808080'}
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
        muiTheme.paper.backgroundColor = '#FCFCFC';
        this.setState({muiTheme});
    }

    render() {
        const { onBlur, onChange, value, ...other } = this.props;
        const { muiTheme } = this.context;
        const styles = {
            autoComplete: {
                height: 40,
                marginTop: 10,
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

        return (
            <div style={styles.container}>
                {tokens}
                <AutoCompleteProfile
                    hasItemDivider={false}
                    inputContainerStyle={{height: 'none'}}
                    inputStyle={{paddingLeft: 0}}
                    listContainerStyle={styles.listContainerStyle}
                    onSelectProfile={handleSelectProfile}
                    placeholder={t('Search by Name')}
                    style={styles.autoComplete}
                    {...other}
                />
            </div>
        );
    }
};

FormPeopleSelector.propTypes = {
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
