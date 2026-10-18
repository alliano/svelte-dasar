<script>

  // Event Props
  // Saat kita membuat komponen, tidak hanya data yang bisa kita guakan sebagai props
  // kita juga bisa mengirimkan event sebagai props
  // Misalnya, ketika kita ingin membuat komponen untuk edit data todo
  const {id, name, onedit} = $props();

  function save() {
    const input = document.getElementById(id);
    onedit(id, input.value);
  }
</script>

{id} - <input type="text" id={id} value={name}>
<button onclick={save}>Save</button>
