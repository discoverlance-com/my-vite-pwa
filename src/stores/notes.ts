import { Note } from '@/types/notes'
import ky from 'ky'
import { create } from 'zustand'

interface NoteState {
	notes: Note[]
	loading: boolean
	loadNotes: (userId: string) => void
}

export const useNotesStore = create<NoteState>()((set) => ({
	notes: [],
	loading: false,
	loadNotes: async (userId) => {
		set({ loading: true })
		const response = await ky
			.get(`${import.meta.env.VITE_NOTES_API_URL}/notes?user=${userId}`, {
				credentials: import.meta.env.PROD ? undefined : 'include',
			})
			.json<{ notes: Note[]; total: number }>()
		set({ notes: response.notes, loading: false })
	},
}))
