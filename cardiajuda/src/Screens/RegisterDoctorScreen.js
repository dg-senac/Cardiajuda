import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

function FormField({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9b6b82"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

export default function RegisterDoctorScreen({ navigation }) {
  const [name, setName] = useState('');
  const [crm, setCrm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.deviceFrame}>
          <View style={styles.statusBar}>
            <View style={styles.notch} />
            <View style={styles.dotGroup}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={styles.brandWrap}>
            <Text style={styles.brand}>cardiajuda</Text>
            <Text style={styles.brandHeart}>♡</Text>
          </View>

          <Text style={styles.title}>Cadastro do Médico</Text>

          <FormField
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={name}
            onChangeText={setName}
          />

          <FormField
            label="CRM"
            placeholder="Digite o CRM"
            value={crm}
            onChangeText={setCrm}
          />

          <FormField
            label="Especialidade"
            placeholder="Sua especialidade"
            value={specialty}
            onChangeText={setSpecialty}
          />

          <FormField
            label="E-mail"
            placeholder="Digite o e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <FormField
            label="Senha"
            placeholder="Digite uma senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Cadastrar</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              já tem uma conta? <Text style={styles.linkText}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1d1d1d',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  deviceFrame: {
    width: '88%',
    maxWidth: 390,
    backgroundColor: '#f9f2f5',
    borderRadius: 34,
    borderWidth: 8,
    borderColor: '#1b1b1b',
    paddingHorizontal: 22,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    position: 'relative',
  },
  notch: {
    width: 118,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#1c1c1c',
    marginTop: 2,
  },
  dotGroup: {
    position: 'absolute',
    left: 12,
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4b4b4b',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  brand: {
    color: '#bf4bb8',
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 48,
  },
  brandHeart: {
    color: '#bf4bb8',
    fontSize: 28,
    marginLeft: 2,
    marginTop: 2,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: '#3f1d43',
    marginBottom: 18,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#4a224a',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#bf6aa6',
    borderRadius: 12,
    height: 48,
    backgroundColor: '#f3dfe8',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#4d2b4d',
  },
  primaryButton: {
    backgroundColor: '#b64bc1',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#8a3d9f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 18,
    color: '#5e3d5a',
    fontSize: 15,
  },
  linkText: {
    color: '#b04cc1',
    fontWeight: '700',
  },
});
