const hubTurnoVAQ = "turnosHub";
const usuario_tbl = $("#usuario").val();
const table = $('#tblTurnosPendientesVAQ');

(function ($) {
    "use strict"

    // Activar boton asignar turno
    fetchGet("Turnos/Turnos_Pendientes", "json", (resp) => {
        if (resp.turnosPendientes.length > 0) {
            $("#btnTurnoAle").removeAttr('disabled');
            $("#color_mode").prop('disabled', true);
        } else {
            $("#btnTurnoAle").attr('disabled', 'disabled');
            $("#color_mode").prop('disabled', false);
        }
    })
    // Fin Activar boton asignar turno

    // Dibujar Tabla VAQ
    const frmTblvaq = new FormData();
    frmTblvaq.append("user", usuario_tbl);
    frmTblvaq.append("status", 2);

    fetchPost("Turnos/Tblvaq_Turnos_Pendientes", "json", frmTblvaq, (resp) => {
        let resultado = resp.data;
        $(`#tblTurnosPendientesVAQ tbody`).empty();
        if (resultado.length > 0) {
            DibujaTblTurnosPendientes(resultado)
        } else {
            table.dataTable().fnClearTable();
            table.dataTable().fnDestroy();
            table.DataTable({
                language: {
                    "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
                },
                bDestroy: true
            });
        }
    })
    // Fin Dibujar Tabla VAQ


    // Lista status Turnos Tbl
    fetchGet("Turnos/Status_TurnosTbl", "json", (res) => {

        var html = '<select id="listEstadoTurnos" class="form-control status-dropdown">';
        for (var i = 0; i < (res.data).length; i++) {
            if (res.data[i].idSelect != 1) {
                if (res.data[i].idSelect == 2) {
                    html += `
                        <option selected value="${res.data[i].idSelect}">${res.data[i].descripcion}</option>
                    `;
                } else {
                    html += `
                        <option value="${res.data[i].idSelect}">${res.data[i].descripcion}</option>
                    `;
                }
            }
        }

        html += "</select>";
        $("#selectStatus").append(html)

        cambiarestado();
    })
    // Fin Lista status Turnos Tbl

    // Rango de tiempo
    moment.locale('es');
    $('.input-daterange-datepicker').daterangepicker({
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-danger',
        cancelClass: 'btn-inverse',
        startDate: new Date(),
        endDate: new Date(),
        locale: { 
            "format": 'YYYY-MM-DD',
            "applyLabel": "Filtrar",
            "cancelLabel": "Cancelar"
        }
    });

    $('.input-daterange-datepicker').on('apply.daterangepicker', function (ev, picker) {
        let selectTipoTurno = $('#listEstadoTurnos').val();
        // Dibujar Tabla VAQ
        let fechainico = $('.input-daterange-datepicker').data('daterangepicker').startDate.format('YYYY-MM-DD');
        let fechafin = $('.input-daterange-datepicker').data('daterangepicker').endDate.format('YYYY-MM-DD');

        const frmTblvaqstatus = new FormData();
        frmTblvaqstatus.append("user", usuario_tbl);
        frmTblvaqstatus.append("status", selectTipoTurno);
        frmTblvaqstatus.append("fechainicio", fechainico);
        frmTblvaqstatus.append("fechafin", fechafin);

        fetchPost("Turnos/Tblvaq_Filtro_Turnos", "json", frmTblvaqstatus, (resp) => {
            let resultado = resp.data;
            $(`#tblTurnosPendientesVAQ tbody`).empty();
            if (resultado.length > 0) {
                DibujaTblTurnosPendientes(resultado)
            } else {
                table.dataTable().fnClearTable();
                table.dataTable().fnDestroy();
                table.DataTable({
                    language: {
                        "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
                    },
                    bDestroy: true
                });
            }
        })
    });

    $('.input-daterange-datepicker').on('cancel.daterangepicker', function (ev, picker) {

        const date = new Date();
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; 
        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const fechaActual = yyyy + '-' + mm + '-' + dd;

        $(this).val(fechaActual + ' - ' + fechaActual)

    });

    $("#hero6").dblclick(function () {

        let idmodulo_fin = $("#idmodulo_finalizar").val()
        let idturno_fin = $("#idTurno_finalizar").val()
        let iduser = $("#idusuario").val()
        let username = $("#usuario").val()

        const frmFinalizaTurno = new FormData();
        frmFinalizaTurno.append('idmodulo_fin', idmodulo_fin);
        frmFinalizaTurno.append('idturno_fin', idturno_fin);
        frmFinalizaTurno.append('iduser', iduser);
        frmFinalizaTurno.append('username', username);

        document.getElementById("idmodulo_finalizar").value = "";
        document.getElementById("idTurno_finalizar").value = "";

        fetchPost("Turnos/FinalizarTurnovaq", "json", frmFinalizaTurno, function (data) {

            if (data.status) {
                let mensaje = "Turno Finalizado Correctamente, gracias por su dedicación Abogado(a)";
                $("#hero6").css("display", "none");
                NotificacionPersonal(mensaje, data.msg);
                $("#color_mode").prop('disabled', false);

            } else if (data.status === 'false') {
                alert("Ha ocurrido un error, reporte el error con el administrador de sistemas")

            }
        })

    });

})(jQuery);

function DibujaTblTurnosPendientes(resp) {

    table.DataTable({
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        iDisplayLength: 25,
        responsive: true,
        scrollCollapse: true,
        data: resp,
        columns: [
            { data: 'nuM_TURNO' },
            {
                'mRender': function (data, type, full) {

                    return '' + new Date(full.fechA_HORA_RECEPCION).toISOString().split("T")[0] + '';
                }

            },
            {
                'mRender': function (data, type, full) {

                    let hora = ((full.fechA_HORA_RECEPCION).split("T")[1]);

                    return '' + hora.split(".")[0] + ' hrs';
                }

            },
            {
                'mRender': function (data, type, full) {

                    let hora_fin = ((full.fechaHoraTerminaAtencion).split("T")[1]);
                    return '' + hora_fin.split(".")[0] + ' hrs';

                }

            },
            {
                'mRender': function (data, type, full) {

                    let hora_fin_atn = ((full.fechaHoraTerminaAtencion).split("T")[1]);
                    let hora_toma_atn = ((full.fechA_HORA_TOMA_ATN).split("T")[1]);
                    let hora_fin_bueno = hora_fin_atn.split(".")[0];
                    let hora_tomaatn_bueno = hora_toma_atn.split(".")[0];
                    t1 = new Date(),
                    t2 = new Date();

                    let hora1 = hora_fin_bueno.split(":");
                    let hora2 = hora_tomaatn_bueno.split(":");

                    t1.setHours(hora1[0], hora1[1], hora1[2]);
                    t2.setHours(hora2[0], hora2[1], hora2[2]);

                    ////Aquí hago la resta
                    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());

                    return (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas, " : " hora, ") : "") + (t1.getMinutes() ? " " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");

                }

            },
            {
                'mRender': function (data, type, full) {

                    return 'Tipo';
                }

            },
            {
                'mRender': function (data, type, full) {

                    let iconPeticionario = `<td><img onmouseover="DatosPeticionario(${full.iD_REGISTRO})" id="iconuser${full.iD_REGISTRO}" alt="image" src="../img/avatar/avatar-1.png" class="rounded-circle" width="35" data-html="true" data-toggle="tooltip"></td>`;

                    return iconPeticionario;
                }
            },
            {
                data: "estado", render: function (data, type, row, meta) {

                    let regreso = "";

                    if (data == 1) {
                        regreso = '<div class="badge status-badge badge-info"> Pendiente </div > ';
                    } else if (data == 2) {
                        regreso = '<div class="badge status-badge badge-info"> Pendiente </div > ';
                    } else if (data == 3) {
                        regreso = '<div class="badge status-badge badge-info"> Atendiendo </div > ';
                    } else if (data == 4) {
                        regreso = '<div class="badge status-badge badge-info"> Finalizado </div > ';
                    }

                    return regreso;
                }
            },
            {
                'mRender': function (data, type, full) {
                    return '<input type="button" name="mostrarModulos" value="Atender" onclick="mostrarModulos(this, \'' + full.iD_TURNO + '\');" class="btn btn-info btnSelModuloss">';
                }

            }
        ],
        "initComplete": function (settings, json) {
            let selectTipoTurno = $("#listEstadoTurnos").val()

            if (selectTipoTurno == 2) {
                $('#tblTurnosPendientesVAQ').DataTable().column(0).visible(true);
                $('#tblTurnosPendientesVAQ').DataTable().column(3).visible(false);
                $('#tblTurnosPendientesVAQ').DataTable().column(4).visible(false);
                $('#tblTurnosPendientesVAQ').DataTable().column(5).visible(false);
                $('#tblTurnosPendientesVAQ').DataTable().column(8).visible(true);
            } if (selectTipoTurno == 3) {
                $('#tblTurnosPendientesVAQ').DataTable().column(0).visible(true);
                $('#tblTurnosPendientesVAQ').DataTable().column(3).visible(false);
                $('#tblTurnosPendientesVAQ').DataTable().column(4).visible(false);
                $('#tblTurnosPendientesVAQ').DataTable().column(5).visible(false);
                $('#tblTurnosPendientesVAQ').DataTable().column(8).visible(false);
            } else if (selectTipoTurno == 4) {
                $('#tblTurnosPendientesVAQ').DataTable().column(3).visible(true);
                $('#tblTurnosPendientesVAQ').DataTable().column(4).visible(true);
                $('#tblTurnosPendientesVAQ').DataTable().column(5).visible(true);
                $('#tblTurnosPendientesVAQ').DataTable().column(8).visible(false);
            }

            let filas = document.querySelectorAll(".btnSelModuloss");

            for (let i = 0; i < filas.length; i++) {

                if (i != 0) {
                    filas[i].disabled = true;
                }
            }

            let encurso = document.getElementById("idmodulo_finalizar").value

            if (encurso != "") {
                for (let i = 0; i < filas.length; i++) {
                    filas[i].disabled = true;
                }

            }

        },
        bDestroy: true
    });

    table.on('click', 'tbody tr', function () {
        let $row = table.DataTable().row(this).nodes().to$();
        let hasClass = $row.hasClass('selected');
        if (hasClass) {
            $row.removeClass('selected')
        } else {
            $row.addClass('selected')
        }
    })

    table.DataTable().rows().every(function () {
        this.nodes().to$().removeClass('selected')
    });

}

// Funcion para asignar turno aleatorio

function generaTurnoAleatorio() {
    fetchGet("Turnos/GeneraTurnosAleatorio", "json", (resp) => {
        if (resp) {
            Swal.fire({
                position: 'bottom-start',
                icon: 'success',
                title: 'Turno asignado',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'No hay usuarios conectados para asignar el turno',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })
}

// Atender turnos (Actualizar modulo) 

function updateStatusModulosDqot() {

    let modulos = document.querySelectorAll(".selmodulo");
    let idturno = $("#idturno").val()
    let idmodulo = 0;
    let iduser = $("#idusuario").val()

    for (let m = 0; m < modulos.length; m++) {
        if (modulos[m].checked) {
            idmodulo = modulos[m].value
        }
    }

    const frmTomarTurno = new FormData();
    frmTomarTurno.append("idturno", idturno);
    frmTomarTurno.append("idmodulo", idmodulo);
    frmTomarTurno.append("iduser", iduser);
    frmTomarTurno.append("username", usuario_tbl);

    fetchPost("Turnos/ActualizarStatusModulo", "json", frmTomarTurno, (resp) => {
        let resultado = resp.data;
        
        if (resultado) {
            $("#modal_atender").modal("hide");
            // Mostrar btn finalizar turno
            table.DataTable().clear().draw();
            document.getElementById("idTurno_finalizar").value = idturno;
            document.getElementById("idmodulo_finalizar").value = idmodulo;
            $("#hero6").css("display", "inline");
            $("#color_mode").prop('disabled', true);
        } else {
            alert("Ocurrio un error. Reporte la situacion con el area de sistemas")
        }
    })

}

// Dibuja tabla por Status
function cambiarestado() {
    $('#listEstadoTurnos').on('change', function () {
        selectTipoTurno = this.value;
        // Dibujar Tabla VAQ
        let fechainico = $('.input-daterange-datepicker').data('daterangepicker').startDate.format('YYYY-MM-DD');
        let fechafin = $('.input-daterange-datepicker').data('daterangepicker').endDate.format('YYYY-MM-DD');

        const frmTblvaqstatus = new FormData();
        frmTblvaqstatus.append("user", usuario_tbl);
        frmTblvaqstatus.append("status", selectTipoTurno);
        frmTblvaqstatus.append("fechainicio", fechainico);
        frmTblvaqstatus.append("fechafin", fechafin);

        fetchPost("Turnos/Tblvaq_Filtro_Turnos", "json", frmTblvaqstatus, (resp) => {
            let resultado = resp.data;
            $(`#tblTurnosPendientesVAQ tbody`).empty();
            if (resultado.length > 0) {
                DibujaTblTurnosPendientes(resultado)
            } else {
                table.dataTable().fnClearTable();
                table.dataTable().fnDestroy();
                table.DataTable({
                    language: {
                        "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
                    },
                    bDestroy: true
                });
            }
        })
    });
}

