import { z } from '../../deps.ts'
import { turso } from '../../turso-client.ts'
import { getAsyncStorageUser } from '../../utils.ts'

const formSchema = z
	.object({
		title: z
			.string({ required_error: 'Title is required' })
			.trim()
			.min(1, 'Title is required')
			.max(255, 'Title must not be more than 255 characters'),
		description: z
			.string({ invalid_type_error: 'Title must be a valid text' })
			.nullable(),
	})
	.required({ title: true })

export const createUserNote = async (request: Request) => {
	if (request.method !== 'POST') {
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
	const noteId = crypto.randomUUID()
	const userId = getAsyncStorageUser()
	const request_data = await request.json()
	const { error, data } = await formSchema.safeParseAsync(request_data)

	if (error) {
		return new Response(
			JSON.stringify({
				errors: error.formErrors.fieldErrors,
			}),
			{
				status: 422,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
	}

	await turso.execute({
		sql: 'INSERT INTO notes (id, user_id, title, description, created_at, updated_at)  VALUES (:id,:user_id,:title,:description,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
		args: {
			id: noteId,
			user_id: userId!,
			title: data.title,
			description: data.description,
		},
	})

	return new Response(null, {
		status: 204,
		headers: { 'Content-Type': 'application/json' },
	})
}
