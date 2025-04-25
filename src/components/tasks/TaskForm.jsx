import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Button, 
  Input, 
  Textarea, 
  Dropdown, 
  Option
} from '@fluentui/react-components';
import { addTask, updateTask } from '../../redux/slices/taskSlice';

const TaskForm = ({ initialTask = null, selectedDate = new Date(), onClose }) => {
  const dispatch = useDispatch();
  
  const [task, setTask] = useState(initialTask || {
    title: '',
    date: selectedDate,
    color: 'blue',
    description: ''
  });

  const colorOptions = [
    { key: 'red', text: 'Red', value: 'red' },
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'green', text: 'Green', value: 'green' },
    { key: 'purple', text: 'Purple', value: 'purple' },
    { key: 'orange', text: 'Orange', value: 'orange' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.id) {
      dispatch(updateTask(task));
    } else {
      dispatch(addTask(task));
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleColorChange = (e, data) => {
    setTask(prevTask => ({
      ...prevTask,
      color: data.selectedOptions[0]
    }));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setTask(prevTask => ({
      ...prevTask,
      date: newDate
    }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Task title"
        required
      />
      
      <Input
        type="date"
        name="date"
        value={formatDate(task.date)}
        onChange={handleDateChange}
        required
      />
      
      <Dropdown
        placeholder="Select a color"
        value={task.color}
        onOptionSelect={handleColorChange}
      >
        {colorOptions.map(option => (
          <Option key={option.key} value={option.value}>
            {option.text}
          </Option>
        ))}
      </Dropdown>
      
      <Textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description of the task"
        rows={3}
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button appearance="subtle" onClick={onClose}>Cancel</Button>
        <Button appearance="primary" type="submit">
          {task.id ? 'Update' : 'Add'} Task
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;