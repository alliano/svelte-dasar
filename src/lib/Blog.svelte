<script>
  import Layout from "./Layout.svelte";
  import {onMount} from "svelte";

  let blogs = [
    {
      title: "",
      content: "",
      footer: ""
    }
  ];

  // Lifecycle Hooks
  // Saat komponen ditampilkan ke browser, kita bisa menambahkan hook ketika komponen dibuat atau dihapus
  // Untuk menambahkan hook ketika component dibuat kita bisa menggunakan:
  // - onMount(callback) => ketika component di mount/ditampilkan
  // - onDestroy(callback) => ketika component dihapus
  // Khusus untuk callback dalam onMount() dapat mengembalikan closure function yang akan dieksekusi ketika dihapus
  // https://svelte.dev/docs/svelte/lifecycle-hooks
  onMount(async() => {
    const data = await fetch("/blog.json");
    blogs = await data.json();
    console.log(data);
  });
</script>

{#each blogs as blog}
  <Layout title={blog.title} footer={blog.footer}>
    {#snippet content()}
      {@html blog.content}
    {/snippet}
  </Layout>
{/each}
