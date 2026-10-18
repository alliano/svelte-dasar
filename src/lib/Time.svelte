<script>
  // node ini akan berisi sebuah html element yang memanggil time dalam contoh ini misalnya h1 dan p
  const time = (node) => {
    console.log(node);
    const text  = node.textContent;
    $effect(() => {
      const id = setInterval(() => {
        node.textContent = `${text} ${new Date().toLocaleTimeString()}`;
      }, 1000);
      return () => clearInterval(id);
    })
  }
</script>

<!--
  Action
  Action adalah function yang dipanggil ketika element dipasang (mounted)
  Kita bisa menggunakan use:nama_function pada element yang akan ditambahkan Action
  Action biasanya menggunakan $effect, sehingga ketika element dilepas (umounted), closure effect akan dipanggul untuk reset
 -->
<h1 use:time>Title</h1>

<p use:time>Hello World</p>
