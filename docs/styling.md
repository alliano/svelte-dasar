Catatan dari latihan di repo `belajar-svelte-dasar`, branch `feat/style`,
18 Oktober 2026, memakai Svelte 5.57.

# Scoped Style di Dalam Component

Biasanya kalau menulis CSS biasa, semua selector-nya berlaku untuk seluruh halaman.
Karena itu kita harus hati-hati menamai class, dan tidak jarang akhirnya memakai
penamaan panjang seperti `.todo-edit-btn` supaya tidak bertabrakan dengan class
lain di halaman yang sama.

Namun, di Svelte kita tidak perlu melakukan itu. CSS yang kita tulis di dalam tag
`<style>` sebuah component hanya berlaku untuk markup di component itu saja. Jadi
nama class yang sama di dua component berbeda tidak akan bentrok. Untuk lebih
detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/scoped-styles

Di `HelloSvelte.svelte` kita punya `.btn` versi aquamarine.

``` svelte
<style>
  .btn {
    background-color: aquamarine;
    width: 10%;
    color: black;
  }
</style>

<button class="btn">Click me</button>
```

Dan di `EditTodo.svelte` ada `.btn` lain yang warnanya hijau. Keduanya hidup
berdampingan tanpa saling menimpa.

``` svelte
<style>
  .btn {
    background-color: #4CAF50;
    color: white;
    border-radius: 5px;
  }
</style>

<button class="btn" onclick={save}>Save</button>
```

Cara Svelte melakukanya adalah dengan menambahkan sebuah class hash ke setiap
element dan selector-nya saat compile, misalnya jadi `.btn.svelte-1a2b3c`. Jadi
pemisahanya terjadi di hasil compile, bukan lewat trik runtime.

# Scoped Style Tidak Menembus ke Child Component

Konsekuensi dari scoping itu kadang mengagetkan. Style di parent tidak akan kena ke
element yang dirender oleh child component, karena element tersebut dapat hash
milik child, bukan milik parent.

``` svelte
<!-- TodoApp.svelte -->
<style>
  /* tidak akan kena ke button di dalam EditTodo */
  .btn {
    background-color: red;
  }
</style>

<EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>
```

Selain itu, kalau sebuah selector tidak kita pakai di markup component-nya, Svelte
akan membuangnya dan memberi peringatan `css_unused_selector` saat compile. Jadi
kalau style-nya terasa "tidak jalan", peringatan itu biasanya petunjuk pertamanya.

``` svelte
<style>
  /* Unused CSS selector ".card" — dibuang karena tidak ada element .card disini */
  .card {
    padding: 10px;
  }
</style>

<button class="btn">Click me</button>
```

# Global Style

Lalu gimana dong kalau style-nya memang ingin kita pakai di mana-mana, seperti font
dan warna dasar halaman ?? Untuk itu kita butuh style global, dan di repo ini
caranya lewat file CSS biasa yang di-import dari entry JavaScript-nya. Vite yang
akan menyuntikanya ke halaman, jadi kita tidak perlu menulis tag `<link>` sendiri.

``` js
// src/todo.js
import "./app.css";   // berlaku untuk seluruh halaman todo
import { mount } from "svelte";
import TodoApp from "./lib/TodoApp.svelte";

mount(TodoApp, { target: document.getElementById("app") });
```

Kalau global-nya hanya satu-dua selector dan kita ingin tetap menulisnya di dalam
component, Svelte menyediakan `:global(selector)`. Apa pun yang dibungkus
`:global()` tidak diberi hash, sehingga berlaku ke seluruh halaman. Untuk lebih
detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/global-styles

``` svelte
<style>
  /* scoped: hanya .btn di component ini */
  .btn {
    background-color: aquamarine;
  }

  /* global: semua element body di halaman */
  :global(body) {
    margin: 0;
  }

  /* berguna untuk menembus ke child: .btn di dalam element component ini */
  .wrapper :global(.btn) {
    border-radius: 5px;
  }
</style>
```

Kalau yang mau kita global-kan ada banyak, membungkus satu-satu jadi melelahkan.
Untuk itu ada block `:global { ... }` yang membuat semua isinya global sekaligus.

``` svelte
<style>
  :global {
    h1 {
      color: green;
    }

    .btn {
      cursor: pointer;
    }
  }
</style>
```

Perlu dicatat bahwa style global tidak dihapus walaupun tidak terpakai, dan tidak
ikut hilang ketika component-nya dilepas dari halaman. Jadi pakai seperlunya saja,
karena dialah satu-satunya bagian yang bisa bertabrakan antar component.

# Style Directive: style:property

Saat membuat element, kadang kita perlu menyetel satu property CSS saja, dan rasanya
berlebihan kalau harus membuat class khusus untuk itu. Biasanya kita akan menulisnya
di attribute `style` sebagai string.

``` svelte
<h1 style="color: green;">Hello Asu</h1>
```

Namun, Svelte punya bentuk yang lebih rapi, yaitu directive `style:<property>`.
Satu directive untuk satu property, jadi tidak perlu merakit string CSS sendiri.
Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/style

``` svelte
<!-- nilainya boleh string biasa -->
<h1 style:color="green">Hello Asu</h1>

<!-- boleh juga beberapa directive sekaligus -->
<h1 style:color="green" style:font-size="32px">Hello Asu</h1>
```

Yang membuat directive ini berguna adalah nilainya boleh berupa expression, jadi
style-nya bisa ikut berubah mengikuti state. Kalau nama variabelnya sama dengan nama
property-nya, ada bentuk singkat tanpa `={...}`.

``` svelte
<script>
  let done = $state(false);
  let color = $state("green");
</script>

<!-- dinamis: ikut berubah setiap kali state-nya berubah -->
<h1 style:color={done ? "grey" : color}>Hello Asu</h1>

<!-- shorthand: style:color={color} boleh ditulis style:color saja -->
<h1 style:color>Hello Asu</h1>

<!-- kalau perlu menang melawan style lain, ada modifier |important -->
<h1 style:color|important="green">Hello Asu</h1>
```

# Style dan Class yang Dinamis

Selain directive, attribute `style` dan `class` sendiri juga bisa kita isi dengan
expression. Bentuk ini pas kalau yang berubah bukan satu property, tapi
keseluruhan tampilanya.

``` svelte
<script>
  let done = $state(false);
  let warna = $state("green");
</script>

<!-- style sebagai template string -->
<h1 style="color: {warna}; font-size: 32px;">Hello Asu</h1>

<!-- class yang dipilih dengan ternary -->
<button class={done ? "btn btn-done" : "btn"}>Save</button>
```

Hati-hati kalau keduanya dipakai bersamaan untuk property yang sama: directive
`style:` selalu menang melawan apa pun yang kita tulis di attribute `style`,
walaupun attribute-nya ditulis belakangan.

``` svelte
<!-- hasilnya hijau, bukan merah: style:color mengalahkan attribute style -->
<h1 style="color: red;" style:color="green">Hello Asu</h1>
```

Untuk `class` yang kondisinya bertumpuk, menyusun string dengan ternary cepat jadi
berantakan. Svelte menyediakan directive `class:<nama>={kondisi}` yang memasang satu
class kalau kondisinya terpenuhi.

``` svelte
<!-- btn selalu ada, btn-done hanya saat done true -->
<button class="btn" class:btn-done={done}>Save</button>

<!-- shorthand sama seperti style: kalau nama class dan variabelnya sama -->
<button class="btn" class:done>Save</button>
```

Selain itu, sejak Svelte 5.16 attribute `class` juga menerima object atau array,
dengan gaya seperti library `clsx`. Key yang nilainya truthy akan dipasang, jadi
kita tidak perlu lagi merakit string-nya sendiri.

``` svelte
<!-- object: key dipasang kalau nilainya truthy -->
<button class={{ btn: true, "btn-done": done, "btn-disabled": !name }}>Save</button>

<!-- array: nilai falsy diabaikan -->
<button class={["btn", done && "btn-done"]}>Save</button>
```
