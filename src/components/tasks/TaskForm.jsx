import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Input,
  Textarea,
  Dropdown,
  Option,
  Text,
  Spinner,
  Tooltip
} from '@fluentui/react-components';
import { addTask, updateTask } from '../../redux/slices/taskSlice';
import { getUsers } from '../../services/getUsers';

const TaskForm = ({ initialTask = null, selectedDate = new Date(), onClose }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState(initialTask || {
    title: '',
    date: selectedDate,
    color: 'blue',
    description: '',
    userId: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorTooltip, setShowColorTooltip] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const colorRef = useRef(null);
  
  const colorOptions = [
    { key: 'red', text: 'Red', value: 'red' },
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'green', text: 'Green', value: 'green' },
    { key: 'purple', text: 'Purple', value: 'purple' },
    { key: 'orange', text: 'Orange', value: 'orange' }
  ];

  useEffect(() => {
    setLoadingUsers(true);
    getUsers()
      .then(res => {
        setUsers(res.data.slice(0, 10)); 
      })
      .catch(err => {
        console.error('Error loading users:', err);
        setErrorMessage('Failed to load users');
      })
      .finally(() => setLoadingUsers(false));
  }, []);
  
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
      
      setTask({ title: '', date: new Date(), color: 'blue', description: '', userId: '' });
      
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
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

  const handleUserChange = (e, data) => {
    setTask(prevTask => ({
      ...prevTask,
      userId: data.selectedOptions[0]
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
  
  const colorTooltipContent = (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Color Meanings:</div>
      <ul style={{ margin: '0', padding: '0 0 0 20px' }}>
        <li>Red: High Priority tasks that need immediate attention</li>
        <li>Blue: Normal Priority tasks for regular scheduling</li>
        <li>Green: Completed tasks</li>
        <li>Purple: Tasks currently in progress</li>
        <li>Orange: Tasks that require attention or follow-up</li>
      </ul>
    </div>
  );
  
  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div>
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
        
        <Tooltip
          content={colorTooltipContent}
          relationship="description"
          visible={showColorTooltip}
        >
          <div 
            ref={colorRef} 
            onMouseEnter={() => setShowColorTooltip(true)}
            onMouseLeave={() => setShowColorTooltip(false)}
          >
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
          </div>
        </Tooltip>

        <Dropdown
          placeholder={loadingUsers ? "Loading users..." : "Assign to user"}
          disabled={loadingUsers}
          value={task.userId}
          selectedOptions={task.userId ? [task.userId] : []}
          onOptionSelect={handleUserChange}
        >
          {users.map(user => (
            <Option key={user.id} value={user.id.toString()}>
              {user.name}
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
          <Button 
            appearance="subtle" 
            onClick={handleCancel} 
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
          <Button appearance="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="tiny" /> : task.id ? 'Update' : 'Add'} Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm