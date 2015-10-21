import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors } from '../constants/styles';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';

import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import ProfileAvatar from './ProfileAvatar';

class Editor extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    state = {
        title: '',
        content: '',
    }

    classes() {
        return {
            default: {
                section: {
                    marginTop: 5,
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '700',
                    fontStyle: 'normal',
                    fontSize: '36px',
                    lineHeight: '1.15',
                    letterSpacing: '-0.02em',
                    marginLeft: '16px',
                    marginTop: '20px',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                cardList: {
                    background: 'transparent',
                },
                cardListItemInnerDivStyle: {
                    height: 72,
                    paddingLeft: 72,
                    paddingTop: 20,
                    paddingBottom: 16,
                },
                cardListAvatar: {
                    height: 40,
                    width: 40,
                    top: '16px',
                },
            },
        };
    }

    // Change Methods
    handleTitleChange(event) {
        this.setState({
            title: event.target.value,
        });
    }

    // Render Methods

    render() {
        let author = this.context.authenticatedProfile;

        return (
            <DetailContent>
                <CardList className="row" is="cardList">
                    <CardListItem
                        innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                        leftAvatar={<ProfileAvatar is="cardListAvatar" profile={author} />}
                        onTouchTap={routeToProfile.bind(null, this.context.router, author)}
                        primaryText={author.full_name}
                        secondaryText={author.title}
                    />
                </CardList>
                <div className="row">
                    <div className="col-xs">
                        <div className="box">
                            <input
                                is="postTitle"
                                name="title"
                                onChanged={::this.handleTitleChange}
                                placeholder={t('Title')}
                                text={this.state.title}
                                type="text"
                            />
                        </div>
                    </div>
                </div>
            </DetailContent>
        );
    }

}

export default Editor;
