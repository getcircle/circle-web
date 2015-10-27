import { Tabs, Tab } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CurrentTheme from '../utils/ThemeManager';
import { fontColors, fontWeights } from '../constants/styles';
import moment from '../utils/moment';
import { routeToNewPost, routeToPosts, routeToPost } from '../utils/routes';
import t from '../utils/gettext';

import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import RoundedButton from './RoundedButton';

const { PostStateV1 } = services.post.containers;

class Posts extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        postState: PropTypes.string,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    state = {
        muiTheme: CurrentTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
    }

    classes() {
        return {
            default: {
                cardListItemInnerDivStyle: {
                    background: 'transparent',
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    padding: 30,
                },
                pageHeaderContainer: {
                    padding: '10px 0 50px 0',
                    width: '100%',
                },
                pageHeaderText: {
                    fontSize: 36,
                    fontWeight: 300,
                    ...fontColors.dark,
                },
                listInnerContainer: {
                    padding: 0,
                },
                primaryTextStyle: {
                    marginBottom: 5,
                },
                tabsContainer: {
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    marginBottom: 20,
                    width: '100%',
                },
                tabInkBarStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    height: 1,
                },
                tab: {
                    fontSize: 12,
                    letterSpacing: '1px',
                    padding: '0 25px',
                    textTransform: 'uppercase',
                    ...fontWeights.semiBold,
                },
            },
        };
    }

    customizeTheme(props) {
        let customTabsTheme = Object.assign({}, CurrentTheme, {
            tab: {
                textColor: CurrentTheme.tab.textColor,
                selectedTextColor: 'rgba(0, 0, 0, 0.8)',
            },
            tabs: {
                backgroundColor: 'transparent',
            },
        });

        this.setState({muiTheme: customTabsTheme});
    }

    // Event Handlers

    onTabChange(value, event, tab) {
        routeToPosts(this.context.router, value);
    }

    onAddPostTapped() {
        routeToNewPost(this.context.router);
    }

    // Render Methods

    renderPost(post) {
        const lastUpdatedText = `Updated ― ${moment(post.changed).fromNow()}`;
        return (
            <CardListItem
                innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                onTouchTap={routeToPost.bind(null, this.context.router, post)}
                primaryText={post.title}
                primaryTextStyle={{...this.styles().primaryTextStyle}}
                secondaryText={lastUpdatedText}
            />
        );
    }

    render() {
        const {
            postState,
        } = this.props;
        const postElements = this.props.posts.map((post, index) => {
            return this.renderPost(post);
        });

        return (
            <DetailContent>
                <CardRow>
                    <div className="row start-xs between-xs" is="pageHeaderContainer">
                        <div>
                            <h3 is="pageHeaderText">{t('My Knowledge')}</h3>
                        </div>
                        <div>
                            <RoundedButton
                                label={t('Add Knowledge')}
                                onTouchTap={::this.onAddPostTapped}
                            />
                        </div>
                    </div>
                    <div className="row" is="tabsContainer">
                        <Tabs
                            inkBarStyle={{...this.styles().tabInkBarStyle}}
                            valueLink={{value: postState, requestChange: this.onTabChange.bind(this)}}
                        >
                            <Tab
                                label={t('Drafts')}
                                style={{...this.styles().tab}}
                                value={PostStateV1.DRAFT.toString()}
                            />
                            <Tab
                                label={t('Published')}
                                style={{...this.styles().tab}}
                                value={PostStateV1.LISTED.toString()}
                            />
                        </Tabs>
                    </div>
                    <CardList className="row">
                        <div className="col-xs" is="listInnerContainer">
                            {postElements}
                        </div>
                    </CardList>
                </CardRow>
            </DetailContent>
        );
    }
}

export default Posts;
