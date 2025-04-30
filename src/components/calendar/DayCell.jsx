import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Text, 
  Dialog, 
  DialogSurface, 
  DialogBody, 
  DialogTitle, 
  DialogContent,
  Card,
  CardHeader,
  Badge,
  mergeClasses,
  tokens,
  makeStyles
} from '@fluentui/react-components';
import { selectTasksByDate } from '../../redux/slices/taskSlice';
import TaskForm from '../tasks/TaskForm';

/**
 * Styles of the component
 */
const useStyles = makeStyles({
  dayCell: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    minHeight: '5rem',
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    transition: 'all 0.1s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    }
  },
  currentMonth: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  otherMonth: {
    backgroundColor: tokens.colorNeutralBackground2,
    opacity: 0.7,
  },
  highlighted: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  dateDisplay: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  taskMarkers: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXXS,
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: tokens.spacingVerticalS,
  },
  taskMarker: {
    height: '0.75rem', 
    width: '0.75rem',
    borderRadius: tokens.borderRadiusCircular,
  },
  taskCounter: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    marginLeft: tokens.spacingHorizontalS,
  },
  taskItem: {
    marginBottom: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  taskItemHeader: {
    padding: tokens.spacingHorizontalS,
  },
  taskItemContent: {
    padding: tokens.spacingHorizontalS,
  }
});

/**
 * Cell logic
 */
const DayCell = ({ date, currentMonth, isHighlighted, hasMarkers }) => {
  const styles = useStyles();
  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
  const tasks = useSelector(state => selectTasksByDate(state, date));
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const cellClass = mergeClasses(
    styles.dayCell,
    isCurrentMonth ? styles.currentMonth : styles.otherMonth,
    isHighlighted && styles.highlighted
  );

  /**
   * Handle the dialog logic
   */
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={cellClass} onClick={() => setIsDialogOpen(true)}>
      <Text className={styles.dateDisplay} align="center">
        {date.getDate()}
      </Text>
      
      {tasks.length > 0 && (
        <div className={styles.taskMarkers}>
          {tasks.slice(0, 3).map((task, index) => (
            <Badge 
              key={index}
              className={styles.taskMarker}
              style={{ backgroundColor: task.color }}
              shape="rounded"
              size="small"
              appearance="ghost"
            />
          ))}
          {tasks.length > 3 && (
            <Text className={styles.taskCounter}>+{tasks.length - 3}</Text>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(e, data) => setIsDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              {tasks.length > 0 ? `Tasks for ${date.toLocaleDateString('en-US')}` : `New task for ${date.toLocaleDateString('en-US')}`}
            </DialogTitle>
            <DialogContent>
              {tasks.length > 0 && (
                <div>
                  {tasks.map(task => (
                    <Card key={task.id} className={styles.taskItem}>
                      <CardHeader 
                        className={styles.taskItemHeader}
                        style={{ backgroundColor: task.color }}
                        header={<Text weight="semibold">{task.title}</Text>} 
                      />
                      <Text className={styles.taskItemContent}>{task.description}</Text>
                    </Card>
                  ))}
                </div>
              )}
              <TaskForm selectedDate={date} onClose={handleDialogClose} />
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default DayCell;