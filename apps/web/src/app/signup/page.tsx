'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { API } from '@/utils/API';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { useRouter } from 'next/navigation';
import { parseErrorResponse, parseZodError } from '@/utils/parseErrorResponse';
import { Anchor, Button, Card, Flex, Stack, Text, TextInput } from '@mantine/core';

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => API.post('/auth/signup', { email, password }),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  const emailError = parseZodError(mutation.error, 'email');
  const passwordError = parseZodError(mutation.error, 'password');
  const errorMsg = parseErrorResponse(mutation.error);

  return (
    <main style={{ margin: 'auto' }}>
      <Card component="form" onSubmit={onSubmit} style={{ minWidth: 250 }}>
        <Stack gap="md">
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />
          {errorMsg && (
            <Text size="sm" c="red.8">
              {errorMsg}
            </Text>
          )}
          <Button type="submit">Sign Up</Button>
        </Stack>
      </Card>
      <Flex justify="center" gap="sm">
        <Text size="sm">Already have an account?</Text>
        <Anchor size="sm" component={Link} href="/signin">
          Log in
        </Anchor>
      </Flex>
    </main>
  );
};

export default Page;
