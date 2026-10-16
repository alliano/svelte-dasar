<script>
  import Todo from "./Todo.svelte";

  const todos = [
    {
      id: "1",
      name: "Belajar Svelte",
      done: false
    },
    {
      id: "2",
      name: "Belajar Graphql",
      done: true
    },
    {
      id: "3",
      name: "Belajar Rust",
      done: true
    }
  ]
</script>

<ul>
  <li><Todo id="1" name="Belajar Svelte" done={false}/></li>
  <li><Todo id="2" name="Belajar Graphql" done={true}/></li>
</ul>

<!-- Contoh penggunaan Each loop -->

<ul>
  {#each todos as todo }
    <li><Todo {...todo}/></li>
  {/each}
</ul>

