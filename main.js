document.addEventListener("DOMContentLoaded", () => {
  /*
   * ================================
   * INICIALIZACIÓN DEL SPA Y ROUTING CLIENTE
   * ================================
   * - Configura el enrutamiento basado en hash para navegación sin recarga.
   * - Escucha clicks en enlaces con atributo [data-link] para cambiar la vista.
   * - Carga la vista inicial según el hash de la URL.
   * - Escucha cambios en el hash para navegación con botones del navegador.
   */
  // Manejador de clics SPA con hash routing
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (link) {
      e.preventDefault();
      const ruta = new URL(link.href).hash; // extrae "#/users", "#/add", etc.
      location.hash = ruta; // actualiza la URL sin recargar
      cargarVista(ruta);
    }
  });

  // Cargar vista inicial según el hash actual o por defecto
  const rutaInicial = location.hash || "#/users";
  cargarVista(rutaInicial);

  // Detectar cambios en el hash (navegación con botones del navegador)
  window.addEventListener("hashchange", () => {
    cargarVista(location.hash);
  });
});

/*
 * ================================
 * CONTROLADOR DE VISTAS PRINCIPAL (cargarVista)
 * ================================
 * - Renderiza dinámicamente la vista correspondiente según la ruta hash.
 * - Gestiona la lógica de CRUD para usuarios: listar, agregar, eliminar y actualizar.
 * - Cada sección está separada por el tipo de acción y maneja la interacción con la API REST.
 */
function cargarVista(ruta) {
  const renderizador = document.getElementById("renderizador-index");

  if (ruta === "#/users") {
    /*
     * ----------- VISTA: LISTADO DE USUARIOS -----------
     * - Obtiene y renderiza la lista de usuarios desde la API REST.
     * - Genera tarjetas de usuario con acciones de editar y eliminar.
     */
    fetch("main.html")
      .then(res => res.text())
      .then(html => {
        renderizador.innerHTML = html;

        fetch("http://localhost:3000/users")
          .then(res => res.json())
          .then(data => {
            const contenedor = document.getElementById("renderizador-main");
            contenedor.innerHTML = "";

            data.forEach(usuario => {
              const card = document.createElement("div");
              card.classList.add("card-estudiante");
              card.innerHTML = `
              <div class="fila-usuario">
                <div class="fila-usuario__item">
                  <img src="${usuario.image || './Assets/profile.jpg'}" alt="foto" class="foto-estudiante">
                  <p>${usuario.name}</p>
                </div>
                <p>${usuario.email}</p>
                <p>${usuario.phone}</p>
                <p>${usuario.enrollNumber}</p>
                <p>${usuario.dateOfAdmission}</p>
                <div class="acciones">
                  <a href="#/update?id=${usuario.id}" data-link>
                    <img src="./Assets/lapix.png" alt="edit" class="icono-accion">
                  </a>
                  <a href="#/delete?id=${usuario.id}" data-link>
                    <img src="./Assets/basura.png" alt="delete" class="icono-accion">
                  </a>
                </div>
              </div>
            `;
              contenedor.appendChild(card);
            });
          });
      });

  } else if (ruta === "#/add") {
    /*
     * ----------- VISTA: AGREGAR USUARIO -----------
     * - Renderiza el formulario de alta de usuario.
     * - Envía los datos del formulario a la API REST para crear un nuevo usuario.
     */
    fetch("addModal.html")
      .then(res => res.text())
      .then(html => {
        renderizador.innerHTML = html;

        const formulario = document.getElementById("formulario");
        const cancelar = document.getElementById("cerrar-modal");

        formulario.addEventListener("submit", function (e) {
          e.preventDefault();

          const formData = new FormData(formulario);
          const nuevoUsuario = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            enrollNumber: formData.get("enrollNumber"),
            dateOfAdmission: formData.get("dateOfAdmission"),
            image: formData.get("image")
          };

          fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoUsuario)
          })
            .then(res => res.json())
            .then(data => {
              alert("✅ Estudiante creado correctamente");
              location.hash = "#/users"; // redirige sin recargar
              cargarVista("#/users");
            })
            .catch(err => {
              console.error("Error al crear estudiante:", err);
              alert("❌ Error al guardar.");
            });
        });
        // ✅ Cancelar
        cancelar.addEventListener("click", () => {
          location.hash = "#/users";
          cargarVista("#/users");
        });
      });
  } else if (ruta.startsWith("#/delete")) {
    /*
     * ----------- VISTA: ELIMINAR USUARIO -----------
     * - Renderiza el modal de confirmación de borrado.
     * - Realiza la petición DELETE a la API REST para eliminar el usuario.
     */
      const params = new URLSearchParams(ruta.split("?")[1]);
      const id = params.get("id");

      fetch("deleteModal.html")
        .then(res => res.text())
        .then(html => {
          renderizador.innerHTML = html;

          const btnEliminar = document.getElementById("bt-eliminar");
          const btnCancelar = document.getElementById("btn-cancelar");

          btnEliminar.addEventListener("click", () => {
            fetch(`http://localhost:3000/users/${id}`, {
              method: "DELETE"
            })
              .then(() => {
                alert("✅ Estudiante eliminado correctamente");
                location.hash = "#/users";
                cargarVista("#/users");
              })
              .catch(err => {
                console.error("Error al eliminar:", err);
                alert("❌ No se pudo eliminar.");
              });
          });

          btnCancelar.addEventListener("click", () => {
            location.hash = "#/users";
            cargarVista("#/users");
          });
        });
    } else if (ruta.startsWith("#/update")) {
      /*
       * ----------- VISTA: ACTUALIZAR USUARIO -----------
       * - Renderiza el formulario de edición de usuario.
       * - Obtiene los datos actuales del usuario desde la API REST.
       * - Permite modificar y guardar los cambios mediante una petición PUT.
       */
        const params = new URLSearchParams(ruta.split("?")[1]);
        const id = params.get("id");

        fetch("update.html")
          .then(res => res.text())
          .then(html => {
            renderizador.innerHTML = html;

            // Espera un ciclo para asegurar que los elementos estén cargados
            requestAnimationFrame(() => {
              const formulario = document.getElementById("formulario");
              const cancelar = document.getElementById("cerrar-modal");

              // ✅ Traer datos del estudiante
              fetch(`http://localhost:3000/users/${id}`)
                .then(res => res.json())
                .then(usuario => {
                  if (!usuario) {
                    alert("❌ Estudiante no encontrado.");
                    location.hash = "#/users";
                    cargarVista("#/users");
                    return;
                  }

                  // ✅ Llenar formulario con los datos actuales
                  formulario.elements["name"].value = usuario.name;
                  formulario.elements["email"].value = usuario.email;
                  formulario.elements["phone"].value = usuario.phone;
                  formulario.elements["enrollNumber"].value = usuario.enrollNumber;
                  formulario.elements["dateOfAdmission"].value = usuario.dateOfAdmission;
                  formulario.elements["image"].value = usuario.image || "";

                  // ✅ Guardar cambios
                  formulario.addEventListener("submit", (e) => {
                    e.preventDefault();

                    const datos = {
                      name: formulario.elements["name"].value,
                      email: formulario.elements["email"].value,
                      phone: formulario.elements["phone"].value,
                      enrollNumber: formulario.elements["enrollNumber"].value,
                      dateOfAdmission: formulario.elements["dateOfAdmission"].value,
                      image: formulario.elements["image"].value
                    };

                    fetch(`http://localhost:3000/users/${id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(datos)
                    })
                      .then(res => res.json())
                      .then(() => {
                        alert("✅ Estudiante actualizado correctamente.");
                        location.hash = "#/users";
                        cargarVista("#/users");
                      })
                      .catch(err => {
                        console.error("Error al actualizar:", err);
                        alert("❌ No se pudo actualizar.");
                      });
                  });

                  // ✅ Cancelar
                  cancelar.addEventListener("click", () => {
                    location.hash = "#/users";
                    cargarVista("#/users");
                  });
                })
                .catch(err => {
                  console.error("Error al cargar estudiante:", err);
                  alert("❌ No se pudo cargar el estudiante.");
                  location.hash = "#/users";
                  cargarVista("#/users");
                });
            });
          });
      }
}
