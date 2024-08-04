import { turso } from '../../turso-client.ts'

export const getUserNote = async (_request: Request, noteId: string) => {
	const note = await turso.execute({
		sql: 'SELECT * FROM notes WHERE id = (:id)',
		args: { id: noteId },
	})

	if (note.rows.length !== 1) {
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

	return new Response(JSON.stringify({ note: note.rows[0] }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	})
}
