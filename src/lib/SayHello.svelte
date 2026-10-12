<script>
  let person = $state({
    first_name: "",
    last_name: ""
  });

  function sayHello() {
    person.first_name = document.getElementById("firstName").value;
    person.last_name = document.getElementById("lastName").value;

  }
</script>


<div>
  <input type="text" id="firstName" placeholder="first name"> <br/>
  <input type="text" id="lastName" placeholder="last name"><br/>

  <button onclick={sayHello}>Say Hello</button>


  <h1>Hello Introducte me:</h1>
  <p>my first name: {person.first_name}</p>
  <p>my last name : {person.last_name}</p>
</div>
