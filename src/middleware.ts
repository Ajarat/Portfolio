import { defineMiddleware } from "astro/middleware";


const VALID_USERNAME = 'mjc'
const VALID_PASSWORD = 'designs'


export const onRequest = defineMiddleware((context, next) => {

    const { url, headers } = context.request
    const { pathname } = new URL(url)

    if (pathname === '/') {
        return next() 
    } 
    
    const creds = parseCredentials(headers)
    if (creds && validateCredentials(creds)) {
        return next()
    }
        
    return new Response('', { status: 401, headers: {
        'WWW-Authenticate': `Basic realm="Morgan's private portfolio"` 
    }})
});

type Credentials = {
    username: string
    password: string
}

function validateCredentials(creds: Credentials): boolean {
    return creds?.username === VALID_USERNAME && creds.password === VALID_PASSWORD
}

function parseCredentials(headers: Headers): Credentials | undefined {
    try {
        const creds = headers.get('authorization')?.replace(/^basic\s/i, '')
        if (creds) {
            const [username, password] = atob(creds).split(':')
            return { username, password }
        }        
    } catch (e) {
        return
    }
    
}