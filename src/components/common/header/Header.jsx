import React, { useState } from 'react';
import { CommandBar } from '@fluentui/react';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    backgroundColor: '#0078d4',
    color: '#ffffff',
    height: 48,
    transition: 'background-color 0.3s',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: '#ffffff',
    marginLeft: 20,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  darkModeButton: {
    cursor: 'pointer',
    color: '#ffffff',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '16px',
    marginLeft: '20px',
  },
  darkModeHeader: {
    backgroundColor: '#333333',
    color: '#ffffff',
  },
  mobileMenu: {
    display: 'none',
  },
  '@media (max-width: 768px)': {
    nav: {
      display: 'none',
    },
    mobileMenu: {
      display: 'block',
    },
  },
});

/*
 ** Header component with dark mode
 */
const Header = () => {
  const classes = useStyles();
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    {
      key: 'tasks',
      text: 'Tasks',
      onClick: () => console.log("Tasks"),
    },
    {
      key: 'calendar',
      text: 'Calendar',
      onClick: () => console.log("Calendar"),
    }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header
      className={`${classes.header} ${darkMode ? classes.darkModeHeader : ''}`}
    >
      <div>
        Task Manager 
      </div>
      <CommandBar items={menuItems} className={classes.nav} />
      <button
        className={classes.darkModeButton}
        onClick={toggleDarkMode}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className={classes.mobileMenu}>
        <button>Menu</button>
      </div>
    </header>
  );
};

export default Header;