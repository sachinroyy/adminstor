import { NextResponse } from 'next/server';

// const allowedOrigins = ['http://localhost:3001' , 'http://localhost:3000']; // Website origin
const allowedOrigins = ['https://adminstore-seven.vercel.app' , 'https://store-2b74.vercel.app']; // Website origin


export default function middleware(request) {
  const origin = request.headers.get('origin');
  const response = NextResponse.next();
  console.log('Request Origin:', origin);
  console.log('Allowed Origins:', allowedOrigins);

  // Always set the header, but only allow credentials for allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (origin) {
    response.headers.set('Access-Control-Allow-Origin', 'null');
    response.headers.delete('Access-Control-Allow-Credentials');
    console.log('Origin not allowed:', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

// 👇 This applies the middleware only to API routes
export const config = {
  matcher: '/api/:path*',
};
// console.log("hii im   workoing");