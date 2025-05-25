'use client';

import { Alert, Anchor, Button, Card, Flex, Stack, Text, TextInput } from '@mantine/core';
import Form from 'next/form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SignInErrorCode, signInSubmitForm } from './signIn';
import { signUpSubmitForm } from '../signup/signUp';

interface LoginFormProps {
  isSignUp?: boolean;
  errorCode?: SignInErrorCode;
}

const errorCodeToMessage: Record<SignInErrorCode, string> = {
  invalid_form_data: 'Invalid form data. Please check your input.',
  invalid_credentials: 'Invalid email or password. Please try again.',
  unknown_error: 'An unknown error occurred. Please try again later.',
};

const LoginForm = ({ isSignUp, errorCode }: LoginFormProps) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectToString = searchParams.get('redirectTo')
    ? '?redirectTo=' + searchParams.get('redirectTo')
    : '';

  return (
    <main style={{ margin: 'auto' }}>
      <Card style={{ minWidth: 250 }}>
        <Form action={isSignUp ? signUpSubmitForm : signInSubmitForm}>
          <Stack gap="md">
            {errorCode && (
              <Alert title="Error" color="red">
                {errorCodeToMessage[errorCode]}
              </Alert>
            )}
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</Button>
          </Stack>
        </Form>
      </Card>
      <Flex justify="center" gap="sm">
        {isSignUp ? (
          <>
            <Text size="sm">Already have an account?</Text>
            <Anchor size="sm" component={Link} href={`/signin${redirectToString}`}>
              Log in
            </Anchor>
          </>
        ) : (
          <>
            <Text size="sm">Don't have an account? </Text>
            <Anchor size="sm" component={Link} href={`/signup${redirectToString}`}>
              Sign Up
            </Anchor>
          </>
        )}
      </Flex>
    </main>
  );
};

export default LoginForm;
