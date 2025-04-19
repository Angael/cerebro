'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { useRouter } from 'next/navigation';
import { Anchor, Button, Card, Flex, Stack, Text, TextInput } from '@mantine/core';
import { parseErrorResponse } from '@/utils/parseErrorResponse';

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => API.post('/auth/signin', { email, password }),
    onSettled: () => queryClient.invalidateQueries(),
    onSuccess: () => {
      window.location.href = '/';
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
          <Button type="submit" loading={mutation.isPending}>
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

export default Page;
