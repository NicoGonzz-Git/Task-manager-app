import React from 'react';
import { Text } from '@fluentui/react-components';

const CalendarHeader = ({ currentMonth }) => {
    const monthNames = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];

    return (
        <Text size={600} weight="semibold">
            {monthNames[currentMonth.getMonth()]} DE {currentMonth.getFullYear()}
        </Text>
    );
};

export default CalendarHeader;