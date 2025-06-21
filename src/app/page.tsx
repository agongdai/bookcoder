import { BookMe } from '@/components/BookMe';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 bg-slate-900 text-white my-4 mx-auto max-w-[600px] rounded-lg shadow'>
      <BookMe />
    </div>
  );
}
