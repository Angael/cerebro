'use client';

import { API } from '@/utils/API';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { Alert, Anchor, Button, Card, Flex, Stack, Text, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Form from 'next/form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Deprecated, form will log the user in
  const mutation = useMutation({
    mutationFn: () => {
      console.log(1);
      const val = API.post('/auth/signin', { email, password });
      console.log(2);

      return val;
    },
    onSettled: () => queryClient.invalidateQueries(),
    onSuccess: () => {
      // Force a full page reload to refresh server components
      window.location.href = redirectTo;
      console.log('onSuccess', {
        redirectTo,
        currentUrl: window.location.href,
        newUrl: redirectTo,
      });
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  const parsedErr = parseErrorResponse(mutation.error);

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
              error={parsedErr?.fields.email}
              autoComplete="email"
            />
            <TextInput
              label={'Password'}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={parsedErr?.fields.password}
              autoComplete="current-password"
            />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Button type="submit" loading={mutation.isPending}>
              Log in
            </Button>
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
