import { merge } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';
import { getValues } from 'redux-form';

import t from '../utils/gettext';
import { updateCollections } from '../utils/collections';

import AddCollectionIcon from './AddCollectionIcon';
import AddToCollectionForm from './AddToCollectionForm';
import IconMenu from './IconMenu';

const FILTER_INPUT_CLASS_NAME = 'add-to-collection-input';
const CONFIRMATION_CLOSE_DELAY = 3000;

function missingCollection(collections, otherCollections) {
    return collections.find(collection => {
        return !otherCollections.find(o => o.id === collection.id);
    });
}

class AddToCollectionMenu extends Component {

    state = {
        addingNewCollection: false,
        confirmationMessage: null,
        muiTheme: this.context.muiTheme,
        open: false,
        submitting: false,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        }
    }

    componentWillMount() {
        const muiTheme = merge({}, this.state.muiTheme);
        muiTheme.paper.backgroundColor = muiTheme.luno.colors.offWhite,
        this.setState({muiTheme});
    }

    componentWillReceiveProps(nextProps) {
        const oldCollections = this.props.collections;
        const newCollections = nextProps.collections;
        if (!oldCollections || !newCollections) {
            return;
        }

        const added = missingCollection(newCollections, oldCollections);
        const removed = missingCollection(oldCollections, newCollections);

        let confirmationMessage;
        if (added) {
            confirmationMessage = t('Added to ') + added.display_name;
        } else if (removed) {
            confirmationMessage = t('Removed from ') + removed.display_name;
        }

        if (confirmationMessage) {
            this.setState({confirmationMessage});

            this.confirmationTimeout = setTimeout(() => {
                this.setState({open: false});
            }, CONFIRMATION_CLOSE_DELAY);
        }
    }

    handleRequestChange = (open) => {
        if (open) {
            this.setState({
                confirmationMessage: null,
                submitting: false,
                open
            });
        } else {
            this.setState({open});
            this.submit();
        }

        if (this.confirmationTimeout) {
            clearTimeout(this.confirmationTimeout);
        }
    }

    handleSubmit = (form, dispatch) => {
        // TODO there is a bug in redux-form (? maybe? this works with
        // PostEditor) where values from `form` aren't up to date.
        form = getValues(this.context.store.getState().get('form').addToCollection);
        const { collections, post } = this.props;
        updateCollections(dispatch, post, collections, form.collections);
    }

    handleItemTouchTap = (event) => {
        event.preventDefault();

        if (event.target.className === FILTER_INPUT_CLASS_NAME) {
            return;
        }

        this.submit();
    }

    handleOpenNewForm = () => {
        this.setState({addingNewCollection: true});
    }

    handleCloseNewForm = () => {
        this.setState({addingNewCollection: false, submitting: true});
        this.submit();
    }

    submit() {
        if (this.refs.form) {
            this.refs.form.submit();
        }
    }

    render() {
        const { collections, editableCollections, memberships, post, style, ...other } = this.props;
        const { muiTheme } = this.context;
        const { addingNewCollection, confirmationMessage, submitting } = this.state;

        const styles = {
            confirmation: {
                fontSize: '1.5rem',
                padding: '5px 15px',
            },
            formContainer: {
                padding: 0,
                paddingLeft: 20,
                paddingRight: 20,
            },
            inputContainer: {
                border: `1px solid ${muiTheme.luno.colors.lightWhite}`,
                borderRadius: '2px',
                height: 40,
                marginTop: 10,
                marginBottom: 10,
            },
            input: {
            },
            listContainer: {
                boxShadow: 'none',
                WebkitBoxShadow: 'none',
            },
            menu: {
                height: addingNewCollection || confirmationMessage ? undefined : 270,
                width: 340,
            },
        };

        const theme = muiTheme.luno.circularIconMenu;

        let content;
        if (confirmationMessage) {
            content = (
                <div style={styles.confirmation}>
                    {confirmationMessage}
                </div>
            );
        } else {
            content = (
                <div style={styles.formContainer}>
                    <AddToCollectionForm
                        addingNewCollection={addingNewCollection || submitting}
                        collections={collections}
                        editableCollections={editableCollections}
                        inputClassName={FILTER_INPUT_CLASS_NAME}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        listContainerStyle={styles.listContainer}
                        memberships={memberships}
                        newCollectionAllowed={true}
                        onCloseNewForm={this.handleCloseNewForm}
                        onOpenNewForm={this.handleOpenNewForm}
                        onSubmit={this.handleSubmit}
                        post={post}
                        ref="form"
                        style={styles.form}
                    />
                </div>
            );
        }
        return (
            <IconMenu
                closeOnItemTouchTap={false}
                iconButtonStyle={theme.button}
                iconElement={<AddCollectionIcon {...theme.Icon} />}
                menuStyle={styles.menu}
                onItemTouchTap={this.handleItemTouchTap}
                onRequestChange={this.handleRequestChange}
                open={this.state.open}
                style={merge(theme.menu, style)}
                useLayerForClickAway={true}
                {...other}
            >
                {content}
            </IconMenu>
        );
    }

}

AddToCollectionMenu.propTypes = {
    collections: PropTypes.array,
    editableCollections: PropTypes.array,
    memberships: PropTypes.array,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    style: PropTypes.object,
};

AddToCollectionMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
    }).isRequired,
};

AddToCollectionMenu.childContextTypes = {
    muiTheme: PropTypes.object,
};

export default AddToCollectionMenu;
