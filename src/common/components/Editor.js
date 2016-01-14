import Immutable from 'immutable';
import React, { PropTypes } from 'react';
import 'script!trix/dist/trix.js';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class Editor extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onFileDeleteCallback: PropTypes.func.isRequired,
        onUploadCallback: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        uploadProgress: PropTypes.object,
        uploadedFiles: PropTypes.object,
        value: PropTypes.string,
    }

    static defaultProps = {
        onChange: () => {},
        onFileDeleteCallback: () => {},
        onUploadCallback: () => {},
        placeholder: '',
        uploadProgress: Immutable.Map(),
        uploadedFiles: Immutable.Map(),
        value: '',
    }

    state = {
        dragStart: false,
        value: null,
    }

    // This is maintained locally instead of in the state
    // to guarantee instant mutability rather than async one we get
    // by using setState. This is also mutated in multiple places.
    attachmentObjects = {};

    // In an ideal world, drag enter and drag leave would behave as
    // stated in their documentation whereby drag enter gets called
    // when a droppable object is in drop zone and drag leave when its
    // moved. But, drag* events also get triggerred on every mouse move.
    // There is no clean way to detect which drag enter/leave combination
    // is real or is being caused by mouse movement. Fortunately, the
    // total count of "enter" and "leave" events are equal when dragging a file
    // or cancelling it. There is also a catch all onDrop event for the success
    // case. This variable is used to keep the count of drag* events.
    dragEventCounter = 0;
    headerOffsetHeight = 0;
    toolbar = null;
    editorElement = null;

    // Trix doesn't have real getters for HTML and it adds them as a
    // value to a hidden input element or by change events; because
    // it is designed to work like a web component. To pass value into Trix,
    // we define our own hidden input element and pass its ID to Trix, so it
    // can fetch the initial value.
    inputId = null;

    // We need to define these and a keep a reference to correctly add and register them
    // because these are added on the global document. Doing it inline does not for deregistering
    // when using anonymous functions or using bind.
    eventHandlers = {}

    componentWillMount() {
        this.inputId = Math.round(1E6 * Math.random()).toString(36);
        this.mergeStateAndProps(this.props);
    }

    componentDidMount() {
        this.setup();
        this.attachEventListeners();
        this.dragEventCounter = 0;
        this.headerOffsetHeight = document.querySelector('header').offsetHeight;
    }

    componentWillReceiveProps(nextProps) {
        this.updateFileUploadProgress(nextProps);
    }

    componentWillUnmount() {
        this.removeEventListeners();
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
            });
        }
    }

    focus() {
        this.getEditorElement().focus();
    }

    setup() {
        // In some browsers, the elements are not attached by the time
        // the control gets here. Delay execution.
        setTimeout(() => {
            // CUSTOMIZE TOOLBAR

            // Add keyboard shortcut for code block
            const codeButton = document.querySelector('.button_group.block_tools .code');
            if (codeButton) {
                codeButton.setAttribute('data-key', 'alt+6');
            }

            // Make toolbar buttons not selectable by pressing tab key
            const toolbarButtons = document.querySelectorAll('trix-toolbar button');
            const numberOfToolbarButtons = toolbarButtons.length;
            for (let i = 0; i < numberOfToolbarButtons; i++) {
                toolbarButtons[i].setAttribute('tabindex', '-1');
            }

            // Prefix with protocol by default when link button is clicked
            const linkInput = document.querySelector('.dialogs input[type="url"]');
            linkInput.addEventListener('focus', (event) => {
                if (!linkInput.value || linkInput.value.length === 0) {
                    linkInput.value = 'https://';
                }
            });

            // Add attach button in toolbar
            const attachButton = document.querySelector('.button_group.block_tools .attach');
            if (!attachButton) {
                const attachButtonElement = document.createElement('button');
                attachButtonElement.setAttribute('type', 'button');
                attachButtonElement.setAttribute('class', 'attach');
                attachButtonElement.setAttribute('data-action', 'x-attach');
                attachButtonElement.setAttribute('tabindex', '-1');
                attachButtonElement.innerHTML = t('Attach Files');
                attachButtonElement.addEventListener('click', (event) => this.handleAttachButtonClicked(event));
                document.querySelector('.button_group.block_tools').appendChild(attachButtonElement);
            }
        }, 10);
    }

    attachEventListeners() {
        this.eventHandlers = {
            'trix-change': this.handleChange.bind(this),
            'trix-attachment-add': this.handleFileAdd.bind(this),
            'trix-attachment-remove': this.handleFileDelete.bind(this),
            'trix-file-accept': this.handleFileVerification.bind(this),
            'scroll': this.handleScroll.bind(this),
        };

        for (let prop in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(prop)) {
                document.addEventListener(prop, this.eventHandlers[prop], false);
            }
        }
    }

    removeEventListeners() {
        for (let prop in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(prop)) {
                document.removeEventListener(prop, this.eventHandlers[prop], false);
            }
        }
    }

    getEditorElement() {
        if (this.editorElement === null) {
            this.editorElement = document.querySelector('trix-editor');
        }
        return this.editorElement;
    }

    getToolbar() {
        if (this.toolbar === null) {
            this.toolbar = document.querySelector('trix-toolbar');
        }
        return this.toolbar;
    }

    updateFileUploadProgress(props) {
        const {
            uploadProgress,
            uploadedFiles,
        } = props;

        if (Object.keys(this.attachmentObjects).length && (uploadProgress.size || uploadedFiles.size)) {
            let attachment, file;
            const attachmentObjects = this.attachmentObjects;

            for (let fileName in attachmentObjects) {
                attachment = this.attachmentObjects[fileName];

                // update progress if we have it set
                if (uploadProgress.get(fileName)) {
                    attachment.setUploadProgress(uploadProgress.get(fileName));
                }

                // update URL when upload is completed
                if (uploadedFiles.get(fileName)) {
                    file = uploadedFiles.get(fileName);
                    attachment.setAttributes({
                        url: file.source_url,
                        href: file.source_url,
                        fileId: file.id,
                    });

                    delete this.attachmentObjects[fileName];
                }
            }
        }
    }

    handleAttachButtonClicked(event) {
        this.getEditorElement().focus();
        this.refs.filePicker.click();
        event.preventDefault();
    }

    handleSelectedFiles(event) {
        if (event.target && event.target.files) {
            event.preventDefault();
            const files = event.target.files;
            for (let fileKey in files) {
                this.getEditorElement().editor.insertFile(files[fileKey]);
            }
        }
    }

    handleFileVerification(event) {
        if (!event || !event.file || typeof event.file !== 'object') {
            event.preventDefault();
        }
    }

    handleFileAdd(event) {
        if (event && event.attachment && event.attachment.file && typeof event.attachment.file === 'object') {
            const { onUploadCallback } = this.props;
            const file = event.attachment.file;
            if (file.name) {
                this.attachmentObjects[file.name] = event.attachment;
                onUploadCallback(file);
            }
        }
    }

    handleFileDelete(event) {
        if (event && event.attachment && event.attachment.getAttribute('fileId')) {
            const { onFileDeleteCallback } = this.props;
            const fileId = event.attachment.getAttribute('fileId');
            if (fileId) {
                onFileDeleteCallback(fileId);
            }
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

    handleDragEnter(event) {
        event.preventDefault();
        this.setState({
            dragStart: true,
        });

        // See comment above.
        ++this.dragEventCounter;
    }

    handleDragLeave(event) {
        event.preventDefault();
        if (--this.dragEventCounter > 0) {
            return;
        }

        this.setState({
            dragStart: false,
        });
    }

    handleDrop(event) {
        this.setState({
            dragStart: false,
        });
    }

    handleScroll(event) {
        const toolbar = this.getToolbar();
        const editorElement = this.getEditorElement();
        if (!toolbar || !this.refs.lunoEditorContainer || !editorElement) {
            return;
        }

        const elementToCompare = toolbar.classList.contains('sticky') ? toolbar.parentNode : toolbar;
        if (elementToCompare.getBoundingClientRect().top <= this.headerOffsetHeight) {
            if (!toolbar.classList.contains('sticky')) {
                toolbar.classList.add('sticky');
                editorElement.classList.add('sticky-toolbar');
                this.refs.lunoEditorContainer.classList.add('sticky-toolbar');
                toolbar.style.width = window.getComputedStyle(this.getEditorElement()).width;
            }
        } else if (toolbar.classList.contains('sticky')) {
            toolbar.classList.remove('sticky');
            toolbar.style.width = '100%';
            editorElement.classList.remove('sticky-toolbar');
            this.refs.lunoEditorContainer.classList.remove('sticky-toolbar');
        }
    }

    renderDropzoneIndicator() {
        const classNames = 'row middle-xs center-xs drop_zone_indicator' + (this.state.dragStart ? '' : ' hide');
        return (
            <div className={classNames}>
                <strong>{t('Drop your files anywhere in this area to begin upload.')}</strong>
            </div>
        );
    }

    render() {
        const {
            placeholder,
        } = this.props;

        const className = 'luno-editor-container ' + (this.state.dragStart ? 'dropzone' : '');
        return (
            <div className={className} ref="lunoEditorContainer">
                <input
                    id={this.inputId}
                    onChange={::this.handleChange}
                    type="hidden"
                    value={this.state.value}
                />
                {this.renderDropzoneIndicator()}
                <trix-editor
                    class="luno-editor"
                    input={this.inputId}
                    onDragEnter={::this.handleDragEnter}
                    onDragLeave={::this.handleDragLeave}
                    onDrop={::this.handleDrop}
                    placeholder={placeholder}
                />
                <input
                    className="hidden-file-picker"
                    multiple={true}
                    onChange={::this.handleSelectedFiles}
                    ref="filePicker"
                    type="file"
                />
                <div className="row hints-container" style={this.styles().hintsContainer}>
                    {t('Hint: You can also drag and drop to add attachments inline.')}
                </div>
            </div>
        );
    }
}

export default Editor;
