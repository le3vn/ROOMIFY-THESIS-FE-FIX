// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// This middleware checks if a user is authenticated before allowing access to certain pages
export function middleware(request: NextRequest) {
    // Define paths that should be protected
    const protectedPaths = ['/'];

    // Check if the request is for a protected path
    if (protectedPaths.includes(request.nextUrl.pathname)) {
        // Check if the user has a valid session
        const token = request.cookies.get('next-auth.session-token') || request.headers.get('Authorization');

        if (!token) {
            // If not authenticated, redirect to login page
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Allow the request to continue if no redirect occurs
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboardUser', '/dashboardApprover'], // Protect these pages
};
