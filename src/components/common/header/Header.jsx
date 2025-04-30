import React, { useState } from 'react';
import { makeStyles, shorthands, tokens, Button, Toolbar, ToolbarButton } from '@fluentui/react-components';
import { CalendarMonthRegular, Person24Regular, WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

 /**
  * Styles of the component
  */
 const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    height: '48px',
    ...shorthands.transition('background-color', '0.3s'),
  },
  darkModeHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  darkModeButton: {
    marginLeft: tokens.spacingHorizontalM,
  },
  mobileMenu: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
 });

const Header = () => {
  const classes = useStyles();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  /**
   * Manage the toggle dark mode button
   */
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className={`${classes.header} ${darkMode ? classes.darkModeHeader : ''}`}>
      <div>Task Manager</div>

      <Toolbar className={classes.nav} aria-label="Navigation">
        <ToolbarButton icon={<CalendarMonthRegular />} onClick={() => navigate('/calendar')}>
          Calendar
        </ToolbarButton>
        <ToolbarButton icon={<Person24Regular />} onClick={() => navigate('/users')}>
          Users
        </ToolbarButton>
      </Toolbar>

      <Button 
        appearance="subtle" 
        icon={darkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />} 
        onClick={toggleDarkMode} 
        className={classes.darkModeButton}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>

      <div className={classes.mobileMenu}>
        <Button appearance="subtle">Menu</Button>
      </div>
    </header>
  );
};

export default Header;