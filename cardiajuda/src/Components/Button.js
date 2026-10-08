import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ label, onPress, style, textStyle }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#b653d0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#8a3d9f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },
});
