import React, { useState } from 'react';
import { Button } from '@fluentui/react-components';
import CalendarHeader from './CalendarHeader';
import WeekdayHeader from './WeedayHeader';
import CalendarGrid from './CalendarGrid';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1));
    const [highlightedDate] = useState(new Date(2025, 3, 24));

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
        <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '1rem', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Button appearance="transparent" onClick={prevMonth} size="medium">&lt;</Button>
                <CalendarHeader currentMonth={currentMonth} />
                <Button appearance="transparent" onClick={nextMonth} size="medium">&gt;</Button>
            </div>
            <WeekdayHeader />
            <CalendarGrid currentMonth={currentMonth} highlightedDate={highlightedDate} />
        </div>
    );
};

export default Calendar;