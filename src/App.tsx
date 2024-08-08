import reactLogo from './assets/react.svg'
import { Toaster } from './components/ui/sonner'
import viteLogo from '/vite.svg'
import { ListNotes } from '@/components/pages/ListNotes'

function App() {
	return (
		<div className="container">
			<h1 className="text-5xl font-bold text-center">My Notes</h1>
			<ListNotes />
			<Toaster pauseWhenPageIsHidden richColors closeButton />
		</div>
	)
}

export default App
