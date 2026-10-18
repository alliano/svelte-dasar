<script>

  // Event Props
  // Saat kita membuat komponen, tidak hanya data yang bisa kita guakan sebagai props
  // kita juga bisa mengirimkan event sebagai props
  // Misalnya, ketika kita ingin membuat komponen untuk edit data todo
  let {id, name, onedit} = $props();

  function save() {
    const input = document.getElementById(id);
    onedit(id, input.value);
  }
</script>


<!--
  Binding
  Biasanya data mengalir dari parent ke child element, Namun kadang ada kondisi kita ingin menggunakan data dari child element ke parent element
  Contoh yang bisa kita lakukan adalah ketika menggunakan input element
  Kita biasanya mengambil data dari input element secara manual di parent element, seperti yang kita lakukan sebelumnya
  Pada Svelte memilii feature untuk melakukan binding, yang mana attribute pada child element bisa kita sinkronisasikan dengan data pada parent element
 -->
{id} - <input type="text" id={id} bind:value={name}>
<button onclick={save}>Save</button>
