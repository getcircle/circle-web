
/**
 * Return the paginator from the request or response.
 *
 * @param {soa.ServiceRequestV1,soa.ServiceResponseV1} requestOrResponse
 *      request or response instance. These have the same control api.
 *
 * @returns {soa.PaginatorV1} paginator
 */
export function getPaginator(requestOrResponse) {
    const control = getFirstControl(requestOrResponse);
    return control.paginator;
}

/**
 * Return the first action ctonrol from the request or response.
 *
 * @param {soa.ServiceRequestV1,soa.ServiceResponseV1} requestOrResponse
 *      request or response instance. These have the same control api.
 *
 * @returns {soa.ActionControlV1} action control
 */
export function getFirstControl(requestOrResponse) {
    return requestOrResponse.actions[0].control;
}

/**
 * Returns the next request if any.
 *
 * @param {soa.ServiceRequestV1} request request instance
 * @param {soa.ServiceResponseV1} response response instance
 *
 * @returns {soa.ServiceRequestV1} new request or null
 */
export function getNextRequest(request, response) {
    const nextRequest = request.$type.decode(request.encode());
    const currentPaginator = getPaginator(response);

    const nextAction = nextRequest.actions[0];

    if (!currentPaginator || currentPaginator.next_page === null) {
        return null;
    }

    let paginatorData = Object.assign({}, nextAction.control.paginator);
    /*eslint-disable new-cap*/
    nextAction.control.paginator = new currentPaginator.$type.clazz(paginatorData);
    /*eslint-enable new-cap*/
    nextAction.control.paginator.page = currentPaginator.next_page;
    /*eslint-disable camelcase*/
    nextAction.control.paginator.previous_page = currentPaginator.page;
    nextAction.control.paginator.total_pages = currentPaginator.total_pages;
    nextAction.control.paginator.page_size = currentPaginator.page_size;
    /*eslint-enable camelcase*/
    nextAction.control.paginator.count = currentPaginator.count;

    return nextRequest;
}
