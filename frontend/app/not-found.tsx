import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-extrabold text-indigo-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8">Oops! The page you are looking for does not exist.</p>
      <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
        Go Back Home
      </Link>
    </div>
  )
}