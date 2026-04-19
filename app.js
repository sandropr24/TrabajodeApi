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

btnMostrar.addEventListener("click", async () => {
  try {
    const razaSeleccionada = selectRaza.value;

    if (razaSeleccionada === "") {
      alert("Selecciona una raza");
      return;
    }

    const personajes = await obtenerTodosLosPersonajes();
    personajesGlobal = personajes;

    const filtrados = personajes.filter(
      (personaje) => personaje.race === razaSeleccionada
    );

    cuerpoTabla.innerHTML = "";
    detalles.innerHTML = "";
    transformaciones.innerHTML = "";

    if (filtrados.length === 0) {
      cuerpoTabla.innerHTML = `
        <tr>
          <td colspan="6">No se encontraron personajes para esta raza</td>
        </tr>
      `;
      return;
    }

    filtrados.forEach((personaje) => {
      cuerpoTabla.innerHTML += `
        <tr>
          <td>${personaje.id}</td>
          <td>${personaje.name}</td>
          <td>${personaje.ki}</td>
          <td>${personaje.gender}</td>
          <td>
            <button onclick="verImagen('${personaje.image}')">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </td>
          <td>
            <button onclick="verDetalle(${personaje.id})">Ver</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.log("Error:", error);
  }
});

