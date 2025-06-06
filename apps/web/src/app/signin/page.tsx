import LoginForm from './LoginForm';
import { SignInErrorCode } from './signInUtils';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const errorCode = (await searchParams).errorCode as SignInErrorCode | undefined;

  return <LoginForm errorCode={errorCode} />;
};

export default Page;
