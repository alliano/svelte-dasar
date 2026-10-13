# Props
Saat memanggil sebuah komponen, kadang kita pengen ngirim data kedalamnya, mirip kayak kita ngasih attribute ke element HTML :
``` svelte
<UserRow id="1" name="Kim" address="Gatau"/>
```

Semua attribute yang kita kirim itu dibungkus jadi satu object oleh Svelte, dan untuk ngambilnya kita pakai Rune `$props()`. Karena yang dikembalikan berupa object, kita bisa langsung membongkarnya pakai destructuring JavaScript. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/$props
``` svelte
<!-- src/lib/UserRow.svelte -->
<script>
  let {id, name, address} = $props();
</script>

<tr>
  <td>{id}</td>
  <td>{name}</td>
  <td>{address}</td>
</tr>
```

Walaupun keliatanya kayak destructuring biasa yang cuma jalan sekali, sebenernya nga gitu. Compiler Svelte mengubahnya jadi pembacaan langsung di tempat nilainya dipakai :
``` js
// hasil compile dari {id} di template
$.set_text(text, $$props.id);
```

Jadi props-nya tetep reaktif. Kalau induknya ngasih data dari `$state` lalu datanya berubah, baris di komponen anak ikut berubah tanpa kita ngapa-ngapain :
```
awal                 : 1 | Kim     | Surga
setelah ubah di induk: 1 | Alliano | Surga
```

Tapi inget, yang bikin reaktif itu sumber datanya, bukan props-nya. Kalau di induk datanya cuma object biasa seperti `const user = {...}`, ya nga bakal ada yang berubah — dan itu nga masalah kalau datanya emang statis.

Kalau ada props yang nga selalu dikirim, kita bisa ngasih nilai default langsung di destructuring-nya :
``` js
let { id, name, address = "-" } = $props();
```

# Spread Props
Masalahnya, kalau data kita udah berbentuk object dan isinya banyak, nulis props-nya satu-satu jadi capek dan gampang kelewat :
``` svelte
<UserRow id={user.id} name={user.name} address={user.address}/>
```

Untungnya kita bisa pakai spread operator buat ngirim seluruh isi object-nya sekaligus :
``` svelte
<!-- src/lib/UserApp.svelte -->
<script>
  import UserRow from "./UserRow.svelte";

  const user = {
    id: "1",
    name: "Kim",
    address: "Surga"
  }
</script>

<tbody>
  <!-- semua field user dikirim jadi props -->
  <UserRow {...user}/>
</tbody>
```

Nama field di object-nya bakal jadi nama props-nya. Jadi `user.name` nyampe di anak sebagai props `name`, persis kayak kita nulis `name="Kim"` manual.

Enaknya lagi, spread ini nga bikin datanya jadi beku. Hasil compile-nya dibungkus function, jadi nilainya dibaca ulang tiap kali dibutuhin :
``` js
UserRow(node, $.spread_props(() => user));
```
