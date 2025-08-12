cd//Vista.js

// Logica de navegacion de la pagina

class Vista {
    constructor() {
        this.optionMenu = document.getElementById('optionMenu');
        this.title = document.getElementById('title');
        this.subTitle = document.getElementById('subTitle');
        this.dynamicContentContainer = document.getElementById('dynamicContentContainer');
        this.ultimoTemplateUsado = null;
    }

    actualizarTitulo(texto) {
        this.title.innerHTML = `<strong style="color: #00304D;">${texto}</strong>`;
    }

    actualizarSubtitulo(texto) {
        this.subTitle.innerHTML = `
            <div style="width: 90%; margin: 0 auto;">
                <div class="d-flex flex-column align-items-center" style="width: 100%;">
                    <div class="d-flex justify-content-center align-items-center"
                        style="color:#00304D; font-size: 14.5px;">
                        <strong>${texto}</strong>
                    </div>
                    <div class="linea-horizontal"
                        style="width: 100%; height: 2px; background-color: #00304D; margin-top: 10px;">
                    </div>
                </div>
            </div>`;
    }

    renderizarmarcarAsistenciaFicha(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardCourse" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/FolderIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">Ficha ${dato.numero}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" id="btnSelectAttendance">
                <strong>Seleccionar</strong>
            </button>
        </div>`;
    }

    renderizarmarcarAsistenciaEstudiante(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardStudent" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/UserIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.nombre}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#asistModal" id="btnMakeAttendance">
                <strong>Registre asistencia</strong>
            </button>
        </div>`;
    }

    renderizarhistorialFicha(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardCourseHistory" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/FolderIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">Ficha ${dato.numero}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" id="btnSelectHistory">
                <strong>Seleccionar</strong>
            </button>
        </div>`;
    }

    renderizarhistorialAprendiz(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardStudentHistory" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/UserIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.nombre}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#historyAsistModal" id="moreOptionBtn">
                <strong>Ver historial</strong>
            </button>
        </div>`;
    }

    renderizargenerareporte(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardGenerateReport" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/FolderIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">Ficha ${dato.numero}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" id="btnGenerateReport">
                <strong>Seleccionar</strong>
            </button>
        </div>`;
    }

    renderizarseguimientoficha(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardCourseTracking" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/FolderIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">Ficha ${dato.numero}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#seguimientoModal" id="btnSeguimientoFicha">
                <strong>Ver plan de seguimiento</strong>
            </button>
        </div>`;
    }

    renderizarseguimientoEstudiante(dato) {
        return `
            <div class="d-flex align-items-center mb-2" id="contentCardStudentTracking" style="width: 100%; max-width: 1100px;">
                <img src="../Resources/Img/UserIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
                <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.nombre}</strong>
                <div class="flex-grow-1"></div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#warningFillUpModal" id="btnSeguimientoEstudiante">
                    <strong>Ver plan de seguimiento</strong>
                </button>
            </div>`;
    }

    renderizarNotificacion(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardNotificatión" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/NotificationIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <div class="text-left">
                <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.titulo}</strong>
                <p class="card-text"><small class="text-body-secondary" style="font-size: 20px; margin-left: 2vh;"><strong>Enviada ${dato.fecha}</strong></small></p>
            </div>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#notificationModal" id="btnNotification" 
                data-titulo="${dato.titulo}" 
                data-fecha="${dato.fecha}" 
                data-contenido="${dato.contenido}">
                <strong>Ver notificación</strong>
            </button>
        </div>`;
    }

    renderizarEstudiante(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardStudent" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/UserIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.nombre}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#asistModal" id="moreOptionBtn">
                <strong>Ver historial</strong>
            </button>
        </div>`;
    }

    renderizarReporte(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardCourse" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/FolderIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">Ficha ${dato.numero}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#optionModal" id="moreOptionBtn">
                <strong>Generar reporte</strong>
            </button>
        </div>`;
    }

    renderizarManual(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="contentCardManual" style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/QuestionIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.titulo}</strong>
            <div class="flex-grow-1"></div>
            <button type="button" class="btn btn-primary" id="btnManualDownload">
                <strong>Descarga manual</strong>
            </button>
        </div>`;
    }

    renderizarDiaAsistencia(dato) {
        return `
        <div class="d-flex align-items-center mb-2" id="dayContentCard" 
            data-mes="${dato.mes}" 
            data-semana="${dato.semana}" 
            data-bloque="${dato.bloque}"
            style="width: 100%; max-width: 1100px;">
            <img src="../Resources/Img/CalendarIcon.png" alt="Imagen 1" class="imagen-sub-div" id="iconImg" style="width: 50px;">
            <strong style="color: #00304D; font-size: 30px; margin-left: 2vh;">${dato.dia} ${dato.numero}</strong>
            <div class="flex-grow-1"></div>
            <div class="form-floating" style="width: 200px;">
                <select class="form-select" id="selectAsistencia">
                    <option disabled selected hidden></option>
                    <option value="1">Asistido</option>
                    <option value="2">No asistido</option>
                    <option value="3">Justificado</option>
                </select>
                <label for="selectAsistencia" style="margin-top: 1vh;">
                    <strong>Marcar asistencia</strong>
                </label>
            </div>
        </div>`;
    }

    renderizarHistorialDiaAsistencia(dia) {
        // Crear el contenedor principal de la tarjeta
        const tarjetaDia = document.createElement('div');
        tarjetaDia.className = 'd-flex align-items-center mb-2';
        tarjetaDia.style.width = '100%';
        tarjetaDia.style.maxWidth = '1100px';
        tarjetaDia.id = 'HistoryDayContentCard'; // Asegúrate de que tenga este ID
    
        // Crear ícono de calendario
        const iconoCalendario = document.createElement('img');
        iconoCalendario.src = '../Resources/Img/CalendarIcon.png';
        iconoCalendario.alt = 'Imagen de calendario';
        iconoCalendario.className = 'imagen-sub-div';
        iconoCalendario.style.width = '50px';
        iconoCalendario.id = 'iconImg';
    
        // Crear texto del día
        const textoDia = document.createElement('strong');
        textoDia.textContent = `${dia.dia} ${dia.numero}`;
        textoDia.style.color = '#00304D';
        textoDia.style.fontSize = '30px';
        textoDia.style.marginLeft = '2vh';
    
        // Crear espacio flexible
        const espacioFlexible = document.createElement('div');
        espacioFlexible.className = 'flex-grow-1';
    
        // Crear botón de estado
        const botonEstado = document.createElement('button');
        botonEstado.className = 'btn btn-primary';
        botonEstado.type = 'button';
        botonEstado.id = 'btnHistoryAsist';
        botonEstado.innerHTML = `<strong>${dia.estado}</strong>`;
    
        // Establecer color según el estado
        switch(dia.estado) {
            case 'Asistido':
                botonEstado.style.backgroundColor = ''; // Color predeterminado de Bootstrap
                break;
            case 'No asistido':
                botonEstado.style.backgroundColor = '#fc0505';
                break;
            case 'Justificado':
                botonEstado.style.backgroundColor = '#f6c307';
                break;
        }
    
        // Ensamblar la tarjeta
        tarjetaDia.appendChild(iconoCalendario);
        tarjetaDia.appendChild(textoDia);
        tarjetaDia.appendChild(espacioFlexible);
        tarjetaDia.appendChild(botonEstado);
    
        return tarjetaDia;
    }    

    cargarTemplate(templateId, datos) {

        // Guardar el último template usado
        this.ultimoTemplateUsado = templateId;

        // Limpiar el contenedor

        this.dynamicContentContainer.innerHTML = '';

        // Si no hay datos parecidos, mostrar mensaje
        if (!datos || datos.length === 0) {
            this.dynamicContentContainer.innerHTML = `
                <div class="d-flex align-items-center mb-2" style="width: 100%; max-width: 1100px;">
                    <strong style="color: #00304D; font-size: 20px;">No se encontraron resultados</strong>
                </div>`;
            return;
        }

        // Condición para renderizar días de asistencia
        if (templateId === 'dinamicCardDaysAttendance') {
            this.dynamicContentContainer.innerHTML = '';

            datos.forEach(dia => {
                this.dynamicContentContainer.innerHTML += this.renderizarDiaAsistencia(dia);
            });
            return;
        }

        if (templateId === 'dinamicCardHistoryAttendance') {
            this.dynamicContentContainer.innerHTML = '';

            datos.forEach(dato => {
                const tarjetaEstudiante = `
                <div class="d-flex align-items-center mb-2" style="width: 100%; max-width: 1100px;">
                    <strong style="color: #00304D; font-size: 20px;">${dato.nombre}</strong>
                    <div class="flex-grow-1"></div>
                    <button class="btn btn-primary ver-detalle-asistencia" data-nombre="${dato.nombre}">
                        Ver Detalles
                    </button>
                </div>`;
                this.dynamicContentContainer.innerHTML += tarjetaEstudiante;
            });

            this.agregarEventosVerDetalles();
        }


        let contenidoHTML = '';

        // Casos para cada template
        datos.forEach(dato => {
            switch (templateId) {
                case 'dinamicCardCourse':
                    contenidoHTML += this.renderizarFicha(dato);
                    break;
                case 'dinamicCardNotification':
                    contenidoHTML += this.renderizarNotificacion(dato);
                    break;
                case 'dinamicCardStudent':
                    contenidoHTML += this.renderizarmarcarAsistenciaEstudiante(dato);
                    break;
                case 'dinamicCardManual':
                    contenidoHTML += this.renderizarManual(dato);
                    break;
                case 'dinamicCardCourseAssistance':
                    contenidoHTML += this.renderizarmarcarAsistenciaFicha(dato);
                    break;
                case 'dinamicCardCourseHistory':
                    contenidoHTML += this.renderizarhistorialFicha(dato);
                    break;
                case 'dinamicCardGenerateReport':
                    contenidoHTML += this.renderizargenerareporte(dato);
                    break;
                case 'dinamicCardStudentHistory':
                    contenidoHTML += this.renderizarhistorialAprendiz(dato);
                    break;
                case 'dinamicCardGenerateReportStudent':
                    contenidoHTML += this.renderizargenerareporteestudiante(dato);
                    break;
                case 'dinamicCardCourseTracking':
                    contenidoHTML += this.renderizarseguimientoficha(dato);
                    break;
                case 'dinamicCardStudentTracking':
                    contenidoHTML += this.renderizarseguimientoEstudiante(dato);
                    break;
                default:
                    console.log('Template no encontrado:', templateId);
                    break;
            }
        });

        // Insertamos todo el contenido de una vez
        this.dynamicContentContainer.innerHTML = contenidoHTML;
    }

    agregarEventosVerDetalles() {
        const botonesDetalle = document.querySelectorAll('.ver-detalle-asistencia');
        botonesDetalle.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const nombreEstudiante = e.target.getAttribute('data-nombre');

                const historyModal = new bootstrap.Modal(document.getElementById('historyAsistModal'));
                historyModal.show();

                const evento = new CustomEvent('mostrarAsistenciaEstudiante', {
                    detail: { nombre: nombreEstudiante }
                });
                document.dispatchEvent(evento);
            });
        });
    }
}

// Hacer DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    const btnLogin = document.getElementById('btnLogin');
    const selectRol = document.getElementById('selectRol');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const modalMessageError = document.getElementById('modalMessageError');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalElement = document.getElementById('noneDataModal');

    // Instancia del modal de Bootstrap
    const modal = new bootstrap.Modal(modalElement);

    btnLogin.addEventListener('click', function (event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Validación de los campos
        if (selectRol.value === "") {
            showModal("Por favor, selecciona tu rol.");
        } else if (emailInput.value === "") {
            showModal("Por favor, ingresa tu correo electrónico.");
        } else if (passwordInput.value === "") {
            showModal("Por favor, ingresa tu contraseña.");
        } else {
            console.log("Formulario válido. Procesando datos...");
        }
    });

    // Función para mostrar el modal con el mensaje correspondiente
    function showModal(message) {
        modalMessageError.textContent = message;
        modalMessageError.style.color = "#39A900";
        modal.show(); // Muestra el modal
    }

    // Cerrar el modal al hacer clic en el botón de cierre
    btnCloseModal.addEventListener('click', function () {
        modal.hide(); // Oculta el modal
    })
});



