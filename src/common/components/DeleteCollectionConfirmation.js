import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import DestructiveDialog from './DestructiveDialog';

const DeleteCollectionConfirmation = ({ collection, ...other }) => {

    const styles = {
        container: {
            padding: 30,
            fontSize: '1.4rem',
            lineHeight: '1.7rem',
        },
    };

    let dialog;
    if (collection) {
        dialog = (
            <DestructiveDialog
                title={t('Delete Collection')}
                {...other}
            >
                <div style={styles.container}>
                    <p>{t('Deleting a Collection is final. The Collection will no longer show up in search results, and it will be removed from your Collections page.')}</p>
                    <br />
                    <p>{t('Note: Deleting a Collection will not delete its Knowledge posts.')}</p>
                    <br />
                    <p>{t('Are you sure you want to delete this Collection?')}</p>
                </div>
            </DestructiveDialog>
        );
    }
    return (
        <div>
            {dialog}
        </div>
    );
};

DeleteCollectionConfirmation.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
};


export default DeleteCollectionConfirmation;
