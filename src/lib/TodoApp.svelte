<script>
  import Todo from "./Todo.svelte";
  import EditTodo from "./EditTodo.svelte";

  let todos = $state([])
  let id = 1;
  let name = $state("");

  // null artinya tidak ada baris yang sedang di-edit
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
      // spread dulu, baru field yang diganti, supaya done tidak ikut terhapus
      todos[index] = {...todos[index], name};
    }
    editingId = null;
  }


  $inspect(todos).with((type, value) => console.log(type, value));
</script>


<!--
  Handler-nya dipasang di onsubmit form, bukan di onclick button, supaya menekan
  Enter di dalam input juga ikut menambah todo
-->
<form onsubmit={add}>
  <!-- input-nya di-bind ke state name, jadi tidak perlu id dan getElementById -->
  <input type="text" bind:value={name}>

  <!--
    Saat Membuat applikasi Frontend kita pasti sering kali akan menambahkan Event listener pada suatu Element untuk memberikan behavior ketika terjadi
    suatu kejadian. Misalnya:
    - ketika button di click
    - ketika pointer menyorot suatu object/element
    - dan sebagainya
    Di svelte untuk menambahkan event sangatlah mudah kita bisa menggunakan keyword on<namaEvent> = {function}, yang mana function tersebut bisa kita buat sebagai
    closure function atau didalam block script

    pada contoh kali ini misalnya ketika terjadi event onsubmit maka akan menjalankan fungsi add() yang berfungsi untuk menambahkan todo
  -->
  <button>Add</button>
</form>

<!-- todo.id dipakai sebagai key, supaya Svelte tahu item mana yang pindah atau dihapus -->
<ul>
  {#each todos as todo (todo.id)}
    <li>
      <!-- hanya baris yang id-nya sama dengan editingId yang masuk mode edit -->
      {#if todo.id === editingId}
        <EditTodo id={todo.id} name={todo.name} onedit={onEdit}/>
      {:else}
        <Todo {...todo}/>
        <button onclick={() => remove(todo.id)}>remove</button>
        <button onclick={() => edit(todo.id)}>Edit</button>
      {/if}
    </li>
  {/each}
</ul>
