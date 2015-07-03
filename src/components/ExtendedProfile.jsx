'use strict';

import mui from 'material-ui';
import React from 'react';

const { Avatar } = mui;

class ExtendedProfile extends React.Component {

    static propTypes = {
        extendedProfile: React.PropTypes.object.isRequired,
    }

    styles = {

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
            <div>
                <div className="row center-xs">
                    <img src={profile.image_url} />
                </div>
                <div className="row center-xs">
                    <h1>{profile.full_name}</h1>
                </div>
                <div className="row center-xs">
                    <h2>{profile.title}</h2>
                </div>
                <div className="row">
                    <div className="col-xs">
                        {this._renderContactBar()}
                    </div>
                </div>
                <div className="row">
                    <p>{profile.about}</p>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs">
                        <div className="row">
                            <div className="col-xs">
                                <strong>Manager and Team</strong>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-1">
                                <Avatar src={manager.image_url} />
                            </div>
                            <div className="col-xs">
                                <span>{manager.full_name}</span>
                                <span>{manager.title}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-1">
                                <Avatar src={team.image_url} />
                            </div>
                            <div className="col-xs">
                                <span>{team.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs">
                        <div className="row">
                            <div className="col-xs">
                                <strong>Location</strong>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-1">
                                <Avatar src={location.image_url} />
                            </div>
                            <div className="col-xs">
                                <span>{location.name}</span>
                                <span>{`${location.profile_count} people`}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
    }
}

export default ExtendedProfile;
