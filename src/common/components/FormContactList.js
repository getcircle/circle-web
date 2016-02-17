import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import t from '../utils/gettext';

import FormRecordList from './FormRecordList';
import FormSelectField from './FormSelectField';
import FormTextField from './FormTextField';

function contactRecordComponent(types) {
    const contactTypes = [];
    _.forIn(types, (value, type) => {
        const label = _.capitalize(type.toLowerCase());
        contactTypes.push({label: t(label), value: value});
    });

    return ({record}) => {
        const styles = {
            type: {
                float: 'left',
                marginRight: 15,
                width: 128,
            },
            value: {
                float: 'left',
                width: 384,
            },
        };

        return (
            <div>
                <div style={styles.type}>
                    <FormSelectField
                        choices={contactTypes}
                        {...record.type}
                    />
                </div>
                <div style={styles.value}>
                    <FormTextField
                        {...record.value}
                    />
                </div>
            </div>
        );
    };
}

export default class FormContactList extends Component {
    constructor(props) {
        super(props);
        this.recordComponent = contactRecordComponent(props.types);
    }

    render() {
        const { contacts, defaultType } = this.props;
        const ContactRecord = this.recordComponent;

        return (
            <FormRecordList
                component={ContactRecord}
                defaultRecord={{type: defaultType, value: ''}}
                records={contacts}
            />
        );
    }
};

FormContactList.propTypes = {
    contacts: PropTypes.array.isRequired,
    defaultType: PropTypes.number.isRequired,
    types: PropTypes.object.isRequired,
};

export default FormContactList;
