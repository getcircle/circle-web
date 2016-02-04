import Dropzone from 'react-dropzone';
import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';
import t from '../utils/gettext';

import EditProfileCameraIcon from './EditProfileCameraIcon';
import FormField from  './FormField';
import FormFieldError from './FormFieldError';
import IconContainer from './IconContainer';

export default class FormPhotoField extends FormField {

    static propTypes = {
        name: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.string,
    }

    classes() {
        return {
            default: {
                dropzone: {
                    alignItems: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    boxShadow: 'none',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '50px',
                    justifyContent: 'flex-start',
                    padding: 0,
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                dropzoneActive: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '-1px 1px 1px rgba(0, 0, 0, 0.2)',
                },
                editProfileCameraIconContainer: {
                    border: 0,
                    left: 0,
                    height: 50,
                    position: 'relative',
                    top: 0,
                    width: 45,
                },
                editProfileCameraIcon: {
                    height: 50,
                    width: 50,
                },
                profileImage: {
                    border: '0',
                    borderRadius: 25,
                    height: 50,
                    objectFit: 'cover',
                    width: 50,
                },
                profileImageButton: {
                    backgroundColor: 'transparent',
                    border: '0',
                    marginRight: 10,
                    padding: 0,
                    outline: 'none',
                    width: 50,
                    height: 50,
                },
                profileImageUploadContainer: {
                    alignItems: 'center',
                    display: 'flex',
                },
            },
            'showError': {
                dropzone: {
                    border: '1px solid rgba(200, 0, 0, 0.8)',
                },
            },
        };
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    onDrop(files) {
       const file = files[0];

        if (file) {
           this.props.onChange(file);
        }
    }

    render() {
        const { error, value } = this.props;
        const preview = value && value.preview;

        return (
            <div>
                <div className="row start-xs" style={this.styles().profileImageUploadContainer}>
                    <button
                        className="dropzone-trigger"
                        onClick={this.onOpenClick.bind(this)}
                        style={this.styles().profileImageButton}
                        type="button"
                    >
                        <img alt={t('Image')} src={preview} style={this.styles().profileImage} />
                    </button>
                    <Dropzone
                        activeStyle={{...this.styles().dropzoneActive}}
                        className="col-xs"
                        multiple={false}
                        onDrop={this.onDrop.bind(this)}
                        ref="dropzone"
                        style={this.styles().dropzone}
                    >
                        <div className="row center-xs middle-xs dropzone-trigger">
                            <IconContainer
                                IconClass={EditProfileCameraIcon}
                                iconStyle={{...this.styles().editProfileCameraIcon}}
                                stroke="rgba(0, 0, 0, 0.4)"
                                style={this.styles().editProfileCameraIconContainer}
                            />
                            <div className="row col-xs start-xs">{t('Update Photo')}</div>
                        </div>
                    </Dropzone>
                </div>
                 <FormFieldError error={this.showError() ? error : undefined} />
            </div>
        );
    }
}
