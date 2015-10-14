import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getStatus } from '../actions/status';
import { resetScroll } from '../utils/window';
import { retrieveStatus } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import StatusDetail from '../components/StatusDetail';
import PureComponent from '../components/PureComponent';

const statusSelector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.statusesSelector,
        selectors.routerParametersSelector,
    ],
    (cacheState, statusesState, paramsState) => {
        let status;
        const statusId = paramsState.statusId;
        const cache = cacheState.toJS();
        if (statusesState.get('ids').has(statusId)) {
            status = retrieveStatus(statusId, cache);
        }

        return {
            status,
            statusId,
        };
    }
);

const selector = selectors.createImmutableSelector(
    [statusSelector, selectors.responsiveSelector],
    (statusState, responsiveState) => {
        return {
            largerDevice: responsiveState.get('largerDevice'),
            mobileOS: responsiveState.get('mobileOS'),
            ...statusState
        }
    }
);

@connect(selector)
class Status extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        params: PropTypes.shape({
            statusId: PropTypes.string.isRequired,
        }).isRequired,
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
    }

    static childContextTypes = {
        mobileOS: PropTypes.bool.isRequired,
    }

    getChildContext() {
        return {
            mobileOS: this.props.mobileOS,
        };
    }

    componentWillMount() {
        this.loadStatus(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.statusId !== this.props.params.statusId) {
            this.loadStatus(nextProps);
        }
    }

    loadStatus(props) {
        this.props.dispatch(getStatus(props.params.statusId));
        resetScroll();
    }

    renderStatus() {
        const {
            status,
            largerDevice,
        } = this.props;
        if (status) {
            return (
                <StatusDetail
                    largerDevice={largerDevice}
                    status={status}
                />
            );
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this.renderStatus()}
            </Container>
        );
    }
}

export default Status;
