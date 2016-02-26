import { pullAt, merge } from 'lodash';
import React, { Component, PropTypes } from 'react';

import Colors from '../styles/Colors';

import CrossIcon from './CrossIcon';

const Token = ({ getItemName, index, item, onRemove }, { muiTheme }) => {
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

    const name = getItemName(item);
    return (
        <div className="row" onTouchTap={handleTouchTap} style={styles.container}>
            <div style={styles.text}>
                <span>{name}</span>
            </div>
            <CrossIcon
                height={16}
                stroke={muiTheme.luno.colors.mediumBlack}
                width={16}
            />
        </div>
    );
};

Token.propTypes = {
    getItemName: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        /*eslint-disable camelcase*/
        full_name: PropTypes.string.isRequired,
        /*eslint-enable camelcase*/
    }),
};

Token.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

class FormTokenizedSelector extends Component {

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
        const {
            autoCompleteElement,
            getItemName,
            listContainerStyle,
            onChange,
            value,
            ...other,
        } = this.props;
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

        const items = value ? value.slice() : [];
        const handleSelectItem = (item) => {
            items.push(item);
            onChange(items);
        };

        const handleRemove = (index) => {
            pullAt(items, index);
            onChange(items);
        };

        const tokens = items.map((item, index) => {
            return (
                <Token
                    getItemName={getItemName}
                    index={index}
                    item={item}
                    key={index}
                    onRemove={handleRemove}
                />
            );
        });

        const listStyle = merge({}, listContainerStyle, styles.listContainerStyle);
        const autoComplete = React.cloneElement(
            autoCompleteElement,
            {
                inputContainerStyle: {height: 'none'},
                inputStyle: {paddingLeft: 0},
                listContainerStyle: listStyle,
                onSelectItem: handleSelectItem,
                style: styles.autoComplete,
                ...other,
            },
        );

        return (
            <div style={styles.container}>
                {tokens}
                {autoComplete}
            </div>
        );
    }
};

FormTokenizedSelector.propTypes = {
    autoCompleteElement: PropTypes.node.isRequired,
    getItemName: PropTypes.func.isRequired,
    listContainerStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    value: PropTypes.array,
};

FormTokenizedSelector.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

FormTokenizedSelector.childContextTypes = {
    muiTheme: PropTypes.object,
};

export default FormTokenizedSelector;
