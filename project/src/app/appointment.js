import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavigation } from '../../App';
import { supabase } from '../utils/supabase';

const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('Outubro 2026');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      if (!supabase) {
        setDoctors([
          { id: 1, name: 'Dr. Silva', specialty: 'Cardiologista', rating: 4.8 },
          { id: 2, name: 'Dra. Costa', specialty: 'Endocrinologista', rating: 4.9 },
          { id: 3, name: 'Dr. Oliveira', specialty: 'Clínico Geral', rating: 4.7 },
        ]);
        return;
      }
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!supabase) {
        setAppointments([
          { date: 'Out 15, 2026', time: '14:00', doctor_name: 'Dr. Silva', specialty: 'Cardiologista', status: 'confirmado' },
          { date: 'Out 22, 2026', time: '10:00', doctor_name: 'Dra. Costa', specialty: 'Endocrinologista', status: 'pendente' },
        ]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days for October 2026
  const generateCalendarDays = () => {
    const days = [];
    // October 2026 starts on Thursday (day 4)
    const startDay = 4;
    const daysInMonth = 31;
    
    // Empty slots for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const hasAppointmentOnDay = (day) => {
    return appointments.some(apt => apt.date.includes(day.toString()));
  };

  const saveAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      return;
    }

    try {
      const newAppointment = {
        date: `Out ${selectedDate}, 2026`,
        time: selectedTime,
        doctor_name: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        status: 'pendente',
      };

      if (!supabase) {
        setAppointments([{ ...newAppointment, id: Date.now() }, ...appointments]);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedDoctor(null);
        setShowNewAppointment(false);
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select();

      if (error) throw error;

      setAppointments([data[0], ...appointments]);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedDoctor(null);
      setShowNewAppointment(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/cardiajuda-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Cardiajuda"
        />

        <Text style={styles.title}>Agendamento</Text>
        <Text style={styles.subtitle}>Marque suas consultas</Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowNewAppointment(!showNewAppointment)}
            style={styles.actionButton}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.actionText}>Nova consulta</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.actionButton}>
            <Ionicons name="list" size={20} color="#fff" />
            <Text style={styles.actionText}>Minhas consultas</Text>
          </Pressable>
        </View>

        {showNewAppointment && (
          <View style={styles.newAppointmentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Agendar nova consulta</Text>
              <Pressable onPress={() => setShowNewAppointment(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#870095" />
              </Pressable>
            </View>

            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Pressable style={styles.navButton}>
                  <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
                <Text style={styles.monthText}>{currentMonth}</Text>
                <Pressable style={styles.navButton}>
                  <Ionicons name="chevron-forward" size={28} color="#fff" />
                </Pressable>
              </View>

              <View style={styles.daysOfWeek}>
                {daysOfWeek.map((day) => (
                  <Text key={day} style={styles.dayOfWeekText}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <View key={`empty-${index}`} style={styles.emptyDay} />;
                  }
                  const isSelected = selectedDate === day;
                  const hasApt = hasAppointmentOnDay(day);
                  return (
                    <Pressable
                      key={day}
                      onPress={() => setSelectedDate(day)}
                      style={[
                        styles.day,
                        isSelected && styles.selectedDay,
                        hasApt && !isSelected && styles.hasAppointmentDay,
                      ]}
                    >
                      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
                      {hasApt && !isSelected && <View style={styles.appointmentDot} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sectionLabel}>Horários disponíveis</Text>
            <View style={styles.timeSlots}>
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <Pressable
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    style={[styles.timeSlot, isSelected && styles.selectedTimeSlot]}
                  >
                    <Text style={[styles.timeSlotText, isSelected && styles.selectedTimeSlotText]}>
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Selecione o médico</Text>
            <View style={styles.doctorsList}>
              {doctors.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <Pressable
                    key={doctor.id}
                    onPress={() => setSelectedDoctor(doctor)}
                    style={[styles.doctorCard, isSelected && styles.selectedDoctorCard]}
                  >
                    <View style={styles.doctorInfo}>
                      <Ionicons name="person-circle" size={40} color="#870095" />
                      <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>{doctor.name}</Text>
                        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                      </View>
                    </View>
                    <View style={styles.doctorRating}>
                      <Ionicons name="star" size={16} color="#f59e0b" />
                      <Text style={styles.ratingText}>{doctor.rating}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={saveAppointment}
              style={[
                styles.saveButton,
                (!selectedDate || !selectedTime || !selectedDoctor) && styles.disabledButton,
              ]}
              disabled={!selectedDate || !selectedTime || !selectedDoctor}
            >
              <Ionicons name="checkmark-circle" size={23} color="#fff" />
              <Text style={styles.saveText}>Confirmar agendamento</Text>
              <Ionicons name="chevron-forward" size={23} color="#fff" />
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Próximas consultas</Text>
        <View style={styles.appointmentsList}>
          {appointments.map((appointment, index) => (
            <View key={`${appointment.date}-${index}`} style={styles.appointmentCard}>
              <View style={styles.appointmentDate}>
                <Text style={styles.appointmentDay}>{appointment.date.split(' ')[1]}</Text>
                <Text style={styles.appointmentMonth}>{appointment.date.split(' ')[0]}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentDoctor}>{appointment.doctor_name}</Text>
                <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                <View style={styles.appointmentMeta}>
                  <Ionicons name="time" size={14} color="#e6b1d1" />
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, appointment.status === 'confirmado' ? styles.confirmed : styles.pending]}>
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="Consulta" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fcf8fd' },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 20 },
  logo: { width: '88%', height: 92, alignSelf: 'center', marginBottom: 9 },
  title: { color: '#252126', fontSize: 29, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#77717a', fontSize: 13, textAlign: 'center', marginTop: 3, marginBottom: 24 },
  actions: { flexDirection: 'row', gap: 12, marginHorizontal: 12, marginBottom: 16 },
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
  newAppointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#252126',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: { padding: 4 },
  calendarCard: {
    backgroundColor: '#870095',
    borderColor: '#650071',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 18,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 7,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayOfWeekText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    height: 42,
  },
  day: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    marginBottom: 6,
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#e6b1d1',
  },
  hasAppointmentDay: {
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  dayText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#35003c',
    fontWeight: '700',
  },
  appointmentDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
  },
  sectionLabel: {
    color: '#302434',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3e8f8',
    borderWidth: 1,
    borderColor: '#e6b1d1',
  },
  selectedTimeSlot: {
    backgroundColor: '#870095',
    borderColor: '#650071',
  },
  timeSlotText: {
    color: '#870095',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  doctorsList: {
    gap: 10,
    marginBottom: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8eefb',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#e6b1d1',
  },
  selectedDoctorCard: {
    backgroundColor: '#e6b1d1',
    borderColor: '#870095',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    color: '#302434',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  doctorSpecialty: {
    color: '#77717a',
    fontSize: 12,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#77717a',
    fontSize: 13,
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
  sectionTitle: {
    color: '#302434',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 5,
  },
  appointmentsList: {
    gap: 10,
  },
  appointmentCard: {
    backgroundColor: '#870095',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#4b0054',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  appointmentDate: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e6b1d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentDay: {
    color: '#870095',
    fontSize: 22,
    fontWeight: '700',
  },
  appointmentMonth: {
    color: '#870095',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDoctor: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  appointmentSpecialty: {
    color: '#e6b1d1',
    fontSize: 12,
    marginBottom: 4,
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appointmentTime: {
    color: '#e6b1d1',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confirmed: {
    backgroundColor: '#10b981',
  },
  pending: {
    backgroundColor: '#f59e0b',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
