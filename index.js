//definición con variables de elementos del DOM
let filterCompleted = false; 
const formInput = document.querySelector("#form_input");
let inputText = false;
const submitButton = document.querySelector("#submit-button");
let tasksArray = JSON.parse(localStorage.getItem("taskArray")) || []; //si tiene datos localStorage se crea el array, si no genera un array vacío.
 //para que se vuelvan a imprimir las tareas que ya están guardadas en el localStorage, volver a convertir los strings en json y llamar a la función de craeteTaskNode
 //devuelve el array con los objetos que representan las listas guardadas en el localStorage
tasksArray.forEach((task) =>{console.log(task); createTaskNode(task, false)});

//función que permite obtener un número aleatorio en un rango específico
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//función que genera un objeto con una tarea aleatoria, la aleatoriedad la obtiene de la función getRandomInt()
function generateRandomTask() { //genera un objeto con una tarea aleatoria 
  return { 
    text: `Texto aleatorio número ${getRandomInt(1, 1000)}`,
    isCompleted: getRandomInt(0, 1) === 1, //isCompleted será true o false dependiendo del numero aleatorio
    isFav: getRandomInt(0, 1) === 1,
    id: Date.now()
  };
}

//función que genera un array con 10 objetos random que representan tareas random, usa un bucle for para llamar 10 veces a la función getRandomTask
function getRandomArray() {
  const randomTasks = []; //define un array vacío
  for (let i = 0; i < 4; i++) { //un bucle de 10 instancias, mete 10 veces en el array randomTasks un objeto con tarea random
    randomTasks.push(generateRandomTask()); 
  }
  return randomTasks; //devuelve el array de objetos
}

//función que regenera el array de tareas random, se activa pulsando el botón de regenerar listado, borra todo el array d taras y genera 10 nuevas aleaotrias 
function regenerateArray() {
  tasksArray = getRandomArray(); // Genera un nuevo array con tareas aleatorias
  localStorage.setItem("taskArray", JSON.stringify(tasksArray)); // Guarda en localStorage

  document.querySelector('#tasks').innerHTML = ''; // Limpia el contenedor de tareas en el DOM

  // Mostrar solo las tareas según el valor del filtro almacenado en el local storage
  const filteredTasks = filterCompleted ? tasksArray.filter(task => task.isCompleted) : tasksArray;

  //invertimos el orden del array filteredTasks para que aparezcan y se guarden en el orden correcto al refrescar el navegador
  //ESTO ES LO QUE ARREGLA EL PROBLEMA DE LA DIFERENCIA DE ORDEN EN EL ARRAY Y EN EL DOM DEL ARRAY REGENERADO
  const filteredTasksInverted = [...filteredTasks].reverse();

  filteredTasksInverted.forEach((task) => {
    createTaskNode(task, true);
  });
  }


  //función que genera elementos(tasks), si addToEnd es true entonces lo añade al final, si es false lo añade al principio
function createTaskNode(task, addToEnd){
  const taskNode = document.createElement('div'); //ha creado un div dentro del html
  taskNode.className = 'task'; //añade una nueva clase al div que acabamos de crear reemplazando las clases anteriores, si se usara classList, no se podrían añadir varias clases a la vez
  
  //eliminamos el div <div class=task> debido a que este div es el que creamos con createElement y si lo dejamos estaríamos duplicando un div, meteríamos un div dentro de otro con la misma clase "task"
  taskNode.innerHTML = ` 
        <span class="${task.isCompleted ? 'completed' : ''}">${task.text}</span> -
        <span class="status">${task.isCompleted ? 'completed' : 'pending'}</span>
        <button class="emoji-btn ${task.isFav ? 'fav' : ''}" style="display:none">${task.isFav ? '❤' : '✖'}</button>`;
    
  const tasksNode = document.querySelector('#tasks'); //variable que contiene la parte del html que es un div con el id tasks
  
  //para que se añada una tarea al principio o al final en el DOM (pero no en el array de tareas)
  if(addToEnd){ //al principio si addToEnd es true
    tasksNode.appendChild(taskNode); //lo añade al final de la etiqueta padre si hay mas elementos
  } else {
    tasksNode.prepend(taskNode); //para que se añada al inicio de la etiqueta padre si hay mas elementos
  };

  //animación para que se vea el emoji al pasar el mouse-------------------------------------------------------------------------------------

   // Mostrar el botón cuando el mouse entra en la tarea
  taskNode.addEventListener('mouseenter', () => { // () => { es lo mismo que poner function()=>{}
    favButtonNode.style.display = ''; //para hacer que sea visible quitándole el none 
  });

  // Ocultar el botón cuando el mouse sale de la tarea
  taskNode.addEventListener('mouseleave', () => {
    favButtonNode.style.display = 'none';
  });

//------------------------------------------------------------------------------------------------------------------------------------------------------------

  //hace que solo añada el listener a ese elemento en concreto y no a todos
  /* Vamos a cambiar este código para que se marquen como pendientes o completadas cada vez que clickamos en la tarea 
  taskNode.addEventListener('click', function (){
      console.log('hola', task.text); */

      //event listener para marcar la tarea como completada si está pendiente y viceversa
      taskNode.addEventListener('click', function () {
        const taskTextNode = taskNode.querySelector('span');
        const isCurrentlyCompleted = taskTextNode.classList.contains('completed'); //puede ser true o false dependiendo de si tiene la clase completed

        // Alterna estado en la UI
        taskTextNode.classList.toggle('completed');
        taskNode.querySelector('.status').innerText = isCurrentlyCompleted ? 'pending' : 'completed';
      
        // Actualizar en el array de tareas: Guarda el nuevo estado de la tarea en la variable task. accede al objeto y le cambia el valor de la propiedad isCompleted
        task.isCompleted = !isCurrentlyCompleted; //hace la misma función que toggle. Si la tarea está completada la pasa a pendiente isCompleted:(false)

         // Guardar en localStorage: actualiza el estado de la tarea
        localStorage.setItem("taskArray", JSON.stringify(tasksArray));
      });

      //event listener para cambiar el estado del icono
      const favButtonNode = taskNode.querySelector('button'); //mejor añadir una class al botón y referenciarlo con esa class y no con button

      favButtonNode.addEventListener('click', function(event){
        event.stopPropagation(); //con stopPropagation evitemos que al marcarn la tarea como favorita no marquemos la tarea como completada o pendiente, evitamos la propagación al contenedor padre
        const isCurrentlyFav = favButtonNode.classList.contains('fav');
        favButtonNode.classList.toggle('fav'); //se usa para añadir o eliminar de forma dinámica una clase de un elemento. Si el elemneto no tiene la clase se la añade, si ya la tiene se la quita
        favButtonNode.innerText = isCurrentlyFav ? '✖' : '❤';
        task.isFav = !isCurrentlyFav;
        localStorage.setItem("taskArray", JSON.stringify(tasksArray));
      })
}

//función que se encarga de añadirl las tareas al principio o al final del taskArray y luego llama a la función createTaskNode para que la cree en el dom
function addTask(addToEnd, taskText = null){

  let task; //definimos la variable task

  //se crea la tarea a partir de un texto que el usuario ha introducido o generado de forma aleatorioa con generateRandomTask()
  if(taskText && taskText.length > 0){ //la comparación anterior (if(inputText !== taskText){) no servía porque nunca cambiabamos el valor de inputText que siempre sería falso.
    task = { text: taskText, isCompleted: false, isFav: false, id: Date.now() }; //creamos un objeto igual al que se generaría de forma random si no rellenaramos el form
  } else {
  task = generateRandomTask(); //esto se meterá en el array taskArray por lo que también habrá que hacer stringify
  }

  //Aquí, la tarea se añade al tasksArray. Esta tarea, incluso si está pendiente, se añade correctamente a la lista.
  if (addToEnd){
    tasksArray.unshift(task); //Se añaden los objetos al final del array en formato json
  } else {
    tasksArray.push(task); //Se añaden los objetos al inicio del array en formato json
  }
  
  //guarda el array actualizado en el localStorage
  localStorage.setItem("taskArray", JSON.stringify(tasksArray) ); //se actualiza el valor asociado a la key "taskArray", cada vez se añadirá un nuevo objeto que representa una tarea
  
  // Verifica si se debe mostrar según el filtro activo, si el filtro no está activo(false) o la tarea está completada se muestran todas las tareas
  //si el filtro está activo solo se mostrarán las tareas que estén marcadas como completadas
  //Cuando el filtro está activado, solo se crean los nodos de las tareas completadas (task.isCompleted === true). Si la tarea no está completada, la condición del if es false, por lo que no se llama a createTaskNode y esa tarea no se muestra en la interfaz.
  // la parte que hace que se vuelvan a renderizar todas es la función filterCompletedTasks(), que se ejecuta cuando hacemos clic en el botón de filtrado.
  if (!filterCompleted || task.isCompleted) {
    createTaskNode(task, addToEnd);
  }
}

//función que filtra las tareas completadas y las no completadas
const filterCompletedTasks = () =>{
  const taskNode = document.querySelector('#tasks'); //selecciona el contenedor padre de las tareas
  taskNode.innerHTML = ''; //limpia las tareas actuales

  //filtra las tareas completadas o mostrar todas, revisa el estado de la variable filterCompleted y en función de esta filtra o no
  const filteredTasks = filterCompleted 
  ? tasksArray.filter(task => task.isCompleted) //si filterComplted es true filteredTasks contendrá solo las tareas completadas
  : tasksArray; //si es false la variable será igual al array origial

  //finalmente renderizamos en el html las tareas filtradas con el nuevo array filterCompletedTasks
  filteredTasks.forEach((task)=>{ //para cada tarea llama a la función que las crea en el DOM y las añade al principio
    createTaskNode(task, false);
  });
}

//event listener para el botón de filtrar por completadas
document.querySelector('#completed-filter').addEventListener('click', ()=>{
  filterCompleted = !filterCompleted; //invierte el valor del filtrado

  // Guardar en localStorage el estado del filtro
  localStorage.setItem("filterCompleted", JSON.stringify(filterCompleted));

  //cambia el texto del botón según el estado de filtrado+
  const filterButton = document.querySelector('#completed-filter');
  filterButton.innerText = filterCompleted ? 'Show all' : 'Show completed'; 

  //llama a filterCompletdTasks que filtrará las tareas por completadas
  filterCompletedTasks();
});

// Al cargar la página, recuperar el estado del filtro desde localStorage
window.addEventListener('load', () => {
  // Recupera el estado del filtro y convierte de string a booleano
  filterCompleted = JSON.parse(localStorage.getItem("filterCompleted")) || false;

  // Cambia el texto del botón según el estado guardado
  const filterButton = document.querySelector('#completed-filter');
  filterButton.innerText = filterCompleted ? 'Show all' : 'Show completed';

  // Aplicar el filtro al cargar la página
  filterCompletedTasks();
});

// event listeners para que los botones llamen a las funciones anteriores
document.querySelector('#regenate').addEventListener('click', () => {
  regenerateArray();
});

document.querySelector('#add-first').addEventListener('click', () => {
  addTask(false);
});

document.querySelector('#add-last').addEventListener('click', () => {
  addTask(true);
});

//listener para submitear una tarea que se haya escrito en el form

document.querySelector('#create-task').addEventListener('submit', (event)=>{
  event.preventDefault();   //todos los formularios recargan la página, con esto lo evitamos
  console.log(event);

  //buena practica poner un name en los formularios para poder guardarlos
  const formData = new FormData(event.target); //form data es un objeto espcial
  const taskText = formData.get('taskText').trim(); //accede al texto del submit
  console.log(taskText);
  
  if(taskText.length > 0){ //va a comporbar que si o si tenga texto
    addTask(false, taskText);
    console.log("botón deshabilitado");
  }
  document.querySelector("#submit-button").disabled = true; //para que una vez se envíe la tarea se deshabilite
  event.target.reset(); //para que el texto del form se resetee

})

 //listener para que cuando se escriba el imput el botón de intro se habilite
//recordemos que formInput es una variable que guarda el objeto input del DOM
//y que submitButton es el elemento del DOM botón para enviar el texto del input

formInput.addEventListener('input', ()=>{
  //habilita si hay texto y dehabilita si está vacío
  console.log("Texto en input:", formInput.value); // Verifica el valor del input
  submitButton.disabled = formInput.value.trim() === ""; //se deshabilita si el valor del formInput es una cadena vacía, si no, disabled será false 

});

//formInput es la referencia al campo de entrada del formualrio el cual es un input
//.value es una propiedad que obtine el valor actual del campo de entrada
//si el usuario ha escrito aldo, .value devolverá ese texto, si está vacío devolvrá una cadena vacía

//formInput.value.trim() === "": compara si el valor del campo de entrada (después de eliminar los espacios) es una cadena vacía ("").
//Si el campo está vacío o solo tiene espacios, esta comparación será true.
//Si el campo tiene texto, la comparación será false.

//submitButton.disabled = ...: La propiedad .disabled del botón es un booleano (true o false).
//Si la comparación anterior es true (es decir, el campo está vacío), entonces el botón se deshabilita (disabled = true).
//Si la comparación es false (es decir, el campo tiene texto), el botón se habilita (disabled = false).