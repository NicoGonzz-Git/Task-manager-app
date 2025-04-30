import React from 'react';
import DayCell from './DayCell';

const CalendarGrid = ({ currentMonth, highlightedDate }) => {
    /**
     * Bring the days of each Month 
     */
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        const startOffset = firstDay.getDay();

        for (let i = 0; i < startOffset; i++) {
            days.push(new Date(year, month, -startOffset + i + 1));
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        const daysNeeded = 42 - days.length;
        for (let i = 1; i <= daysNeeded; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    };

    /**
     * Highlight the current day 
     */
    const isHighlighted = (date) =>
        date.getDate() === highlightedDate.getDate() &&
        date.getMonth() === highlightedDate.getMonth() &&
        date.getFullYear() === highlightedDate.getFullYear();

    const hasMarkers = (date) =>
        date.getDate() === 24 && date.getMonth() === 3 && date.getFullYear() === 2025;

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '0.25rem',
                padding: '0.5rem'
            }}
        >
            {getDaysInMonth(currentMonth).map((date, index) => (
                <DayCell
                    key={index}
                    date={date}
                    currentMonth={currentMonth}
                    isHighlighted={isHighlighted(date)}
                    hasMarkers={hasMarkers(date)}
                />
            ))}
        </div>
    );
};

export default CalendarGrid;