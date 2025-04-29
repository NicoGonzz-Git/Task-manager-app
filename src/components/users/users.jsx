import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/getUsers';
import {
  makeStyles,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Title3,
  Spinner
} from '@fluentui/react-components';

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
  }
});

const UserList = () => {
  const styles = useStyles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(res => {
        setUsers(res.data.slice(0, 10));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spinner label="Loading users..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {users.map(user => (
        <Card key={user.id} className={styles.card}>
          <CardHeader
            header={<Title3>{user.name}</Title3>}
            description={`@${user.username}`}
          />
          <CardPreview>
            <Text>Email: {user.email}</Text>
          </CardPreview>
        </Card>
      ))}
    </div>
  );
};

export default UserList;