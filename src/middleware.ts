import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n/config";
import { updateSession } from "@/utils/supabase/middleware";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export async function middleware(request: NextRequest) {
  try {
    // 1. Update the Supabase session (Refreshes cookies)
    const { supabaseResponse, user, profile } = await updateSession(request);

    const pathname = request.nextUrl.pathname;
    const currentLocale = i18n.locales.find(l => pathname.startsWith(`/${l}/`)) || i18n.defaultLocale;

    // 2. Define route types
    const isAuthView = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/update-password') || pathname.includes('/forgot-password');
    
    const isProtectedRoute = 
      pathname.startsWith('/portal') || 
      pathname.startsWith('/admin') ||
      i18n.locales.some(locale => 
        pathname.startsWith(`/${locale}/portal`) || 
        pathname.startsWith(`/${locale}/admin`)
      );

    if (
      pathname.includes('.') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/auth/') ||
      pathname === '/favicon.ico'
    ) {
      return supabaseResponse;
    }

    // 3. Handle Ban Lockout (Priority Check)
    if (user && profile?.is_banned && !isAuthView) {
      const loginUrl = new URL(`/${currentLocale}/login?error=ACCESS_DENIED`, request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Refresh cookies but redirect to login
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }

    // 4. Handle Locale Redirection (Skipped for valid paths)
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      let locale = i18n.defaultLocale;
      try {
        locale = getLocale(request) || i18n.defaultLocale;
      } catch (e) {
        console.error("Locale detection failed", e);
      }
      
      const redirectUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }

    const isPublicPage = !isProtectedRoute && !isAuthView && !pathname.startsWith('/auth') && !pathname.startsWith('/api') && !pathname.includes('.');

    // Inverse Guard: Don't allow logged-in users to visit ANY public page
    const isPortalView = pathname.includes('/portal');
    const role = profile?.role || user?.user_metadata?.role;

    if (user && (isPublicPage || (isPortalView && role === 'admin'))) {
      const targetPath = role === 'admin' ? `/${currentLocale}/admin` : `/${currentLocale}/portal`;
      
      if (!pathname.startsWith(targetPath)) {
        const redirectUrl = new URL(targetPath, request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        return redirectResponse;
      }
    }

    // Auth Guard: Limit access to Login/Register if already logged in
    if (isAuthView && user && !pathname.includes('/update-password')) {
      const targetPath = role === 'admin' ? `/${currentLocale}/admin` : `/${currentLocale}/portal`;
      return NextResponse.redirect(new URL(targetPath, request.url));
    }

    // Protection Guard: Don't allow unauthenticated users into the Portal
    if (isProtectedRoute) {
      if (!user) {
        const loginUrl = new URL(`/${currentLocale}/login`, request.url);
        loginUrl.searchParams.set('next', pathname);
        
        const redirectResponse = NextResponse.redirect(loginUrl);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        return redirectResponse;
      }

      // Redirect unverified users to verify-email
      if (!user.email_confirmed_at && !pathname.includes('/verify-email')) {
        const verifyUrl = new URL(`/${currentLocale}/verify-email`, request.url);
        verifyUrl.searchParams.set('email', user.email || '');
        
        const redirectResponse = NextResponse.redirect(verifyUrl);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        return redirectResponse;
      }
    }

    return supabaseResponse;
  } catch (err) {
    console.error("Middleware crash", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
