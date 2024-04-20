'use client';

import React, { useState } from 'react';
import Card from '@/styled/card/Card';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { useRouter } from 'next/navigation';
import { Button, TextInput } from '@mantine/core';

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => API.post('/auth/signin', { email, password }),
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

  return (
    <main style={{ margin: 'auto' }}>
      <Card className="flex col gap-2">
        <h1 className="h1 ">Sign In</h1>

        <form className="flex col gap-2" onSubmit={onSubmit}>
          <TextInput
            label={'Email'}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label={'Password'}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" style={{ marginLeft: 'auto' }}>
            Sign In
          </Button>
        </form>
        <Link href="/signup" style={{ marginLeft: 'auto' }}>
          Sign Up
        </Link>
      </Card>
    </main>
  );
};

export default Page;
