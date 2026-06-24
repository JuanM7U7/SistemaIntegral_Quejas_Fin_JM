//Tabla
const table = $('#turnosVGQ');

(function ($) {
    "use strict"

    // Activar boton asignar turno
    fetchGet("Turnos/TurnosAdmin_TurnosTbl", "json", (resp) => {
        let data = resp.data;
        $(`#turnosVGQ tbody`).empty();
        if (data.length > 0) {
            console.log(data)
            DibujaTblTodosTurnos(data)
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
    // Fin Activar boton asignar turno

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

        const frmTblAdminStatus = new FormData();
        frmTblAdminStatus.append("status", selectTipoTurno);
        frmTblAdminStatus.append("fechainicio", fechainico);
        frmTblAdminStatus.append("fechafin", fechafin);

        fetchPost("Turnos/TblAdmin_Filtro_Turnos", "json", frmTblAdminStatus, (resp) => {
            let resultado = resp.data;

            $(`#turnosVGQ tbody`).empty();
            if (resultado.length > 0) {
                DibujaTblTodosTurnos(resultado)
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

})(jQuery);

// Dibujar tabla administrador DQO

function DibujaTblTodosTurnos(resp) {

    table.DataTable({
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
            },
            createdRow: function (row, data, index) {
                $(row).addClass('selected')
            },
            iDisplayLength: 100,
            data: resp,
            columns: [
                { data: 'nuM_TURNO' },
                {
                    'mRender': function (data, type, full) {

                        let fecha_rec = new Date(full.fechA_HORA_RECEPCION).toISOString().split("T")[0];
                        let hora_rec = (full.fechA_HORA_RECEPCION).split("T")[1];

                        return '' + fecha_rec + ' ' + hora_rec.split(".")[0] + ' hrs';

                    }

                },
                {
                    'mRender': function (data, type, full) {

                        let fecha_asig = new Date(full.fechA_INICIO).toISOString().split("T")[0];
                        let hora_asig = (full.fechA_INICIO).split("T")[1];

                        if (fecha_asig == '1900-01-01') {
                            return 'Pendiente';
                        }

                        return '' + fecha_asig + ' ' + hora_asig.split(".")[0] + ' hrs';

                    }

                },
                {
                    'mRender': function (data, type, full) {

                        let hora_fin_atn = ((full.fechA_INICIO).split("T")[1]);
                        let hora_toma_atn = ((full.fechA_HORA_RECEPCION).split("T")[1]);

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

                        let fecha_toma_atn = new Date(full.fechA_HORA_TOMA_ATN).toISOString().split("T")[0];
                        let hora_toma_atn = (full.fechA_HORA_TOMA_ATN).split("T")[1];

                        if (fecha_toma_atn == '1900-01-01') {
                            return 'Pendiente';
                        }

                        return '' + fecha_toma_atn + ' ' + hora_toma_atn.split(".")[0] + ' hrs';

                    }

                },
                {
                    'mRender': function (data, type, full) {

                        let fecha_fin = new Date(full.fechA_FIN).toISOString().split("T")[0];
                        let hora_fin = (full.fechA_FIN).split("T")[1];

                        if (fecha_fin == '1900-01-01') {
                            return 'Pendiente';
                        }

                        return '' + fecha_fin + ' ' + hora_fin.split(".")[0] + ' hrs';

                    }

                },
                {
                    'mRender': function (data, type, full) {

                        let fecha_fin = new Date(full.fechA_FIN).toISOString().split("T")[0];
                        if (fecha_fin == '1900-01-01') {
                            return 'Pendiente';
                        } else {

                            let hora_fin_atn = ((full.fechA_FIN).split("T")[1]);
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
                    }

                },
                {
                    'mRender': function (data, type, full) {

                        let iconPeticionario = `<td><img onmouseover="DatosPeticionario(${full.iD_REGISTRO})" id="iconuser${full.iD_REGISTRO}" alt="image" src="../img/avatar/avatar-1.png" class="rounded-circle" width="35" data-html="true" data-toggle="tooltip"></td>`;

                        return iconPeticionario;
                    }
                },
                {
                    'mRender': function (data, type, full) {
                        let cadena = `<div class="form-group"> <select class="form-control selCambAbog" style="width: auto;" id="selectAbgAdm${full.iD_TURNO}"> <option>Seleccionar</option>`;
                        for (i = 0; i < full.noM_ABOGADOS.length; i++) {

                            if (full.noM_ABOGADOS[i].activo && full.noM_ABOGADOS[i].ocupado == 1) {
                                cadena = cadena + '<option data-useran="' + full.user + '" class="btn-success" value=' + full.iD_TURNO + '/' + full.noM_ABOGADOS[i].idUsuario + '/' + full.noM_ABOGADOS[i].usuario1 + '>' + full.noM_ABOGADOS[i].nombre + '</option>';
                            } else {
                                cadena = cadena + '<option disabled value=' + full.iD_TURNO + '/' + full.noM_ABOGADOS[i].idUsuario + '/' + full.noM_ABOGADOS[i].usuario1 + '>' + full.noM_ABOGADOS[i].nombre + '</option>';
                            }
                        }
                        cadena = cadena + '</select> </div >';

                        $("#selectAbgAdm" + full.iD_TURNO + " option[value='" + full.iD_TURNO + "/" + full.iD_ABOGADO + "/" + full.user + "']").attr("selected", true);

                        if (full.statuS_TURNO_TXT == 'ATENDIENDO' || full.statuS_TURNO_TXT == 'FINALIZADO') {
                            $("#selectAbgAdm" + full.iD_TURNO).prop("disabled", true);
                        }

                        return cadena;
                    }

                },
                { data: 'nombrE_MODULO' },
                {
                    data: "statuS_TURNO_TXT", render: function (data, type, row, meta) {

                        return '<div class="badge status-badge badge-info"> ' + data + ' </div > ';
                    }
                }
            ],
            initComplete: function () {
                cambiarAbogado();
            },
            bDestroy: true
    });

    table.on('click', 'tbody tr', function () {
        var $row = table.DataTable().row(this).nodes().to$();
        var hasClass = $row.hasClass('selected');
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

// Dibuja tabla por Status
function cambiarestado() {
    $('#listEstadoTurnos').on('change', function () {
        selectTipoTurno = this.value;
        // Dibujar Tabla VAQ
        let fechainico = $('.input-daterange-datepicker').data('daterangepicker').startDate.format('YYYY-MM-DD');
        let fechafin = $('.input-daterange-datepicker').data('daterangepicker').endDate.format('YYYY-MM-DD');

        const frmTblvaqstatus = new FormData();
        frmTblvaqstatus.append("status", selectTipoTurno);
        frmTblvaqstatus.append("fechainicio", fechainico);
        frmTblvaqstatus.append("fechafin", fechafin);
         
        fetchPost("Turnos/TblAdmin_Filtro_Turnos", "json", frmTblvaqstatus, (resp) => {
            let resultado = resp.data;

            $(`#turnosVGQ tbody`).empty();
            if (resultado.length > 0) {
                DibujaTblTodosTurnos(resultado)
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


