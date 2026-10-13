
<script>

  // $props()
  // Saat kita memanggil component kadang kita ingin mengirimkan data ke component yang kita panggil mirip seperti HTML attribute
  // Di Svelte kita bisa melakukan hal tersebut dengan menggunakna Rune $props()
  // Semua attribute yang kita kirikan ketika kita memanggil component akan dibungkus dalam object
  // dan kita bisa menggambilkan menggunakan $props()
  //
  // Karena $props() mengembalikan object maka kita bisa menggambilnya dengan menggunakan Javascript Desctucturing
  let {id, name, address} = $props();
</script>

<tr>
  <td>{id}</td>
  <td>{name}</td>
  <td>{address}</td>
</tr>
