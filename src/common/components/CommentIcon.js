import React, { PropTypes } from 'react';

const CommentIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40">
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="comment" transform="translate(8.000000, 9.000000)" fill={stroke}>
                    <g id="Group">
                        <path d="M20,20 L16,20 C15.4,20 15,19.6 15,19 C15,18.4 15.4,18 16,18 L20,18 C21.1,18 22,17.1 22,16 L22,4 C22,2.9 21.1,2 20,2 L4,2 C2.9,2 2,2.9 2,4 L2,16 C2,17.1 2.9,18 4,18 L8,18 C8.6,18 9,18.4 9,19 C9,19.6 8.6,20 8,20 L4,20 C1.8,20 0,18.2 0,16 L0,4 C0,1.8 1.8,0 4,0 L20,0 C22.2,0 24,1.8 24,4 L24,16 C24,18.2 22.2,20 20,20 L20,20 Z" id="Shape"></path>
                        <path d="M12,24 C11.7,24 11.5,23.9 11.3,23.7 L7.3,19.7 C6.9,19.3 6.9,18.7 7.3,18.3 C7.7,17.9 8.3,17.9 8.7,18.3 L12,21.6 L15.3,18.3 C15.7,17.9 16.3,17.9 16.7,18.3 C17.1,18.7 17.1,19.3 16.7,19.7 L12.7,23.7 C12.5,23.9 12.3,24 12,24 L12,24 Z" id="Shape"></path>
                        <path d="M18,7 L6,7 C5.4,7 5,6.6 5,6 C5,5.4 5.4,5 6,5 L18,5 C18.6,5 19,5.4 19,6 C19,6.6 18.6,7 18,7 L18,7 Z" id="Shape"></path>
                        <path d="M13,11 L6,11 C5.4,11 5,10.6 5,10 C5,9.4 5.4,9 6,9 L13,9 C13.6,9 14,9.4 14,10 C14,10.6 13.6,11 13,11 L13,11 Z" id="Shape"></path>
                        <path d="M16,15 L6,15 C5.4,15 5,14.6 5,14 C5,13.4 5.4,13 6,13 L16,13 C16.6,13 17,13.4 17,14 C17,14.6 16.6,15 16,15 L16,15 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
}

CommentIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
CommentIcon.defaultProps = {
    height: 24,
    stroke: '#000000',
    strokeWidth: 2,
    width: 24,
};

export default CommentIcon;
