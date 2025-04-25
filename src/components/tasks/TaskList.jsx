import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTasks, deleteTask } from '../../redux/slices/taskSlice';
import {
  Card,
  CardHeader,
  Text,
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
} from '@fluentui/react-components';
import TaskForm from './TaskForm';

const TaskList = () => {
  const tasks = useSelector(selectTasks);
  const dispatch = useDispatch();
  const [editTask, setEditTask] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsDialogOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <Text size={600} weight="semibold" style={{ marginBottom: '1rem' }}>
        List of tasks
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader
              header={<Text weight="semibold" size={400}>{task.title}</Text>}
              description={formatDate(task.date)}
              action={
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button appearance="subtle" onClick={() => handleEdit(task)}>Update</Button>
                  <Button appearance="subtle" onClick={() => handleDelete(task.id)}>Delete</Button>
                </div>
              }
            />
            <div style={{ padding: '0.5rem 1rem 1rem' }}>
              <Text>{task.description}</Text>
              <div
                style={{
                  height: '0.5rem',
                  width: '3rem',
                  backgroundColor: task.color,
                  borderRadius: '0.25rem',
                  marginTop: '0.5rem',
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Text align="center" style={{ marginTop: '1rem' }}>
          There are no tasks
        </Text>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Update task</DialogTitle>
            <DialogContent>
              <TaskForm
                initialTask={editTask}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default TaskList;