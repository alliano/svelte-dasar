<script>
  import UserRow from "./UserRow.svelte";

  const user = {
    id: "1",
    name: "Kim",
    address: "Surga"
  }
</script>

<table>


  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>address</th>
    </tr>
  </thead>

  <tbody>
    <!--
    Spread Pops
    Terkadang jikalau kita object yang sangat banyak dan kita kirimkan menggunakan props
    agak menyulitkan jikalau kita panggil datanya 1/1
    Untungnya di kita bisa menggunakan Spread operator di props


    -->
    <UserRow {...user}/>
    <!-- <UserRow id="1" name="Kim" address="Gatau"/> -->
  </tbody>




</table>
