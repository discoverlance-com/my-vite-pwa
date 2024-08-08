import { useEffect } from 'react'
import { CreateNote } from './components/pages/CreateNote'
import { Toaster } from './components/ui/sonner'
import { ListNotes } from '@/components/pages/ListNotes'
import { useNotesStore } from './stores/notes'
import { useLocalStorage } from 'usehooks-ts'
import { ThemeProvider } from './providers/ThemeProvider'

function App() {
	const { loadNotes } = useNotesStore()
	const [userId, setUserId] = useLocalStorage<string | null>('userId', null)

	// load notes
	useEffect(() => {
		if (window !== undefined) {
			// create a random uuid in the browser
			if (!userId) {
				const userId = crypto.randomUUID()
				setUserId(userId)
				loadNotes(userId)
			} else {
				loadNotes(userId)
			}
		}
	}, [])
	return (
		<ThemeProvider>
			<div className="container">
				<div className="gap-4 flex flex-wrap justify-between items-center mt-4">
					<h1 className="text-5xl font-bold text-center">My Notes</h1>
					<CreateNote />
				</div>
				<ListNotes />
				<Toaster pauseWhenPageIsHidden richColors closeButton />
			</div>
		</ThemeProvider>
	)
}

export default App
