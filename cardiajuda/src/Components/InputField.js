import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const getInputIcon = (icon) => {
  if (icon === 'mail-outline') return '✉';
  if (icon === 'lock-closed-outline') return '🔒';
  return '•';
};

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  keyboardType = 'default',
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{getInputIcon(icon)}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#b267a7"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6dfea',
    borderWidth: 1.5,
    borderColor: '#e2bfd8',
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  icon: {
    marginRight: 10,
    color: '#b46db2',
    fontSize: 20,
    lineHeight: 20,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#4d2a4b',
    paddingVertical: 0,
  },
});
