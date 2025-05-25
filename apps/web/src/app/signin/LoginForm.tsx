'use client';

import { Alert, Anchor, Button, Card, Flex, Stack, Text, TextInput } from '@mantine/core';
import Form from 'next/form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SignInErrorCode, signInSubmitForm } from './signIn';

interface LoginFormProps {
  errorCode?: SignInErrorCode;
}

const errorCodeToMessage: Record<SignInErrorCode, string> = {
  invalid_form_data: 'Invalid form data. Please check your input.',
  invalid_credentials: 'Invalid email or password. Please try again.',
  unknown_error: 'An unknown error occurred. Please try again later.',
};

const LoginForm = ({ errorCode }: LoginFormProps) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main style={{ margin: 'auto' }}>
      <Card style={{ minWidth: 250 }}>
        <Form action={signInSubmitForm}>
          <Stack gap="md">
            {errorCode && (
              <Alert title="Error" color="red">
                {errorCodeToMessage[errorCode]}
              </Alert>
            )}
            <TextInput
              label={'Email'}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextInput
              label={'Password'}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Button type="submit">Log in</Button>
          </Stack>
        </Form>
      </Card>
      <Flex justify="center" gap="sm">
        <Text size="sm">Don't have an account? </Text>
        <Anchor size="sm" component={Link} href="/signup">
          Sign Up
        </Anchor>
      </Flex>
    </main>
  );
};

export default LoginForm;
