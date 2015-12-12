import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { routeToProfile } from '../utils/routes';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import ProfileAvatar from './ProfileAvatar';

class StatusDetail extends CSSComponent {

    static propTypes = {
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    classes() {
        return {
            default: {
                section: {
                    marginTop: 20,
                },
                statusText: {
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    fontSize: 24,
                    fontStyle: 'italic',
                    lineHeight: '30px',
                    padding: 24,
                    whiteSpace: 'pre-wrap',
                    ...fontColors.dark,
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

    // Render Methods

    render() {
        const { status } = this.props;
        const author = status.profile;
        const statusText = `"${status.value}"`;
        let cardTitle = `${author.first_name}'s status ― ${moment(status.changed).fromNow()}`;

        return (
            <DetailContent>
                <Card style={this.styles().section} title={cardTitle}>
                    <div>
                        <div style={this.styles().statusText}>
                            {statusText}
                        </div>
                        <CardRow>
                            <CardList>
                                <CardListItem
                                    innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                                    leftAvatar={<ProfileAvatar profile={author} style={this.styles().cardListAvatar} />}
                                    onTouchTap={routeToProfile.bind(null, this.context.history, author)}
                                    primaryText={author.full_name}
                                    secondaryText={author.title}
                                />
                            </CardList>
                        </CardRow>
                    </div>
                </Card>
            </DetailContent>
        );
    }

}

export default StatusDetail;
