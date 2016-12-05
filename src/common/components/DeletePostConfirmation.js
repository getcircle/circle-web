import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import DestructiveDialog from './DestructiveDialog';

const DeletePostConfirmation = ({ post, ...other }) => {

    const styles = {
        container: {
            padding: 30,
            fontSize: '1.4rem',
            lineHeight: '1.7rem',
        },
    };

    let dialog;
    if (post) {
        dialog = (
            <DestructiveDialog
                title={t('Delete Post')}
                {...other}
            >
                <div style={styles.container}>
                    <p>{t('Deleting a Post is final and can not be undone.')}</p>
                    <br />
                    <p>{t('Are you sure you want to delete post: ')}<b>{post.title}</b>{'?'}</p>
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

DeletePostConfirmation.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};


export default DeletePostConfirmation;
