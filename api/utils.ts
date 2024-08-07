import { AsyncLocalStorage } from 'node:async_hooks'

export const asyncLocalStorage = new AsyncLocalStorage<{
	user: string
	requestId: string
}>()

export const getRequestUser = (request: Request) => {
	const url = new URL(request.url)
	const user = url.searchParams.get('user')
	// const user = request.headers.get('X-User')

	return user
}

export const getAsyncStorageUser = () => {
	const storage = asyncLocalStorage.getStore()

	return storage?.user
}

export const getAsyncStorageRequestId = () => {
	const storage = asyncLocalStorage.getStore()

	return storage?.requestId
}
