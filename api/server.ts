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

	return await asyncLocalStorage.run({ user, requestId }, () => {
		return matchRoute(request)
	})
}
Deno.serve(handler)
