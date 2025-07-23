import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard on page load
  redirect('/Deshboard/deshboard');
  
  // This return won't be reached due to the redirect
  return null;
}