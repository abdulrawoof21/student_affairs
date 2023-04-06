import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import {jwtVerify} from 'jose'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    console.log(new URL('/login', request.url))
    if(!(request.cookies.has('token'))){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log(request);
    const requestHeaders = new Headers(request.headers)
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })

    const token = request.cookies.get('token')?.value

    const j = jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
    // console.log(j);

    // console.log(token)
    try{
        const j = jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
    }catch(e) {
        response.headers.set('Set-Cookie', `token=;Secure;HTTPOnly;SameSite=Strict;path=/;Expires=0`)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}


export const config = {
    matcher: ['/api/:path', '/']
}
