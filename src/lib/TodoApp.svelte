<script>
  import Todo from "./Todo.svelte";
  import EditTodo from "./EditTodo.svelte";
  import {fly} from "svelte/transition";

  let todos = $state([])
  let id = 1;
  let name = $state("");

   let editingId = $state(null);

  function add(e) {
    e.preventDefault();
    todos.push({
      id: id++,
      name: name,
      done: false
    })
    name = "";
  }


  function remove(id) {
    todos = todos.filter(item => item.id !== id)
  }


  function edit(id) {
    editingId = id;
  }

  function onEdit(id, name){
    const index = todos.findIndex(item => item.id === id);
    if(index !== -1) {
      todos[index] = {...todos[index], name};
    }
    editingId = null;
  }


  $inspect(todos).with((type, value) => console.log(type, value));
</script>



<!--
  Snippet
  Snippet merupakan cara untuk membuat komponen yang bisa digunakan, namun masih tetep dalam komponen yang sama tampa harus membuat file lain
  Ini cocok untuk kasus yang sederhana ketika kita ingin memecah komponen namun tidak ingin memecah komponen dalam file terpisah
  Untuk membuat snippet, kita bisa menggunakan {#snippet nama_snippet(param)} dalam file svelte
  https://svelte.dev/docs/svelte/snippet
-->

{#snippet todoRow(todo)}
   <li in:fly={{y: 200, duration: 2000}} out:fly={{y: -200, duration: 1000}}>
           {#if todo.id === editingId}
        <EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>
      {:else}
        <Todo {...todo}/>
        <button onclick={() => remove(todo.id)}>remove</button>
        <button onclick={() => edit(todo.id)}>Edit</button>
      {/if}
    </li>
{/snippet}

<form onsubmit={add}>
  <input type="text" bind:value={name}>
  <button>Add</button>
</form>
<ul>
  {#each todos as todo (todo.id)}

    <!--
    Render
    render merupakan perintah yang digunakan untuk menampilkan snippet
    Untuk menggunakan reder, kita bisa menggunakan perintah {@render nama_snippet(param)}
    https://svelte.dev/docs/svelte/@render
    -->
    {@render todoRow(todo)}
  {/each}
</ul>
