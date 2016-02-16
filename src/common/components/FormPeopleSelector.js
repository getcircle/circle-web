import merge from 'lodash.merge';
import React, { Component, PropTypes } from 'react';

import Colors from '../styles/Colors';
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
        const { active, onChange, value, ...other } = this.props;
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

        return (
            <div style={styles.container}>
                {tokens}
                <AutoCompleteProfile
                    focused={active}
                    hasItemDivider={false}
                    ignoreProfileIds={profiles.map(profile => profile.id)}
                    inputContainerStyle={{height: 'none'}}
                    inputStyle={{paddingLeft: 0}}
                    listContainerStyle={styles.listContainerStyle}
                    onSelectProfile={handleSelectProfile}
                    placeholder={t('Search by Name')}
                    resultFactoryFunction={createResult}
                    style={styles.autoComplete}
                    {...other}
                />
            </div>
        );
    }
};

FormPeopleSelector.propTypes = {
    active: PropTypes.bool,
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
