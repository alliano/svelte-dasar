# Logic Block di Template Svelte

Catatan dari repo `belajar-svelte-dasar` (branch `feat/branching`, 16 Oktober 2026,
Svelte `^5.57.0`).

HTML tidak mengenal percabangan maupun pengulangan. Karena itu Svelte menambahkan
logic block, yaitu sintaks `{#...}` ... `{/...}` yang ditulis langsung di markup.

# Branching dengan {#if}

Biasanya kalau memakai JavaScript murni kita akan merakit string HTML-nya sendiri
dengan ternary atau `if`, lalu menyuntikanya ke DOM.

``` js
// cara manual, markup-nya jadi string
element.innerHTML = done
  ? `<strike>${id} - ${name}</strike>`
  : `${id} - ${name}`;
```

Namun di Svelte kita tidak perlu melakukanya seperti contoh diatas. Kita bisa
menuliskan percabanganya langsung di markup dengan block `{#if}`, dan markup-nya
tetap markup biasa. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/if

``` svelte
<script>
  let {id, done, name} = $props();
</script>

{#if done}
  <strike>{id} - {name}</strike>
{:else}
  {id} - {name}
{/if}
```

Setiap block `{#if}` wajib ditutup dengan `{/if}`. Bagian `{:else}` sifatnya opsional,
dan kalau kondisinya lebih dari dua cabang kita bisa memakai `{:else if}`.

``` svelte
{#if done}
  <strike>{name}</strike>
{:else if name === ""}
  <em>Todo tanpa nama</em>
{:else}
  {name}
{/if}
```

Yang ada di antara `{#if ...}` adalah expression JavaScript biasa, jadi aturan
truthy/falsy JavaScript berlaku disini. Ini sering jadi jebakan kalau prop-nya
dikirim sebagai string.

``` svelte
<!-- TIDAK seperti yang diharapkan: "false" adalah string yang truthy -->
<Todo id="1" name="Belajar Svelte" done="false"/>

<!-- boolean asli, harus pakai kurung kurawal -->
<Todo id="1" name="Belajar Svelte" done={false}/>
```

# Looping dengan {#each}

Kalau datanya berupa array, menuliskan component-nya satu per satu jelas tidak masuk
akal. Selain panjang, markup-nya juga tidak ikut berubah ketika isi array-nya
bertambah.

``` svelte
<!-- hardcode: tiap todo baru harus ditambah manual -->
<ul>
  <li><Todo id="1" name="Belajar Svelte" done={false}/></li>
  <li><Todo id="2" name="Belajar Graphql" done={true}/></li>
</ul>
```

Svelte menyediakan block `{#each}` untuk mengulang sebagian markup berdasarkan array.
Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/each

``` svelte
<script>
  import Todo from "./Todo.svelte";

  const todos = [
    { id: "1", name: "Belajar Svelte", done: false },
    { id: "2", name: "Belajar Graphql", done: true },
    { id: "3", name: "Belajar Rust", done: true }
  ]
</script>

<ul>
  {#each todos as todo}
    <!-- spread props, jadi field todo langsung jadi prop component Todo -->
    <li><Todo {...todo}/></li>
  {/each}
</ul>
```

Kalau kita butuh nomor urutnya, `{#each}` menyediakan index sebagai argumen kedua.
Dan untuk kasus array-nya kosong, ada block `{:else}` yang akan dipakai sebagai
fallback.

``` svelte
<ul>
  {#each todos as todo, index}
    <!-- index dimulai dari 0, jadi ditambah 1 untuk nomor tampilan -->
    <li>{index + 1}. <Todo {...todo}/></li>
  {:else}
    <li>Belum ada todo</li>
  {/each}
</ul>
```

Satu hal yang penting ketika daftarnya nanti bisa berubah: secara default Svelte
mencocokan item lama dan baru berdasarkan posisinya. Supaya Svelte tahu item mana
yang sebenarnya pindah atau dihapus, kita bisa memberi key lewat `(todo.id)`.

``` svelte
<!-- keyed each: todo.id dipakai sebagai identitas tiap item -->
{#each todos as todo (todo.id)}
  <li><Todo {...todo}/></li>
{/each}
```
