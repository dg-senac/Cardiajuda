import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

const getRoleIcon = (option) => (option === 'Paciente' ? '👤' : '🩺');

export default function RoleToggle({ value, onChange, options }) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.option, selected && styles.selected]}>
            <Text style={[styles.icon, selected && styles.iconSelected]}>{getRoleIcon(option)}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#f5dfe9',
    borderRadius: 20,
    padding: 5,
    marginTop: 18,
    marginBottom: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderRadius: 16,
  },
  selected: {
    backgroundColor: '#b653d0',
    shadowColor: '#9b4d8d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    color: '#9b4d8d',
    fontSize: 18,
    lineHeight: 18,
  },
  iconSelected: {
    color: '#fff',
  },
  label: {
    color: '#9b4d8d',
    fontSize: 16,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#fff',
  },
});
