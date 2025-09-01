import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config/api";

const API_BASE = `${API_BASE_URL}`;

const AdminUserProfileManagementScreen = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-all-users`);
      const data = await res.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        setUsers(data.data);
      } else {
        console.log("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const deleteUser = (id) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/delete-user/${id}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (data.status === "success") {
              setUsers((prev) => prev.filter((u) => u._id !== id));
            }
          } catch (error) {
            console.error("Error deleting user:", error);
          }
        },
      },
    ]);
  };

  // View Login History
  const viewLoginHistory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/get-login-history/${id}`);
      const data = await res.json();
      if (data.status === "success") {
        Alert.alert("Login History", JSON.stringify(data.data, null, 2));
      }
    } catch (error) {
      console.error("Error fetching login history:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Profile Management</Text>

      {users.map((user) => (
        <View key={user._id} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{user.Name}</Text>
            <View style={styles.actions}>
              {/* ✅ Only Login History kept */}
              <TouchableOpacity
                onPress={() => viewLoginHistory(user._id)}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="time-outline" size={22} color="#1976D2" />
              </TouchableOpacity>

              {/* ✅ Only Delete kept */}
              <TouchableOpacity
                onPress={() => deleteUser(user._id)}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="trash-outline" size={22} color="#B00020" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.info}>📧 {user.Email}</Text>
          <Text style={styles.info}>👤 Username: {user.Username}</Text>
          <Text style={styles.status}>
            {user.status === "Deactivated" ? "🔴 Deactivated" : "🟢 Active"}
          </Text>
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
    backgroundColor: "#FDE9E6",
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#610d1b",
    marginBottom: 20,
    marginTop: 35,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37474F",
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  status: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  actions: {
    flexDirection: "row",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 16,
  },
});

export default AdminUserProfileManagementScreen;
