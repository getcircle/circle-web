import { merge } from 'lodash';
import { MenuItem, DropDownMenu } from 'material-ui';
import React, { Component, PropTypes } from 'react';

import FormFieldError from './FormFieldError';

// Workaround for the DropDownMenu component in material-ui not handling a
// value of 0 (and perhaps other falsey values) properly
const encodeValue = value => `val-${ JSON.stringify(value) }`;
const decodeValue = value => JSON.parse(value.substr(4));

class FormSelectField extends Component {

    state = {
        muiTheme: this.context.muiTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        const muiTheme = merge({}, this.state.muiTheme);
        muiTheme.zIndex.layer = 3100;
        this.setState({muiTheme});
    }

    render() {
        const {
            choices,
            error,
            invalid,
            onChange,
            name,
            touched,
            value,
            width,
            ...other,
        } = this.props;

        const { muiTheme } = this.context;

        const handleChange = (event, index, value) => {
            onChange(decodeValue(value));
        };

        const styles = {
            item: {
                margin: 0,
                paddingLeft: 12,
            },
            label: {
                lineHeight: 0,
                paddingLeft: 12,
                paddingTop: 20,
            },
            main: {
                ...muiTheme.luno.form.field,
                height: 40,
                padding: 0,
                textAlign: 'left',
            },
            underline: {
                borderBottom: 'none',
                borderTop: 'none',
            },
        };
        const showError = invalid && touched;
        if (showError) {
            Object.assign(styles.main, muiTheme.luno.form.fieldError);
        }

        const items = choices.map(({label, value}, i) => {
            return (
                <MenuItem
                    className="form-select-menu-item"
                    innerDivStyle={styles.item}
                    key={`form-select-choice-${name}-${i}`}
                    primaryText={label}
                    value={encodeValue(value)}
                />
            );
        });

        return (
            <div>
                <DropDownMenu
                    autoWidth={!width}
                    children={items}
                    iconStyle={{top: 8}}
                    labelStyle={styles.label}
                    listStyle={{width}}
                    menuStyle={{width}}
                    onChange={handleChange}
                    style={styles.main}
                    underlineStyle={styles.underline}
                    value={encodeValue(value)}
                    {...other}
                />
                <FormFieldError error={showError ? error : undefined} />
            </div>
        );
    }

};

FormSelectField.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.string,
    invalid: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    touched: PropTypes.bool,
    value: PropTypes.any,

    // Note that Material-UI will round up to the nearest 64px for the menu
    width: PropTypes.number,
};

FormSelectField.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

FormSelectField.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default FormSelectField;
