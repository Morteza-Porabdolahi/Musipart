import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, 'pages/404.html'),
        artistMusics: resolve(__dirname, 'pages/artistmusics.html'),
        artists: resolve(__dirname, 'pages/artists.html'),
        dailyTop: resolve(__dirname, 'pages/daily-top.html'),
        newMusics: resolve(__dirname, 'pages/newmusics.html'),
        playlist: resolve(__dirname, 'pages/playlistpage.html'),
        playlists: resolve(__dirname, 'pages/playlists.html'),
        register: resolve(__dirname, 'pages/register.html'),
        search: resolve(__dirname, 'pages/search-musics.html'),
        singlemusicpage: resolve(__dirname, 'pages/singlemusicpage.html'),
        weeklyTop: resolve(__dirname, 'pages/weekly-top.html'),
      },
    },
  },
})