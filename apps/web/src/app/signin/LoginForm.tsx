'use client';

import { API } from '@/utils/API';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { Anchor, Button, Card, Flex, Stack, Text, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const LoginForm = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      const val = API.post('/auth/signin', { email, password });

      return val;
    },
    onSettled: () => queryClient.invalidateQueries(),
    onSuccess: () => {
      // Force a full page reload to refresh server components
      window.location.href = redirectTo;
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  const parsedErr = parseErrorResponse(mutation.error);

  return (
    <main style={{ margin: 'auto' }}>
      <Card component="form" onSubmit={onSubmit} style={{ minWidth: 250 }}>
        <Stack gap="md">
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
          {parsedErr && (
            <Text size="sm" c="red.8">
              {parsedErr.general}
            </Text>
          )}
          <Button type="submit" loading={mutation.isPending} disabled={!email || !password}>
            Log in
          </Button>
        </Stack>
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
