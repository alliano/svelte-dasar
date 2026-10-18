<script>
  async function getArticle() {
    let response = await fetch("/article.json");

    // fetch hanya menolak Promise-nya kalau koneksinya gagal, jadi status
    // seperti 404 harus kita lemparkan sendiri supaya masuk ke {:catch}
    if(!response.ok) throw new Error(`Gagal memuat artikel: ${response.status}`);

    return await response.json();
  }
</script>


<!--
  Saat kita membuat halaman web, kita sering kali menggunakan keyword Promise
  Pada Svelte memiliki keyword untuk mengakses Promise di javascript, sehingga kita bisa menentukan apa yang ditamilkan sebelum promise selesai dan setelah promise selesai dan ketika promise gagal
  Kita bisa menggunakan block {#await }

-->
{#await getArticle()}
  <p>Loading...</p>
  
{:then articles} 
  {#each articles as article}
    <h1>{article.title}</h1>
    <p>{article.content}</p>
  {/each}

{:catch error}
  <p>Error: {error.message}</p>
{/await}
