import { matchRoute } from './routes.ts'
import { getRequestUser, asyncLocalStorage } from './utils.ts'

async function handler(request: Request): Promise<Response> {
	const user = getRequestUser(request)

	// authenticate user
	if (!user) {
		return new Response(JSON.stringify({ message: 'Unauthenticated' }), {
			status: 401,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	// generate a uique id to represent request
	const requestId = crypto.randomUUID()

	const response = await asyncLocalStorage.run({ user, requestId }, () => {
		return matchRoute(request)
	})

	// Set CORS headers
	response.headers.set('Access-Control-Allow-Origin', '*') // Allow all origins. Replace with your specific origin if needed.
	response.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	)
	response.headers.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, X-User',
	)
	response.headers.set('Access-Control-Allow-Credentials', 'true')

	// Handle preflight requests
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: response.headers,
		})
	}

	return response
}

Deno.serve(handler)
