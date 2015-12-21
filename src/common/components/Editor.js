import Immutable from 'immutable';
import React, { PropTypes } from 'react';
import 'script!trix/dist/trix.js';

import logger from '../utils/logger';

import CSSComponent from './CSSComponent';

class Editor extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onUploadCallback: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        uploadProgress: PropTypes.object,
        uploadedFiles: PropTypes.object,
        value: PropTypes.string,
    }

    static defaultProps = {
        onChange: () => {},
        onUploadCallback: () => {},
        placeholder: '',
        uploadProgress: Immutable.Map(),
        uploadedFiles: Immutable.Map(),
        value: '',
    }

    state = {
        value: null,
    }

    // This is maintained locally instead of in the state
    // to guarantee instant mutability rather than async one we get
    // by using setState. This is also mutated in multiple places.
    attachmentObjects = {};

    componentDidMount() {
        this.setup();
        this.attachEventListeners();
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateFileUploadProgress(nextProps);
    }

    classes() {
        return {
            default: {
            },
        };
    }

    mergeStateAndProps(props) {
        if (this.state.value === null && props.value) {
            this.setState({
                value: props.value,
            }, () => {
                const trixEditor = document.querySelector('trix-editor');
                trixEditor.editor.insertHTML(props.value);
            });
        }
    }

    focus() {
        document.querySelector('trix-editor').focus();
    }

    setup() {
        const codeButton = document.querySelector('.button_group.block_tools .code');
        if (codeButton) {
            codeButton.setAttribute('data-key', 'alt+6');
        }
    }

    attachEventListeners() {
        document.addEventListener('trix-change', (event) => this.handleChange(event));
        document.addEventListener('trix-attachment-add', (event) => this.handleFileAdd(event));
        // document.addEventListener('trix-file-accept', (event) => event.preventDefault());
    }

    updateFileUploadProgress(props) {
        const {
            uploadProgress,
            uploadedFiles,
        } = props;

        if (Object.keys(this.attachmentObjects).length && (uploadProgress.size || uploadedFiles.size)) {
            let attachment, fileUrl;
            const attachmentObjects = this.attachmentObjects;

            for (let fileName in attachmentObjects) {
                attachment = this.attachmentObjects[fileName];

                // update progress if we have it set
                if (uploadProgress.get(fileName)) {
                    attachment.setUploadProgress(uploadProgress.get(fileName));
                }

                // update URL when upload is completed
                if (uploadedFiles.get(fileName)) {
                    fileUrl = uploadedFiles.get(fileName).source_url;
                    attachment.setAttributes({
                        url: fileUrl,
                        href: fileUrl,
                    });

                    delete this.attachmentObjects[fileName];
                }
            }
        }
    }

    handleFileAdd(event) {
        if (event && event.attachment && event.attachment.file) {
            const { onUploadCallback } = this.props;
            const file = event.attachment.file;
            this.attachmentObjects[file.name] = event.attachment;
            onUploadCallback(file);
        }
    }

    handleChange(event) {
        const {
            onChange,
        } = this.props;

        this.setState({
            value: event.target.value,
        });

        if (onChange) {
            onChange(event);
        }
    }

    render() {
        const {
            placeholder,
        } = this.props;

        return (
            <div>
                <input
                    name="content"
                    onChange={::this.handleChange}
                    type="hidden"
                    value={this.state.value}
                />
                <trix-editor
                    class="leditor"
                    placeholder={placeholder}
                />
            </div>
        );
    }
}

export default Editor;
