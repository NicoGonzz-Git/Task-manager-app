import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../../services/getUsers';
import {
  makeStyles,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Title3,
  Spinner,
} from '@fluentui/react-components';

 /**
  * Styles of the component
  */
 const useStyles = makeStyles({
  container: {
    padding: '32px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '300px',
    padding: '16px',
  }
 });

 const UserDetails = () => {
  const styles = useStyles();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Search the user according to the id
   */
  useEffect(() => {
    userService.getUsers()
      .then(res => {
        const foundUser = res.data.data.find(u => u.id.toString() === userId);
        setUser(foundUser);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  /**
   * Validate if the data was loaded
   */
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spinner label="Loading user..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text>User not found.</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={<Title3>{user.name}</Title3>}
        />
        <CardPreview>
          <Text>Email: {user.email}</Text>
        </CardPreview>
      </Card>
    </div>
  );
 };

export default UserDetails;