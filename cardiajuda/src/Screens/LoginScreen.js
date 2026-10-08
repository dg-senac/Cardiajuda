import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import InputField from '../Components/InputField';
import RoleToggle from '../Components/RoleToggle';
import Button from '../Components/Button';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('Paciente');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const loginPlaceholder = role === 'Paciente' ? 'E-mail ou CPF' : 'E-mail ou CRM';

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

          <View style={styles.brandContainer}>
            <Text style={styles.brand}>cardiajuda</Text>
          </View>

          <Text style={styles.title}>Faça seu Login</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

          <RoleToggle
            value={role}
            onChange={setRole}
            options={['Paciente', 'Médico']}
          />

          <InputField
            placeholder={loginPlaceholder}
            value={identifier}
            onChangeText={setIdentifier}
            icon="mail-outline"
            keyboardType="email-address"
          />

          <InputField
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </Pressable>

          <Button label="Entrar" onPress={() => {}} />

          <Text style={styles.helpText}>
            Precisa de ajuda?{' '}
            <Text style={styles.linkText}>Fale Conosco</Text>
          </Text>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou entre com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialIconGoogle}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialIconApple}></Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => navigation.navigate(role === 'Paciente' ? 'PatientRegister' : 'DoctorRegister')}
          >
            <Text style={styles.footerText}>
              Ainda não tem conta?{' '}
              <Text style={styles.linkText}>Cadastre-se</Text>
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
    backgroundColor: '#1f0f21',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  deviceFrame: {
    width: '86%',
    maxWidth: 420,
    backgroundColor: '#f9f2f7',
    borderRadius: 42,
    borderWidth: 8,
    borderColor: '#3b123c',
    paddingHorizontal: 28,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    position: 'relative',
  },
  notch: {
    width: 108,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#431d4c',
    marginTop: 2,
  },
  dotGroup: {
    position: 'absolute',
    left: 14,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7b4c73',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  brand: {
    color: '#4b1f4a',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 54,
    letterSpacing: -2,
  },
  title: {
    textAlign: 'center',
    color: '#3d1b3d',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#7d5978',
    fontSize: 17,
    marginTop: 6,
    marginBottom: 18,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 2,
  },
  forgotPasswordText: {
    color: '#b74cb8',
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    textAlign: 'center',
    marginTop: 14,
    color: '#6e4c67',
    fontSize: 15,
  },
  linkText: {
    color: '#b04cc1',
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d4b9c8',
  },
  dividerText: {
    marginHorizontal: 14,
    color: '#8f6d86',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  socialButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#f0e6ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  socialIconGoogle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#ea4335',
    lineHeight: 34,
  },
  socialIconApple: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 34,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#5a3559',
    fontSize: 15,
  },
});
