import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const dummyUsers = [
  {
    id: 'u1',
    name: 'Malkan Shaheen',
    email: 'malkanshaheen45@gmail.com',
    age: 18-25,
    gender: 'FeMale',
    relationship: 'Single',
    livingSituation: 'with Family',
    status: 'Active',
  },
  {
    id: 'u2',
    name: 'Arooj Raziq',
    email: 'aroojawan742@gmail.com',
    age: 18-25,
    gender: 'FeMale',
    relationship: 'Single',
    livingSituation: 'With Friends',
    status: 'Active',
  },
  {
    id: 'u3',
    name: 'Malkan',
    email: 'malkanshaheenit@gmail.com',
    age: 25-40,
    gender: 'FeMale',
    relationship: 'Single',
    livingSituation: 'With Friends',
    status: 'Active',
  },
];

const AdminUserProfileManagementScreen = () => {
  const [users, setUsers] = useState(dummyUsers);

  const deleteUser = (id) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setUsers((prev) => prev.filter((user) => user.id !== id));
        },
      },
    ]);
  };

  const editUser = (user) => {
    Alert.alert('Edit User', `Open edit screen for: ${user.name}`);
    // You can navigate to edit screen with navigation.navigate('EditUser', { user });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Profile Management</Text>

      {users.map((user) => (
        <View key={user.id} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.actions}>
              
              <TouchableOpacity onPress={() => deleteUser(user.id)} style={{ marginLeft: 15 }}>
                <Ionicons name="trash-outline" size={22} color="#B00020" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.info}>📧 {user.email}</Text>
          <Text style={styles.info}>🎂 Age: {user.age}</Text>
          <Text style={styles.info}>🚻 Gender: {user.gender}</Text>
          <Text style={styles.info}>💬 Relationship: {user.relationship}</Text>
          <Text style={styles.info}>🏡 Living: {user.livingSituation}</Text>
          <Text style={styles.status}>🟢 {user.status}</Text>
        </View>
      ))}

      {users.length === 0 && (
        <Text style={styles.empty}>No users available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE9E6',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#610d1b',
    marginBottom: 20,
    marginTop:35,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474F',
  },
  info: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  status: {
    marginTop: 6,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actions: {
    flexDirection: 'row',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
});

export default AdminUserProfileManagementScreen;
