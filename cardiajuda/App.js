import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterDoctorScreen from './src/Screens/RegisterDoctorScreen';
import RegisterPatientScreen from './src/Screens/RegisterPatientScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DoctorRegister" component={RegisterDoctorScreen} />
        <Stack.Screen name="PatientRegister" component={RegisterPatientScreen} />
        <Stack.Screen name="RegisterDoctor" component={RegisterDoctorScreen} />
        <Stack.Screen name="RegisterPatient" component={RegisterPatientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
