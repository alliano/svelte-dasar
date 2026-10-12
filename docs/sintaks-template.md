# Sintaks Template
Markup yang ada di file `.svelte` itu HTML biasa, cuma ditambah beberapa sintaks yang dibaca oleh compiler. Nga ada `return`, nga ada JSX. Apa yang kita tulis diluar tag `<script>` itu sudah merupakan tampilanya.

Ada tiga tambahan yang dipakai di project ini : interpolasi, event handler, dan `<style>` yang otomatis ter-scope. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/basic-markup

# Interpolasi
Untuk menyisipkan nilai JavaScript kedalam markup, kita menggunakan kurung kurawal :
``` svelte
<h1>Counter: {count}</h1>
<p>my first name: {person.first_name}</p>
```

Isi dari kurung kurawal itu sebenernya ekspresi JavaScript penuh, bukan cuma nama variabel. Jadi kita juga bisa menulis operasi, pemanggilan fungsi, atau ternary didalamnya :
``` svelte
<p>{count * 2}</p>
<p>{person.first_name.toUpperCase()}</p>
<p>{count > 0 ? "sudah dihitung" : "belum"}</p>
```

Saat compile, Svelte mencatat variabel reaktif apa saja yang dibaca oleh ekspresi tersebut. Begitu salah satunya berubah, yang diperbarui cuma node teks itu saja, bukan seluruh komponenya di-render ulang. Inilah untungnya dibanding update `innerText` manual : hubungan antara data dan tempat tampilnya sudah dicatat oleh compiler, jadi nga perlu kita yang mengingat.

Untuk atribut, kurung kurawalnya ditaruh di posisi nilainya, dan jangan dibungkus tanda kutip karena hasilnya nanti malah jadi string :
``` svelte
<!-- benar -->
<input type="text" value={person.first_name} />
<img src={imageUrl} alt="foto" />

<!-- salah, nilainya jadi string biasa -->
<input type="text" value="{person.first_name}" />
```

# Event Handler
Di Svelte 5, event handler ditulis seperti atribut HTML biasa : `onclick`, `oninput`, `onsubmit`, dan seterusnya. Nilainya berupa fungsi :
``` svelte
<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<button type="button" onclick={increment}>increment</button>
```

Yang kita berikan ke `onclick` itu **referensi fungsinya**, bukan hasil pemanggilanya. Perbedaan ini sering banget jadi bug :
``` svelte
<!-- benar, fungsinya diserahkan ke Svelte -->
<button onclick={increment}>increment</button>

<!-- salah, fungsinya langsung jalan saat render -->
<button onclick={increment()}>increment</button>
```

Kalau fungsinya butuh argumen, kita bungkus pakai arrow function supaya pemanggilanya ketunda sampai event-nya kejadian :
``` svelte
<button onclick={() => count += 5}>+5</button>
<button onclick={() => hapus(item.id)}>hapus</button>
```

Di Svelte 4, event handler ditulis menggunakan directive dengan titik dua (`on:click={increment}`). Selain itu Svelte 4 juga punya event modifier bawaan seperti `on:submit|preventDefault`, yang di Svelte 5 sudah dihapus. Sekarang kita tulis manual didalam handler-nya :
``` svelte
<form onsubmit={(e) => { e.preventDefault(); simpan(); }}>
```

# Scoped Style
Tag `<style>` yang ditulis didalam komponen cuma berlaku untuk komponen itu sendiri. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/scoped-styles
``` svelte
<style>
  h1 {
    color: green;
  }
</style>

<h1 id="counter">Counter: 0</h1>
```

Saat compile, Svelte menambahkan sebuah class unik ke element-element komponen ini, lalu selectornya ditulis ulang jadi semacam `h1.s-xYz123`. Jadi `h1` di komponen lain nga ikut jadi hijau, walaupun selectornya kita tulis seluas itu.

Efek sampingnya, selector yang nga kepakai bakal dihapus dan muncul warning `unused css selector` saat build. Jadi kalau style kita menyasar element yang dibuat oleh komponen lain, selector itu bakal hilang. Untuk kasus seperti itu kita bisa menggunakan `:global(...)`.

Untuk style yang berlaku untuk seluruh aplikasi seperti reset, font, atau variabel warna, lebih cocok ditaruh di file CSS global seperti `src/app.css`, lalu di-import di entry point-nya :
``` js
import "./app.css";
```
