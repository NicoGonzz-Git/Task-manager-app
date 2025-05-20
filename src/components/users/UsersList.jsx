import React, { useEffect, useState } from 'react';
import userService from '../../services/getUsers';
import {
  makeStyles,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Title3,
  Spinner,
  Input,
  Dropdown,
  Option,
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import { Delete24Regular } from '@fluentui/react-icons';
import { useLocation } from 'react-router-dom';

/**
 * Styles of the component
 */
const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
    padding: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
  card: {
    padding: '16px',
  },
  title: {
    marginBottom: '8px',
  },
  filterContainer: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    minWidth: '300px',
  },
  dropdown: {
    minWidth: '200px',
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    gridColumn: '1 / -1',
  }
});

const UserList = () => {
  const styles = useStyles();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterBy, setFilterBy] = useState('name');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const query = new URLSearchParams(useLocation().search)
  const search = query.get('search') || ''; 

  /**
   * Load users data
   */
  useEffect(() => {
    userService.getUsers()
      .then(res => {
        const processedUsers = res.data.data.map(user => {
          const nameParts = user.name.split(' ');
          return {
            ...user,
            firstName: nameParts[0],
            lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
          };
        });
        setAllUsers(processedUsers);
        setFilteredUsers(processedUsers);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Handle URL search parameter
   */
  useEffect(() => {
    if (search && allUsers.length > 0) {
      setSearchTerm(search);
      
      const term = search.toLowerCase();
      
      const filtered = allUsers.filter(user => {
        if (filterBy === 'name') {
          return user.name.toLowerCase().includes(term);
        } else if (filterBy === 'email') {
          return user.email.toLowerCase().includes(term);
        }
        return false;
      });
      
      setFilteredUsers(filtered);
    }
  }, [search, allUsers, filterBy]);

  /**
   * Filter users based on search term
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(allUsers);
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    const filtered = allUsers.filter(user => {
      if (filterBy === 'name') {
        return user.name.toLowerCase().includes(term);
      } else if (filterBy === 'email') {
        return user.email.toLowerCase().includes(term);
      }
      return false;
    });

    setFilteredUsers(filtered);

    const newSuggestions = allUsers
      .map(user => {
        if (filterBy === 'name') return user.name;
        if (filterBy === 'email') return user.email;
        return '';
      })
      .filter((value, index, self) => 
        value.toLowerCase().includes(term) && self.indexOf(value) === index
      )
      .slice(0, 5);

    setSuggestions(newSuggestions);
  }, [searchTerm, allUsers, filterBy]);

  /**
   * Handle the changes in the input search
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  /**
   * Handle the visual suggestion of the previus input
   */
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);
    
    const filtered = allUsers.filter(user => {
      if (filterBy === 'name') {
        return user.name.toLowerCase() === suggestion.toLowerCase();
      } else if (filterBy === 'firstName') {
        return user.firstName.toLowerCase() === suggestion.toLowerCase();
      } else if (filterBy === 'email') {
        return user.email.toLowerCase() === suggestion.toLowerCase();
      }
      return false;
    });
    
    setFilteredUsers(filtered);
  };

  /**
   * Validate the type change like email
   */
  const handleFilterChange = (_, data) => {
    setFilterBy(data.selectedOptions[0]);
    setSearchTerm('');
    setFilteredUsers(allUsers);
  };

  /**
   * Handle the user delet method
   */
  const handleDelete = async (id) => {
    try {
      await userService.deleteUsers(id);
      setAllUsers(prev => prev.filter(user => user.id !== id));
      setFilteredUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  /**
   * Validate if the data was loaded
   */
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spinner label="Loading users..." />
      </div>
    );
  }

  return (
    <>
      <div className={styles.filterContainer}>
        <Dropdown 
          className={styles.dropdown}
          value={filterBy}
          onOptionSelect={handleFilterChange}
        >
          <Option value="name">Full Name</Option>
          <Option value="email">Email</Option>
        </Dropdown>
        
        <div style={{ position: 'relative' }}>
          <Input
            className={styles.searchInput}
            placeholder={`Filter by ${filterBy === 'name' ? 'full name' : 'Email'}`}
            value={searchTerm}
            onChange={handleSearchChange}
            contentBefore={<Search24Regular />}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedSuggestion === suggestion ? '#f0f0f0' : 'transparent',
                    borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none'
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.container}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <Card key={user.id} className={styles.card}>
              <CardHeader
                header={<Title3>{user.name}</Title3>}
                body={<Title3>{user.description}</Title3>}
                action={
                <Button
                  icon={<Delete24Regular />}
                  appearance="subtle"
                  aria-label="Delete task"
                    onClick={() => {
                      setUserToDelete(user.id);
                      setShowConfirmDialog(true);
                    }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                />}
              />
                <CardPreview>
                  <Text>Email: {user.email}</Text>
                    <br />
                  <Text>ID: {user.id}</Text>
                </CardPreview>
            </Card> 
          ))
        ) : (
          <div className={styles.noResults}>
            <Text size="large">No user data found </Text>
          </div>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={(_, data) => setShowConfirmDialog(data.open)}>
        <DialogSurface>
          <DialogTitle>Confirm delete</DialogTitle>
            <DialogBody>
            Are you sure you want to delete this user?
            </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={() => setShowConfirmDialog(false)}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={() => {
            handleDelete(userToDelete);
            setShowConfirmDialog(false);
            }}>
            Delete
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
    </>
  );
};

export default UserList;