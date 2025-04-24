import React from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  footer: {
    paddingTop: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalL,
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
});

const Footer = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Text>{currentYear} TaskManager - All rights reserved.</Text>
    </footer>
  );
};

export default Footer;