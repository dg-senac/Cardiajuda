export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf[10])) return false;

  return true;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const classifyPressure = (sistolica: number, diastolica: number): 'normal' | 'atencao' | 'alerta' => {
  if (sistolica >= 140 || diastolica >= 90) return 'alerta';
  if (sistolica >= 130 || diastolica >= 85) return 'atencao';
  return 'normal';
};

export const classifyGlucose = (glicemia: number): 'normal' | 'atencao' | 'alerta' => {
  if (glicemia < 70) return 'alerta';
  if (glicemia >= 126) return 'alerta';
  if (glicemia >= 100) return 'atencao';
  return 'normal';
};

export const getMeasurementStatus = (sistolica: number, diastolica: number, glicemia: number): 'normal' | 'atencao' | 'alerta' => {
  const pressureStatus = classifyPressure(sistolica, diastolica);
  const glucoseStatus = classifyGlucose(glicemia);

  if (pressureStatus === 'alerta' || glucoseStatus === 'alerta') return 'alerta';
  if (pressureStatus === 'atencao' || glucoseStatus === 'atencao') return 'atencao';
  return 'normal';
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
