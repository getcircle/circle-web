import mui from 'material-ui';
import React from 'react';
import StyleableComponent from './StyleableComponent';

import ProfileSearchResult from './ProfileSearchResult';
import Search from './Search';
import TeamSearchResult from './TeamSearchResult';

const { Dialog, List } = mui;

const styles = {
    dialog: {
        borderRadius: 4,
        maxWidth: 500,
    },
    dialogBody: {
        padding: 0,
        paddingBottom: 10,
        maxHeight: 600,
    },
    dialogHeader: {
        lineHeight: '19px',
        fontSize: '14px',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, .4)',
        paddingTop: 18,
        paddingBottom: 18,
    },
    dialogSearch: {
        width: 460,
        minWidth: 0,
        border: '2px solid rgba(0, 0, 0, .1)',
        borderRadius: '4px',
        boxShadow: 'none',
        display: 'none',
    },
    dialogSearchResults: {
        boxShadow: 'none',
    },
    dialogSearchDefaults: {
        width: 460,
    },
};

class DetailViewAll extends StyleableComponent {

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        items: React.PropTypes.array.isRequired,
        onClickItem: React.PropTypes.func.isRequired,
    }

    show() {
        this.refs._internal.show();
    }

    render() {
        const title = (
            <header className="row center-xs" style={styles.dialogHeader}>
                {this.props.title}
            </header>
        );
        const items = this.props.items.map((item, index) => {
            if (item.full_name) {
                return (
                    <ProfileSearchResult
                        key={index}
                        profile={item}
                        onClick={this.props.onClickItem.bind(null, item)}
                    />
                );
            } else {
                return (
                    <TeamSearchResult
                        key={index}
                        team={item}
                        onClick={this.props.onClickItem.bind(null, item)}
                    />
                );
            }
        })
        const defaults = (
            <List className="start-xs" style={styles.dialogSearchDefaults}>
                {items}
            </List>
        )
        return (
            <Dialog
                ref="_internal"
                {...this.props}
                title={title}
                contentStyle={styles.dialog}
                bodyStyle={styles.dialogBody}
                autoScrollBodyContent={true}
            >
                <Search
                    searchBarStyle={styles.dialogSearch}
                    resultsListStyle={styles.dialogSearchResults}
                    renderPoweredBy={false}
                    defaultResults={defaults}
                    focused={true}
                />
            </Dialog>
        );
    }

}

export default DetailViewAll;
