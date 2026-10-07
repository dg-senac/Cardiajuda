import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavigation } from '../../App';

const initialRecords = [
  { id: 1, date: 'Hoje · 08:30', pressure: '138/88', glucose: '108', warning: true },
  { id: 2, date: 'Ontem · 19:10', pressure: '126/82', glucose: '102', warning: false },
  { id: 3, date: '12/09 · 07:45', pressure: '122/79', glucose: '94', warning: false },
  { id: 4, date: '10/09 · 08:20', pressure: '130/85', glucose: '99', warning: false },
];

export default function HealthScreen() {
  const scrollRef = useRef(null);
  const systolicRef = useRef(null);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [showPressure, setShowPressure] = useState(true);
  const [showGlucose, setShowGlucose] = useState(true);
  const [records, setRecords] = useState(initialRecords);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function validateInputs() {
    const systolicValue = Number(systolic);
    const diastolicValue = Number(diastolic);
    const glucoseValue = Number(glucose);

    if (showPressure && (!systolic || !diastolic)) {
      setErrorMessage('Preencha a pressão arterial');
      return false;
    }

    if (showGlucose && !glucose) {
      setErrorMessage('Preencha a glicemia');
      return false;
    }

    if (showPressure) {
      if (systolicValue < 60 || systolicValue > 250) {
        setErrorMessage('Pressão sistólica inválida (60-250)');
        return false;
      }
      if (diastolicValue < 40 || diastolicValue > 150) {
        setErrorMessage('Pressão diastólica inválida (40-150)');
        return false;
      }
      if (systolicValue <= diastolicValue) {
        setErrorMessage('Sistólica deve ser maior que diastólica');
        return false;
      }
    }

    if (showGlucose) {
      if (glucoseValue < 40 || glucoseValue > 600) {
        setErrorMessage('Glicemia inválida (40-600)');
        return false;
      }
    }

    setErrorMessage('');
    return true;
  }

  function saveMeasurement() {
    if (!validateInputs()) return;

    setIsSaving(true);
    setErrorMessage('');

    setTimeout(() => {
      const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const systolicValue = Number(systolic);
      const glucoseValue = Number(glucose);

      if (editingId) {
        setRecords((currentRecords) =>
          currentRecords.map((record) =>
            record.id === editingId
              ? {
                  ...record,
                  date: `Hoje · ${time}`,
                  pressure: showPressure ? `${systolic}/${diastolic}` : record.pressure,
                  glucose: showGlucose ? glucose : record.glucose,
                  warning: (showPressure && systolicValue >= 140) || (showGlucose && glucoseValue >= 126),
                }
              : record
          )
        );
        setSuccessMessage('Medição atualizada com sucesso!');
        setEditingId(null);
      } else {
        const newRecord = {
          id: Date.now(),
          date: `Hoje · ${time}`,
          pressure: showPressure ? `${systolic}/${diastolic}` : '-',
          glucose: showGlucose ? glucose : '-',
          warning: (showPressure && systolicValue >= 140) || (showGlucose && glucoseValue >= 126),
        };
        setRecords((currentRecords) => [newRecord, ...currentRecords]);
        setSuccessMessage('Medição salva com sucesso!');
      }

      setSystolic('');
      setDiastolic('');
      setGlucose('');
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  }

  function editRecord(record) {
    setEditingId(record.id);
    const pressureParts = record.pressure.split('/');
    setSystolic(pressureParts[0] !== '-' ? pressureParts[0] : '');
    setDiastolic(pressureParts[1] !== '-' ? pressureParts[1] : '');
    setGlucose(record.glucose !== '-' ? record.glucose : '');
    setShowPressure(record.pressure !== '-');
    setShowGlucose(record.glucose !== '-');
    systolicRef.current?.focus();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function deleteRecord(id) {
    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== id));
    setSuccessMessage('Registro excluído');
    setTimeout(() => setSuccessMessage(''), 2000);
  }

  function cancelEdit() {
    setEditingId(null);
    setSystolic('');
    setDiastolic('');
    setGlucose('');
    setErrorMessage('');
  }

  function addMissingMeasurement(type) {
    if (type === 'pressure') setShowPressure(true);
    if (type === 'glucose') setShowGlucose(true);
  }

  function getHealthStatus(record) {
    if (record.pressure === '-' && record.glucose === '-') {
      return { icon: 'help-circle', color: '#77717a', label: 'Incompleto' };
    }

    const pressureParts = record.pressure.split('/');
    const systolicValue = Number(pressureParts[0]);
    const glucoseValue = Number(record.glucose);

    const pressureWarning = record.pressure !== '-' && systolicValue >= 140;
    const glucoseWarning = record.glucose !== '-' && glucoseValue >= 126;

    if (pressureWarning || glucoseWarning) {
      return { icon: 'warning', color: '#f59e0b', label: 'Atenção' };
    }
    return { icon: 'checkmark-circle', color: '#10b981', label: 'Normal' };
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/cardiajuda-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Cardiajuda"
        />

        <Text style={styles.title}>Pressão e glicemia</Text>
        <Text style={styles.subtitle}>
          {editingId ? 'Editando medição' : 'Registre medições e acompanhe a evolução'}
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Ionicons name="heart" size={32} color="#870095" />
            <Text style={styles.summaryValue}>{records[0]?.pressure || '-'}</Text>
            <Text style={styles.summaryLabel}>Última PA</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="ellipse-outline" size={32} color="#870095" />
            <Text style={styles.summaryValue}>{records[0]?.glucose || '-'}</Text>
            <Text style={styles.summaryLabel}>Última Glicemia</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setEditingId(null);
              systolicRef.current?.focus();
            }}
            style={styles.actionButton}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.actionText}>Nova medição</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            style={styles.actionButton}
          >
            <Ionicons name="list" size={20} color="#fff" />
            <Text style={styles.actionText}>Histórico</Text>
          </Pressable>
        </View>

        {successMessage ? (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.successText}>{successMessage}</Text>
            <Pressable onPress={() => setSuccessMessage('')} style={styles.successClose}>
              <Ionicons name="close" size={20} color="#10b981" />
            </Pressable>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={24} color="#e52332" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={() => setErrorMessage('')} style={styles.errorClose}>
              <Ionicons name="close" size={20} color="#e52332" />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.measurementSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{editingId ? 'Editar medição' : 'Nova medição'}</Text>
            {editingId && (
              <Pressable onPress={cancelEdit} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            )}
          </View>

          {showPressure && (
            <View style={styles.measurementCard}>
              <View style={styles.measurementIcon}>
                <Ionicons name="heart" size={31} color="#fff" />
              </View>
              <View style={styles.measurementBody}>
                <Text style={styles.measurementTitle}>Pressão arterial</Text>
                <Text style={styles.measurementSubtitle}>Sistólica / Diastólica</Text>
                <View style={styles.valueRow}>
                  <TextInput
                    ref={systolicRef}
                    accessibilityLabel="Pressão sistólica"
                    keyboardType="number-pad"
                    maxLength={3}
                    onChangeText={setSystolic}
                    selectTextOnFocus
                    placeholder="120"
                    placeholderTextColor="#e6b1d1"
                    style={styles.valueInput}
                    value={systolic}
                  />
                  <Text style={styles.separator}>/</Text>
                  <TextInput
                    accessibilityLabel="Pressão diastólica"
                    keyboardType="number-pad"
                    maxLength={3}
                    onChangeText={setDiastolic}
                    selectTextOnFocus
                    placeholder="80"
                    placeholderTextColor="#e6b1d1"
                    style={styles.valueInput}
                    value={diastolic}
                  />
                  <Text style={styles.unit}>mmHg</Text>
                </View>
              </View>
              {!editingId && (
                <Pressable
                  accessibilityLabel="Remover pressão arterial"
                  onPress={() => setShowPressure(false)}
                  hitSlop={8}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={28} color="#e52332" />
                </Pressable>
              )}
            </View>
          )}

          {!showPressure && !editingId && (
            <Pressable
              onPress={() => addMissingMeasurement('pressure')}
              style={styles.addMeasurementButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="#870095" />
              <Text style={styles.addMeasurementText}>Adicionar pressão arterial</Text>
            </Pressable>
          )}

          {showGlucose && (
            <View style={styles.measurementCard}>
              <View style={styles.measurementIcon}>
                <Ionicons name="ellipse-outline" size={31} color="#fff" />
              </View>
              <View style={styles.measurementBody}>
                <Text style={styles.measurementTitle}>Glicemia</Text>
                <Text style={styles.measurementSubtitle}>Em jejum ou pós-refeição</Text>
                <View style={styles.valueRow}>
                  <TextInput
                    accessibilityLabel="Glicemia"
                    keyboardType="number-pad"
                    maxLength={3}
                    onChangeText={setGlucose}
                    selectTextOnFocus
                    placeholder="100"
                    placeholderTextColor="#e6b1d1"
                    style={[styles.valueInput, styles.glucoseInput]}
                    value={glucose}
                  />
                  <Text style={styles.unit}>mg/dL</Text>
                </View>
              </View>
              {!editingId && (
                <Pressable
                  accessibilityLabel="Remover glicemia"
                  onPress={() => setShowGlucose(false)}
                  hitSlop={8}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={28} color="#e52332" />
                </Pressable>
              )}
            </View>
          )}

          {!showGlucose && !editingId && (
            <Pressable
              onPress={() => addMissingMeasurement('glucose')}
              style={styles.addMeasurementButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="#870095" />
              <Text style={styles.addMeasurementText}>Adicionar glicemia</Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={saveMeasurement}
            style={[
              styles.saveButton,
              isSaving && styles.disabledButton,
              (!showPressure && !showGlucose) && styles.disabledButton,
            ]}
            disabled={isSaving || (!showPressure && !showGlucose)}
          >
            {isSaving ? (
              <Ionicons name="hourglass" size={23} color="#fff" />
            ) : (
              <Ionicons name="checkmark-circle" size={23} color="#fff" />
            )}
            <Text style={styles.saveText}>
              {isSaving ? 'Salvando...' : editingId ? 'Atualizar medição' : 'Salvar medição'}
            </Text>
            {!isSaving && <Ionicons name="chevron-forward" size={23} color="#fff" />}
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#870095" />
          <Text style={styles.infoText}>
            Valores de referência: PA {'<'}140/90 mmHg • Glicemia {'<'}126 mg/dL
          </Text>
        </View>

        <Text style={styles.historyTitle}>Últimos registros</Text>
        <View style={styles.records}>
          {records.map((record) => {
            const status = getHealthStatus(record);
            return (
              <View key={record.id} style={styles.record}>
                <View style={styles.recordLeft}>
                  <Text style={styles.recordDate}>{record.date}</Text>
                  <View style={styles.recordValues}>
                    <Text style={styles.recordPressure}>
                      PA {record.pressure !== '-' ? record.pressure : 'Não registrada'}
                    </Text>
                    <Text style={styles.recordGlucose}>
                      Glicemia {record.glucose !== '-' ? record.glucose : 'Não registrada'}
                    </Text>
                  </View>
                </View>
                <View style={styles.recordStatus}>
                  <Ionicons name={status.icon} size={28} color={status.color} />
                  <Text style={[styles.recordStatusLabel, { color: status.color }]}>
                    {status.label}
                  </Text>
                </View>
                <View style={styles.recordActions}>
                  <Pressable
                    onPress={() => editRecord(record)}
                    style={styles.recordActionButton}
                    hitSlop={8}
                  >
                    <Ionicons name="create-outline" size={20} color="#e6b1d1" />
                  </Pressable>
                  <Pressable
                    onPress={() => deleteRecord(record.id)}
                    style={styles.recordActionButton}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e52332" />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="Saúde" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fcf8fd' },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 20 },
  logo: { width: '88%', height: 92, alignSelf: 'center', marginBottom: 9 },
  title: { color: '#252126', fontSize: 29, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#77717a', fontSize: 13, textAlign: 'center', marginTop: 3, marginBottom: 24 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 18,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: {
    color: '#870095',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 2,
  },
  summaryLabel: { color: '#77717a', fontSize: 12, fontWeight: '600' },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee3f0',
    marginHorizontal: 16,
  },
  actions: { flexDirection: 'row', gap: 12, marginHorizontal: 12, marginBottom: 14 },
  actionButton: {
    flex: 1,
    minHeight: 43,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#35003c',
    backgroundColor: '#870095',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  successCard: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successText: {
    flex: 1,
    color: '#065f46',
    fontSize: 13,
    fontWeight: '600',
  },
  successClose: { padding: 4 },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    flex: 1,
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '600',
  },
  errorClose: { padding: 4 },
  measurementSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#302434',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    color: '#870095',
    fontSize: 13,
    fontWeight: '600',
  },
  measurementCard: {
    minHeight: 100,
    backgroundColor: '#e6b1d1',
    borderColor: '#1d1720',
    borderWidth: 2,
    borderRadius: 17,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  measurementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#870095',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementBody: { flex: 1, minWidth: 0 },
  measurementTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  measurementSubtitle: {
    color: '#f8eefb',
    fontSize: 11,
    marginBottom: 8,
  },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  valueInput: {
    flex: 1,
    minWidth: 0,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#9a5793',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  separator: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  glucoseInput: { flex: 1.6 },
  unit: { color: '#fff', fontSize: 12, minWidth: 42, fontWeight: '600' },
  removeButton: { padding: 6 },
  addMeasurementButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e6b1d1',
    backgroundColor: '#f8eefb',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addMeasurementText: {
    color: '#870095',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    minHeight: 56,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#35003c',
    backgroundColor: '#870095',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveText: { color: '#fff', fontSize: 14, flex: 1, marginLeft: 12 },
  infoCard: {
    backgroundColor: '#f3e8f8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: '#870095',
    fontSize: 12,
    fontWeight: '600',
  },
  historyTitle: { color: '#252126', fontSize: 19, fontWeight: '700', marginBottom: 12, marginLeft: 8 },
  records: { gap: 8 },
  record: {
    minHeight: 68,
    backgroundColor: '#870095',
    borderColor: '#35003c',
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  recordLeft: { flex: 1 },
  recordDate: {
    color: '#e6b1d1',
    fontSize: 11,
    marginBottom: 4,
  },
  recordValues: {
    flexDirection: 'row',
    gap: 12,
  },
  recordPressure: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  recordGlucose: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  recordStatus: {
    alignItems: 'center',
  },
  recordStatusLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recordActionButton: {
    padding: 6,
  },
});