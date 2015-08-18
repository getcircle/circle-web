import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';
import { services } from 'protobufs';

import StyleableComponent from './StyleableComponent';

const styles = {};

@decorate(Navigation)
class TeamDetail extends StyleableComponent {

    static propTypes = {
        dispatch: React.PropTypes.func.isRequired,
    }

}

export default TeamDetail;