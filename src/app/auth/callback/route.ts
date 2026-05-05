import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Preserve the intended destination, defaulting to a localized portal home
  const next = searchParams.get('next') ?? '/en/portal';
  
  // Robust locale detection from the 'next' parameter
  const pathSegments = next.split('/').filter(Boolean);
  const locale = pathSegments[0] || 'en';

  console.log("DEBUG: Auth Callback hit. Next:", next, "Locale:", locale, "Origin:", origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('Auth verification error:', error);
  }

  // Redirect to localized login with standardized error code
  return NextResponse.redirect(`${origin}/${locale}/login?error=AUTH_INVALID_CREDENTIALS`);
}
