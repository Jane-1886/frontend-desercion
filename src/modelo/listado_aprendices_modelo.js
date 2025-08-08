let nombreAprendiz = '';
let instructorNombre = '';
let inasistencias = 0;  // Contador de inasistencias
let inasistenciasSinJustificacion = 0;  // Contador de inasistencias sin justificación
let instructoresPorDia = {};  // Objeto para contar instructores por día
let fechaReporte = '';  // Variable para almacenar la fecha del reporte
let horaReporte = '';  // Variable para almacenar la hora del reporte

function openModal(nombre, lun, mar, mie, jue, vie, instructor) {
    nombreAprendiz = nombre;
    instructorNombre = instructor;  // Asignamos el nombre del instructor
    inasistencias = 0;  // Reiniciar el contador de inasistencias
    inasistenciasSinJustificacion = 0;  // Reiniciar el contador de inasistencias sin justificación
    instructoresPorDia = {};  // Reiniciar el objeto de instructores

    // Mostrar título del modal
    const modalTitulo = document.getElementById("modal-titulo");
    modalTitulo.textContent = `Asistencia del ${nombreAprendiz}`;
    modalTitulo.style.fontSize = "30px";  // Solo el título será más grande (30px)
    document.getElementById("myModal").style.display = "flex";

    // Obtener la fecha y hora actual
    const fecha = new Date().toLocaleDateString("es-ES", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const hora = new Date().toLocaleTimeString("es-ES", {
        hour: '2-digit', minute: '2-digit'
    });

    // Guardar la fecha y hora para el reporte
    fechaReporte = fecha;
    horaReporte = hora;

    // Mostrar la fecha, hora y nombre del instructor en el modal
    modalTitulo.innerHTML += ` 
        <br><span style="font-size: 20px; color: #00304D; margin-top: 10px; display: block;">  
            Fecha: ${fecha} | Hora: ${hora}
        </span>
        <br><span style="font-size: 20px; color: #00304D; margin-top: 3px; display: block;">  
            Instructor que registró la asistencia: ${instructorNombre}
        </span>
    `;

    // Asistencias y estados predefinidos
    const resultados = {
        'lun': { asistencia: lun, estado: lun === "Asistió" ? "Asistió" : (lun === "Justificada" ? "Justificada" : "No Justificada"), clase: lun === "Asistió" ? "estado asistio" : (lun === "Justificada" ? "estado justificada" : "estado no-asistio") },
        'mar': { asistencia: mar, estado: mar === "Asistió" ? "Asistió" : (mar === "Justificada" ? "Justificada" : "No Justificada"), clase: mar === "Asistió" ? "estado asistio" : (mar === "Justificada" ? "estado justificada" : "estado no-asistio") },
        'mie': { asistencia: mie, estado: mie === "Asistió" ? "Asistió" : (mie === "Justificada" ? "Justificada" : "No Justificada"), clase: mie === "Asistió" ? "estado asistio" : (mie === "Justificada" ? "estado justificada" : "estado no-asistio") },
        'jue': { asistencia: jue, estado: jue === "Asistió" ? "Asistió" : (jue === "Justificada" ? "Justificada" : "No Justificada"), clase: jue === "Asistió" ? "estado asistio" : (jue === "Justificada" ? "estado justificada" : "estado no-asistio") },
        'vie': { asistencia: vie, estado: vie === "Asistió" ? "Asistió" : (vie === "Justificada" ? "Justificada" : "No Justificada"), clase: vie === "Asistió" ? "estado asistio" : (vie === "Justificada" ? "estado justificada" : "estado no-asistio") },
    };

    // Mostrar la asistencia y el estado de los días
    Object.keys(resultados).forEach((dia) => {
        const asistenciaDia = document.getElementById(`asistencia-${dia}`);
        const estadoDia = document.getElementById(`estado-${dia}`);
        
        asistenciaDia.textContent = resultados[dia].asistencia === "Asistió" ? "Asistió" : "No Asistió";
        estadoDia.textContent = resultados[dia].estado;
        estadoDia.className = resultados[dia].clase;

        // Contar inasistencias
        if (resultados[dia].estado === "No Justificada" || resultados[dia].estado === "No Asistió") {
            inasistencias++;
            if (resultados[dia].estado === "No Justificada") {
                inasistenciasSinJustificacion++;
            }
        }

        // Contar instructores (únicamente si hay un nuevo instructor registrado por día)
        if (!instructoresPorDia[dia]) {
            instructoresPorDia[dia] = new Set();
        }
        instructoresPorDia[dia].add(instructor);
        
        // Los días no cambian de tamaño de letra
        asistenciaDia.style.fontSize = "16px";  // Tamaño normal para la asistencia
        estadoDia.style.fontSize = "16px";  // Tamaño normal para el estado
    });
}

// Función para generar el reporte PDF
function generarReporte() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(20);

    // Título del reporte
    doc.text(`Reporte de Asistencia - ${nombreAprendiz}`, 10, 10);

    // Obtener la fecha y hora actual
    const fecha = new Date().toLocaleDateString("es-ES", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const hora = new Date().toLocaleTimeString("es-ES", {
        hour: '2-digit', minute: '2-digit'
    });

    // Agregar la fecha y hora debajo del título
    doc.setFontSize(12);
    doc.text(`Fecha del reporte: ${fecha} | Hora: ${hora}`, 10, 20);

    // Inasistencias
    doc.setFontSize(14);
    doc.text(`Inasistencias: ${inasistencias}`, 10, 30);

    // Espaciado entre la información
    doc.text('', 10, 40);

    // Agregar instructores por día
    doc.setFontSize(14);
    doc.text('Instructores por día:', 10, 50);
    
    // Establecer formato para los días de la semana
    const startY = 60;
    const rowHeight = 10;
    const columnWidth = 100;

    // Enumerar los días con su respectivo número de instructores
    Object.keys(instructoresPorDia).forEach((dia, index) => {
        const instructorCount = instructoresPorDia[dia].size;
        const instructorText = instructorCount === 1 ? "1 instructor" : `${instructorCount} instructores`;
        const yPosition = startY + index * rowHeight;

        doc.setFontSize(12);
        doc.text(`${dia.toUpperCase()}: ${instructorText}`, 10, yPosition + 7);
    });

    // Espaciado antes de la sección de detalle de asistencia
    doc.text('', 10, startY + (Object.keys(instructoresPorDia).length + 1) * rowHeight);

    // Detalles de la asistencia por día
    doc.text('Asistencia diaria:', 10, 90 + (Object.keys(instructoresPorDia).length * 10));
    const dias = ['lun', 'mar', 'mie', 'jue', 'vie'];
    dias.forEach((dia, index) => {
        const asistencia = document.getElementById(`asistencia-${dia}`).textContent;
        const estado = document.getElementById(`estado-${dia}`).textContent;
        doc.text(`${dia.toUpperCase()}: ${asistencia} - ${estado}`, 10, 100 + ((index + Object.keys(instructoresPorDia).length) * 10));
    });

    // Espaciado antes de la sección de instructor
    doc.text('', 10, 130 + ((dias.length + Object.keys(instructoresPorDia).length) * 10));

    // Agregar el nombre del instructor que registró la asistencia
    doc.text(`Instructor que registró la asistencia: ${instructorNombre}`, 10, 140 + ((dias.length + Object.keys(instructoresPorDia).length) * 10));

    // Guardar el PDF
    doc.save(`reporte_asistencia_${nombreAprendiz}.pdf`);
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
    nombreAprendiz = '';
    instructorNombre = '';  // Resetear instructor cuando se cierre el modal
}

function reportarBienestar() {
    // Verificar las condiciones para reportar
    const inasistenciasTotales = inasistencias;  // Total de inasistencias

    // Obtener el contenedor de la alerta
    const alertaBienestar = document.getElementById("alerta-bienestar");

    // Verificar si el aprendiz debe ser reportado
    if (inasistenciasTotales > 2 || inasistenciasSinJustificacion >= 3) {
        alertaBienestar.textContent = `El aprendiz : ${nombreAprendiz} ha acumulado más de dos inasistencias, o tres inasistencias sin justificación válida. Debido a esto, se procederá con el envío de un reporte a Bienestar para su intervención.`;
        alertaBienestar.className = "alerta alerta-roja"; // Aplica el color rojo
    } else {
        alertaBienestar.textContent = `El aprendiz : ${nombreAprendiz} no cumple con los requisitos para ser reportado a Bienestar, ya que su número de inasistencias no supera el límite establecido, por lo que no se requiere intervención en este momento.`;
        alertaBienestar.className = "alerta alerta-verde"; // Aplica el color verde
    }

    // Mostrar la alerta
    alertaBienestar.style.display = "block";

    // Opcionalmente, ocultar la alerta después de unos segundos
    setTimeout(() => {
        alertaBienestar.style.display = "none";
    }, 5000);  // Ocultar después de 5 segundos
}
