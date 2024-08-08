import { useForm } from 'react-hook-form'
import { ZodError, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ky, { HTTPError } from 'ky'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useNotesStore } from '@/stores/notes'

const formSchema = z
	.object({
		title: z
			.string({ required_error: 'Title is required' })
			.max(255, 'Maximum of 255 characters'),
		description: z.string({ required_error: 'Description is required' }),
	})
	.required({ title: true, description: true })

export const CreateNote = () => {
	const { loadNotes } = useNotesStore()
	const [open, setOpen] = useState(false)
	const [userId] = useLocalStorage<string | null>('userId', null)

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await ky.post(
				`${import.meta.env.VITE_NOTES_API_URL}/notes/create?user=${userId}`,
				{
					json: values,
					credentials: import.meta.env.PROD ? undefined : 'include',
				},
			)
			form.reset()
			setOpen(false)
			// refetch the notes
			loadNotes(userId!)
		} catch (error) {
			if (error instanceof HTTPError) {
				const response = await error.response.json<{
					message: string
					errors?: ZodError<
						z.infer<typeof formSchema>
					>['formErrors']['fieldErrors']
				}>()
				toast.error(response.message)
				if (response.errors?.title) {
					form.setError('title', { message: response.errors.title[0] })
				}

				if (response.errors?.description) {
					form.setError('description', {
						message: response.errors.description[0],
					})
				}

				return
			}
			toast.error((error as { message: string }).message)
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Note</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new note</DialogTitle>
					<DialogDescription>
						Fill in the form to add a new note
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="title">Title</FormLabel>
									<FormControl>
										<Input id="title" placeholder="my note" {...field} />
									</FormControl>
									<FormDescription>This is your title</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="description">Description</FormLabel>
									<FormControl>
										<Textarea
											id="description"
											placeholder="i am goint to..."
											{...field}
										/>
									</FormControl>
									<FormDescription>This is your description</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							className="gap-4"
						>
							{form.formState.isSubmitting && (
								<Loader2Icon className="w-4 animate-spin h-4" />
							)}
							Save
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
