Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/binding`,
18 Oktober 2026, memakai Svelte 5.57.

# Binding dengan bind:value

Biasanya data di Svelte mengalir satu arah, dari parent turun ke child lewat props.
Namun kadang kita butuh arah sebaliknya, misalnya saat memakai element `<input>`:
yang tahu nilai terbarunya adalah input-nya, sedangkan yang butuh nilai itu adalah
kode kita.

Sebelum ini kita mengambil nilainya secara manual lewat DOM API, dan baru dibaca
saat tombolnya di-click.

``` svelte
<script>
  function save() {
    // nilainya baru kita ketahui saat save() dijalankan
    const input = document.getElementById(id);
    onedit(id, input.value);
  }
</script>

<input type="text" id={id} value={name}>
<button onclick={save}>Save</button>
```

Namun, ketika kita menggunakan binding kita tidak perlu melakukanya seperti contoh
diatas. Dengan `bind:value={state}`, attribute pada element disinkronkan dua arah
dengan variabel kita: user mengetik maka variabelnya ikut berubah, variabelnya kita
ubah dari script maka isi input-nya ikut berubah. Untuk lebih detail nya bisa
kunjungi disini https://svelte.dev/docs/svelte/bind

``` svelte
<script>
  let { id, name, onedit } = $props();

  function save() {
    // name sudah berisi apa yang diketik user, tidak perlu baca DOM lagi
    onedit(id, name);
  }
</script>

<!-- tidak perlu id lagi, karena kita tidak mencari element-nya -->
{id} - <input type="text" bind:value={name}>
<button onclick={save}>Save</button>
```

Karena binding-nya menulis ke variabel itu, variabelnya harus bisa di-assign. Jadi
hasil `$props()` yang kita bind harus di-destructure dengan `let`, bukan `const`.

``` svelte
<script>
  // ERROR: bind:value butuh menulis ke name, tapi const tidak bisa di-assign
  const { id, name, onedit } = $props();

  // BENAR
  let { id, name, onedit } = $props();
</script>
```

# Binding ke Props Milik Parent

Lalu kalau `name` itu props dari parent, apakah hasil editan-nya otomatis masuk ke
`todos` di parent ?? Ternyata tidak. Binding-nya hanya sampai di child; props biasa
sifatnya satu arah, jadi parent tidak tahu nilainya sudah berubah. Itulah sebabnya
kita masih perlu memanggil `onedit()` untuk melapor ke parent.

``` svelte
<script>
  let { id, name, onedit } = $props();

  function save() {
    // perubahan name TIDAK sampai ke parent dengan sendirinya,
    // jadi tetap harus dilaporkan lewat callback
    onedit(id, name);
  }
</script>
```

Kalau kita memang ingin binding-nya menembus sampai ke parent, props-nya harus
ditandai dengan [`$bindable()`](https://svelte.dev/docs/svelte/$bindable) di child,
lalu parent memanggil component-nya dengan `bind:`. Nilai di dalam `$bindable()`
dipakai sebagai default kalau parent-nya tidak melakukan binding.

Di child, props-nya kita tandai bindable.

``` svelte
<script>
  // name sekarang boleh ditulis balik ke parent
  let { id, name = $bindable(""), onedit } = $props();
</script>

<input type="text" bind:value={name}>
```

Di parent, kita pakai `bind:` saat memasang component-nya.

``` svelte
<!-- tanpa bind:, perubahan name di child tetap tidak naik ke sini -->
<EditTodo id={todo.id} bind:name={todo.name} onedit={onEdit}/>
```

Perlu dicatat, menulis ke props yang tidak bindable memang tidak error, tapi Svelte
akan memperingatkan kita di console dengan `ownership_invalid_mutation` dan
menyarankan memakai `bind:` atau callback. Jadi dua jalan itulah yang disediakan,
dan di latihan ini kita memilih callback.

# Bentuk bind: yang Lain

`bind:` bukan hanya untuk `value`. Pola namanya sama, yang berubah hanya attribute
yang kita sinkronkan, mengikuti jenis input-nya.

``` svelte
<script>
  let done = $state(false);
  let jumlah = $state(1);
  let catatan = $state("");
</script>

<!-- checkbox memakai checked, bukan value -->
<input type="checkbox" bind:checked={done}>

<!-- input number: Svelte mengubahnya jadi number, bukan string -->
<input type="number" bind:value={jumlah}>

<!-- textarea dan select polanya sama saja -->
<textarea bind:value={catatan}></textarea>
```

Ada juga `bind:this` yang mengikat variabel kita ke element DOM-nya, bukan ke
nilainya. Ini pengganti yang lebih tepat untuk `document.getElementById()` kalau kita
memang butuh element-nya sendiri, misalnya untuk memanggil `focus()`.

``` svelte
<script>
  // null dulu, karena element-nya belum ada saat script dijalankan
  let inputEl = $state(null);

  function fokus() {
    inputEl.focus();
  }
</script>

<!-- inputEl akan berisi element input ini, tanpa perlu id -->
<input type="text" bind:this={inputEl}>
<button onclick={fokus}>Fokus</button>
```
