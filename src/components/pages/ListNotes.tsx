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

export const ListNotes = () => {
	const { loading, notes } = useNotesStore()

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
											{note.description.length > 100
												? note.description.slice(0, 100) + '...'
												: note.description}
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
