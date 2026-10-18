Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/event`,
18 Oktober 2026, memakai Svelte 5.57.

# Event Handler di Svelte 5

Saat membuat aplikasi frontend kita pasti sering menambahkan event listener pada
suatu element untuk memberi behavior ketika terjadi sesuatu, misalnya ketika
button di-click, ketika pointer menyorot sebuah element, atau ketika form
di-submit.

Kalau memakai DOM API biasa kita harus mencari element-nya dulu, lalu memasang
listener-nya, dan jangan lupa melepasnya kembali supaya tidak bocor.

``` js
const button = document.getElementById("add");
button.addEventListener("click", add);

// nanti harus dilepas sendiri
button.removeEventListener("click", add);
```

Namun, di Svelte 5 kita tidak perlu melakukanya seperti contoh diatas. Event
handler ditulis sebagai property biasa di element-nya dengan nama `on<namaEvent>`,
dan isinya sebuah function. Svelte yang akan memasang dan melepas listener-nya
mengikuti umur element tersebut. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/basic-markup#Events

``` svelte
<script>
  function add(e) {
    e.preventDefault();
    // ...
  }
</script>

<!-- menunjuk function yang ada di block script -->
<button onclick={add}>Add</button>

<!-- atau langsung sebagai closure, kalau logicnya pendek -->
<button onclick={() => console.log("di-click")}>Log</button>

<!-- nama event lain polanya sama saja -->
<input oninput={(e) => console.log(e.target.value)}>
<div onmouseenter={() => hover = true}></div>
```

Kalau kita membaca tutorial Svelte yang agak lama, kita akan menemukan bentuk
`on:click={add}` dengan tanda titik dua. Itu syntax Svelte 4, dan di Svelte 5
sudah diganti oleh bentuk property diatas. Karena repo ini memakai Svelte 5.57,
bentuk yang kita pakai adalah `onclick`, bukan `on:click`.

``` svelte
<!-- Svelte 4, jangan dipakai lagi di repo ini -->
<button on:click={add}>Add</button>

<!-- Svelte 5 -->
<button onclick={add}>Add</button>
```

# Mengirim Argument ke Handler

Masalahnya muncul ketika handler-nya butuh argument. Misalnya tombol remove di
setiap baris todo: fungsi `remove()` perlu tahu `id` todo mana yang di-click.
Kalau kita tulis seperti dibawah ini, fungsinya justru langsung dijalankan saat
element-nya di-render, lalu nilai kembalianya (`undefined`) yang dipasang sebagai
handler. Akibatnya semua todo malah hilang begitu halamanya dibuka, dan
tombolnya sendiri tidak melakukan apa-apa.

``` svelte
<!-- SALAH: remove() langsung dieksekusi saat render, bukan saat di-click -->
<button onclick={remove(todo.id)}>remove</button>
```

Yang kita perlukan adalah sebuah function yang baru dijalankan nanti. Jadi kita
bungkus pemanggilanya di dalam arrow function, dan arrow function itulah yang kita
pasang sebagai handler.

``` svelte
<script>
  let todos = $state([]);

  function remove(id) {
    todos = todos.filter(item => item.id !== id);
  }
</script>

<ul>
  {#each todos as todo}
    <li>
      <Todo {...todo}/>
      <!-- closure-nya menangkap todo.id milik baris ini -->
      <button onclick={() => remove(todo.id)}>remove</button>
    </li>
  {/each}
</ul>
```

Kalau selain argument kita juga butuh object event-nya, parameter arrow
function-nya tinggal kita isi, karena Svelte tetap mengirim event itu ke function
yang kita pasang.

``` svelte
<button onclick={(e) => { e.preventDefault(); remove(todo.id); }}>remove</button>
```

# Mencegah Behavior Default Browser

Masalah muncul ketika button-nya ada di dalam `<form>`. Secara default, button di
dalam form bertipe `submit`, dan browser akan me-reload halaman begitu form-nya
di-submit. Akibatnya state yang baru kita tambahkan hilang sebelum sempat terlihat.

Objek event yang masuk ke handler kita adalah event DOM biasa, jadi kita bisa
memakai `preventDefault()` untuk membatalkan behavior default itu.

``` svelte
<script>
  function add(e) {
    // tanpa baris ini halaman akan reload dan todo-nya hilang
    e.preventDefault();

    const input = document.getElementById("todo");
    todos.push({ id: id++, name: input.value });
    input.value = "";
  }
</script>

<form>
  <input type="text" id="todo">
  <button onclick={add}>Add</button>
</form>
```

Sebenarnya untuk kasus form, lebih tepat kalau handler-nya kita pasang di
`onsubmit` form-nya daripada di `onclick` button-nya. Dengan begitu menekan Enter
di dalam input juga ikut jalan, bukan hanya saat button-nya di-click.

``` svelte
<!-- jalan baik saat button di-click maupun saat Enter ditekan di input -->
<form onsubmit={add}>
  <input type="text" id="todo">
  <button>Add</button>
</form>
```

# Membaca Nilai Input: getElementById vs bind:value

Di latihan ini nilai input-nya kita ambil dengan `document.getElementById("todo")`.
Caranya jalan, tapi kita jadi mencampur dua gaya: datanya diurus Svelte lewat
`$state`, sedangkan input-nya kita urus sendiri lewat DOM API. Selain itu `id`
harus unik di satu halaman, jadi kalau component-nya dipakai dua kali di halaman
yang sama, keduanya akan membaca input yang sama.

Svelte punya cara yang lebih pas, yaitu `bind:value` yang menghubungkan input
dengan sebuah state dua arah. Kalau user mengetik, state-nya ikut berubah; kalau
state-nya kita ubah dari script, isi input-nya ikut berubah. Untuk lebih detail
nya bisa kunjungi disini https://svelte.dev/docs/svelte/bind

``` svelte
<script>
  let todos = $state([]);
  let name = $state("");   // menampung isi input
  let id = 1;

  function add(e) {
    e.preventDefault();
    todos.push({ id: id++, name });
    name = "";             // input-nya ikut jadi kosong
  }
</script>

<form onsubmit={add}>
  <!-- tidak perlu id, tidak perlu getElementById -->
  <input type="text" bind:value={name}>
  <button>Add</button>
</form>
```
