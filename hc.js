

const historias = JSON.parse(localStorage.getItem('hc')) || [];

const listadoHistoriaClinicas = document.getElementById('filaHistoriasClinicas');

const total = document.getElementById('totalHistoriasClinicas');

const formulario = document.getElementById('formularioHistoriasClinicas');

const formularioEditar = document.getElementById('formularioEditarHistoriasClinicas');

const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));

let idHistoriaClinicaEditar;


// eliminar historia clinica
function eliminarHistoriaClinica(id) {
  const indice = historias.findIndex((historia) => historia.idHistoriaClinica === id);
  historias.splice(indice, 1);
  guardarEnLocalStorage();
  render()
};
// edicion historias clinicas.
function editarHistoriaClinica(id) {

  idHistoriaClinicaEditar = id;

  const historiaClinica = historias.find((hc) => hc.idHistoriaClinica === id);

  document.getElementById('editarMascota').value = historiaClinica.mascota;
  document.getElementById('editarVeterinario').value = historiaClinica.veterinario;
  document.getElementById('editarFechaHora').value = historiaClinica.fechaHora;
  document.getElementById('editarObservaciones').value = historiaClinica.observaciones;
  modalEditar.show();
}

// funcion para cargar los datos al entrar en la web
function render() {
  //limpiar la tabla , si hay datos previos no se dupliquen
  listadoHistoriaClinicas.innerHTML = '';
  historias.forEach((hc) => {

    listadoHistoriaClinicas.innerHTML += `
        <tr>
          <td>${hc.mascota} </td>
          <td>${hc.veterinario}</td>
          <td>${hc.fechaHora}</td>
          <td>${hc.observaciones}</td>
          <td><div class="d-flex gap-2">
        <button class="btn btn-outline-danger btn-sm" onclick="eliminarHistoriaClinica('${hc.idHistoriaClinica}')">Eliminar</button>
        <button class="btn btn-outline-success btn-sm" onclick="editarHistoriaClinica('${hc.idHistoriaClinica}')">Editar</button>
    </div></td>
        </tr>
    `
  });
  total.textContent = historias.length;
};

function guardarEnLocalStorage() {
  localStorage.setItem('hc', JSON.stringify(historias));

};

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(formulario);

  const nuevaHc = {
    idHistoriaClinica: crypto.randomUUID(),
    // para usar datos.get y pasarle por parametro
    // el valor de la propiedad name del input por capturar
    mascota: datos.get('mascota').trim(),
    veterinario: datos.get('veterinario').trim(),
    fechaHora: datos.get('fechaHora').trim(),
    observaciones: datos.get('observaciones').trim()

  };

  historias.push(nuevaHc);

  guardarEnLocalStorage();


  formulario.reset();
  render();

});
render();

formularioEditar.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const data = new FormData(formularioEditar);

    const hc = historias.find((hc) => hc.idHistoriaClinica === idHistoriaClinicaEditar);

    hc.mascota = data.get('editarMascota').trim();
    hc.veterinario = data.get('editarVeterinario').trim();
    hc.fechaHora = data.get('editarFechaHora').trim();
    hc.observaciones = data.get('editarObservaciones').trim();

    guardarEnLocalStorage();
    render();
    modalEditar.hide();
    idHistoriaClinicaEditar = null;

  } catch (error) {
    console.log(error);
  };
});

