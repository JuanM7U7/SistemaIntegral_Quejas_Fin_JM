//Tabla
const tableBuscadorFormatos = $('#tableEditFormatosDqot');
const tableMemorandum = $('#tableMemoDqot');
let EstadoConyugal = "";
let Ocupacion = "";
let Discapacidad = "";
let HijosVivos = "";
let ModalidadViolencia = "";
let RelacionAgresor = "";
let GrupoSocial = "";
let TipoViolencia = "";
let escolaridadInicio = '';
let escolaridadFinal = '';
let visitadurias = "";
let contadorSelect = 0;
let options = {};

$(document).ready(function () {


    $("#buscar_idqueja").click(function (e) {
        e.preventDefault();
        var idusuario = $('#idusuario').val();
        var usuario = $('#usuario').val();
        

        $('#txt_abogado').val($('#idusuario').val());
        $('#txt_abogado_rol').val($('#grupohub').val());
        Swal.fire({
            text: 'Cargando Quejas...',
            didOpen: () => {
                Swal.showLoading();
            },
            timer: 20000,
            timerProgressBar: true,
        });
        $.ajax({
            type: "POST",
            url: "BuscardorFormatos",
            data: $('#frm_busquedaFormatos').serialize(),
            dataType: "JSON",
            success: function (response) {
                Swal.fire({
                    showConfirmButton: false,
                    timer: 1
                });
                //console.log(response.data)
                mostrarResTblFormatos(response.data);
                var intro = document.getElementById('tableEditFormatosDqot tr');
                //intro.style.background = '#f5b8b5 !important';
                // $('#tableEditFormatosDqot td').css("background-color", "");
            },
            error: function () {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error al obtener las quejas.',
                    showConfirmButton: true
                });
            }
        });
        
    });

    $("#saveActaC").click(function (e) {

    });
    $("#generaPDFActaC").click(function (e) {
        GeneraActaC_pdf();
    });
    $("#save").click(function (e) {

    });
    $("#GeneraPDF").click(function (e) {

        GeneraEscrito_pdf();
    });

    fetchGet("Expediente/SelectEscolaridad", "json", (data) => {
        Escolaridad = data.escolaridad;
        escolaridadInicio = Escolaridad.slice(0, 9);
        escolaridadFinal = Escolaridad.slice(10);
    })
    fetchGet("Expediente/SelectEstadoConyugal", "json", (data) => { EstadoConyugal = data.estadoconyugal; })
    fetchGet("Expediente/SelectOcupacion", "json", (data) => { Ocupacion = data.ocupacion; })
    fetchGet("Expediente/SelectDiscapacidad", "json", (data) => { Discapacidad = data.discapacidad; })
    fetchGet("Expediente/SelectGrupoSocial", "json", (data) => { GrupoSocial = data.gruposocial; })
    fetchGet("Expediente/SelectHijosVivos", "json", (data) => { HijosVivos = data.hijosvivos; })
    fetchGet("Expediente/SelectModalidadViolencia", "json", (data) => { ModalidadViolencia = data.modalidadviolencia; })
    fetchGet("Expediente/SelectTipoViolencia", "json", (data) => { TipoViolencia = data.tipoviolencia; })
    fetchGet("Expediente/SelectRelacionAgresor", "json", (data) => { RelacionAgresor = data.relacionagresor; })
    fetchGet("Expediente/SelectVisitadurias", "json", (data) => { visitadurias = data.visitadurias; })
    fetchGet("Expediente/SelectMorales", "json", (data) => { Morales = data.tipomorales; })


    $(document).on('change', '#nomAbogado', function (event) {
        //console.log($("#nomAbogado option:selected").val());
        $('#idabogado').val($("#nomAbogado option:selected").val());
        $('#idpet').val('1165');
        $('#idEscrito_').val('2');
    });
    $(document).on('change', '#consentimiento', function (event) {
        //console.log($("#consentimiento option:selected").val());
        $('#idconsentimiento').val($("#consentimiento option:selected").val());
    });
    $(document).on('change', '#identificacionPet', function (event) {
        //console.log($("#identificacionPet option:selected").val());
        $('#idcredencial').val($("#identificacionPet option:selected").val());
    });
    $(document).on('change', '#mes', function (event) {
        //console.log($("#mes option:selected").val());
        $('#id_mes').val($("#mes option:selected").val());
    });
    $(document).on('change', '#anio', function (event) {
        //console.log($("#anio option:selected").val());
        $('#id_anio').val($("#anio option:selected").val());
    });
    $(document).on('change', '#lugar', function (event) {
        //console.log($("#lugar option:selected").val());
        $('#id_lugar').val($("#lugar option:selected").val());
    });
    $(document).on('change', '#origenPet', function (event) {/*Adicion del Origen del peticionario cuando es extranjero en el catalogo es 246*/
        //console.log($("#origenPet option:selected").val());
        var seleccion = $("#origenPet option:selected").val();
        $('#origenPetval').val($("#origenPet option:selected").val());
        if (seleccion == '218') {
            $("#origenPetExt").css("display", "block");
            $("#origenPetExtedo").css("display", "block");

            fetchGet("Expediente/SelectPaises", "json", (data) => {
                let Paises = data.relacionpaises;
                //AgregarOptionSelectPais(1, '', '#origenPetExt', Paises);
                CargaDatosSelectOtroPaises('#origenPetExt', Paises)
            });

        } else {
            //console.log("Entro al else ");
            $("#origenPetExt").select2().next().hide();
            $("#origenPetExtedo").css("display", "none");
            $("#origenPetvalExt").val("");
            $("#origenPetExtedo").val("");

        }

    });
    $(document).on('change', '#origenPetExt', function (event) {/*Adicion del Origen del peticionario cuando es extranjero en el catalogo es 246*/
        //console.log($("#origenPetExt option:selected").val());/*Desde el origen Vine Vacio*/
        var seleccion = $("#origenPetExt option:selected").val();
        $('#origenPetvalExt').val($("#origenPetExt option:selected").val());

    });
    $(document).on('change', '#CheckDcompleta', function (event) {/*Evento del check, datos complementarios de la calle*/
        var contenedor = '';
        //console.log(this)
        $('#Contenedor_Datos_LE').empty();
        if ($('#CheckDcompleta').prop('checked')) {
            //console.log("Entró al check");
            contenedor = complementoFormLugarHchos(true);
            $("#sino").val("si");
        } else {
            //console.log("No Entró al check");
            contenedor = complementoFormLugarHchos(false);
            $("#sino").val("no");
        }
        //console.log(contenedor)
        $('#Contenedor_Datos_LE').append(contenedor);

        //return body;
    });
    $(document).on('click', '#icono_agregar', function (event) {/*Evento del check, datos complementarios de la calle*/
        var contenedor = '';

        let arrNumPet = [];
        let npmax = 1;
        let autoridades = document.querySelectorAll('.arrInput_nombres');
        //console.log(autoridades)

        for (var i = 0; i < autoridades.length; i++) {
            arrNumPet.push(parseInt(autoridades[i].dataset.idinei))
        }

        npmax = Math.max.apply(null, arrNumPet);

        let nfin = npmax + 1;

        if ($('#Input_nombres' + npmax).val() != '' || $('#Input_cargo' + npmax).val() != '' || $('#Input_autoridades' + npmax).val() != '') {
            contenedor = Agrega_PersonaAutoridadvalvacio(nfin);
            $('#Contenedor_Cargos_Personas').append(contenedor);
            fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
                let autoridad = data.lista2;
                CargaDatosSelecAutori("#Input_autoridades" + nfin, autoridad);
            })
            $(`#Input_autoridades${nfin}`).select2();
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para agregar otra autoridad debe llenar al menos un campo del anterior',
                showConfirmButton: false,
                timer: 2000
            });
        }

        //return body;
    });
    $(document).on('click', '#Eliminare', function (event) {/*Evento del check, datos complementarios de la calle*/
        var contenedor = '';
        contenedor = Agrega_PersonaAutoridad();
        $('#Contenedor_Cargos_Personas').append(contenedor);
        fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
            let autoridad = data.lista2;

            CargaDatosSelecAutori("#Input_autoridades" + contadorSelect + "", autoridad);
            contadorSelect++;
        })
        //Carga_Informacion_selec_quejas();

        return body;
    });
    $(document).on('click', '#icono_eliminar', function (event) {/*Evento del check, datos complementarios de la calle*/

        var arregloInputs = [];
        $('input[type="text"]').each(function (key, value) {
            arregloInputs.push(value.id);
        });
        //console.log(arregloInputs);
        /*
        var contenedor = '';
        contenedor = Agrega_PersonaAutoridad();
        $('#Contenedor_Cargos_Personas').append(contenedor);
        fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
            let autoridad = data.lista2;

            CargaDatosSelectOtro("#Input_autoridades" + contadorSelect + "", autoridad);
            contadorSelect++;
        })
        //Carga_Informacion_selec_quejas();

        return body;
        */
    });
    $(document).on('click', '#Eliminare', function (event) {/*Evento del check, datos complementarios de la calle*/
        var contenedor = '';
        contenedor = Agrega_PersonaAutoridad();
        $('#Contenedor_Cargos_Personas').append(contenedor);
        fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
            let autoridad = data.lista2;

            CargaDatosSelecAutori("#Input_autoridades" + contadorSelect + "", autoridad);
            contadorSelect++;
        })
        //Carga_Informacion_selec_quejas();

        return body;
    });
    $("#btnTurnapexp").click(function (e) {
        e.preventDefault();

        let filas = $('#tableEditFormatosDqot').dataTable().fnGetNodes();
        let cont = 0;
        let arrayTurnados = [];
        let dataTurnoexp = new FormData();
        let fechaFinEditDqot = getSinFestivosNiFinDeSemana(fechActual, 2);
        let fechActualtv = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();
        fechActualtv = getSinFestivosNiFinDeSemana(fechActualtv, 2);
        $(filas).each(function (index) {
            let valorselect = $(this).find('.selTurno').val();

            if (valorselect != undefined) {

                if ($(this).find('.selTurno')[0].disabled == false && valorselect != "") {
                    let idVisitaduria = valorselect.split("/")[0];
                    let idQueja = valorselect.split("/")[1];
                    let idtitular = valorselect.split("/")[2];

                    arrayTurnados.push({
                        IdExpediente: idQueja,
                        Clavevisitaduria: idVisitaduria,
                        Fechaturnovisitaduriatxt: fechActualtv + ' ' + horaActualFin,
                        fk_iduserdestinatario: idtitular,
                        FechastrFinDqot: fechaFinEditDqot + ' ' + horaActualFin
                    });
                }

            }

        });
        let CVIUnicos = new Set();
        arrayTurnados.forEach(obj => {
            CVIUnicos.add(JSON.stringify({ visit: obj.Clavevisitaduria, destina: obj.fk_iduserdestinatario }));
        });
        let CVIUniF = Array.from(CVIUnicos).map(item => JSON.parse(item));


        dataTurnoexp.append('dataexpturno', JSON.stringify(arrayTurnados));
        let tblexp_aturnar = retornatabla(JSON.stringify(arrayTurnados));
        CVIUniF.sort((a, b) => a.visit - b.visit).forEach(v => {
            var visit = '';
            switch (v.visit) {
                case '1': visit = `P`; break;
                case '2': visit = `S`; break;
                case '3': visit = `T`; break;
                case '4': visit = `C`; break;
            }
            tblexp_aturnar += `<label>No. Memorándum ${visit}VG:</label><input id="swal-input${v.visit}" class="swal2-input" placeholder="Ingrese el número de memorándum ligado a este turnado de expedientes">`;
        });

        Swal.fire({
            title: "Se turnaran los siguientes expedientes",
            html: tblexp_aturnar,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            preConfirm: () => {
                let inputs = [];
                for (let v of CVIUniF.sort((a, b) => a.visit - b.visit)) {
                    let inputVal = document.getElementById(`swal-input${v.visit}`).value;
                    if (!inputVal) {
                        var visit = '';
                        switch (v.visit) {
                            case '1': visit = `P`; break;
                            case '2': visit = `S`; break;
                            case '3': visit = `T`; break;
                            case '4': visit = `C`; break;
                        }
                        Swal.showValidationMessage(`Ingrese el número de memorándum para ${visit}VG`);
                        return false;
                    }
                    inputs.push({ visitaduria: v.visit, num_memo: inputVal, destinatario: v.destina });
                }
                return inputs;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let num_memoexpsend = JSON.stringify(result.value);
                dataTurnoexp.append('num_memosendexp', num_memoexpsend);
                dataTurnoexp.append('area_origen', $('#idArea').val());
                dataTurnoexp.append('usuario_registra', $('#idusuario').val());


                $.ajax({
                    type: "post",
                    url: 'TurnoPreliminar',
                    contentType: false,
                    processData: false,
                    data: dataTurnoexp,
                    dataType: "json",
                    success: function (resp) {
                        //console.log(resp)
                        if (resp.data) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Los expedientes han sido turnados correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                Swal.fire({
                                    text: 'Cargando Quejas...',
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                    allowOutsideClick: false,
                                    allowEscapeKey: false
                                });
                                $.ajax({
                                    type: "POST",
                                    url: "BuscardorFormatos",
                                    data: $('#frm_busquedaFormatos').serialize(),
                                    dataType: "JSON",
                                    success: function (response) {
                                        mostrarResTblFormatos(response.data);
                                        Swal.close();
                                    },
                                    error: function () {
                                        Swal.close();
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Error al actualizar los datos, informe al área de sistemas'
                                        });
                                    }
                                });
                            });

                        } else {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Ocurrio un error al turnar los expedientes, reporte el incidente al area a de sistemas',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }

                    }
                });
            }
        });
    });
});

function retornatabla(data) {

    let datos = JSON.parse(data)
    let html = `
    <table class="table table-striped">
    <thead>
    <tr>
        <td><b>Id expediente</b></td>
        <td><b>Visitaduria a turnar</b></td>
        <td><b>Fecha de turno</b></td>
    </tr>
    </thead>
    <tbody>
    `;
    $.each(datos, (index, value) => {

        let vistxt = '';

        if (value.Clavevisitaduria == 1) {
            vistxt = 'Primera Visitaduría';
        } else if (value.Clavevisitaduria == 2) {
            vistxt = 'Segunda Visitaduría';
        } else if (value.Clavevisitaduria == 3) {
            vistxt = 'Tercera Visitaduría';
        } else if (value.Clavevisitaduria == 4) {
            vistxt = 'Cuarta Visitaduría';
        }

        html += `
          <tr>
            <td>${value.IdExpediente}</td>
            <td>${vistxt}</td>
            <td>${value.Fechaturnovisitaduriatxt}</td>
          </tr>
        `;

    });
    html += `
        </tbody>
    </table>`;

    return html;
}

function GeneraEscrito_Inicial() {

    let autoridades = document.querySelectorAll('.arrInput_nombres');
    let archivos_existentes = document.querySelectorAll('.divuploads');
    let npmax = '';
    let arrAutoridades = [];
    let arrOploads = [];
    //let arrOploads = [{
    //    PkEnlaceAdjescritoi: '',
    //    IdEscritoinicial: '',
    //    RutaArchivo: '',
    //    FkStatus: '',
    //    Type: ''
    //}];
    //console.log(idultimoautoridad);
    let fileUpload = $("#pdfEscritoi").get(0);
    let files = fileUpload.files;
    let dataEscritoi = new FormData();
    dataEscritoi.append('Input_ID', $('#Input_ID').val());
    dataEscritoi.append('idenlaceformatquejaei', '');
    dataEscritoi.append('id_escritoigenerado', $('#id_escritoigenerado').val());
    dataEscritoi.append('Input_Peticionario', $('#Input_Peticionario').val());
    dataEscritoi.append('Input_FechaHechos', $('#Input_FechaHechos').val());
    dataEscritoi.append('Input_HoraHechos', $('#Input_HoraHechos').val());
    dataEscritoi.append('Input_LugarHechos', $('#Input_LugarHechos').val());
    dataEscritoi.append('CheckDcompleta', $('#CheckDcompleta').is(':checked'));
    dataEscritoi.append('calleLH', $('#calleLH').val());
    dataEscritoi.append('numextLH', $('#numextLH').val());
    dataEscritoi.append('numintLH', $('#numintLH').val());
    dataEscritoi.append('cpLH', $('#cpLH').val());
    dataEscritoi.append('coloniaLH', $('#coloniaLH').val());
    dataEscritoi.append('CircunstanciasHechos', $('#CircunstanciasHechos').val());
    dataEscritoi.append('arrOploadsinsert', arrOploads);
    //Subir archivos pdf 
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            dataEscritoi.append(files[i].name, files[i]);
        }

        //if (files[0].type != 'application/pdf') {
        //    Swal.fire({
        //        position: 'center',
        //        icon: 'warning',
        //        title: 'El archivo adjunto debe ser un PDF',
        //        showConfirmButton: false,
        //        timer: 2000
        //    });
        //    return;
        //}
    }
    // Autoridades 
    if (autoridades.length > 0) {
        npmax = autoridades[autoridades.length - 1].dataset.idinei;
        if ($('#Input_nombres' + npmax).val() != '' || $('#Input_cargo' + npmax).val() != '' || $('#Input_autoridades' + npmax).val() != '') {
            for (var i = 0; i < autoridades.length; i++) {
                let idfrmautoridad = autoridades[i].dataset.idinei;
                arrAutoridades[i] = {
                    NombrePersona: $('#Input_nombres' + idfrmautoridad).val() != "" ? $('#Input_nombres' + idfrmautoridad).val() : 'No proporcionado',
                    CargoPersona: $('#Input_cargo' + idfrmautoridad).val() != "" ? $('#Input_cargo' + idfrmautoridad).val() : 'No proporcionado',
                    IdAutoridad: $('#Input_autoridades' + idfrmautoridad).val() != "" ? $('#Input_autoridades' + idfrmautoridad).val() : 285
                };
            }
            //console.log('entra if')
        } else {
            for (var i = 0; i < autoridades.length - 1; i++) {
                let idfrmautoridad = autoridades[i].dataset.idinei;
                arrAutoridades[i] = {
                    NombrePersona: $('#Input_nombres' + idfrmautoridad).val() != "" ? $('#Input_nombres' + idfrmautoridad).val() : 'No proporcionado',
                    CargoPersona: $('#Input_cargo' + idfrmautoridad).val() != "" ? $('#Input_cargo' + idfrmautoridad).val() : 'No proporcionado',
                    IdAutoridad: $('#Input_autoridades' + idfrmautoridad).val() != "" ? $('#Input_autoridades' + idfrmautoridad).val() : 285
                };
            }
            //console.log('entra else')
        }
    }
    dataEscritoi.append('autoridades', JSON.stringify(arrAutoridades));
    dataEscritoi.append('tipoform', 'buscadorfirmatos');
    dataEscritoi.append('conteditfiles', archivos_existentes.length);

    $.ajax({
        type: "post",
        url: 'GeneraEscritoInicialnuevo',
        contentType: false,
        processData: false,
        data: dataEscritoi,
        dataType: "json",
        success: function (data) {
            //console.log(data)
            if (data.mensaje == 'ok') {

                $('#id_escritoigenerado').val(data.listat.id);

                let FrmEnFormatQueja = new FormData();
                FrmEnFormatQueja.append('id_documento', data.listat.id);
                FrmEnFormatQueja.append('id_enlace', $('#Input_ID').val());
                FrmEnFormatQueja.append('documento', 'escritoi');


                fetchPost("Expediente/ActualizaEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {

                    //console.log(resp)
                    if (resp.status) {
                        // window.open(ExportaDocumento, '_blank');
                        $("#modalformularioEscritoInicial").modal("hide");
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Información Guardada Correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            Swal.fire({
                                text: 'Cargando Quejas...',
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            });
                            $.ajax({
                                type: "POST",
                                url: "BuscardorFormatos",
                                data: $('#frm_busquedaFormatos').serialize(),
                                dataType: "JSON",
                                success: function (response) {
                                    mostrarResTblFormatos(response.data);
                                    Swal.close();
                                },
                                error: function () {
                                    Swal.close();
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Error al actualizar los datos, informe al área de sistemas'
                                    });
                                }
                            });
                        });
                    }

                });


            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error al Insertar los datos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    });
}

function GeneraEscrito_pdf() {

    let id = document.getElementById('id_escritoigenerado').value.trim();

    window.open(ExportaDocumento + id, '_blank');

}

function GeneraActaC_pdf() {

    let idacta = document.getElementById('idactac').value.trim();

    window.open(ExportaDocumentoacta + idacta, '_blank');
}

function GeneraActaCircunstanciada() {
    console.log($('#anio').val());
    $('#anioND').val($('#anio').val());
    if (validaTexto('validatxtac') || validaNum('validanumerosac') || validainputvacio('validaselectdac') || validainputvacio('validadateac') || validainputvacio('validatimeac') || validainputvacio('validanovacioac')) {
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "GuardaActaC",
        data: $('#formActa1').serialize(),
        dataType: "JSON",
        success: function (response) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Información Actualizada Correctamente',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                Swal.fire({
                    text: 'Cargando Quejas...',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                $.ajax({
                    type: "POST",
                    url: "BuscardorFormatos",
                    data: $('#frm_busquedaFormatos').serialize(),
                    dataType: "JSON",
                    success: function (response) {
                        mostrarResTblFormatos(response.data);
                        $("#modalFormPeticionario").modal("hide");
                        Swal.close();
                    },
                    error: function () {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar los datos, informe al área de sistemas'
                        });
                    }
                });
            });
            $("#modalformularioActaCircunstanciada").modal("hide");
        }
    });
    var NumeroActaC = $('#Contenedor_Actas').find('p').length + 1;


    //console.log("Entro a la adición del contenedor de las actas");
    document.getElementById("Contenedor_Actas").innerHTML += `<p>Acta Circunstanciada ${NumeroActaC}</p>
                            <button type='button' title='Editar Acta Circunstanciada' onclick='traeInformacionActaC()' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-pencil color-muted fa-2x'></span>
                            </button>
                            <button type='button' title='Eliminar Acta Circunstanciada' onclick='eliminaActac(0)' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-trash color-danger fa-2x'></span>
                            </button> <br/>`;
}

function traeInformacionEscritoi(idqueja, estatus, idcomplemento, idexpediente, validafechamodifdqot) {
    /* Funciones escritoi */
    funcionesEscritoi();
    let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
    $('.formularioEscritoInicial').empty()
    $('.formularioEscritoInicial').append(iformEscritoInicial);
    $('#Input_LugarHechos').select2();
    $.ajax({
        type: "POST",
        url: "GetDataEscritoInicial",
        data: { identificadorQueja: idqueja },
        dataType: "JSON",
        success: function (response) {

            var longitud = response.data.length;
            if (response.data.length > 0) {

                //console.log(response.data)

                let fecha_hechos = new Date(response.data[0].fechahd).toISOString().split("T")[0];
                let hora_hechos = (response.data[0].fechahd).split("T")[1];
                let ruta_adjuntoei = response.data[0].rutaarchivo;
                //Carga_Informacion_selec_quejas();

                $("input[name='id_quejaei']").val(idqueja);
                $("input[name='id_escritoigenerado']").val(idqueja);
                $("input[name='Input_ID']").val(idexpediente);
                $("input[name='ID_CompPeticionario']").val(idcomplemento);
                $("input[name='Input_Peticionario2']").val(response.data[0].peticionarios.replace(/No Proporcionado/g, ''));
                $("input[name='Input_Peticionario']").val(response.data[0].idpersona + '/' + response.data[0].idcomlpe_persona);
                $("input[name='ID_Peticionario']").val(response.idPeticionario);
                $("input[name='Input_FechaHechos']").val(fecha_hechos);
                $("input[name='Input_HoraHechos']").val(hora_hechos);
                $("textarea[name='CircunstanciasHechos']").val(response.data[0].circuns_Hechos);
                if (ruta_adjuntoei != '') {

                }

                //$("#Input_LugarHechos option[value=" + response.data[0].cvemun + "]").attr("selected", "selected");
                //$('#Input_LugarHechos').val(response.data[0].cvemun).trigger('change.select2');
                if (response.data[0].calle != '' || (response.data[0].numero_ext != '' && response.data[0].numero_ext != '0') || (response.data[0].numero_int != '' && response.data[0].numero_int != '0') || (response.data[0].cp != '' && response.data[0].cp != '0') || response.data[0].colonia != '') {
                    /*Seleccionar lapropiedad checked en True*/
                    $('#CheckDcompleta').click();
                    $("input[name='calleLH']").val(response.data[0].calle);
                    $("input[name='numextLH']").val(response.data[0].numero_ext);
                    $("input[name='numintLH']").val(response.data[0].numero_int);
                    $("input[name='cpLH']").val(response.data[0].cp);
                    $("input[name='coloniaLH']").val(response.data[0].colonia);
                }

                fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
                    let estado = data.lista4;

                    //CargaDatosSelectOtro("#Input_LugarHechos", estado);
                    $("#Input_LugarHechos > option[value='" + response.data[0].cvemun + "']").attr("selected", true);
                    $('#Input_LugarHechos').val(response.data[0].cvemun).trigger('change.select2');
                })

                if (longitud > 0) {
                    for (var i = 0; i < longitud; i++) {

                        var contenedor = '';
                        //console.log(i);
                        //console.log(response.data[i].autoridad);
                        contenedor = Agrega_PersonaAutoridad(i + 1, response.data[i].nombre_persona, response.data[i].cargo_persona, response.data[i].autoridad);

                        $('#Contenedor_Cargos_Personas').append(contenedor);
                        $(`#Input_autoridades${i + 1}`).select2();
                        cargaInformacionSelectsEscritoInicial(i + 1, response.data[i].cvemun, response.data[i].autoridad);

                    }
                }

                if (response.data[0].rutaarchivo.length > 0) {
                    $('#containerImages').append(cargaArchivosAdjuntos(response.data[0].rutaarchivo));
                }

                $("#modalformularioEscritoInicial").modal("show");

                $("#Input_ID").prop('readOnly', true);
                $("#Input_Peticionario2").prop('readOnly', true);
                $("#Input_ID").css("font-weight", "bold");
                $("#Input_Peticionario2").css("font-weight", "bold");
                $("#Input_ID").css("background-color", "#D8D8D8");
                $("#Input_Peticionario2").css("background-color", "#D8D8D8");

                if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar' || validafechamodifdqot === true) {
                    $('.formularioEscritoInicial button[type="button"]').hide();
                }

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Datos no encontrados, verifique que exista un escrito Inicial dentro de la queja',
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            }
        }
    });
}

function seleccionaSelectEscritoi(contador, autoridadSe) {
    //console.log('contador: ' + contador)
    //console.log('autoridad: ' + autoridadSe)
    //$('#Input_autoridades' + contador).select2();
    $("#Input_autoridades1").select2().val("1").trigger('change.select2');

    //$('#Input_autoridades' + contador +' > option[value="' + autoridadSe + '"]').attr('selected', true);
    //$('#Input_autoridades' + contador).select2().val(autoridadSe).trigger("change");
    /*    $('#Input_autoridades' + contador).select2().val(autoridadSe).trigger('change.select2');*/

    //console.log('valorautoridad: ' + $('#Input_autoridades' + contador).val())
}

function AddEscritoInicial(idExpediente, peticionarios) {

    let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
    $('.formularioEscritoInicial').empty();
    Carga_Informacion_selec_quejas();
    ventana_eligepeticionario_ei('Selecciona el peticionario para continuar', idExpediente, peticionarios);

    $('.formularioEscritoInicial').append(iformEscritoInicial);
    $('#Input_LugarHechos').select2();
    funcionesEscritoi();
    $("#modalformularioEscritoInicial").modal("show");
}

function formEscritoInicial2(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_Peticionario2', 'Input_Peticionario2', '', 'text', 'Peticionario/Agraviado:&nbsp;', 'textfield', 'placeholder="Nombre del peticionario"', 'style ="margin-left: 60%;"')
        + '</div>'
        + Crea_Parrafos('parrafo0', 'parrafo0', 'col-md-3 parrafo', 'DR. JOSÉ FELIX CEREZO VÉLEZ</br>PRESIDENTE DE LA COMISIÓN DE DERECHOS HUMANOS DEL ESTADO DE PUEBLA', 'style ="text-align: left;font-weight: bold;"')
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en los artículos 2, 4, 5, 13 fracciones I, II, III, IV y V, 25, 28 y demás relativos y aplicables de la Ley de la Comisión de Derechos Humanos del Estado, ante personal de este organismo y por mi propio derecho, acudo a denunciar actos u omisiones que a mi juicio constituyen violación a mis derechos humanos, en los términos que a continuación se expresan:', 'style ="text-align: left"')
        + '</div>'
        + CreaInputs_Con_Label('Input_FechaHechos', 'Input_FechaHechos', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA EN QUE OCURRIERON LOS HECHOS:&nbsp;', 'textfield', 'placeholder="fecha hechos" style ="float:left;"', ' style ="float:left;"')
        + CreaInputs_Con_Label('Input_HoraHechos', 'Input_HoraHechos', '', 'time', '', 'textfield', 'placeholder="hora hechos" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        //+ CreaInputs_Con_Label('Input_LugarHechos', 'Input_LugarHechos', '', 'text', 'Lugar en donde Ocurrieron los Hechos: ', 'Input_LugarHechos', 'placeholder="Lugar de los Hechos" style ="float:left;"', ' style ="float:left;"')
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR EN QUE SE SUSCITARON LOS HECHOS:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%;"')
        + CreaInputs_Con_Label('CheckDcompleta', 'CheckDcompleta', '', 'checkbox', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;¿SABE LA DIRECCIÓN COMPLETA?&nbsp;&nbsp;', 'CheckDcompleta', '', '')
        + '<div id="Contenedor_Datos_LE"></div>'
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'CIRCUNSTANCIAS BAJO LAS CUALES OCURRIERON LOS HECHOS:&nbsp;')
        + CreaTextArea('CircunstanciasHechos', 'col - md - 12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('adeleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'AUTORIDAD(ES) INVOLUCRADA(S):&nbsp;&nbsp;&nbsp;')
        + CreaBR()
        + CreaBR()
        // + CreaInputs_Con_Label('Input_nombres', 'Input_nombres', '', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres', 'placeholder="Nombres y apellidos" style ="float:left;"', ' style ="float:left;"')
        //+ CreaInputs_Con_Label('Input_cargo', 'Input_cargo', '', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" style ="float:left;"', ' style ="float:left;"')
        //+ CreaSelectLabelSelect2('Input_autoridades', "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' style ="float:left;"', ' style ="width:180px!important; float:left;max-width:180px!important;"')
        + '&nbsp;&nbsp;<img src="/img/Agregar_PNG.png" id="icono_agregar" style="width:26px;height:26px;">'
        + '&nbsp;&nbsp;<img src="/img/Eliminar_PNG.png" id="icono_eliminar" style="width:24px;height:24px;">'
        + CreaBR()
        + CreaBR()
        + '<div id="Contenedor_Cargos_Personas"></div>'
        + CreaBR()
        + CreaBR()
        //+ CreaInputs_Con_Label('Input_autoridades', 'Input_autoridades', '', 'text', 'A QUE AUTORIDAD PERTENCEN: ', 'Input_nombres', 'placeholder="Selecciona Autoridades" style ="float:left;"', ' style ="float:left;"')
        + '<div class="text-center">'
        + Crea_Label('parrafo7', 'parrafo6', 'col-md-12 parrafo', 'NOTA: LOS DATOS PERSONALES SE PRECISAN EN HOJA ANEXA')
        + CreaBR()
        + CreaBR()
        + crea_Boton('button', 'Previsualizar PDF', 'generaPDF', 'btn btn-pinterest', 'GeneraEscrito_pdf()')
        + crea_Boton('button', 'Guardar', 'save', 'btn btn-success', 'GeneraEscrito_Inicial()')
        + '</div>'
        + CreaInputs('sino', 'sino', '', 'hidden')
        + CreaInputs('autoridadesselect', 'autoridadesselect', '', 'hidden')
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('coloniainputs', 'coloniainputs', '', 'hidden')
        + CreaInputs('ID_Peticionario', 'ID_Peticionario', '', 'hidden')
        + CreaInputs('ID_CompPeticionario', 'ID_CompPeticionario', '', 'hidden')
        + CreaInputs('id_quejaei', 'id_quejaei', '', 'hidden')
        + CreaInputs('Input_Peticionario', 'Input_Peticionario', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden');

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}

function soloVerDatos(estatus) {

}

// Dibuja tabla por Status
function activarBtnTurnopre() {
    $('.selTurno').on('change', function () {

        let filas = $('#tableEditFormatosDqot').dataTable().fnGetNodes();
        let cont = 0;

        $(filas).each(function () {

            let valorselect = $(this).find('.selTurno').val();

            if (valorselect != undefined) {
                if ($(this).find('.selTurno')[0].disabled == false && valorselect != "") {
                    cont++;
                }
            }

            if (cont > 0) {
                $('#btnTurnapexp').prop('disabled', false);
            } else {
                $('#btnTurnapexp').prop('disabled', true);
            }

        });

    });
}

function validafechamodificacionDqot(fechaturno, fechafinmoddqot) {

    let resp = false;

    if (fechafinmoddqot != '1900-01-01T22:00:00') {

        let fechaHoyFin = new Date();
        //console.log(fechaHoyFin);

        let fecha_dos = (fechafinmoddqot.split('T')[0]).split('-');
        let hora_dos = (fechafinmoddqot.split('T')[1]).split(':');
        let fechaTerminaFin = new Date(fecha_dos[0], fecha_dos[1] - 1, fecha_dos[2], hora_dos[0], hora_dos[1], hora_dos[2]);
        //console.log(fechaTerminaFin)

        if (fechaHoyFin > fechaTerminaFin) {
            resp = true;
        }
    }

    return resp;
}

/*Metodo actualizado por christopher 13 - 12 - 2023*/
function mostrarResTblFormatos(response) {
    tableBuscadorFormatos.DataTable({
        language: {
            "url": "/js/TablaJson.json"
        },
        iDisplayLength: 10,
        data: response,
        fixedHeader: true,
        columns: [
            {
                className: 'details-control',
                defaultContent: '',
                data: null,
                orderable: false
            },
            {
                //data: 'fkExpediente'
                'mRender': function (data, type, full) {
                    return full.fkExpediente
                        + `</br><button type='button' title='Bitácora de cambios' onclick='btnGenraBitacorCamb(${full.fkExpediente})' class='btn btn-link margin-iconbf'><img src="../icons/personalizados/detective.png" height="35"/></button>`
                }
            },
            {
                'mRender': function (data, type, full) {
                    var contador = 0;
                    var anterior = '';

                    if (anterior == full.fkExpediente) {
                        contador++;
                    }

                    let validafecha_modificaciondqot = validafechamodificacionDqot(full.expedienteTurno[0].fechaturnovisitaduria, full.expedienteTurno[0].fechaFinDqot);
                    //console.log(validafecha_modificaciondqot);

                    let peticionarioslist = "";
                    let contador_agraviado = 0;
                    let contador_quejoso = 0;
                    let iconadd = '';
                    if (full.status_Expediente == 'Eliminado' || full.status_Expediente == 'Pendiente de turnar'
                        || full.status_Expediente == 'Turnado parcial a VG'
                        || full.status_Expediente == 'Turnado a VG'
                        || full.status_Expediente == 'Pendiente de Returno'
                        || full.status_Expediente == 'Returnado a VG'
                        || full.status_Expediente == 'Returnado parcial'
                        || full.status_Expediente == 'Turnado a VA'
                        || validafecha_modificaciondqot === true) { } else {
                        iconadd = `<button type='button' title='Agregar nuevo quejoso' onclick='AddFormatDatosPersonales(${full.fkExpediente})' class='btn btn - link margin - iconbf'>
                            <span class='fa fa-user-plus color-muted fa-2x'></span >
                            </button >`;
                    }


                    if (contador < 2) {

                        if (full.agravQuej.length > 0) {
                            for (var i = 0; i < full.agravQuej.length; i++) {

                                if (full.status_Expediente == 'Eliminado' || full.status_Expediente == 'Pendiente de turnar'
                                    || full.status_Expediente == 'Turnado parcial a VG'
                                    || full.status_Expediente == 'Turnado a VG'
                                    || full.status_Expediente == 'Pendiente de Returno'
                                    || full.status_Expediente == 'Returnado a VG'
                                    || full.status_Expediente == 'Returnado parcial'
                                    || full.status_Expediente == 'Turnado a VA'
                                    || validafecha_modificaciondqot === true) {
                                    peticionarioslist += `
                                                <label class='delbtnfdp${full.fkExpediente}'>${full.agravQuej[i].nombre} ${full.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${full.agravQuej[i].apellidoMat.replace("No Proporcionado", '') } (${full.agravQuej[i].tipoUsuario})</label> <br/> 
                                                <button type='button' title='Ver quejoso' onclick='editFormatDatosPersonales(${full.agravQuej[i].fkRegRecepcion} , ${full.agravQuej[i].idComplementoPeticionario},"${full.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf delbtnfdp${full.fkExpediente}'>
                                                    <span class='fa fa-search color-muted fa-2x delbtnfdp${full.fkExpediente}'></span>
                                                </button>`;
                                    if (full.agravQuej[i].tipoUsuario == "Agraviado") {
                                        contador_agraviado++;
                                    }
                                    else if (full.agravQuej[i].tipoUsuario == "Peticionario") {
                                        contador_quejoso++;
                                    }
                                } else {
                                    peticionarioslist += `
                                        <label class='delbtnfdp${full.fkExpediente}'>${full.agravQuej[i].nombre} ${full.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${full.agravQuej[i].apellidoMat.replace("No Proporcionado", '') } (${full.agravQuej[i].tipoUsuario})</label> <br/> 
                                        <button type='button' title='Editar quejoso' onclick='editFormatDatosPersonales(${full.agravQuej[i].fkRegRecepcion} , ${full.agravQuej[i].idComplementoPeticionario},"${full.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf delbtnfdp${full.fkExpediente}'>
                                            <span class='fa fa-pencil color-muted fa-2x delbtnfdp${full.fkExpediente}'></span>
                                        </button>
                                        <button type='button' title='Eliminar quejoso' onclick='eliminaFormatoDatosPeronsales(${full.agravQuej[i].idComplementoPeticionario}, this)' class='btn btn-link margin-iconbf delbtnfdp${full.fkExpediente}'>
                                            <span class='fa fa-trash color-danger fa-2x delbtnfdp${full.fkExpediente}'></span>
                                        </button>  <br/>`;
                                    if (full.agravQuej[i].tipoUsuario == "Agraviado") {
                                        contador_agraviado++;
                                    }
                                    else if (full.agravQuej[i].tipoUsuario == "Peticionario") {
                                        contador_quejoso++;
                                    }
                                }
                            }

                            //$.map(arregloPeticionarios,
                            //    function (o) {
                            //        options[o.queja + "/" + o.idreg + "/" + o.id + "/" + o.nombre] = o.nombre;
                            //    });

                            if (full.agravQuej.length == 1 && full.status_Expediente != 'Eliminado') {
                                return peticionarioslist + iconadd;
                            }
                            else if (full.agravQuej.length == 1 && full.status_Expediente == 'Eliminado') {
                                return peticionarioslist;
                            }
                            else {
                                return `<p> ${contador_agraviado} Agraviado(s) </p><br>
                                    <p> ${contador_quejoso} Peticionario(s)</p>`;
                            }
                        }
                        return peticionarioslist + iconadd;
                    } else {

                    }


                    anterior = full.fkExpediente;
                }

            },
            {
                'mRender': function (data, type, full) {

                    let iconaddEscrito = '';
                    let btnEscritook = "";
                    let peticionarios = JSON.stringify(full.agravQuej);
                    let validafecha_modificaciondqot = validafechamodificacionDqot(full.expedienteTurno[0].fechaturnovisitaduria, full.expedienteTurno[0].fechaFinDqot);

                    if (full.escritoia.length > 0) {
                        if (full.status_Expediente == 'Pendiente de turnar'
                            || full.status_Expediente == 'Turnado parcial a VG'
                            || full.status_Expediente == 'Turnado a VG'
                            || full.status_Expediente == 'Pendiente de Returno'
                            || full.status_Expediente == 'Returnado a VG'
                            || full.status_Expediente == 'Returnado parcial'
                            || full.status_Expediente == 'Turnado a VA'
                            || validafecha_modificaciondqot === true) {

                            btnEscritook = `<button type='button' title='Ver Escrito Inicial' onclick='traeInformacionEscritoi(${full.escritoia[0].idEscrito},"${full.status_Expediente}", ${full.escritoia[0].idcomplementopetei}, ${full.fkExpediente},${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-search color-muted fa-2x'></span>
                                            </button>`;
                        } else {
                            btnEscritook = `<button type='button' title='Editar Escrito Inicial' onclick='traeInformacionEscritoi(${full.escritoia[0].idEscrito},"${full.status_Expediente}", ${full.escritoia[0].idcomplementopetei}, ${full.fkExpediente}, ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-pencil color-muted fa-2x'></span>
                                            </button>
                                            <button type='button' title='Eliminar Escrito Inicial' onclick='eliminarEscrito(${full.escritoia[0].idEscrito}, "${full.escritoia[0].nombre_petligadoei}", ${full.fkExpediente})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-trash color-danger fa-2x'></span>
                                            </button>`;
                        }

                        if (full.status_Expediente == 'Eliminado'
                            || full.status_Expediente == 'Turnado parcial a VG'
                            || full.status_Expediente == 'Turnado a VG'
                            || full.status_Expediente == 'Pendiente de Returno'
                            || full.status_Expediente == 'Returnado a VG'
                            || full.status_Expediente == 'Returnado parcial'
                            || full.status_Expediente == 'Turnado a VA'
                            || validafecha_modificaciondqot === true) {
                            btnEscritook = `<button type='button' title='Ver Escrito Inicial' onclick='traeInformacionEscritoi(${full.escritoia[0].idEscrito},"${full.status_Expediente}", ${full.escritoia[0].idcomplementopetei}, ${full.fkExpediente}, ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-search color-muted fa-2x'></span>
                                            </button> `
                        }
                    } else {

                        if (full.status_Expediente == 'Eliminado') { } else {
                            iconaddEscrito = `<button type='button' title='Agregar Escrito Inicial' onclick='AddEscritoInicial(${full.fkExpediente}, ${peticionarios})' class='btn btn - link margin - iconbf'>
                            <img src="../icons/personalizados/add-file.png" height="40"/>
                            </button > <br>`;
                        }
                    }
                    return btnEscritook + iconaddEscrito;
                }
            },
            {
                'mRender': function (data, type, full) {

                    //let arregloPeticionarios = [];
                    let iconaddActac = '';
                    let btnActacircu = "";
                    let contadorActa = 0;
                    let status = '';
                    let peticionarios = JSON.stringify(full.agravQuej);
                    let validafecha_modificaciondqot = validafechamodificacionDqot(full.expedienteTurno[0].fechaturnovisitaduria, full.expedienteTurno[0].fechaFinDqot);

                    if (full.status_Expediente == 'Eliminado') {
                        status = full.status_Expediente;
                    } else if (full.actaCa.length > 0 && full.escritoia.length > 0 && full.agravQuej.length > 0 && full.status_Expediente != 'Eliminado') {
                        status = 'Completo';
                    } else {
                        status = 'Incompleto';
                    }

                    if (full.status_Expediente == 'Eliminado' || full.status_Expediente == 'Pendiente de turnar'
                        || full.status_Expediente == 'Turnado parcial a VG'
                        || full.status_Expediente == 'Turnado a VG'
                        || full.status_Expediente == 'Pendiente de Returno'
                        || full.status_Expediente == 'Returnado a VG'
                        || full.status_Expediente == 'Returnado parcial'
                        || full.status_Expediente == 'Turnado a VA') {
                        iconaddActac = '';
                    } else
                    {
                        iconaddActac = `<button type='button' title='Agregar Acta Circunstanciada' onclick='AddActac(${full.fkExpediente}, ${full.escritoia.length > 0 ? full.escritoia[0].idEscrito : 1}, ${peticionarios})' class='btn btn - link margin - iconbf'>
                                               <img src="../icons/personalizados/add-file.png" height="40"/>
                                        </button > <br>`;
                    }

                    if (full.actaCa.length > 0) {
                        for (var i = 0; i < full.actaCa.length; i++) {

                            if (full.status_Expediente == 'Eliminado' || full.status_Expediente == 'Pendiente de turnar'
                                || full.status_Expediente == 'Turnado parcial a VG'
                                || full.status_Expediente == 'Turnado a VG'
                                || full.status_Expediente == 'Pendiente de Returno'
                                || full.status_Expediente == 'Returnado a VG'
                                || full.status_Expediente == 'Returnado parcial'
                                || full.status_Expediente == 'Turnado a VA'
                                || validafecha_modificaciondqot === true) {
                                btnActacircu += `<button type='button' title='Ver Acta Circunstanciada' onclick='traeInformacionActaC(${full.actaCa[i].idActac},"${full.status_Expediente}", "${full.escritoia.length > 0 ? full.escritoia[0].idEscrito : 1}","${full.fkExpediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-search color-muted fa-2x'></span>
                                           </button>`
                            } else {
                                btnActacircu += `<button type='button' title='Editar Acta Circunstanciada' onclick='traeInformacionActaC(${full.actaCa[i].idActac},"${full.status_Expediente}", "${full.escritoia.length > 0 ? full.escritoia[0].idEscrito : 1}","${full.fkExpediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-pencil color-muted fa-2x'></span>
                                           </button>
                                            <button type='button' title='Eliminar Acta Circunstanciada' onclick='eliminarActac(${full.actaCa[i].idActac}, ${'"' + full.actaCa[i].nombre_petligado + '"'})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-trash color-danger fa-2x'></span>
                                            </button>`;
                            }
                        }

                        if (full.actaCa.length == 1 && full.status_Expediente == 'Pendiente de turnar') {
                            return btnActacircu + '</br>';
                        }
                        if (full.actaCa.length == 1 && full.status_Expediente != 'Eliminado') {
                            return btnActacircu + '</br>' + iconaddActac;
                        }
                        else if (full.actaCa.length == 1 && full.status_Expediente == 'Eliminado') {
                            return btnActacircu;
                        }
                        else {
                            return `<p>Tiene ${full.actaCa.length} Acta(s) Circunstanciada(s)</p>`;
                        }
                    }
                    else if (full.actaCa.length < 1 && full.status_Expediente == 'Eliminado') {
                        return `<p>No tiene Acta(s) Circunstanciada(s)</p>`;
                    }
                    else {
                        return iconaddActac;
                    }

                }
            },
            {
                'mRender': function (data, type, full) {

                    let fecha_reg = new Date(full.fechaRegistro).toISOString().split("T")[0];
                    let hora_asig = (full.fechaRegistro).split("T")[1];

                    if (fecha_reg == '1900-01-01') {
                        return 'Pendiente';
                    }

                    return '' + fecha_reg + ' ' + hora_asig.split(".")[0] + ' hrs';

                }

            },
            {
                data: 'viA_INTERPOSICION'

            },
            {
                'mRender': function (data, type, full) {
                    let badgeStatus = '';
                    if (full.status_Expediente == 'Eliminado') {
                        badgeStatus = '<div class="badge status-badge badge-dark"><del>Eliminado</del></div > '
                    }
                    else if (full.status_Expediente == 'Pendiente de turnar') {
                        badgeStatus = '<div class="badge status-badge badge-success">Pendiente de turnar</div > '
                    }
                    else if (full.status_Expediente == 'Turnado parcial a VG') {
                        badgeStatus = '<div class="badge status-badge badge-success">Turnado parcial a VG</div > '
                    } else if (full.status_Expediente == 'Pendiente de Returno') {
                        badgeStatus = '<div class="badge status-badge" style="background-color:#c06500;color:white;">Pendiente de Returno</div > '
                    }
                    else if (full.status_Expediente == 'Turnado a VG') {
                        badgeStatus = '<div class="badge status-badge" style="background-color:#c06500;color:white;">Turnado a VG</div > '
                    }
                    else if (full.status_Expediente == 'Returnado a VG') {
                        badgeStatus = '<div class="badge status-badge" style="background-color:#c06500;color:white;">Returnado a VG</div > '
                    }
                    else if (full.status_Expediente == 'Returnado parcial') {
                        badgeStatus = '<div class="badge status-badge" style="background-color:#c06500;color:white;">Returnado parcial</div > '
                    }
                    else if (full.status_Expediente == 'Turnado a VA') {
                        badgeStatus = '<div class="badge status-badge" style="background-color:#c06500;color:white;">Turnado a VA</div > '
                    }
                    else if (full.fkExpediente > 0) {
                        var datoEstatus = EstatusFormatos(full);
                        if (datoEstatus === 'Completo') {
                            badgeStatus = '<div class="badge status-badge badge-success">Completo</div > '
                        } else if (datoEstatus !== 'Incompleto') {
                            badgeStatus = datoEstatus
                        }
                    }
                    //else {
                    //    badgeStatus = '<div class="badge status-badge badge-danger">Incompleto</div >'
                    //}
                    return badgeStatus;
                }
            },
            {
                'mRender': function (data, type, full) {
                    {
                        let iconaddEscrito = '';
                        let validafecha_modificaciondqot = validafechamodificacionDqot(full.expedienteTurno[0].fechaturnovisitaduria, full.expedienteTurno[0].fechaFinDqot);

                        if (full.status_Expediente == 'Eliminado' || full.status_Expediente == 'Pendiente de turnar' || validafecha_modificaciondqot === true) {
                            iconaddEscrito = `<button type='button' title='Ver Datos Complementarios' onclick='traeInformacionDatosComplementarios(${full.fkExpediente},"${full.status_Expediente}", ${validafecha_modificaciondqot}, ${validafecha_modificaciondqot})' class='btn btn - link margin - iconbf'>
                            <span class='fa fa-search color-muted fa-2x'></span>
                            </button > <br>`;
                        } else {
                            iconaddEscrito = `<button type='button' title='Editar Datos Complementarios' onclick='traeInformacionDatosComplementarios(${full.fkExpediente},"${full.status_Expediente}", ${validafecha_modificaciondqot}, ${validafecha_modificaciondqot})' class='btn btn - link margin - iconbf'>
                            <span class='fa fa-pencil color-muted fa-2x'></span>
                            </button > <br>`;
                        }


                        return iconaddEscrito;
                    }
                }
            },
            {
                'mRender': function (data, type, full) {

                    var rolAbogado = $('#grupohub').val();
                    if (rolAbogado == 'VA_DQOT') {
                        return '';

                    } else if (rolAbogado == 'ADMIN_DQOT') {

                        let iconVermemo = '';
                        // fecha 1900-01-01 10:00:00 PM se usa por default para valores nulos
                        let disabled = full.status_Expediente == 'Turnado parcial a VG' ? 'disabled' : '';
                        let cadena = `<div class="form-group"> <select class="form-control selTurno" ${disabled} style="width: auto;" id="selectTurnoexp${full.fkExpediente}"> <option value="">Seleccionar</option>`;
                        let cont = 0;
                        if (full.fkExpediente == 521) {
                            let vas = full.fkExpediente;
                            //console.log(vas);
                        }
                        for (i = 0; i < visitadurias.length; i++) {
                            if (full.status_Expediente == 'Pendiente de turnar' || full.status_Expediente == 'Pendiente de Returno') {
                                cont++;
                                cadena = cadena + '<option data-idexpt="' + full.fkExpediente + '" class="btn-success" value=' + visitadurias[i].idSelect + '/' + full.fkExpediente + '/' + visitadurias[i].idUserTitular + '>' + visitadurias[i].descripcion + '</option>';
                            } else if (full.status_Expediente == 'Turnado parcial a VG' || full.status_Expediente == 'Pendiente de Returno') {
                                cont++;

                                if (visitadurias[i].idSelect == full.expedienteTurno[0].clavevisitaduria) {
                                    cadena = cadena + '<option selected data-idexpt="' + full.fkExpediente + '" class="btn-success" value=' + visitadurias[i].idSelect + '/' + full.fkExpediente + '/' + visitadurias[i].idUserTitular + '>' + visitadurias[i].descripcion + '</option>';
                                } else {
                                    cadena = cadena + '<option data-idexpt="' + full.fkExpediente + '" class="btn-success" value=' + visitadurias[i].idSelect + '/' + full.fkExpediente + '/' + visitadurias[i].idUserTitular + '>' + visitadurias[i].descripcion + '</option>';
                                }

                            }

                        }
                        cadena = cadena + '</select> </div >';

                        if (full.status_Expediente == 'Turnado parcial a VG') {
                            //console.log(full)
                            cadena += `<button type='button' title='Memorándum ${full.expedienteTurno[0].memorandum}' onclick='verMemoturno(${full.fkExpediente},${full.expedienteTurno[0].fkMemorandum}, "${full.expedienteTurno[0].memorandum}")' class='btn btn - link margin - iconbf'>
                            <span class='fa fa-file-text color-muted fa-2x'></span>
                        </button > <br>`;
                        }

                        if (cont > 0) {
                            return cadena;
                        } else {
                            return '';
                        }
                    } else
                    {
                        return '';
                    }

                }
            },
        ],
        initComplete: function () {

        },
        order: [1, 'desc'],
        bDestroy: true
    });

    tableBuscadorFormatos.DataTable().on("draw", function (data) {

        activarBtnTurnopre();

    })
}


//metodo creado por GITP
function EstatusFormatos(full) {
    var estatus = '<div class="badge status-badge badge-danger">Incompleto</div><br> <div class="badge badge-secondary"><div class="badge-pill badge-dark">Pendientes:</div>';// por completar
    var viaInterpo = "TresFomat";
    var contador = 0;
    var Cont = 0;
    //DATOS COMPLEMENTARIOS
    if (full.informacioncomplementaria.id_expediente > 0) {
        if (full.informacioncomplementaria.id_abogado_recibe != 99 && full.informacioncomplementaria.id_lugar_hechos != '' && full.informacioncomplementaria.via_interpos != 99
            && full.informacioncomplementaria.hechos != '' && full.informacioncomplementaria.fecha_registro != null && full.informacioncomplementaria.id_sede < 6) {
            if (full.informacioncomplementaria.informacioncomplementariapeticionario != null && full.informacioncomplementaria.informacioncomplementariapeticionario.length != 0) {
                contador++;
            }
        }
        if (contador === 0) {
            estatus = estatus + 'Datos Complementarios <br>';
        }
    } else {
        estatus = estatus + 'Datos Complementarios <br>';
    }
    //FIN DATOS COMPLEMENTARIOS

    //DE PETICIONARIO
    //full.agravQuej.lPeticionario.docIdentificatorio
    if (full.agravQuej.length > 0) {//AgravQuej
        Cont = 0;
        for (var i = 0; i < full.agravQuej.length; i++) {
            if (full.agravQuej[i].lPeticionario.length > 0) {
                for (var e = 0; e < full.agravQuej[i].lPeticionario.length; e++) {
                    if (full.agravQuej[i].lPeticionario[e].docIdentificatorio != '' && full.agravQuej[i].lPeticionario[e].nombre != '' && full.agravQuej[i].lPeticionario[e].apellidoPat != '' && full.agravQuej[i].lPeticionario[e].apellidoMat != ''
                        && full.agravQuej[i].lPeticionario[e].apellidoPat != '' && full.agravQuej[i].lPeticionario[e].codigoPostal != '' && full.agravQuej[i].lPeticionario[e].estado != '' && full.agravQuej[i].lPeticionario[e].colonia != ''
                        && full.agravQuej[i].lPeticionario[e].municipio != '' && full.agravQuej[i].lPeticionario[e].ciudad != '' && full.agravQuej[i].lPeticionario[e].calle != '' && full.agravQuej[i].lPeticionario[e].numExterior != ''
                        && full.agravQuej[i].lPeticionario[e].numInterior != '' && full.agravQuej[i].lPeticionario[e].fechaNacimiento != '' && full.agravQuej[i].lPeticionario[e].edad != '' && full.agravQuej[i].lPeticionario[e].telefono != ''
                        && full.agravQuej[i].lPeticionario[e].email != '' && full.agravQuej[i].lPeticionario[e].tipoUsuario != '' && full.agravQuej[i].lPeticionario[e].fkSexo != 0 && full.agravQuej[i].lPeticionario[e].genero != ''
                        /*&& full.agravQuej[i].lPeticionario[e].nacionalidad != ''*/ && full.agravQuej[i].lPeticionario[e].sabeLeer != '' && full.agravQuej[i].lPeticionario[e].fkEscolaridad != '' && full.agravQuej[i].lPeticionario[e].fkEstadoConyugal != ''
                        && full.agravQuej[i].lPeticionario[e].fkOcupacion != '' && full.agravQuej[i].lPeticionario[e].fkDiscapacidad != '' && full.agravQuej[i].lPeticionario[e].fkGrupoSocial != '' && full.agravQuej[i].lPeticionario[e].hablaLenguai != '') {
                        if (full.agravQuej[i].lPeticionario[e].violenciaVm == 1 && full.agravQuej[i].lPeticionario[e].canalizacionVm != '' && full.agravQuej[i].lPeticionario[e].embarazadaVm != '' && full.agravQuej[i].lPeticionario[e].ingresosMensuales != ''
                            && full.agravQuej[i].lPeticionario[e].fkHijosVivos != '' && full.agravQuej[i].lPeticionario[e].fkModalidadViolencia != 6 && full.agravQuej[i].lPeticionario[e].fkTipoViolencia != 5 && full.agravQuej[i].lPeticionario[e].fkRelacionAgresor != 8) {
                            Cont++;
                        } else if (full.agravQuej[i].lPeticionario[e].violenciaVm == 0) {
                            Cont++;
                        }
                    }
                }
            }
        }
        if (Cont === full.agravQuej.length) { contador++; } else {
            estatus = estatus + 'Datos Personales <br>';
        }
    } else {
        estatus = estatus + 'Datos Personales <br>';
    }
    //FIN DE PETICIONARIO

    //ESCRITO INICIAL DE QUEJAS
    if (full.escritoia.length > 0) {//lEscritoI
        Cont = 0;
        for (var i = 0; i < full.escritoia.length; i++) {
            if (full.escritoia[i].lEscritoI.length > 0) {
                for (var e = 0; e < full.escritoia[i].lEscritoI.length; e++) {
                    if (full.escritoia[i].lEscritoI[e].peticionarios != '') {
                        let fecha_hechos = new Date(full.escritoia[i].lEscritoI[e].fechahd).toISOString().split("T")[0];
                        let hora_hechos = (full.escritoia[i].lEscritoI[e].fechahd).split("T")[1];
                        let ruta_adjuntoei = full.escritoia[i].lEscritoI[e].rutaarchivo;
                        if (full.escritoia[i].lEscritoI[e].peticionarios != '' && fecha_hechos != '' && hora_hechos != '' && full.escritoia[i].lEscritoI[e].estado != '' && full.escritoia[i].lEscritoI[e].circuns_Hechos != '') {
                            if (full.escritoia[i].lEscritoI[e].calle != '' || (full.escritoia[i].lEscritoI[e].numero_ext != '' && full.escritoia[i].lEscritoI[e].numero_ext != '0') || (full.escritoia[i].lEscritoI[e].numero_int != '' && full.escritoia[i].lEscritoI[e].numero_int != '0') || (full.escritoia[i].lEscritoI[e].cp != '' && full.escritoia[i].lEscritoI[e].cp != '0') || full.escritoia[i].lEscritoI[e].colonia != '') {
                                Cont++;
                            } else if (full.escritoia[i].lEscritoI[e].calle === '' || (full.escritoia[i].lEscritoI[e].numero_ext === '0' && full.escritoia[i].lEscritoI[e].numero_ext === '0') || (full.escritoia[i].lEscritoI[e].numero_int === '0' && full.escritoia[i].lEscritoI[e].numero_int === '0') || (full.escritoia[i].lEscritoI[e].cp === '0' && full.escritoia[i].lEscritoI[e].cp === '0') || full.escritoia[i].lEscritoI[e].colonia === '') {
                                Cont++;
                            }
                        }
                    }
                }
            }
            //$.ajax({
            //    type: "POST",
            //    url: "GetDataEscritoInicial",
            //    data: { identificadorQueja: full.escritoia[i].idEscrito },
            //    dataType: "JSON",
            //    async: false,
            //    success: function (response) {

            //    },
            //    error: function (error) {
            //        console.error("Error:", error);
            //    }
            //});
        }
        if (Cont === full.escritoia.length) {
            contador++;
        } else {
            estatus = estatus + 'Escrito Inicial <br>';
        }
    } else {
        estatus = estatus + 'Escrito Inicial <br>';
    }
    //FIN ESCRITO INICIAL DE QUEJAS

    if (full.viA_INTERPOSICION == "Telefónica" || full.viA_INTERPOSICION == "WhatsApp" || full.viA_INTERPOSICION == "Física") {
        viaInterpo = "CuatroFomat";
        //ACTA DE CIRCUNSTANCIAS
        if (full.actaCa.length > 0) {
            Cont = 0;
            for (var i = 0; i < full.actaCa.length; i++) {
                if (full.actaCa[i].status == 'completo') {
                    Cont++;
                }
                //$.ajax({
                //    type: "POST",
                //    url: "GetDataActaCircunstanciadaa",
                //    data: { identificadorActac: full.actaCa[i].idActac },
                //    dataType: "JSON",
                //    async: false,
                //    success: function (data) {

                //    },
                //    error: function (error) {
                //        console.error("Error:", error);
                //    }
                //});
            }
            if (Cont === full.actaCa.length) { contador++; } else {
                estatus = estatus + 'Acta de Ciscunstancias <br>';
            }
        }
        else {
            estatus = estatus + 'Acta de Ciscunstancias <br>';
        }
        // FIN DE ACTA DE CIRCUNSTANCIAS
    }
    estatus = estatus + '</div >';
    switch (viaInterpo) {
        case "CuatroFomat":
            if (contador === 4) {
                estatus = "Completo";
            }
            break;
        case "TresFomat":
            if (contador === 3) {
                estatus = "Completo";
            }
            break;
    }
    return estatus;
}
//metodo creado por GITP
function RecorreInput(form) {
    //console.log("Recorriendo input y select")
    $(form).find(":input, select").each(function () {
        var id = $(this).val()
        //var atributo = $(this).attr("id");//validaselectdac class
        //var propiedad = $(this).prop("class");
        //if (atributo === 'Input_LugarHechos') {
        //    console.log(atributo)
        //}
        if (id === "" || id === "99") {
            if ($(this).prop("type") !== 'search' && $(this).prop("type") !== 'button' && $(this).prop("type") !== 'submit'
                && $(this).attr("id") !== 'gpdfForm' && $(this).attr("id") !== 'Input_nombres1' && $(this).attr("id") !== 'Input_cargo1' && $(this).attr("id") !== 'visitaduriaqueja' && $(this).attr("id") !== 'observaciones' && $(this).attr("id") !== 'Input_autoridades1'
                && $(this).prop("placeholder") !== 'Cargar archivos') {
                $(this).css("background", "#E6B0AA")
            }
        }
    });
}

function mostrarResTblMemorandum(response, fecha = '') {
    //console.log(response)
    //console.log(fecha)

    tableMemorandum.DataTable({
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
        data: response,
        columns: [
            {
                "render": function (data, type, full, meta) {
                    return meta.row + 1;
                }

            },
            {
                'mRender': function (data, type, full) {

                    let inputTxt = '';
                    inputTxt = `<p> ${full.idExpediente} <p/>`;

                    return inputTxt;

                }

            },
            {
                'mRender': function (data, type, full) {

                    let inputTxt = '';
                    inputTxt = `
                    <input id="idexp" name="idexp" class="idexp" value=${full.idExpediente} hidden />
                    <input type="number" min="1" id="numfojas${full.idExpediente}" name="numfojas${full.idExpediente}" class="numfojas" value="${full.numFojas == 0 ? '' : full.numFojas}"  />
                    <p class="d-none" id="errorfojas${full.idExpediente}">Ingrese el número de fojas</p>`;

                    return inputTxt;

                }

            },
            {
                'mRender': function (data, type, full) {

                    let fecha_reg = new Date(fecha).toISOString().split("T")[0];

                    let inputTxt = '';
                    inputTxt = `<p> ${fecha_reg} <p/>`;

                    return inputTxt;

                }

            },
            {
                'mRender': function (data, type, full) {

                    let inputTxt = '';
                    inputTxt = `<input type="text" id="observacionesexp${full.idExpediente}" name="observacionesexp${full.idExpediente}" class="observacionesexp" value="${full.observaciones == 'Ninguna' ? '' : full.observaciones}"  />`;

                    return inputTxt;

                }

            }
        ],
        order: [[1, 'asc']],
        "bDestroy": true
    });


}

tableBuscadorFormatos.on('click', 'td.details-control', function () {

    var tr = $(this).closest('tr'),
        row = tableBuscadorFormatos.DataTable().row(tr);

    if (row.child.isShown()) {
        tr.next('tr').removeClass('details-row');
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        row.child(format(row.data())).show();
        tr.next('tr').addClass('details-row');
        tr.addClass('shown');
    }

    eliminarExpediente();
    activarBtnTurnopre();
});

function verMemoturno(idexpediente, idmemo, num_memo) {

    let frmMemo = new FormData();
    frmMemo.append('idexpediente', idexpediente)
    frmMemo.append('idmemo', idmemo)

    $.ajax({
        type: "POST",
        url: "GetDataMemorandum",
        data: frmMemo,
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (response) {
            //console.log(response)

            mostrarResTblMemorandum(response.data[0].lstExpturnados, '' + response.data[0].fechaDeCreacion + '');
            $('#titleModalmemo').text('Memorándum ' + num_memo);
            $('#idMemoupdate').val(idmemo);
            $('#modalMemorandumdqotsendexp').modal('show');
        }
    });

}

function btnGenerapdfmemo(element) {

    let idmemo = $('#idMemoupdate').val();
    window.open(Memorandumdqot + idmemo, '_blank');

}

function btnGenraBitacorCamb(exped) {
    window.open(CedBitacoraCambioPDF + exped, '_blank');
}

function btnUpdatememo(element) {
    let idmemo = $('#idMemoupdate').val();
    let filas = $('#tableMemoDqot').dataTable().fnGetNodes();
    let cont = 0;
    arrayExpMemo = [];

    $(filas).each(function () {

        let idexp = $(this).find('.idexp').val();
        let nfojas = $(this).find('#numfojas' + idexp).val();
        let observaciones = $(this).find('#observacionesexp' + idexp).val();

        if (nfojas == '') {
            let idElementnfojas = $(this).find('#numfojas' + idexp)[0].id;

            $('#errorfojas' + idexp).removeClass("d-none");
            $('#errorfojas' + idexp).css("color", "red");
            $('#' + idElementnfojas).focus();
            cont++;

        } else {
            arrayExpMemo.push({
                FkMemorandum: idmemo,
                IdExpediente: idexp,
                NumFojas: nfojas,
                Observaciones: observaciones == '' ? 'Ninguna' : observaciones
            });

            $('#errorfojas' + idexp).addClass("d-none");
        }

    });

    if (cont > 0) {
        return false;
    } else {
        // Se actualiza el memorandum con las fojas y las observaciones individuales por queja
        let frmUpdateMemo = new FormData();
        frmUpdateMemo.append('dataexpcomp', JSON.stringify(arrayExpMemo));

        $.ajax({
            type: "post",
            url: 'ActualizaMemorandumDqot',
            contentType: false,
            processData: false,
            data: frmUpdateMemo,
            dataType: "json",
            success: function (resp) {
                //console.log(resp)

                if (resp.data) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'La información ha sido actualizada correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocurrio un error al actualizar los datos, reporte el incidente al area de sistemas',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

            }
        });
    }

}


function ventana_acpeta_visitaduria(mensaje, idexpediente, peticionarios) {
    options = [];
    $.map(peticionarios,
        function (o) {
            options[idexpediente + "/" + o.fkRegRecepcion + "/" + o.idComplementoPeticionario + "/" + o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '')] = o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '');
        });

    Swal.fire({
        title: mensaje,
        input: 'select',
        inputOptions: options,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value !== '') {
                    resolve();
                } else {
                    resolve('Debes de Seleccionar un elemento');
                }
            });
        }
    }).then(function (result) {
        if (result.isConfirmed) {
            //console.log(result);
            Swal.fire({
                icon: 'success',
                html: 'La información del Peticionario Se ha cargado Correctamente: '
            });
            changeSelectPetActac(result.value);
        } else {
            $("#modalformularioActaCircunstanciada").modal("hide");
        }
    });
}


function ventana_eligepeticionario_ei(mensaje, idexpediente, peticionarios) {
    options = [];
    $.map(peticionarios,
        function (o) {
            options[idexpediente + "/" + o.fkRegRecepcion + "/" + o.idComplementoPeticionario + "/" + o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '')] = o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '');
        });

    Swal.fire({
        title: mensaje,
        input: 'select',
        inputOptions: options,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value !== '') {
                    resolve();
                } else {
                    resolve('Debes de Seleccionar un elemento');
                }
            });
        }
    }).then(function (result) {
        if (result.isConfirmed) {
            //console.log(result);
            Swal.fire({
                icon: 'success',
                html: 'La información del Peticionario Se ha cargado Correctamente: '
            });
            changePeticionarioselEi(result.value, idexpediente);
            RecorreInput('.formularioEscritoInicial');
        } else {
            $("#modalformularioEscritoInicial").modal("hide");
        }
    });
}

function changePeticionarioselEi(valors, idexpediente) {

    if (valors != '') {
        //console.log(valors)
        let valor = (valors).split('/');
        $('#Input_ID').val(idexpediente);
        $('#id_escritoigenerado').val(valor[0]);
        $('#ID_Peticionario').val(valor[1]);
        $('#Input_Peticionario2').val(valor[3]);
        $('#Input_Peticionario').val(valor[1] + '/' + valor[2]);
        $('#ID_CompPeticionario').val(valor[2]);

        $('#Input_ID').attr('readonly', true);
        $('#Input_Peticionario2').attr('readonly', true);
    }

}

function changeSelectPetActac(valors) {

    if (valors != '') {

        let valor = (valors).split('/');
        //console.log(valors);
        let FrmDataPet = new FormData();
        FrmDataPet.append('id_queja', valor[0]);
        FrmDataPet.append('id_peticionario', valor[1]);
        FrmDataPet.append('id_complemento', valor[2]);

        $('#idpeti').val(valor[1]);
        $('#idcompet').val(valor[2]);

        fetchPost("Expediente/DatosPeticionarioActac", "json", FrmDataPet, (resp) => {

            if (resp.status) {
                let p = resp.data[0];
                //console.log(p);

                $('#AutoridadesEI').val("------");
                $('#nombrePet').val(valor[3].toString().toLowerCase());
                $('#edadPet').val(p.edad.toLowerCase());
                $('#sabeleerPet').val(p.sabeLeer.toLowerCase());
                $('#escolaridadPet').val(p.nombreEscolaridad.toLowerCase());
                $('#callePet').val(p.calle.toLowerCase());
                $('#numextPet').val(p.numExterior.toLowerCase());
                $('#numintPet').val(p.numInterior.toLowerCase());
                $('#cpPet').val(p.codigoPostal.toLowerCase());
                $('#coloniaPet').val(p.colonia.toLowerCase());
                $('#municipioPet').val(p.municipio.toLowerCase());
                $('#estadoPet').val(p.estado.toLowerCase());
                $('#ocupacionPet').val(p.nombreOcupacion.toLowerCase());
                $('#telPet').val(p.telefono.toLowerCase());
                $('#correoPet').val(p.email.toLowerCase());
                $('#idpeticionarioelegido').val(p.fkRegRecepcion)

                document.querySelectorAll('.datapet').forEach(p => p.readOnly = true);

            } else {
                document.querySelectorAll('.datapet').forEach(p => p.value = '');
                document.querySelectorAll('.datapet').forEach(p => p.readOnly = true);

                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error al obtener los datos, reporte el error del sistema',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        });

    } else {
        document.querySelectorAll('.datapet').forEach(p => p.value = '');
        document.querySelectorAll('.datapet').forEach(p => p.readOnly = true);

        $('#' + this.id).notify(
            "Seleccione un peticionario",
            { position: "top left", autoHide: false }
        );
    }
}

function format(data) {

    let btnEliminar = '';
    let acta = '';
    let peticionarioslist = '';
    let peticionarios = JSON.stringify(data.agravQuej);
    let validafecha_modificaciondqot = validafechamodificacionDqot(data.expedienteTurno[0].fechaturnovisitaduria, data.expedienteTurno[0].fechaFinDqot);
    let iconadd = '';
    let iconaddActac = '';

    if (validafecha_modificaciondqot === false) {
        iconadd += `<button type='button' title='Agregar nuevo quejoso' onclick='AddFormatDatosPersonales(${data.fkExpediente},${peticionarios} )' class='btn btn - link margin - iconbf'>
                               <span class='fa fa-user-plus color-muted fa-2x'></span >
                                </button >`;
        iconaddActac += `<button type='button' title='Agregar Acta Circunstanciada' onclick='AddActac(${data.fkExpediente}, ${data.escritoia.length > 0 ? data.escritoia[0].idEscrito : 1}, ${peticionarios})' class='btn btn - link margin - iconbf'>
                                               <img src="../icons/personalizados/add-file.png" height="40"/>
                                </button > <br>`;
    }

    if (data.status_Expediente != 'Eliminado') {
        btnEliminar = `<button type="button" class="btn eliminaExpediente btn-rounded btn-danger" style="background-color: red !important;" value="${data.fkExpediente}"><span class="btn-icon-left text-danger"><i style="color: white;" class="fa fa-trash color-danger fa-2x"></i>
                     </span> Eliminar ID</button>`;
    }

    if (data.agravQuej.length > 0) {
        for (var i = 0; i < data.agravQuej.length; i++) {
            if ((data.status_Expediente == 'Eliminado')) {
                peticionarioslist += `
                              <label>${data.agravQuej[i].nombre} ${data.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${data.agravQuej[i].apellidoMat.replace("No Proporcionado", '') } (${data.agravQuej[i].tipoUsuario})</label> <br/> 
                              <button type='button' title='Ver quejoso' onclick='editFormatDatosPersonales(${data.agravQuej[i].fkRegRecepcion} , ${data.agravQuej[i].idComplementoPeticionario},"${data.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-search color-muted fa-2x'></span>
                               </button>`;
            } else {
                peticionarioslist += `
                              <label>${data.agravQuej[i].nombre} ${data.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${data.agravQuej[i].apellidoMat.replace("No Proporcionado", '') } (${data.agravQuej[i].tipoUsuario})</label> <br/>
                              <button type='button' title='Editar quejoso' onclick='editFormatDatosPersonales(${data.agravQuej[i].fkRegRecepcion} , ${data.agravQuej[i].idComplementoPeticionario},"${data.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-pencil color-muted fa-2x'></span>
                               </button>
                              <button type='button' title='Eliminar quejoso' onclick='eliminaFormatoDatosPeronsales(${data.agravQuej[i].idComplementoPeticionario}, this)' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-trash color-danger fa-2x'></span>
                              </button>  <br/> `;
            }
        }
    }

    if (data.actaCa.length > 0) {
        for (var i = 0; i < data.actaCa.length; i++) {

            if ((data.status_Expediente == 'Eliminado')) {
                acta += `<p>Acta Circunstanciada ${i + 1}</p>
                            <button type='button' title='Ver Acta Circunstanciada' onclick='traeInformacionActaC(${data.actaCa[i].idActac},"${data.status_Expediente}", "${data.escritoia.length > 0 ? data.escritoia[0].idEscrito : 1}","${data.fkExpediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-search color-muted fa-2x'></span>
                            </button>`;
            } else {
                acta += `<p>Acta Circunstanciada ${i + 1}</p>
                            <button type='button' title='Editar Acta Circunstanciada' onclick='traeInformacionActaC(${data.actaCa[i].idActac},"${data.status_Expediente}", "${data.escritoia.length > 0 ? data.escritoia[0].idEscrito : 1}","${data.fkExpediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-pencil color-muted fa-2x'></span>
                            </button>
                            <button type='button' title='Eliminar Acta Circunstanciada' onclick='eliminarActac(${data.actaCa[i].idActac}, ${'"' + data.actaCa[i].nombre_petligado + '"'})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-trash color-danger fa-2x'></span>
                            </button> <br/>`;
            }
        }
    }

    if (data.agravQuej.length == 1 && data.status_Expediente != 'Eliminado') {
        if (data.actaCa.length > 1) {
            return `<table style="min-width: 100%; width: 1509px;">
		    <thead>
			    <tr>
				    <th>Acta Circunstanciada</th>
                    <th></th>
			    </tr>
		    </thead>
		    <tbody>

			    <tr id="datosextra">
                    <td id="Contenedor_Actas">${acta}</td>
                    <td></td>
			    </tr>
			    <tr>
                    <td>${iconaddActac}</td>
				    <td style="text-align: end;"> ${btnEliminar} </td>  
			    </tr>
		    </tbody>
	    </table>`;
        }
        else {
            return `<table style="min-width: 100%; width: 1509px;">
		        <thead></thead>
		        <tbody>
			        <tr>
				        <td style="text-align: end;"> ${btnEliminar} </td>  
			        </tr>
		        </tbody>
	        </table>`;
        }
    }
    else if (data.agravQuej.length == 1 && data.status_Expediente == 'Eliminado') {
        if (data.actaCa.length > 1) {
            return `<table style="min-width: 100%; width: 1509px;">
		        <thead>
			    <tr>
				    <th>Acta Circunstanciada</th>
			    </tr>
		        </thead>
		        <tbody>

			    <tr id="datosextra">
                    <td id="Contenedor_Actas">${acta}</td>
			    </tr>
		        </tbody>
	            </table>`;
        }

    }
    else if (data.agravQuej.length > 1 && data.status_Expediente != 'Eliminado') {
        if (data.actaCa.length < 2) {
            return `<table style="min-width: 100%; width: 1509px;">
		    <thead>
			    <tr>
				    <th>Formato de datos<br>personales</th>
                   <th></th>
			    </tr>
		    </thead>
		    <tbody>

			    <tr id="datosextra">
				    <td>${peticionarioslist}</td>
                    <td></td>
			    </tr>
			    <tr>
				    <td>${iconadd}</td>
                   
				    <td style="text-align: end;">
                     ${btnEliminar}
                    </td>
                    
			    </tr>
		    </tbody>
	    </table>`;
        }
        else {
            return `<table style="min-width: 100%; width: 1509px;">
		    <thead>
			    <tr>
				    <th>Formato de datos<br>personales</th>
				    <th>Acta Circunstanciada</th>
                    <th></th>
			    </tr>
		    </thead>
		    <tbody>

			    <tr id="datosextra">
				    <td>${peticionarioslist}</td>
                    <td id="Contenedor_Actas">${acta}</td>
                    <td></td>
			    </tr>
			    <tr>
				    <td>${iconadd}</td>
				    <td>${iconaddActac}</td>
                   
				    <td style="text-align: end;">
                     ${btnEliminar}
                    </td>
                    
			    </tr>
		    </tbody>
	    </table>`;
        }
    }
    else if (data.agravQuej.length > 1 && data.status_Expediente == 'Eliminado') {
        if (data.actaCa.length < 1) {
            return `<table style="min-width: 100%; width: 1509px;">
		    <thead>
			    <tr>
				    <th>Formato de datos<br>personales</th>
			    </tr>
		    </thead>
		    <tbody>

			    <tr id="datosextra">
				    <td>${peticionarioslist}</td>
			    </tr>
			     
		    </tbody>
	    </table>`;
        }
        else {
            return `<table style="min-width: 100%; width: 1509px;">
		    <thead>
			    <tr>
				    <th>Formato de datos<br>personales</th>
				    <th>Acta Circunstanciada</th>
				    
			    </tr>
		    </thead>
		    <tbody>

			    <tr id="datosextra">
				    <td>${peticionarioslist}</td>
                    <td id="Contenedor_Actas">${acta}</td>
			    </tr>
			     
		    </tbody>
	    </table>`;
        }
    }

    return;
};

function eliminarExpediente() {
    $('.eliminaExpediente').click(function (e) {
        e.preventDefault();

        let idexpediente = this.value;

        swal.fire({
            title: "¿Desea eliminar el expediente?",
            input: "textarea",
            inputPlaceholder: "Ingrese el motivo por el cual desea eliminar el expediente",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Enviar ",
            allowOutsideClick: false,
            inputValidator: function (value) { // validates your input
                return new Promise(function (resolve, reject) {
                    if (value != '' && value != null) {


                        let FrmDelExp = new FormData();
                        FrmDelExp.append('id_expediente', idexpediente);
                        FrmDelExp.append('motivo', value);

                        fetchPost("Expediente/DeleteExpediente", "json", FrmDelExp, (resp) => {
                            //console.log(resp)

                            if (resp.status) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Expediente eliminado',
                                    showConfirmButton: false,
                                    timer: 1500
                                }).then(() => {
                                    Swal.fire({
                                        text: 'Cargando Quejas...',
                                        didOpen: () => {
                                            Swal.showLoading();
                                        },
                                        allowOutsideClick: false,
                                        allowEscapeKey: false
                                    });
                                    $.ajax({
                                        type: "POST",
                                        url: "BuscardorFormatos",
                                        data: $('#frm_busquedaFormatos').serialize(),
                                        dataType: "JSON",
                                        success: function (response) {
                                            mostrarResTblFormatos(response.data);
                                            $('#tableEditFormatosDqot td:last-child:contains(1)').parents("tr").css("background-color", "#f5b8b5 !important");
                                            Swal.close();
                                        },
                                        error: function () {
                                            Swal.close();
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error',
                                                text: 'Error al actualizar los datos, informe al área de sistemas'
                                            });
                                        }
                                    });
                                });

                            } else {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: 'Error al eliminar el expediente, informe al área de sistemas',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        });

                    }
                    else {

                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Debe ingresar el motivo por el cual va a eliminar el expediente',
                            showConfirmButton: true,
                            timer: 1500
                        })
                    }
                });
            }
        })


    });
}
function eliminarActac(Actacc, nombrepetligado) {

    //console.log(Actacc)
    //console.log(nombrepetligado)
    swal.fire({
        title: 'Eliminar Acta Circunstanciada',
        text: "¿Desea eliminar esta acta ligado al peticionario " + nombrepetligado + "?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false
    }).then(function (resp) {
        if (resp.isConfirmed) {

            let FrmDelActac = new FormData();
            FrmDelActac.append('id_actac', Actacc);

            fetchPost("Expediente/DeleteActac", "json", FrmDelActac, (resp) => {
                //console.log(resp)

                if (resp.status) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Acta circunstanciada eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        Swal.fire({
                            text: 'Cargando Quejas...',
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                        $.ajax({
                            type: "POST",
                            url: "BuscardorFormatos",
                            data: $('#frm_busquedaFormatos').serialize(),
                            dataType: "JSON",
                            success: function (response) {
                                mostrarResTblFormatos(response.data);
                                Swal.close();
                            },
                            error: function () {
                                Swal.close();
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al actualizar los datos, informe al área de sistemas'
                                });
                            }
                        });
                    });

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error al eliminar el acta circunstanciada, informe al área de sistemas',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            });

        }
    })


}
////CRIS
//function eliminarActac(id) {
//        let idexpediente = id;
//        let FrmDelExp = new FormData();
//        FrmDelExp.append('id_acta', idexpediente);
//        Swal.fire({
//            title: '¿Estas Seguro que deseas eliminar esta Acta Circunstanciada?',
//            text: "No podrá ser revertido!",
//            icon: 'warning',
//            showCancelButton: true,
//            confirmButtonColor: '#3085d6',
//            cancelButtonColor: '#d33',
//            confirmButtonText: 'SI'
//        }).then((result) => {
//            if (result.isConfirmed) {
//                fetchPost("Expediente/DeleteActaC", "json", FrmDelExp, (resp) => {
//                    console.log(resp)

//                    if (resp.status) {
//                        Swal.fire({
//                            position: 'top-center',
//                            icon: 'success',
//                            title: 'Acta Circunstanciada eliminada',
//                            showConfirmButton: false,
//                            timer: 1500
//                        })

//                        $.ajax({
//                            type: "POST",
//                            url: "BuscardorFormatos",
//                            data: $('#frm_busquedaFormatos').serialize(),
//                            dataType: "JSON",
//                            success: function (response) {
//                                mostrarResTblFormatos(response.data);
//                            }
//                        });
//                    }
//                });
//            }
//        })
//}


function eliminarEscrito(id, nombrepetligado, idqueja) {
    let idexpediente = id;
    let FrmDelExp = new FormData();
    FrmDelExp.append('id_escrito', idexpediente);
    FrmDelExp.append('id_queja', idqueja);
    Swal.fire({
        title: '¿Estas Seguro que deseas eliminar este Escrito ligado a ' + nombrepetligado + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
    }).then((result) => {
        if (result.isConfirmed) {
            fetchPost("Expediente/DeleteEscrito", "json", FrmDelExp, (resp) => {
                //console.log(resp)

                if (resp.status) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Escrito eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        Swal.fire({
                            text: 'Cargando Quejas...',
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                        $.ajax({
                            type: "POST",
                            url: "BuscardorFormatos",
                            data: $('#frm_busquedaFormatos').serialize(),
                            dataType: "JSON",
                            success: function (response) {
                                mostrarResTblFormatos(response.data);
                                Swal.close();
                            },
                            error: function () {
                                Swal.close();
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al actualizar los datos, informe al área de sistemas'
                                });
                            }
                        });
                    });
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'No se puede eliminar el escrito porque esta ligado a una acta circunstanciada',
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            });
        }
    })
}

function traeInformacionActaC(idActaC, estatus, idescrito, idqueja, fechavalidaeditdqot) {
    let iformActaCircunstanciada = formActacircunstanciada2c();
    $('.formularioActaCircunstanciada').empty()
    $('.formularioActaCircunstanciada').append(iformActaCircunstanciada);
    $(`#anio`).val(2024);
    $("#origenPetExt").css("display", "none");
    $("#origenPetExtedo").css("display", "none");

    Carga_Informacion_selec_quejas().then(() => {
        $.ajax({
            type: "POST",
            url: "GetDataActaCircunstanciada",
            data: { identificadorActac: idActaC },
            dataType: "JSON",
            success: function (response) {
                var longitud = response.data.length;
                if (response.data.length > 0) {
                    var idMunicipio = parseInt(response.data[0].lugar);
                    let fechahechos = response.data[0].fechaHechos.split(' ');

                    $("input[name='diaFecha']").val(response.data[0].diaFecha);
                    $('#mes > option[value="' + response.data[0].mes + '"]').attr('selected', 'selected');
                    $('#anio > option[value="' + response.data[0].anio + '"]').attr('selected', 'selected');
                    $("input[name='horaInicio']").val(response.data[0].horaInicio);
                    $("input[name='idactac']").val(response.data[0].id);
                    $("input[name='ubicacion']").val(response.data[0].ubicacion);
                    $("input[name='nombrePet']").val(response.data[0].nombrePet);
                    $("input[name='idpeti']").val(response.data[0].idPet);
                    $("input[name='idcompet']").val(response.data[0].complementoPeticionario);
                    $('#consentimiento > option[value="' + response.data[0].consentimiento + '"]').attr('selected', 'selected');
                    $("input[name='edadPet']").val(response.data[0].edadPet);
                    $("input[name='escolaridadPet']").val(response.data[0].escolaridadPet);
                    $("input[name='sabeleerPet']").val(response.data[0].sabePet);
                    $("input[name='callePet']").val(response.data[0].callePet);
                    $("input[name='numextPet']").val(response.data[0].numextPet);
                    $("input[name='numintPet']").val(response.data[0].numextPet);
                    $("input[name='cpPet']").val(response.data[0].cpPet);
                    $("input[name='coloniaPet']").val(response.data[0].coloniaPet);
                    $("input[name='municipioPet']").val(response.data[0].municipioPet);
                    $("input[name='estadoPet']").val(response.data[0].estadoPet);
                    $("input[name='ocupacionPet']").val(response.data[0].ocupacionPet);
                    $("input[name='telPet']").val(response.data[0].telPet);
                    $("input[name='correoPet']").val(response.data[0].correoPet);
                    $('#identificacionPet > option[value="' + response.data[0].identificacionPet + '"]').attr('selected', 'selected');
                    $("input[name='fechaHechos']").val(fechahechos[0]);
                    $("input[name='horaHechos']").val(response.data[0].horaHechos);
                    $("input[name='ubiHechos']").val(response.data[0].ubiHechos);
                    $('#catMunicipio_hechos > option[value="' + response.data[0].identificacionPet + '"]').attr('selected', 'selected');
                    
                    $('#catAutoridad > option[value="' + response.data[0].identificacionPet + '"]').attr('selected', 'selected');
                    $("textarea[name='hechos']").val(response.data[0].hechos);
                    $("input[name='horaTermino']").val(response.data[0].horaTermino);
                    $("input[name='idescritoim']").val(idescrito);
                    $("input[name='idqueja']").val(idqueja);
                    $("input[name='idactaedit']").val(idActaC);
                    $('#lugar').select2();
                    $('#origenPet').select2();
                    $('#catEstado_hechos').select2();
                    $('#lugar').val(idMunicipio).trigger('change');
                    $('#origenPet').val(response.data[0].origenPet).trigger('change');
                    $('#catEstado_hechos').val(response.data[0].identificacionPet).trigger('change');
                    //$('#catEstado_hechos > option[value="' + response.data[0].identificacionPet + '"]').attr('selected', 'selected');
                    $("#Input_autoridades option:contains('" + response.data[0].autoridad + "')").attr("selected", "true");
                    if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar' || fechavalidaeditdqot === true) {
                        $('#modalformularioActaCircunstanciada button[type="button"]').hide();
                    }
                    var autoridades = '';
                    for (var i = 0; i < response.data1.length; i++) {
                        autoridades = autoridades + response.data1[i] + ' - ';
                    }
                    $("input[name='AutoridadesEI']").val(autoridades);

                    $("#modalformularioActaCircunstanciada").modal("show");

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Datos no encontrados, verifique que exista un escrito Inicial dentro de la queja',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    return;
                }
                RecorreInput('.formularioActaCircunstanciada');
            }
        });
    }).catch((error) => {
        console.error("Error al cargar la información de quejas:", error);
    });
}


function AddActac(idExpediente, idescritoi, peticionarios) {

    //console.log(peticionarios)
    let iformActaCircunstanciada = formActacircunstanciada2c();
    $('.formularioActaCircunstanciada').empty();
    $('.formularioActaCircunstanciada').append(iformActaCircunstanciada);
    $(`#anio`).val(2024);
    ventana_acpeta_visitaduria('Selecciona el peticionario para continuar', idExpediente, peticionarios);
    $('#idescritoim').val(idescritoi)
    Carga_Informacion_selec_quejas();
    $('#lugar').select2();
    $('#origenPet').select2();
    $('#catEstado_hechos').select2();
    $('#Input_autoridades').select2();
    $("#origenPetExt").css("display", "none");
    $("#origenPetExtedo").css("display", "none");
    $('#idqueja').val(idExpediente);
    $("#modalformularioActaCircunstanciada").modal("show");
    RecorreInput('.formularioActaCircunstanciada');
}

function eliminaActac(Actacc, nombrepetligado) {

    //console.log(Actacc)
    //console.log(nombrepetligado)
    swal.fire({
        title: 'Eliminar Acta Circunstanciada',
        text: "¿Desea eliminar esta acta ligado al peticionario " + nombrepetligado + "?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false
    }).then(function (resp) {
        if (resp.isConfirmed) {

            let FrmDelActac = new FormData();
            FrmDelActac.append('id_actac', Actacc);

            fetchPost("Expediente/DeleteActac", "json", FrmDelActac, (resp) => {
                //console.log(resp)

                if (resp.status) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Acta circunstanciada eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        Swal.fire({
                            text: 'Cargando Quejas...',
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                        $.ajax({
                            type: "POST",
                            url: "BuscardorFormatos",
                            data: $('#frm_busquedaFormatos').serialize(),
                            dataType: "JSON",
                            success: function (response) {
                                mostrarResTblFormatos(response.data);
                                Swal.close();
                            },
                            error: function () {
                                Swal.close();
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al actualizar los datos, informe al área de sistemas'
                                });
                            }
                        });
                    });

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error al eliminar el acta circunstanciada, informe al área de sistemas',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            });

        }
    })


}

function formActacircunstanciada2c
    () {

    var idUser = $("#idusuario").val();
    var Area = $("#areaUser").val();
    var Cargo = $("#cargoUser").val();

    //console.log("ID_USER:" + idUser);
    //console.log("AREA_USER:" + Area);
    //console.log("CARGO_USER:" + Cargo);
    var arregloBlanco = [];
    let numfrm = 1;

    var formInnicial = `<form class="text-justify form_acta" data-nformac=${numfrm} id="formActa${numfrm}" name="formActa${numfrm}" method="post" style="width:90%; margin-left:5%" >`;
    var cuerpo =
        //CreaInputs_Con_Label('lugar', 'lugar', '', 'text', 'En', 'textfield2')
        CreaSelectLabel('lugar', '', arregloBlanco, '', 'En', '', 'validaselectdac')
        + CreaInputs_Con_Label('diaFecha', 'diaFecha', 'validanumerosac', 'number', ', a los', 'textfield', 'mes')
        + CreaSelectLabel('mes', '', arregloMeses(), '', 'días del mes de', 'textfield4', 'validaselectdac')
        + CreaSelectLabeldisabled('anio', '', arregloAnio(), '', 'de', 'textfield4', 'validaselectdac')
        //+ CreaInputs_Con_Label('nomAbogado', 'nomAbogado', '', 'text', ', , licenciado', 'textfield5', 'placeholder="nombre de abogado"')
        + CreaSelectLabel('nomAbogado', '', arregloBlanco, '', ', el/la suscrito/a, abogado/a', '', 'validaselectdac')
        + CreaInputs_Con_Label('puestoAbogado', 'puestoAbogado', '', 'text', ', en mi carácter de', 'textfield6', 'placeholder="cargo de abogado" value="' + Cargo + '" disabled')
        + CreaInputs_Con_Label('areaAbogado', 'areaAbogado', '', 'text', ', de la', 'textfield7', 'placeholder="área de abogado" value="' + Area + '" disabled')
        + Crea_Label('textfield8', 'textfield8', '', 'de la Comisión de Derechos Humanos del Estado de Puebla, con la fe pública que me confiere el artículo 21 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, así como 30, 37, y 39 de su Reglamento Interno, publicados en el Periódico Oficial del Estado, respectivamente')
        + Crea_LabelCentro('textfield8', 'textfield8', '', '<b>CERTIFICO:</b>')
        + CreaInputs_Con_Label('horaInicio', 'horaInicio', 'validatimeac', 'time', 'Que siendo las', 'textfield9', '')
        + CreaInputs_Con_Label('ubicacion', 'ubicacion', 'validatxtac', 'text', 'horas del día del día en que se actúa, me constituí en', 'textfield10', 'placeholder="lugar de entrevista"')
        + CreaInputs_Con_Label('nombrePet', 'nombrePet', '', 'text', ', donde atendí a quien dijo llamarse', 'textfield10', 'placeholder="nombre de peticionario"')
        + CreaSelectLabel('consentimiento', '', SeleccionMultiple(), '', 'ante quien una vez que me identifiqué plenamente como servidor público adscrito a este Organismo Autónomo, con la respectiva identificación que esta Comisión de Derechos Humanos del Estado de Puebla me expidió, se le hizo de su conocimiento el motivo de la diligencia, se le solicitó su autorización para ser entrevistado, expresando que', '', 'validaselectdac')
        //+ CreaInputs_Con_Label('origenPet', 'origenPet', '', 'text', 'otorga su consentimiento para llevar a cabo la entrevista, por lo que se le exhortó para que se conduzca con verdad ante el personal de la Comisión de Derechos Humanos del Estado de Puebla, comprometiéndose así hacerlo y al respecto <strong>MANIFESTÓ: </strong>Llamarse como ha quedado escrito, ser originario de', 'textfield10', 'placeholder="origen de peticionario"')
        + CreaSelectLabel('origenPet', '', arregloBlanco, '', 'otorga su consentimiento para llevar a cabo la entrevista, por lo que se le exhortó para que se conduzca con verdad ante el personal de la Comisión de Derechos Humanos del Estado de Puebla, comprometiéndose así hacerlo y al respecto <strong>MANIFESTÓ: </strong>Llamarse como ha quedado escrito, ser originario de', '', 'validaselectdac')
        + CreaSelectLabel('origenPetExt', '', arregloBlanco, '', '', '', 'validaselectdac')
        + CreaInputs_Con_Label('origenPetExtedo', 'origenPetExtedo', '', 'text', '', 'textfield', '')
        + CreaInputs_Con_Label('edadPet', 'edadPet', '', 'number', 'de', 'textfield10', 'placeholder="edad de peticionario"')
        + CreaInputs_Con_Label('sabeleerPet', 'sabeleerPet', '', 'text', 'años de edad, que', '', 'placeholder="sabe leer"')
        + CreaInputs_Con_Label('escolaridadPet', 'escolaridadPet', '', 'text', ', sabe leer y escribir por haber cursado hasta ', 'textfield10', 'placeholder="escolaridad"')
        + CreaInputs_Con_Label('callePet', 'callePet', '', 'text', ', con el domicilio ubicado en ', 'textfield10', 'placeholder="calle"')
        + CreaInputs_Con_Label('numextPet', 'numextPet', '', 'text', '', '', 'placeholder="número exterior"')
        + CreaInputs_Con_Label('numintPet', 'numintPet', '', 'text', '', '', 'placeholder="número interior"')
        + CreaInputs_Con_Label('cpPet', 'cpPet', '', 'text', '', '', 'placeholder="código postal"')
        + CreaInputs_Con_Label('coloniaPet', 'coloniaPet', '', 'text', '', '', 'placeholder="colonia"')
        + CreaInputs_Con_Label('municipioPet', 'municipioPet', '', 'text', '', '', 'placeholder="municipio"')
        + CreaInputs_Con_Label('estadoPet', 'estadoPet', '', 'text', '', '', 'placeholder="estado"')
        + CreaInputs_Con_Label('ocupacionPet', 'ocupacionPet', '', 'text', 'de ocupación', 'textfield10', 'placeholder="ocupación de peticionario"')
        + CreaInputs_Con_Label('telPet', 'telPet', '', 'text', 'con número de teléfono', 'textfield10', 'placeholder="telefono de peticionario"')
        + CreaInputs_Con_Label('correoPet', 'correoPet', '', 'text', ', correo electrónico,', 'textfield10', 'placeholder="correo de peticionario"')
        + CreaSelectLabel('identificacionPet', '', arregloIdentificación(), '', 'identificándose ante el/la suscrito/a con', '', 'validaselectdac')
        + Crea_LabelCentro('textfield11', 'textfield11', '', 'y en relación a los hechos de la queja que nos ocupa, <strong>DECLARO:</strong><br>')
        + CreaInputs_Con_Label('fechaHechos', 'fechaHechos', 'validadateac', 'date', 'Que el día', 'textfield10', '')
        + CreaInputs_Con_Label('horaHechos', 'horaHechos', 'validatimeac', 'time', 'a las', 'textfield10', '')
        + CreaInputs_Con_Label('ubiHechos', 'ubiHechos', 'validatxtac', 'text', 'estando en', 'textfield10', 'placeholder="lugar de hechos"')
        //+ CreaSelectLabel('catMunicipio_hechos', '', arregloMun(), '', 'ubicado en el municipio de', '', 'validaselectdac')
        /*+ CreaSelectLabel('catEstado_hechos', '', arreglo_Estados(), '', 'del estado de ', '', 'validaselectdac')*/
        //+ CreaSelectLabel('catAutoridad', '', arregloEstado(), '', ', la(s) autoridad(es)', '')
        + CreaInputs_Con_Label('AutoridadesEI', 'AutoridadesEI', '', 'text', 'la(s) autoridad(es)', 'textfield10', 'placeholder="Autoridades" style = "width:100%"')
        + CreaTextArea('hechos', 'validanovacioac', 'style="width:100%"')
        + CreaInputs_Con_Label('horaTermino', 'horaTermino', 'validatimeac', 'time', 'dando por terminada la presente actuación a  las', 'textfield10', '')
        + CreaInputs_Con_Label('', '', 'inputac', 'text', 'horas.', 'textfield10', 'hidden', '')
        + Crea_LabelCentro('textfield12', 'textfield12', '', 'Hago constar lo anterior de conformidad con lo establecido en los numerales 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla para los efectos correspondientes----------------------------------<b>DOY FE.</b> ')
        + crea_Boton('button', 'Previsualizar PDF', 'generaPDFActaC', 'btn btn-pinterest', 'GeneraActaC_pdf()')
        + crea_Boton('button', 'Guardar', 'saveActaC', 'btn btn-success', 'GeneraActaCircunstanciada()')
        + CreaInputs('idabogado', 'idabogado', '', 'hidden')
        + CreaInputs('idpet', 'idpet', '', 'hidden')
        + CreaInputs('idconsentimiento', 'idconsentimiento', '', 'hidden')
        + CreaInputs('idcredencial', 'idcredencial', '', 'hidden')
        + CreaInputs('idEscrito_', 'idEscrito_', '', 'hidden')
        + CreaInputs('id_lugar', 'id_lugar', '', 'hidden')
        + CreaInputs('id_mes', 'id_mes', '', 'hidden')
        + CreaInputs('id_anio', 'id_anio', '', 'hidden')
        + CreaInputs('anioND', 'anioND', '', 'hidden')
        + CreaInputs('origenPetval', 'origenPetval', '', 'hidden')
        + CreaInputs('origenPetvalExt', 'origenPetvalExt', '', 'hidden')
        + CreaInputs('idactac', 'idactac', '', 'hidden')
        + CreaInputs('idqueja', 'idqueja', '', 'hidden')
        + CreaInputs('idcompet', 'idcompet', '', 'hidden')
        + CreaInputs('idpeti', 'idpeti', '', 'hidden')
        + CreaInputs('idescritoim', 'idescritoim', '', 'hidden')
        + CreaInputs('idactaedit', 'idactaedit', '', 'hidden');

    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpo + fin_form;

    return formualarioCompleto;
}

function chkNoproporcinado() {
    $(".noproporcionado").change(function () {
        let infrm = '#' + this.dataset.infrm;
        if (this.checked) {
            $(infrm).val('No proporcionado');
            $(infrm).prop('readonly', true);
        } else {
            $(infrm).val('');
            $(infrm).prop('readonly', false);
        }
    })

    $(".radiosnvm").change(function () {
        let idfrm = this.dataset.idfrmit;
        //console.log(this.value)
        if (this.value == 'Si') {
            document.querySelectorAll('.frmviolenciam' + idfrm).forEach(p => p.classList.remove("dis-none"));
            $('.frmviolenciam' + idfrm + ' input[type=text]', '.frmviolenciam' + idfrm + ' select').each(function () {
                $(this).attr('required', true)
            });
            $('.viomujer').each(function () {
                //console.log(this)
                $(this).attr('required', true)
            })
        } else if (this.value == 'No') {
            document.querySelectorAll('.frmviolenciam' + idfrm).forEach(p => p.classList.add("dis-none"));
            document.querySelectorAll('.frmviolenciam' + idfrm).forEach(p => p.value = "");
            $('.frmviolenciam' + idfrm + ' input[type=text]').each(function () {
                $(this).attr('required', false)
            })
            $('.viomujer').each(function () {
                $(this).attr('required', false)
            })
        }

    })

    $(".radextrsn").change(function () {
        let idfrm = this.dataset.idfrmit;
        //console.log(this.value)
        if (this.value == 'Extranjero') {
            document.querySelectorAll('.frmextrsnwno' + idfrm).forEach(
                p => p.classList.remove("dis-none")
            );
        } else if (this.value == 'Mexicano' || this.value == 'No proporcionado') {
            document.querySelectorAll('.frmextrsnwno' + idfrm).forEach(
                p => p.classList.add("dis-none")
            );
        }
    })

}
function seltxt() {
    document.querySelectorAll('input[type=text]').forEach(node => node.addEventListener('keypress', e => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }));

    $('.seltxt').change(function () {
        let inotro = '#' + this.dataset.selidotro;
        let valtxt = $(this).find("option:selected").text();
        //console.log(valtxt)

        if (valtxt.trim() === 'Otro' || valtxt.trim() === 'Si') {
            //console.log(inotro)
            $(inotro).prop('disabled', false);
            $(inotro).removeClass("d-none");
        } else {
            $(inotro).prop('disabled', true);
            $(inotro).addClass("d-none")
        }
    })
}
// Buscar informacion sobre cp
function keypresscp() {
    $(document).on('keypress', ".buscacp", function (e) {
        if (e.which == 13) {
            let idfrm = this.dataset.idfrmit;
            let estado = '';
            let municipio = '';

            $.getJSON("https://api.copomex.com/query/info_cp/" + this.value + "?type=simplified&token=pruebas", function (copomex) {
                estado = copomex.response.estado;
                municipio = copomex.response.municipio;
                $("#municipio_petit-frmDatosPersonales" + idfrm).val(municipio);
                $("#estado_petit-frmDatosPersonales" + idfrm).val(estado);
                $("#cp_petit-frmDatosPersonales" + idfrm).val(copomex.response.cp);
                AgregarOptionSelect(idfrm, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idfrm, copomex.response.asentamiento);
            }).done(function () {

                $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=pruebas", function (copomex) {
                    let localidadaes = Object.keys(copomex.response.localidad_clave);
                    AgregarOptionSelect(idfrm, 'deloptionloca', '#ciudad_petit-frmDatosPersonales' + idfrm, localidadaes);
                }).fail(function () { console.log('Ha ocurrido un error en obtener las localidades') });

            }).fail(function () { console.log('Ha ocurrido un error al obtener datos de un cp') });

        }
    });
}
function editFormatDatosPersonales(idregistro, idcomplemento, estatus, validafechamodificacion) {

    let formPetitn = formPeticionario(1)
    $('.frmEditDatosPersonales').append(formPetitn);
    chkNoproporcinado();
    seltxt();
    keypresscp();
    fetchGet("Expediente/SelectPaises", "json", (data) => {
        let Paises = data.relacionpaises;
        //console.log(Paises)
        AgregarOptionSelectPais(1, 'dellistpaiseso', '#migorig_petit-frmDatosPersonales1', Paises);
        AgregarOptionSelectPais(1, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales1', Paises);
    })

    let idform = 1;
    let curpd = '';
    let nombrep = '';
    let apellidope = '';
    let apellidome = '';
    let violenciamujer = '';

    $.ajax({
        type: "POST",
        url: "GetDataPeticionario",
        data: { curp: curpd, nombre: nombrep, apellidop: apellidope, apellidom: apellidome, idcomp: idcomplemento },
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            $("#idquejagenerado").removeAttr("hidden");
            $("#idquejagenerado").attr('value', response.data[0].idExpediente);
            $("#idquejagenerado").attr("hidden","hidden");
            if (response.data.length > 0) {
               
                console.log("Expediente:"+response.data[0].idExpediente);
                $("#idcomplementopet1").val(idcomplemento)
                $('#idpeticionarioi1').val(idregistro);
                $('#versioncomplementopeticionario').val('D');
                $("#CURP_petit-frmDatosPersonales" + idform).val(response.data[0].docIdentificatorio)
                $("#nombre_petit-frmDatosPersonales" + idform).val(response.data[0].nombre)
                $("#apellidop_petit-frmDatosPersonales" + idform).val(response.data[0].apellidoPat)
                $("#apellidom_petit-frmDatosPersonales" + idform).val(response.data[0].apellidoMat)
                $("#calle_petit-frmDatosPersonales" + idform).val(response.data[0].calle)
                $("#nexterior_petit-frmDatosPersonales" + idform).val(response.data[0].numExterior)
                $("#ninterior_petit-frmDatosPersonales" + idform).val(response.data[0].numInterior)
                $("#edad_petit-frmDatosPersonales" + idform).val(response.data[0].edad)
                $("#telefono_petit-frmDatosPersonales" + idform).val(response.data[0].telefono)
                $("#email_petit-frmDatosPersonales" + idform).val(response.data[0].email)
                $("#vmcanadep_petit-frmDatosPersonales" + idform).val(response.data[0].canalizacionVm)
                $("#vmingrmen_petit-frmDatosPersonales" + idform).val(response.data[0].ingresosMensuales)

                let fecha_nac = moment(new Date(response.data[0].fechaNacimiento).toISOString().split("T")[0]).format('YYYY-MM-DD');
                $("#fenac_petit-frmDatosPersonales" + idform).val(fecha_nac)

                $("#genero_petit-frmDatosPersonales" + idform).val(response.data[0].genero)
                if (response.data[0].otroGenero != '') {
                    $('#ogenero_petit-frmDatosPersonales' + idform).prop('disabled', false);
                    $('#ogenero_petit-frmDatosPersonales' + idform).removeClass('d-none')
                    $('#ogenero_petit-frmDatosPersonales' + idform).val(response.data[0].otroGenero)
                }
                $("#escosel_petit-frmDatosPersonales" + idform).val(response.data[0].fkEscolaridad)
                $("#econyugal_petit-frmDatosPersonales" + idform).val(response.data[0].fkEstadoConyugal)
                $("#ocupacion_petit-frmDatosPersonales" + idform).val(response.data[0].fkOcupacion)
                if (response.data[0].otraOcupacion != '') {
                    $('#ocupacioninpt_petit-frmDatosPersonales' + idform).prop('disabled', false);
                    $('#ocupacioninpt_petit-frmDatosPersonales' + idform).removeClass('d-none')
                    $('#ocupacioninpt_petit-frmDatosPersonales' + idform).val(response.data[0].otraOcupacion)
                }
                $("#discapacidad_petit-frmDatosPersonales" + idform).val(response.data[0].fkDiscapacidad)
                $("#gsoci_petit-frmDatosPersonales" + idform).val(response.data[0].fkGrupoSocial)
                if (response.data[0].otroGsocial != '') {
                    $('#gsociinpt_petit-frmDatosPersonales' + idform).prop('disabled', false);
                    $('#gsociinpt_petit-frmDatosPersonales' + idform).removeClass('d-none')
                    $('#gsociinpt_petit-frmDatosPersonales' + idform).val(response.data[0].otraOcupacion)
                }
                $("#leindi_petit-frmDatosPersonales" + idform).val(response.data[0].hablaLenguai)
                if (response.data[0].lenguaIndigena != '') {
                    $('#oleindi_petit-frmDatosPersonales' + idform).prop('disabled', false);
                    $('#oleindi_petit-frmDatosPersonales' + idform).removeClass('d-none')
                    $('#oleindi_petit-frmDatosPersonales' + idform).val(response.data[0].otraOcupacion)
                }
                if (response.data[0].violenciaVm == 1) {
                    violenciamujer = 'Si';

                    $("input[name=radsinoviomu_petit-frmDatosPersonales" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                    $("#vmembara_petit-frmDatosPersonales" + idform).val(response.data[0].embarazadaVm)
                    $("#vmhijos_petit-frmDatosPersonales" + idform).val(response.data[0].fkHijosVivos)
                    $("#vmmodvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkModalidadViolencia)
                    $("#vmtvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkTipoViolencia)
                    $("#vmreviagr_petit-frmDatosPersonales" + idform).val(response.data[0].fkRelacionAgresor)

                    document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.remove("dis-none"));
                } else {
                    violenciamujer = 'No';
                    $("input[name=radsinoviomu_petit-frmDatosPersonales" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                    document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.add("dis-none"));
                }


                $("input[name=qatu_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].tipoUsuario + "']").prop("checked", true);
                $("input[name=qatu_petit-frmDatosPersonales" + idform + "][value != '" + response.data[0].tipoUsuario + "']").prop("disabled", true);
                $("input[name=radsexo_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].fkSexo + "']").prop("checked", true);
                $("input[name=chknacionalidad_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].nacionalidad + "']").prop("checked", true);
                $("input[name=chksleer_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].sabeLeer + "']").prop("checked", true);


                if (response.data[0].codigoPostal != "" && response.data[0].codigoPostal != 'No proporcionado') {
                    $("#cp_petit-frmDatosPersonales" + idform).val(response.data[0].codigoPostal)

                    let estado = '';
                    let municipio = '';

                    $.getJSON("https://api.copomex.com/query/info_cp/" + response.data[0].codigoPostal + "?type=simplified&token=pruebas", function (copomex) {
                        estado = copomex.response.estado;
                        municipio = copomex.response.municipio;
                        $("#municipio_petit-frmDatosPersonales" + idform).val(municipio);
                        $("#estado_petit-frmDatosPersonales" + idform).val(estado);
                        $("#cp_petit-frmDatosPersonales" + idform).val(copomex.response.cp);
                        AgregarOptionSelect(idform, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idform, copomex.response.asentamiento);
                    }).done(function () {

                        $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=pruebas", function (copomex) {
                            let localidadaes = Object.keys(copomex.response.localidad_clave);
                            AgregarOptionSelect(idform, 'deloptionloca', '#ciudad_petit-frmDatosPersonales' + idform, localidadaes);
                        }).done(function () {
                            $("#estado_petit-frmDatosPersonales" + idform).val(response.data[0].estado)
                            $("#municipio_petit-frmDatosPersonales" + idform).val(response.data[0].municipio)
                            $("#colonia_petit-frmDatosPersonales" + idform).val(response.data[0].colonia)
                            $("#ciudad_petit-frmDatosPersonales" + idform).val(response.data[0].ciudad)

                            $("#colonia_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                            $("#ciudad_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                            $("#modalFormPeticionario").modal("show");
                            RecorreInput('.frmEditDatosPersonales');
                        }).fail(function () { console.log('Ha ocurrido un error en obtener las localidades') });

                    }).fail(function () { console.log('Ha ocurrido un error al obtener datos de un cp') });

                } else {

                    if (response.data[0].codigoPostal == 'No proporcionado') { $("#cp_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (response.data[0].estado == 'No proporcionado') { $("#estado_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (response.data[0].municipio == 'No proporcionado') { $("#municipio_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (response.data[0].colonia == 'No proporcionado') { $("#colonia_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (response.data[0].ciudad == 'No proporcionado') { $("#ciudad_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (fecha_nac == '1900-01-01') { $("#fenac_petit-frmDatosPersonales" + idform).val(''); }

                    if ((response.data[0].docIdentificatorio.toUpperCase() == 'NO PROPORCIONADO') || (response.data[0].apellidoPat == 'No proporcionado') || (response.data[0].apellidoMat == 'No proporcionado'))
                    {


                        var $input = $('#nombre_petit-frmDatosPersonales1');
                        var $select = $('<select></select>').addClass('form-control eliminaformaes ob max-20 eliminaformaes').attr({ 'data-idfrmit': '', 'name': $input.attr('name'), 'id': $input.attr('id'), 'required': true });
                        $select.append($('<option></option>').val('').text('Selecciona una opción'));
                        $.each(Morales, function (index, item) {
                            $select.append($('<option></option>').val(item.idSelect).text(item.descripcion));
                        });
                        $input.replaceWith($select);


                        $('.noproporcionado').prop('checked', true).trigger('change');
                        $("#frmDatosPersonales1 input[type='checkbox'].noproporcionado").prop("disabled", true);
                        $("#frmDatosPersonales1 input[type='text']").prop("disabled", true);
                        $("#frmDatosPersonales1 input[type='radio']").prop("disabled", true);
                        $("#frmDatosPersonales1 input[type='date']").prop("disabled", true);
                        $("#frmDatosPersonales1 select").prop("disabled", true);
                        $("#colonia_petit-frmDatosPersonales1").val('No proporcionado');
                        $("#ciudad_petit-frmDatosPersonales1").val('No proporcionado');
                        $("#genero_petit-frmDatosPersonales1").val('No proporcionado');
                        $("#escosel_petit-frmDatosPersonales1").val(14);
                        $("#econyugal_petit-frmDatosPersonales1").val(8);
                        $("#ocupacion_petit-frmDatosPersonales1").val(9);
                        $("#discapacidad_petit-frmDatosPersonales1").val(7);
                        $("#gsoci_petit-frmDatosPersonales1").val(9);
                        $("#leindi_petit-frmDatosPersonales1").val('No');
                        $("#idQuejoso").prop("checked", true);
                        $("#idNosexo").prop("checked", true);
                        $("#idNoGenero").prop("checked", true);
                        $("#idNopSabeLeer").prop("checked", true);
                        $("#nombre_petit-frmDatosPersonales1").prop("disabled", false);
                        $("input[name='nombre_petitno-frmDatosPersonales1']").prop("hidden", true);
                        $("input[name='nombre_petitno-frmDatosPersonales1']").prop("checked", false).trigger("change");
                        $("#nombre_petit-frmDatosPersonales" + idform).val(response.data[0].tipopet).trigger('change');
                    }
                    else {
                        $("#nombre_petit-frmDatosPersonales" + idform).val(response.data[0].nombre)
                    }


                    $("#modalFormPeticionario").modal("show");

                }
                updateDatosPeticionarios();
                if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar' || validafechamodificacion === true) {
                        $('.frmEditDatosPersonales button[type="submit"]').hide();
                }

            }
            else
            {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Datos no encontrados, verifique la curp o el nombre del peticionario',
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            }
        }
    });
}
function AddFormatDatosPersonales(idExpediente) {

    let formPetitn = formPeticionario(1)
    $('.frmEditDatosPersonales').append(formPetitn);
    chkNoproporcinado();
    seltxt();
    keypresscp();
    buscapeticionariocurpnom();
    fetchGet("Expediente/SelectPaises", "json", (data) => {
        let Paises = data.relacionpaises;
        //console.log(Paises)
        AgregarOptionSelectPais(1, 'dellistpaiseso', '#migorig_petit-frmDatosPersonales1', Paises);
        AgregarOptionSelectPais(1, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales1', Paises);
    })

    let idform = 1;
    let curpd = '';
    let nombrep = '';
    let apellidope = '';
    let apellidome = '';
    let violenciamujer = '';

    $('#idquejagenerado').val(idExpediente);
    //$("input[name=qatu_petit-frmDatosPersonales" + idform + "][value = 'Agraviado']").prop("disabled", true);
    $("#modalFormPeticionario").modal("show");
    updateDatosPeticionariosBusq();
}
function eliminaFormato(idformato) {

    swal.fire({
        title: 'Eliminar Formato Datos Personales',
        text: "¿Desea eliminar el formato de datos personales ligado esta queja?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then(function (resp) {
        if (resp.isConfirmed) {
            console.log('Eliminado')
        }
    })

}
function formPeticionario(idformulario) {
    let eliminarform = document.querySelectorAll('.eliminaformaes');
    for (var i = 0; i < eliminarform.length; i++) {
        eliminarform[i].remove();
    }

    let frmDatosPersonales = crearForumulario(
        {
            idformulario: "frmDatosPersonales" + idformulario,
            numForm: idformulario
        },
        {
            formulario:
                [
                    {
                        valhidden: idformulario,
                        name: "numFrm",
                        type: "hidden"
                    },
                    {
                        valhidden: "",
                        name: "idcomplementopet" + idformulario,
                        type: "hidden",
                        classControl: "idscomplepeticionarios"
                    },
                    {
                        valhidden: "",
                        name: "versioncomplementopeticionario",
                        type: "hidden",
                        classControl: "versioncomplementopeticionario"
                    },
                    {
                        valhidden: "",
                        name: "idpeticionarioi" + idformulario,
                        type: "hidden"
                    },
                    {
                        valhidden: "",
                        name: "idquejagenerado",
                        type: "hidden"
                    },
                    {
                        class: "col-md-6",
                        label: "CURP",
                        name: "CURP_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-20 eliminaformaes bucaporcurp",
                        inputdata: "",
                        valinputdata: "",
                        iformularioit: idformulario,
                        noproporcionado: true,
                        required: 'required oninput="validarInput(this)"',
                        namenoprop: "CURP_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-6",
                        label: "Nombre(s)",
                        name: "nombre_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-20 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "nombre_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Apellido Paterno",
                        name: "apellidop_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "apellidop_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Apellido Materno",
                        name: "apellidom_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "apellidom_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Código Postal",
                        name: "cp_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes validaNumero buscacp",
                        noproporcionado: true,
                        required: 'required oninput="validaNumeroKeyPress(this)"',
                        namenoprop: "cp_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "Estado",
                        name: "estado_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "estado_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "Colonia",
                        name: "colonia_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        required: 'required',
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        combooptions: [
                            {
                                idSelect: 'No proporcionado',
                                descripcion: 'No proporcionado'
                            }
                        ]
                    },
                    {
                        class: "col-md-3",
                        label: "Municipio",
                        name: "municipio_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        iformularioit: idformulario,
                        required: 'required',
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        namenoprop: "municipio_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "Ciudad/Localidad",
                        required: 'required',
                        name: "ciudad_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        combooptions: [
                            {
                                idSelect: 'No proporcionado',
                                descripcion: 'No proporcionado'
                            }
                        ]
                    },
                    {
                        class: "col-md-6",
                        label: "Calle",
                        name: "calle_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        required: 'required',
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        namenoprop: "calle_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "No. Exterior",
                        required: 'required oninput="validaNumeroKeyPress(this)"',
                        name: "nexterior_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 validaNumero eliminaformaes",
                        noproporcionado: true,
                        namenoprop: "nexterior_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "No. Interior",
                        required: 'required oninput="validaNumeroKeyPress(this)"',
                        name: "ninterior_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 validaNumero eliminaformaes",
                        noproporcionado: true,
                        namenoprop: "ninterior_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "Fecha de Nacimiento",
                        name: "fenac_petit-frmDatosPersonales" + idformulario,
                        type: "date",
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        namenoprop: "fenac_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-2",
                        label: "Edad",
                        name: "edad_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 validaNumero eliminaformaes",
                        noproporcionado: true,
                        required: 'required oninput="validaNumeroKeyPress(this)"',
                        namenoprop: "edad_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "Teléfono",
                        name: "telefono_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 validaNumero eliminaformaes",
                        noproporcionado: true,
                        required: 'required oninput="validaNumeroKeyPress(this)"',
                        namenoprop: "telefono_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Correo Electrónico",
                        name: "email_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required oninput="validaEmailKeyPress(this)"',
                        namenoprop: "email_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        label: "Tipo de usuario/a",
                        type: "radio",
                        labels: [
                            'Quejoso/a', 'Agraviado/a'
                        ],
                        ids: {
                            0: 'idQuejoso',
                            1: 'idAgraviado'
                        },
                        values: {
                            0: 'Peticionario',
                            1: 'Agraviado'
                        },
                        class: "col-md-2 positionLeft",
                        required: 'required',
                        checked: [
                        ],
                        name: "qatu_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes"
                    },
                    {
                        label: "Sexo",
                        type: "radio",
                        labels: [
                            'Masculino', 'Femenino', 'No proporcionado'
                        ],
                        ids: {
                            0: 'idMasculino',
                            1: 'idAgraviado',
                            2: 'idNosexo'
                        },
                        values: {
                            0: '1',
                            1: '2',
                            2: '3'
                        },
                        class: "col-md-2 positionLeft",
                        required: 'required',
                        checked: [

                        ],
                        name: "radsexo_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes"
                    },
                    {
                        label: "Género",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Género',
                                options: [
                                    {
                                        idSelect: 'Hombre',
                                        descripcion: 'Hombre'
                                    },
                                    {
                                        idSelect: 'Mujer',
                                        descripcion: 'Mujer'
                                    },
                                    {
                                        idSelect: 'Otro',
                                        descripcion: 'Otro'
                                    },
                                    {
                                        idSelect: 'No proporcionado',
                                        descripcion: 'No proporcionado'
                                    }
                                ]
                            }
                        ],
                        class: "col-md-4 positionLeft",
                        name: "genero_petit-frmDatosPersonales" + idformulario,
                        nameInputText: "ogenero_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        otraopcion: true,
                        bgselect: 'bg-fusion'
                    },
                    {
                        label: "Nacionalidad",
                        type: "radio",
                        labels: [
                            'Mexicano/a', 'Extranjero/a', 'No proporcionado'
                        ],
                        ids: {
                            0: 'idMexicano',
                            1: 'idExtranjero',
                            2: 'idNoGenero'
                        },
                        values: {
                            0: 'Mexicano',
                            1: 'Extranjero',
                            2: 'No proporcionado'
                        },
                        class: "col-md-2 positionLeft",
                        required: 'required',
                        classradio: "radextrsn",
                        checked: [

                        ],
                        name: "chknacionalidad_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        iformularioit: idformulario,
                    },
                    {
                        label: "¿Sabe leer y escribir?",
                        type: "radio",
                        labels: [
                            'Si', 'No', 'No proporcionado'
                        ],
                        ids: {
                            0: 'idSabeLeer',
                            1: 'idNoSabeLeer',
                            2: 'idNopSabeLeer'
                        },
                        values: {
                            0: 'Si',
                            1: 'No',
                            2: 'No proporcionado'
                        },
                        class: "col-md-2 positionLeft",
                        required: 'required',
                        checked: [

                        ],
                        name: "chksleer_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes"
                    },
                    {
                        label: "Escolaridad",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Escolaridad',
                                options: escolaridadInicio
                            },
                            {
                                lableoptgrup: 'Estudios técnico o comerciales con:',
                                options: escolaridadFinal
                            }
                        ],
                        class: "col-md-6 positionLeft",
                        name: "escosel_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        required: 'required',
                        otraopcion: false
                    },
                    {
                        class: "col-md-6",
                        label: "Estado Conyugal",
                        name: "econyugal_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "ob max-300 eliminaformaes",
                        required: 'required',
                        combooptions: EstadoConyugal
                    },
                    {
                        label: "Ocupación",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Ocupación',
                                options: Ocupacion
                            }
                        ],
                        class: "col-md-6 positionLeft",
                        required: 'required',
                        name: "ocupacion_petit-frmDatosPersonales" + idformulario,
                        nameInputText: "ocupacioninpt_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        otraopcion: true,
                        bgselect: 'bg-fusion'
                    },
                    {
                        class: "col-md-6",
                        label: "¿Tiene alguna discapacidad?",
                        name: "discapacidad_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        required: 'required',
                        classControl: "ob max-300 eliminaformaes",
                        combooptions: Discapacidad
                    },
                    {
                        label: "¿Pertenece algún grupo social específico?",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Grupo Social',
                                options: GrupoSocial
                            }
                        ],
                        class: "col-md-6 positionLeft",
                        name: "gsoci_petit-frmDatosPersonales" + idformulario,
                        nameInputText: "gsociinpt_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        otraopcion: true,
                        required: 'required',
                        bgselect: 'bg-fusion'
                    },
                    {
                        label: "¿Habla alguna lengua indígena?",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Lengua Indígena',
                                options: [
                                    {
                                        idSelect: 'Si',
                                        descripcion: 'Si'
                                    },
                                    {
                                        idSelect: 'No',
                                        descripcion: 'No'
                                    }
                                ]
                            }
                        ],
                        class: "col-md-6 positionLeft",
                        name: "leindi_petit-frmDatosPersonales" + idformulario,
                        nameInputText: "oleindi_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes",
                        otraopcion: true,
                        required: true,
                        bgselect: 'bg-fusion'
                    },
                    {
                        class: "col-md-12 positionCenter",
                        classlabel: "dis-none frmextrsnwno" + idformulario,
                        labelhr: 'SOLO PARA PERSONAS MIGRANTES',
                        type: 'separacion'
                    },
                    {
                        class: "col-md-4",
                        classlabel: "dis-none frmextrsnwno" + idformulario,
                        label: "Origen",
                        name: "migorig_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes listpaises",
                        combooptions: []
                    },
                    {
                        class: "col-md-4",
                        classlabel: "dis-none frmextrsnwno" + idformulario,
                        label: "Destino",
                        name: "migdesti_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes listpaises",
                        combooptions: []
                    },
                    {
                        class: "col-md-4",
                        classlabel: "dis-none frmextrsnwno" + idformulario,
                        label: "¿Primera vez en México?",
                        name: "migprmex_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "ob max-300 eliminaformaes",
                        combooptions: [
                            {
                                idSelect: 'Si',
                                descripcion: 'Si'
                            },
                            {
                                idSelect: 'No',
                                descripcion: 'No'
                            }
                        ]
                    },
                    {
                        class: "col-md-12 positionCenter",
                        labelhr: 'PARA CASOS DE VIOLENCIA CONTRA LAS MUJERES',
                        type: 'separacion'
                    },
                    {
                        type: "radio",
                        iformularioit: idformulario,
                        labels: [
                            'Si', 'No'
                        ],
                        ids: {
                            0: 'idSiviolenciamujer' + idformulario,
                            1: 'idNoviolenciamujer' + idformulario
                        },
                        values: {
                            0: 'Si',
                            1: 'No'
                        },
                        class: "col-md-12 d-flex mleft positionCenter",
                        classradio: "radiosnvm",
                        checked: [
                            'idNoviolenciamujer' + idformulario
                        ],
                        name: "radsinoviomu_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-300 eliminaformaes"
                    },
                    {
                        class: "col-md-4",
                        label: "018 Canalización del caso a otra dependencia:",
                        classlabel: "dis-none frmviolenciam" + idformulario,
                        name: "vmcanadep_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-20 eliminaformaes dis-none frmviolenciam" + idformulario,
                        noproporcionado: true,
                        namenoprop: "vmcanadep_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "016 Está embarazada",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmembara_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: [
                            {
                                idSelect: 'Si',
                                descripcion: 'Si'
                            },
                            {
                                idSelect: 'No',
                                descripcion: 'No'
                            },
                            {
                                idSelect: 'No sabe',
                                descripcion: 'No sabe'
                            }
                        ]
                    },
                    {
                        class: "col-md-4",
                        label: "020 Ingresos mensuales(Aproximados):",
                        classlabel: "dis-none frmviolenciam" + idformulario,
                        name: "vmingrmen_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        functions: 'oninput="validaNumeroKeyPress(this)"',
                        classControl: "dis-none ob max-20 eliminaformaes validaNumero frmviolenciam" + idformulario,
                        noproporcionado: true,
                        namenoprop: "vmingrmen_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-2",
                        label: "011 Hijos vivos",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmhijos_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: HijosVivos
                    },
                    {
                        class: "col-md-3",
                        label: "002 Modalidad de Violencia",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmmodvio_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: ModalidadViolencia
                    },
                    {
                        class: "col-md-3",
                        label: "Tipo de Violencia",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmtvio_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: TipoViolencia
                    },
                    {
                        class: "col-md-4",
                        label: "017 Tipo de relación o vínculo con el/la agresor/a",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmreviagr_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: RelacionAgresor
                    },
                    {
                        class: "col-md-6 positionEnd",
                        name: "gpdfForm",
                        data: idformulario,
                        type: "button",
                        onclick: "btnGenerapdfp",
                        classSubmit: "eliminaformaes btn btn-pinterest",
                        submitLabel: "Imprimir PDF",
                        classSpan: "btn-icon-right",
                        icon: "far fa-file-pdf",
                        url: "controlador/pdf"
                    },
                    {
                        class: "col-md-6 positionLeft",
                        name: "submitForm-" + idformulario,
                        type: "submiticon",
                        classSubmit: "eliminaformaes btn btn-success",
                        submitLabel: "Guardar",
                        classSpan: "btn-icon-right",
                        icon: "fa fa-check"
                    }
                ]
        }
    );

    return frmDatosPersonales;
}
function buscapeticionariocurpnom() {

    $('.bucaporcurp').keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();

            let idform = this.dataset.idfrmit;
            let curpd = $("#CURP_petit-frmDatosPersonales" + idform).val()
            let nombrep = $("#nombre_petit-frmDatosPersonales" + idform).val()
            let apellidope = $("#apellidop_petit-frmDatosPersonales" + idform).val()
            let apellidome = $("#apellidom_petit-frmDatosPersonales" + idform).val()

            if (curpd == '') {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Ingrese la CURP o el nombre completo del peticionario',
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            } else if (curpd == 'No proporcionado' && nombrep == '' && apellidope == '' && apellidome == '') {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'En caso de no tener CURP ingrese el nombre completo del peticionario',
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            }

            $.ajax({
                type: "POST",
                url: "GetDataPeticionario",
                data: { curp: curpd, nombre: nombrep, apellidop: apellidope, apellidom: apellidome },
                dataType: "JSON",
                success: function (response) {

                    if (response.data.length > 0) {
                        //console.log(response.data)

                        $("#CURP_petit-frmDatosPersonales" + idform).val(response.data[0].docIdentificatorio)
                        $("#nombre_petit-frmDatosPersonales" + idform).val(response.data[0].nombre)
                        $("#apellidop_petit-frmDatosPersonales" + idform).val(response.data[0].apellidoPat)
                        $("#apellidom_petit-frmDatosPersonales" + idform).val(response.data[0].apellidoMat)
                        $("#calle_petit-frmDatosPersonales" + idform).val(response.data[0].calle)
                        $("#nexterior_petit-frmDatosPersonales" + idform).val(response.data[0].numExterior)
                        $("#ninterior_petit-frmDatosPersonales" + idform).val(response.data[0].numInterior)
                        $("#edad_petit-frmDatosPersonales" + idform).val(response.data[0].edad)
                        $("#telefono_petit-frmDatosPersonales" + idform).val(response.data[0].telefono)
                        $("#email_petit-frmDatosPersonales" + idform).val(response.data[0].email)
                        $("#vmcanadep_petit-frmDatosPersonales" + idform).val(response.data[0].canalizacionVm)
                        $("#vmingrmen_petit-frmDatosPersonales" + idform).val(response.data[0].ingresosMensuales)
                        let fecha_nac = moment(new Date(response.data[0].fechaNacimiento).toISOString().split("T")[0]).format('YYYY-MM-DD');
                        $("#fenac_petit-frmDatosPersonales" + idform).val(fecha_nac)
                        $("#genero_petit-frmDatosPersonales" + idform).val(response.data[0].genero)
                        if (response.data[0].otroGenero != '') {
                            $('#ogenero_petit-frmDatosPersonales' + idform).prop('disabled', false);
                            $('#ogenero_petit-frmDatosPersonales' + idform).removeClass('d-none')
                            $('#ogenero_petit-frmDatosPersonales' + idform).val(response.data[0].otroGenero)
                        }
                        $("#escosel_petit-frmDatosPersonales" + idform).val(response.data[0].fkEscolaridad)
                        $("#econyugal_petit-frmDatosPersonales" + idform).val(response.data[0].fkEstadoConyugal)
                        $("#ocupacion_petit-frmDatosPersonales" + idform).val(response.data[0].fkOcupacion)
                        if (response.data[0].otraOcupacion != '') {
                            $('#ocupacioninpt_petit-frmDatosPersonales' + idform).prop('disabled', false);
                            $('#ocupacioninpt_petit-frmDatosPersonales' + idform).removeClass('d-none')
                            $('#ocupacioninpt_petit-frmDatosPersonales' + idform).val(response.data[0].otraOcupacion)
                        }
                        $("#gsoci_petit-frmDatosPersonales" + idform).val(response.data[0].fkGrupoSocial)
                        if (response.data[0].otroGsocial != '') {
                            $('#gsociinpt_petit-frmDatosPersonales' + idform).prop('disabled', false);
                            $('#gsociinpt_petit-frmDatosPersonales' + idform).removeClass('d-none')
                            $('#gsociinpt_petit-frmDatosPersonales' + idform).val(response.data[0].otraOcupacion)
                        }
                        $("#leindi_petit-frmDatosPersonales" + idform).val(response.data[0].hablaLenguai)
                        if (response.data[0].lenguaIndigena != '') {
                            $('#oleindi_petit-frmDatosPersonales' + idform).prop('disabled', false);
                            $('#oleindi_petit-frmDatosPersonales' + idform).removeClass('d-none')
                            $('#oleindi_petit-frmDatosPersonales' + idform).val(response.data[0].otraOcupacion)
                        }
                        $("#discapacidad_petit-frmDatosPersonales" + idform).val(response.data[0].fkDiscapacidad)
                        $("#vmembara_petit-frmDatosPersonales" + idform).val(response.data[0].embarazadaVm)
                        $("#vmhijos_petit-frmDatosPersonales" + idform).val(response.data[0].fkHijosVivos)
                        $("#vmmodvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkModalidadViolencia)
                        $("#vmtvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkTipoViolencia)
                        $("#vmreviagr_petit-frmDatosPersonales" + idform).val(response.data[0].fkSexofkRelacionAgresor)

                        if (response.data[0].violenciaVm == 1) {
                            violenciamujer = 'Si';

                            $("input[name=radsinoviomu_petit-frmDatosPersonales" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                            $("#vmembara_petit-frmDatosPersonales" + idform).val(response.data[0].embarazadaVm)
                            $("#vmhijos_petit-frmDatosPersonales" + idform).val(response.data[0].fkHijosVivos)
                            $("#vmmodvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkModalidadViolencia)
                            $("#vmtvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkTipoViolencia)
                            $("#vmreviagr_petit-frmDatosPersonales" + idform).val(response.data[0].fkRelacionAgresor)

                            document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.remove("dis-none"));
                        } else {
                            violenciamujer = 'No';
                            $("input[name=radsinoviomu_petit-frmDatosPersonales" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                            document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.add("dis-none"));
                        }

                        $("input[name=radsexo_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].fkSexo + "']").prop("checked", true);
                        $("input[name=chknacionalidad_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].nacionalidad + "']").prop("checked", true);
                        $("input[name=chksleer_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].sabeLeer + "']").prop("checked", true);


                        if (response.data[0].codigoPostal != "") {
                            $("#cp_petit-frmDatosPersonales" + idform).val(response.data[0].codigoPostal)

                            let estado = '';
                            let municipio = '';

                            $.getJSON("https://api.copomex.com/query/info_cp/" + response.data[0].codigoPostal + "?type=simplified&token=pruebas", function (copomex) {
                                estado = copomex.response.estado;
                                municipio = copomex.response.municipio;
                                $("#municipio_petit-frmDatosPersonales" + idform).val(municipio);
                                $("#estado_petit-frmDatosPersonales" + idform).val(estado);
                                $("#cp_petit-frmDatosPersonales" + idform).val(copomex.response.cp);
                                AgregarOptionSelect(idform, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idform, copomex.response.asentamiento);
                            }).done(function () {

                                $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=pruebas", function (copomex) {
                                    let localidadaes = Object.keys(copomex.response.localidad_clave);
                                    AgregarOptionSelect(idform, 'deloptionloca', '#ciudad_petit-frmDatosPersonales' + idform, localidadaes);
                                }).done(function () {
                                    $("#estado_petit-frmDatosPersonales" + idform).val(response.data[0].estado)
                                    $("#municipio_petit-frmDatosPersonales" + idform).val(response.data[0].municipio)
                                    $("#colonia_petit-frmDatosPersonales" + idform).val(response.data[0].colonia)
                                    $("#ciudad_petit-frmDatosPersonales" + idform).val(response.data[0].ciudad)

                                    $("#colonia_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                                    $("#ciudad_petit-frmDatosPersonales" + idform).selectpicker('refresh');

                                }).fail(function () { console.log('Ha ocurrido un error en obtener las localidades') });

                            }).fail(function () { console.log('Ha ocurrido un error al obtener datos de un cp') });


                        }

                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Datos no encontrados, verifique la curp o el nombre del peticionario',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        return;
                    }
                }
            });
        }
    });

}
function crea_Boton(tipo, texto, id, clase, click) {
    return " <button onclick=" + click + " id='" + id + "' class='" + clase + "' type='" + tipo + "' value='" + texto + "''>" + texto + "</button>";
}
function Crea_Parrafos(idParrafo, Name, clas, texto) {
    return "<p name='" + Name + "' id='" + idParrafo + "' class='" + clas + "'>" + texto + "</p > ";
}
function Crea_Label(idParrafo, Name, clas, texto) {
    return "<label name='" + Name + "' id='" + idParrafo + "' class='" + clas + "'>" + texto + "</label> ";
}
function Crea_LabelCentro(idParrafo, Name, clas, texto) {
    return "<center><label name='" + Name + "' id='" + idParrafo + "' class='" + clas + "'>" + texto + "</label></center></br>";
}
function CreaInputs(idParrafo, Name, clas, tipo) {
    let br = '';
    if (tipo != 'hidden') {
        br = '</br>';
    }
    return "<input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' > " + br
}
function CreaInputs_Con_Label(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaInputs_Con_Labelval(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel, val) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input value='" + val + "' type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaInputs_Con_LabelID(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaBR() {
    return "</br>"
}
function CreaTextArea(Name, clas, adicion) {
    return "<textarea class='" + clas + "' name='" + Name + "' id='" + Name + "' rows='7' cols='50' " + adicion + " ></textarea>";
}
function CargaDatosSelect(select, arreglo) {
    var htmld = select;
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v]}">${arreglo[v]}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    //$(select).select2();
}
function CargaDatosSelectOtro(select, arreglo) {
    var htmld = select;
    htmld += '';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelectGenerico}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    //$(select).select2();
}
function CargaDatosSelecAutori(select, arreglo) {
    var htmld = select;
    htmld += '';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].clave}">${arreglo[v].descripcion}</option>
            `;
    }
    //htmld += "</select>";

    $(select).append(htmld)
    //$(select).select2();
}
function CargaDatosSelectOtroO(select, arreglo) {
    var htmld = select;
    htmld += ' ';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    //$(select).select2();
}
function CargaDatosSelectOtroPaises(select, arreglo) {
    var htmld = select;
    htmld += ' ';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    $(select).select2();
}
function arreglo_Estados() {
    var arregloEdos = [];
    $.getJSON("https://api.copomex.com/query/get_estado_clave?token=pruebas", function (copomex) {
        //console.log(copomex.response.estado_clave);
        arregloEdos = copomex.response.estado_clave;


        for (i = 0; i < arregloEdos.length; i++) {
            var objeto0 = { idSelect: arregloEdos[i][0], descripcion: arregloEdos[i] };
            arregloEdos.push(objeto0);
        }


    })
    return arregloEdos;
}
function CreaSelect(id, tiposelect, arreglo, nombreDiv) {
    let htmld = '<select id="' + id + '" class="form-control form-control-lg" ' + tiposelect + '> <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(nombreDiv).append(htmld)
    $("#" + id).select2();
}
function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '') {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" class="' + clas + '" name="' + id + '" ' + tiposelect + '> <option value="99">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabeldisabled(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel) {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" name="' + id + '" ' + tiposelect + ' disabled > <option value="99">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas) {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" class="' + clas + '" name="' + id + '" ' + tiposelect + '> <option value="99">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabelSelect2(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, estiloLabel, estiloselect) {
    let htmld = '<label for= "' + namelabel + '" ' + estiloLabel + ' >' + textoLabel + '</label ><select id="' + id + '" ' + tiposelect + ' ' + estiloselect + '> <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld;
    $("#" + id).select2();
}
function CreaSelectLabelSelect2DI(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, estiloLabel, estiloselect, clas = '') {
    let htmld = '<label for= "' + namelabel + '" ' + estiloLabel + ' >' + textoLabel + '</label ><select id="' + id + '" class="' + clas + '" name="' + nombreDiv + '" ' + tiposelect + ' ' + estiloselect + '> <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld;
    // $("#" + id).select2();
}

function CreaInput() {
    return `
        <input type="file" name="pdfEscritoi" multiple id="pdfEscritoi" class="input-file">
        <div class="input-group col-xs-12">
            <input type="text" class="form-control" disabled placeholder="Cargar archivos">
            <span class="input-group-btn">
                <button class="upload-field btn btn-info" type="button"><i class="fa fa-search"></i> Buscar</button>
            </span>
        </div>
     `;
}

function crealert(id, tipo, txt) {
    return `
        <div id="${id}" class="alert alert-${tipo}" role="alert">
          ${txt}.
        </div>
     `;
}

function cargaArchivosAdjuntos(dataUploads) {
    let resp = "";
    let jsonUploads = JSON.stringify(dataUploads);
    for (var i = 0; i < dataUploads.length; i++) {

        let rutanueva = (dataUploads[i].rutaArchivo).replaceAll(/\\/g, "/");

        if (dataUploads[i].type == '.png' || dataUploads[i].type == '.jpg') {
            resp += `
            <div data-contup="${dataUploads[i].pkEnlaceAdjescritoi}" class="divuploads removadj${dataUploads[i].pkEnlaceAdjescritoi}" id="div${dataUploads[i].pkEnlaceAdjescritoi}">
                <div class="prevImage removadj${dataUploads[i].pkEnlaceAdjescritoi}">
                    <img class="removadj${dataUploads[i].pkEnlaceAdjescritoi}" src="${rutaUploadei + rutanueva}">
                </div>
                <button class="btnVerAdj removadj${dataUploads[i].pkEnlaceAdjescritoi}" type="button" onclick="fntVerArchivo('${dataUploads[i].pkEnlaceAdjescritoi}','${dataUploads[i].rutaArchivo}','${dataUploads[i].type}')"><i class="fas fa-eye"></i></button>
                <button class="btnDeleteImage removadj${dataUploads[i].pkEnlaceAdjescritoi}" type="button" onclick="fntDelItem('${dataUploads[i].pkEnlaceAdjescritoi}')"><i class="fas fa-trash-alt"></i></button>
            </div>
            `;
        } else if (dataUploads[i].type == '.pdf') {
            resp += `
                <div data-contup="${dataUploads[i].pkEnlaceAdjescritoi}" class="divuploads removadj${dataUploads[i].pkEnlaceAdjescritoi}" id="div${dataUploads[i].pkEnlaceAdjescritoi}">
                    <div class="prevImage removadj${dataUploads[i].pkEnlaceAdjescritoi}">
                        <img class="removadj${dataUploads[i].pkEnlaceAdjescritoi}" src="${rutaUploadei}/pdf_file.png">
                    </div>
                    <button class="btnVerAdj removadj${dataUploads[i].pkEnlaceAdjescritoi}" type="button" onclick="fntVerArchivo('${dataUploads[i].pkEnlaceAdjescritoi}','${dataUploads[i].rutaArchivo}','${dataUploads[i].type}')"><i class="fas fa-eye"></i></button>
                    <button class="btnDeleteImage removadj${dataUploads[i].pkEnlaceAdjescritoi}" type="button" onclick="fntDelItem('${dataUploads[i].pkEnlaceAdjescritoi}')"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
        }

    }

    return resp;
}

function changeselects() {
    $('#select_viainterposicionc').on('change', function () {
        valueVInterposicion = this.value;
        //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);
    });

    $('#select_tipoescritoc').on('change', function () {
        tipoescrito = this.value;
        // CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);
    });

    //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);


}
function arregloEstado() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- identificación --' }
    const objeto = { idSelect: 1, descripcion: 'INE' }
    const objeto1 = { idSelect: 2, descripcion: 'no proporcionada' }


    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);

    return arreglo;

}
function arregloMun() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- identificación --' }
    const objeto = { idSelect: 1, descripcion: 'INE' }
    const objeto1 = { idSelect: 2, descripcion: 'no proporcionada' }


    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);

    return arreglo;

}
function arregloAutoridades() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- identificación --' }
    const objeto = { idSelect: 1, descripcion: 'INE' }
    const objeto1 = { idSelect: 2, descripcion: 'no proporcionada' }


    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);

    return arreglo;

}

function Agrega_PersonaAutoridad(contador, persona, cargo, autoridadSe) {
    var arregloBlanco = [];
    var cuerpo = "<div='contenedorS" + contador + "'>"
        + CreaInputs_Con_Labelval('Input_nombres' + contador, 'Input_nombres' + contador, 'arrInput_nombres', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres', 'placeholder="Nombres y apellidos" data-idinei="' + contador + '" style ="float:left;"', ' style ="float:left;"', persona)
        + CreaInputs_Con_Labelval('Input_cargo' + contador, 'Input_cargo' + contador, 'arrInput_cargo', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" style ="float:left;"', ' data-idinei="' + contador + '" style ="float:left;"', cargo)
        + CreaSelectLabelSelect2DI('Input_autoridades' + contador, "", arregloBlanco, 'Input_autoridades' + contador, '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', 'Input_autoridades', ' style ="float:left;"', 'data-idinei="' + contador + '" style ="float:left;max-width: 180px !important;"', 'arrInput_autoridades')
        + CreaBR()
        + CreaBR()
        + "</div>";

    fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
        let autoridad = data.lista2;
        CargaDatosSelecAutori("#Input_autoridades" + contador, autoridad);
    });
    return cuerpo;

}

function Agrega_PersonaAutoridadvalvacio(nfin) {
    var arregloBlanco = [];

    var cuerpo = CreaInputs_Con_Label('Input_nombres' + nfin, 'Input_nombres' + nfin, 'arrInput_nombres', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres' + nfin, 'placeholder="Nombres y apellidos"  data-idinei="' + nfin + '" style ="float:left;"', ' style ="float:left;"')
        + CreaInputs_Con_Label('Input_cargo' + nfin, 'Input_cargo' + nfin, '', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" style ="float:left;" data-idinei="' + nfin + '"', ' style ="float:left;"')
        + CreaSelectLabelSelect2('Input_autoridades' + nfin, "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' style ="float:left;"', 'data-idinei="' + nfin + '" style ="float:left;max-width: 180px !important;"', '')
        + CreaBR()
        + CreaBR();
    return cuerpo;

}

function arregloMeses() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- mes --' }
    const objeto = { idSelect: 1, descripcion: 'enero' }
    const objeto1 = { idSelect: 2, descripcion: 'febrero' }
    const objeto2 = { idSelect: 3, descripcion: 'marzo' }
    const objeto3 = { idSelect: 4, descripcion: 'abril' }
    const objeto4 = { idSelect: 5, descripcion: 'mayo' }
    const objeto5 = { idSelect: 6, descripcion: 'junio' }
    const objeto6 = { idSelect: 7, descripcion: 'julio' }
    const objeto7 = { idSelect: 8, descripcion: 'agosto' }
    const objeto8 = { idSelect: 9, descripcion: 'septiembre' }
    const objeto9 = { idSelect: 10, descripcion: 'octubre' }
    const objeto10 = { idSelect: 11, descripcion: 'noviembre' }
    const objeto11 = { idSelect: 12, descripcion: 'diciembre' }

    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);
    arreglo.push(objeto2);
    arreglo.push(objeto3);
    arreglo.push(objeto4);
    arreglo.push(objeto5);
    arreglo.push(objeto6);
    arreglo.push(objeto7);
    arreglo.push(objeto8);
    arreglo.push(objeto9);
    arreglo.push(objeto10);
    arreglo.push(objeto11);

    return arreglo;
}
function arregloAnio() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- anio --' }
    const objeto = { idSelect: 2023, descripcion: '2023' }
    const objeto1 = { idSelect: 2024, descripcion: '2024' }
    const objeto2 = { idSelect: 2025, descripcion: '2025' }
    const objeto3 = { idSelect: 2026, descripcion: '2026' }
    const objeto4 = { idSelect: 2027, descripcion: '2027' }
    const objeto5 = { idSelect: 2028, descripcion: '2028' }

    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);
    arreglo.push(objeto2);
    arreglo.push(objeto3);
    arreglo.push(objeto4);
    arreglo.push(objeto5);

    return arreglo;
}
function SeleccionMultiple() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- Selecciona --' }
    const objeto = { idSelect: 1, descripcion: 'SI' }
    const objeto1 = { idSelect: 2, descripcion: 'NO' }


    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);

    return arreglo;
}
function arregloIdentificación() {
    var arreglo = [];
    const objeto0 = { idSelect: 0, descripcion: '-- identificación --' }
    const objeto = { idSelect: 1, descripcion: 'INE' }
    const objeto1 = { idSelect: 2, descripcion: 'no proporcionada' }


    arreglo.push(objeto0);
    arreglo.push(objeto);
    arreglo.push(objeto1);

    return arreglo;

}

function Carga_Informacion_selec_quejas() {
    return new Promise((resolve, reject) => {
        fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
            //console.log(data);
            let abogado = data.lista3;
            let estado = data.lista4;
            let autoridad = data.lista2;
            let estadoRM = data.lista5;
            //console.log(abogado);
            //console.log(estado);
            //console.log(estadoRM);

            CargaDatosSelectOtro("#lugar", estado);
            CargaDatosSelectOtro("#nomAbogado", abogado);
            CargaDatosSelectOtro("#Input_LugarHechos", estado);
            CargaDatosSelectOtro("#origenPet", estado);
            CargaDatosSelectOtro("#catMunicipio_hechos", estado);
            CargaDatosSelectOtro("#catEstado_hechos", estadoRM);

            var idUser = $("#idusuario").val();
            //console.log("ID_USER_SELECT:" + idUser);
            $('#nomAbogado > option[value="' + idUser + '"]').attr('selected', 'selected');
            $('#idabogado').val(idUser);
            $('#idpet').val('1165');
            $('#idEscrito_').val('2');
            $('#nomAbogado').val(idUser).trigger('change.select2');
            $("#nomAbogado").prop('readOnly', true);
            $("#nombrePet").prop('readOnly', true);
            $("#edadPet").prop('readOnly', true);
            $("#sabeleerPet").prop('readOnly', true);
            $("#escolaridadPet").prop('readOnly', true);
            $("#callePet").prop('readOnly', true);
            $("#numextPet").prop('readOnly', true);
            $("#numintPet").prop('readOnly', true);
            $("#cpPet").prop('readOnly', true);
            $("#coloniaPet").prop('readOnly', true);
            $("#municipioPet").prop('readOnly', true);
            $("#estadoPet").prop('readOnly', true);
            $("#ocupacionPet").prop('readOnly', true);
            $("#telPet").prop('readOnly', true);
            $("#correoPet").prop('readOnly', true);
            $("#AutoridadesEI").prop('readOnly', true);

            $("#nomAbogado").css("font-weight", "bold");
            $("#nombrePet").css("font-weight", "bold");
            $("#edadPet").css("font-weight", "bold");
            $("#sabeleerPet").css("font-weight", "bold");
            $("#escolaridadPet").css("font-weight", "bold");
            $("#callePet").css("font-weight", "bold");
            $("#numextPet").css("font-weight", "bold");
            $("#numintPet").css("font-weight", "bold");
            $("#cpPet").css("font-weight", "bold");
            $("#coloniaPet").css("font-weight", "bold");
            $("#municipioPet").css("font-weight", "bold");
            $("#estadoPet").css("font-weight", "bold");
            $("#ocupacionPet").css("font-weight", "bold");
            $("#telPet").css("font-weight", "bold");
            $("#correoPet").css("font-weight", "bold");
            $("#AutoridadesEI").css("font-weight", "bold");
            CambioColorInputs();
            resolve();
        });
    });
}

function cargaInformacionSelectsEscritoInicial(contador, idLugar, ID_Autoridades) {
    fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
        //console.log(data)
        let estado = data.lista4;
        let autoridad = data.lista2;

        CargaDatosSelectOtro("#Input_LugarHechos", estado);
        $("#Input_LugarHechos > option[value='" + idLugar + "']").attr("selected", true);
        $('#Input_LugarHechos').val(idLugar).trigger('change.select2');
        $('#Input_autoridades').empty();
        //CargaDatosSelecAutori("#Input_autoridades", autoridad);
        $("#Input_autoridades" + contador + " > option[value='" + ID_Autoridades + "']").attr("selected", true);
        $('#Input_autoridades' + contador).val(ID_Autoridades).trigger('change.select2');
        RecorreInput('.formularioEscritoInicial');
    })
}
function updateDatosPeticionariosBusq() {
    // Actualizar Peticionario
    $('.formularioPeticionario').submit(function (e) {
        e.preventDefault();

        if (validaTxt() || validaNumero()) {
            return;
        }

        let numFrm = 1;
        let idForm = '#frmDatosPersonales' + numFrm;
        let nombre = $('#nombre_petit-frmDatosPersonales1 option:selected').text();
        var ip = $("#ipAccesible").html();

        $('input[type=radio][name="qatu_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
        $('#idquejagenerado, #versioncomplementopeticionario').prop('disabled', false);
        // Primer AJAX para verificar peticionarios
        $.ajax({
            type: "post",
            url: 'VerificarPeticionarios',
            content: "application/json; charset=utf-8",
            data: $(idForm).serialize() + '&nombreS=' + nombre,
            dataType: "json",
            success: function (data) {
                // Si se detecta un error, mostrar alerta y retornar
                if (data.mensaje !== 'errors') {
                    var titulo = '', texto = '';
                    if (nombre !== '') {
                        titulo = 'El peticionario "' + nombre + '" ya se encuentra registrado como quejoso.'
                    } else {
                        titulo = 'El peticionario ya se encuentra registrado como '
                        if ($('input[type=radio][name="qatu_petit-frmDatosPersonales1"]:checked').val() === 'Peticionario') {
                            titulo += 'quejoso.'
                        } else { titulo += 'agraviado.' }
                        texto = 'Favor de seleccionar otro tipo de usuario.'
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: titulo,
                        text: texto,
                        showConfirmButton: true
                    });
                    //return; // Detiene la ejecución si hay un error
                }
                $('#CURP_petit-frmDatosPersonales1, #apellidop_petit-frmDatosPersonales1, #apellidom_petit-frmDatosPersonales1, #cp_petit-frmDatosPersonales1, #estado_petit-frmDatosPersonales1, #colonia_petit-frmDatosPersonales1, #municipio_petit-frmDatosPersonales1, #ciudad_petit-frmDatosPersonales1, #calle_petit-frmDatosPersonales1, #nexterior_petit-frmDatosPersonales1, #ninterior_petit-frmDatosPersonales1, #fenac_petit-frmDatosPersonales1, #edad_petit-frmDatosPersonales1, #telefono_petit-frmDatosPersonales1, #email_petit-frmDatosPersonales1, #qatu_petit-frmDatosPersonales1, #radsexo_petit-frmDatosPersonales1, #genero_petit-frmDatosPersonales1, #chknacionalidad_petit-frmDatosPersonales1, #chksleer_petit-frmDatosPersonales1, #escosel_petit-frmDatosPersonales1, #econyugal_petit-frmDatosPersonales1, #ocupacion_petit-frmDatosPersonales1, #discapacidad_petit-frmDatosPersonales1, #gsoci_petit-frmDatosPersonales1, #leindi_petit-frmDatosPersonales1, #radsinoviomu_petit-frmDatosCalificacion1').prop('disabled', false);
                //$('#colonia_petit-frmDatosPersonales1, #ciudad_petit-frmDatosPersonales1, #genero_petit-frmDatosPersonales1, #escosel_petit-frmDatosPersonales1, #econyugal_petit-frmDatosPersonales1, #ocupacion_petit-frmDatosPersonales1, #discapacidad_petit-frmDatosPersonales1, #gsoci_petit-frmDatosPersonales1, #leindi_petit-frmDatosPersonales1, #radsinoviomu_petit-frmDatosCalificacion1').prop('disabled', false);
                $('#numFrm,#idcomplementopet1,#idpeticionarioi1,#idquejagenerado').prop('disabled', false);

                $('input[type=radio][name="radsexo_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
                $('input[type=radio][name="chknacionalidad_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
                $('input[type=radio][name="chksleer_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
                $('input[type=radio][name="radsinoviomu_petit-frmDatosCalificacion1"]:disabled').prop('disabled', false);
                // Si no hay error, procede a ejecutar el segundo AJAX
                $.ajax({
                    type: "post",
                    url: 'GuardarDataComplPeticionario',
                    content: "application/json; charset=utf-8",
                    data: $(idForm).serialize() + '&nombreS=' + nombre + '&Ipaccesible=' + ip,
                    dataType: "json",
                    success: function (data) {
                        //console.log(data)

                        if (data.idpeticionario > 0 && data.idcomplemento > 0) {

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Información Actualizada Correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                Swal.fire({
                                    text: 'Cargando Quejas...',
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                    allowOutsideClick: false,
                                    allowEscapeKey: false
                                });
                                $.ajax({
                                    type: "POST",
                                    url: "BuscardorFormatos",
                                    data: $('#frm_busquedaFormatos').serialize(),
                                    dataType: "JSON",
                                    success: function (response) {
                                        mostrarResTblFormatos(response.data);
                                        $("#modalFormPeticionario").modal("hide");
                                        Swal.close();
                                    },
                                    error: function () {
                                        Swal.close();
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Error al actualizar los datos, informe al área de sistemas'
                                        });
                                    }
                                });
                            });
                        } else {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Error al actualizar los datos, informe al área de sistemas',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                });
            }
        });

    });
}

function updateDatosPeticionarios() {
    // Actualizar Peticionario
    $('.formularioPeticionario').submit(function (e) {
        e.preventDefault();

        if (validaTxt() || validaNumero()) {
            return;
        }

        let numFrm = 1;
        let idForm = '#frmDatosPersonales' + numFrm;
        let nombre = $('#nombre_petit-frmDatosPersonales1 option:selected').text();
        var ip = $("#ipAccesible").html();

                $.ajax({
                    type: "post",
                    url: 'GuardarDataComplPeticionario',
                    content: "application/json; charset=utf-8",
                    data: $(idForm).serialize() + '&nombreS=' + nombre + '&Ipaccesible=' + ip,
                    dataType: "json",
                    success: function (data) {
                        //console.log(data)

                        if (data.idpeticionario > 0 && data.idcomplemento > 0) {

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Información Actualizada Correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                Swal.fire({
                                    text: 'Cargando Quejas...',
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                    allowOutsideClick: false,
                                    allowEscapeKey: false
                                });
                                $.ajax({
                                    type: "POST",
                                    url: "BuscardorFormatos",
                                    data: $('#frm_busquedaFormatos').serialize(),
                                    dataType: "JSON",
                                    success: function (response) {
                                        mostrarResTblFormatos(response.data);
                                        $("#modalFormPeticionario").modal("hide");
                                        Swal.close();
                                    },
                                    error: function () {
                                        Swal.close();
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Error al actualizar los datos, informe al área de sistemas'
                                        });
                                    }
                                });
                            });
                        } else {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Error al actualizar los datos, informe al área de sistemas',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                });

    });
}
function complementoFormLugarHchos(estado) {
    var cuerpo = '';
    if (estado) {
        //console.log("Pintando Cuerpo");
        cuerpo = '<div class="text-center">'
            + CreaInputs_Con_Label('calleLH', 'calleLH', '', 'text', '', 'textfield10', 'placeholder="calle"')
            + CreaInputs_Con_Label('numextLH', 'numextLH', '', 'text', '', '', 'placeholder="número exterior"')
            + CreaInputs_Con_Label('numintLH', 'numintLH', '', 'text', '', '', 'placeholder="número interior"')
            + CreaInputs_Con_Label('cpLH', 'cpLH', '', 'text', '', '', 'placeholder="código postal"')
            + CreaInputs_Con_Label('coloniaLH', 'coloniaLH', '', 'text', '', '', 'placeholder="colonia"')
            + '</div>'
    }
    return cuerpo;
}

function eliminaFormatoDatosPeronsales(idcomplemento) {

    swal.fire({
        title: 'Eliminar Peticionario',
        text: "¿Desea eliminar este peticionario?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then(function (resp) {
        if (resp.isConfirmed) {

            let Frmverificap = new FormData();
            Frmverificap.append('id_complemento', idcomplemento);

            fetchPost("Expediente/VerificaPetLigado", "json", Frmverificap, (resp) => {

                if (resp.status == 'existe') {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'No se puede eliminar el peticionario porque esta ligado a una acta circunstanciada',
                        showConfirmButton: false,
                        timer: 3500
                    });
                } else if (resp.status == 'existei') {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'No se puede eliminar el peticionario porque esta ligado a un escrito inicial de queja',
                        showConfirmButton: false,
                        timer: 3500
                    });
                } else if (resp.status == 'noexiste') {
                    let FrmDelPetit = new FormData();
                    FrmDelPetit.append('id_complemento', idcomplemento);

                    fetchPost("Expediente/DeleteComPeticionario", "json", FrmDelPetit, (resp) => {

                        if (resp.status) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Peticionario Eliminado',
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                Swal.fire({
                                    text: 'Cargando Quejas...',
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                    allowOutsideClick: false,
                                    allowEscapeKey: false
                                });
                                $.ajax({
                                    type: "POST",
                                    url: "BuscardorFormatos",
                                    data: $('#frm_busquedaFormatos').serialize(),
                                    dataType: "JSON",
                                    success: function (response) {
                                        mostrarResTblFormatos(response.data);
                                        Swal.close();
                                    },
                                    error: function () {
                                        Swal.close();
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Error al actualizar los datos, informe al área de sistemas'
                                        });
                                    }
                                });
                            });
                        }
                    });
                }

            });

        }
    })

}

function CambioColorInputs() {
    $("#nomAbogado").css("background-color", "#D8D8D8");
    $("#nombrePet").css("background-color", "#D8D8D8");
    $("#edadPet").css("background-color", "#D8D8D8");
    $("#sabeleerPet").css("background-color", "#D8D8D8");
    $("#escolaridadPet").css("background-color", "#D8D8D8");
    $("#callePet").css("background-color", "#D8D8D8");
    $("#numextPet").css("background-color", "#D8D8D8");
    $("#numintPet").css("background-color", "#D8D8D8");
    $("#cpPet").css("background-color", "#D8D8D8");
    $("#coloniaPet").css("background-color", "#D8D8D8");
    $("#municipioPet").css("background-color", "#D8D8D8");
    $("#estadoPet").css("background-color", "#D8D8D8");
    $("#ocupacionPet").css("background-color", "#D8D8D8");
    $("#telPet").css("background-color", "#D8D8D8");
    $("#correoPet").css("background-color", "#D8D8D8");
    $("#AutoridadesEI").css("background-color", "#D8D8D8");
}


function btnGenerapdfp(element) {

    let idform = element.dataset.idform;
    let wspFrame = document.getElementById('frame').contentWindow;
    let html = wspFrame.document.all;
    let fechActual = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
    let fechatxt = fechActual.toString();

    let idcomplemento = $("#idcomplementopet1").val()
    let curpd = $("#CURP_petit-frmDatosPersonales1").val()
    let nombrep = $("#nombre_petit-frmDatosPersonales1").val()
    let apellidope = $("#apellidop_petit-frmDatosPersonales1").val()
    let apellidome = $("#apellidom_petit-frmDatosPersonales1").val()

    if (idcomplemento == '') {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ocurrio un error al obtener los datos, reporte al area de sistemas',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    } else if (curpd == '') {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ingrese la CURP o el nombre completo del peticionario',
            showConfirmButton: false,
            timer: 1500
        });

        return;
    } else if (curpd == 'No proporcionado' && nombrep == '' && apellidope == '' && apellidome == '') {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'En caso de no tener CURP ingrese el nombre completo del peticionario',
            showConfirmButton: false,
            timer: 1500
        });

        return;
    }

    $.ajax({
        type: "POST",
        url: "GetDataPeticionario",
        data: { curp: curpd, nombre: nombrep, apellidop: apellidope, apellidom: apellidome, idcomp: idcomplemento },
        dataType: "JSON",
        success: function (response) {

            if (response.data.length > 0) {
                //console.log(response.data[0]);
                html.dateact.textContent = fechatxt;

                (Array.from(html.chkTipoaq)).forEach(function (input, index) {
                    if (input.value != response.data[0].tipoUsuario) {
                        input.checked = false
                    } else {
                        input.checked = true;
                    }
                });
                html.txtNombre.textContent = response.data[0].nombre;
                html.txtApaterno.textContent = response.data[0].apellidoPat;
                html.txtAmaterno.textContent = response.data[0].apellidoMat;
                html.txtCalle.textContent = response.data[0].calle;
                html.numExt.textContent = response.data[0].numExterior;
                html.numInt.textContent = response.data[0].numInterior;
                html.txtColonia.textContent = response.data[0].colonia;
                html.txtCiudadloc.textContent = response.data[0].ciudad;
                html.txtMunicipio.textContent = response.data[0].municipio;
                html.txtEstado.textContent = response.data[0].estado;
                html.txtCp.textContent = response.data[0].codigoPostal;
                html.txtTelefono.textContent = response.data[0].telefono;
                html.txtEdad.textContent = response.data[0].edad;
                html.txtEmail.textContent = response.data[0].email;

                if (response.data[0].nombre.toUpperCase() === 'NO PROPORCIONADO') { html.txtNombre.style.fontStyle = 'italic'; }
                if (response.data[0].apellidoPat.toUpperCase() === 'NO PROPORCIONADO') { html.txtApaterno.style.fontStyle = 'italic'; }
                if (response.data[0].apellidoMat.toUpperCase() === 'NO PROPORCIONADO') { html.txtAmaterno.style.fontStyle = 'italic'; }
                if (response.data[0].calle.toUpperCase() === 'NO PROPORCIONADO') { html.txtCalle.style.fontStyle = 'italic'; }
                if (response.data[0].numExterior.toUpperCase() === 'NO PROPORCIONADO') { html.numExt.style.fontStyle = 'italic'; }
                if (response.data[0].numInterior.toUpperCase() === 'NO PROPORCIONADO') { html.numInt.style.fontStyle = 'italic'; }
                if (response.data[0].colonia.toUpperCase() === 'NO PROPORCIONADO') { html.txtColonia.style.fontStyle = 'italic'; }
                if (response.data[0].ciudad.toUpperCase() === 'NO PROPORCIONADO') { html.txtCiudadloc.style.fontStyle = 'italic'; }
                if (response.data[0].municipio.toUpperCase() === 'NO PROPORCIONADO') { html.txtMunicipio.style.fontStyle = 'italic'; }
                if (response.data[0].estado.toUpperCase() === 'NO PROPORCIONADO') { html.txtEstado.style.fontStyle = 'italic'; }
                if (response.data[0].codigoPostal.toUpperCase() === 'NO PROPORCIONADO') { html.txtCp.style.fontStyle = 'italic'; }
                if (response.data[0].telefono.toUpperCase() === 'NO PROPORCIONADO') { html.txtTelefono.style.fontStyle = 'italic'; }
                if (response.data[0].edad.toUpperCase() === 'NO PROPORCIONADO') { html.txtEdad.style.fontStyle = 'italic'; }
                if (response.data[0].email.toUpperCase() === 'NO PROPORCIONADO') { html.txtEmail.style.fontStyle = 'italic'; }
                (Array.from(html.chkTipoaq)).forEach(function (input, index) {
                    if (input.value != response.data[0].tipoUsuario) {
                        input.checked = false
                    } else {
                        input.checked = true;
                    }
                });
                (Array.from(html.chkSexo)).forEach(function (input, index) {
                    if (input.value != response.data[0].fkSexo) {
                        input.checked = false
                    } else {
                        input.checked = true;
                    }
                });
                (Array.from(html.chkGenero)).forEach(function (input, index) {
                    if (input.value != response.data[0].genero) {
                        input.checked = false
                    } else {
                        input.checked = true;
                    }
                });
                html.txtOtroGenero.textContent = response.data[0].otroGenero;
                (Array.from(html.chkEscolaridad)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].fkEscolaridad) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                (Array.from(html.chkEstadocon)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].fkEstadoConyugal) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                (Array.from(html.chkOcupacion)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].fkOcupacion) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                html.chkOtraocupacion.textContent = response.data[0].otraOcupacion;
                (Array.from(html.chkNacionalidad)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].nacionalidad) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                (Array.from(html.chkSabeleer)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].sabeLeer) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                (Array.from(html.chkDispacacidad)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].fkDiscapacidad) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                (Array.from(html.chkGsocial)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].fkGrupoSocial) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                html.txtOtroGsoc.textContent = response.data[0].otroGsocial;
                (Array.from(html.chkHablali)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].hablaLenguai) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                html.txtOtraLengiai.textContent = response.data[0].lenguaIndigena;
                if (response.data[0].fechaNacimiento.includes('1900-01-01')) {
                    html.txtFechaNaci.textContent = 'No proporcionado';
                    html.txtFechaNaci.style.fontStyle = 'italic';
                }
                else {
                    html.txtFechaNaci.textContent = moment(new Date(response.data[0].fechaNacimiento).toISOString().split("T")[0]).format('DD/MM/YYYY');
                }

                html.txtOrigenmig.textContent = response.data[0].origenMigrante.length > 0 ? response.data[0].origenMigrante : "";
                html.txtDestinomig.textContent = response.data[0].destinoMigrante;
                (Array.from(html.chkPrimeravm)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].primeravmexMigrante) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                (Array.from(html.chkViolenmuj)).forEach(function (persona, index) {
                    if (persona.value != response.data[0].violenciaVm) {
                        persona.checked = false
                    } else {
                        persona.checked = true;
                    }
                });
                if (response.data[0].violenciaVm == 1) {
                    html.txtCanalizacionvm.textContent = response.data[0].canalizacionVm;
                    (Array.from(html.chkEmbarazada)).forEach(function (persona, index) {
                        if (persona.value != response.data[0].embarazadaVm) {
                            persona.checked = false
                        } else {
                            persona.checked = true;
                        }
                    });
                    (Array.from(html.chkSinhijos)).forEach(function (persona, index) {
                        if (persona.value != response.data[0].fkHijosVivos) {
                            persona.checked = false
                        } else {
                            persona.checked = true;
                        }
                    });
                    (Array.from(html.chkModalidadv)).forEach(function (persona, index) {
                        if (persona.value != response.data[0].fkModalidadViolencia) {
                            persona.checked = false
                        } else {
                            persona.checked = true;
                        }
                    });
                    (Array.from(html.chkTipov)).forEach(function (persona, index) {
                        if (persona.value != response.data[0].fkTipoViolencia) {
                            persona.checked = false
                        } else {
                            persona.checked = true;
                        }
                    });
                    (Array.from(html.chkRelacionAgr)).forEach(function (persona, index) {
                        if (persona.value != response.data[0].fkRelacionAgresor) {
                            persona.checked = false
                        } else {
                            persona.checked = true;
                        }
                    });
                    html.txtIngresosmens.textContent = '$' + response.data[0].ingresosMensuales;
                }


                wspFrame.focus();
                wspFrame.print();
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Datos no encontrados, verifique la curp o el nombre del peticionario',
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            }
        }
    });
}

function funcionesEscritoi() {
    $(document).on('click', '.upload-field', function () {
        var file = $(this).parent().parent().parent().find('.input-file');
        file.trigger('click');
    });
    $(document).on('change', '.input-file', function () {
        $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

    // Prev pdf

    if (document.querySelector("#foto")) {
        var foto = document.querySelector("#foto");
        foto.onchange = function (e) {
            var uploadFoto = document.querySelector("#foto").value;
            var fileimg = document.querySelector("#foto").files;
            var nav = window.URL || window.webkitURL;
            var contactAlert = document.querySelector('#form_alert');
            if (uploadFoto != '') {
                var type = fileimg[0].type;
                var name = fileimg[0].name;
                if (type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png') {
                    contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';
                    if (document.querySelector('#img')) {
                        document.querySelector('#img').remove();
                    }
                    document.querySelector('.delPhoto').classList.add("notBlock");
                    foto.value = "";
                    return false;
                } else {
                    contactAlert.innerHTML = '';
                    if (document.querySelector('#img')) {
                        document.querySelector('#img').remove();
                    }
                    document.querySelector('.delPhoto').classList.remove("notBlock");
                    var objeto_url = nav.createObjectURL(this.files[0]);
                    document.querySelector('.prevPhoto div').innerHTML = "<img id='img' src=" + objeto_url + ">";
                }
            } else {
                alert("No selecciono foto");
                if (document.querySelector('#img')) {
                    document.querySelector('#img').remove();
                }
            }
        }
    }

    if (document.querySelector(".delPhoto")) {
        var delPhoto = document.querySelector(".delPhoto");
        delPhoto.onclick = function (e) {
            removePhoto();
        }
    }

}

function removePhoto(idremove) {
    let elementos = document.querySelectorAll('.removadj' + idremove);

    for (var i = 0; i < elementos.length; i++) {
        elementos[i].remove();
    }
}

function fntVerArchivo(idarchivo, objarchivos, tipoimg) {

    if (tipoimg == '.png' || tipoimg == '.jpg' || tipoimg == '.jpeg') {

        var items = [],
            options = {
                index: 0,
                resizable: false,
                initMaximized: true,
                headerToolbar: ['close'],
            };
        items.push({
            src: rutaUploadei + objarchivos,
            title: objarchivos
        });

        new PhotoViewer(items, options);

    } else if (tipoimg == '.pdf') {
        document.getElementById('titleModaladei').textContent = objarchivos;
        document.getElementById('pdfuploadei').src = rutaUploadei + objarchivos;
        $("#modalArchivoadj").modal("show");
    }
}

function fntDelItem(idelement) {

    swal.fire({
        title: 'Eliminar Archivo Adjunto',
        text: "¿Desea eliminar este archivo ajunto que esta ligado a este escrito inicial?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false
    }).then(function (resp) {
        if (resp.isConfirmed) {

            let FrmArchadj = new FormData();
            FrmArchadj.append('id_archivoadj', idelement);

            fetchPost("Expediente/EliminarArchivoAdj", "json", FrmArchadj, (resp) => {

                if (resp.status) {

                    document.getElementById('adeleteUpload').style.display = 'block';
                    removePhoto(idelement);
                    setTimeout(() => {
                        document.getElementById('adeleteUpload').style.display = 'none';
                    }, "3000");

                }

            });

        }
    })

}


/*apartado modal datos complementarios de la queja*/
function Crear_Formulario_Queja(status) {
    var arregloBlanco = [];
    var cuerpoIzquierda = '';
    var cuerpoDerecha = '';
    var formInnicial = '';
    var fin_form = '';
    let formualarioCompleto;
    var formualarioCompleto1;
    if (status == 'Eliminado' || status == 'Pendiente de turnar'
        || status == 'Turnado parcial a VG'
        || status == 'Turnado a VG'
        || status == 'Pendiente de Returno'
        || status == 'Returnado a VG'
        || status == 'Returnado parcial'
        || status == 'Turnado a VA') {

        cuerpoIzquierda = CreaInputs_Con_Labeldisabled('idquejaDC', 'idquejaDC', '', 'text', 'ID:', 'textfield', 'mes')
            + CreaSelectLabeldisabled('viainterpos', '', arregloBlanco, '', 'Via de interposición: ', '')
            + CreaBR()
            + CreaBR()
            + CreaSelectLabeldisabled('Abogadoqueja', '', arregloBlanco, '', 'Abogado quien Recibe: ', '')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Hechos: ')
            + CreaBR()
            + CreaTextAreadisabled('hechosDC', '', 'style="width:100% "')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Autoridad(es): ')
            + CreaBR()
            + "<div id='contenedor_Autoridades'></div>";
        cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', 'Lugar de los hechos. Municipio y estado: ')
            + CreaBR()
            + CreaSelectLabeldisabled('municipioqueja', '', arregloBlanco, '', '', '')
            + Crea_Label('textfield8', 'textfield8', '', 'Peticionario(s): ')
            + CreaBR()
            //+ CreaInputs_Con_Label('nombrequejoso', 'nombrequejoso', '', 'text', 'Nombre(s):', 'textfield', 'Nombre')
            //+ CreaBR()
            //+ CreaInputs_Con_Label('Apellidos', 'Apellidos', '', 'text', 'Apellidos: ', 'textfield', 'Apellido paterno - Aepllido Materno')
            //+ CreaBR()
            //+ CreaInputs_Con_Label('curp', 'curp', '', 'text', 'CURP: ', 'textfield', 'CURP')
            + "<div id='contenedor_Usuarios'></div>"
            + CreaBR()
            + CreaSelectLabeldisabled('visitaduriaqueja', '', arregloBlanco, '', 'Visitaduría: ', '')
            + CreaBR()
            + CreaInputs_Con_Labeldisabled('Fecha_Registro', 'Fecha_Registro', '', 'date', 'Fecha de Registro: ', 'textfield', '')
            + CreaBR()
            + CreaSelectLabeldisabled('sedeRegistro', '', arregloBlanco, '', 'Sede de Registro: ', '')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Observaciones:')
            + CreaBR()
            + CreaTextAreadisabled('observaciones', '', 'style="width:100% "')
            + CreaBR()
            + CreaBR()
            + crea_Boton('button', 'Guardar', 'saveQueja', 'btn btn-guardarComplemento', 'guardarQueja()')
            + crea_Boton('button', 'Enviar', 'enviarQueja', 'btn btn-enviarComplemento', 'EnviarQueja()');
        formInnicial = '<form class="text-justify formQueja" id="formQueja" name="formQueja" method="post" style="width:90%; margin-left:5%" >';
        fin_form = '</form>';
        formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
        formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;
    }
    else {
         cuerpoIzquierda = CreaInputs_Con_Label('idquejaDC', 'idquejaDC', '', 'text', 'ID:', 'textfield', 'mes')
            + CreaSelectLabel('viainterpos', '', arregloBlanco, '', 'Via de interposición: ', '')
            + CreaBR()
            + CreaBR()
            + CreaSelectLabel('Abogadoqueja', '', arregloBlanco, '', 'Abogado quien Recibe: ', '')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Hechos: ')
            + CreaBR()
            + CreaTextArea('hechosDC', '', 'style="width:100% "')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Autoridad(es): ')
            + CreaBR()
            + "<div id='contenedor_Autoridades'></div>";
         cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', 'Lugar de los hechos. Municipio y estado: ')
            + CreaBR()
            + CreaSelectLabel('municipioqueja', '', arregloBlanco, '', '', '')
            + Crea_Label('textfield8', 'textfield8', '', 'Peticionario(s): ')
            + CreaBR()
            //+ CreaInputs_Con_Label('nombrequejoso', 'nombrequejoso', '', 'text', 'Nombre(s):', 'textfield', 'Nombre')
            //+ CreaBR()
            //+ CreaInputs_Con_Label('Apellidos', 'Apellidos', '', 'text', 'Apellidos: ', 'textfield', 'Apellido paterno - Aepllido Materno')
            //+ CreaBR()
            //+ CreaInputs_Con_Label('curp', 'curp', '', 'text', 'CURP: ', 'textfield', 'CURP')
            + "<div id='contenedor_Usuarios'></div>"
            + CreaBR()
            + CreaSelectLabeldisabled('visitaduriaqueja', '', arregloBlanco, '', 'Visitaduría: ', '')
            + CreaBR()
            + CreaInputs_Con_Label('Fecha_Registro', 'Fecha_Registro', '', 'date', 'Fecha de Registro: ', 'textfield', '')
            + CreaBR()
            + CreaSelectLabel('sedeRegistro', '', arregloBlanco, '', 'Sede de Registro: ', '')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Observaciones:')
            + CreaBR()
            + CreaTextArea('observaciones', '', 'style="width:100% "')
            + CreaBR()
            + CreaBR()
            + crea_Boton('button', 'Guardar', 'saveQueja', 'btn btn-guardarComplemento', 'guardarQueja()')
            + crea_Boton('button', 'Enviar', 'enviarQueja', 'btn btn-enviarComplemento', 'EnviarQueja()');
         formInnicial = '<form class="text-justify formQueja" id="formQueja" name="formQueja" method="post" style="width:90%; margin-left:5%" >';
         fin_form = '</form>';

        formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
        formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;


    }
    $('#izquierda').append(formualarioCompleto);
    $('#derecha').append(formualarioCompleto1);
    return formualarioCompleto;
}
// Método que recibe un elemento input date y un objeto date
function chargeDateInputDate(elem, dateObject = new Date()) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var month = month > 9 ? month : "0" + month;
    var day = dateObject.getDate() > 9 ? dateObject.getDate() : "0" + dateObject.getDate();
    var dateFormat = year + "-" + month + "-" + day;
    elem.value = dateFormat;
}

function traeInformacionDatosComplementarios(idqueja, estatus, fechavalidmodidqot) {
    $('#izquierda').empty();
    $('#derecha').empty();
    Crear_Formulario_Queja(estatus);
    EnviarQueja();
    guardarQueja();
    /* 
    let iformdatosComplementariosQueja = 
    $('.formulariodatoscomplementariosqueja').empty()                                       
    $('.formulariodatoscomplementariosqueja').append(iformdatosComplementariosQueja);*/
    $.ajax({
        type: "POST",
        url: "https://localhost:7126/AltaExpediente/RegresaListaCatalogos",
        data: { identificadorQueja: idqueja },
        dataType: "JSON",
        success: function (response) {

            //console.log(response);

            /*response.informarcionC.informacioncomplementariapeticionario.curp 
            response.informarcionC.informacioncomplementariapeticionario.id_registro
            response.informarcionC.informacioncomplementariapeticionario.nombre_peticionario*/
            CargaDatosSelectOtro_("#Abogadoqueja", response.lista_abogado, response.informarcionC.id_abogado_recibe);
            //CargaDatosSelectOtro_("", response.lista_autoridad);
            //CargaDatosSelectOtro_("#estadoqueja", response.lista_estado);
            CargaDatosSelectOtro_("#municipioqueja", response.lista_municipio, response.informarcionC.id_lugar_hechos);
            CargaDatosSelectOtro_("#sedeRegistro", response.lista_sedes, response.informarcionC.id_sede);
            CargaDatosSelectOtro_("#viainterpos", response.listavi, response.informarcionC.via_interpos);//Cambiar por el id_Via_Interposición
            CargaDatosSelectOtro_("#visitaduriaqueja", response.listavisitadurias, response.informarcionC.visitaduria);
            var inputDate = document.getElementById("Fecha_Registro");
            //Convertir Fecha 13-05-2024 GIPC
            var date = new Date();
            if (response.informarcionC.fecha_registro != null) {
                date = new Date(response.informarcionC.fecha_registro);
            }
            //var date = new Date(response.informarcionC.fecha_registro);
            chargeDateInputDate(inputDate, date);
            //$("#Fecha_Registro").val(response.informarcionC.fecha_registro.toJSON().slice(0, 10));
            $("#idquejaDC").val(response.informarcionC.id_expediente);
            $("#hechosDC").val(response.informarcionC.hechos);
            $("#observaciones").val(response.informarcionC.observaciones);

            //console.log('valores')
            //console.log(response.informarcionC.id_expediente)
            //console.log(response.informarcionC.hechos)
            if (response.informarcionC.informacioncomplementariapeticionario != null) {
                var contadorpeticionarios = response.informarcionC.informacioncomplementariapeticionario.length;
                for (var i = 0; i < contadorpeticionarios; i++) {
                    //console.log(contadorpeticionarios);
                    $("#contenedor_Usuarios").html($("#contenedor_Usuarios").html() + DivPequenios(response.informarcionC.informacioncomplementariapeticionario[i].nombre_peticionario.replace(/No Proporcionado/g, ''), response.informarcionC.informacioncomplementariapeticionario[i].curp, response.informarcionC.informacioncomplementariapeticionario[i].id_registro));
                }
            }

            if (response.informarcionC.informacioncomplementariaautoridad != null) {
                var contadorautoridades = response.informarcionC.informacioncomplementariaautoridad.length;
                for (var i = 0; i < contadorautoridades; i++) {
                    //console.log(contadorautoridades);
                    $("#contenedor_Autoridades").html($("#contenedor_Autoridades").html() + DivPequeniosautoridad(response.informarcionC.informacioncomplementariaautoridad[i].nombre_autoridad, response.informarcionC.informacioncomplementariaautoridad[i].ambito, response.informarcionC.informacioncomplementariaautoridad[i].id_registro));
                }
            }
            if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar' || fechavalidmodidqot === true) {
                $('#frm_altaqueja button[type="button"]').hide();
            }
            RecorreInput('.formulariodatoscomplementariosqueja');
            $("#modaldatoscomplementariosqueja").modal("show");
        }
    });
}
function DivPequenios(nombrepeticionario, curp, idpeticionario) {
    var div = "<div id='Divpequenios'>"
        +
        `
			<div class="dummy dummy-text">
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario.replace(/No Proporcionado/g, '')}</span><span class="tooltipbox-content clearfix">
            <span class="tooltipbox-text"><span style="color:black;font-weight: bold;">Infromación del Peticionario</span><br>
             ID DEL PETIC.: ${idpeticionario}<br>
             CURP:${curp}<br>
             NOMBRE:${nombrepeticionario.replace(/No Proporcionado/g, '')}<br>
            </span></span></span></p>
			</div>
        `+ "</div>";
    +"<img id='add' src='/img/signomas.png'>"




    return div;
}
function DivPequeniosautoridad(nombrepeticionario, curp, idpeticionario) {
    var div = "<div id='Divpequenios'>"
        +
        `
			<div class="dummy dummy-text">
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario}</span><span class="tooltipbox-content clearfix">
            <span class="tooltipbox-text"><span style="color:black;font-weight: bold;">Infromación de la autoridad</span><br>
             ID DE LA AUTORIDAD.: ${idpeticionario}<br>
             ÁMBITO:${curp}<br>
             NOMBRE:${nombrepeticionario}<br>
            </span></span></span></p>
			</div>
        `+ "</div>";
    +"<img id='add' src='/img/signomas.png'>"


    return div;
}
function CargaDatosSelectOtro_(select, arreglo, valor) {
    var htmld = select;
    htmld += '';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelectGenerico}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    //$(select).select2();
    Seleccionar_ValorSelect(select, valor);//ASIGNAR EL VALOR del select al momento que se le añade información
}
function Seleccionar_ValorSelect(nombreSelect, valorPorDefecto) {
    $(nombreSelect + " > option[value='" + valorPorDefecto + "']").attr("selected", true);
}
function EnviarQueja() {
    $("#enviarQueja").click(function (e) {
        e.preventDefault();
        if (validarCamposVaciosInput() || validarCamposVaciosSelect()) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Tienes que completar todos los campos para continuar',
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "https://localhost:7126/AltaExpediente/ActualizaEstatus",
                data: $('.formQueja').serialize(),
                dataType: "JSON",
                success: function (response) {
                    $("#modaldatoscomplementariosqueja").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Escrito Inicial Enviado a turno',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        Swal.fire({
                            text: 'Cargando Quejas...',
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });
                        $.ajax({
                            type: "POST",
                            url: "BuscardorFormatos",
                            data: $('#frm_busquedaFormatos').serialize(),
                            dataType: "JSON",
                            success: function (response) {
                                mostrarResTblFormatos(response.data);
                                Swal.close();
                            },
                            error: function () {
                                Swal.close();
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al actualizar los datos, informe al área de sistemas'
                                });
                            }
                        });
                    });
                }
            });

        }
    });
}
function guardarQueja() {
    $("#saveQueja").click(function (e) {
        e.preventDefault();
        if (validarCamposVaciosInput() || validarCamposVaciosSelect()) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Tienes que completar todos los campos para continuar',
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "https://localhost:7126/AltaExpediente/GuardarQueja",
                data: $('.formQueja').serialize(),
                dataType: "JSON",
                success: function (response) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Se ha Registrado la Información Correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $("#modaldatoscomplementariosqueja").modal("hide");
                }
            });

        }
    });
}
function validarCamposVaciosInput() {
    $("#parrafo").css("color", "#000000");
    var validacion = false;
    if ($('#idquejaDC').val().length === 0) {
        validacion = estiloinputvalidacion('#idquejaDC', validacion);
    }
    /*if ($('#hechos').val().length === 0) {
        validacion = true;
    }*/
    /*if ($('#nombrequejoso').val().length === 0) {
        validacion = estiloinputvalidacion('#nombrequejoso', validacion);
    }
    if ($('#Apellidos').val().length === 0) {
        validacion = estiloinputvalidacion('#Apellidos', validacion);
    }
    if ($('#curp').val().length === 0) {
        validacion = estiloinputvalidacion('#curp', validacion);;
    }*/
    if ($('#Fecha_Registro').val().length === 0) {
        validacion = estiloinputvalidacion('#Fecha_Registro', validacion);;
    }
    if ($('#hechos').length > 0) {
        if ($('#hechos').val().length === 0) {
            validacion = estiloinputvalidacion('#hechos', validacion);;
        }
    } else if ($('#hechosDC').length > 0) {
        if ($('#hechosDC').val().length === 0) {
            validacion = estiloinputvalidacion('#hechosDC', validacion);;
        }
    }
    

    return validacion;
}
function validarCamposVaciosSelect() {
    var validacion = false;
    if ($('#Abogadoqueja').val() == '99') {
        validacion = estiloinputvalidacion('#Abogadoqueja', validacion);
    }
    /*
    if ($('#estadoqueja').val() == '99') {
        validacion = estiloinputvalidacion('#estadoqueja', validacion);
    }
    */
    if ($('#municipioqueja').val() == '99') {
        validacion = estiloinputvalidacion('#municipioqueja', validacion);
    }
    /*
    if ($('#visitaduriaqueja').val() == '99') {
        validacion = estiloinputvalidacion('#visitaduriaqueja', validacion);
    }*/
    if ($('#sedeRegistro').val() == '99') {
        validacion = estiloinputvalidacion('#sedeRegistro', validacion);
    }

    if ($('#viainterpos').val() == '99') {
        validacion = estiloinputvalidacion('#viainterpos', validacion);
    }

    return validacion;
}
function estiloinputvalidacion(nombreInput, boleano) {
    $(nombreInput).css("border", "solid .5px red");
    boleano = true;
    return boleano;
}
function regresaEstadoInputs(idinput) {
    $(idinput).click(function (e) {
        $(idinput).css("border", "solid .5px lightgray");
    });
}
function EstadoGeneral() {
    regresaEstadoInputs('#idqueja');
    //regresaEstadoInputs('#nombrequejoso');
    //regresaEstadoInputs('#Apellidos');
    //regresaEstadoInputs('#curp');
    regresaEstadoInputs('#Fecha_Registro');
}
function CreaSelectLabeldisabled(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel) {

    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" name="' + id + '" ' + tiposelect + ' disabled > <option value="99">Seleccione una opción</option>';

    for (let v = 0; v < arreglo.length; v++) {

        htmld += `

                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>

            `;

    }

    htmld += "</select>";

    return htmld

    //$("#" + id).select2();

}

function CreaInputs_Con_Labeldisabled(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {

    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " disabled>"

}

function CreaTextAreadisabled(Name, clas, adicion) {

    return "<textarea class='" + clas + "' name='" + Name + "' id='" + Name + "' rows='7' cols='50' " + adicion + " disabled></textarea>";

}