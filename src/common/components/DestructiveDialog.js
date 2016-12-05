import React from 'react';

import t from '../utils/gettext';

import Dialog from './Dialog';

const DestructiveDialog = (props) => {
    return (
        <Dialog
            dismissLabel={t('Cancel')}
            saveButtonStyle={{backgroundColor: '#F46F6F'}}
            saveLabel={t('Confirm Delete')}
            {...props}
        />
    );
};

export default DestructiveDialog;
