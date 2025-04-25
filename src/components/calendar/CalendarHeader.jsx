import React from 'react';
import { Text } from '@fluentui/react-components';

const CalendarHeader = ({ currentMonth }) => {
    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    return (
        <Text size={600} weight="semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
    );
};

export default CalendarHeader;