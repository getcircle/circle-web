import { merge } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';
import { getValues } from 'redux-form';

import { updateCollections } from '../utils/collections';

import AddCollectionIcon from './AddCollectionIcon';
import AddToCollectionForm from './AddToCollectionForm';
import IconMenu from './IconMenu';

class AddToCollectionMenu extends Component {

    state = {
        muiTheme: this.context.muiTheme,
        open: false,
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

    handleRequestChange = (open) => {
        this.setState({open});
        if (!open) {
            this.submit();
        }
    }

    handleSubmit = (form, dispatch) => {
        // TODO there is a bug in redux-form where values from `form` aren't up to date.
        form = getValues(this.context.store.getState().get('form').addToCollection);
        const { collections, post } = this.props;
        updateCollections(dispatch, post, collections, form.collections);
    }

    handleItemTouchTap = () => {
        this.setState({open: false});
        this.submit();
    }

    submit() {
        if (this.refs.form) {
            this.refs.form.submit();
        }
    }

    render() {
        const { collections, editableCollections, post, style, ...other } = this.props;
        const { muiTheme } = this.context;

        const styles = {
            formContainer: {
                padding: 20,
                paddingTop: 0,
            },
            form: {
                padding: 0,
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
                height: 270,
                width: 280,
            },
        };

        const theme = muiTheme.luno.circularIconMenu;
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
                {...other}
            >
                <div style={styles.formContainer}>
                    <AddToCollectionForm
                        collections={collections}
                        editableCollections={editableCollections}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        listContainerStyle={styles.listContainer}
                        onSubmit={this.handleSubmit}
                        post={post}
                        ref="form"
                        style={styles.form}
                    />
                </div>
            </IconMenu>
        );
    }

}

AddToCollectionMenu.propTypes = {
    collections: PropTypes.array,
    editableCollections: PropTypes.array,
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
