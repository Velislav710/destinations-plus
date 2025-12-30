export function translateAuthError(message) {
  if (message.includes('Invalid login')) {
    return 'Грешен имейл или парола';
  }

  if (message.includes('Email not confirmed')) {
    return 'Имейлът не е потвърден';
  }

  if (message.includes('User already registered')) {
    return 'Потребителят вече съществува';
  }

  return 'Възникна неочаквана грешка';
}
