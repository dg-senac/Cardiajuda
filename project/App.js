import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const shortcuts = [
  { icon: 'person', label: 'Dados Pessoais', route: '/personal' },
  { icon: 'calendar', label: 'Agendamento', route: '/appointment' },
  { icon: 'document-text-outline', label: 'Exames e Resultados', route: '/exams' },
  { icon: 'notifications-outline', label: 'Alertas de Saúde', route: '/health' },
  { icon: 'medkit-outline', label: 'Medicamentos', route: '/medications' },
  { icon: 'help-circle-outline', label: 'Dúvidas', route: '/faq' },
];

const tabs = [
  { icon: 'home-outline', label: 'Início' },
  { icon: 'calendar-outline', label: 'Consulta' },
  { icon: 'heart-outline', label: 'Saúde' },
  { icon: 'search-outline', label: 'Médico' },
];

export default function App() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoWindow}>
            <Image
              source={require('./assets/cardiajuda-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.pageTitle}>Meu Perfil</Text>
          <Pressable style={styles.notificationBell}>
            <Ionicons name="notifications" size={26} color="#870095" />
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>

        {showAlert && (
          <View style={styles.alertCard}>
            <Ionicons name="warning" size={28} color="#fff" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Lembrete de Consulta</Text>
              <Text style={styles.alertText}>Sua próxima consulta é amanhã às 14:00</Text>
            </View>
            <Pressable onPress={() => setShowAlert(false)} style={styles.alertClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>
        )}

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarColumn}>
              <Text style={styles.profileName}>Croché</Text>
              <View style={styles.avatarFrame}>
                <Text style={styles.duck}>🐤</Text>
                <Pressable accessibilityLabel="Alterar foto" style={styles.cameraButton}>
                  <Ionicons name="camera" size={23} color="#fff" />
                </Pressable>
              </View>
              <Text style={styles.memberSince}>Membro desde 2024</Text>
            </View>

            <View style={styles.contactList}>
              <View style={styles.contactRow}>
                <Ionicons name="person" size={23} color="#fff" style={styles.contactIcon} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Nome completo</Text>
                  <Text style={styles.contactValue}>Croché da Silva</Text>
                </View>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="mail" size={23} color="#fff" style={styles.contactIcon} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>croche@email.com</Text>
                </View>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="call" size={23} color="#fff" style={styles.contactIcon} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Telefone</Text>
                  <Text style={styles.contactValue}>(11) 99999-9999</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.profileDivider} />
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Ionicons name="calendar" size={27} color="#fff" />
              <Text style={styles.metricValue}>35</Text>
              <Text style={styles.metricLabel}>Idade</Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="water" size={28} color="#fff" />
              <Text style={styles.metricValue}>O+</Text>
              <Text style={styles.metricSmallLabel}>Tipo Sanguíneo</Text>
            </View>
            <View style={[styles.metric, styles.lastMetric]}>
              <Ionicons name="resize-outline" size={26} color="#fff" />
              <Text style={styles.metricValue}>1.75</Text>
              <Text style={styles.metricLabel}>Altura (m)</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={28} color="#870095" />
            <Text style={styles.statValue}>138/88</Text>
            <Text style={styles.statLabel}>Pressão Atual</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="ellipse-outline" size={28} color="#870095" />
            <Text style={styles.statValue}>108</Text>
            <Text style={styles.statLabel}>Glicemia</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="fitness" size={28} color="#870095" />
            <Text style={styles.statValue}>72</Text>
            <Text style={styles.statLabel}>Peso (kg)</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.shortcutList}>
          {shortcuts.map((shortcut) => (
            <Pressable
              key={shortcut.label}
              onPress={() => shortcut.route && router.push(shortcut.route)}
              style={styles.shortcut}
            >
              <View style={styles.shortcutIconWrapper}>
                <Ionicons name={shortcut.icon} size={27} color="#fff" />
              </View>
              <View style={styles.shortcutContent}>
                <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
                <Text style={styles.shortcutDescription}>Acessar funcionalidade</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.chevron} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation activeTab="Início" />
    </SafeAreaView>
  );
}

export function BottomNavigation({ activeTab }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(activeTab);

  function handleTabPress(label) {
    if (label === selectedTab) return;
    setSelectedTab(label);

    if (label === 'Início') router.replace('/');
    if (label === 'Consulta') router.replace('/appointment');
    if (label === 'Saúde') router.replace('/health');
  }

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = selectedTab === tab.label;
        return (
          <Pressable
            key={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => handleTabPress(tab.label)}
            style={styles.tab}
          >
            <Ionicons
              name={tab.icon}
              size={37}
              color={isActive ? '#870095' : '#160f16'}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fcf8fd',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoWindow: {
    width: '82%',
    height: 82,
    overflow: 'hidden',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: -35,
  },
  pageTitle: {
    color: '#302434',
    fontSize: 21,
    fontWeight: '600',
    marginTop: 3,
  },
  notificationBell: {
    position: 'absolute',
    right: 0,
    top: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e52332',
    borderWidth: 2,
    borderColor: '#fcf8fd',
  },
  alertCard: {
    backgroundColor: '#f59e0b',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#b45309',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertText: {
    color: '#fff',
    fontSize: 12,
  },
  alertClose: {
    padding: 4,
  },
  profileCard: {
    backgroundColor: '#870095',
    borderColor: '#650071',
    borderWidth: 1,
    borderRadius: 23,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 4,
    marginBottom: 18,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 7,
  },
  profileTop: {
    minHeight: 164,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarColumn: {
    width: '42%',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  profileName: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 7,
  },
  avatarFrame: {
    width: 104,
    height: 104,
    maxWidth: '100%',
    borderRadius: 52,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f8eefb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#390040',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  duck: {
    fontSize: 68,
  },
  cameraButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#5f006b',
    position: 'absolute',
    right: -5,
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  memberSince: {
    color: '#e6b1d1',
    fontSize: 11,
    marginTop: 8,
  },
  contactList: {
    flex: 1,
    gap: 11,
    paddingLeft: 5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  contactIcon: {
    width: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    color: '#e6b1d1',
    fontSize: 11,
    marginBottom: 2,
  },
  contactValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  profileDivider: {
    height: 1,
    borderRadius: 1,
    backgroundColor: '#dba5e1',
    marginTop: 5,
    marginBottom: 5,
  },
  metrics: {
    minHeight: 71,
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRightWidth: 1,
    borderRightColor: '#c984d2',
  },
  lastMetric: {
    borderRightWidth: 0,
  },
  metricValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  metricLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  metricSmallLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    color: '#870095',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    color: '#77717a',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#302434',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 5,
  },
  shortcutList: {
    gap: 12,
    paddingHorizontal: 5,
  },
  shortcut: {
    minHeight: 70,
    backgroundColor: '#870095',
    borderColor: '#6d0078',
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },
  shortcutIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#a338b1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutContent: {
    flex: 1,
  },
  shortcutLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  shortcutDescription: {
    color: '#e6b1d1',
    fontSize: 12,
  },
  chevron: {
    marginLeft: 4,
  },
  tabBar: {
    minHeight: 72,
    backgroundColor: '#fffafd',
    borderTopWidth: 1,
    borderTopColor: '#eee3f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    paddingTop: 6,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  tabIcon: {
    lineHeight: 39,
  },
  tabLabel: {
    color: '#655b68',
    fontSize: 11,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: '#870095',
  },
});
