import { getAllUserNotes } from './db/notes/list-notes.ts'
import { getUserNote } from './db/notes/get-note.ts'
import { deleteUserNote } from './db/notes/delete-note.ts'
import { createUserNote } from './db/notes/create-note.ts'
import { updateUserNote } from './db/notes/update-note.ts'

type HandlerWithId = (request: Request, id: string) => Promise<Response>
type HandlerWithoutId = (request: Request) => Promise<Response>

type RouteHandler = HandlerWithoutId | HandlerWithId

interface Route {
	path: URLPattern
	handler: RouteHandler
}

const ALL_NOTES_ROUTES: Route[] = [
	{ path: new URLPattern({ pathname: '/notes' }), handler: getAllUserNotes },
	{
		path: new URLPattern({ pathname: '/notes/create' }),
		handler: createUserNote,
	},
	{
		path: new URLPattern({ pathname: '/notes/:id' }),
		handler: updateUserNote,
	},
	{
		path: new URLPattern({ pathname: '/notes/:id/view' }),
		handler: getUserNote,
	},
	{
		path: new URLPattern({ pathname: '/notes/delete/:id' }),
		handler: deleteUserNote,
	},
]

export const matchRoute = async (request: Request) => {
	const url = request.url

	for (const route of ALL_NOTES_ROUTES) {
		const match = route.path.exec(url)
		if (match) {
			if (match.pathname.groups && match.pathname.groups.id) {
				return await (route.handler as HandlerWithId)(
					request,
					match.pathname.groups.id,
				)
			} else {
				return await (route.handler as HandlerWithoutId)(request)
			}
		}
	}

	return new Response(
		JSON.stringify({
			message: `Route '${new URL(request.url).pathname}' not found`,
		}),
		{
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
}
