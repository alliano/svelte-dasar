<script>
  const mouse = $state({
    x: 0,
    y: 0
  });

  function handleMouseMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
</script>


<!--
  Special Element
  Saat kita membuat web, kadang kadang kita ingin mengubah element seperti window, document, body, atau head
  Sayangnya, hal tersebut tidak bisa dilakukan secara langsung karena svelte sendiri biasanya akan dirender kedalam body halaman yang sudah ada
  Jika kita ingin menambahkan event misalnya ke element element tersebut, maka kita bisa menggunakan kode javascript
  Untungnya, Svelte memiliki komponen spesial, yang digunakan untuk merepresentasikan element element tersebut
  Dengan demikian kita bisa menambahkan event layaknya seperti component

  Daftar Special ELement
  Ada beberapa element special yang dimiliki svelte, yaitu
  svelte:window, sebagai representasi wondow => https://svelte.dev/docs/svelte/svelte-window
  svelte:document sebagai representasi dari Document =>  https://svelte.dev/docs/svelte/svelte-document
  svelte:body sebagai representasi dari body =>  https://svelte.dev/docs/svelte/svelte-body
  svelte:head sebagai representasi dari head =>  https://svelte.dev/docs/svelte/svelte-head
-->
<svelte:body onmousemove={handleMouseMove}/>

<h1>X: {mouse.x}</h1>
<h1>Y: {mouse.y}</h1>
