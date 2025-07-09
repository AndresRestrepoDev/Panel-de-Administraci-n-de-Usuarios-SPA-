# 🧑‍🎓 Gestión de Estudiantes - SPA con JavaScript

Una aplicación de una sola página (**SPA**) construida desde cero con **HTML, CSS y JavaScript**, que permite realizar operaciones **CRUD completas** sobre una base de datos de estudiantes. Utiliza rutas personalizadas con hash (`#/ruta`) y un servidor JSON simulado como backend.

---

## 🚀 Funcionalidades

- ✅ Navegación sin recarga entre vistas (`#/users`, `#/add`, `#/update`, `#/delete`)
- ✅ Carga dinámica de contenido con `fetch()`
- ✅ Listado interactivo de estudiantes con tarjetas
- ✅ Crear, actualizar y eliminar estudiantes (CRUD)
- ✅ Confirmación visual de acciones (mensajes y modales)
- ✅ Estilos modernos y código organizado

---

## 🛠️ Tecnologías utilizadas

- HTML5, CSS3 (Flexbox)
- JavaScript ES6+
- JSON Server (para simular API REST)
- Rutas hash (`window.location.hash` y `history.pushState`)

---

## 📁 Estructura del proyecto

```
/project-root
│
├── index.html             → Contenedor SPA principal
├── main.html              → Vista principal (listar estudiantes)
├── addModal.html          → Formulario para agregar estudiante
├── update.html            → Formulario para editar estudiante
├── deleteModal.html       → Confirmación de eliminación
├── main.js                → Lógica SPA y CRUD con fetch()
├── db.json                → Base de datos simulada
├── Assets/                → Imágenes e íconos
└── style.css              → Estilos generales
```

---

## 🧪 Cómo usar el proyecto

1. Clona este repositorio en tu máquina local.
2. Instala JSON Server (si no lo tienes):

```bash
npm install -g json-server
```

3. Ejecuta el servidor:

```bash
json-server --watch db.json --port 3000
```

4. Abre `index.html` con Live Server (o tu navegador preferido).
5. Navega entre rutas como `#/users`, `#/add`, `#/update?id=3`.

---

## 📸 Capturas (opcional)

> Puedes agregar capturas aquí con la vista principal, el formulario, la edición, etc.

---

## 💡 Posibles mejoras futuras

- 🔍 Filtro y búsqueda en tiempo real
- 📱 Diseño responsive para móviles
- 🔐 Autenticación de usuarios
- ☁️ Conexión con base de datos real
- ⚙️ Migración a React, Vue o Svelte

---

## 🧑 Autor

**Andrés Felipe Restrepo Ramírez**  
Desarrollador web en formación, apasionado por construir interfaces limpias, funcionales y educativas.
