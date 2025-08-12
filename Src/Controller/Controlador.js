// Controlador.js

class Controlador {

    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.vistaActual = null;
        this.estudianteActualModal = null;
        this.inicializarEventos();
        this.inicializarEventosDinamicos();
        this.inicializarFiltroAsistencia();
    }

    inicializarEventos() {
        // Eventos de los botones estáticos
        const botones = {
            'btnCheckCourse': 'marcarAsistenciaFicha',
            'btnCheckNotifications': 'notificaciones',
            'btnFollowUpPlan': 'seguimientoficha',
            'btnCheckUserManual': 'ayuda',
            'btnMakeReport': 'generareporte',
            'btnCheckHistory': 'historialFicha'
        };

        //  Eventos a todos los botones estáticos
        Object.entries(botones).forEach(([id, vista]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('click', () => this.cambiarVista(vista));
            }
        });

        const btnFiltrarHistorial = document.getElementById('btnFiltrerDayHistory');
        if (btnFiltrarHistorial) {
            btnFiltrarHistorial.addEventListener('click', () => this.filtrarHistorialAsistenciaModal());
        }

        // Evento para abrir modal con detalles de estudiante
        document.addEventListener('mostrarAsistenciaEstudiante', (event) => {
            const nombreEstudiante = event.detail.nombre;
            this.prepararModalAsistencia(nombreEstudiante);
        });

    }

    inicializarEventosDinamicos() {
        document.getElementById('dynamicContentContainer').addEventListener('click', (e) => {
            // Manejar el botón de seleccionar ficha para asistencia
            if (e.target.closest('#btnSelectAttendance')) {
                const fichaContainer = e.target.closest('#contentCardCourse');
                const fichaNumero = fichaContainer ?
                    fichaContainer.querySelector('strong').textContent.split(' ')[1] :
                    null;

                this.cambiarVistaConDatos('marcarAsistenciaEstudiante', {
                    fichaSeleccionada: fichaNumero
                });
            }

            // Manejar el botón de seleccionar ficha para historial
            if (e.target.closest('#btnSelectHistory')) {
                const fichaContainer = e.target.closest('#contentCardCourseHistory');
                if (fichaContainer) {
                    const fichaNumero = fichaContainer.querySelector('strong').textContent.split(' ')[1];

                    // Cambiar a la vista de historial de aprendiz
                    this.cambiarVistaConDatos('historialAprendiz', {
                        fichaSeleccionada: fichaNumero
                    });
                }
            }

            // Manejador para el botón de reporte
            if (e.target.closest('#btnSelectReport')) {
                const fichaContainer = e.target.closest('#contentCardGenerateReport');
                if (fichaContainer) {
                    const fichaNumero = fichaContainer.querySelector('strong').textContent.split(' ')[1];
                    console.log('Ficha seleccionada para reporte:', fichaNumero); // Debug
                    this.cambiarVistaConDatos('generareporteestudiante', {
                        fichaSeleccionada: fichaNumero
                    });
                }
            }

            // Manejador para el botón de seguimiento
            if (e.target.closest('#btnSeguimiento')) {
                const estudianteContainer = e.target.closest('#contentCardCourseTracking');
                if (estudianteContainer) {
                    const nombreEstudiante = estudianteContainer.querySelector('strong').textContent;
                    console.log(`Botón de seguimiento presionado para: ${nombreEstudiante}`); // Log adicional
                    this.cambiarVistaConDatos('seguimientoestudiante', {
                        nombreEstudiante: nombreEstudiante
                    });
                }
            }

            // Manejador para el botón de seguimiento de ficha
            if (e.target.closest('#btnSeguimientoFicha')) {
                const fichaContainer = e.target.closest('#contentCardCourseTracking');
                if (fichaContainer) {
                    const fichaNumero = fichaContainer.querySelector('strong').textContent.split(' ')[1];
                    this.cambiarVistaConDatos('seguimientoestudiante', {
                        fichaSeleccionada: fichaNumero
                    });
                }
            }

            // Manejador para el botón de seguimiento de estudiante
            if (e.target.closest('#btnSeguimientoEstudiante')) {
                const estudianteContainer = e.target.closest('#contentCardStudentTracking');
                if (estudianteContainer) {
                    const nombreEstudiante = estudianteContainer.querySelector('strong').textContent;

                    // Imprimir en consola para depuración
                    console.log('Estudiante seleccionado:', nombreEstudiante);

                    // Verificar si el estudiante tiene plan de seguimiento
                    const estudiante = this.modelo.seguimientoestudiante.datos.find(
                        est => est.nombre.trim() === nombreEstudiante.trim()
                    );

                    console.log('Datos del estudiante:', estudiante);

                    if (estudiante && estudiante.tienePlan) {
                        // Mostrar modal de detalles del plan
                        this.mostrarModalPlanSeguimiento(nombreEstudiante);
                    } else {
                        // Mostrar modal de advertencia
                        this.mostrarModalAdvertenciaPlan(nombreEstudiante);
                    }
                }
            }
        });

        // Evento para manejar notificaciones
        document.getElementById('dynamicContentContainer').addEventListener('click', (e) => {
            const btnNotificacion = e.target.closest('#btnNotification');
            if (btnNotificacion) {
                const titulo = btnNotificacion.getAttribute('data-titulo');
                const fecha = btnNotificacion.getAttribute('data-fecha');
                const contenido = btnNotificacion.getAttribute('data-contenido');

                // Actualizar el modal
                document.querySelector('#notificationModal .modal-header .card-title').innerHTML =
                    `<strong>Estudiante en <span style="color: #39A900;">riesgo</span>: ${titulo}</strong>`;

                document.querySelector('#notificationModal .modal-body small').textContent =
                    `Enviada ${fecha}`;

                document.querySelector('#notificationModal .modal-body p:last-child').textContent =
                    contenido;
            }
        });

        // Evento que abre el pdf de reporte de ficha
        document.getElementById('dynamicContentContainer').addEventListener('click', (e) => {
            // Manejar el botón de generar reporte de estudiante
            if (e.target.closest('#btnGenerateReport')) {
                // Abre el PDF
                window.open('../Resources/Documents/StudentReport.pdf', '_blank');
            }
        });

        //Evento que abre el pdf de reporte individual de estudiante
        document.getElementById('historyAsistModal').addEventListener('click', (e) => {
            // Manejar el botón de generar reporte de estudiante   
            if (e.target.closest('#btnSaveIndividualReport')) {
                // Abre el PDF
                window.open('../Resources/Documents/StudentReport.pdf', '_blank');
            }
        });

        // Evento que abre manual de usuario
        document.getElementById('dynamicContentContainer').addEventListener('click', (e) => {
            // Manejar el botón de generar manual de usuario
            if (e.target.closest('#btnManualDownload')) {
                // Abre el PDF
                window.open('../Resources/Documents/UserManual.pdf', '_blank');
            }
        });

        // Añadir evento de búsqueda
        const searchBar = document.getElementById('searchBarSpaceWork');
        if (searchBar) {
            searchBar.addEventListener('input', () => this.filtrarContenido(searchBar.value));
        }
    }

    // Método para preparar el modal de asistencia
    prepararModalAsistencia(nombreEstudiante) {
        // Guardar el nombre del estudiante actual
        this.estudianteActualModal = nombreEstudiante;

        // Limpiar selecciones previas
        document.getElementById('selectMes').selectedIndex = 0;
        document.getElementById('selectSemana').selectedIndex = 0;
        document.getElementById('selectBloque').selectedIndex = 0;

        // Obtener historial de asistencia del estudiante
        const historialAsistencia = this.modelo.obtenerHistorialAsistenciaEstudiante(nombreEstudiante);

        // Renderizar todos los días de asistencia inicialmente
        this.renderizarDiasAsistenciaHistorial(historialAsistencia);
    }

    // Método para filtrar el historial de asistencia en el modal
    filtrarHistorialAsistenciaModal() {
        // Verificar que haya un estudiante seleccionado
        if (!this.estudianteActualModal) {
            console.error('No se ha seleccionado un estudiante');
            return;
        }

        // Obtener valores de filtros
        const mesSel = document.getElementById('selectMes').value;
        const semanaSel = document.getElementById('selectSemana').value;
        const bloqueSel = document.getElementById('selectBloque').value;

        // Obtener el historial de asistencia del estudiante
        const historialEstudiante = this.modelo.obtenerHistorialAsistenciaEstudiante(this.estudianteActualModal);

        // Filtrar días de asistencia
        const diasFiltrados = historialEstudiante.filter(dia => {
            const mesCoincide = !mesSel || dia.mes === parseInt(mesSel);
            const semanaCoincide = !semanaSel || dia.semana === parseInt(semanaSel);
            const bloqueCoincide = !bloqueSel || dia.bloque === parseInt(bloqueSel);

            return mesCoincide && semanaCoincide && bloqueCoincide;
        });

        // Renderizar días filtrados en el historial
        this.renderizarDiasAsistenciaHistorial(diasFiltrados);
    }

    // Método para renderizar los días de asistencia en el historial
    renderizarDiasAsistenciaHistorial(diasAsistencia) {
        const historyContainer = document.getElementById('historyContainer');
        historyContainer.innerHTML = ''; // Limpiar contenedor

        diasAsistencia.forEach(dia => {
            // Utilizar el método de la vista para crear la tarjeta
            const tarjetaDia = this.vista.renderizarHistorialDiaAsistencia(dia);
            historyContainer.appendChild(tarjetaDia);
        });
    }

    prepararModalAsistencia(nombreEstudiante) {
        // Guardar el nombre del estudiante actual
        this.estudianteActualModal = nombreEstudiante;

        // Limpiar selecciones previas
        document.getElementById('selectMes').selectedIndex = 0;
        document.getElementById('selectSemana').selectedIndex = 0;
        document.getElementById('selectBloque').selectedIndex = 0;

        // Obtener historial de asistencia del estudiante
        const historialAsistencia = this.modelo.obtenerHistorialAsistenciaEstudiante(nombreEstudiante);

        // Renderizar todos los días de asistencia inicialmente
        this.renderizarDiasAsistenciaHistorial(historialAsistencia);
    }

    mostrarModalPlanSeguimiento(nombreEstudiante) {
        const modalDetalles = document.getElementById('MoreDetaillFillUpModal');
        const modalAdvertencia = document.getElementById('warningFillUpModal');

        if (!modalDetalles || !modalAdvertencia) {
            console.error('Uno de los modales no fue encontrado');
            return;
        }

        // Buscar el estudiante en el modelo
        const estudiante = this.modelo.seguimientoestudiante.datos.find(
            est => est.nombre.trim() === nombreEstudiante.trim()
        );

        if (estudiante && estudiante.tienePlan) {
            // Actualizar elementos del modal
            document.getElementById('nombreEstudiantePlan').textContent = nombreEstudiante;
            document.getElementById('fechaPlan').textContent = 'Creado el 7 de octubre del 2024, 13:00';
            document.getElementById('descripcionPlan').innerHTML = `
            Se ha iniciado un plan de mejoramiento para abordar las dificultades académicas del estudiante 
            ${nombreEstudiante}. Este plan tiene como objetivo proporcionar apoyo adicional y estrategias 
            para superar los desafíos actuales en su proceso de aprendizaje y desarrollo académico.
        `;

            if (window.bootstrap && window.bootstrap.Modal) {
                const modalAdv = bootstrap.Modal.getInstance(modalAdvertencia);
                if (modalAdv) modalAdv.hide();

                const modal = new bootstrap.Modal(modalDetalles);
                modal.show();
            } else {
                console.error('Bootstrap Modal no está definido');
            }
        } else {
            // Lógica para mostrar modal de advertencia
            const mensajeElemento = modalAdvertencia.querySelector('#modalMessageError');
            if (mensajeElemento) {
                mensajeElemento.innerHTML = `Este estudiante <strong style="color: #39A900;">${nombreEstudiante}</strong> no cuenta con plan de seguimiento actualmente. ¿<strong style="color: #39A900;">Deseas agendar uno nuevo</strong>?`;
            }

            if (window.bootstrap && window.bootstrap.Modal) {
                const modalDet = bootstrap.Modal.getInstance(modalDetalles);
                if (modalDet) modalDet.hide();

                const modal = new bootstrap.Modal(modalAdvertencia);
                modal.show();
            } else {
                console.error('Bootstrap Modal no está definido');
            }
        }
    }

    inicializarFiltroAsistencia() {
        const btnFiltrar = document.getElementById('btnFiltrerCourse');
        if (btnFiltrar) {
            btnFiltrar.addEventListener('click', () => this.filtrarAsistencia());
        }
    }

    filtrarAsistencia() {
        // Limpiar contenedor de asistencia
        const asistContainer = document.getElementById('asistContainer');
        asistContainer.innerHTML = '';

        // Obtener valores de filtros
        const mesSel = document.getElementById('selectMes').value;
        const semanaSel = document.getElementById('selectSemana').value;
        const bloqueSel = document.getElementById('selectBloque').value;

        // Filtrar días de asistencia
        const diasFiltrados = this.modelo.diasAsistencia.filter(dia => {
            const mesCoincide = !mesSel || dia.mes === parseInt(mesSel);
            const semanaCoincide = !semanaSel || dia.semana === parseInt(semanaSel);
            const bloqueCoincide = !bloqueSel || dia.bloque === parseInt(bloqueSel);

            return mesCoincide && semanaCoincide && bloqueCoincide;
        });

        // Renderizar días filtrados
        diasFiltrados.forEach(dia => {
            const tarjetaDia = this.vista.renderizarDiaAsistencia(dia);
            asistContainer.innerHTML += tarjetaDia;
        });
    }

    cargarDiasAsistenciaEstudiante(nombreEstudiante) {
        const diasAsistencia = this.modelo.obtenerDiasAsistenciaPorEstudiante(nombreEstudiante);

        // Limpiar contenedor de asistencia
        const asistContainer = document.getElementById('asistContainer');
        asistContainer.innerHTML = '';

        // Renderizar días de asistencia
        diasAsistencia.forEach(dia => {
            const tarjetaDia = this.vista.renderizarDiaAsistencia(dia);
            asistContainer.innerHTML += tarjetaDia;
        });
    }

    renderizarDiasAsistencia(diasAsistencia) {
        const asistContainer = document.getElementById('asistContainer');
        asistContainer.innerHTML = '';

        diasAsistencia.forEach(dia => {
            const tarjetaDia = this.vista.renderizarHistorialDiaAsistencia(dia);
            asistContainer.innerHTML += tarjetaDia;
        });
    }

    filtrarContenido(terminoBusqueda) {
        // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
        const busqueda = terminoBusqueda.toLowerCase().trim();

        // Obtener la vista actual desde el último template usado
        const configuracionActual = Object.values(this.modelo.vistasDisponibles).find(
            config => config.template === this.vista.ultimoTemplateUsado
        );

        if (configuracionActual) {
            // Filtrar los datos según el término de búsqueda
            const datosFiltrados = configuracionActual.datos.filter(dato => {
                // Buscar en diferentes propiedades dependiendo del tipo de dato
                if (dato.numero) {
                    return dato.numero.toLowerCase().includes(busqueda);
                }
                if (dato.nombre) {
                    return dato.nombre.toLowerCase().includes(busqueda);
                }
                if (dato.titulo) {
                    return dato.titulo.toLowerCase().includes(busqueda);
                }
                return false;
            });

            // Recargar la vista con los datos filtrados
            this.vista.cargarTemplate(configuracionActual.template, datosFiltrados);
        }
    }

    cambiarVistaConDatos(tipoVista, datosAdicionales) {
        const configuracion = this.modelo.obtenerConfiguracionVista(tipoVista);

        if (configuracion) {
            let datosFiltrados = [...configuracion.datos];

            // Filtrar estudiantes por ficha seleccionada
            if (datosAdicionales?.fichaSeleccionada && tipoVista === 'historialAprendiz') {
                datosFiltrados = configuracion.datos.filter(estudiante =>
                    estudiante.ficha === datosAdicionales.fichaSeleccionada
                );
            }

            // Actualizar la vista
            this.vista.actualizarTitulo(configuracion.titulo);
            this.vista.actualizarSubtitulo(configuracion.subtitulo);
            this.vista.cargarTemplate(configuracion.template, datosFiltrados);
        }
    }

    cambiarVista(tipoVista) {
        this.cambiarVistaConDatos(tipoVista, null);
    }

}


// funcion de filtrado de opciones de menu de navegacion
document.getElementById('searchBar').addEventListener('input', filterOptionMenu);

function filterOptionMenu() {
    const searchText = document.getElementById('searchBar').value.toLowerCase();
    const btnNavegation = document.querySelectorAll('#btnNavegation .btnNavegation');

    btnNavegation.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if (btnText.includes(searchText)) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }

        
    });
}



  // agregar más métodos aquí



export default Controlador;

