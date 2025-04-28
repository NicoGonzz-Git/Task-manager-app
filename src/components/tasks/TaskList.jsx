import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  Card,
  CardHeader,
  CardFooter,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { selectAllTasks } from '../../redux/slices/taskSlice';
import { getUsers } from '../../services/getUsers';

const useStyles = makeStyles({
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '0.75rem',
  },
  taskCard: {
    transition: 'transform 0.1s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  },
  cardHeader: {
    padding: '0.5rem',
  },
  taskContent: {
    padding: '0.75rem',
  },
  cardFooter: {
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noTasks: {
    textAlign: 'center',
    padding: '2rem',
    color: tokens.colorNeutralForeground2,
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  userAvatar: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.75rem',
  }
});

const TaskList = () => {
  const styles = useStyles();
  const tasks = useSelector(selectAllTasks);
  const [users, setUsers] = useState({});

  useEffect(() => {
    getUsers()
      .then(res => {
        const userMap = {};
        res.data.forEach(user => {
          userMap[user.id] = user;
        });
        setUsers(userMap);
      })
      .catch(err => console.error('Error loading users:', err))
  }, []);

  if (tasks.length === 0) {
    return (
      <div className={styles.taskList}>
        <Text className={styles.noTasks}>No tasks scheduled</Text>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className={styles.taskList}>
      <Text as="h2" weight="semibold" size={6}>Upcoming Tasks</Text>
      {tasks.map(task => (
        <Card key={task.id} className={styles.taskCard}>
          <CardHeader
            className={styles.cardHeader}
            style={{ backgroundColor: task.color }}
            header={<Text weight="semibold" style={{ color: 'white' }}>{task.title}</Text>}
          />
          <div className={styles.taskContent}>
            Task Description: <Text>{task.description}</Text>
          </div>
          <CardFooter className={styles.cardFooter}>
            <Text>{formatDate(task.date)}</Text>
            {task.userId && users[task.userId] && (
              <div className={styles.assignedUser}>
                <div className={styles.userAvatar}>
                  {getUserInitials(users[task.userId].name)}
                </div>
                <Text size={1}>{users[task.userId].name}</Text>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;