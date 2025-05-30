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
import userService from '../../services/getUsers';
import { updateTaskAsync, createTaskAsync, fetchTasks } from '../../redux/slices/taskSlice';

const TaskForm = ({ initialTask = null, selectedDate = new Date(), onClose }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState(initialTask || {
    title: '',
    date: selectedDate,
    color: 'red',
    description: '',
    userId: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorTooltip, setShowColorTooltip] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [canSelectUsers, setCanSelectusers ] = useState(true);
  
  const colorRef = useRef(null);
  
  const colorOptions = [
    { key: 'red', text: 'Red', value: 'red' },
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'green', text: 'Green', value: 'green' },
    { key: 'purple', text: 'Purple', value: 'purple' },
    { key: 'orange', text: 'Orange', value: 'orange' }
  ];

  /**
   * Load users data
   */
  useEffect(() => {
    setLoadingUsers(true);
    userService.getUsers()
      .then(res => {
        setUsers(res.data.data.slice(0, 10)); 
        setCanSelectusers(true)
      })
      .catch(err => {
        console.error('Error loading users:', err);
        if(err.response && err.response.status === 403){
          setCanSelectusers(false);
        }
      })
      .finally(() => setLoadingUsers(false));
  }, []);
  
  /**
   * Validations of the input title
   */
  const validateTitle = (title) => {
    if (!title) return 'Task title is required';
    if (title.length < 4) return 'Task title must be at least 4 characters long';
    if (/[^a-zA-Z0-9 ]/.test(title)) return 'Task title cannot contain special characters';
    return '';
  };

  /**
   * Validations of the input description
   */
  const validateDescription = (description) => {
    if (!description) return 'Description title is required';
    if (description.length < 10) return 'Description must be at least 10 characters long';
    return '';
  };

  /**
   * Validations of the select date
   */
  const validateDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dateToCompare = typeof date === 'string' ? new Date(date) : date;
  
  const dateWithoutTime = new Date(dateToCompare);
  dateWithoutTime.setHours(0, 0, 0, 0);
  
  if (dateWithoutTime < today) {
    return 'Date must be today or later';
  }
  return '';
 }
  
  /**
   * Handle the submit logic of the form
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    const title = task.title.trim();
    const validationError = validateTitle(title);
    const dateValidationError = validateDate(task.date);

    if (validationError || dateValidationError) {
      setErrorMessage(validationError);
      if(dateValidationError) setDateError(dateValidationError);
      setIsSubmitting(false);
      return;
    }
    const taskDate = new Date(task.date)
    try {
      const taskToSave = {
        title: task.title,
        description: task.description,
        assignedUserId: task.userId,
        createdDate: taskDate,
        role: task.role || 'user',
        priority: task.color
      };
      
     if (task.id) {
      dispatch(updateTaskAsync({ id: task.id, data: taskToSave }))
      .unwrap()
      .then(() => {
        setSuccessMessage('');
        dispatch(fetchTasks());
      })
      .then(() => {
        setSuccessMessage('Task updated successfully');
      })
      .catch((err) => {
        setErrorMessage('Error updating task: ' + err);
      });
  } else {
      dispatch(createTaskAsync(taskToSave))
      .unwrap()
    .then(() => {
      setSuccessMessage('Task added successfully');
      dispatch(fetchTasks());
      setTask({ title: '', date: new Date(), color: '', description: '', userId: '', role: 'user' });
      setTitleError('');
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
    })
    .catch((error) => {
      setErrorMessage('There was an error saving the task: ' + error);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  }
      setTask({ title: '', date: new Date(), color: '', description: '', userId: '', role: 'user' });
      setTitleError('');
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
    } catch (err) {
      setErrorMessage('There was an error saving the task' + err);
    } finally {
      setIsSubmitting(false);
    }
    
  };
  
  /**
   * Handle the input change characters of the title
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));

    if (name === 'title'){
      const validationError = validateTitle(value.trim());
      setTitleError(validationError);
    }
  };
  
  /**
   * Change the color of tasks
   */
  const handleColorChange = (e, data) => {
    setTask(prevTask => ({
      ...prevTask,
      color: data.selectedOptions[0]
    }));
  };

  /**
   * Handle the input change characters of the title
   */
  const handleUserChange = (e, data) => {
    setTask(prevTask => ({
      ...prevTask,
      userId: data.selectedOptions[0]
    }));
  };
  
  /**
   * Handle the input change from the Date selector
   */
  const handleDateChange = (e) => {
  try {
    const dateValue = e.target.value;
    
    const newDate = new Date(dateValue + 'T00:00:00');
    
    if (isNaN(newDate.getTime())) {
      console.error('Invalid date input:', dateValue);
      setDateError('Invalid date format');
      return;
    }
    
    setTask(prevTask => ({
      ...prevTask,
      date: newDate.toISOString()
    }));
    
    const validationError = validateDate(newDate);
    setDateError(validationError);
  } catch (error) {
    console.error('Error processing date:', error);
    setDateError('Error processing date');
  }
  };

  /**
   * Date of the input displayer
   */
  const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
  };
  
  /**
   * Color ToolTip of each meaning
   */
  const colorTooltipContent = (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Color Meanings:</div>
      <ul style={{ margin: '0', padding: '0 0 0 20px' }}>
        <li>Red: High PrioriTY</li>
        <li>Blue: Normal Priority</li>
        <li>Green: Completed tasks</li>
        <li>Purple: Tasks in progress</li>
        <li>Orange: Next tasks</li>
      </ul>
    </div>
  );

  /**
   * Handle the cancel form button
   */  
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task title"
            required
            style={{
              borderColor: titleError ? 'red' : undefined,
              backgroundColor: titleError ? '#ffe5e5' : undefined
            }}
          />
          {titleError && <Text style={{ color: 'red', fontSize: '0.8rem' }}>{titleError}</Text>}
        </div>
        
        <Input
          type="date"
          name="date"
          value= {formatDateForInput(task.date)}
          onChange={handleDateChange}
          required
        />
        {dateError && <Text style={{color: 'red'}}>{dateError}</Text>}
        
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

        {canSelectUsers ? (
          <div>
            <Text as="label" htmlFor="user-select">Assign to:</Text>
            <Dropdown
            id="user-select"
            placeholder="Select a user"
            value={task.userId}
            selectedOptions={task.userId ? [task.userId] : []}
            onOptionSelect={handleUserChange}
            disabled={loadingUsers}
            >
              {loadingUsers ? (
            <Option>Loading users...</Option>
            ) : (
            users.map(user => (
            <Option key={user.id} value={user.id}>
              {user.name || user.email}
            </Option>
              ))
            )}
           </Dropdown>
          </div>
        ) : null}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Textarea
          name="description"
          value={task.description}
          onChange={(e) => {
            const value = e.target.value;
            setTask(prevTask => ({ ...prevTask, description: value }));
            const validationError = validateDescription(value);
            setDescriptionError(validationError);
          }}
          placeholder="Description of the task"
          rows={3}
          style={{
            borderColor: descriptionError ? 'red' : undefined,
            backgroundColor: descriptionError ? '#ffe5e5' : undefined
          }}
        />
        {descriptionError && (
          <Text style={{ color: 'red', fontSize: '0.8rem' }}>{descriptionError}</Text>
        )}
      </div>
        
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button  appearance="subtle" onClick={handleCancel} disabled={isSubmitting} type="button">
            Cancel
          </Button>
          
          <Button appearance="primary"  type="submit" disabled={
            isSubmitting || titleError !== '' || descriptionError !== '' || dateError !== '' || task.title.trim() === '' || 
            task.description.trim() === ''}   
          >
            {isSubmitting ? <Spinner size="tiny" /> : task.id ? 'Update' : 'Add'} Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm