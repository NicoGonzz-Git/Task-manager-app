import React from 'react';
import { Text } from '@fluentui/react-components';

const DayCell = ({ date, currentMonth, isHighlighted, hasMarkers }) => {
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            padding: '0.5rem',
            height: '3rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isHighlighted ? '#dbeafe' : 'transparent',
            color: isCurrentMonth ? '#000' : '#aaa'
        }}>
            <Text align="center">{date.getDate()}</Text>
            {hasMarkers && (
                <div style={{
                    position: 'absolute',
                    bottom: '0.25rem',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <span style={{ height: '0.25rem', width: '0.25rem', borderRadius: '50%', backgroundColor: 'red', margin: '0 1px' }}></span>
                    <span style={{ height: '0.25rem', width: '0.25rem', borderRadius: '50%', backgroundColor: 'red', margin: '0 1px' }}></span>
                </div>
            )}
        </div>
    );
};

export default DayCell;