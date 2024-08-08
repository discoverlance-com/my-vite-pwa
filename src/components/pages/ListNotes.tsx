import ky, { HTTPError } from 'ky'

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	CardFooter,
	CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Note } from '@/types/notes'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const ListNotes = () => {
	const [notes, setNotes] = useState<Note[]>([])

	const fetchNotes = async () => {
		try {
			const response = await ky
				.get(
					'https://8000-idx-my-vite-pwa-1722787260905.cluster-wxkvpdxct5e4sxx4nbgdioeb46.cloudworkstations.dev/notes',
					{
						credentials: 'include',
						headers: {
							'X-User': '1234',
						},
					},
				)
				.json<{ notes: Note[]; total: number }>()
			setNotes(response.notes)
			console.log({ notes })
		} catch (error) {
			console.log({ error })
			if (error instanceof HTTPError) {
				const response = await error.response.json<{ message: string }>()
				toast.error(response.message)
				return
			}
			toast.error((error as { message: string }).message)
		}
	}

	useEffect(() => {}, [fetchNotes()])
	return (
		<div className="mt-8 mx-auto max-w-4xl">
			<ul className="grid grid-cols-2 gap-4 h-full">
				{notes.map((note) => (
					<li className="h-full" key={note.id}>
						<Card>
							<CardHeader>
								<CardTitle>{note.title}</CardTitle>
								<CardDescription>{new Date().toUTCString()}</CardDescription>
							</CardHeader>

							<CardContent>
								{/* trucate the note description text */}
								<p>
									Lorem ipsum dolor sit, amet consectetur adipisicing elit.
									Nostrum quisquam, id vero iusto voluptas qui cum
									necessitatibus et alias dolore quam...
								</p>
							</CardContent>

							<CardFooter className="justify-between">
								<Button variant="outline">Edit</Button>
								<Button variant="destructive">Delete</Button>
							</CardFooter>
						</Card>
					</li>
				))}
			</ul>
		</div>
	)
}
