import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import ImportMetaEnvPlugin from '@import-meta-env/unplugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	build: {
		sourcemap: true,
	},
	plugins: [
		// ImportMetaEnvPlugin.vite({
		// 	example: '.env.example',
		// }),
		react(),
		VitePWA({
			includeAssets: ['vite.svg'],
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: 'index.html',
			},
			injectManifest: {
				globPatterns: ['**/*.{html,js,css,json,png,svg}'],
			},
			manifest: {
				start_url: '/',
				orientation: 'any',
				theme_color: '#ffffff',
				display: 'standalone',
				description: 'Manage your notes',
				name: 'My Notes',
				short_name: 'my_notes',
				related_applications: [],
				prefer_related_applications: false,
				display_override: ['window-controls-overlay'],
				categories: ['social', 'notes'],
				shortcuts: [
					{
						name: 'Open Notes',
						short_name: 'Notes',
						description: 'Open your notes',
						url: '/',
						icons: [{ src: 'assets/icons/192x192.png', sizes: '192x192' }],
					},
				],
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
