'use client';

import React, { useState } from 'react';
import Card from '@/styled/card/Card';
import Textfield from '@/styled/textfield/Textfield';
import { Btn } from '@/styled/btn/Btn';
import Link from 'next/link';
import { API } from '@/utils/API';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';

const Page = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => API.post('/auth/signup', { email, password }),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <main style={{ margin: 'auto' }}>
      <Card className="flex col gap-2">
        <h1 className="h1 ">Sign Up</h1>

        <form className="flex col gap-2" onSubmit={onSubmit}>
          <Textfield
            label={'Email'}
            input={{
              name: 'email',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
          />
          <Textfield
            label={'Password'}
            input={{
              name: 'password',
              type: 'password',
              value: password,
              onChange: (e) => setPassword(e.target.value),
            }}
          />
          <Btn type="submit">Sign Up</Btn>
        </form>
        <Link href="/signin">Sign In</Link>
      </Card>
    </main>
  );
};

export default Page;
