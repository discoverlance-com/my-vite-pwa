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

export const updateUserNote = async (request: Request, noteId: string) => {
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

	// check if not exists
	const foundNote = await turso.execute({
		sql: 'SELECT * FROM notes WHERE id = (:id)',
		args: { id: noteId },
	})

	if (foundNote.rows.length !== 1) {
		return new Response(
			JSON.stringify({
				message: 'Note not found',
			}),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
	}

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
		sql: 'UPDATE NOTES SET title = :title, description = :description, updated_at = CURRENT_TIMESTAMP WHERE id = :id AND user_id = :user_id',
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
