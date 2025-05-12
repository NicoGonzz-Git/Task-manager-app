import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  Card,
  CardHeader,
  CardFooter,
  makeStyles,
  tokens,
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Spinner
} from '@fluentui/react-components';
import { Edit24Regular, Delete24Regular } from '@fluentui/react-icons';
import { selectAllTasks, deleteTask } from '../../redux/slices/taskSlice';
import { getUsers } from '../../services/getUsers';
import TaskForm from './TaskForm';
import taskService  from "../../services/taskService";

 /**
  * Styles of the component
  */
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
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    marginLeft: 'auto'
  },
  deleteConfirmWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
 });

const TaskList = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const [users, setUsers] = useState({});
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [taskList, setTaskList] = useState([]);     
  const [loadingTasks, setLoadingTasks] = useState(true); 

  /**
   * Load users data
   */
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

  useEffect(() => {
  taskService.getTasks()
    .then(res => {
      setTaskList(res.data);
      console.log(res)
      setLoadingTasks(false);
    })
    .catch(err => {
      console.error("Error fetching tasks:", err);
      setLoadingTasks(false);
    });
}, []);

  /**
   *  Handle the edit task button logic
   */
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsEditDialogOpen(true);
  };

  /**
   *  Handle the dialog edit closing logic
   */
  const handleCloseEditDialog = () => {
    setTaskToEdit(null);
    setIsEditDialogOpen(false);
  };

  /**
   *  Handle the delete task button logic
   */
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  /**
   *  Manage the delete of the task
   */
  const confirmDeleteTask = () => {
    setIsDeleting(true);
    try {
      dispatch(deleteTask(taskToDelete.id));
      setSuccessMessage('Task deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
        setIsDeleting(false);
      }, 1000);
    } catch (err) {
      console.error('Error deleting task:', err);
      setIsDeleting(false);
    }
  };

  /**
   *  Handle the dialog delete closing logic
   */
  const handleCloseDeleteDialog = () => {
    setTaskToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  /**
   *  Validate if there are tasks
   */
  if (tasks.length === 0) {
    return (
      <div className={styles.taskList}>
        <Text className={styles.noTasks}>No tasks scheduled</Text>
      </div>
    );
  }

  /**
   *  Give an especific format to the date
   */
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   *  Bring the first letters of the name
   */
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
            <div>
              <Text>{formatDate(task.date)}</Text>
            </div>
            <div className={styles.cardActions}>
              <Button 
                icon={<Edit24Regular />} 
                appearance="subtle" 
                aria-label="Edit task"
                onClick={() => handleEditTask(task)}
              />
              <Button 
                icon={<Delete24Regular />} 
                appearance="subtle" 
                aria-label="Delete task"
                onClick={() => handleDeleteTask(task)}
              />
            </div>
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

      <Dialog open={isEditDialogOpen} onOpenChange={(e, data) => !data.open && handleCloseEditDialog()}>
        <DialogSurface>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            {taskToEdit && (
              <TaskForm 
                initialTask={taskToEdit} 
                onClose={handleCloseEditDialog}
              />
            )}
          </DialogContent>
        </DialogSurface>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={(e, data) => !data.open && handleCloseDeleteDialog()}>
        <DialogSurface>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogBody>
            <DialogContent>
              Are you sure you want to delete the task "{taskToDelete?.title}"?
              {successMessage && <Text style={{ color: 'green', marginTop: '1rem' }}>{successMessage}</Text>}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={handleCloseDeleteDialog} disabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                appearance="primary" 
                style={{ backgroundColor: 'red' }}
                onClick={confirmDeleteTask} 
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner size="tiny" /> : 'Delete'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default TaskList;