<script>

  // Store
  // Sebleum Svelte 5, untuk memnuat state diluar komponen, kita perlu menggunakan store, Namun sebenarnya di Svelte 5, kita bisa menggunakan Rune untuk memnuat Global/Universal State menggunakan
  // https://svelte.dev/docs/svelte/svelte-store 

  // Jenis Jenis Store
  // Store terdapat 2 jenis:
  // - Readable
  // - Writeable
  //
  // Readable menrupakan store yang nisa di baca datanya. Sedangkan Writeable merupakan store yang bisa dibaca dan diubah datanya
  // https://svelte.dev/docs/svelte/svelte-store
  // Untuk membuat store Readable, kita bisa menggunakan function readable(), sedagkan untuk membuat store writeable kita bisa menggunakan function writable()
  // Saat mengakses store, kita perlu mengguakan simbol $ di awal variable store
  import {counter} from "../state/counter.js";

  function increment() {
    $counter++;
  }
</script>


<button onclick={increment}>Increment {$counter}</button>
