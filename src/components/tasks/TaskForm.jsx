import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Input,
  Textarea,
  Dropdown,
  Option,
  Text,
  Spinner
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

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { key: 'red', text: 'Red', value: 'red' },
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'green', text: 'Green', value: 'green' },
    { key: 'purple', text: 'Purple', value: 'purple' },
    { key: 'orange', text: 'Orange', value: 'orange' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!task.title.trim()) {
      setErrorMessage('Title is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (task.id) {
        dispatch(updateTask(task));
        setSuccessMessage('Task updated successfully');
      } else {
        dispatch(addTask(task));
        setSuccessMessage('Task added successfully');
      }

      setTask({ title: '', date: new Date(), color: 'blue', description: '' });
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setErrorMessage('There was an error saving the task');
    } finally {
      setIsSubmitting(false);
    }
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
        selectedOptions={[task.color]}
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

      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button appearance="subtle" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button appearance="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="tiny" /> : task.id ? 'Update' : 'Add'} Task
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;