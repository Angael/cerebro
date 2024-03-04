import { redirect } from "next/navigation";

export default function HomePage(props: any) {
  redirect("/browse");

  return null;
}
