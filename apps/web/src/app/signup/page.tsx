import LoginForm from '../signin/LoginForm';
import { SignInErrorCode } from '../signin/signInUtils';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: PageProps) => {
  const errorCode = (await searchParams).errorCode as SignInErrorCode | undefined;

  return <LoginForm isSignUp errorCode={errorCode} />;
};

export default Page;
