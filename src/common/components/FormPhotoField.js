import Dropzone from 'react-dropzone';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import FormField from  './FormField';
import FormFieldError from './FormFieldError';

export default class FormPhotoField extends FormField {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    classes() {
        const { muiTheme } = this.context;

        return {
            default: {
                dropzone: {
                    ...muiTheme.luno.form.field,
                    alignItems: 'center',
                    boxShadow: 'none',
                    height: '50px',
                    justifyContent: 'flex-start',
                    padding: 0,
                },
                dropzone: {
                    border: '0',
                    color: muiTheme.luno.tintColor,
                    fontSize: '1.4rem',
                },
                dropzoneActive: {
                    border: '0',
                },
                profileImage: {
                    border: '0',
                    borderRadius: '50%',
                    height: 60,
                    objectFit: 'cover',
                    width: 60,
                },
                profileImageButton: {
                    backgroundColor: 'transparent',
                    border: '0',
                    marginRight: 10,
                    padding: 0,
                    outline: 'none',
                    width: 60,
                    height: 60,
                },
                profileImageUploadContainer: {
                    alignItems: 'center',
                    display: 'flex',
                },
            },
            'showError': {
                dropzone: {
                    ...muiTheme.luno.form.fieldError,
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
                            <div className="row col-xs start-xs">{t('Change photo')}</div>
                        </div>
                    </Dropzone>
                </div>
                <FormFieldError error={this.showError() ? error : undefined} />
            </div>
        );
    }
}
