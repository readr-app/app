
import React, { PropTypes } from 'react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

const TimeAgo = ({ timestamp }) => {
    const datetime = (new Date(timestamp)).toISOString();
    return (<time dateTime={datetime}>
        {distanceInWordsToNow(timestamp)}
    </time>);
};

TimeAgo.propTypes = {
    timestamp: PropTypes.number.isRequired,
};

export default TimeAgo;
