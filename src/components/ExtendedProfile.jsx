'use strict';

import mui from 'material-ui';
import React from 'react';

const { Avatar } = mui;

class ExtendedProfile extends React.Component {

    static propTypes = {
        extendedProfile: React.PropTypes.object.isRequired,
    }

    styles = {
        avatar: {
            display: 'flex',
            height: '60px',
            width: '60px',
        },
        detailsContainer: {
            padding: '5px 0 30px 30px',
        },
    }

    _renderContactBar() {

    }

    render() {
        // profile image
        // name
        // title
        // contact bar
        // about
        // hr
        // manager & team
        // hr
        // location
        // expertise
        // interests
        // key-value pairs
        // groups
        const {profile} = this.props.extendedProfile;
        const {manager} = this.props.extendedProfile;
        const {team} = this.props.extendedProfile;
        const {location} = this.props.extendedProfile;

        return (
            <div className="wrap">
                <div className="row extended_profile">
                    <div className="col-sm-3">
                        <img className="extended_profile__image" src={profile.image_url} />
                    </div>
                    <div className="col-sm-9" style={this.styles.detailsContainer}>
                        <div className="row start-xs">
                            <h1>{profile.full_name}</h1>
                        </div>
                        <div className="row start-xs">
                            <h2 className="content__header--secondary">{profile.title}</h2>
                        </div>
                        <div className="row">
                            <div className="col-xs">
                                {this._renderContactBar()}
                            </div>
                        </div>
                        <div className="row col-xs">
                            <p>{profile.about}</p>
                        </div>
                        <div className="row">
                            <h3 className="col-xs">Manager and Team</h3>
                        </div>
                        <div className="row col-xs profile-row">
                            <div className="col-xs-1">
                                <Avatar src={manager.image_url} style={this.styles.avatar} />
                            </div>
                            <div className="col-xs">
                                <div className="content__header--primary">{manager.full_name}</div>
                                <div className="content__header--secondary">{manager.title}</div>
                            </div>
                        </div>
                        <div className="row  profile-row">
                            <div className="col-xs-1">
                                <Avatar className="content--center--h content--center--v" style={this.styles.avatar}>{team.name.substr(0, 1)}</Avatar>
                            </div>
                            <div className="col-xs">
                                <div className="content__header--primary">{team.name}</div>
                                <div className="content__header--secondary">{team.department}</div>
                            </div>
                        </div>
                        <div className="row">
                            <h3 className="col-xs">Location</h3>
                        </div>
                        <div className="row  profile-row">
                            <div className="col-xs-1">
                                <Avatar src={location.image_url} style={this.styles.avatar}/>
                            </div>
                            <div className="col-xs">
                                <div className="content__header--primary">{location.name}</div>
                                <div className="content__header--secondary">{`${location.profile_count} people`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ExtendedProfile;
