// Modelo.js

class Modelo {
    constructor() {
        this.vistasDisponibles = {
            fichas: {
                titulo: 'Visualización de <span style="color: #39A900;">Fichas</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione una ficha para ver más detalles:</strong>',
                template: "dinamicCardCourse",
                datos: [
                    { numero: "2823217" },
                    { numero: "2823218" }
                ]
            },
            notificaciones: {
                titulo: 'Centro de <span style="color: #39A900;">Notificaciones</span>',
                subtitulo: '<style= font-size:14.5px;>Revise sus notificaciones pendientes:</strong>',
                template: "dinamicCardNotification",
                datos: [
                    {
                        titulo: "Aprendiz en estado de riesgo",
                        fecha: "7 de octubre del 2024, 13:00",
                        contenido: "El estudiante Juan Pérez presenta inasistencias recurrentes y bajo rendimiento académico. Se recomienda una intervención inmediata del equipo de bienestar."
                    },
                    {
                        titulo: "Seguimiento académico",
                        fecha: "5 de octubre del 2024, 10:30",
                        contenido: "María Gómez ha mostrado una mejora significativa en sus últimas evaluaciones. Se sugiere mantener el plan de apoyo actual."
                    },
                    {
                        titulo: "Alerta de deserción",
                        fecha: "3 de octubre del 2024, 14:45",
                        contenido: "Pedro Rodríguez ha manifestado dificultades personales que podrían afectar su permanencia en el programa. Es necesario programar una reunión de acompañamiento."
                    }
                ]
            },
            marcarAsistenciaFicha: {
                titulo: 'Centro de <span style="color: #39A900;">Asistencia</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione una ficha para marcar asistencia:</strong>',
                template: "dinamicCardCourseAssistance",
                datos: [
                    { numero: "2823217" },
                    { numero: "2823218" }
                ]
            },
            marcarAsistenciaEstudiante: {
                titulo: 'Centro de <span style="color: #39A900;">Asistencia</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione un estudiante para registrar asistencia:</strong>',
                template: "dinamicCardStudent",
                datos: [
                    { nombre: "Juan Pérez", ficha: "2823217" },
                    { nombre: "María Gómez", ficha: "2823217" },
                    { nombre: "Pedro Rodríguez", ficha: "2823218" }
                ]
            },
            historialFicha: {
                titulo: 'Centro de <span style="color: #39A900;">Historial</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione una ficha para ver historial:</strong>',
                template: "dinamicCardCourseHistory",
                datos: [
                    { numero: "2823217" },
                    { numero: "2823218" }
                ]
            },
            historialAprendiz: {
                titulo: 'Centro de <span style="color: #39A900;">Historial</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione un estudiante para ver su historial:</strong>',
                template: "dinamicCardStudentHistory",
                datos: [
                    { nombre: "Juan Pérez", ficha: "2823217" },
                    { nombre: "María Gómez", ficha: "2823217" },
                    { nombre: "Pedro Rodríguez", ficha: "2823218" }
                ]
            },

            generareporte: {
                titulo: 'Centro de <span style="color: #39A900;">Generar reporte</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione una ficha para generar reporte:</strong>',
                template: "dinamicCardGenerateReport",
                datos: [
                    { numero: "2823217" },
                    { numero: "2823218" }
                ]
            },
            generareporteestudiante: {
                titulo: 'Centro de <span style="color: #39A900;">Generar reporte</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione un estudiante para generar reporte:</strong>',
                template: "dinamicCardGenerateReportStudent",
                datos: [
                    { nombre: "Juan Pérez", ficha: "2823217" },
                    { nombre: "María Gómez", ficha: "2823217" },
                    { nombre: "Pedro Rodríguez", ficha: "2823218" }
                ]
            },
            seguimientoficha: {
                titulo: 'Centro de <span style="color: #39A900;">Seguimiento</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione una ficha para hacer seguimiento:</strong>',
                template: "dinamicCardCourseTracking",
                datos: [
                    { numero: "2823217" },
                    { numero: "2823218" }
                ]
            },
            seguimientoestudiante: {
                titulo: 'Centro de <span style="color: #39A900;">Seguimiento</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione un estudiante para hacer seguimiento:</strong>',
                template: "dinamicCardStudentTracking",
                datos: [
                    { nombre: "Juan Pérez", ficha: "2823217" },
                    { nombre: "María Gómez", ficha: "2823217" },
                    { nombre: "Pedro Rodríguez", ficha: "2823218" }
                ]
            },
            reporte: {
                titulo: 'Centro de <span style="color: #39A900;">Reporte</span>',
                subtitulo: '<style= font-size:14.5px;>Seleccione una ficha para generar reporte:</strong>',
                template: "dinamicCardCourse",
                datos: [
                    { numero: "2823217" },
                    { numero: "2823218" }
                ]
            },

            ayuda: {
                titulo: 'Centro de <span style="color: #39A900;">Ayuda</span>',
                subtitulo: '<style= font-size:14.5px;>Recursos disponibles para su consulta:</strong>',
                template: "dinamicCardManual",
                datos: [
                    { titulo: "¿Cómo funciona la plataforma?" }
                ]
            },

            diasAsistencia: {
                titulo: 'Centro de <span style="color: #39A900;">Asistencia</span>',
                subtitulo: '<style= font-size:14.5px;>Registro de asistencia diaria:</strong>',
                template: "dinamicCardDaysAttendance",
                datos: this.diasAsistencia
            },
            
            historialAsistencia: {
                titulo: 'Historial de <span style="color: #39A900;">Asistencia</span>',
                subtitulo: '<style= font-size:14.5px;>Registro histórico de asistencia:</strong>',
                template: "dinamicCardHistoryAttendance",
                datos: this.historialAsistencia
            }

        };
        
        this.seguimientoestudiante = {
            datos: [
                { nombre: "Juan Pérez", ficha: "2823217", tienePlan: true },
                { nombre: "María Gómez", ficha: "2823217", tienePlan: true },
                { nombre: "Pedro Rodríguez", ficha: "2823218", tienePlan: false }
            ]
        };

        this.diasAsistencia = [
            // Enero
            { dia: "Lunes", numero: 1, mes: 1, semana: 1, bloque: 1 },
            { dia: "Lunes", numero: 1, mes: 1, semana: 1, bloque: 2 },
            { dia: "Lunes", numero: 1, mes: 1, semana: 1, bloque: 3 },
            { dia: "Martes", numero: 2, mes: 1, semana: 1, bloque: 1 },
            { dia: "Martes", numero: 2, mes: 1, semana: 1, bloque: 2 },
            { dia: "Martes", numero: 2, mes: 1, semana: 1, bloque: 3 },
            { dia: "Miércoles", numero: 3, mes: 1, semana: 1, bloque: 1 },
            { dia: "Miércoles", numero: 3, mes: 1, semana: 1, bloque: 2 },
            { dia: "Miércoles", numero: 3, mes: 1, semana: 1, bloque: 3 },
            { dia: "Jueves", numero: 4, mes: 1, semana: 1, bloque: 1 },
            { dia: "Jueves", numero: 4, mes: 1, semana: 1, bloque: 2 },
            { dia: "Jueves", numero: 4, mes: 1, semana: 1, bloque: 3 },
            { dia: "Viernes", numero: 5, mes: 1, semana: 1, bloque: 1 },
            { dia: "Viernes", numero: 5, mes: 1, semana: 1, bloque: 2 },
            { dia: "Viernes", numero: 5, mes: 1, semana: 1, bloque: 3 },

            // Febrero
            { dia: "Lunes", numero: 5, mes: 2, semana: 1, bloque: 1 },
            { dia: "Lunes", numero: 5, mes: 2, semana: 1, bloque: 2 },
            { dia: "Lunes", numero: 5, mes: 2, semana: 1, bloque: 3 },
            { dia: "Martes", numero: 6, mes: 2, semana: 1, bloque: 1 },
            { dia: "Martes", numero: 6, mes: 2, semana: 1, bloque: 2 },
            { dia: "Martes", numero: 6, mes: 2, semana: 1, bloque: 3 },
            { dia: "Miércoles", numero: 7, mes: 2, semana: 1, bloque: 1 },
            { dia: "Miércoles", numero: 7, mes: 2, semana: 1, bloque: 2 },
            { dia: "Miércoles", numero: 7, mes: 2, semana: 1, bloque: 3 },
            { dia: "Jueves", numero: 8, mes: 2, semana: 1, bloque: 1 },
            { dia: "Jueves", numero: 8, mes: 2, semana: 1, bloque: 2 },
            { dia: "Jueves", numero: 8, mes: 2, semana: 1, bloque: 3 },
            { dia: "Viernes", numero: 9, mes: 2, semana: 1, bloque: 1 },
            { dia: "Viernes", numero: 9, mes: 2, semana: 1, bloque: 2 },
            { dia: "Viernes", numero: 9, mes: 2, semana: 1, bloque: 3 },


            // Marzo
            { dia: "Lunes", numero: 4, mes: 3, semana: 1, bloque: 1 },
            { dia: "Lunes", numero: 4, mes: 3, semana: 1, bloque: 2 },
            { dia: "Lunes", numero: 4, mes: 3, semana: 1, bloque: 3 },
            { dia: "Martes", numero: 5, mes: 3, semana: 1, bloque: 1 },
            { dia: "Martes", numero: 5, mes: 3, semana: 1, bloque: 2 },
            { dia: "Martes", numero: 5, mes: 3, semana: 1, bloque: 3 },
            { dia: "Miércoles", numero: 6, mes: 3, semana: 1, bloque: 1 },
            { dia: "Miércoles", numero: 6, mes: 3, semana: 1, bloque: 2 },
            { dia: "Miércoles", numero: 6, mes: 3, semana: 1, bloque: 3 },
            { dia: "Jueves", numero: 7, mes: 3, semana: 1, bloque: 1 },
            { dia: "Jueves", numero: 7, mes: 3, semana: 1, bloque: 2 },
            { dia: "Jueves", numero: 7, mes: 3, semana: 1, bloque: 3 },
            { dia: "Viernes", numero: 8, mes: 3, semana: 1, bloque: 1 },
            { dia: "Viernes", numero: 8, mes: 3, semana: 1, bloque: 2 },
            { dia: "Viernes", numero: 8, mes: 3, semana: 1, bloque: 3 },

            // Abril
            { dia: "Lunes", numero: 1, mes: 4, semana: 1, bloque: 1 },
            { dia: "Lunes", numero: 1, mes: 4, semana: 1, bloque: 2 },
            { dia: "Lunes", numero: 1, mes: 4, semana: 1, bloque: 3 },
            { dia: "Martes", numero: 2, mes: 4, semana: 1, bloque: 1 },
            { dia: "Martes", numero: 2, mes: 4, semana: 1, bloque: 2 },
            { dia: "Martes", numero: 2, mes: 4, semana: 1, bloque: 3 },
            { dia: "Miércoles", numero: 3, mes: 4, semana: 1, bloque: 1 },
            { dia: "Miércoles", numero: 3, mes: 4, semana: 1, bloque: 2 },
            { dia: "Miércoles", numero: 3, mes: 4, semana: 1, bloque: 3 },
            { dia: "Jueves", numero: 4, mes: 4, semana: 1, bloque: 1 },
            { dia: "Jueves", numero: 4, mes: 4, semana: 1, bloque: 2 },
            { dia: "Jueves", numero: 4, mes: 4, semana: 1, bloque: 3 },
            { dia: "Viernes", numero: 5, mes: 4, semana: 1, bloque: 1 },
            { dia: "Viernes", numero: 5, mes: 4, semana: 1, bloque: 2 },
            { dia: "Viernes", numero: 5, mes: 4, semana: 1, bloque: 3 },

            // Mayo
            { dia: "Lunes", numero: 6, mes: 5, semana: 1, bloque: 1 },
            { dia: "Lunes", numero: 6, mes: 5, semana: 1, bloque: 2 },
            { dia: "Lunes", numero: 6, mes: 5, semana: 1, bloque: 3 },
            { dia: "Martes", numero: 7, mes: 5, semana: 1, bloque: 1 },
            { dia: "Martes", numero: 7, mes: 5, semana: 1, bloque: 2 },
            { dia: "Martes", numero: 7, mes: 5, semana: 1, bloque: 3 },
            { dia: "Miércoles", numero: 8, mes: 5, semana: 1, bloque: 1 },
            { dia: "Miércoles", numero: 8, mes: 5, semana: 1, bloque: 2 },
            { dia: "Miércoles", numero: 8, mes: 5, semana: 1, bloque: 3 },
            { dia: "Jueves", numero: 9, mes: 5, semana: 1, bloque: 1 },
            { dia: "Jueves", numero: 9, mes: 5, semana: 1, bloque: 2 },
            { dia: "Jueves", numero: 9, mes: 5, semana: 1, bloque: 3 },
            { dia: "Viernes", numero: 10, mes: 5, semana: 1, bloque: 1 },
            { dia: "Viernes", numero: 10, mes: 5, semana: 1, bloque: 2 },
            { dia: "Viernes", numero: 10, mes: 5, semana: 1, bloque: 3 },
        ];

        this.historialAsistencia = [
            { 
                nombre: "Juan Pérez", 
                diasAsistencia: [
                    { dia: "Lunes", numero: 1, mes: 1, semana: 1, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 2, mes: 1, semana: 1, bloque: 2, estado: "No asistido" },
                    { dia: "Miércoles", numero: 3, mes: 1, semana: 1, bloque: 3, estado: "Justificado" },
                    { dia: "Jueves", numero: 4, mes: 1, semana: 1, bloque: 1, estado: "Asistido" },
                    { dia: "Viernes", numero: 5, mes: 1, semana: 1, bloque: 2, estado: "Asistido" },
                    
                    // Agregamos más días para el mismo mes
                    { dia: "Lunes", numero: 8, mes: 1, semana: 2, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 9, mes: 1, semana: 2, bloque: 2, estado: "No asistido" },
                    { dia: "Miércoles", numero: 10, mes: 1, semana: 2, bloque: 3, estado: "Justificado" },
                    { dia: "Jueves", numero: 11, mes: 1, semana: 2, bloque: 1, estado: "Asistido" },
                    { dia: "Viernes", numero: 12, mes: 1, semana: 2, bloque: 2, estado: "Asistido" },
                    
                    // Días de otros meses
                    { dia: "Lunes", numero: 1, mes: 2, semana: 1, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 2, mes: 2, semana: 1, bloque: 2, estado: "Asistido" },
                    { dia: "Miércoles", numero: 3, mes: 2, semana: 1, bloque: 3, estado: "No asistido" }
                ]
            },
            { 
                nombre: "María González", 
                diasAsistencia: [
                    { dia: "Lunes", numero: 4, mes: 1, semana: 2, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 5, mes: 1, semana: 2, bloque: 2, estado: "Asistido" },
                    { dia: "Miércoles", numero: 6, mes: 1, semana: 2, bloque: 3, estado: "No asistido" },
                    { dia: "Jueves", numero: 7, mes: 1, semana: 2, bloque: 1, estado: "Asistido" },
                    { dia: "Viernes", numero: 8, mes: 1, semana: 2, bloque: 2, estado: "Asistido" },
                    
                    // Más días para el mismo mes
                    { dia: "Lunes", numero: 11, mes: 1, semana: 3, bloque: 1, estado: "Justificado" },
                    { dia: "Martes", numero: 12, mes: 1, semana: 3, bloque: 2, estado: "Asistido" },
                    { dia: "Miércoles", numero: 13, mes: 1, semana: 3, bloque: 3, estado: "Asistido" },
                    
                    // Días de otros meses
                    { dia: "Lunes", numero: 5, mes: 2, semana: 2, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 6, mes: 2, semana: 2, bloque: 2, estado: "No asistido" }
                ]
            },
            { 
                nombre: "Carlos Rodríguez", 
                diasAsistencia: [
                    { dia: "Lunes", numero: 1, mes: 1, semana: 1, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 2, mes: 1, semana: 1, bloque: 2, estado: "Asistido" },
                    { dia: "Miércoles", numero: 3, mes: 1, semana: 1, bloque: 3, estado: "Asistido" },
                    { dia: "Jueves", numero: 4, mes: 1, semana: 1, bloque: 1, estado: "Justificado" },
                    { dia: "Viernes", numero: 5, mes: 1, semana: 1, bloque: 2, estado: "No asistido" },
                    
                    // Más días para el mismo mes
                    { dia: "Lunes", numero: 8, mes: 1, semana: 2, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 9, mes: 1, semana: 2, bloque: 2, estado: "Asistido" },
                    
                    // Días de otros meses
                    { dia: "Lunes", numero: 1, mes: 2, semana: 1, bloque: 1, estado: "Asistido" },
                    { dia: "Martes", numero: 2, mes: 2, semana: 1, bloque: 2, estado: "No asistido" }
                ]
            }
        ];
    
    }

    obtenerHistorialAsistenciaEstudiante(nombreEstudiante) {
        const estudiante = this.historialAsistencia.find(est => est.nombre === nombreEstudiante);
        return estudiante ? estudiante.diasAsistencia : [];
    }

    obtenerConfiguracionVista(tipoVista) {
        return this.vistasDisponibles[tipoVista];
    }

    obtenerDiasAsistenciaPorEstudiante(nombreEstudiante) {
        const estudiante = this.historialAsistencia.find(est => est.nombre === nombreEstudiante);
        return estudiante ? estudiante.diasAsistencia : [];
    }
}