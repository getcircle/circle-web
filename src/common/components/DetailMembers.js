import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardColumns from './CardColumns';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import DetailViewAll from './DetailViewAll';
import InternalPropTypes from './InternalPropTypes';
import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';

const MIN_MEMBERS_TO_SHOW_FOOTER = 4;

class DetailMembers extends StyleableComponent {

    static propTypes = {
        actionText: PropTypes.string,
        itemsPerCollapsedColumn: PropTypes.number,
        itemsPerColumn: PropTypes.number,
        members: PropTypes.arrayOf(InternalPropTypes.ProfileV1),
        membersLoadMore: PropTypes.func,
        numberOfColumns: PropTypes.number,
        onClickActionText: PropTypes.func,
        onClickMember: PropTypes.func,
        pageType: PropTypes.string.isRequired,
        viewAllAttribute: InternalPropTypes.SearchAttributeV1,
        viewAllAttributeValue: PropTypes.string,
        viewAllFilterPlaceholderText: PropTypes.string,
        viewAllTitle: PropTypes.string,
    }

    renderColumn(members) {
        const children = members.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    leftAvatar={<ProfileAvatar profile={item} />}
                    onTouchTap={this.props.onClickMember.bind(null, item)}
                    primaryText={item.full_name}
                    secondaryText={item.display_title}
                />
            );
        });
        return (
            <CardList>
                {children}
            </CardList>
        );
    }

    renderFooter() {
        if (this.props.members.length > MIN_MEMBERS_TO_SHOW_FOOTER) {
            return (
                <div>
                    <CardFooter
                        actionText={this.props.actionText}
                        onClick={() => {
                            const { onClickActionText } = this.props;
                            onClickActionText ? onClickActionText() : this.refs.modal.show();
                        }}
                    />
                    <DetailViewAll
                        filterPlaceholder={this.props.viewAllFilterPlaceholderText}
                        items={this.props.members}
                        itemsLoadMore={this.props.membersLoadMore}
                        pageType={this.props.pageType}
                        ref="modal"
                        searchAttribute={this.props.viewAllAttribute}
                        searchAttributeValue={this.props.viewAllAttributeValue}
                        searchCategory={services.search.containers.search.CategoryV1.PROFILES}
                        title={this.props.viewAllTitle}
                    />
                </div>
            );
        }
    }

    render() {
        const {
            actionText,
            itemsPerCollapsedColumn,
            itemsPerColumn,
            members,
            onClickMember,
            ...other,
        } = this.props;
        return (
            <Card {...other}>
                <CardColumns
                    items={members}
                    itemsPerCollapsedColumn={itemsPerCollapsedColumn}
                    itemsPerColumn={itemsPerColumn}
                    renderColumn={::this.renderColumn}
                />
                {this.renderFooter()}
            </Card>
        );
    }

}

export default DetailMembers;
