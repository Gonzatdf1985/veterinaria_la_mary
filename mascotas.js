// Clave propia de la entidad en LocalStorage
const CLAVE_MASCOTAS = "mascotas";

// Referencias al DOM
const form = document.getElementById("formMascota");
const inputId = document.getElementById("idMascota");
const inputNombre = document.getElementById("nombreMascota");
const inputDuenio = document.getElementById("nombreDuenio");
const inputColor = document.getElementById("color");
const inputEdad = document.getElementById("edad");
const inputPeso = document.getElementById("peso");
const tabla = document.getElementById("tablaMascotas");
const total = document.getElementById("totalMascotas");
const titulo = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const badgeModo = document.getElementById("badgeModo");
const buscador = document.getElementById("buscador");

// ---------- LocalStorage ----------
function obtenerMascotas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];
  } catch (e) {
    return [];
  }
}

function guardarMascotas(mascotas) {
  localStorage.setItem(CLAVE_MASCOTAS, JSON.stringify(mascotas));
}

// ---------- ID automático ----------
function generarId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Alternativa por si el navegador no soporta randomUUID
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// ---------- Listar ----------
function listarMascotas() {
  const todas = obtenerMascotas();
  const texto = buscador.value.trim().toLowerCase();
  // El buscador filtra solo lo que se muestra; el total cuenta todas las guardadas
  const mascotas = todas.filter((m) =>
    [m.nombreMascota, m.nombreDuenio, m.color].some((v) => v.toLowerCase().includes(texto))
  );
  tabla.innerHTML = "";

  if (mascotas.length === 0) {
    const mensaje = todas.length === 0 ? "Todavía no hay mascotas registradas." : "No hay resultados para la búsqueda.";
    tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">${mensaje}</td></tr>`;
  }

  mascotas.forEach((m) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td>${m.edad}</td>
      <td>${m.peso} kg</td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-warning btn-editar" data-id="${m.idMascota}">Editar</button>
        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${m.idMascota}">Eliminar</button>
      </td>`;
    // textContent evita inyectar HTML con lo que escribe el usuario
    fila.children[0].textContent = m.nombreMascota;
    fila.children[1].textContent = m.nombreDuenio;
    fila.children[2].textContent = m.color;
    tabla.appendChild(fila);
  });

  total.textContent = todas.length;
}

// ---------- Validación ----------
function validarFormulario() {
  let valido = true;

  [inputNombre, inputDuenio, inputColor].forEach((campo) => {
    const ok = campo.value.trim() !== "";
    campo.classList.toggle("is-invalid", !ok);
    if (!ok) valido = false;
  });

  const edad = inputEdad.value.trim();
  const edadOk = edad !== "" && Number.isInteger(Number(edad)) && Number(edad) >= 0;
  inputEdad.classList.toggle("is-invalid", !edadOk);
  if (!edadOk) valido = false;

  const peso = inputPeso.value.trim();
  const pesoOk = peso !== "" && !isNaN(Number(peso)) && Number(peso) >= 0;
  inputPeso.classList.toggle("is-invalid", !pesoOk);
  if (!pesoOk) valido = false;

  return valido;
}

// ---------- Registrar / Editar ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const mascotas = obtenerMascotas();
  const datos = {
    nombreMascota: inputNombre.value.trim(),
    nombreDuenio: inputDuenio.value.trim(),
    color: inputColor.value.trim(),
    edad: parseInt(inputEdad.value, 10),
    peso: parseFloat(inputPeso.value),
  };

  if (inputId.value) {
    // Edición: se mantiene el id original
    const indice = mascotas.findIndex((m) => m.idMascota === inputId.value);
    if (indice !== -1) {
      mascotas[indice] = { idMascota: inputId.value, ...datos };
    }
  } else {
    // Alta: el id se genera solo
    mascotas.push({ idMascota: generarId(), ...datos });
  }

  guardarMascotas(mascotas);
  limpiarFormulario();
  listarMascotas();
});

// ---------- Editar / Eliminar (delegación de eventos) ----------
tabla.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;
  const id = boton.dataset.id;

  if (boton.classList.contains("btn-editar")) {
    cargarParaEditar(id);
  } else if (boton.classList.contains("btn-eliminar")) {
    eliminarMascota(id);
  }
});

function cargarParaEditar(id) {
  const mascota = obtenerMascotas().find((m) => m.idMascota === id);
  if (!mascota) return;

  inputId.value = mascota.idMascota;
  inputNombre.value = mascota.nombreMascota;
  inputDuenio.value = mascota.nombreDuenio;
  inputColor.value = mascota.color;
  inputEdad.value = mascota.edad;
  inputPeso.value = mascota.peso;

  titulo.textContent = "Editar Mascota";
  badgeModo.textContent = "Editando";
  btnGuardar.innerHTML = '<i class="bi bi-save me-2"></i>Guardar Cambios';
  btnCancelar.classList.remove("d-none");
  inputNombre.focus();
}

function eliminarMascota(id) {
  if (!confirm("¿Seguro que querés eliminar esta mascota?")) return;

  const mascotas = obtenerMascotas().filter((m) => m.idMascota !== id);
  guardarMascotas(mascotas);

  // Si justo se estaba editando la que se borró, se limpia el formulario
  if (inputId.value === id) limpiarFormulario();
  listarMascotas();
}

// ---------- Utilidades ----------
function limpiarFormulario() {
  form.reset();
  inputId.value = "";
  form.querySelectorAll(".is-invalid").forEach((c) => c.classList.remove("is-invalid"));
  titulo.textContent = "Alta de Mascota";
  badgeModo.textContent = "Nuevo";
  btnGuardar.innerHTML = '<i class="bi bi-save me-2"></i>Guardar Registro';
  btnCancelar.classList.add("d-none");
}

btnCancelar.addEventListener("click", limpiarFormulario);
buscador.addEventListener("input", listarMascotas);

// Al cargar la página se muestran los datos guardados
document.addEventListener("DOMContentLoaded", listarMascotas);