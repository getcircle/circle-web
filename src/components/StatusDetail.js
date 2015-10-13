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
        largerDevice: PropTypes.bool.isRequired,
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    classes() {
        return {
            default: {
                section: {
                    marginTop: 20,
                },
                statusText: {
                    fontSize: 16,
                    lineHeight: '29px',
                    whiteSpace: 'pre-wrap',
                    ...fontColors.dark,
                },
            },
        };
    }

    // Render Methods

    render() {
        const { status } = this.props;
        const author = status.profile;
        const statusText = `"${status.value}"`;
        let cardTitle = `${author.first_name}' status &nbsp;&ndash;&nbsp; ${moment(status.changed).fromNow()}`;

        return (
            <DetailContent>
                <Card is="section" title={cardTitle}>
                    <div>
                        <div is="statusText">
                            {statusText}
                        </div>
                        <CardRow>
                            <CardList>
                                <CardListItem
                                    leftAvatar={<ProfileAvatar profile={author} />}
                                    onTouchTap={routeToProfile.bind(null, this.context.router, author)}
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
