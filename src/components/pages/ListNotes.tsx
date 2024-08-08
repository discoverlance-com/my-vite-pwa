import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	CardFooter,
	CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateNote } from './CreateNote'
import { useNotesStore } from '@/stores/notes'
import { Skeleton } from '../ui/skeleton'
import { toast } from 'sonner'
import ky, { HTTPError } from 'ky'
import { useLocalStorage } from 'usehooks-ts'
import { useCallback, useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export const ListNotes = () => {
	const { loading, notes, loadNotes } = useNotesStore()
	const [openDialog, setOpenDialog] = useState(false)
	const [userId] = useLocalStorage<string | null>('userId', null)

	const deleteNote = useCallback(
		async (id: string) => {
			try {
				await ky.post(
					`${
						import.meta.env.VITE_NOTES_API_URL
					}/notes/delete/${id}?user=${userId}`,
					{
						credentials: import.meta.env.PROD ? undefined : 'include',
					},
				)
				// refetch the notes
				toast.info('Note deleted')
				loadNotes(userId!)
			} catch (error) {
				if (error instanceof HTTPError) {
					const response = await error.response.json<{
						message: string
					}>()
					toast.error(response.message)

					return
				}
				toast.error((error as { message: string }).message)
			}
		},
		[userId],
	)

	return (
		<div className="mt-8 mx-auto max-w-4xl">
			<ul className="grid grid-cols-2 gap-4 h-full">
				{loading &&
					new Array(6).fill(null).map((_, index) => (
						<li className="h-full" key={index}>
							<div className="space-y-2">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-36 w-full" />
							</div>
						</li>
					))}
				{!loading &&
					(notes.length > 0 ? (
						notes.map((note) => (
							<li className="h-full" key={note.id}>
								<Card>
									<CardHeader>
										<CardTitle>{note.title}</CardTitle>
										<CardDescription>{note.created_at}</CardDescription>
									</CardHeader>

									<CardContent>
										{/* trucate the note description text */}
										<p>
											{note.description?.length > 100
												? note.description.slice(0, 100) + '...'
												: note.description}
										</p>
									</CardContent>

									<CardFooter className="justify-between">
										<Button variant="outline">Edit</Button>
										<AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
											<AlertDialogTrigger asChild>
												<Button variant="destructive">Delete</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This will delete the note{' '}
														<strong>{note.title}</strong>
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														onClick={async (e) => {
															e.preventDefault()
															await deleteNote(note.id)
															setOpenDialog(false)
														}}
													>
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</CardFooter>
								</Card>
							</li>
						))
					) : (
						<li className="h-full flex flex-col items-center justify-center w-full col-span-full">
							<p className="text-muted-foreground font-bold text-xl mb-4">
								You have no notes added yet!
							</p>
							<CreateNote />
						</li>
					))}
			</ul>
		</div>
	)
}
