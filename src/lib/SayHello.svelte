<script>
  let person = $state({
    first_name: "",
    last_name: ""
  });

  function sayHello() {
    person.first_name = document.getElementById("firstName").value;
    person.last_name = document.getElementById("lastName").value;

  }

  let university = $state.raw({
    name: "",
    major: ""
  })

  function inputDataUniversity(){
    university = {
      name: document.getElementById("universityName").value,
      major: document.getElementById("universityMajor").value
    };

    console.log(university);
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


<div>
  <input type="text" id="universityName" placeholder="University Name"><br/>
  <input type="text" id="universityMajor" placeholder="University Major"> <br/>

  <button onclick={inputDataUniversity}>Save Data</button>

  <h1>My University Is {university.name}</h1>
  <h1>My Major is {university.major}</h1>


</div>
