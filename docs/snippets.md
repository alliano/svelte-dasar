Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/snipped-render`,
18 Oktober 2026, memakai Svelte 5.57.

# Snippet

Ketika markup kita mulai panjang, biasanya kita memecahnya jadi component baru di
file tersendiri. Untuk potongan yang hanya dipakai di satu tempat, cara itu terasa
berlebihan: kita harus membuat file, meng-import-nya, lalu memikirkan props apa saja
yang perlu dikirim hanya supaya potonganya bisa membaca state yang tadinya ada di
sebelahnya.

``` svelte
<!-- harus kirim props satu-satu, padahal editingId tadinya cuma di atas -->
<TodoRow {todo} {editingId} onremove={remove} onedit={edit}/>
```

Namun, di Svelte kita tidak perlu melakukanya seperti contoh diatas. Kita bisa
membuat Snippet, yaitu potongan markup yang bisa dipakai berulang tapi tetap tinggal
di file yang sama. Bentuknya `{#snippet nama(param)}` ... `{/snippet}`. Untuk lebih
detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/snippet

``` svelte
{#snippet todoRow(todo)}
  <li>
    <Todo {...todo}/>
    <button onclick={() => remove(todo.id)}>remove</button>
  </li>
{/snippet}
```

Karena snippet-nya masih di component yang sama, dia bisa membaca state dan function
di sekitarnya tanpa dikirim sebagai parameter. Di latihan ini `todo` dikirim sebagai
parameter karena memang berbeda tiap baris, sedangkan `editingId`, `remove()`, dan
`edit()` cukup dibaca langsung.

``` svelte
{#snippet todoRow(todo)}
  <li>
    <!-- editingId tidak perlu jadi parameter, dia state di component ini -->
    {#if todo.id === editingId}
      <EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>
    {:else}
      <Todo {...todo}/>
      <button onclick={() => remove(todo.id)}>remove</button>
      <button onclick={() => edit(todo.id)}>Edit</button>
    {/if}
  </li>
{/snippet}
```

# Menampilkan Snippet dengan @render

Membuat snippet saja tidak menampilkan apa pun. Dia baru muncul kalau kita
memanggilnya dengan `{@render nama(argument)}`, mirip seperti memanggil function.
Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/@render

``` svelte
<ul>
  {#each todos as todo (todo.id)}
    <!-- tiap todo dirender memakai snippet yang sama -->
    {@render todoRow(todo)}
  {/each}
</ul>
```

Karena pemanggilanya memang mirip function, kita bisa memanggilnya dari beberapa
tempat sekaligus, dan urutan penulisanya tidak harus deklarasi dulu baru dipakai.

``` svelte
<!-- dipanggil disini, padahal snippet-nya ditulis di bawah -->
{@render sapaan("Kim")}

{#snippet sapaan(nama)}
  <h1>Hello {nama}</h1>
{/snippet}

{@render sapaan("Alliano")}
```

Snippet juga boleh memanggil dirinya sendiri, yang berguna untuk data bersarang
seperti daftar komentar atau menu bertingkat.

``` svelte
{#snippet daftar(items)}
  <ul>
    {#each items as item}
      <li>
        {item.nama}
        <!-- anaknya dirender dengan snippet yang sama -->
        {#if item.anak}{@render daftar(item.anak)}{/if}
      </li>
    {/each}
  </ul>
{/snippet}
```

# Snippet sebagai Props

Snippet bukan cuma untuk dipakai sendiri. Dia juga bisa kita kirim ke component lain
sebagai props, sehingga parent-lah yang menentukan bentuk tampilanya sedangkan child
hanya mengatur susunanya.

``` svelte
<script>
  import TodoList from "./TodoList.svelte";
</script>

{#snippet todoRow(todo)}
  <li>{todo.name}</li>
{/snippet}

<!-- snippet dikirim seperti props biasa -->
<TodoList {todos} row={todoRow}/>
```

Di component penerimanya, snippet itu kita ambil dari `$props()` lalu kita render.

``` svelte
<script>
  let { todos, row } = $props();
</script>

<ul>
  {#each todos as todo (todo.id)}
    {@render row(todo)}
  {/each}
</ul>
```

Kalau snippet-nya kita tulis di dalam tag component-nya, dia otomatis jadi props
dengan nama yang sama, jadi tidak perlu dikirim manual.

``` svelte
<TodoList {todos}>
  {#snippet row(todo)}
    <li>{todo.name}</li>
  {/snippet}
</TodoList>
```

# Children

Markup biasa yang kita tulis di dalam tag component juga sebenarnya sebuah snippet,
namanya `children`. Jadi untuk menampilkan isi yang dikirim parent, kita render
snippet itu.

``` svelte
<!-- Card.svelte -->
<script>
  let { children } = $props();
</script>

<div class="card">
  {@render children()}
</div>
```

Dengan begitu pemakaianya jadi seperti element biasa.

``` svelte
<Card>
  <h1>Hello</h1>
  <p>Ini isi card-nya</p>
</Card>
```

Hati-hati kalau isinya memang boleh kosong. `children` akan `undefined` ketika parent
tidak mengirim apa-apa, dan memanggilnya langsung akan melempar error karena yang
kita panggil bukan function. Karena itu kita panggil dengan optional chaining.

``` svelte
<!-- ERROR kalau <Card/> dipakai tanpa isi: children bukan function -->
{@render children()}

<!-- aman: tidak merender apa pun kalau children tidak dikirim -->
{@render children?.()}
```

Kalau kita membaca tutorial Svelte 4, isi component diambil dengan `<slot/>`, dan
potongan bernama memakai `<slot name="...">`. Keduanya sudah digantikan oleh snippet
di Svelte 5 — kalau tetap kita pakai di component ber-Rune, compiler-nya
memperingatkan dengan `slot_element_deprecated`.

``` svelte
<!-- Svelte 4, jangan dipakai lagi di repo ini -->
<div class="card">
  <slot/>
</div>
```
