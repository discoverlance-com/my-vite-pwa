import { turso } from '../../turso-client.ts'
import { getAsyncStorageUser } from '../../utils.ts'

export const getAllUserNotes = async (_request: Request) => {
	const user = getAsyncStorageUser()

	const result = await turso.execute({
		sql: 'SELECT * FROM notes WHERE user_id = ?',
		args: [user!],
	})

	return new Response(
		JSON.stringify({ notes: result.rows, total: result.rows.length }),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
}
