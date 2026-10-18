Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/event`,
18 Oktober 2026, memakai Svelte 5.57.

# Reactive State dengan $state

Di latihan sebelumnya data todo-nya masih kita tulis tangan sebagai array biasa,
lalu kita render dengan `{#each}`. Selama datanya tidak pernah berubah hal itu
tidak masalah. Namun begitu kita mulai menambah atau menghapus todo, array biasa
tidak akan membuat tampilanya ikut berubah, karena Svelte tidak tahu kapan
datanya kita ubah.

Supaya Svelte tahu, kita harus menandai datanya sebagai state dengan Rune
`$state(nilaiAwal)`. Semua yang kita simpan di dalamnya akan diawasi, dan setiap
kali nilainya berubah bagian template yang memakainya akan di-render ulang.
Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/$state

``` svelte
<script>
  // array biasa: Svelte tidak akan tahu kalau isinya kita ubah
  const todosBiasa = [];

  // array state: setiap perubahan isinya memicu render ulang
  let todos = $state([]);
</script>
```

# Mengubah Isi State vs Mengganti State

Ada dua cara mengubah state yang berisi array, dan di latihan ini kebetulan
dua-duanya kita pakai. Saat menambah todo kita memanggil `push()`, yang berarti
kita hanya mengubah isi array-nya; variabel `todos` tetap menunjuk array yang
sama. Sedangkan saat menghapus todo kita memakai `filter()`, yang tidak mengubah
array lama tapi mengembalikan array baru, lalu array baru itu kita assign ke
`todos`.

``` svelte
<script>
  let todos = $state([]);
  let id = 1;

  function add(name) {
    // mengubah isi array, variabelnya tidak diganti
    todos.push({ id: id++, name });
  }

  function remove(id) {
    // filter mengembalikan array baru, jadi variabelnya kita assign ulang
    todos = todos.filter(item => item.id !== id);
  }
</script>
```

Keduanya sama-sama reaktif, jadi kita bebas memilih. Tapi ada konsekuensinya di
cara mendeklarasikan variabelnya. Kalau kita hanya akan mengubah isinya,
`const todos = $state([])` masih sah, karena `push()` tidak mengganti variabelnya.
Begitu ada satu saja tempat yang meng-assign ulang seperti `remove()` diatas,
variabelnya harus `let`.

``` svelte
<script>
  const todos = $state([]);

  function remove(id) {
    // ERROR: Assignment to constant variable
    todos = todos.filter(item => item.id !== id);
  }
</script>
```

Kalau kita tetap ingin memakai `const`, hapusnya bisa dengan `splice()` yang
mengubah isi array tanpa mengganti variabelnya. Untuk mencari posisinya kita pakai
`findIndex()`.

``` svelte
<script>
  const todos = $state([]);

  function remove(id) {
    const index = todos.findIndex(item => item.id === id);
    // -1 artinya tidak ditemukan, jangan di-splice
    if (index !== -1) todos.splice(index, 1);
  }
</script>
```

# Deep Reactivity

Lalu gimana dong kalau isi state-nya bukan angka atau string, tapi object atau
array ?? Di framework lain biasanya kita harus repot membuat object baru supaya
perubahanya terdeteksi. Di Svelte kita tidak perlu melakukan itu, karena `$state`
membungkus object dan array-nya dengan Proxy. Jadi perubahan sampai ke dalam-dalam
pun tetap terbaca — inilah yang disebut deep reactivity.

``` svelte
<script>
  let todos = $state([]);

  // ketiga-tiganya reaktif, tampilanya langsung ikut berubah
  todos.push({ id: 1, name: "Belajar Svelte", done: false });
  todos[0].done = true;   // ubah field di dalam object
  todos.splice(0, 1);     // hapus element dari array
</script>
```

Kalau ternyata kita tidak butuh pengawasan sedalam itu, misalnya datanya besar
dan hanya akan diganti utuh, ada [`$state.raw`](https://svelte.dev/docs/svelte/$state)
yang lebih murah karena tidak memakai Proxy. Konsekuensinya perubahan di dalam
object-nya tidak akan terlihat.

``` svelte
<script>
  let todos = $state.raw([]);

  // TIDAK reaktif: $state.raw tidak melihat perubahan isi
  todos.push({ id: 1, name: "Belajar Svelte" });

  // reaktif: variabelnya diganti dengan array yang baru
  todos = [...todos, { id: 1, name: "Belajar Svelte" }];
</script>
```

# Melihat Isi State dengan $inspect

Saat state-nya mulai berubah-ubah, kita pasti ingin tahu nilainya sekarang berapa.
Biasanya kita akan menyelipkan `console.log()` di dalam fungsi yang mengubahnya.
Masalahnya kita harus menaruh `console.log()` itu di setiap tempat yang mengubah
state tersebut, dan gampang ada yang kelewat.

Namun, di Svelte kita bisa menggunakan Rune `$inspect(state)` yang akan otomatis
mencatat nilainya setiap kali state-nya berubah, tanpa peduli dari mana
perubahanya datang. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/$inspect

``` svelte
<script>
  let todos = $state([]);

  // mencetak isi todos setiap kali berubah
  $inspect(todos);
</script>
```

Kalau kita mau mengatur sendiri bentuk log-nya, `$inspect` punya method `.with()`
yang menerima sebuah callback. Callback itu dipanggil dengan dua argument: `type`
yang berisi `"init"` saat pertama kali dijalankan atau `"update"` saat state-nya
berubah, dan `value` yang berisi nilai state-nya.

``` svelte
<script>
  let todos = $state([]);

  // type: "init" sekali di awal, lalu "update" setiap ada perubahan
  $inspect(todos).with((type, value) => console.log(type, value));

  // bisa juga dipakai untuk menghentikan eksekusi di titik perubahanya
  $inspect(todos).with(console.trace);
</script>
```

Satu hal yang perlu diingat, `$inspect` hanya hidup saat development. Ketika kita
jalankan `npm run build`, pemanggilanya akan dibuang oleh compiler, jadi aman
kalau lupa dihapus.
