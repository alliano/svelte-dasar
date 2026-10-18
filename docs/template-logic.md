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

# Menukar Component per Item dengan {#if} di dalam {#each}

Logic block boleh kita sarangkan, dan gabungan `{#each}` dengan `{#if}` di dalamnya
sangat berguna ketika setiap item punya dua tampilan. Contohnya daftar todo yang
tiap barisnya bisa masuk mode edit: baris yang sedang di-edit menampilkan
`<EditTodo>`, sedangkan baris lainya tetap menampilkan `<Todo>` beserta tombolnya.

Caranya kita simpan penanda mode-nya di item itu sendiri, misalnya field `edit`,
lalu `{#if}` membaca field tersebut.

``` svelte
<ul>
  {#each todos as todo}
    <li>
      <!-- todo.edit menentukan tampilan baris ini, bukan tampilan seluruh daftar -->
      {#if todo.edit}
        <EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>

      {:else}
        <Todo {...todo}/>
        <button onclick={() => remove(todo.id)}>remove</button>
        <button onclick={() => edit(todo.id)}>Edit</button>
      {/if}
    </li>
  {/each}
</ul>
```

Karena penandanya menempel di masing-masing item, mode-nya berdiri sendiri per
baris. Kalau penandanya kita taruh sebagai satu state di component-nya, misalnya
`let editing = $state(false)`, semua baris akan ikut masuk mode edit sekaligus.

``` svelte
<script>
  // satu penanda untuk semua baris: semuanya ikut berubah bersamaan
  let editing = $state(false);
</script>

{#each todos as todo}
  <!-- SALAH kalau yang kita mau cuma satu baris yang di-edit -->
  {#if editing}
    <EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>
  {/if}
{/each}
```

Alternatifnya, kita simpan `id` todo yang sedang di-edit di satu state, lalu
membandingkanya di dalam `{#if}`. Dengan cara ini `todos` tetap bersih dari field
yang sebenarnya bukan data todo, dan hanya satu baris yang bisa terbuka sekaligus.

``` svelte
<script>
  // null artinya tidak ada baris yang sedang di-edit
  let editingId = $state(null);
</script>

{#each todos as todo}
  {#if todo.id === editingId}
    <EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>
  {:else}
    <Todo {...todo}/>
    <button onclick={() => editingId = todo.id}>Edit</button>
  {/if}
{/each}
```

# Menunggu Promise dengan {#await}

Ketika datanya tidak langsung ada, misalnya harus di-`fetch` dulu dari server, kita
punya tiga kemungkinan tampilan: masih loading, sudah berhasil, atau gagal. Biasanya
kita akan menampung ketiga kondisi itu di dalam state sendiri, lalu mengatur
tampilanya dengan `{#if}`.

``` svelte
<script>
  let loading = $state(true);
  let articles = $state([]);
  let error = $state(null);

  // semua kondisi harus kita urus manual
  fetch("/article.json")
    .then((response) => response.json())
    .then((data) => articles = data)
    .catch((e) => error = e)
    .finally(() => loading = false);
</script>
```

Namun di Svelte kita tidak perlu melakukanya seperti contoh diatas. Svelte punya
block `{#await}` yang mengerti Promise, jadi ketiga kondisi tadi cukup ditulis
sebagai tiga cabang di markup. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/await

``` svelte
<script>
  async function getArticle() {
    let response = await fetch("/article.json");
    return await response.json();
  }
</script>

{#await getArticle()}
  <!-- selama Promise masih pending -->
  <p>Loading...</p>
{:then articles}
  <!-- articles adalah nilai hasil resolve Promise-nya -->
  {#each articles as article}
    <h1>{article.tittle}</h1>
    <p>{article.content}</p>
  {/each}
{:catch error}
  <!-- dipakai kalau Promise-nya reject atau fetch-nya gagal -->
  <p>Error: {error.message}</p>
{/await}
```

Yang ditulis setelah `{#await ...}` adalah expression yang menghasilkan Promise, dan
di contoh diatas function `getArticle()` memang dipanggil langsung disitu. Kalau kita
tidak butuh tampilan loading, bagian pending-nya bisa dilewati dengan menulisnya
dalam satu baris, dan `{:catch}` juga sifatnya opsional.

``` svelte
<!-- langsung ke hasilnya, tanpa cabang loading -->
{#await getArticle() then articles}
  {#each articles as article}
    <h1>{article.tittle}</h1>
  {/each}
{/await}
```

Satu hal yang perlu diingat: expression di dalam `{#await}` akan dievaluasi ulang
setiap kali bagian itu ikut ter-render ulang. Jadi kalau component-nya punya state
yang berubah, `getArticle()` berpotensi dipanggil berkali-kali.

``` svelte
<script>
  let count = $state(0);

  async function getArticle() {
    let response = await fetch("/article.json");
    return await response.json();
  }

  // Promise-nya dibuat sekali saja, jadi fetch tidak terpanggil ulang
  const articlePromise = getArticle();
</script>

<button onclick={() => count++}>{count}</button>

<!-- HATI-HATI: setiap count berubah, fetch-nya jalan lagi -->
{#await getArticle() then articles}
  {articles.length}
{/await}

<!-- aman: yang di-await adalah Promise yang sudah ada -->
{#await articlePromise then articles}
  {articles.length}
{/await}
```

Perlu dicatat juga bahwa `fetch` hanya menolak Promise-nya kalau koneksinya yang
gagal. Response dengan status 404 atau 500 tetap dianggap berhasil, jadi kalau kita
mau status itu masuk ke `{:catch}`, kita harus melemparkan error-nya sendiri.

``` js
async function getArticle() {
  let response = await fetch("/article.json");

  // tanpa baris ini, 404 akan lolos ke {:then} dan gagal saat parsing JSON
  if (!response.ok) throw new Error(`Gagal memuat artikel: ${response.status}`);

  return await response.json();
}
```
