<script>
  async function getArticle() {
    let response = await fetch("/article.json");
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
    <h1>{article.tittle}</h1>
    <p>{article.content}</p>
  {/each}

{:catch error}
  <p>Error: {error.message}</p>
{/await}
