import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Button, Appbar, Avatar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuthStore } from '@/store/auth';

export function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Handle error
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (error) {
              // Handle error
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.Content title="Account" />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        <List.Section>
          <List.Item
            title="Email"
            description={user?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Number"
            description={user?.phoneNumber}
            left={(props) => <List.Icon {...props} icon="phone" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Password"
            description="••••••••••"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>

          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            textColor="#FF3B30"
          >
            Delete Account
          </Button>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    gap: 16,
  },
  signOutButton: {
    backgroundColor: '#E85D3F',
  },
  deleteButton: {
    borderColor: '#FF3B30',
  },
});