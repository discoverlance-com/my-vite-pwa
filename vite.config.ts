import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import ImportMetaEnvPlugin from '@import-meta-env/unplugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// ImportMetaEnvPlugin.vite({
		// 	example: '.env.example',
		// }),
		react(),
		VitePWA({
			base: '/',
			includeAssets: ['vite.svg'],
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: 'index.html',
			},
			manifest: {
				theme_color: '#ffffff',
				display: 'standalone',
				description: 'Manage your notes',
				name: 'My Notes',
				short_name: 'my_notes',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
		}),
	],
	server: {
		cors: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
