import React, { PropTypes } from 'react';

import t from '../utils/gettext';

const RecordWrapper = ({Component, index, onRemove, record}) => {
    const remove = () => onRemove(index);
    const styles = {
        remove: {
            cursor: 'pointer',
            fontSize: 16,
            marginLeft: 20,
            marginTop: 20,
        },
    };

    return (
        <div className="row" key={index}>
            <Component
                index={index}
                record={record}
                style={styles.record}
            />
            <a onTouchTap={remove} style={styles.remove}>{t('x')}</a>
        </div>
    );
};
RecordWrapper.propTypes = {
    Component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
};
export { RecordWrapper };

/**
 * A list of addable/removable records in a form
 *
 * The Component provided must take a prop of `record`.
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
 * @param {React component} component the component to render for each record
 * @param {Array} records the redux-forms records array
 * @return {React component}
 */
const FormRecordList = ({component, records}) => {
    const handleAdd = () => {
        records.addField();
    };

    const handleRemove = (index) => {
        records.removeField(index);
    };

    return (
        <div>
            {records.map((record, index) =>
                <RecordWrapper
                    Component={component}
                    index={index}
                    key={index}
                    onRemove={handleRemove}
                    record={record}
                />
            )}
            <a onTouchTap={handleAdd}>{t('Add another')}</a>
        </div>
    );
};

FormRecordList.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    records: PropTypes.array.isRequired,
};

export default FormRecordList;
