// app/page.jsx
import { redirect } from 'next/navigation';
import Landing from './landing/page';

export default async function Home() {
  const user = await getCurrentUser(); // Returns user object or null/false

  if (user) {
    redirect('/dashboard'); 
  }

z
  return <Landing/>;
}