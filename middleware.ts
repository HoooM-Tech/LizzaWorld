import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    // Check if the request is for an asset or API (we might want to allow some)
    const { pathname } = request.nextUrl;
    
    // Bypass for static assets and images to ensure the layout/images can still load if needed, 
    // but here we are returning a full HTML page so we only care about the main routes.
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') // usually static files like .png, .jpg, .ico
    ) {
      return NextResponse.next();
    }

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lizza Atelier — Refining the Experience</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet">
        <style>
          :root {
            --ivory: #F5F5F1;
            --charcoal: #333333;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: var(--ivory);
            color: var(--charcoal);
            font-family: 'Lato', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
          .container {
            max-width: 600px;
            padding: 40px;
            animation: fadeIn 1.2s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          h1 {
            font-family: 'Playfair Display', serif;
            font-weight: 400;
            font-size: 2.5rem;
            margin-bottom: 24px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          p {
            font-size: 1.1rem;
            line-height: 1.6;
            font-weight: 300;
            margin-bottom: 32px;
          }
          .logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            letter-spacing: 0.2em;
            margin-bottom: 60px;
            text-transform: uppercase;
          }
          .divider {
            width: 40px;
            height: 1px;
            background-color: var(--charcoal);
            margin: 0 auto 32px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Lizza Atelier</div>
          <div class="divider"></div>
          <h1>Refining the Experience</h1>
          <p>We are currently performing scheduled maintenance to enhance our digital atelier. Our services will be restored shortly.</p>
          <div class="divider"></div>
          <p style="font-size: 0.9rem; opacity: 0.6;">&copy; ${new Date().getFullYear()} Lizza Atelier</p>
        </div>
      </body>
      </html>
      `,
      {
        status: 503,
        headers: {
          'Content-Type': 'text/html',
          'Retry-After': '3600',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
