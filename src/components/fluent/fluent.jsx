import * as React from 'react';
import { Button, makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('16px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
});

const FluentDemo = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Button appearance="primary">Botón Fluent Primary</Button>
      <Button appearance="outline">Botón Fluent Outline</Button>
      <Button appearance="subtle">Botón Fluent Subtle</Button>
    </div>
  );
};

export default FluentDemo;