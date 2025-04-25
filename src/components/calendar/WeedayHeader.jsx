import React from 'react';
import { Text } from '@fluentui/react-components';

const WeekdayHeader = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '0.25rem', 
            marginBottom: '0.25rem' 
        }}>
            {weekdays.map((day, index) => (
                <Text key={index} align="center" weight="medium">
                    {day}
                </Text>
            ))}
        </div>
    );
};

export default WeekdayHeader;