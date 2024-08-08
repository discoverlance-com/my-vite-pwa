import ky, { HTTPError } from 'ky'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	CardFooter,
	CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type Note } from '@/types/notes'
import { CreateNote } from './CreateNote'

export const ListNotes = () => {
	const [userId, setUserId] = useLocalStorage<string | null>('userId', null)
	const [notes, setNotes] = useState<Note[]>([])

	const fetchNotes = async (userId: string) => {
		try {
			const response = await ky
				.get(`${import.meta.env.VITE_NOTES_API_URL}/notes?user=${userId}`, {
					credentials: import.meta.env.PROD ? undefined : 'include',
				})
				.json<{ notes: Note[]; total: number }>()
			setNotes(response.notes ?? [])
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

	useEffect(() => {
		if (window !== undefined) {
			// create a random uuid in the browser
			if (!userId) {
				const userId = crypto.randomUUID()
				setUserId(userId)
				fetchNotes(userId)
			} else {
				fetchNotes(userId)
			}
		}
	}, [])
	return (
		<div className="mt-8 mx-auto max-w-4xl">
			<ul className="grid grid-cols-2 gap-4 h-full">
				{notes.length > 0 ? (
					notes.map((note) => (
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
					))
				) : (
					<li>
						<p className="text-muted-foreground font-bold text-xl mb-4">
							No Notes Found
						</p>
						<CreateNote />
					</li>
				)}
			</ul>
		</div>
	)
}
