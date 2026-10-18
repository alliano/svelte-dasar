import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rolldownOptions: {
      input: {
        index: "index.html",
        hello: "hello.html",
        todo: "todo.html",
        article: "article.html",
        time: "time.html",
        blog: "blog.html"
      }
    }
  }
})
