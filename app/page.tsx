import { redirect } from 'next/navigation';

export default function Home() {
  // This sends users directly to your login page
  redirect('/login');
}
