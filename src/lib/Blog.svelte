<script>
  import LayoutBlog from "./LayoutBlog.svelte";
</script>

<LayoutBlog title="Contoh Blog" footer="Copyright 2026">
  <!--
  Mengirim snippet ke component
  Di Svelte versi 4, saat kita ingin mengirim komponen ke komponen, biasanya menggunakan Slot, namun di Svelte versi 5, kita bisa menggunakan Snippet jadi tidak perlu lagi Slot
  Snippet sebenarnya seperti function biasa, jadi ktia bisa kirim sebagai props ketika memanggil component
  Salahsatu kelebihan dari Snippet, kita bisa mengirim sebagai props dalam inner element component nya, sehingga tidak perlu kita sebutkan lagi sebagai attribute
  -->
  {#snippet content()}
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, quos. Suscipit, facilis inventore explicabo obcaecati minima deserunt quisquam sit alias veniam nisi, minus dolore similique consequatur eligendi tempora corrupti perferendis?</p>
    <br>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quam veritatis modi praesentium exercitationem. Ratione perspiciatis magnam facere voluptatem voluptas dolores, molestias dolorem quos sit architecto. Enim fugit debitis aliquid.</p>
  {/snippet}
</LayoutBlog>
