if (typeof estaLogueado === 'function' && !estaLogueado()) {
    window.location.href = 'login.html';
}

const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listadoVeterinarios = document.getElementById('listado-veterinarios');
const total = document.getElementById('total');
const formulario = document.getElementById('form-veterinario');
const inputBuscador = document.getElementById('buscador');

const formularioEditar = document.getElementById('form-editar');
const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));
let idVeterinarioEditar;

function eliminarVeterinario(id) {
    const indice = veterinarios.findIndex((vet) => vet.idVeterinario === id);
    if (indice !== -1) {
        veterinarios.splice(indice, 1);
        guardarEnLocalStorage();
        render();
    }
}

function editarVeterinario(id) {
    idVeterinarioEditar = id;
    const vet = veterinarios.find((v) => v.idVeterinario === id);
    if (!vet) return;

    document.getElementById('editarMatricula').value = vet.matricula;
    document.getElementById('editarNombre').value = vet.nombre;
    document.getElementById('editarEspecializacion').value = vet.especializacion;
    document.getElementById('editarValorConsulta').value = vet.valorConsulta;

    modalEditar.show();
}

function render(veterinariosAMostrar = veterinarios) {
    listadoVeterinarios.innerHTML = '';

    if (veterinariosAMostrar.length === 0) {
        listadoVeterinarios.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <img src="./img/mascotas_veterinarios_carga.jpeg" alt="Sin profesionales" style="width: 140px; height: auto;" class="d-block mx-auto mb-3">
                    <p class="fw-bold mb-1" style="color: var(--color-acent-secundary);">Aún no hay profesionales registrados.</p>
                    <p class="text-muted small mb-0">Completá el formulario de la izquierda para agregar un nuevo miembro al equipo.</p>
                </td>
            </tr>
        `;
        total.textContent = '0';
        return;
    }

    veterinariosAMostrar.forEach((vet) => {
        const valorFormateado = Number(vet.valorConsulta).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'
        });

        listadoVeterinarios.innerHTML += `
            <tr>
                <td>${vet.matricula}</td>
                <td>${vet.nombre}</td>
                <td>${vet.especializacion}</td>
                <td>${valorFormateado}</td>
                <td class="text-end">
                    <button class="btn btn-warning btn-sm me-1" onclick="editarVeterinario('${vet.idVeterinario}')">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarVeterinario('${vet.idVeterinario}')">
                        Eliminar
                    </button>      
                </td>
            </tr>
        `;
    });

    total.textContent = veterinariosAMostrar.length;
}

render();

function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

if (inputBuscador) {
    inputBuscador.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase().trim();

        const veterinariosFiltrados = veterinarios.filter((vet) => {
            const nombreCoincide = vet.nombre.toLowerCase().includes(textoBusqueda);
            const especialidadCoincide = vet.especializacion.toLowerCase().includes(textoBusqueda);
            const matriculaCoincide = vet.matricula.toString().includes(textoBusqueda);

            return nombreCoincide || especialidadCoincide || matriculaCoincide;
        });

        render(veterinariosFiltrados);
    });
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevoVeterinario = {
        idVeterinario: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        matricula: Number(datos.get('matricula')),
        nombre: datos.get('nombre').trim(),
        especializacion: datos.get('especializacion'),
        valorConsulta: parseFloat(datos.get('valorConsulta'))
    };

    veterinarios.push(nuevoVeterinario);
    guardarEnLocalStorage();
    
    if (inputBuscador) inputBuscador.value = '';
    render();
    formulario.reset();
});

formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        const datos = new FormData(formularioEditar);
        const vet = veterinarios.find((v) => v.idVeterinario === idVeterinarioEditar);

        if (vet) {
            vet.matricula = Number(datos.get('editarMatricula'));
            vet.nombre = datos.get('editarNombre').trim();
            vet.especializacion = datos.get('editarEspecializacion');
            vet.valorConsulta = parseFloat(datos.get('editarValorConsulta'));

            guardarEnLocalStorage();    
            render();
            modalEditar.hide();
            idVeterinarioEditar = undefined;
        }
    } catch (error) {
        console.error(error);
    }
});