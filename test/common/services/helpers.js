import expect from 'expect';

import { getNextRequest, getPaginator } from '../../../src/common/services/helpers';

import ServiceRequestFactory from '../../factories/ServiceRequestFactory';
import ServiceResponseFactory from '../../factories/ServiceResponseFactory';

describe('services helpers', () => {

    describe('getPaginator', () => {

        it('returns the paginator object for the request', () => {
            const request = ServiceRequestFactory.getRequest();
            const paginator = getPaginator(request);
            expect(paginator.previous_page).toEqual(1);
        });

    });

    describe('getNextRequest', () => {

        it('returns the next request with the correct pagination data', () => {
            /*eslint-disable camelcase*/
            const request = ServiceRequestFactory.getRequest({previous_page: null, page: 1});
            const response = ServiceResponseFactory.getResponse({previous_page: 1, page: 1, next_page: 2});
            /*eslint-enable camelcase*/
            const nextRequest = getNextRequest(request, response);

            const responsePaginator = getPaginator(response);
            const nextPaginator = getPaginator(nextRequest);
            expect(nextPaginator.page).toEqual(responsePaginator.next_page);
            expect(nextPaginator.previous_page).toEqual(responsePaginator.page);
        });

    });
});
