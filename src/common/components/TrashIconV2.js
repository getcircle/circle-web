import React, { PropTypes } from 'react';

const TrashIconV2 = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="icon-slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="trash" transform="translate(9.000000, 9.000000)" fill={stroke}>
                    <g id="Layer_1">
                        <path d="M20.8121247,4.38095238 L16.4306248,4.38095238 L16.4306248,3.28571429 C16.4306248,1.47035714 14.9600838,0 13.1444998,0 L8.76299987,0 C6.94741583,0 5.47687492,1.47035714 5.47687492,3.28571429 L5.47687492,4.38095238 L1.09537498,4.38095238 C0.490454149,4.38095238 0,4.87134524 0,5.47619048 C0,6.08103571 0.490454149,6.57142857 1.09537498,6.57142857 L2.19074997,6.57142857 L2.19074997,19.7142857 C2.19074997,21.5296429 3.66129088,23 5.47687492,23 L16.4306248,23 C18.2462088,23 19.7167497,21.5296429 19.7167497,19.7142857 L19.7167497,6.57142857 L20.8121247,6.57142857 C21.4170455,6.57142857 21.9074997,6.08103571 21.9074997,5.47619048 C21.9074997,4.87134524 21.4170455,4.38095238 20.8121247,4.38095238 L20.8121247,4.38095238 Z M7.66762488,3.28571429 C7.66762488,2.68059524 8.15780519,2.19047619 8.76299987,2.19047619 L13.1444998,2.19047619 C13.7496945,2.19047619 14.2398748,2.68059524 14.2398748,3.28571429 L14.2398748,4.38095238 L7.66762488,4.38095238 L7.66762488,3.28571429 L7.66762488,3.28571429 Z M17.5259997,19.7142857 C17.5259997,20.3194048 17.0358194,20.8095238 16.4306248,20.8095238 L5.47687492,20.8095238 C4.87168024,20.8095238 4.38149993,20.3194048 4.38149993,19.7142857 L4.38149993,6.57142857 L17.5259997,6.57142857 L17.5259997,19.7142857 L17.5259997,19.7142857 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
}

TrashIconV2.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
TrashIconV2.defaultProps = {
    height: 24,
    stroke: '#000000',
    strokeWidth: 2,
    width: 24,
};

export default TrashIconV2;
