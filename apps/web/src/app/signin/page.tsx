'use client';

import React from 'react';
import Card from '@/styled/card/Card';
import Textfield from '@/styled/textfield/Textfield';
import { Btn } from '@/styled/btn/Btn';
import Link from 'next/link';

const page = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log(email, password);
  };

  return (
    <main style={{ margin: 'auto' }}>
      <Card className="flex col gap-2">
        <h1 className="h1 ">Sign In</h1>

        <form className="flex col gap-2" onSubmit={onSubmit}>
          <Textfield label={'Email'} input={{ name: 'email', type: 'email' }} />
          <Textfield label={'Password'} input={{ name: 'password', type: 'password' }} />
          <Btn type="submit">Sign In</Btn>
        </form>
        <Link href="/signup">Sign Up</Link>
      </Card>
    </main>
  );
};

export default page;
