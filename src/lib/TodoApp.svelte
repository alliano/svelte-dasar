<script>
  import Todo from "./Todo.svelte";

  let todos = $state([])
  let id = 1;

  
  function add(e) {
    e.preventDefault();
    const input = document.getElementById("todo");
    todos.push({
      id: id++,
      name: input.value
    })
    input.value = "";
  }


  function remove(id) {
    todos = todos.filter(item => item.id !== id)
  }


  
  $inspect(todos).with((type, value) => console.log(type, value));
</script>


<form>
  <input type="text" id="todo">

  <!--
    Saat Membuat applikasi Frontend kita pasti sering kali akan menambahkan Event listener pada suatu Element untuk memberikan behavior ketika terjadi
    suatu kejadian. Misalnya:
    - ketika button di click
    - ketika pointer menyorot suatu object/element
    - dan sebagainya
    Di svelte untuk menambahkan event sangatlah mudah kita bisa menggunakan keyword on<namaEvent> = {function}, yang mana function tersebut bisa kita buat sebagai
    closure function atau didalam block script

    pada contoh kali ini misalnya ketika terjadi event onclick maka akan menjalankan fungsi add() yang berfungsi untuk menambahkan todo
  -->
  <button onclick={add}>Add</button>
</form>

<ul>
  {#each todos as todo }
    <li>
      <Todo {...todo}/>
      <button  onclick={() => remove(todo.id)}>remove</button>
    </li>
  {/each}
</ul>

