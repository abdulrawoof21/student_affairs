import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import {jwtVerify} from 'jose'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    console.log("Middleware is running");
    const is_jwt_token_stored = request.cookies.has('token')

    if(request.nextUrl.pathname === '/api/login') return NextResponse.next()
    if(request.nextUrl.pathname === '/login' && !is_jwt_token_stored) return NextResponse.next()

    if(!is_jwt_token_stored) return NextResponse.redirect(new URL('/login', request.url))

    const requestHeaders = new Headers(request.headers)
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })

    const token = request.cookies.get('token')?.value

    try{
        await jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
        if(request.nextUrl.pathname === '/login') return NextResponse.redirect(new URL('/', request.url))
    }catch(e) {
        console.log(e);
        response.headers.set('Set-Cookie', `token=;Secure;HTTPOnly;SameSite=Strict;path=/;Expires=0`)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}


export const config = {
    matcher: '/((?!_next|static|public|favicon.ico).*)'
}
