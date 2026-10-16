# Props di Svelte 5

Catatan dari repo `belajar-svelte-dasar` (branch `feat/branching`, 16 Oktober 2026,
Svelte `^5.57.0`).

# Memisahkan Component

Biasanya ketika kita baru belajar, semua markup kita tulis dalam satu file component
saja. Masalahnya ketika ada bagian yang dipakai berulang-ulang, kita harus menyalin
markup-nya berkali-kali.

Di Svelte, satu file `.svelte` adalah satu component, dan kita bisa memakainya di
component lain cukup dengan meng-`import` file-nya. Nama variabel hasil import itulah
yang menjadi nama tag-nya, jadi penulisanya harus diawali huruf besar supaya Svelte
tahu itu component dan bukan element HTML biasa.

``` svelte
<script>
  // nama import = nama tag, harus huruf besar
  import Todo from "./Todo.svelte";
</script>

<ul>
  <li><Todo /></li>
</ul>
```

# $props()

Component yang tidak bisa menerima data dari luar tentu tidak banyak gunanya. Di
Svelte 5 cara sebuah component mendeklarasikan data yang boleh dikirim dari parent
adalah dengan Rune `$props()`. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/$props

`$props()` mengembalikan satu object berisi semua atribut yang dikirim parent, jadi
biasanya kita langsung men-destructuring-nya supaya tiap prop jadi variabel sendiri.

``` svelte
<script>
  // id, done, dan name diambil dari atribut yang dikirim parent
  let {id, done, name} = $props();
</script>

{id} - {name}
```

Di sisi parent, prop dikirim seperti atribut HTML. Yang perlu diingat: nilai di dalam
tanda kutip selalu bertipe string, sedangkan nilai di dalam kurung kurawal adalah
expression JavaScript biasa.

``` svelte
<!-- name dikirim sebagai string, done dikirim sebagai boolean -->
<Todo id="1" name="Belajar Svelte" done={false}/>

<!-- hati-hati: done disini bernilai string "false" yang truthy, bukan boolean -->
<Todo id="1" name="Belajar Svelte" done="false"/>
```

Perlu dicatat juga bahwa `$props()` hanya boleh dipanggil sekali di level teratas
`<script>` sebuah component, bukan di dalam function atau di dalam block.

# Spread Props

Lalu gimana dong kalau datanya sudah berbentuk object ?? Biasanya kita akan
menuliskan prop-nya satu per satu, dan itu jadi panjang serta harus diubah lagi
setiap kali field object-nya bertambah.

Namun kita tidak perlu melakukanya seperti itu. Svelte mendukung spread syntax untuk
prop, jadi semua field object langsung dipetakan menjadi prop dengan nama yang sama.

``` svelte
<script>
  import Todo from "./Todo.svelte";

  const todo = { id: "1", name: "Belajar Svelte", done: false };
</script>

<!-- cara panjang -->
<Todo id={todo.id} name={todo.name} done={todo.done}/>

<!-- cara yang sama hasilnya, tapi ikut otomatis kalau field todo bertambah -->
<Todo {...todo}/>
```

Kalau nama variabel kita sudah sama dengan nama prop-nya, ada juga shorthand `{name}`
yang merupakan singkatan dari `name={name}`.

``` svelte
<script>
  import Todo from "./Todo.svelte";

  const id = "1";
  const name = "Belajar Svelte";
</script>

<Todo {id} {name} done={false}/>
```
