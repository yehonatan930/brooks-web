// RegistrationScreen.tsx
import React, { useState } from 'react';
import {Button, ButtonText, Container, InputField, RegistrationForm} from "./RegistrationScreen.styles";

interface RegistrationScreenProps {
  onRegister: (email: string, password: string) => void;
  onError: (error: string) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onRegister,
  onError,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      onError('Passwords do not match');
      return;
    }
    onRegister(email, password);
  };

  return (
    <Container>
      <RegistrationForm onSubmit={handleRegister}>
        <h2>Register</h2>
        <InputField
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />
        <InputField
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        <InputField
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm Password"
        />
        <Button type="submit">
          <ButtonText>Register</ButtonText>
        </Button>
        <p>
          Already have an account?{' '}
          <a href="#" style={{ color: '#4CAF50' }}>
            Log in
          </a>
        </p>
      </RegistrationForm>
    </Container>
  );
};

export default RegistrationScreen;