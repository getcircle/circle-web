import mui from 'material-ui';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

const {
    TextField,
} = mui;

class LoginEmailInput extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onEnter: PropTypes.func,
        value: PropTypes.string,
    }

    static defaultProps = {
        onEnter: () => {},
        value: '',
    }

    render() {
        const {
            onEnter,
            value,
            ...other,
        } = this.props;
        return (
            <TextField
                autocapitalize="off"
                autocorrect="off"
                hintText={t('you@domain.com')}
                onEnterKeyDown={() => {
                    if (value !== '') {
                        onEnter();
                    }
                }}
                ref={(input) => {
                    if (input !== null && value === '') {
                        input.focus();
                    }
                }}
                spellcheck="false"
                type="email"
                value={value}
                {...other}
            />
        );
    }

}

export default LoginEmailInput;
