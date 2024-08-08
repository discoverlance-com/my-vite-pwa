import { CreateNote } from './components/pages/CreateNote'
import { Toaster } from './components/ui/sonner'
import { ListNotes } from '@/components/pages/ListNotes'

function App() {
	return (
		<div className="container">
			<div className="gap-4 flex flex-wrap justify-between items-center mt-4">
				<h1 className="text-5xl font-bold text-center">My Notes</h1>
				<CreateNote />
			</div>
			<ListNotes />
			<Toaster pauseWhenPageIsHidden richColors closeButton />
		</div>
	)
}

export default App
