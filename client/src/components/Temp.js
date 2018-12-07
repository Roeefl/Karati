import React from 'react';

const getSeason = (lat, month) => {
    if (month > 2 && month < 9) {
        return (lat > 0 ? 'Summer' : 'Winter');
    } else {
        return (lat > 0 ? 'Winter' : 'Summer');
    }
}

const Temp = (props) => {
    const season = getSeason(props.lat, new Date().getMonth());
    const txt = (season == 'Winter' ? 'Winter has come.' : 'Summer is upon us.');
    const icon = (season == 'Winter' ? 'snowflake' : 'sun');

    return (
        <div>
            <i className={`${icon} icon`} />
            <h1>{txt}</h1>
            <i className={`${icon} icon`} />
        </div>
    );
}

export default Temp;