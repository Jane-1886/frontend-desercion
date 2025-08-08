// Función para mostrar el modal
function mostrarModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Función para cerrar el modal
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}



function generarReporte(ficha) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Datos de ejemplo para 6 aprendices
    const aprendices = [
        { nombre: "Aprendiz 1", inasistencias: 2, asistenciaPorDia: {
            lun: { asistencia: "Asistió", estado: "Asistió" },
            mar: { asistencia: "No Asistió", estado: "No Justificada" },
            mie: { asistencia: "Asistió", estado: "Asistió" },
            jue: { asistencia: "No Asistió", estado: "Justificada" },
            vie: { asistencia: "No Asistió", estado: "No Justificada" }
        }},
        { nombre: "Aprendiz 2", inasistencias: 1, asistenciaPorDia: {
            lun: { asistencia: "Asistió", estado: "Asistió" },
            mar: { asistencia: "Asistió", estado: "Asistió" },
            mie: { asistencia: "Asistió", estado: "Asistió" },
            jue: { asistencia: "Asistió", estado: "Justificada" },
            vie: { asistencia: "No Asistió", estado: "No Justificada" }
        }},
        { nombre: "Aprendiz 3", inasistencias: 0, asistenciaPorDia: {
            lun: { asistencia: "Asistió", estado: "Asistió" },
            mar: { asistencia: "Asistió", estado: "Asistió" },
            mie: { asistencia: "Asistió", estado: "Asistió" },
            jue: { asistencia: "Asistió", estado: "Asistió" },
            vie: { asistencia: "Asistió", estado: "Asistió" }
        }},
        { nombre: "Aprendiz 4", inasistencias: 3, asistenciaPorDia: {
            lun: { asistencia: "No Asistió", estado: "No Justificada" },
            mar: { asistencia: "No Asistió", estado: "Justificada" },
            mie: { asistencia: "Asistió", estado: "Asistió" },
            jue: { asistencia: "No Asistió", estado: "No Justificada" },
            vie: { asistencia: "No Asistió", estado: "No Justificada" }
        }},
        { nombre: "Aprendiz 5", inasistencias: 1, asistenciaPorDia: {
            lun: { asistencia: "Asistió", estado: "Asistió" },
            mar: { asistencia: "Asistió", estado: "Asistió" },
            mie: { asistencia: "No Asistió", estado: "No Justificada" },
            jue: { asistencia: "Asistió", estado: "Justificada" },
            vie: { asistencia: "Asistió", estado: "Asistió" }
        }},
        { nombre: "Aprendiz 6", inasistencias: 0, asistenciaPorDia: {
            lun: { asistencia: "Asistió", estado: "Asistió" },
            mar: { asistencia: "Asistió", estado: "Asistió" },
            mie: { asistencia: "Asistió", estado: "Asistió" },
            jue: { asistencia: "Asistió", estado: "Asistió" },
            vie: { asistencia: "Asistió", estado: "Asistió" }
        }}
    ];

    // Variables de fecha, hora e instructor
    const fechaReporte = new Date().toLocaleDateString();  // Fecha actual
    const horaReporte = new Date().toLocaleTimeString();   // Hora actual

    // Lista de instructores
    const instructores = ["Instructor 1", "Instructor 2", "Instructor 3"];
    const instructorNombre = instructores[Math.floor(Math.random() * instructores.length)]; // Instructor aleatorio

    const instructoresPorDia = {
        lun: new Set(["Instructor 1"]),
        mar: new Set(["Instructor 2"]),
        mie: new Set(["Instructor 3"]),
        jue: new Set(["Instructor 1"]),
        vie: new Set(["Instructor 2"])
    };

    // Título principal con el número de la ficha
    doc.setFontSize(18);
    doc.text(`Reporte de Ficha: ${ficha}`, 10, 10);

    // Espacio adicional entre el título principal y el siguiente bloque
    let currentY = 20;

    // Subtítulo "Reporte de Asistencia"
    doc.setFontSize(14);
    doc.text('Reporte de Asistencia', 10, currentY);
    currentY += 10;  // Añadimos espacio para el siguiente bloque

    // Fecha y hora
    const fechaHora = `Fecha del reporte: ${fechaReporte} | Hora: ${horaReporte}`;
    doc.setFontSize(12);
    doc.text(fechaHora, 10, currentY);
    currentY += 10;  // Añadimos espacio

    // Instructores por día
    doc.text("Instructores por día:", 10, currentY);
    currentY += 10;  // Añadimos espacio antes de la lista de instructores

    // Enumerar los días con su respectivo número de instructores
    Object.keys(instructoresPorDia).forEach((dia, index) => {
        const instructorCount = instructoresPorDia[dia].size;
        const instructorText = instructorCount === 1 ? "1 instructor" : `${instructorCount} instructores`;
        doc.text(`${dia.toUpperCase()}: ${instructorText}`, 10, currentY);
        currentY += 10;  // Añadimos espacio entre cada línea de instructores
    });

    // Espacio adicional entre el bloque de instructores y el siguiente
    currentY += 10;

    // Para cada aprendiz, generamos su reporte
    aprendices.forEach((aprendiz, aprendizIndex) => {
        if (aprendizIndex > 0 && currentY > 250) {
            doc.addPage(); // Añadimos nueva página si el contenido está por sobrepasar la página actual
            currentY = 10; // Reiniciamos la posición Y para la nueva página
        }

        // Nombre del aprendiz y su inasistencia
        doc.setFontSize(14);
        doc.text(`Reporte de Asistencia - ${aprendiz.nombre}`, 10, currentY);
        currentY += 10;
        
        const inasistenciasText = `Inasistencias: ${aprendiz.inasistencias}`;
        doc.text(inasistenciasText, 10, currentY);
        currentY += 15;  // Añadimos espacio

        // Asistencia diaria
        doc.text("Asistencia diaria:", 10, currentY);
        currentY += 10;  // Añadimos espacio antes de la lista de asistencia

        // Detalles de la asistencia por día
        Object.keys(aprendiz.asistenciaPorDia).forEach((dia, index) => {
            const asistencia = aprendiz.asistenciaPorDia[dia];
            const estado = asistencia.estado;
            doc.text(`${dia.toUpperCase()}: ${asistencia.asistencia} - ${estado}`, 10, currentY);
            currentY += 10;  // Añadimos espacio entre cada línea de asistencia
        });

        // Espacio adicional entre el bloque de asistencia y el siguiente
        currentY += 10;
    });

    // Espacio adicional antes de la sección de instructor
    currentY += 10;

    // Agregar el nombre del instructor que registró la asistencia
    doc.text(`Instructor que registró la asistencia: ${instructorNombre}`, 10, currentY);

    // Guardar el PDF
    doc.save(`reporte_asistencia_ficha_${ficha}.pdf`);
}
