import { IconButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { EDIT_PROFILE } from '../../constants/forms';
import { showFormDialog } from '../../actions/forms';

import EditIcon from '../EditIcon';

const EditButton = ({dispatch}, {muiTheme}) => {
    const styles = {
        button: {
            height: 24,
            marginLeft: 6,
            marginTop: 6,
            padding: 0,
            width: 24,
        }
    };
    const handleTouchTap = () => {
        dispatch(showFormDialog(EDIT_PROFILE));
    };
    return (
        <div>
            <IconButton
                onTouchTap={handleTouchTap}
                style={styles.button}
            >
                <EditIcon stroke={muiTheme.luno.tintColor} />
            </IconButton>
        </div>
    );
};

EditButton.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

EditButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default EditButton;
