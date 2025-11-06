import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    // Fungsi ini akan mencoba me-refresh sesi jika ada.
    // Jika tidak ada sesi (pengguna tidak login), ia akan melempar error yang kita tangkap.
    await supabase.auth.getUser()
  } catch (error) {
    // Ini adalah error yang tidak kritis dan bisa terjadi jika refresh token tidak ditemukan.
    // Kita bisa mengabaikannya dan membiarkan permintaan berlanjut.
    // Anda bisa menambahkan console.log di sini jika ingin melihat errornya, tapi tidak wajib.
  }
  // -------------------------

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}