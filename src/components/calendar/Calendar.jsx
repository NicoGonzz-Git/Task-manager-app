import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
} from '@fluentui/react-components';

import CalendarHeader from './CalendarHeader';
import WeekdayHeader from './WeedayHeader';
import CalendarGrid from './CalendarGrid';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';
import { Provider } from 'react-redux';
import { store } from '../../redux/slices/store';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1));
  const [highlightedDate] = useState(new Date(2025, 3, 24));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <Provider store={store}>
      <div className="calendar-container" style={{ maxWidth: '62rem', margin: '0 auto', padding: '1rem' }}>
        <div
          style={{
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <Button appearance="transparent" onClick={prevMonth} size="medium">
              &lt;
            </Button>
            <CalendarHeader currentMonth={currentMonth} />
            <Button appearance="transparent" onClick={nextMonth} size="medium">
              &gt;
            </Button>
          </div>

          <WeekdayHeader />
          <CalendarGrid currentMonth={currentMonth} highlightedDate={highlightedDate} />

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Button appearance="primary" onClick={() => setIsDialogOpen(true)}>
              Add new Task
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>New task</DialogTitle>
                <DialogContent>
                  <TaskForm
                    selectedDate={new Date()}
                    onClose={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>

        <TaskList />
      </div>
    </Provider>
  );
};

export default Calendar;