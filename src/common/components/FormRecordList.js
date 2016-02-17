import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';
import t from '../utils/gettext';

import CrossIcon from './CrossIcon';

const RecordWrapper = (props, {muiTheme}) => {
    const {
        RecordComponent,
        index,
        onRemove,
        record,
    } = props;
    const remove = () => onRemove(index);
    const styles = {
        remove: {
            cursor: 'pointer',
            display: 'inline-block',
            marginLeft: 10,
            marginTop: 8,
        },
        row: {
            marginBottom: 15,
        },
    };

    return (
        <div className="row" key={index} style={styles.row}>
            <RecordComponent record={record} />
            <CrossIcon
                height={22}
                onTouchTap={remove}
                stroke={muiTheme.luno.form.removeCross.color}
                style={styles.remove}
                width={22}
            />
        </div>
    );
};

RecordWrapper.propTypes = {
    RecordComponent: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
};

RecordWrapper.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export { RecordWrapper };

/**
 * A list of addable/removable records in a form
 *
 * The component provided must take a prop of `record`.
 * A minimal example:
 *
 *  const ExampleRecord = ({record}) => {
 *      return (
 *          <div>
 *              <FormTextField
 *                  {...record.name}
 *               />
 *          </div>
 *      );
 *  };
 *
 */
const FormRecordList = ({component, defaultRecord, records}) => {
    const handleAdd = () => {
        records.addField(defaultRecord || {});
    };

    const handleRemove = (index) => {
        records.removeField(index);
    };

    const styles = {
        addWrapper: {
            display: 'block',
            marginTop: 15,
            textAlign: 'left',
        },
        add: {
            cursor: 'pointer',
            fontSize: 12,
            marginLeft: 16,
            ...fontColors.light,
        },
    };

    return (
        <div>
            {records.map((record, index) =>
                <RecordWrapper
                    RecordComponent={component}
                    index={index}
                    key={index}
                    onRemove={handleRemove}
                    record={record}
                />
            )}
            <div style={styles.addWrapper}>
                <a onTouchTap={handleAdd} style={styles.add}>{t('Add another')}</a>
            </div>
        </div>
    );
};

FormRecordList.propTypes = {
    component: PropTypes.func.isRequired,
    defaultRecord: PropTypes.object,
    records: PropTypes.array.isRequired,
};

export default FormRecordList;
