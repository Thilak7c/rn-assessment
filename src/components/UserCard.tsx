import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { User } from '../types';

interface Props {
  user: User;
}

const COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed'];

function getInitialColor(id: number): string {
  return COLORS[id % COLORS.length];
}

export function UserCard({ user }: Props) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  const color = getInitialColor(user.id);

  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          defaultSource={{ uri: `https://ui-avatars.com/api/?name=${initials}&background=4f46e5&color=fff` }}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={[styles.idBadge, { backgroundColor: color + '18' }]}>
        <Text style={[styles.idText, { color }]}>#{user.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  avatar: { width: 48, height: 48 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  email: { fontSize: 13, color: '#64748b', marginTop: 2 },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idText: { fontSize: 12, fontWeight: '700' },
});
