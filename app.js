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

function verImagen(imagen) {
  modal.style.display = "block";
  imgModal.src = imagen;
}

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

async function verDetalle(id) {
  try {
    const respuesta = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    const personaje = await respuesta.json();

    let opciones = `<option value="">Selecciona una transformación</option>`;

    if (personaje.transformations && personaje.transformations.length > 0) {
      opciones += personaje.transformations
        .map((t, i) => `<option value="${i}">${t.name}</option>`)
        .join("");
    }

    detalles.innerHTML = `
      <div class="contenedor-detalle">

        <!-- IZQUIERDA -->
        <div class="panel-personaje">
          <h2>${personaje.name}</h2>
          <p><strong>Raza:</strong> ${personaje.race}</p>
          <p><strong>Género:</strong> ${personaje.gender}</p>
          <p><strong>Ki:</strong> ${personaje.ki}</p>
          <p><strong>Max Ki:</strong> ${personaje.maxKi}</p>
          <p><strong>Afiliación:</strong> ${personaje.affiliation}</p>
          <p><strong>Descripción:</strong> ${personaje.description}</p>
        </div>

        <!-- DERECHA -->
        <div class="panel-transformaciones">
          <h3>Transformaciones</h3>

          ${
            personaje.transformations && personaje.transformations.length > 0
              ? `
              <div class="barra-transformaciones">
                <select id="selectTransformacion">
                  ${opciones}
                </select>
                <button id="btnVerTransformacion">Ver</button>
              </div>

              <div id="detalleTransformacion">
                <p>Selecciona una transformación</p>
              </div>
            `
              : `<p>No tiene transformaciones</p>`
          }

        </div>

      </div>
    `;

    transformaciones.innerHTML = "";

    if (personaje.transformations && personaje.transformations.length > 0) {
      const select = document.getElementById("selectTransformacion");
      const btn = document.getElementById("btnVerTransformacion");
      const cont = document.getElementById("detalleTransformacion");

      btn.addEventListener("click", () => {
        const index = select.value;

        if (index === "") {
          cont.innerHTML = `<p>Selecciona una transformación</p>`;
          return;
        }

        const t = personaje.transformations[index];

        cont.innerHTML = `
          <div class="card-transformacion">
            <img src="${t.image}" alt="${t.name}">
            <div>
              <p><strong>${t.name}</strong></p>
              <p>Ki: ${t.ki}</p>
            </div>
          </div>
        `;
      });
    }

  } catch (error) {
    console.log("Error:", error);
  }
}