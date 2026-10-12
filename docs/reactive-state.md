# Requirement
* Svelte 5.57
* Vite 8.3
* Node js

# Reactive State
Reactive state adalah data yang ketika nilainya berubah, maka tampilan akan ikut berubah dengan sendirinya.

Biasanya kalau kita pakai JavaScript biasa, setiap kali datanya berubah kita harus mengingat sendiri bagian tampilan mana yang perlu di-update :
``` svelte
<script>
  let count = 0;

  function increment() {
    count++;
    // tampilan harus kita update sendiri
    document.getElementById("counter").innerText = `Counter : ${count}`;
  }
</script>

<h1 id="counter">Counter: 0</h1>

<button onclick={increment}>increment</button>
```

Cara diatas cukup merepotkan. Nilai awal `0` ketulis dua kali (di `let count` dan di teks `<h1>`), jadi gampang nga sinkron. Belum lagi kalau `count` ditampilkan di tiga tempat, maka ketiganya harus kita update satu per satu.

Namun, ketika kita menggunakan Svelte kita tidak perlu melakukanya seperti contoh diatas. Kita cukup menandai variabelnya sebagai reaktif menggunakan Rune `$state(nilai)`, selebihnya Svelte yang akan mengurus update tampilanya. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/$state
``` svelte
<script>
  // count sekarang reaktif
  let count = $state(0);

  function increment() {
    // cukup ubah datanya, tampilan ikut berubah sendiri
    count++;
  }
</script>

<h1>Counter: {count}</h1>

<button type="button" onclick={increment}>increment</button>
```

Perhatikan bahwa fungsi `increment()` sekarang nga tau-menahu soal DOM, dan nilai awal `0` cukup kita tulis sekali.

# $state() dengan Object
State nga harus berupa angka. Kita juga bisa menampung beberapa nilai yang saling berhubungan dalam satu object, misalnya field-field dari satu form.
``` svelte
<script>
  let person = $state({
    first_name: "",
    last_name: ""
  });

  function sayHello() {
    person.first_name = document.getElementById("firstName").value;
    person.last_name = document.getElementById("lastName").value;
  }
</script>

<div>
  <input type="text" id="firstName" placeholder="first name"> <br/>
  <input type="text" id="lastName" placeholder="last name"><br/>

  <button onclick={sayHello}>Say Hello</button>

  <h1>Hello Introducte me:</h1>
  <p>my first name: {person.first_name}</p>
  <p>my last name : {person.last_name}</p>
</div>
```

Dibalik layar, Svelte membungkus object tersebut menggunakan `Proxy`. Proxy inilah yang mencatat field mana saja yang dibaca oleh template, dan mendeteksi ketika salah satu field-nya ditulis.

Efeknya, kita cukup mengubah satu field saja untuk memicu update. Kita **nga perlu** mengganti object-nya secara utuh seperti kebiasaan di React :
``` js
// cukup seperti ini
person.first_name = "Ali";

// nga perlu seperti ini
person = { ...person, first_name: "Ali" };
```

Proxy ini sifatnya *deep*, jadi object atau array yang ada didalamnya ikut reaktif juga. Artinya `person.address.city = "Bandung"` atau `items.push(x)` tetap terdeteksi.

Kode diatas sebenernya masih membaca input menggunakan `document.getElementById()`, jadi datanya cuma ikut berubah pas tombolnya diklik. Kalau kita mau input dan state-nya nyambung dua arah secara otomatis, kita bisa menggunakan `bind:value`. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/bind
``` svelte
<script>
  let person = $state({ first_name: "", last_name: "" });
</script>

<input type="text" bind:value={person.first_name} placeholder="first name" />
<input type="text" bind:value={person.last_name} placeholder="last name" />

<p>my first name: {person.first_name}</p>
<p>my last name : {person.last_name}</p>
```

Dengan `bind:value`, fungsi `sayHello()` dan tombolnya nga diperlukan lagi. Teks dibawahnya akan langsung ikut berubah setiap kali kita mengetik.

# $state() dengan Array
Selain object, `$state()` juga bisa menampung array. Dan karena Proxy-nya sifatnya *deep*, method yang memutasi array seperti `push()`, `pop()`, atau `splice()` tetap kebaca sebagai perubahan :
``` svelte
<script>
  let count = $state([]);

  function increment() {
    // push langsung kedeteksi, nga perlu bikin array baru
    count.push(1);
  }
</script>

<h1>{count.join(" + ")}</h1>

<button type="button" onclick={increment}>Add</button>
```

Ini agak beda dengan kebiasaan di React, dimana kita harus selalu bikin array baru supaya perubahanya kebaca. Di Svelte 5 dua-duanya jalan, tapi yang mutasi langsung jelas lebih singkat :
``` js
// cukup seperti ini
count.push(1);

// nga perlu seperti ini
count = [...count, 1];
```

# Derived State
Kadang-kadang kita butuh state yang nilainya dihitung dari state lain, misalnya total dari sebuah array. Biasanya kita akan tergoda untuk menyimpan totalnya sebagai state kedua, lalu menghitung ulang setiap kali datanya berubah :
``` svelte
<script>
  let count = $state([]);
  // cara ini gampang basi, totalnya harus kita jaga sendiri
  let total = $state(0);

  function increment() {
    count.push(1);
    total = count.reduce((a, b) => a + b, 0);
  }
</script>
```

Masalahnya, setiap ada tempat lain yang mengubah `count`, kita harus ingat untuk menghitung ulang `total` disitu juga. Sekali kelupaan, totalnya langsung nga nyambung dengan datanya.

Namun, di Svelte kita nga perlu melakukanya seperti contoh diatas. Kita bisa menggunakan Rune `$derived(expression)` untuk membuat state yang bereaksi terhadap perubahan state lain. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/$derived
``` svelte
<script>
  let count = $state([]);

  // total akan ikut terhitung ulang setiap kali count berubah
  let total = $derived(count.reduce((a, b) => a + b, 0));

  function increment() {
    count.push(1);
  }
</script>

<h1>{count.join(" + ")} = {total}</h1>

<button type="button" class="counter" onclick={increment}>Add</button>
```

Svelte mencatat state apa saja yang dibaca didalam ekspresi `$derived`. Disini yang kebaca adalah `count`, jadi `count` otomatis jadi dependency-nya. Begitu `count` berubah, `total` ditandai basi dan dihitung ulang. Jadi fungsi `increment()` cukup mengurus `count` saja.

Nilai `$derived` sifatnya read-only, jadi jangan ditugaskan ulang. Dia selalu hasil dari ekspresinya, bukan sesuatu yang kita set sendiri :
``` js
// SALAH: $derived nga boleh ditugaskan ulang
total = 100;
```

Satu hal lagi, isi `$derived()` itu harus berupa satu ekspresi. Kalau perhitunganya butuh beberapa baris, kita bisa menggunakan `$derived.by(() => { ... })` yang menerima function :
``` js
let total = $derived.by(() => {
  let hasil = 0;
  for (const n of count) hasil += n;
  return hasil;
});
```

# $state.raw()
Kita sudah tau kalau `$state` membungkus object menggunakan Proxy supaya setiap perubahan field-nya bisa terdeteksi. Tapi membuat Proxy itu ada biayanya, apalagi kalau object-nya besar dan isinya dibungkus sampai ke dalam-dalam.

Lalu gimana dong kalau datanya memang selalu kita ganti utuh, misalnya hasil response dari API ??

Untuk kasus seperti itu kita bisa menggunakan Rune `$state.raw(nilai)`. Rune ini **nga** membungkus nilainya dengan Proxy, jadi lebih murah. Konsekuensinya cuma satu, tapi menentukan seluruh cara memakainya : nilainya hanya reaktif ketika **diganti utuh**, bukan ketika field-nya dimutasi. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/$state
``` svelte
<script>
  let university = $state.raw({
    name: "",
    major: ""
  })

  function inputDataUniversity(){
    // ganti seluruh object-nya, bukan mutasi field
    university = {
      name: document.getElementById("universityName").value,
      major: document.getElementById("universityMajor").value
    };

    console.log(university);
  }
</script>

<div>
  <input type="text" id="universityName" placeholder="University Name"><br/>
  <input type="text" id="universityMajor" placeholder="University Major"> <br/>

  <button onclick={inputDataUniversity}>Save Data</button>

  <h1>My University Is {university.name}</h1>
  <h1>My Major is {university.major}</h1>
</div>
```

Kalau kita bandingkan hasil compile-nya, bedanya keliatan jelas. `$state` biasa dibungkus proxy, sedangkan `$state.raw` cuma jadi signal biasa :
``` js
// let person = $state({ ... })
let person = $.proxy({ first_name: "", last_name: "" });

// let university = $state.raw({ ... })
let university = $.state({ name: "", major: "" });
```

Karena nga ada proxy, nga ada yang mengintip operasi per-field. Yang tersisa cuma satu signal yang menampung referensi object-nya, dan satu-satunya hal yang memicu update adalah saat variabelnya ditugaskan ulang.

Ada satu hal yang perlu diwaspadai dari `$state.raw`. Nilainya **nga** di-`Object.freeze`, jadi kalau kita mutasi field-nya, mutasinya tetap berhasil mengubah object — cuma Svelte nga tau :
``` js
// TIDAK reaktif: $state.raw nga melihat perubahan field
university.name = document.getElementById("universityName").value;
```

Yang bikin lama dicari, kegagalanya senyap total. Nga ada error, nga ada warning compiler, nga ada warning runtime. `console.log(university)` pun tetap menampilkan nilai yang sudah benar, karena object-nya memang berubah beneran. Tapi `<h1>`-nya tetap kosong.

Jadi kalau ada nilai `$state.raw` yang kelihatan nga reaktif, yang pertama kita cek adalah : dia **diganti** atau cuma **dimutasi**?

Kalau kita cuma mau mengubah sebagian field tanpa kehilangan field yang lain, kita bisa menggabungkan spread dengan penugasan ulang :
``` js
university = { ...university, major: "Sistem Informasi" };
```

Satu hal lagi, `bind:value` **nga bisa** dipakai pada object `$state.raw`, karena cara kerjanya adalah menulis ke field. Itulah kenapa blok university diatas memakai tombol dan `getElementById`, sedangkan blok `person` sebelumnya bisa disederhanakan dengan `bind:value`.
