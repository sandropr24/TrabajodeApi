// Estructurando el proyecto
const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnMostrar = document.getElementById("btnMostrar");
const selectRaza = document.getElementById("raza");
const modal = document.getElementById("modal");
const imgModal = document.getElementById("imgModal");
const cerrarModal = document.getElementById("cerrarModal");
const detalles = document.getElementById("detalles");
const transformaciones = document.getElementById("transformaciones");

let personajesGlobal = [];

async function obtenerTodosLosPersonajes() {
  let url = "https://dragonball-api.com/api/characters";
  let todos = [];

  while (url) {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    todos = todos.concat(datos.items);
    url = datos.links.next || null;
  }

  return todos;
}

