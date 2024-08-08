import { matchRoute } from './routes.ts'
import { getRequestUser, asyncLocalStorage } from './utils.ts'

const frontendOrigin = '*' // Replace with your actual frontend origin
export function setCorsHeaders(response: Response) {
	response.headers.set('Access-Control-Allow-Origin', frontendOrigin)
	response.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	)
	response.headers.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, X-User',
	)
	response.headers.set('Access-Control-Allow-Credentials', 'true')
}

async function handler(request: Request): Promise<Response> {
	// Handle preflight requests
	if (request.method === 'OPTIONS') {
		const response = new Response(null, { status: 204 })
		setCorsHeaders(response)
		return response
	}

	const user = getRequestUser(request)

	// authenticate user
	if (!user) {
		const response = new Response(
			JSON.stringify({ message: 'User is Unauthenticated' }),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			},
		)
		setCorsHeaders(response)
		return response
	}

	// generate a uique id to represent request
	const requestId = crypto.randomUUID()

	const response = await asyncLocalStorage.run({ user, requestId }, () => {
		return matchRoute(request)
	})

	setCorsHeaders(response)

	return response
}

Deno.serve(handler)
