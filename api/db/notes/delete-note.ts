import { turso } from '../../turso-client.ts'

export const deleteUserNote = async (_request: Request, noteId: string) => {
	await turso.execute({
		sql: 'DELETE FROM notes WHERE id = (:id)',
		args: { id: noteId },
	})

	return new Response(null, {
		status: 204,
		headers: { 'Content-Type': 'application/json' },
	})
}
