
var btn;
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
var aceptados = [];
var codigoArea = '';
var statusTurnoAbogado = '';
var arregloAbogados = [];

let medcaute = "";
var AutoridadesSe1 = [], AutoridadesSe2 = [], MateriaSe = [], TipExpeSe = [], hechvioSe = [], diligenSe = [], temaSe = [], programSe = [], viainter = [], ExpeS_C = [],ExpeConc;
$(document).ready(function () {
    SelectAutoridad(1);
    SelectAutoridad(2);
    fetchGet("Expediente/SelectMateria", "json", (data) => { MateriaSe = data.smateria; })
    fetchGet("Expediente/SelectTipExpediente", "json", (data) => { TipExpeSe = data.stipexped; })
    fetchGet("Expediente/SelectHechVio", "json", (data) => { hechvioSe = data.shechvio; })
    fetchGet("Expediente/SelectDiligen", "json", (data) => { diligenSe = data.sdilige; })
    fetchGet("Expediente/SelectTema", "json", (data) => { temaSe = data.stemas; })
    fetchGet("Expediente/SelectPrograma", "json", (data) => { programSe = data.sprogramas; })
    fetchGet("Expediente/SelectViaInter", "json", (data) => { viainter = data.listviai; })
    fetchGet("Expediente/CausaConclu", "json", (data) => { ExpeConc = data.listacausa; })

    $("#vistavis").html($("#usuarioL").html());
    $(".alert-danger").remove();
    console.log($(".alert-danger"));
    $("#alertNoHayConectados").css("display", "none !important");
    $('#turnarAbo').on('click', function () {


        var Inputs1 = '';
        var Inputs = '';

        var banderaStatus = false;
        $(".idAbogados").each(function (index) {


            //console.log(index + ": " + $(this).val());
            var ArregloidQqueja = $(this).val().toString().split('-');
            var idQueja = ArregloidQqueja[1];
            var statusQueja = ArregloidQqueja[0];
            turnoAbogado(idQueja, statusQueja)

        });
    });

    $('#EnvioID').on('click', function () {


        var Inputs1 = '';
        var Inputs = '';

        var banderaStatus = false;
        $(".statusf").each(function (index) {


            //console.log(index + ": " + $(this).val());
            var ArregloidQqueja = $(this).val().toString().split('-');
            var idQueja = ArregloidQqueja[1];
            var statusQueja = ArregloidQqueja[0];


            const statusexp = {
                idQueja: ArregloidQqueja[1],
                statusQueja: ArregloidQqueja[0],

            }
            // console.log(statusexp);

            if (statusQueja == '0') {


                Inputs += ` id : ${idQueja}<input id="swal-input${idQueja}" class="swal2-input input_justi"> </br>`;
            } else {
                aceptados.push(idQueja);
            }


            if (statusQueja == '99') {

                banderaStatus = true;
            }

        });


        if (banderaStatus) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debes de Acpetar y/o Rechazar todos los ID´s",
            });
        } else
            if (Inputs != '') {
                Inputs1 = 'No.Memo:<input id="memoandum" class="swal2-input"> </br>'
                    + 'Introducción:<textarea id="p1" class="swal2-input"> </textarea> </br>'
                    + 'Cuerpo:<textarea id="p2" class="swal2-input"> </textarea></br></br>'
                    + '<b>Justificación de rechazo de los siguientes ID´s:</b></br>'
                    + Inputs
                    + '</br>Despedida:<textarea id="p3" class="swal2-input"> </textarea>  </br></br>';
                //var inputsf= Inputs1 + Inputs;

                /*Metodo de Swetalert*/
                (async () => {

                    const { value: formValues } = await Swal.fire({
                        title: 'Memorándum de IDs rechazados',
                        html: Inputs1,
                        focusConfirm: false,
                    }).then((result) => {
                        if (result.isConfirmed) {

                            var arreglo_Justificaciones = []; var arregloIds = [];
                            $(".input_justi").each(function (index) {

                                //console.log(index + ": " + $(this).val());
                                var idElemento = $(this).attr('id');
                                var idArreglo = idElemento.substr(10, idElemento.length - 3);
                                //console.log(idArreglo);
                                arreglo_Justificaciones.push($(this).val());
                                arregloIds.push(idArreglo);
                            });



                            var visitaduriad = '';
                            var numeroVisiaduria = codigoArea;
                            var memorandum = $("#memoandum").val();
                            var p1 = $("#p1").val();
                            var p2 = $("#p2").val();
                            var p3 = $("#p3").val();
                            var visitador = "";

                            if (numeroVisiaduria == '1') {
                                visitaduriad = "Primera Visitaduría General";
                                visitador = "Victor Kuri Bujaidar - Primer Visitador General"
                            }
                            else if (numeroVisiaduria == '2') {
                                visitaduriad = "Segunda Visitaduría General";
                                visitador = "Mtro. Israel Villa Cobos - Segundo Visitador General"
                            }
                            else if (numeroVisiaduria == '3') {
                                visitaduriad = "Tercera Visitaduría General";
                                visitador = "Jessica Calderón García - Tercer Visitador General"
                            }
                            else if (numeroVisiaduria == '4') {
                                visitaduriad = "Cuarta Visitaduría General";
                                visitador = "Iván Andrés Flores Cano - Cuarto Visitador General"
                            }

                            //console.log("visd:" + visitaduriad + "memo: " + memorandum + " p1:" + p1 + " p2:" + p2 + " p3:" + p3 + " Arreglo: " + arreglo_Justificaciones);
                            return GeneraPdfRechazados(225, visitaduriad, memorandum, p1, p2, p3, arreglo_Justificaciones, arregloIds, visitador, aceptados);
                        }
                    });

                })()
            } else {
                return GeneraPdfRechazados(225, '', '', '', '', '', '', '', '', aceptados);
            }
        /*Metodo de swetalert*/

        //console.log(elementos);
    });
    codigoArea = $("#idArea").val();
    console.log(codigoArea);
    idusuario = $("#idusuario").val();
    //console.log(idusuario);
    $.ajax({
        type: "POST",
        url: "listadovisitadorGeneral",
        data: { vis: codigoArea, idabogado: idusuario },
        dataType: "JSON",
        success: function (response) {
            console.log(response.data)
            mostrarResTblFormatos(response.data, response.data1);
        }
    });
    btn = document.getElementById("myBtn");

    // Get the button that opens the modal

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on the button, open the modal


    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        //modal.style.display = "none";
        modaltabDetalle.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modaltabDetalle) {
            modaltabDetalle.style.display = "none";
        }
        /*if (event.target == modal) {
            modal.style.display = "none";
        }*/
    }
    // Get the element with id="defaultOpen" and click on it
    //$('input[name="idmedCuate"]').change(function () {
    //    if ($(this).val() === 'Si') {
    //        $('#tablaMedCuate').show();
    //    } else {
    //        $('#tablaMedCuate').hide();
    //    }
    //});
});

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    console.log(document.getElementById(cityName).value);
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function modalShow(id, fecRecep, Tmodal, tip, expedienten,fechaturnoabo,fechacalif) {
    console.log("Expediente al crear el formulario de calificación: " + expedienten);
    document.getElementById(Tmodal).style.display = "block";
    if (tip === 1) {
        closeModal("modaltabCalif");
    }
    if (Tmodal == "modaltabDetalle")
    {
        document.getElementById("defaultOpenD").click();
        Crear_Formulario_Queja(id);
        obtenerDQOT(id, fecRecep, "");
        Crear_Formulario_QuejaEdit(id, "V");//Calificación Expediente
        obtenerDQOTModifica(id, fecRecep, "V", expedienten);
        Crear_Formulario_QuejaEdit(id, "M");//Modificación Expediente
        obtenerDQOTModifica(id, fecRecep, "M", expedienten);
        if (fechacalif !== '') {
            $("#Det_Conclusion").css("display", "block");
            Crear_Formulario_Quejaconclusion(id, fechaturnoabo, fechacalif, "M");//Conclusion Expediente
        } else {
            $("#Det_Conclusion").css("display", "none");
        }
    }
    else {
        $("#Conclu").css("display", "none");//esconder o mostrar la tab de conclusión
        document.getElementById("defaultOpenCa").click();
        Crear_Formulario_QuejaEdit(id, "E");
        $("#defaultOpenD").addClass("active");
        Crear_Formulario_Quejaconclusion(id, fechaturnoabo, fechacalif, "E");
        obtenerDQOTModifica(id, fecRecep, "E", expedienten);
    }
}
function confirmdatos(idquej, hech, lug, pet) {
    $.ajax({
        type: "POST",
        url: "UpdateConfirmaDQOT",
        data: { idqueja: idquej, hechos: hech, lugar: lug, petic: pet },
        dataType: "JSON",
        success: function (response) {
            if (response.estatus === true) {
                //Swal.fire({
                //    position: 'center',
                //    icon: 'success',
                //    title: 'Dato Validado',
                //    showConfirmButton: false,
                //    timer: 1500
                //});
            }
        }
    });

}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("defaultOpenD").click();
    document.getElementById("defaultOpenCa").click();
});

function closeModal(Tmodal) {
    document.getElementById(Tmodal).style.display = "none";
}
var tableBuscadorFormatos = $("#tablaRecepcion");

function mostrarResTblFormatos(response, response1) {
    if ($.fn.DataTable.isDataTable(tableBuscadorFormatos)) {
        $(tableBuscadorFormatos).DataTable().clear().destroy();
    }
    tableBuscadorFormatos.DataTable({
        language: {
            "url": "/js/TablaJson.json"
        },
        iDisplayLength: 20,
        data: response,
        fixedHeader: true,
        orderCellsTop: true,
        fixedHeader: true,
        columns: [
            { data: 'expediente' },
            {
                'mRender': function (data, type, full) {
                    if (full.fechaCalific && full.fechaCalific.includes('Sin Fecha de Calificación')) { full.fechaCalific = ''; }
                    btnEscritook = `<button id="myBtn" type='button' onclick='modalShow(${full.id}, "${full.fechaRecep}", "modaltabDetalle","","${full.expediente}", "${full.fechaTunAbo}", "${full.fechaCalific}")' class='btn btn-link margin-iconbf'>
                                                ${full.id}
                                           </button>`;
                    return btnEscritook
                }
            },
            { data: 'fechaTurno' },
            { data: 'fechaRecep' },
            { data: 'fechaTunAbo' },
            { data: 'fechaCalific' },
            { data: 'semaforo1' },
            { data: 'concluido' },
            { data: 'semaforo2' },
            {
                'mRender': function (data, type, full) {
                    if (full.fechaCalific && full.fechaCalific.includes('Sin Fecha de Calificación')) { full.fechaCalific = ''; }
                    if (full.expediente !== 'PENDIENTE' && full.status == 'Calificado') {
                        //full.expediente
                        btnEscritook = `<button id="myBtn" type='button' onclick='modalShow(${full.id}, "${full.fechaRecep}", "modaltabCalif","","${full.expediente}", "${full.fechaTunAbo}", "${full.fechaCalific}")' class='btn btn-info status-badge rounded'>Modificar</button>`;
                    } else if (full.expediente !== 'PENDIENTE' && full.status == 'Concluido')
                    {
                        btnEscritook = '';
                        //btnEscritook = `<button id="myBtn" type='button' onclick='modalShow(${full.id}, "${full.fechaRecep}", "modaltabCalif","","${full.expediente}", "${full.fechaTunAbo}", "${full.fechaCalific}")' class='btn btn-info status-badge rounded'>Consultar</button>`;

                    }else {
                        btnEscritook = `<button id="myBtn" type='button' onclick='modalShow(${full.id}, "${full.fechaRecep}", "modaltabCalif","","${full.expediente}")' class='btn btn-info status-badge rounded'>Calificar</button>`;
                    }
                    return btnEscritook
                }
            }
        ],
        initComplete: function () {
            if ($('#tablaRecepcion thead tr').length === 1) {
                $('#tablaRecepcion thead tr').clone(true).appendTo('#tablaRecepcion thead');
            }
            $('#tablaRecepcion thead tr:eq(1) th').each(function (i) {
                if (!$(this).hasClass("noFilter")) {
                    var title = $(this).text();
                    $(this).html('<input type="text" placeholder="Buscar" />');

                    $('input', this).on('keyup change', function () {
                        if (table.column(i).search() !== this.value) {
                            table
                                .column(i)
                                .search(this.value)
                                .draw();
                        }
                    });
                } else {
                    $(this).html('<span></span>');
                }
            });
        },
        order: [1, 'desc'],
        bDestroy: true
    });
    //tableBuscadorFormatos.DataTable().on("draw", function (data) {

    //    //activarBtnTurnopre();

    //})
}



function ModalDetalle() {
    $("#modalformularioEscritoInicial").modal("show");
}



function RecuperaIds(idexp) {

    $.ajax({
        type: "POST",
        url: "RegresaIDSFormatos_chris",
        data: { idExp: idexp },
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            for (var i = 0; i < response.lista1.length; i++) {
                $("#DatosPersonales").append(`<button class="tablinks"
                               onclick="btnGenerapdfp(${response.lista1[i].idComplementoPeticionario},'', '${response.lista1[i].nombrePeticionario}','', '')"
                id="defaultOpen"> peticionario: ${response.lista1[i].nombrePeticionario}</button>`);
            }
            for (var i = 0; i < response.lista2.length; i++) {
                $("#ActaC").append(`<button class="tablinks"
                               onclick="GeneraActaC_pdf(${response.lista2[i].idActaC})" id="defaultOpen">Acta con ID:${response.lista2[i].idActaC}</button>`);
            }
            for (var i = 0; i < response.lista3.length; i++) {
                $("#EscritoI").append(`<button class="tablinks"
                               onclick="GeneraEscrito_pdf(${response.lista3[i].idActaC})" id="defaultOpen">Escrito con ID:${response.lista3[i].idActaC}</button>`);
            }

        }
    });
}

/*apartado modal datos complementarios de la queja*/
function Crear_Formulario_Queja(id) {
    $('#izquierda').empty();
    $('#derecha').empty();
    console.log("Entro al método de crear el formulario de queja");
    var arregloBlanco = [];
    var cuerpoIzquierda = CreaInputs_Con_Labeldisabled('idqueja', 'idqueja', '', 'text', 'ID:', 'textfield', 'mes')
        + `<button type="button" class="" style="border:hidden; background:none;" title="Información recabada por la DQOT" onclick="GeneraDocumento_pdf('pilin','IDQOT',${id})"> <span aria-hidden="true"><i class="fa fa-file-pdf-o" style="color: red;"></i></span> </button>`
        + CreaBR()
        + CreaSelectLabeldisabled('viainterpos', '', arregloBlanco, '', 'Vía de interposición: ', '')
        + CreaBR()
        + Crea_Label_Icono('textfield8', 'textfield8', '', 'Acta Circunstanciada: ', id, 1)
        + Crea_Label_Icono('textfield8', 'textfield8', '', 'Escrito Inicial: ', id, 2)
        + CreaBR()
        + CreaSelectLabeldisabled('Abogadoqueja', '', arregloBlanco, '', 'Abogado(a) que recibe: ', '')
        + CreaBR()
        + CreaInputs_Con_Labeldisabled('Fecha_Registro', 'Fecha_Registro', '', 'date', 'Fecha de Registro: ', 'textfield', '')
        + CreaBR()
        + CreaInputs_Con_Labeldisabled('Fecha_TurnoVG', 'Fecha_TurnoVG', '', 'date', 'Fecha de turno a VG: ', 'textfield')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Hechos: ')
        + CreaBR()
        + CreaTextAreadisabled('hechos', '', 'style="width:100%;"')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Autoridad(es): ')
        + CreaBR()
        + "<div id='contenedor_Autoridades'></div>";
    var cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', 'Lugar de los hechos. Municipio y Estado: ')
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
        + CreaSelectLabeldisabled('sedeRegistro', '', arregloBlanco, '', 'Sede de Registro: ', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Observaciones DQOT: ')
        + CreaBR()
        + CreaTextAreadisabled('observaciones', '', 'style="width:100%; height:28%"')
        + CreaBR()
        + CreaBR();
    var formInnicial = '<form class="text-justify formQueja" id="formQueja" name="formQueja" method="post" style="width:100%; margin-left:5%" >';
    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
    let formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;

    $('#izquierda').append(formualarioCompleto);
    $('#derecha').append(formualarioCompleto1);
    return formualarioCompleto;
}

function Crear_Formulario_QuejaEdit(id, tipo) {
    $(`#izquierda${tipo}`).empty();
    $(`#derecha${tipo}`).empty();
    console.log("Entro al método de crear el formulario de queja");
    var arregloBlanco = [];
    var cuerpoIzquierda = CreaInputs_Con_Labeldisabled(`idqueja${tipo}`, 'idqueja', '', 'text', 'ID:', 'textfield', 'mes')
        + `<button id="botonpdf${tipo}" type="button" class="" style="border:hidden; background:none;" title="Cédula de Calificación" onclick="GeneraDocumento_pdf('pilin','IDCC',${id})"> <span aria-hidden="true"><i class="fa fa-file-pdf-o" style="color: red;"></i></span> </button>`
        + CreaBR()
        + CreaSelectLabeldisabled(`viainterpos${tipo}`, '', arregloBlanco, '', 'Vía de interposición: ', '')
        + CreaBR()
        + Crea_Label_Icono('textfield8', 'textfield8', '', 'Acta Circunstanciada DQOT: ', id, 1)
        + Crea_Label_Icono('textfield8', 'textfield8', '', 'Escrito Inicial DQOT: ', id, 2)
        + CreaBR()
        + CreaSelectLabeldisabled(`Abogadoqueja${tipo}`, '', arregloBlanco, '', 'Abogado(a) que recibe: ', '')
        + CreaBR()
        + CreaInputs_Con_Labeldisabled(`Fecha_Registro${tipo}`, `Fecha_Registro${tipo}`, '', 'date', 'Fecha de Registro: ', 'textfield', '')
        + CreaBR()
        + CreaInputs_Con_Labeldisabled(`Fecha_TurnoVG${tipo}`, `Fecha_TurnoVG${tipo}`, '', 'date', Requeridos() + 'Fecha de turno a VG: ', 'textfield', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', Requeridos() + 'Hechos: ')
        + icono_editar(`hechos${tipo}`, id, `icohechos${tipo}`, tipo) + checkbox('Validar info. DQOT', `confi_hechos${tipo}`, '', '', 'pulsacionrellow')
        + CreaBR()
        + CreaTextAreadisabled(`hechos${tipo}`, '', 'style="width:100%; height:26%"')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Autoridad(es): ')
        + CreaBR()
        + `<div id='contenedor_Autoridades${tipo}'></div>`;
    var cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', Requeridos() + 'Lugar de los hechos. Municipio y Estado: ')
        + icono_editar(`municipioqueja${tipo}`, id, `icomuni${tipo}`, tipo) + checkbox('Validar info. DQOT', `confi_lughec${tipo}`, '', '', 'pulsacionrellow')
        + CreaBR()
        + CreaSelectLabeldisabled(`municipioqueja${tipo}`, '', arregloBlanco, '', '', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Peticionario(s): ')
        + `<button id="btnaddpers${tipo}" type='button' onclick='AddFormatDatosPersonales(${id})' class='btn btn-link margin-iconbf'>
                                               <span class="fa fa-plus color-muted fa-1x"></span></p>
                                           </button>`
        + checkbox('Validar info. DQOT', `confi_peticiona${tipo}`, '', 'disabled', 'pulsacionrellow') + `<span id="cont_pet${tipo}" style="font-size: 12px;">0/0</span><span style="font-size: 12px;"> peticionarios(a) confirmados</span>`
        + CreaBR()
        + `<div id='contenedor_Usuarios${tipo}'></div>`
        + CreaBR()
        + CreaSelectLabeldisabled(`visitaduriaqueja${tipo}`, '', arregloBlanco, '', Requeridos() + 'Visitaduría: ', '')
        + CreaBR()
        + CreaSelectLabeldisabled(`sedeRegistro${tipo}`, '', arregloBlanco, '', 'Sede de Registro: ', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Observaciones: ')
        + icono_editar(`observaciones${tipo}`, id, `icobserv${tipo}`, tipo)
        + CreaBR()
        + CreaTextAreadisabled(`observaciones${tipo}`, '', 'style="width:100%; height:21%"');
    var formInnicial = '<form class="text-justify formQueja" id="formQueja" name="formQueja" method="post" style="width:100%; margin-left:2%;">';
    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
    let formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;

    $(`#izquierda${tipo}`).append(formualarioCompleto);
    $(`#derecha${tipo}`).append(formualarioCompleto1);
    $(`#municipioqueja${tipo}`).select2();
    //return formualarioCompleto;
}

function Crear_Formulario_Quejaconclusion(id,fechaturno,fechacalif, tipo) {
    $(`#izquierda${tipo}C`).empty();
    //$('#derechaEC').empty();
    console.log("Entro al método de crear el formulario de conclusión");
    var arregloBlanco = [];
    var cuerpoIzquierda = crearTabla(`#izquierda${tipo}C`, `tablaconclu${tipo}`, ["Acciones", "Fecha de conclusión", "Clave/Causa de conclusión", "Acto Restituido", "Observación"], `#izquierda${tipo}C`, '');
    var formInnicial = `<form class="text-justify formCausa${tipo}C" id="formCausa${tipo}C" name="formCausa${tipo}C" method="post" style="width:100%; margin-left:2%;">`;
    var fin_form = '</form>';
    let formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
    $(`#izquierda${tipo}C`).append(formualarioCompleto);
    LlenarTabConclu(`#tablaconclu${tipo}`, tipo, id, fechaturno, fechacalif);
    

    /*
     * 
     * 
     */
    
    //let formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;

    
    //$('#derechaE').append(formualarioCompleto1);
    //return formualarioCompleto;
}


function obtenerDQOT(idqueja, fecRecep, tipo) {
    var ajaxDQOT = $.ajax({
        type: "POST",
        url: "https://localhost:7126/AltaExpediente/RegresaListaCatalogosCalf",
        data: { identificadorQueja: idqueja, version: 'DQOT', candado: 0 },
        dataType: "JSON"
    });

    ajaxDQOT.done(function (response) {
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
        console.log(response);
        CargaDatosSelectOtro_(`#Abogadoqueja${tipo}`, response.lista_abogado, response.informarcionC.id_abogado_recibe);
        CargaDatosSelectOtro_(`#municipioqueja${tipo}`, response.lista_municipio, response.informarcionC.id_lugar_hechos);
        CargaDatosSelectOtro_(`#sedeRegistro${tipo}`, response.lista_sedes, response.informarcionC.id_sede);
        CargaDatosSelectOtro_(`#viainterpos${tipo}`, response.listavi, response.informarcionC.via_interpos);
        CargaDatosSelectOtro_(`#visitaduriaqueja${tipo}`, response.listavisitadurias, response.informarcionC.visitaduria);
        var iddatospeti = false;
        if (response.datvaldqot.id_queja) {
            if (response.datvaldqot.hechos === '1') {
                $(`#confi_hechos${tipo}`).prop('checked', response.datvaldqot.hechos).trigger('change'); $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow'); }
            else if (response.datvaldqot.hechos === '3') { $(`#confi_hechos${tipo}`).prop('checked', false).trigger('change'); $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow'); $(`#confi_hechos${tipo}`).prop('disabled', true); }
            if (response.datvaldqot.lugar === '1') {
                $(`#confi_lughec${tipo}`).prop('checked', response.datvaldqot.lugar).trigger('change'); $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow'); }
            else if (response.datvaldqot.lugar === '3') { $(`#confi_lughec${tipo}`).prop('checked', false).trigger('change'); $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow'); $(`#confi_lughec${tipo}`).prop('disabled', true); }
            if (response.datvaldqot.petic === '1') {
                $(`#confi_peticiona${tipo}`).prop('checked', response.datvaldqot.petic).trigger('change'); $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow'); }
            else if (response.datvaldqot.petic === '3') { $(`#confi_peticiona${tipo}`).prop('checked', false).trigger('change'); $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow'); $(`#confi_peticiona${tipo}`).prop('disabled', true); }
            console.log(response.datvaldqot);
            iddatospeti = response.datvaldqot.datospeti;
            console.log(iddatospeti);
        }
        if (response.informarcionC.estatus_Expediente == 'Calificado' || response.informarcionC.estatus_Expediente == 'Concluido') {
            $(`#confi_hechos${tipo}`).prop('disabled', true);
            $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow');
            $('#icohechosE').prop('hidden', false);
            $(`#confi_lughec${tipo}`).prop('disabled', true);
            $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow');
            $('#icomuniE').prop('hidden', false);
            $(`#confi_peticiona${tipo}`).prop('disabled', true);
            $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow');
            $('#btnaddpersE').prop('hidden', false);
        }

        var date = new Date();
        if (response.informarcionC.fecha_registro != null) {
            date = new Date(DDMMYYYY_HHMMtoYYYYMMDD_HHMM(response.informarcionC.fecha_registro));
        }
        chargeDateInputDate(document.getElementById(`Fecha_Registro${tipo}`), date);
        if (fecRecep != null) {
            date = new Date(DDMMYYYY_HHMMtoYYYYMMDD_HHMM(fecRecep));
        }
        chargeDateInputDate(document.getElementById(`Fecha_TurnoVG${tipo}`), date);
        $(`#idqueja${tipo}`).val(response.informarcionC.id_expediente);
        $(`#hechos${tipo}`).val(response.informarcionC.hechos);
        $(`#observaciones${tipo}`).val(response.informarcionC.observaciones);
        
        console.log('valores')
        console.log(response.informarcionC.id_expediente)
        console.log(response.informarcionC.hechos)
        //$(`#contenedor_Usuarios${tipo}`).html('');
        if (response.informarcionC.informacioncomplementariapeticionario != null) {
            var contadorpeticionarios = response.informarcionC.informacioncomplementariapeticionario.length;
            for (var i = 0; i < contadorpeticionarios; i++) {
                console.log(contadorpeticionarios);
                $(`#contenedor_Usuarios${tipo}`).html($(`#contenedor_Usuarios${tipo}`).html() + DivPequenios(response.informarcionC.informacioncomplementariapeticionario[i].nombre_peticionario, response.informarcionC.informacioncomplementariapeticionario[i].curp, response.informarcionC.informacioncomplementariapeticionario[i].id_registro, response.informarcionC.informacioncomplementariapeticionario[i].tipo, response.informarcionC.informacioncomplementariapeticionario[i].idtip_compet, iddatospeti,idqueja));
            }
        }

        if (response.informarcionC.informacioncomplementariaautoridad !== null && response.informarcionC.informacioncomplementariaautoridad !== undefined && response.informarcionC.informacioncomplementariaautoridad.length > 0) {
            var contadorautoridades = response.informarcionC.informacioncomplementariaautoridad.length;
            for (var i = 0; i < contadorautoridades; i++) {
                console.log(contadorautoridades);
                $(`#contenedor_Autoridades${tipo}`).html($(`#contenedor_Autoridades${tipo}`).html() + DivPequeniosautoridad(response.informarcionC.informacioncomplementariaautoridad[i].nombre_autoridad, response.informarcionC.informacioncomplementariaautoridad[i].ambito, response.informarcionC.informacioncomplementariaautoridad[i].id_registro));
            }
        } else {
            $(`#contenedor_Autoridades${tipo}`).html($(`#contenedor_Autoridades${tipo}`).html() + "<div id='Divpequenios'><div class='dummy dummy-text'><p><span>NO PROPORCIONADO</span></p></div></div>");
        }
        RecorreInput('.formulariodatoscomplementariosqueja');
        $("#modaldatoscomplementariosqueja").modal("show");
        $(`#ListAport${tipo}`).empty();
        $(`#tipQueja${tipo}`).empty();
    });
}

function obtenerDQOTModifica(idqueja, fecRecep, tipo, expedienten) {
    var candado = "", version = '';
    switch (tipo) {
        case 'E':
            version = 'EDICION';
            candado = 1;
            break;
        case 'V':
            version = 'CALIFICACION';
            candado = 1;
            $(`#botonpdf${tipo}`).attr("onclick", `GeneraDocumento_pdf('pilin','IDCC',${idqueja})`);
            break;
        case 'M':
            version = 'MODIFICACION';
            candado = 1;
            $(`#botonpdf${ tipo }`).attr("onclick", `GeneraDocumento_pdf('pilin','IDCM',${idqueja})`);
            break;
    }
    if (version !== "") {

        var ajaxDQOT = $.ajax({
            type: "POST",
            url: "https://localhost:7126/AltaExpediente/RegresaListaCatalogosCalfModifi",
            data: { identificadorQueja: idqueja, version: version, candado: candado },
            dataType: "JSON"
        });

        ajaxDQOT.done(function (response) {
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
            console.log(response);
            CargaDatosSelectOtro_(`#Abogadoqueja${tipo}`, response.lista_abogado, response.informarcionC.id_abogado_recibe);
            CargaDatosSelectOtro_(`#municipioqueja${tipo}`, response.lista_municipio, response.informarcionC.id_lugar_hechos);
            CargaDatosSelectOtro_(`#sedeRegistro${tipo}`, response.lista_sedes, response.informarcionC.id_sede);
            CargaDatosSelectOtro_(`#viainterpos${tipo}`, response.listavi, response.informarcionC.via_interpos);
            CargaDatosSelectOtro_(`#visitaduriaqueja${tipo}`, response.listavisitadurias, response.informarcionC.visitaduria);
            var iddatospeti = [];
            if (response.datvaldqot.id_queja) {
                if (response.datvaldqot.hechos === '1') { $(`#confi_hechos${tipo}`).prop('checked', response.datvaldqot.hechos).trigger('change'); $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow'); }
                else if (response.datvaldqot.hechos === '3') { $(`#confi_hechos${tipo}`).prop('checked', false).trigger('change'); $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow'); $(`#confi_hechos${tipo}`).prop('disabled', true); }
                if (response.datvaldqot.lugar === '1') { $(`#confi_lughec${tipo}`).prop('checked', response.datvaldqot.lugar).trigger('change'); $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow'); }
                else if (response.datvaldqot.lugar === '3') { $(`#confi_lughec${tipo}`).prop('checked', false).trigger('change'); $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow'); $(`#confi_lughec${tipo}`).prop('disabled', true); }
                if (response.datvaldqot.petic === '1') { $(`#confi_peticiona${tipo}`).prop('checked', response.datvaldqot.petic).trigger('change'); $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow'); }
                else if (response.datvaldqot.petic === '3') { $(`#confi_peticiona${tipo}`).prop('checked', false).trigger('change'); $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow'); $(`#confi_peticiona${tipo}`).prop('disabled', true); }
                console.log(response.datvaldqot);
                iddatospeti = response.datvaldqot.infodatpeticio;
                console.log(iddatospeti);
            }
            if (tipo !== 'E') {
                $(`#confi_hechos${tipo}`).prop('disabled', true);
                $(`#icohechos${tipo}`).prop('hidden', true);
                $(`#confi_lughec${tipo}`).prop('disabled', true);
                $(`#icomuni${tipo}`).prop('hidden', true);
                $(`#confi_peticiona${tipo}`).prop('disabled', true);
                $(`#btnaddpers${tipo}`).prop('hidden', true);
                $(`#icobserv${tipo}`).prop('hidden', true);
            }
            if (response.informarcionC.estatus_Expediente == 'Calificado' || response.informarcionC.estatus_Expediente == 'Concluido') {
                $(`#confi_hechos${tipo}`).prop('disabled', true);
                $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow');
                $('#icohechosE').prop('hidden', false);
                $(`#confi_lughec${tipo}`).prop('disabled', true);
                $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow');
                $('#icomuniE').prop('hidden', false);
                $(`#confi_peticiona${tipo}`).prop('disabled', true);
                $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow');
                $('#btnaddpersE').prop('hidden', true);
            }

            var date = new Date();
            if (response.informarcionC.fecha_registro != null) {
                date = new Date(DDMMYYYY_HHMMtoYYYYMMDD_HHMM(response.informarcionC.fecha_registro));
            }
            chargeDateInputDate(document.getElementById(`Fecha_Registro${tipo}`), date);
            if (fecRecep != null && !fecRecep.includes('-')) {
                date = new Date(DDMMYYYY_HHMMtoYYYYMMDD_HHMM(fecRecep));
                chargeDateInputDate(document.getElementById(`Fecha_TurnoVG${tipo}`), date);
            } else if (fecRecep != null && fecRecep.includes('-')) {
                $(`#Fecha_TurnoVG${tipo}`).val(fecRecep);
            }
            $(`#idqueja${tipo}`).val(response.informarcionC.id_expediente);
            $(`#hechos${tipo}`).val(response.informarcionC.hechos);
            $(`#observaciones${tipo}`).val(response.informarcionC.observaciones);

            console.log('valores')
            console.log(response.informarcionC.id_expediente)
            console.log(response.informarcionC.hechos)
            //$(`#contenedor_Usuarios${tipo}`).html('');

            if (response.informarcionC.informacioncomplementariapeticionario != null) {
                var contadorpeticionarios = response.informarcionC.informacioncomplementariapeticionario.length;
                $(`#cont_pet${tipo}`).html('');
                //var totValDQOTPET = contadorpeticionarios-iddatospeti.length
                $(`#cont_pet${tipo}`).html(`${iddatospeti.length}/${contadorpeticionarios}`);
                if (iddatospeti.length === contadorpeticionarios) {
                    $(`#confi_peticiona${tipo}`).prop('checked', true).trigger('change'); $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow');
                }
                for (var i = 0; i < contadorpeticionarios; i++) {
                    console.log(contadorpeticionarios);
                    var coincidencias = iddatospeti.filter(p => p.id_peticionario === response.informarcionC.informacioncomplementariapeticionario[i].id_registro);
                    var validpet = 'False';
                    if (coincidencias.length !== 0) { validpet = coincidencias[0].datospet; }
                    $(`#contenedor_Usuarios${tipo}`).html($(`#contenedor_Usuarios${tipo}`).html() + DivPequenioss(response.informarcionC.informacioncomplementariapeticionario[i].nombre_peticionario, response.informarcionC.informacioncomplementariapeticionario[i].curp, response.informarcionC.informacioncomplementariapeticionario[i].id_registro, response.informarcionC.informacioncomplementariapeticionario[i].tipo, response.informarcionC.informacioncomplementariapeticionario[i].idtip_compet, validpet, idqueja, response.informarcionC.informacioncomplementariapeticionario[i].conreg));
                }
            }

            if (response.informarcionC.informacioncomplementariaautoridad !== null && response.informarcionC.informacioncomplementariaautoridad !== undefined && response.informarcionC.informacioncomplementariaautoridad.length > 0) {
                var contadorautoridades = response.informarcionC.informacioncomplementariaautoridad.length;
                for (var i = 0; i < contadorautoridades; i++) {
                    console.log(contadorautoridades);
                    $(`#contenedor_Autoridades${tipo}`).html($(`#contenedor_Autoridades${tipo}`).html() + DivPequeniosautoridad(response.informarcionC.informacioncomplementariaautoridad[i].nombre_autoridad, response.informarcionC.informacioncomplementariaautoridad[i].ambito, response.informarcionC.informacioncomplementariaautoridad[i].id_registro));
                }
            } else {
                $(`#contenedor_Autoridades${tipo}`).html($(`#contenedor_Autoridades${tipo}`).html() + "<div id='Divpequenios'><div class='dummy dummy-text'><p><span>NO PROPORCIONADO</span></p></div></div>");
            }
            RecorreInput('.formulariodatoscomplementariosqueja');
            $("#modaldatoscomplementariosqueja").modal("show");
            $(`#ListAport${tipo}`).empty();
            if (response.infoaportaciones.length > 0 && response.informarcionC.tipo_expediente === 1) {
                $(`#ListAport${tipo}`).append(Crea_Label('textfield8', 'textfield8', '', 'ID´s aportados: '));
                const listaAport = response.infoaportaciones;
                listaAport.forEach(item => {
                    $(`#ListAport${tipo}`).append(`<button id="myBtn${item.id_expediente}" type="button" onclick='modalShow(${item.id_expediente}, "${fecRecep}", "modaltabDetalle", 1)' class="btn btn-link margin-iconbf">
                                            ${item.id_expediente}
                                          </button>`);
                });
            }
            $(`#tipQueja${tipo}`).empty();
            $(`#tipQueja${tipo}`).append(Requeridos() + CreaSelectLabel(`tipexpediente-frmDatosCalificacion${tipo}`, 'required', TipExpeSe, '', 'Tipo de expediente', '', ''));

            $(document).ready(function () {
                $(`#tipexpediente-frmDatosCalificacion${tipo}`).change(function () {
                    var tipoExpediente = $(this).val();
                    console.log("Respuesta Estatus:" + response.informarcionC.estatus_Expediente);
                    if (tipoExpediente == 1) {
                        var pasot = response.informarcionC.estatus_Expediente;
                        CrearFormuCalificacion(idqueja, tipo, response.informarcionC.fecha_mod, pasot, expedienten, version);
                    } else {
                        var ajaxSelectExpeSC = $.ajax({
                            type: "POST",
                            url: "SelectExpeSC",
                            data: { vis: response.informarcionC.visitaduria },
                            dataType: "JSON"
                        });
                        $.when(ajaxSelectExpeSC).done(function (data) {
                            ExpeS_C = data.lisexsiconc;
                            CrearFormuCalificacionApo(tipo, response.informarcionC.fecha_mod);
                        });
                    }
                });
                $(`select[id^=causaccatcve]`).change(function (e) {
                    //alert(this.value);
                    console.log("Entró al cambio de causaccatcve_");
                    $(this).parent().find('select[id^=causaccat]').val(this.value).trigger('change.select2');
                    $(this).val(this.value).trigger('change.select2');
                    var causa = `${this.value}`;
                    Habilita_Acto_Rest(causa);
                });
                $('select[id^=causaccat]').on("change", (function (e) {
                    console.log("Entró al cambio de causaccat");
                    // alert(this.value);
                    $(this).val(this.value).trigger('change.select2');
                    $(this).parent().find('select[id^=causaccatcve]').val(this.value).trigger('change.select2');
                    var causa = `${this.value}`;
                    Habilita_Acto_Rest(causa);
                    e.stopPropagation();
                }));
            });
        });

        $.when(ajaxDQOT).done(function (response) {
            if (tipo === '') {
                CrearFormuCalificacion(idqueja, tipo, response.informarcionC.fecha_mod, response.informarcionC.estatus_Expediente, expedienten, version);
                $(`#submitForm${tipo}-${idqueja}`).hide();
                $(`#especializado-frmDatosCalificacion${tipo}`).prop('disabled', true);
                $(`#trancpub-frmDatosCalificacion${tipo}`).prop('disabled', true);
                $(`#tipexpediente-frmDatosCalificacion${tipo}`).prop('disabled', true);
                $(`#materia-frmDatosCalificacion${tipo}`).prop('disabled', true);
                $(`#nivries-frmDatosCalificacion${tipo}`).prop('disabled', true);
            } else {
                if (response.informarcionC.tipo_expediente === 1) {
                    console.log(expedienten);
                    CrearFormuCalificacion(idqueja, tipo, response.informarcionC.fecha_mod, response.informarcionC.estatus_Expediente, expedienten, version);
                } else {
                    var ajaxSelectExpeSC = $.ajax({
                        type: "POST",
                        url: "SelectExpeSC",
                        data: { vis: response.informarcionC.visitaduria },
                        dataType: "JSON"
                    });
                    $.when(ajaxSelectExpeSC).done(function (data) {
                        ExpeS_C = data.lisexsiconc;
                        CrearFormuCalificacionApo(tipo, response.informarcionC.fecha_mod);
                        if (response.infoaportaciones.length == 1) {
                            response.infoaportaciones.forEach(function (i, y) {
                                $(`#expedsc-frmDatosCalificacion${tipo}`).val(i.id_expediente_apor === '' ? 99 : i.id_expediente_apor).trigger('change.select2');
                                $(`#descapo-frmDatosCalificacion${tipo}`).val(i.descripcion);

                                $('#Titulo_Modal').html(' ');
                                $('#Titulo_Modal').html('APORTACIÓN AL EXPEDIENTE: ' + $('select[id="expedsc-frmDatosCalificacion"] option:selected').text());

                            });
                        }
                    });
                }
            }
            $(`#tema-frmDatosCalificacion${tipo}`).val(response.lista_tema_expe.map(function (item) { return item.id_tema; })).trigger('change');
            $(`#programa-frmDatosCalificacion${tipo}`).val(response.informarcionC.id_programa === '' ? 99 : response.informarcionC.id_programa).trigger('change.select2');
            $(`#especializado-frmDatosCalificacion${tipo}`).val(response.informarcionC.id_especializado === '' ? 99 : response.informarcionC.id_especializado);
            $(`#trancpub-frmDatosCalificacion${tipo}`).val(response.informarcionC.id_tras_op_pub === '' ? 99 : response.informarcionC.id_tras_op_pub);
            $(`#tipexpediente-frmDatosCalificacion${tipo}`).val(response.informarcionC.tipo_expediente === '' ? 99 : response.informarcionC.tipo_expediente);
            $(`#materia-frmDatosCalificacion${tipo}`).val(response.informarcionC.id_materia === '' ? 99 : response.informarcionC.id_materia);
            $(`#nivries-frmDatosCalificacion${tipo}`).val(response.informarcionC.id_niv_riesgo === '' ? 99 : response.informarcionC.id_niv_riesgo);
        });
        $(`#confi_hechos${tipo}`).change(function () {
            if (tipo === 'E') {
                if ($(this).is(':checked')) {
                    $(`#icohechosE`).prop('hidden', true);
                    $('#hechosE').prop('disabled', true);
                    $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow');
                    confirmdatos($('#idquejaE').val(), '1', '', '');
                }
                else {
                    $('#icohechosE').prop('hidden', false);
                    $(`#confi_hechos${tipo}`).addClass("pulsacionrellow");
                    confirmdatos($('#idquejaE').val(), '0', '', '');
                }
            }
        });
        $(`#confi_lughec${tipo}`).change(function () {
            if (tipo === 'E') {
                if ($(this).is(':checked')) {
                    $('#icomuniE').prop('hidden', true);
                    $('#municipioquejaE').prop('disabled', true);
                    $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow');
                    confirmdatos($('#idquejaE').val(), '', '1', '');
                }
                else {
                    $('#icomuniE').prop('hidden', false);
                    $(`#confi_lughec${tipo}`).addClass("pulsacionrellow");
                    confirmdatos($('#idquejaE').val(), '', '0', '');
                }
            }
        });
        $(`#confi_peticiona${tipo}`).change(function () {
            if (tipo === 'E') {
                if ($(this).is(':checked')) {
                    $(`#confi_peticiona${tipo}`).removeClass('pulsacionrellow');
                    confirmdatos($('#idquejaE').val(), '', '', '1');
                }
                else {
                    $(`#confi_peticiona${tipo}`).addClass("pulsacionrellow");
                    confirmdatos($('#idquejaE').val(), '', '', '0');
                }
            }
        });
    }
}

function RecorreInput(form) {
    console.log("Recorriendo input y select")
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

// Método que recibe un elemento input date y un objeto date
function chargeDateInputDate(elem, dateObject = new Date()) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var month = month > 9 ? month : "0" + month;
    var day = dateObject.getDate() > 9 ? dateObject.getDate() : "0" + dateObject.getDate();
    var dateFormat = year + "-" + month + "-" + day;
    elem.value = dateFormat;
}
function traeInformacionDatosComplementarios(idqueja, estatus) {
    $('#izquierda').empty();
    $('#derecha').empty();
    Crear_Formulario_Queja(idqueja);
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

            console.log(response);
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
            $("#idqueja").val(response.informarcionC.id_expediente);
            $("#hechos").val(response.informarcionC.hechos);
            var inputDate = document.getElementById("Fecha_Registro");
            var date = new Date(response.informarcionC.fecha_registro)
            chargeDateInputDate(inputDate, date);
            //$("#Fecha_Registro").val(response.informarcionC.fecha_registro.toJSON().slice(0, 10));
            //$(`#contenedor_Usuarios${tipo}`).html('');
            if (response.informarcionC.informacioncomplementariapeticionario != null) {
                var contadorpeticionarios = response.informarcionC.informacioncomplementariapeticionario.length;
                for (var i = 0; i < contadorpeticionarios; i++) {
                    console.log(contadorpeticionarios);
                    $(`#contenedor_Usuarios${tipo}`).html($(`#contenedor_Usuarios${tipo}`).html() + DivPequenios(response.informarcionC.informacioncomplementariapeticionario[i].nombre_peticionario, response.informarcionC.informacioncomplementariapeticionario[i].curp, response.informarcionC.informacioncomplementariapeticionario[i].id_registro, idqueja));
                }
            }

            if (response.informarcionC.informacioncomplementariaautoridad !== null && response.informarcionC.informacioncomplementariaautoridad !== undefined && response.informarcionC.informacioncomplementariaautoridad.length > 0) {
                var contadorautoridades = response.informarcionC.informacioncomplementariaautoridad.length;
                for (var i = 0; i < contadorautoridades; i++) {
                    console.log(contadorautoridades);
                    $(`#contenedor_Autoridades${tipo}`).html($(`#contenedor_Autoridades${tipo}`).html() + DivPequeniosautoridad(response.informarcionC.informacioncomplementariaautoridad[i].nombre_autoridad, response.informarcionC.informacioncomplementariaautoridad[i].ambito, response.informarcionC.informacioncomplementariaautoridad[i].id_registro));
                }
            } else {
                $(`#contenedor_Autoridades${tipo}`).html($(`#contenedor_Autoridades${tipo}`).html() + "<div id='Divpequenios'><div class='dummy dummy-text'><p><span>NO PROPORCIONADO</span></p></div></div>");
            }
            if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar') {
                $('#frm_altaqueja button[type="button"]').hide();
            }

            $("#modaldatoscomplementariosqueja").modal("show");

        }
    });
}
function DivPequenioss(nombrepeticionario, curp, idpeticionario, tipopeticionario, idtip_compet, statusComplemento, idqueja, numrep) {
    var div = '';
    console.log("Estatus complento: " + statusComplemento);
    if (numrep <= 1 && statusComplemento === 'False') {
        div = `
                        <div id='Divpequenios'>
                            <div class="dummy dummy-text">
                                <p>
                                    <span class="tooltipbox tooltipbox-effect-1">
                                        <span class="tooltipbox-item">${nombrepeticionario}</span>
                                        <span class="tooltipbox-content clearfix">
                                            <span class="tooltipbox-text">
                                                <span style="color:black;font-weight: bold;">Información del Peticionario</span><br>
                                                ID DEL PETIC.: ${idpeticionario}<br>
                                                CURP: ${curp}<br>
                                                NOMBRE: ${nombrepeticionario}<br>
                                                TIPO: ${tipopeticionario}<br>
                                                <input type="text" id="idtip_compet" value="${idpeticionario}-${idtip_compet}" hidden>
                                            </span>
                                        </span>
                                    </span>
                                    <button id="myBtn" type='button' onclick='editFormatDatosPersonalesCalificacion(${idpeticionario}, ${idtip_compet}, "", "True")' class='btn btn-link margin-iconbf'>
                                        <span class="fa fa-pencil color-muted fa-1x"></span>
                                    </button>
                                    <button id="myBtn" type='button' onclick='eliminaFormatoDatosPeronsales(${idtip_compet}, this)' class='btn btn-link margin-iconbf'>
                                        <span class="fa fa-trash color-muted fa-1x"></span>
                                    </button>
                                </p>
                            </div>
                        </div>`;
    } else if (numrep > 1 && statusComplemento === 'False') {
        div = `
                        <div id='Divpequenios'>
                            <div class="dummy dummy-text">
                                <p>
                                    <span class="tooltipbox tooltipbox-effect-1">
                                        <span class="tooltipbox-item">${nombrepeticionario}</span>
                                        <span class="tooltipbox-content clearfix">
                                            <span class="tooltipbox-text">
                                                <span style="color:black;font-weight: bold;">Información del Peticionario</span><br>
                                                ID DEL PETIC.: ${idpeticionario}<br>
                                                CURP: ${curp}<br>
                                                NOMBRE: ${nombrepeticionario}<br>
                                                TIPO: ${tipopeticionario}<br>
                                                <input type="text" id="idtip_compet" value="${idpeticionario}-${idtip_compet}" hidden>
                                            </span>
                                        </span>
                                    </span>
                                    <button id="myBtn" type='button' onclick='warnningpet()' class='btn btn-link margin-iconbf'>
                                        <span class="fa fa-pencil color-muted fa-1x"></span>
                                    </button>
                                    <button id="myBtn" type='button' onclick='editFormatDatosPersonalesCalificacion(${idpeticionario}, ${idtip_compet}, "Concluido", "True")' class='btn btn-link margin-iconbf'>
                                        <span class="fa fa-search color-muted fa-1x"></span>
                                    </button>
                                    <button id="myBtn" type='button' onclick='eliminaFormatoDatosPeronsales(${idtip_compet}, this)' class='btn btn-link margin-iconbf'>
                                        <span class="fa fa-trash color-muted fa-1x"></span>
                                    </button>
                                </p>
                            </div>
                        </div>`;
    } else if (statusComplemento === 'True') {
        div = `
                        <div id='Divpequenios'>
                            <div class="dummy dummy-text">
                                <p>
                                    <span class="tooltipbox tooltipbox-effect-1">
                                        <span class="tooltipbox-item">${nombrepeticionario}</span>
                                        <span class="tooltipbox-content clearfix">
                                            <span class="tooltipbox-text">
                                                <span style="color:black;font-weight: bold;">Información del Peticionario</span><br>
                                                ID DEL PETIC.: ${idpeticionario}<br>
                                                CURP: ${curp}<br>
                                                NOMBRE: ${nombrepeticionario}<br>
                                                TIPO: ${tipopeticionario}<br>
                                                <input type="text" id="idtip_compet" value="${idpeticionario}-${idtip_compet}" hidden>
                                            </span>
                                        </span>
                                    </span>
                                    <button id="myBtn" type='button' onclick='editFormatDatosPersonalesCalificacion(${idpeticionario}, ${idtip_compet}, "Concluido", "False")' class='btn btn-link margin-iconbf'>
                                        <span class="fa fa-search color-muted fa-1x"></span>
                                    </button>
                                </p>
                            </div>
                        </div>`;
    }
    return div;
}

function warnningpet() {
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'El ID_CURP tiene más de una queja ligada, no se puede editar los datos. Se debe eliminar el peticionario y agregar otro.'
    });
}

function DivPequenios(nombrepeticionario, curp, idpeticionario, tipopeticionario, idtip_compet, statusComplemento,idqueja) {

    var div = '';
    console.log("Estatus complento: "+statusComplemento);
    if (statusComplemento==='True') {
        div = "<div id='Divpequenios'>"
            +
            `
			<div class="dummy dummy-text">
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario}</span><span class="tooltipbox-content clearfix">
            <span class="tooltipbox-text"><span style="color:black;font-weight: bold;">Infromación del Peticionario</span><br>
             ID DEL PETIC.: ${idpeticionario}<br>
             CURP:${curp}<br>
             NOMBRE:${nombrepeticionario}<br>
             TIPO:${tipopeticionario}<br>
             <input type="text" id="idtip_compet" value="${idpeticionario}-${idtip_compet}" hidden>
            </span></span></span>
             <button id="myBtn" type='button' onclick='editFormatDatosPersonalesCalificacion(${idpeticionario},${idtip_compet},"Completo","${statusComplemento}")' class='btn btn-link margin-iconbf'>
                                               <span class="fa fa-search color-muted fa-1x"></span></p>
                                           </button>
			</div>
        `+ "</div>";
        +"<img id='add' src='/img/signomas.png'>"
    } else {
        div = "<div id='Divpequenios'>"
            +
            `
			<div class="dummy dummy-text">
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario}</span><span class="tooltipbox-content clearfix">
            <span class="tooltipbox-text"><span style="color:black;font-weight: bold;">Infromación del Peticionario</span><br>
             ID DEL PETIC.: ${idpeticionario}<br>
             CURP:${curp}<br>
             NOMBRE:${nombrepeticionario}<br>
             TIPO:${tipopeticionario}<br>
             <input type="text" id="idtip_compet" value="${idpeticionario}-${idtip_compet}" hidden>
            </span></span></span>
             <button id="myBtn" type='button' onclick='editFormatDatosPersonalesCalificacion(${idpeticionario},${idtip_compet},"Completo",false)' class='btn btn-link margin-iconbf'>
                                               <span class="fa fa-pencil color-muted fa-1x"></span></p>
                                           </button>
             <button id="myBtn" type='button' onclick='eliminaFormatoDatosPeronsales(${idtip_compet}, this)' class='btn btn-link margin-iconbf'>
                                               <span class="fa fa-trash color-muted fa-1x"></span></p>
                                           </button>
			</div>

        `+ `</div>`;


    }
    /*            <button id="myBtnpdf" type='button' onclick='btnGenerapdfp(${idtip_compet},'${curp}','${nombrepeticionario}','','')' class='btn btn-link margin-iconbf'>
                                               <span class="fa fa-file-pdf-o color-muted fa-1x"></span></p>
                                           </button>*/
    return div;
}

function AddFormatDatosPersonales(idExpediente) {
    let formPetitn = formPeticionario(1)
    $('.frmEditDatosPersonales').append(formPetitn);
    $('button[id^=validapeticionario]').hide();
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
    $("input[name=qatu_petit-frmDatosPersonales" + idform + "][value = 'Agraviado']").prop("disabled", true);
    $("#modalFormPeticionario").modal("show");
    updateDatosPeticionarios();
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

                            $("input[name=radsinoviomu_petit-frmDatosPersonalesE" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                            $("#vmembara_petit-frmDatosPersonales" + idform).val(response.data[0].embarazadaVm)
                            $("#vmhijos_petit-frmDatosPersonales" + idform).val(response.data[0].fkHijosVivos)
                            $("#vmmodvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkModalidadViolencia)
                            $("#vmtvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkTipoViolencia)
                            $("#vmreviagr_petit-frmDatosPersonales" + idform).val(response.data[0].fkRelacionAgresor)

                            document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.remove("dis-none"));
                        } else {
                            violenciamujer = 'No';
                            $("input[name=radsinoviomu_petit-frmDatosPersonalesE" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
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
function eliminaFormatoDatosPeronsales(idcomplemento) {

    swal.fire({
        title: 'Eliminar Peticionario',
        text: "¿Desea eliminar este peticionario de la calificación del Expediente?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then(function (resp) {
        if (resp.isConfirmed) {
            let FrmDelPetit = new FormData();
            FrmDelPetit.append('id_complemento', idcomplemento);
            var Fecha_TurnoVGE = $("#Fecha_TurnoVGE").val();
            var Titulo_Modal = $('#Titulo_Modal').html();
            fetchPost("Expediente/DeleteComPeticionarioCalificacion", "json", FrmDelPetit, (resp) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'El peticionario se eliminó del ID Correctamente',
                    showConfirmButton: true
                }).then(function () {
                    console.log("Despues de dar click en el boton, aqui llamarias al submit");
                    $('#contenedor_AutoridadesE').html('');
                    $('#contenedor_UsuariosE').html('');
                    var expedi = 'PENDIENTE';
                    if (!Titulo_Modal.includes('Calificación')) {
                        expedi = Titulo_Modal.replace('Modificación del Exp: ', '');
                    }
                    obtenerDQOTModifica($('#idquejaE').val(), Fecha_TurnoVGE, 'E', expedi);
                    //location.reload();
                });
            })
        }

    })

}
function DivPequeniosautoridad(nombrepeticionario, curp, idpeticionario) {
    var div =
   `<div id='Divpequenios'>
        <div class="dummy dummy-text">
            <p>
                <span class="tooltipbox tooltipbox-effect-1">
                    <span class="tooltipbox-item">${nombrepeticionario}</span>
                    <span class="tooltipbox-content clearfix" style="max-width: 120% !important;">
                        <span class="tooltipbox-text">
                            <span style="color:black;font-weight: bold;">Infromación de la autoridad</span><br>
                            ID DE LA AUTORIDAD.: ${idpeticionario}<br>
                            ÁMBITO:${curp}<br>
                            NOMBRE:${nombrepeticionario}<br>
                        </span>
                    </span>
                </span>
            </p>
        </div>
    </div>`;
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
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Escrito Inicial Enviado a turno',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $("#modaldatoscomplementariosqueja").modal("hide");
                    $.ajax({
                        type: "POST",
                        url: "BuscardorFormatos",
                        data: $('#frm_busquedaFormatos').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            mostrarResTblFormatos(response.data, response.data1);
                        }
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
    if ($('#idqueja').val().length === 0) {
        validacion = estiloinputvalidacion('#idqueja', validacion);
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
    if ($('#hechos').val().length === 0) {
        validacion = estiloinputvalidacion('#hechos', validacion);;
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
function CreaInputs_Con_Label(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function diasEnUnMes(mes, año) {
    return new Date(año, mes, 0).getDate();
}
function CreaInputs_Con_Labeldate(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {

    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "'  class='" + clas + "' name='" + Name + "' " + adicion + ">"
}

function calcular(fecha, operacion, dias) {
    var date = fecha.split("-"),
        hoy = new Date(date[0], date[1], date[2]),
        dias = parseInt(dias),
        calculado = new Date(),
        dateResul = operacion == "sumar" ? hoy.getDate() + dias : hoy.getDate() - dias;
    calculado.setDate(dateResul);

    var fechaformateada = '';

    if (calculado.getMonth().toString().length == 1) {
        if (calculado.getDate().toString().length==1) {
            fechaformateada = calculado.getFullYear() + "-0" + (calculado.getMonth() + 1) + "-0" + calculado.getDate();
        } else
        {
            fechaformateada = calculado.getFullYear() + "-0" + (calculado.getMonth() + 1) + "-" + calculado.getDate();
        }
        
    } else
    {
        if (calculado.getDate().toString().length == 1) {
            fechaformateada = calculado.getFullYear() + "-" + (calculado.getMonth() + 1) + "-0" + calculado.getDate();
        } else {
            fechaformateada = calculado.getFullYear() + "-" + (calculado.getMonth() + 1) + "-" + calculado.getDate();
        }
    }
    return fechaformateada
}


function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '') {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" class="' + clas + '" name="' + id + '" ' + tiposelect + '> <option value="99">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $("#" + id).select2();
    return htmld
}
function CreaSelectLabelinverso(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '') {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" class="' + clas + '" name="' + id + '" ' + tiposelect + '> <option value="99">Selecciona la clave</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].idSelect}</option>
            `;
    }
    htmld += "</select>";

    $("#" + id).select2();
    return htmld
}
function CreaBR() {
    return "</br>"
}
function Crea_Label(idParrafo, Name, clas, texto) {
    return "<label name='" + Name + "' id='" + idParrafo + "' class='" + clas + "'>" + texto + "</label> ";
}
function Crea_Label_Icono(idParrafo, Name, clas, texto, idexpediente, modo) {
    var complmento = '';
    if (modo == 1) {
        $.ajax({
            type: "POST",
            async: false,
            url: "RegresaIDSFormatos_chris",
            data: { idExp: idexpediente },
            dataType: "JSON",
            success: function (response) {
                for (var i = 0; i < response.lista2.length; i++) {
                    complmento += `<button id="myBtn" type="button" onclick="GeneraDocumento_pdf('acta_c_${response.lista2[i].idActaC}.pdf','AC')" class="btn btn-link margin-iconbf">
                                                <span class="fa fa-file-pdf-o color-muted fa-1x"></span>
                                           </button>`;

                }
            }
        });
    } else
        if (modo == 2) {
            $.ajax({
                type: "POST",
                async: false,
                url: "RegresaIDSFormatos_chris",
                data: { idExp: idexpediente },
                dataType: "JSON",
                success: function (response) {
                    for (var i = 0; i < response.lista3.length; i++) {
                        complmento += `<button id="myBtn" type="button" onclick="GeneraDocumento_pdf('Escrito_I_${response.lista3[i].idActaC}.pdf','EI')" class="btn btn-link margin-iconbf">
                                                <span class="fa fa-file-pdf-o color-muted fa-1x"></span>
                                           </button>`;

                    }
                }
            });
        }

    console.log(complmento);
    return "<label name='" + Name + "' id='" + idParrafo + "' class='" + clas + "'>" + texto + "</label> " + complmento;

}
function CreaTextArea(Name, clas, adicion) {
    return "<textarea class='" + clas + "' name='" + Name + "' id='" + Name + "' rows='7' cols='50' " + adicion + " ></textarea>";
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
    $("#" + id).select2();
    return htmld
}

function CreaInputs_Con_Labeldisabled(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " disabled>"
}

function CreaTextAreadisabled(Name, clas, adicion) {
    return "<textarea class='" + clas + "' name='" + Name + "' id='" + Name + "' rows='7' cols='50' " + adicion + " disabled></textarea>";
}
function crea_Boton(tipo, texto, id, clase, click) {
    return " <button onclick=" + click + " id='" + id + "' class='" + clase + "' type='" + tipo + "' value='" + texto + "''>" + texto + "</button>";
}

function CreaInputs(idParrafo, Name, clas, tipo) {
    let br = '';
    if (tipo != 'hidden') {
        br = '</br>';
    }
    return "<input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' > " + br
}
/*apartado modal datos complementarios de la queja*/

/*apartado modal datos Peticionario*/
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
        console.log(this.value)
        if (this.value == 'Si') {
            document.querySelectorAll('.frmviolenciam' + idfrm).forEach(p => p.classList.remove("dis-none"));
            $('.frmviolenciam' + idfrm + ' input[type=text]', '.frmviolenciam' + idfrm + ' select').each(function () {
                $(this).attr('required', true)
            });
            $('.viomujer').each(function () {
                console.log(this)
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
        console.log(this.value)
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
function editFormatDatosPersonalesCalificacion(idregistro, idcomplemento, estatus,esta, idpeticionario) {

    let formPetitn = formPeticionario(1)
    $('.frmEditDatosPersonales').append(formPetitn);
    chkNoproporcinado();
    seltxt();
    keypresscp();
    fetchGet("Expediente/SelectPaises", "json", (data) => {
        let Paises = data.relacionpaises;
        console.log(Paises)
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
            console.log(response)
             
            if (response.data.length > 0) {
                $("#versioncomplementopeticionario").val("versioncalificacion");
                $("#idcomplementopet1").val(idcomplemento);
                $('#idpeticionarioi1').val(idregistro);
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

                    $("input[name=radsinoviomu_petit-frmDatosPersonalesE" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                    $("#vmembara_petit-frmDatosPersonales" + idform).val(response.data[0].embarazadaVm)
                    $("#vmhijos_petit-frmDatosPersonales" + idform).val(response.data[0].fkHijosVivos)
                    $("#vmmodvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkModalidadViolencia)
                    $("#vmtvio_petit-frmDatosPersonales" + idform).val(response.data[0].fkTipoViolencia)
                    $("#vmreviagr_petit-frmDatosPersonales" + idform).val(response.data[0].fkRelacionAgresor)

                    document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.remove("dis-none"));
                } else {
                    violenciamujer = 'No';
                    $("input[name=radsinoviomu_petit-frmDatosPersonalesE" + idform + "][value='" + violenciamujer + "']").prop("checked", true);
                    document.querySelectorAll('.frmviolenciam' + idform).forEach(p => p.classList.add("dis-none"));
                }


                $("input[name=qatu_petit-frmDatosPersonales" + idform + "][value='" + response.data[0].tipoUsuario + "']").prop("checked", true);
                $("input[name=qatu_petit-frmDatosPersonales" + idform + "][value != '" + response.data[0].tipoUsuario + "']").prop("disabled", false);
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
                            $("#modalFormPeticionario").modal("show");

                        }).fail(function () { console.log('Ha ocurrido un error en obtener las localidades') });

                    }).fail(function () { console.log('Ha ocurrido un error al obtener datos de un cp') });

                } else {
                    $("#modalFormPeticionario").modal("show");

                }
                updateDatosPeticionarios();
                if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar' || estatus == 'Concluido') {
                    $('.frmEditDatosPersonales button[id^="submitForm-"]').hide();
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

    if (esta === 'False') {
        //var formulario = $('form[id^="frmDatosPersonales1"]');
        //$('form[id^="frmDatosPersonales1"] :input').prop('disabled', true);
        //$('#gpdfForm').prop('disabled', false);
        $('button[id^=validapeticionario]').prop('disabled', true);
    } else {
        $('button[id^=validapeticionario]').prop('disabled', false);
    }


}
function updateDatosPeticionarios() {
    // Actualizar Peticionario

    $('button[id^=validapeticionario]').click(function (e) {
        e.preventDefault();
        var idquejaE = $('#idquejaE').val();
        var Fecha_TurnoVGE = $("#Fecha_TurnoVGE").val();
        var idpeticionarioi = $('#idpeticionarioi1').val();
        var Titulo_Modal = $('#Titulo_Modal').html();
        $.ajax({
            type: "POST",
            url: "ActualizaDatoscompementariosPetVAV",
            data: { idqueja: idquejaE, status: 1, peticionario:idpeticionarioi },
            dataType: "JSON",
            success: function (response) {

                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Se han validado los datos del peticionario.',
                    showConfirmButton: false,
                    timer: 3000
                }).then(function () {
                    console.log("Despues de dar click en el boton, aqui llamarias al submit");
                    $('button[id^=validapeticionario]').hide();
                    $('#contenedor_AutoridadesE').html('');
                    $('#contenedor_UsuariosE').html('');
                    $('#modalFormPeticionario').modal('hide');
                    var expedi = 'PENDIENTE';
                    if (!Titulo_Modal.includes('Calificación')) {
                        expedi = Titulo_Modal.replace('Modificación del Exp: ', '');
                    }
                    obtenerDQOTModifica(idquejaE, Fecha_TurnoVGE, 'E', expedi);
                    //location.reload();
                });

            }
        });
    });

    $('.formularioPeticionario').submit(function (e) {
        e.preventDefault();
        if (validaTxt() || validaNumero()) {
            return;
        }

        let numFrm = 1;
        let idForm = '#frmDatosPersonales' + numFrm;
        var Fecha_TurnoVGE = $("#Fecha_TurnoVGE").val();
        var Titulo_Modal = $('#Titulo_Modal').html();
        $.ajax({
            type: "post",
            url: 'GuardarDataComplPeticionario',
            content: "application/json; charset=utf-8",
            data: $(idForm).serialize(),
            dataType: "json",
            success: function (data) {
                //console.log(data)

                if (data.idpeticionario > 0 && data.idcomplemento > 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Información del peticionario Actualizada de manera Correcta',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function () {
                        console.log("Despues de dar click en el boton, aqui llamarias al submit");
                        $('#confi_peticionaE').prop('checked', false).trigger('change');
                        $('#confi_peticionaE').removeClass('pulsacionrellow');
                        $('#confi_peticionaE').prop('disabled', true);
                        confirmdatos($('#idquejaE').val(), '', '', '3');
                        $('#contenedor_AutoridadesE').html('');
                        $('#contenedor_UsuariosE').html('');
                        $('#modalFormPeticionario').modal('hide');
                        var expedi = 'PENDIENTE';
                        if (!Titulo_Modal.includes('Calificación')) {
                            expedi = Titulo_Modal.replace('Modificación del Exp: ', '');
                        }
                        obtenerDQOTModifica($('#idquejaE').val(), Fecha_TurnoVGE, 'E', expedi);
                        //location.reload();
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
                         name: "versioncomplementopeticionario",
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
                            0: 'Quejoso',
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
                            1: 'idNoGenero'
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
                        name: "radsinoviomu_petit-frmDatosCalificacion" + tipo + idformulario,
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
                    },
                    {
                        class: "col-md-12 positionCenter",
                        name: "validapeticionario -" + idformulario,
                        type: "submiticon",
                        classSubmit: "eliminaformaes btn btn-success",
                        submitLabel: "Confirmar Datos del Peticionario",
                        classSpan: "btn-icon-right",
                        icon: "fa fa-check"
                    }
                ]
        }
    );

    return frmDatosPersonales;
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
        console.log(valtxt)

        if (valtxt.trim() === 'Otro' || valtxt.trim() === 'Si') {
            console.log(inotro)
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
/*apartado modal datos Peticionario*/

/*apartado modal Acta Circunstanciada*/
function traeInformacionActaC(idActaC, estatus, idescrito, idqueja) {
    let iformActaCircunstanciada = formActacircunstanciada2c();
    $('.formularioActaCircunstanciada').empty()
    $('.formularioActaCircunstanciada').append(iformActaCircunstanciada);
    Carga_Informacion_selec_quejas();
    $('#Input_autoridades').select2();
    $("#origenPetExt").css("display", "none");
    $("#origenPetExtedo").css("display", "none");
    $.ajax({
        type: "POST",
        url: "GetDataActaCircunstanciada",
        data: { identificadorActac: idActaC },
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            var longitud = response.data.length;
            if (response.data.length > 0) {
                var idMunicipio = parseInt(response.data[0].lugar);
                console.log("Respuesta_EscritoInicial: " + response.data[0]);
                let fechahechos = response.data[0].fechaHechos.split(' ');
                console.log(parseInt(response.data[0].lugar));

                Carga_Informacion_selec_quejas();
                console.log('termina')
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
                $('#catEstado_hechos > option[value="' + response.data[0].identificacionPet + '"]').attr('selected', 'selected');
                $('#catAutoridad > option[value="' + response.data[0].identificacionPet + '"]').attr('selected', 'selected');
                $("textarea[name='hechos']").val(response.data[0].hechos);
                $("input[name='horaTermino']").val(response.data[0].horaTermino);
                $("input[name='idescritoim']").val(idescrito);
                $("input[name='idqueja']").val(idqueja);
                $("input[name='idactaedit']").val(idActaC);
                console.log('selecciona')
                $('#lugar > option[value="' + idMunicipio + '"]').attr('selected', 'selected');

                $("#Input_autoridades option:contains('" + response.data[0].autoridad + "')").attr("selected", "true");
                if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar') {
                    $('#modalformularioActaCircunstanciada button[type="button"]').hide();
                }
                var autoridades = '';
                for (var i = 0; i < response.data1.length; i++) {
                    autoridades = autoridades + response.data1[i] + ' - ';

                }
                $("input[name='AutoridadesEI']").val(autoridades);

                $("#modalformularioActaCircunstanciada").modal("show");
                //$("#colonia_petit-frmDatosPersonales1 option:contains('" + response.data[0].colonia + "')").attr("selected", "true");/*Seleccion del elemento dentro de un select*/
                //$('input[value=' + response.data[0].fkSexo + ']').prop('checked', true);/*Seleccionar lapropiedad checked en True*/
                //$("#leindi_petit-frmDatosPersonales1 option[value=" + response.data[0].hablaLenguai + "]").attr("selected", "true");
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
function formActacircunstanciada2c() {

    var idUser = $("#idusuario").val();
    var Area = $("#areaUser").val();
    var Cargo = $("#cargoUser").val();

    console.log("ID_USER:" + idUser);
    console.log("AREA_USER:" + Area);
    console.log("CARGO_USER:" + Cargo);
    var arregloBlanco = [];
    let numfrm = 1;

    var formInnicial = `<form class="text-justify form_acta" data-nformac=${numfrm} id="formActa${numfrm}" name="formActa${numfrm}" method="post" style="width:90%; margin-left:5%" >`;
    var cuerpo =
        //CreaInputs_Con_Label('lugar', 'lugar', '', 'text', 'En', 'textfield2')
        CreaSelectLabel('lugar', '', arregloBlanco, '', 'En', '', 'validaselectdac')
        + CreaInputs_Con_Label('diaFecha', 'diaFecha', 'validanumerosac', 'number', ', a los', 'textfield', 'mes')
        + CreaSelectLabel('mes', '', arregloMeses(), '', 'días del mes de', 'textfield4', 'validaselectdac')
        + CreaSelectLabel('anio', '', arregloAnio(), '', 'de', '', 'validaselectdac')
        //+ CreaInputs_Con_Label('nomAbogado', 'nomAbogado', '', 'text', ', el suscrito, licenciado', 'textfield5', 'placeholder="nombre de abogado"')
        + CreaSelectLabel('nomAbogado', '', arregloBlanco, '', ', el suscrito, licenciado', '', 'validaselectdac')
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
        + CreaSelectLabel('identificacionPet', '', arregloIdentificación(), '', 'identificándose ante el suscrito con', '', 'validaselectdac')
        + Crea_LabelCentro('textfield11', 'textfield11', '', 'y en relación a los hechos de la queja que nos ocupa, <strong>DECLARO:</strong><br>')
        + CreaInputs_Con_Label('fechaHechos', 'fechaHechos', 'validadateac', 'date', 'Que el día', 'textfield10', '')
        + CreaInputs_Con_Label('horaHechos', 'horaHechos', 'validatimeac', 'time', 'a las', 'textfield10', '')
        + CreaInputs_Con_Label('ubiHechos', 'ubiHechos', 'validatxtac', 'text', 'estando en', 'textfield10', 'placeholder="lugar de hechos"')
        + CreaSelectLabel('catMunicipio_hechos', '', arregloMun(), '', 'ubicado en el municipio de', '', 'validaselectdac')
        + CreaSelectLabel('catEstado_hechos', '', arreglo_Estados(), '', 'del estado de ', '', 'validaselectdac')
        //+ CreaSelectLabel('catAutoridad', '', arregloEstado(), '', ', la(s) autoridad(es)', '')
        + CreaInputs_Con_Label('AutoridadesEI', 'AutoridadesEI', '', 'text', 'la(s) autoridad(es)', 'textfield10', 'placeholder="Autoridades"')
        + CreaTextArea('hechos', 'validanovacioac', 'style="width:100%"')
        + CreaInputs_Con_Label('horaTermino', 'horaTermino', 'validatimeac', 'time', 'dando por terminada la presente actuación a  las', 'textfield10', '')
        + Crea_LabelCentro('textfield12', 'textfield12', '', 'horas. Hago constar lo anterior de conformidad con lo establecido en los numerales 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla para los efectos correspondientes----------------------------------<b>DOY FE.</b> ')
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
/*apartado modal Acta Circunstanciada*/


/*apartado modal Escrito Inicial*/
function traeInformacionEscritoi(idqueja, estatus, idcomplemento, idexpediente) {
    /* Funciones escritoi */
    funcionesEscritoi();
    let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
    $('.formularioEscritoInicial').empty()
    $('.formularioEscritoInicial').append(iformEscritoInicial);
    $.ajax({
        type: "POST",
        url: "GetDataEscritoInicial",
        data: { identificadorQueja: idqueja },
        dataType: "JSON",
        success: function (response) {

            var longitud = response.data.length;
            if (response.data.length > 0) {

                console.log(response.data)

                let fecha_hechos = new Date(response.data[0].fechahd).toISOString().split("T")[0];
                let hora_hechos = (response.data[0].fechahd).split("T")[1];
                let ruta_adjuntoei = response.data[0].rutaarchivo;
                Carga_Informacion_selec_quejas();

                $("input[name='id_quejaei']").val(idqueja);
                $("input[name='id_escritoigenerado']").val(idqueja);
                $("input[name='Input_ID']").val(idexpediente);
                $("input[name='ID_CompPeticionario']").val(idcomplemento);
                $("input[name='Input_Peticionario2']").val(response.data[0].peticionarios);
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
                    $("input[name='numintLH']").val(response.data[0].numero_ext);
                    $("input[name='cpLH']").val(response.data[0].cp);
                    $("input[name='coloniaLH']").val(response.data[0].colonia);
                }

                fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
                    let estado = data.lista4;

                    CargaDatosSelectOtro("#Input_LugarHechos", estado);
                    $("#Input_LugarHechos > option[value='" + response.data[0].cvemun + "']").attr("selected", true);
                    $('#Input_LugarHechos').val(response.data[0].cvemun).trigger('change.select2');
                })

                if (longitud > 0) {
                    for (var i = 0; i < longitud; i++) {

                        var contenedor = '';
                        console.log(i);
                        console.log(response.data[i].autoridad);
                        contenedor = Agrega_PersonaAutoridad(i + 1, response.data[i].nombre_persona, response.data[i].cargo_persona, response.data[i].autoridad);

                        $('#Contenedor_Cargos_Personas').append(contenedor);

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
                if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar') {
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
function formEscritoInicial2(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_Peticionario2', 'Input_Peticionario2', '', 'text', 'Peticionaria/o:&nbsp;', 'textfield', 'placeholder="Nombre del peticionario"', 'style ="margin-left: 60%;"')
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
/*apartado modal Escrito Inicial*/



/*Metodos PDF*/
function GeneraActaC_pdf(idActa) {

    let idacta = idActa;

    window.open(ExportaDocumentoacta + idacta, '_blank');
}


function GeneraEscrito_pdf(idEscrito) {

    let id = idEscrito;

    window.open(ExportaDocumento + id, '_blank');

}


function GeneraDocumento_pdf(nombreDocumento,tipo,idq) {

    let id = nombreDocumento;
    if (nombreDocumento == 'undefined' || nombreDocumento == '') {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'No haz cargado ningun documento.',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        if (tipo == 'AC') {
            window.open(ExportaDocumentoPDFAC + id, '_blank');
        } else if (tipo == 'EI') { window.open(ExportaDocumentoPDFEI + id, '_blank'); }
        else if (tipo == 'IDQOT')
        {
            window.open(ExportaDocumentoDQOT + idq, '_blank'); 

        }
        else if (tipo == 'IDCC') {
            window.open(ExportaDocumentoCCA + idq, '_blank');
        }
        else if (tipo == 'IDCM')
        {
            window.open(ExportaDocumentoCMO + idq, '_blank');
        }
        else { window.open(ExportaDocumentoPDF + id, '_blank'); }
        //
        
    }
}
//var ExportaDocumentoPDFEI = '@Url.Action("ConsutlarArchivoEI", "Expediente")?fileName=';
//var ExportaDocumentoPDFAC = '@Url.Action("ConsutlarArchivoAC", "Expediente")?fileName=';


function turnoAbogado(idquej, idabogad) {
    $.ajax({
        type: "POST",
        url: "TurnoAbogado",
        data: { idqueja: idquej, idabogado: idabogad },
        dataType: "JSON",
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Tarea realizada Correctamente",
            });
            window.location.reload();
        }
    });

}

function GeneraPdfRechazados(id, visd, memo, p1, p2, p3, just, idsa, visitadorGeneral, aceptados) {

    if (visd == '' && memo == '' && p1 == '' && p2 == '' && p3 == '' && just == '' && idsa == '' && visitadorGeneral == '') {
        $.ajax({
            type: "POST",
            url: "verPDFRechazo",
            data: { idqueja: id, visd: visd, memo: memo, p1: p1, p2: p2, p3: p3, just: just, idsa: idsa, vg: visitadorGeneral, acep: aceptados },
            dataType: "JSON",
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "ID´s Aceptados",
                    text: "Todos los ID´s Fueron aceptados",
                });
            }
        });
        location.reload();
    }
    else {
        codigoArea = $("#idArea").val();
        console.log(codigoArea);

        $.ajax({
            type: "POST",
            url: "listadovisitadorGeneral",
            data: { vis: codigoArea },
            dataType: "JSON",
            success: function (response) {
                console.log(response.data)
                mostrarResTblFormatos(response.data, response.data1);
            }
        });
        // console.log(ExportaDocumentorechazo + "?idqueja=" + id + "&visd=" + visd + "&memo=" + memo + "&p1=" + p1 + "&p2=" + p2 + "&p3=" + p3 + "&just=" + just + "&idsa=" + idsa + "&vg=" + visitadorGeneral); 
        window.open(ExportaDocumentorechazo + "?idqueja=" + id + "&visd=" + visd + "&memo=" + memo + "&p1=" + p1 + "&p2=" + p2 + "&p3=" + p3 + "&just=" + just + "&idsa=" + idsa + "&vg=" + visitadorGeneral + "&acep=" + aceptados, '_blank');
    }
    //location.reload();
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
                html.txtFechaNaci.textContent = moment(new Date(response.data[0].fechaNacimiento).toISOString().split("T")[0]).format('DD/MM/YYYY');

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

function btnGenerapdfp1(Idcomplemento, Curpd, Nombrep, Apellidope, Apellidome) {

    let wspFrame = document.getElementById('frame').contentWindow;
    let html = wspFrame.document.all;
    let fechActual = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
    let fechatxt = fechActual.toString();

    let idcomplemento = Idcomplemento;
    let curpd = Curpd;
    let nombrep = Nombrep;
    let apellidope = Apellidope;
    let apellidome = Apellidome;


    $.ajax({
        type: "POST",
        url: "GetDataPeticionario",
        data: { curp: curpd, nombre: nombrep, apellidop: apellidope, apellidom: apellidome, idcomp: idcomplemento },
        dataType: "JSON",
        success: function (response) {

            if (response.data.length > 0) {
                console.log(response.data[0]);
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
                html.txtFechaNaci.textContent = moment(new Date(response.data[0].fechaNacimiento).toISOString().split("T")[0]).format('DD/MM/YYYY');

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


function ventana_acpeta_visitaduria(mensaje, idexpediente, peticionarios) {
    options = [];
    $.map(peticionarios,
        function (o) {
            console.log(o);
            options[o] = o;
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
                    resolve('Debes de seleccionar un elemento');
                }
            });
        }
    }).then(function (result) {
        if (result.isConfirmed) {


            $(".swal2-select").each(function (index) {


                //console.log(index + ": " + $(this).val());
                var ArregloidQqueja = $(this).val().toString().split('-');
                var idQueja = ArregloidQqueja[1];
                var statusQueja = ArregloidQqueja[0];


                var otroExpediente = idexpediente.split('-');
                var otroexpedientef = otroExpediente[1];

                console.log("Id de la queja: " + otroexpedientef + " id del abogado:" + statusQueja);


                turnoAbogado(otroexpedientef, statusQueja);


            });


        } else {
            $("#modalformularioActaCircunstanciada").modal("hide");
        }
    });
}

function CrearFormuCalificacionApo(tipo, fechamod) {
    $(`#frmDatosCalificacion${tipo}`).empty();
    var boton = '';
    if (tipo==='E') {
        boton = crea_Boton('button', 'Guardar y Aportar <i class="fa fa-check" aria-hidden="true"></i>', 'btnAportar', 'btn btn-success', 'GuardarAp()');
    }
    var frmDatos = CreaSelectLabel(`expedsc-frmDatosCalificacion${tipo}`, 'required', ExpeS_C, '', Requeridos() + 'Expediente a aportar', '', '')
        + Crea_Label('', '', 'col-md-12', Requeridos() + 'Descripción de la aportación:')
        + CreaTextArea(`descapo-frmDatosCalificacion${tipo}`, 'col-md-12 parrafo')
        + '<div class="col-md-12 positionCenter">'
        + boton
        + '</div>';
    $(`#frmDatosCalificacion${tipo}`).append(frmDatos);
    $(`#expedsc-frmDatosCalificacion${tipo}`).select2();
    $("#Titulo_Modal").text(" ");
    $("#Titulo_Modal").text("Modificación de Aportación");
    $("#fecha-hrs-Mod").text(" ");
    if (fechamod !== 'NO') {
        var fechaModi = fechamod.replace(/\//g, "-");
        var [fecha, hora, periodo] = fechaModi.split(' ');
        var horas, minutos;
        if (periodo) {
            console.log(periodo);
            var [horasStr, minutosStr] = hora.split(':');
            horas = parseInt(horasStr, 10);
            minutos = parseInt(minutosStr, 10);
            horas = (periodo.toLowerCase() === "p." && horas !== 12) ? horas + 12 :
                (periodo.toLowerCase() === "a." && horas === 12) ? 0 : horas;
        } else {
            [horas, minutos] = hora.split(':').map(num => parseInt(num, 10));
        }
        var [dia, mes, año] = fecha.split('-').map(num => parseInt(num, 10));
        var fechaObj = new Date(año, mes - 1, dia, horas, minutos);

        // Aquí puedes especificar la zona horaria, por ejemplo 'America/Mexico_City'
        var opciones = {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        var formattedDate = new Intl.DateTimeFormat('es-ES', opciones).format(fechaObj);
        $("#fecha-hrs-Mod").text("Ultima Modificación: " + formattedDate + " hrs.");
    }
}
function CrearFormuCalificacion(idform, tipo, fechamod, paso,expedienten, version) {
    $(`#frmDatosCalificacion${tipo}`).empty();
    //let eliminarform = document.querySelectorAll('.eliminaformaes');
    //for (var i = 0; i < eliminarform.length; i++) {
    //    eliminarform[i].remove();
    //}
    let frmDatosPersonales;
    console.log(paso);
    $("#Titulo_Modal").text(" ");
    $("#fecha-hrs-Mod").text(" ");
    if (paso == 'Calificado' || paso == 'Concluido') {

        $("#Conclu").css("display", "block");
        console.log("Paso  calificado:" + expedienten);
        if (fechamod !== 'NO') {
            //fechamod = '23/08/2024 16:33:48'
            //var fechaModi = fechamod.replace(/\//g, "-");
            //var [fecha, hora, periodo] = fechaModi.split(' ');
            //var horas, minutos;
            //if (periodo) {
            //    var [horasStr, minutosStr] = hora.split(':');
            //    horas = parseInt(horasStr, 10);
            //    minutos = parseInt(minutosStr, 10);
            //    horas = (periodo.toLowerCase() === "p." && horas !== 12) ? horas + 12 :
            //        (periodo.toLowerCase() === "a." && horas === 12) ? 0 : horas;
            //} else {
            //    [horas, minutos] = hora.split(':').map(num => parseInt(num, 10));
            //}
            //var [dia, mes, año] = fecha.split('-').map(num => parseInt(num, 10));
            //var fechaObj = new Date(año, mes - 1, dia, horas, minutos);
            //fechaObj.setDate(fechaObj.getDate());
            //var formattedDate = fechaObj.toLocaleString('es-ES', {
            //    day: '2-digit',
            //    month: '2-digit',
            //    year: 'numeric',
            //    hour: '2-digit',
            //    minute: '2-digit',
            //}).replace(',', '');
            //$("#fecha-hrs-Mod").text("Ultima Modificación: " + formattedDate + " hrs.");
            var fechaModi = fechamod.replace(/\//g, "-");
            var [fecha, hora, periodo] = fechaModi.split(' ');
            var horas, minutos;
            if (periodo) {
                console.log(periodo);
                var [horasStr, minutosStr] = hora.split(':');
                horas = parseInt(horasStr, 10);
                minutos = parseInt(minutosStr, 10);
                horas = (periodo.toLowerCase() === "p." && horas !== 12) ? horas + 12 :
                    (periodo.toLowerCase() === "a." && horas === 12) ? 0 : horas;
            } else {
                [horas, minutos] = hora.split(':').map(num => parseInt(num, 10));
            }
            var [dia, mes, año] = fecha.split('-').map(num => parseInt(num, 10));
            var fechaObj = new Date(año, mes - 1, dia, horas, minutos);

            // Aquí puedes especificar la zona horaria, por ejemplo 'America/Mexico_City'
            var opciones = {
                timeZone: 'America/Mexico_City',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            var formattedDate = new Intl.DateTimeFormat('es-ES', opciones).format(fechaObj);
            $("#fecha-hrs-Mod").text("Ultima Modificación: " + formattedDate + " hrs.");
        }
        $("#Titulo_Modal").text("Modificación del Exp: " + expedienten);
        console.log(version);
        if (paso == 'Calificado')
        {
            $(`#botonpdf${tipo}`).attr("onclick", `GeneraDocumento_pdf('pilin','IDCM',${idform})`);
        }
        
        frmDatosPersonales = crearForumulario(
            {
                idformulario: `frmDatosCalificacion${tipo}` + idform,
                numForm: idform
            },
            {
                formulario:
                    [
                        {
                            valhidden: idform,
                            name: "numFrm",
                            type: "hidden"
                        },
                        {
                            class: "col-md-12 select2",
                            label: Requeridos() + "Tema",
                            name: `tema-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes select2",
                            required: 'required',
                            combooptions: temaSe,
                            multiple: "multiple"
                        },
                        {
                            class: "col-md-3 select2",
                            label: Requeridos() + "Programa",
                            name: `programa-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes select2",
                            required: 'required',
                            combooptions: programSe
                        },

                        {
                            class: "col-md-2",
                            label: Requeridos() + "Especializado",
                            name: `especializado-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: [
                                {
                                    idSelect: 1,
                                    descripcion: 'Si'
                                },
                                {
                                    idSelect: 0,
                                    descripcion: 'No'
                                }
                            ]
                        },
                        {
                            class: "col-md-3",
                            label: Requeridos() + "Trasciende la opinión Pública",
                            name: `trancpub-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: [
                                {
                                    idSelect: 1,
                                    descripcion: 'Si'
                                },
                                {
                                    idSelect: 0,
                                    descripcion: 'No'
                                }
                            ]
                        },
                        {
                            class: "col-md-2",
                            label: Requeridos() + "Materia",
                            name: `materia-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: MateriaSe
                        },
                        {
                            class: "col-md-2 form-control-sm",
                            label: Requeridos() + "Nivel de Riesgo",
                            name: `nivries-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: [
                                {
                                    idSelect: '1',
                                    descripcion: 'Bajo'
                                },
                                {
                                    idSelect: '2',
                                    descripcion: 'Medio'
                                },
                                {
                                    idSelect: '3',
                                    descripcion: 'Alto'
                                }
                            ]
                        },
                        {
                            class: "col-md-12 positionCenter",
                            labelhr: 'Autoridades Responsables - Hechos Violatorios',
                            type: 'separacion'
                        },
                        {
                            class: `col-md-12 tablaAutRe_HecVio${tipo} ContenedorTabla`
                        },
                        {
                            class: "col-md-12 positionCenter",
                            labelhr: '¿Tiene Medidas Cautelares?',
                            type: 'separacion'
                        },
                        {
                            type: "radio",
                            iformularioit: idform,
                            labels: [
                                'Si', 'No'
                            ],
                            ids: {
                                0: 'idmedCuate' + idform,
                                1: 'idmedCuate' + idform
                            },
                            values: {
                                0: 'Si',
                                1: 'No'
                            },
                            class: "col-md-12 d-flex mleft positionCenter",
                            classradio: "radiosnvm",
                            checked: [
                                'idmedCuate' + idform
                            ],
                            name: "radsinoviomu_petit-frmDatosCalificacion" + tipo + idform,
                            classControl: "ob max-300 eliminaformaes"
                        },
                        {
                            class: `col-md-12 tablaMedCuate${tipo} ContenedorTabla`
                        },
                        {
                            class: "col-md-12 positionCenter",
                            labelhr: 'Diligencias',
                            type: 'separacion'
                        },
                        {
                            class: `col-md-12 tablaDilig${tipo} ContenedorTabla`
                        },
                        {

                            class: "col-md-12 positionCenter",
                            name: `submitForm${tipo}-` + idform,
                            type: "submiticon",
                            classSubmit: "eliminaformaes btn btn-success",
                            submitLabel: "Modificar Calificación",
                            classSpan: "btn-icon-right",
                            icon: "fa fa-check"
                        }
                    ]
            }
        );

    } else {
        $("#Titulo_Modal").text("Calificación del Escrito Inicial de Queja");
        frmDatosPersonales = crearForumulario(
            {
                idformulario: `frmDatosCalificacion${tipo}` + idform,
                numForm: idform
            },
            {
                formulario:
                    [
                        {
                            valhidden: idform,
                            name: "numFrm",
                            type: "hidden"
                        },
                        {
                            class: "col-md-12 select2",
                            label: Requeridos() + "Tema",
                            name: `tema-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes select2",
                            required: 'required',
                            combooptions: temaSe,
                            multiple: "multiple"
                        },
                        {
                            class: "col-md-3 select2",
                            label: Requeridos() + "Programa",
                            name: `programa-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes select2",
                            required: 'required',
                            combooptions: programSe
                        },

                        {
                            class: "col-md-2",
                            label: Requeridos() + "Especializado",
                            name: `especializado-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: [
                                {
                                    idSelect: 1,
                                    descripcion: 'Si'
                                },
                                {
                                    idSelect: 0,
                                    descripcion: 'No'
                                }
                            ]
                        },
                        {
                            class: "col-md-3",
                            label: Requeridos() + "Trasciende la opinión Pública",
                            name: `trancpub-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: [
                                {
                                    idSelect: 1,
                                    descripcion: 'Si'
                                },
                                {
                                    idSelect: 0,
                                    descripcion: 'No'
                                }
                            ]
                        },
                        {
                            class: "col-md-2",
                            label: Requeridos() + "Materia",
                            name: `materia-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: MateriaSe
                        },
                        {
                            class: "col-md-2 form-control-sm",
                            label: Requeridos() + "Nivel de Riesgo",
                            name: `nivries-frmDatosCalificacion${tipo}`,
                            type: "combobox",
                            classControl: "ob max-300 eliminaformaes",
                            required: 'required',
                            combooptions: [
                                {
                                    idSelect: '1',
                                    descripcion: 'Bajo'
                                },
                                {
                                    idSelect: '2',
                                    descripcion: 'Medio'
                                },
                                {
                                    idSelect: '3',
                                    descripcion: 'Alto'
                                }
                            ]
                        },
                        {
                            class: "col-md-12 positionCenter",
                            labelhr: 'Autoridades Responsables - Hechos Violatorios',
                            type: 'separacion'
                        },
                        {
                            class: `col-md-12 tablaAutRe_HecVio${tipo} ContenedorTabla`
                        },
                        {
                            class: "col-md-12 positionCenter",
                            labelhr: '¿Tiene Medidas Cautelares?',
                            type: 'separacion'
                        },
                        {
                            type: "radio",
                            iformularioit: idform,
                            labels: [
                                'Si', 'No'
                            ],
                            ids: {
                                0: 'idmedCuate' + idform,
                                1: 'idmedCuate' + idform
                            },
                            values: {
                                0: 'Si',
                                1: 'No'
                            },
                            class: "col-md-12 d-flex mleft positionCenter",
                            classradio: "radiosnvm",
                            checked: [
                                'idmedCuate' + idform
                            ],
                            name: "radsinoviomu_petit-frmDatosCalificacion" + tipo + idform,
                            classControl: "ob max-300 eliminaformaes"
                        },
                        {
                            class: `col-md-12 tablaMedCuate${tipo} ContenedorTabla`
                        },
                        {
                            class: "col-md-12 positionCenter",
                            labelhr: 'Diligencias',
                            type: 'separacion'
                        },
                        {
                            class: `col-md-12 tablaDilig${tipo} ContenedorTabla`
                        },
                        {

                            class: "col-md-12 positionCenter",
                            name: `submitForm${tipo}-` + idform,
                            type: "submiticon",
                            classSubmit: "eliminaformaes btn btn-success",
                            submitLabel: "Guardar y Calificar",
                            classSpan: "btn-icon-right",
                            icon: "fa fa-check"
                        }
                    ]
            }
        );

    }
    $(`#frmDatosCalificacion${tipo}`).append(frmDatosPersonales);
    if (tipo!=='E') {
        $(`#submitForm${tipo}-${idform}`).hide();
    }
    $(`.tablaAutRe_HecVio${tipo}`).empty();
    $(`.tablaMedCuate${tipo}`).empty();
    $(`.tablaDilig${tipo}`).empty();
    crearTabla(`.tablaAutRe_HecVio${tipo}`, `tablaAutRe_HecVioT${tipo}`, ["Acciones", "Tipo", "Autoridades Responsables", "Autoridad Primaria", "Hechos Violatorios", "Derecho Humano"], idform, tipo);
    LlenarTabAutReHecVio(`#tablaAutRe_HecVioT${tipo}`, tipo, idform, version);

    crearTabla(`.tablaMedCuate${tipo}`, `tablaMedCuateT${tipo}`, ["Acciones", "No. Oficio", "Evidencia de emisión", "Cumplida (Si/No)", "Evidencia de atención"], idform, tipo);
    LlenartablaMedCuate(`#tablaMedCuateT${tipo}`, tipo, idform, version);
    $(`.tablaMedCuate${tipo}`).hide();

    crearTabla(`.tablaDilig${tipo}`, `tablaDiligT${tipo}`, ["Acciones", "Tipo Diligencia", "Descripción de diligencia", "Fecha de emisión", "Atendido SI/NO"], idform, tipo);
    LlenartablaDilig(`#tablaDiligT${tipo}`, tipo, idform, version);

    $(document).ready(function () {
        $('input[id="idmedCuate' + idform + '"]').change(function () {
            if ($(this).val() === 'Si') {
                $(`.tablaMedCuate${tipo}`).show();
            } else {
                $(`.tablaMedCuate${tipo}`).hide();
            }
        });
    });
    funcionesEscritoi();

    $(`#tema-frmDatosCalificacion${tipo}`).select2();
    $(`#programa-frmDatosCalificacion${tipo}`).select2();
}

function crearTabla(nomTabla, nomTab, arreglo, id, tipo) {
    var table = document.createElement("table");
    table.id = nomTab;
    table.classList.add("table", "table-striped");
    table.style.minWidth = "100%";
    var thead = document.createElement("thead");
    thead.style.setProperty('background', 'white', 'important');
    thead.style.setProperty('border-bottom', '1px solid gray', 'important');
    var headerRow = document.createElement("tr");
    var headers = arreglo;
    headers.forEach(function (headerText) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    $(nomTabla).append(table);
}


function AgrDil(nomTab, id,fechaturno,fechacalif) {
    var contc = 0;
    var table = $("#" + nomTab).DataTable();
    var newRow;
    var rowIndex = table.rows().count();
  
    switch (nomTab) {
        case "tablaAutRe_HecVioTE":
            newRow = table.row.add([
                `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${nomTab}")'></i>`,
                generateRadioInputs(rowIndex, 'autoridadresE', 1),
                Requeridos() + CreaSelectLabel(`autoridadres_${rowIndex}`, '', AutoridadesSe1, '', '', '', 'select2'),
                CreaInputs_Con_Labeldisabled('tipautoE', 'tipautoE', '', 'text', '', '', ''),
                Requeridos() + CreaSelectLabel(`hechvioE_${rowIndex}`, '', hechvioSe, '', '', '', 'select2'),
                CreaInputs_Con_Labeldisabled('derecho', 'derecho', '', 'text', '', '', '')
            ]).draw().node();
            $(newRow).find(`#hechvioE_${rowIndex}`).on('change', function () {
                $(newRow).find('#derecho').val("");
                var selecTex = $(this).find("option:selected").text();
                var homoclav = selecTex.split('-');
                $(newRow).find('#derecho').val(homoclav[2]);
            });
            break;
        case "tablaMedCuateTE":
            newRow = table.row.add([
                `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${nomTab}")'></i>`,
                Requeridos() + `<input type="file" name="archivoEmision" multiple id="archivoEmision" class="input-file">
        <div class="input-group col-xs-12">
            <input type="text" class="form-control" disabled placeholder="Cargar archivos">
            <span class="input-group-btn">
                <button class="upload-field btn btn-info" type="button"><i class="fa fa-search"></i> Buscar</button>
            </span>
        </div>`,
                Requeridos() + CreaInputs_Con_Label('fechaEmisionE_' + rowIndex, 'fechaEmisionE_' + rowIndex, 'validatimeac', 'date', '', 'textfield9', ''),
                Requeridos() + CreaInputs_Con_Label('fechaAtencionE_' + rowIndex, 'fechaAtencionE_' + rowIndex, 'validatimeac', 'date', '', 'textfield9', ''),
                "",
                "Semaforo"
            ]).draw().node();
            break;
        case "tablaDiligTE":
            newRow = table.row.add([
                CreaInputs(`diligenArregE_${rowIndex}`, `diligenArregE_${rowIndex}`, '', 'hidden') + `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${nomTab}")'></i><i class='btn fa fa-pencil-square-o' onclick='DetDilig("modalDilig","tipodiligE_${rowIndex}", ${rowIndex}, ${id}, 'E')'></i>`,
                CreaSelectLabel(`tipodiligE_${rowIndex}`, '', diligenSe, '', '', ''),
                `<textarea id="descripE_${rowIndex}" class="swal2-input" disabled> </textarea>`,
                CreaInputs_Con_Label(`fechaAltaE_${rowIndex}`, `fechaAltaE_${rowIndex}`, 'validatimeac', 'date', '', 'textfield9', ''),
                ''
            ]).draw().node();
            break;
        case "tablaconcluE":
            var causacat = '';
            var divCreadoDinamicamente = document.getElementById('causaccatE_0')
            if (document.body.contains(divCreadoDinamicamente)) { causacat = $("#causaccatE_0").val(); }
            if (causacat == '6.2') {
                if (rowIndex < 2) {
                    newRow = table.row.add([
                        CreaInputs(`diligenArregE_${rowIndex}`, `diligenArregE_${rowIndex}`, '', 'hidden')
                        + `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("#${nomTab}")'></i>`,
                        Requeridos() + CreaInputs_Con_Labeldate(`fechaCausaE_${rowIndex}`, `fechaCausaE_${rowIndex}`, 'validatimeac', 'date', '', 'textfield9', ''),
                        Requeridos() + CreaSelectLabelinverso(`causaccatcveE_${rowIndex}`, '', ExpeConc, '', '', '') + Requeridos() + CreaSelectLabel(`causaccatE_${rowIndex}`, '', ExpeConc, '', '', '', Habilita_Acto_Rest(causacat)),
                        `<textarea id="ActoRestE_${rowIndex}" class="swal2-input" disabled> </textarea>`,
                        `<textarea id="ObsConcluE_${rowIndex}" class="swal2-input" > </textarea>`
                    ]).draw().node();
                    if (contc == 0) {
                        $("#izquierdaEC").append(`<div class="col-md-12 positionCenter eliminaformaes"><button type="button" name="" onclick="Concluirexpediente('${fechaturno}','${fechacalif}')" id="concluir-${id}" class="eliminaformaes eliminaformaes btn btn-success">Concluir Expediente <span class="btn-icon-right eliminaformaes"><i class="fa fa-check eliminaformaes"></i></span></button></div>`);
                        contc++;
                    }
                }
            } else {

                if (rowIndex < 1) {
                    newRow = table.row.add([
                        CreaInputs(`diligenArregE_${rowIndex}`, `diligenArregE_${rowIndex}`, '', 'hidden')
                        + `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("#${nomTab}")'></i>`,
                        Requeridos() + CreaInputs_Con_Labeldate(`fechaCausaE_${rowIndex}`, `fechaCausaE_${rowIndex}`, 'validatimeac', 'date', '', 'textfield9', ''),
                        Requeridos() + CreaSelectLabelinverso(`causaccatcveE_${rowIndex}`, '', ExpeConc, '', '', '') + Requeridos() +CreaSelectLabel(`causaccatE_${rowIndex}`, '', ExpeConc, '', '', ''),
                        `<textarea id="ActoRestE_${rowIndex}" class="swal2-input" disabled> </textarea>`,
                        `<textarea id="ObsConcluE_${rowIndex}" class="swal2-input" > </textarea>`
                    ]).draw().node();
                    if (contc == 0) {
                        $("#izquierdaEC").append(`<div class="col-md-12 positionCenter eliminaformaes"><button type="button" name="" onclick="Concluirexpediente('${fechaturno}','${fechacalif}')" id="concluir-${id}" class="eliminaformaes eliminaformaes btn btn-success">Concluir Expediente <span class="btn-icon-right eliminaformaes"><i class="fa fa-check eliminaformaes"></i></span></button></div>`);
                        contc++;
                    }


                }
            }
            $('select[id^=causaccatcve]').change(function (e) {
                //alert(this.value);
                console.log("Entró al cambio de causaccatcve");
                $(this).parent().find('select[id^=causaccat]').val(this.value).trigger('change.select2');
                $(this).val(this.value).trigger('change.select2');
                var causa = `${this.value}`;
                Habilita_Acto_Rest(causa);
            });
            $('select[id^=causaccat]').on("change", (function (e) {
                console.log("Entró al cambio de causaccat");
                // alert(this.value);
                $(this).val(this.value).trigger('change.select2');
                $(this).parent().find('select[id^=causaccatcve]').val(this.value).trigger('change.select2');
                var causa = `${this.value}`;
                Habilita_Acto_Rest(causa);
                e.stopPropagation();
            }));


            var minDate = new Date();
            //var maxDate = new Date();

            // Configura la fecha mínima (hoy)
            minDate.setMonth(minDate.getMonth()); // Un año atrás

            // Configura la fecha máxima (un año adelante)
            // maxDate.setMonth(maxDate.getMonth()); // Un año adelante
            var mes = minDate.getMonth() + 1;
            var mes1 = minDate.getMonth();
            var anio = minDate.getFullYear();
            var diamax = diasEnUnMes(anio, mes);

            var fechamin = "";
            console.log(mes.toString().length);
            if (mes.toString().length == 1) {  fechamin = anio + "-0" + mes + "-01"; } else {  fechamin = anio + "-" + mes + "-01"; }
            var fechaMax = anio + "-" + mes1 + "-" + diamax;
            ;
            //console.info(fecha)
            console.log(fechamin);
            console.log(calcular(fechaMax, 'sumar', '3'));
            var diasAG = 0;
            fetchGet("Expediente/DiasAgregar", "json", (data) => {
                diasAG = data.dias; console.log(diasAG); $('input[id^=fechaCausaE_]').prop("min", fechamin);$('input[id^=fechaCausaE_]').prop("max", calcular(fechaMax, 'sumar', diasAG));})
            break;
    }
    actualizarIndices(nomTab);
    RecargaTab(nomTab);
}
function actualizarIndices(nomTab) {
    var table = $(`#${nomTab.replace('#', '')}`).DataTable();
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        var newIndex = rowIdx;
        var $row = $(this.node());
        switch (nomTab) {
            case "tablaAutRe_HecVioTE":
                $row.find('input[type="radio"]').attr('name', 'autoridadresE_' + newIndex);
                $row.find('select[id^="autoridadresE_"]').attr('id', 'autoridadresE_' + newIndex);
                $row.find('select[id^="hechvioE_"]').attr('id', 'hechvioE_' + newIndex);
                $row.find(`#autoridadresE_${newIndex}`).off('change').on('change', function () {
                    $(this).closest('tr').find('#tipautoE').val("");
                    var selecTex = $(this).find("option:selected").text();
                    var homoclav = selecTex.split('/');
                    $(this).closest('tr').find('#tipautoE').val(homoclav[2]);
                });
                $row.find(`#hechvioE_${newIndex}`).off('change').on('change', function () {
                    $(this).closest('tr').find('#derecho').val("");
                    var selecTex = $(this).find("option:selected").text();
                    var homoclav = selecTex.split('-');
                    $(this).closest('tr').find('#derecho').val(homoclav[2]);
                  
                    
                });
                break;
            case "tablaMedCuateTE":
                $row.find('input[type="radio"]').attr('name', 'autoridadresMC_' + newIndex);
                $row.find('select[id^="autoridadresMC_"]').attr('id', 'autoridadresMC_' + newIndex);
                break;
            case "tablaDiligTE":
                $row.find('input[id^="diligenArregE_"]').attr('id', 'diligenArregE_' + newIndex);
                $row.find('select[id^="tipodiligE_"]').attr('id', 'tipodiligE_' + newIndex);
                $row.find('textarea[id^="descripE_"]').attr('id', 'descripE_' + newIndex);
                $row.find('input[id^="fechaAltaE_"]').attr('id', 'fechaAltaE_' + newIndex);
                break;
            case "tablaconcluE":
                $row.find('input[id^="fechaCausaE_"]').attr('id', 'fechaCausaE_' + newIndex);
                $row.find('select[id^="causaccatE_"]').attr('id', 'causaccatE_' + newIndex);
                $row.find('textarea[id^="ActoRestE_"]').attr('id', 'ActoRestE_' + newIndex);
                $row.find('input[id^="ObsConcluE_"]').attr('id', 'ObsConcluE_' + newIndex);
                break;
        }
    });
}

function Habilita_Acto_Rest(causac)
{
    //alert(causac);
    if (causac == '8_') {
        $("textarea[id^=ActoRest]").removeAttr('disabled'); $("textarea[id^=ActoRest]").prev('span').remove(); $("textarea[id^=ActoRest]").before(Requeridos()); console.log($("textarea[id^=ActoRest]")); $('#agregaCau').removeAttr('disabled'); $('#agregaCau').attr('disabled', 'disabled'); }
    else if (causac == '6.2') { $("textarea[id^=ActoRest]").removeAttr('disabled'); $("textarea[id^=ActoRest]").prev('span').remove(); $("textarea[id^=ActoRest]").before(Requeridos()); $('#agregaCau').removeAttr('disabled'); }
    else if (causac == '6.1') { $("textarea[id^=ActoRest]").removeAttr('disabled'); $("textarea[id^=ActoRest]").prev('span').remove(); $("textarea[id^=ActoRest]").before(Requeridos()); $('#agregaCau').removeAttr('disabled'); $('#agregaCau').attr('disabled', 'disabled'); }
    else { $("textarea[id^=ActoRest]").attr('disabled', 'disabled'); $("textarea[id^=ActoRest]").prev('span').remove(); $("textarea[id^=ActoRest]").val(''); $('#agregaCau').removeAttr('disabled'); $('#agregaCau').attr('disabled', 'disabled'); }


}

function Concluirexpediente(fechaturno,fechacalif) {

    /*Obtener   Causas de Cncllusión*/
    var Causasc = [];
    var idquejaE = $('#idquejaE').val();
    //DATOS SELECT
    var formQueja = $(this).serializeArray();
    //TABLA AUTORIDADES RESPONSABLES - HECHOS VIOLATORIOS
    var status = false;
    $('#tablaconcluE tbody tr').each(function (x) {
        x = x + 1;
        //var autoridad = $(this).find('select[name="autoridadres"]').val();
        var fechac = $(this).find('input[id^="fechaCausaE_"]').val();
        var causac = $(this).find('select[id^="causaccatE_"] option:selected').val();

        var actorest = $(this).find('textarea[id^="ActoRestE_"]').val();
        var obs = $(this).find('textarea[id^="ObsConcluE_"]').val();




            //obs.trim() != '')
            if (fechac.trim() !== '' && causac.trim() !== '99') {

                if (causac.trim() == '6.2' || causac.trim() == '8_' || causac.trim() == '6.1') {
                    if (actorest.trim() != '') {
                        Causasc.push({
                            fechacon: fechac,
                            causacon: causac,
                            idquejaE: idquejaE,
                            actorestitu: actorest,
                            observa: obs
                        });
                    }
                    else {
                        status = true;
                    }
                } else {
                    Causasc.push({
                        fechacon: fechac,
                        causacon: causac,
                        idquejaE: idquejaE,
                        actorestitu: actorest,
                        observa: obs
                    });
                }
            } else {
                status = true;
            }

        });


    formDQOT = {
        tablaCausasc: Causasc,
        longitudtabla1: Causasc.length,
        idexp: idquejaE

    };


    if (status)
    {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Tienes que completar todos los campos requeridos para poder concluir el expediente',
            timer: 2000
        });
    } else {
        var fechac1 = $("#tablaconcluE").find("input[id^='fechaCausaE_']").val();
        var fechacalifi = fechacalif.split('/');
        var fechacalifi2 = fechacalifi[2] + '-' + fechacalifi[1] + '-' + fechacalifi[0];
        var fechacalifi3 = new Date(fechacalifi2);
        var fecha_Conclu = new Date(fechac1);
        console.log("Fecha califi:" + fechacalifi3 + "Fecha conclu:" + fecha_Conclu);

        if (fecha_Conclu.getTime() < fechacalifi3.getTime()) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'La fecha de conclusión no puede ser menor a la fecha de calificación, por favor verifica tu información antes de continuar',
                timer: 5000
            });
        } else {

            $.ajax({
                type: "POST",
                url: "ConcluirExpediente",
                data: formDQOT,
                dataType: "JSON",
                success: function (response) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Expediente Concluido',
                        showConfirmButton: true,
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });

                    console.log("Concluido");
                }
            })
        }
    }
   }

//function RecuperaDaAutHec(id, callback) {
//    $.ajax({
//        type: "POST",
//        url: "SelectAutorHech",
//        data: { idqueja: id },
//        dataType: "JSON",
//        success: function (response) {
//            callback(response.autoridhecho);
//        }
//    });
//}

function RecuperaDaAutHec(id, version, callback) {
    $.ajax({
        type: "POST",
        url: "SelectAutorHech",
        data: { idqueja: id, version: version },
        dataType: "JSON",
        success: function (response) {
            callback(response.autoridhecho);
        }
    });
}
function RecuperaDaConclu(id, callback) {
    $.ajax({
        type: "POST",
        url: "SelectCausa",
        data: { idqueja: id },
        dataType: "JSON",
        success: function (response) {
            callback(response.autoridhecho);
        }
    });
}

function RecuperaDaMedC(tipo, id, version, callback) {
    $.ajax({
        type: "POST",
        url: "SelectMedc",
        data: { idqueja: id, version: version },
        dataType: "JSON",
        success: function (response) {
            callback(response.medcaut);

            if (response.medcaut !=undefined) {


            if (response.medcaut.length > 0)
            {
                console.log(response.medcaut);
                //$(".radiosnvm").prop('checked', true);
                $(".radiosnvm").each(function (indice, elemento) {
                    if ($(elemento).val() == "Si")
                    {
                        $(elemento).prop('checked', true);
                        $(`.tablaMedCuate${tipo}`).show();
                    }
                });
                }
            }
        }
    });
}


function LlenarTabAutReHecVio(tablaAutRe_HecVioT, tipo, id, version) {
    RecuperaDaAutHec(id, version, function (datos) {
        $(tablaAutRe_HecVioT).DataTable({
            language: {
                "url": "/js/TablaJson.json"
            },
            iDisplayLength: 10,
            data: datos,
            fixedHeader: true,
            searching: false,
            orderCellsTop: true,
            columns: [
                {
                    'mRender': function (data, type, full) {
                        if (tipo === 'E') {
                            return `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${tablaAutRe_HecVioT}")'></i>`;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        return generateRadioInputs(tipo, meta.row, `autoridadres${tipo}`, full.tipo);
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        if (full.tipo == 1 || typeof full.tipo === 'undefined') {
                            return Requeridos() + CreaSelectLabel(`autoridadres${tipo}_${meta.row}`, '', AutoridadesSe1, '', '', '', 'select2 autoridadres-class');
                        } else if (full.tipo == 2) {
                            return Requeridos() + CreaSelectLabel(`autoridadres${tipo}_${meta.row}`, '', AutoridadesSe2, '', '', '', 'select2 autoridadres-class');
                        }
                    }
                },
                {
                    'mRender': function (data, type, full) {
                        return '<div class="tooltipbloated">' + CreaInputs_Con_Labeldisabled(`tipauto${tipo}`, `tipauto${tipo}`, '', 'text', '', '', '') + '<div class="tooltipbloated-content" id="tooltip-content"></div></div>';
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        return Requeridos() + CreaSelectLabel(`hechvio${tipo}_${meta.row}`, '', hechvioSe, '', '', '', 'select2 hechvio-class');
                    }
                },
                {
                    'mRender': function (data, type, full) {
                        return '<div class="tooltipbloated">' + CreaInputs_Con_Labeldisabled('derecho', 'derecho', '', 'text', '', '', '') + '<div class="tooltipbloated-content" id="tooltip-content-dere"></div></div>';
                    }
                },
            ],
            dom: 'lfrtip',
            initComplete: function () {
                const table = $(tablaAutRe_HecVioT).DataTable();
                if (tipo === 'E') {
                    var param = `"${tablaAutRe_HecVioT.replace('#', '')}",${id}`;
                    const boton = crea_Boton('button', '', 'agregaDil', 'btn btn-info fa fa-plus fa-1x btn-right agregaDil', `AgrDil(${param})`);
                    $(table.table().container()).find('.dataTables_length').append(boton);
                }
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    const data = this.data();
                    //$(`#hechvio_${rowIdx}`).select2({
                    //    width: 'style'
                    //});
                    
                    $(`#autoridadres${tipo}_${rowIdx}`).val(data.id_autoridad).trigger('change');
                    $(`#hechvio${tipo}_${rowIdx}`).val(data.id_hechov).trigger('change');
                    
                    //if ($(`#autoridadres_${rowIdx}`).parent().siblings().find("#tipauto").val() == "")
                    //{
                    //    var Primaria = $(`#autoridadres_${rowIdx} option:selected`).text();
                    //    $(`#autoridadres_${rowIdx}`).parent().siblings().find("#tipauto").val(Primaria);
                    //    $('#tooltip-content').html(Primaria);
                    //}
                    
                 
                });
            },
            order: [1, 'desc'],
            bDestroy: true
        });
        //$(document).on('select2:open', function (e) {
        //    if ($(e.target).hasClass('hechvio-class')) {
        //        let dropdown = $('.select2-dropdown');
        //        dropdown.css('width', '500px');
        //    }
        //});
        $(document).on('change', '.autoridadres-class', function () {
            var $row = $(this).closest('tr');
            $row.find(`#tipauto${tipo}`).val("");
            $row.find('#tooltip-content').html('');
            var selecTex = $(this).find('option:selected').text();
            var homoclav = selecTex.split('/');
            if (!homoclav[2]) {
                $row.find('#tooltip-content').html(selecTex);
                $row.find(`#tipauto${tipo}`).val(selecTex);
            } else {
                $row.find('#tooltip-content').html(homoclav[2]);
                $row.find(`#tipauto${tipo}`).val(homoclav[2]);
            }
        });

        $(document).on('change', '.hechvio-class', function () {
            var $row = $(this).closest('tr');
            $row.find('#derecho').val("");
            $row.find('#tooltip-content-dere').html("");
            var selecTex = $(this).find('option:selected').text();
            var homoclav = selecTex.split('-');
            $row.find('#derecho').val(homoclav[2]);
            $row.find('#tooltip-content-dere').html(homoclav[2]);
        });
    });
}
function LlenarTabConclu(tablaAutRe_HecVioT, tipo, id, fechaturno, fechacalif) {
    RecuperaDaConclu(id, function (datos) {
        $(tablaAutRe_HecVioT).DataTable({
            language: {
                "url": "/js/TablaJson.json"
            },
            iDisplayLength: 10,
            data: datos,
            fixedHeader: true,
            searching: false,
            orderCellsTop: true,
            columns: [
                {
                    'mRender': function (data, type, full) {
                        if (tipo === 'E') {
                            return `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${tablaAutRe_HecVioT}")'></i>`;
                        } else {
                            return '';
                        }
                    }

                },
                {
                    'mRender': function (data, type, full,meta) {
                        return Requeridos() + CreaInputs_Con_Label(`fechaCausa${tipo}_${meta.row}`, `fechaCausa${tipo}_${meta.row}`, 'validatimeac', 'date', '', 'textfield9', '');
                    },

                },
                {
                    'mRender': function (data, type, full,meta) {
                        return Requeridos() + CreaSelectLabelinverso(`causaccatcve${tipo}_${meta.row}`, '', ExpeConc, '', '', '') + CreaSelectLabel(`causaccat${tipo}_${meta.row}`, '', ExpeConc, '', '', '');
                    },

                },
                {
                    'mRender': function (data, type, full,meta) {
                        return `<textarea id="ActoRest${tipo}_${meta.row}" class="swal2-input" disabled> </textarea>`;
                    },

                },
                {
                    'mRender': function (data, type, full,meta) {
                        return `<textarea id="ObsConclu${tipo}_${meta.row}" class="swal2-input" > </textarea>`;
                    },

                }
            ],
            //dom: 'lfrtip',
            columnDefs: [
                { className: "columnas25", targets: 2 },
                { className: "columnas25", targets: 3 },
                { className: "columnas25", targets: 4 },
            ],
            initComplete: function () {
                const table = $(tablaAutRe_HecVioT).DataTable();
               
                var param = `"${tablaAutRe_HecVioT.replace('#', '')}",${id}`;
                var fecha1 = fechaturno.toString();
                var fecha2 = fechacalif.toString();

                var fecha11 = fecha1.split(' ')[0];
                var fecha22 = fecha2.split(' ')[0];
                console.log("Fecha1: " + fecha1 + " Fecha2:" + fecha2);
                if (tipo === 'E') {
                    const boton = crea_Boton('button', '', 'agregaCau', 'btn btn-info fa fa-plus fa-1x btn-right', "AgrDil(" + param + ",'-','" + fecha11 + "','" + fecha22 + "')");
                    $(table.table().container()).find('.dataTables_length').append(boton);
                }
               
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    const data = this.data();
                    console.log(data);
                    console.log('fecha: ' + data.fechac);
                    console.log('causaccat: ' + data.causac);
                    console.log('ActoRest: ' + data.acto_rest);
                    console.log('ObsConclu: ' + data.obs);
                    var inputDate = document.getElementById(`fechaCausa${tipo}_${rowIdx}`);

                    var date = new Date(DDMMYYYY_HHMMtoYYYYMMDD_HHMM(data.fechac));
                
                     //date = new Date();
                    console.log("Fecha Conclu:"+date);
                    chargeDateInputDate(inputDate, date);
 
                    //$(`#fechaCausa_${rowIdx}`).val(data.fechac);
                    $(`#causaccat${tipo}_${rowIdx}`).val(data.causac).trigger('change');
                    $(`#causaccatcve${tipo}_${rowIdx}`).val(data.causac).trigger('change');
                    
                    $(`#ActoRest${tipo}_${rowIdx}`).val(data.acto_rest);
                    $(`#ObsConclu${tipo}_${rowIdx}`).val(data.obs);
                    Habilita_Acto_Rest(data.causac);
                });
            },
            order: [1, 'desc'],
            bDestroy: true
        });
    });
}
function generateRadioInputs(tipoM, row, aut, tipo) {
    var checked1 = '', checked2 = '', onclick1='', onclick2='';
    if (tipo == 1 || typeof tipo === 'undefined') {
        checked1 = `checked = "true"`;
    } else if (tipo == 2) {
        checked2 = `checked = "true"`;
    }
    if (tipoM === 'E') {
        onclick1 = `onclick="SelectAutoridades(1, '${aut}', ${row});" `;
        onclick2 = `onclick="SelectAutoridades(2, '${aut}', ${row});" `;
    }
    return `
        <input name="tipauto${tipoM}_${row}" type="radio" class="radio" id="tipauto${tipoM}_${row}" value="1" title="Primario" ${onclick1} ${checked1} >P
        <input name="tipauto${tipoM}_${row}" type="radio" class="radio" id="tipauto${tipoM}_${row}" value="2" title="Secundario" ${onclick2} ${checked2}>S
    `;
}
function SelectAutoridad(tipoA) {
    $.ajax({
        type: "POST",
        url: "SelectAutoridadFil",
        data: { tipo: tipoA },
        dataType: "JSON",
        success: function (response) {
            if (tipoA === 1) {
                AutoridadesSe1 = response.sautoridades;
            } else {
                AutoridadesSe2 = response.sautoridades;
            }
        }
    });
}
function SelectAutoridades(tipoA, autoridadresBase, row) {
    var autor = [];
    if (tipoA === 1) {
        autor = AutoridadesSe1;
    } else {
        autor = AutoridadesSe2;
    }
    var autoridadresId = `${autoridadresBase}_${row}`;
    var autoridadesSelect = $(`#${autoridadresId}`);
    autoridadesSelect.empty();
    autoridadesSelect.append('<option value="999">Seleccione una opción</option>');
    $.each(autor, function (index, autoridad) {
        var option = $('<option>', {
            value: autoridad.idSelect,
            text: autoridad.descripcion
        });
        autoridadesSelect.append(option);
        autoridadesSelect.select2();
    });
}
function RecargaTab(nomTab) {
    $(`#${nomTab} select`).each(function () {
        $(this).select2();
    });
}

function RecuperaMedCaut(id, callback) {
    $.ajax({
        type: "POST",
        url: "SelectMedCaut",
        data: { idqueja: id },
        dataType: "JSON",
        success: function (response) {
            callback(response.autoridhecho);
        }
    });
}
function muestraAtencionMedidaCautelar(row, tipo) {
    // Get the checkbox
    var checkBox = document.getElementById(`cumplio${tipo}1_` + row);
    var checkBox2 = document.getElementById(`cumplio${tipo}2_` + row);
    // Get the output text
    var datosAtencion = document.getElementById(`muestra${tipo}_` + row);

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        datosAtencion.style.display = "block";
        //alert ("se prendio esta madre");
    }
    if (checkBox2.checked == true) {
        datosAtencion.style.display = "none";
        //alert("se apago esta madre");
    }else {

    }
}
function LlenartablaMedCuate(tablaMedCuateT, tipo, id, version) {
    RecuperaDaMedC(tipo, id, version, function (datos) {
        $(tablaMedCuateT).DataTable({
            language: {
                "url": "/js/TablaJson.json"
            },
            iDisplayLength: 10,
            data: datos,
            fixedHeader: true,
            orderCellsTop: true,
            searching: false,
            columns: [
                //{
                //    className: 'details-control',
                //    defaultContent: '',
                //    data: null,
                //    orderable: false
                //},
                {
                    'mRender': function (data, type, full) {

                        if (tipo === 'E') {
                            return `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${tablaMedCuateT}")'></i>`;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        return Requeridos() + CreaInputs_Con_Label(`noOficio${tipo}_${meta.row}`, 'noOficio', '', 'text', '', 'textfield2', 'style="width: 110%;"')
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {

                        var visorDocumentos = `<button id="myBtn" type="button" onclick="GeneraDocumento_pdf('${full.archivo_emision}')" class="btn btn-link margin-iconbf">
                                                <span class="fa fa-file-pdf-o color-muted fa-1x"></span>
                                           </button>`;

                        if (full.archivo_emision == '')
                        {
                            //visorDocumentos = '';
                        } else {
                           // visorDocumentos = ``;
                        }
                        var buscaarch = '';
                        if (tipo === 'E') {
                            buscaarch = `<input type="file" name="archivoEmision" multiple id="archivoEmision_${meta.row}" class="input-file" accept=".pdf">
                <div class="input-group col-xs-12">
                <input type="text" id="archivoEmisionruta_${meta.row}" class="form-control" disabled placeholder="Cargar archivos">
                <span class="input-group-btn">
                    <button class="upload-field btn btn-info" type="button"><i class="fa fa-search"></i> Buscar</button>
                </span>`;
                        }
                        return Requeridos() + CreaInputs_Con_Label(`fechaEmision${tipo}_${meta.row}`, `fechaEmision${tipo}`, 'validatimeac', 'date', '', 'textfield9', '') + buscaarch + visorDocumentos + `</div>` + Requeridos() + `<textarea id="obsEmision${tipo}_${meta.row}" placeholder="Describe la evidencia de emisión" class="swal2-input"></textarea>` 
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                    return `
                    <input name="cumplio${tipo}_${meta.row}" type="radio" class="radio" id="cumplio${tipo}1_${meta.row}" value="1" title="Si" onclick="muestraAtencionMedidaCautelar(${meta.row}, '${tipo}')">Si
                    <input name="cumplio${tipo}_${meta.row}" type="radio" class="radio" id="cumplio${tipo}2_${meta.row}" value="2" checked="true" title="No" onclick="muestraAtencionMedidaCautelar(${meta.row}, '${tipo}')">No
                `;
                        
                        
                    }
                },
                {

                    'mRender': function (data, type, full, meta) {

                        var visorDocumentos = `<button id="myBtn" type="button" onclick="GeneraDocumento_pdf('${full.archivo_atencion}')" class="btn btn-link margin-iconbf">
                                                <span class="fa fa-file-pdf-o color-muted fa-1x"></span>
                                           </button>`;

                        if (full.archivo_atencion == '') {
                           // visorDocumentos = '';
                        } else {
                            //visorDocumentos = ``;
                        }
                        var buscaarch = '';
                        if (tipo === 'E') {
                            buscaarch = `<input type="file" name="archivoAtencion" multiple id="archivoAtencion_${meta.row}" class="input-file" accept=".pdf">
                <div class="input-group col-xs-12">
                <input id="archivoAtencionRuta_${meta.row}" type="text" class="form-control" disabled placeholder="Cargar archivos">
                <span class="input-group-btn">
                    <button class="upload-field btn btn-info" type="button"><i class="fa fa-search"></i> Buscar</button>
                </span>`;
                        }
                        return `<div id="muestra${tipo}_${meta.row}" style= "display:none">` + Requeridos() + CreaInputs_Con_Label(`fechaAtencion${tipo}_${meta.row}`, 'fechaAtencion', 'validatimeac', 'date', '', 'textfield9', '') + buscaarch + visorDocumentos + `</div>` + Requeridos() + `<textarea id="obsAtencion${tipo}_${meta.row}" class="swal2-input" placeholder="Describe la evidencia de atención"></textarea></div>`
                    }
                },
            ],
            columnDefs: [
                { width: '35%', targets: 2 },
                { width: '35%', targets: 4 },
            ],
            initComplete: function () {

                if (tipo === 'E') {
                    const table = $(tablaMedCuateT).DataTable();
                    var param = `"${tablaMedCuateT.replace('#', '')}",${id}`;
                    const boton = crea_Boton('button', '', 'agregaDil', 'btn btn-info fa fa-plus fa-1x btn-right agregaDil', `AgrDil(${param})`);
                    $(table.table().container()).find('.dataTables_length').append(boton);
                }
                const table = $(tablaMedCuateT).DataTable();
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    const data = this.data();
                    var dat = {};
                        dat = {
                            idq: data.idqueja,
                            femi: data.fecha_emision,
                            aemi: data.archivo_emision,
                            obsemi: data.obs_emision,
                            fate: data.fecha_atencion,
                            aate: data.archivo_atencion,
                            obsate: data.obs_atencion,
                            est: data.status,
                            noof: data.no_oficio
                    }
                    console.log(dat);
                    $(`#noOficio${tipo}_${rowIdx}`).val(dat.noof);
                    /*Fecha emision*/
                    var fecha = data.fecha_emision.split(' ')[0];
                    var fechaspl = fecha.split('/');
                    var fechaemi = fechaspl[1] + '/' + fechaspl[0] + '/' + fechaspl[2];
                    var date = new Date(fechaemi);
                    /*Fecha emision*/
                    chargeDateInputDate(document.getElementById(`fechaEmision${tipo}_${rowIdx}`), date);
                    $(`#archivoEmisionruta_${rowIdx}`).val(dat.aemi);
                    $(`#obsEmision${tipo}_${rowIdx}`).val(dat.obsemi);
                    /*Esta Cumplida*/
                    if (data.status==1) {
                        $(`#cumplio${tipo}1_${rowIdx}`).prop("checked", true);
                        //$(`#cumplio1_${rowIdx}`).click();
                        var datosAtencion = document.getElementById(`muestra${tipo}_${rowIdx}`);
                        datosAtencion.style.display = "block";

                        var fecha = data.fecha_atencion.split(' ')[0];
                        var fechaspl = fecha.split('/');
                        var fechaemi = fechaspl[1] + '/' + fechaspl[0] + '/' + fechaspl[2];
                        var date = new Date(fechaemi);
                        /*Fecha emision*/
                        chargeDateInputDate(document.getElementById(`fechaAtencion${tipo}_${rowIdx}`), date);
                        $(`#archivoAtencionRuta_${rowIdx}`).val(dat.aate);
                        $(`#obsAtencion${tipo}_${rowIdx}`).val(dat.obsemi);

                    }
                });  
            },
            order: [1, 'desc'],
            bDestroy: true
        });

        $(tablaMedCuateT).DataTable().on("draw", function (data) {

            //activarBtnTurnopre();

        })
    });
}
function RecuperaDilige(id, callback) {
    $.ajax({
        type: "POST",
        url: "SelectDiligencias",
        data: { idqueja: id },
        dataType: "JSON",
        success: function (response) {
            callback(response.diligencias);
        }
    });
}
function RecuperaDilige(id, version, callback) {
    $.ajax({
        type: "POST",
        url: "SelectDiligencias",
        data: { idqueja: id, version: version },
        dataType: "JSON",
        success: function (response) {
            callback(response.diligencias);
        }
    });
}
function LlenartablaDilig(tablaDilig, tipo, id, version) {
    RecuperaDilige(id, version, function (datos) {
        $(tablaDilig).DataTable({
            language: {
                "url": "/js/TablaJson.json"
            },
            iDisplayLength: 10,
            data: datos,
            fixedHeader: true,
            orderCellsTop: true,
            searching: false,
            columns: [
                {
                    'mRender': function (data, type, full, meta) {
                        var del='';
                        if (tipo === 'E') {
                            del = `<i class='btn fa fa-trash delete-btn' onclick='ElimFilaTab("${tablaDilig}")'></i>`;
                        }
                        return CreaInputs(`diligenArreg${tipo}_${meta.row}`, `diligenArreg${tipo}_${meta.row}`, '', 'hidden') + del + `<i class='btn fa fa-pencil-square-o' onclick='DetDilig("modalDilig","tipodilig${tipo}_${meta.row}", ${meta.row}, ${id}, "${tipo}")'></i>`;
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        return CreaSelectLabel(`tipodilig${tipo}_${meta.row}`, '', diligenSe, '', '', '');
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        return `<textarea id="descrip${tipo}_${meta.row}" class="swal2-input" disabled> </textarea>`;
                    }
                },
                {
                    'mRender': function (data, type, full, meta) {
                        return CreaInputs_Con_Label(`fechaAlta${tipo}_${meta.row}`, `fechaAlta${tipo}_${meta.row}`, 'validatimeac', 'date', '', 'textfield9', '');
                    }
                },
                {
                    'mRender': function (data, type, full) {
                        if (typeof full.semaforo != 'undefined') {
                            return '<center>' + full.semaforo + '</center>';
                        } else {
                            return '';
                        }
                    }
                },
            ],
            initComplete: function () {
                const table = $(tablaDilig).DataTable();
                if (tipo === 'E') {
                    var param = `"${tablaDilig.replace('#', '')}",${id}`;
                    const boton = crea_Boton('button', '', 'agregaDil', 'btn btn-info fa fa-plus fa-1x btn-right agregaDil', `AgrDil(${param})`);
                    $(table.table().container()).find('.dataTables_length').append(boton);
                }
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    const data = this.data();
                    var dat = {};
                    if (data.tipo_diligencia !== 3) {
                        var aten = 2;
                        if (data.fecharecibo !== '') {
                            aten = 1;
                        }
                        dat = {
                            archEvAd: data.ruta_archivo,
                            archEvi: data.ruta_arch_eviden,
                            viaDil: data.id_viainter,
                            descripcion: data.descripcion,
                            descEvi: data.desc_evi,
                            noOfMe: data.oficioMemo,
                            Fecha_Soli: data.fecha_soli,
                            plazo: data.plaz_aten,
                            Fecha_Recib: data.fecharecibo,
                            atentido: aten,
                            fila: data.id_fila,
                            tipodil: data.tipo_diligencia,
                            fecEm: data.fecha_emi,
                            idqueja: data.id_queja
                        }
                    } else {
                        dat = {
                            archEvi: data.ruta_arch_eviden,
                            descripcion: data.descripcion,
                            fila: data.id_fila,
                            tipodil: data.tipo_diligencia,
                            fecEm: data.fecha_emi,
                            idqueja: data.id_queja,
                            descEvi: data.desc_evi
                        }
                    } 
                    $(`#diligenArreg${tipo}_${rowIdx}`).val(JSON.stringify(dat));
                    $(`#tipodilig${tipo}_${rowIdx}`).val(data.tipo_diligencia).trigger('change');
                    $(`#descrip${tipo}_${rowIdx}`).val(data.descripcion);
                    if (data.fecha_emi.includes('/')) {
                        var fecha = data.fecha_emi.split(' ')[0];
                        var fechaspl = fecha.split('/');
                        var fechaemi = fechaspl[1] + '/' + fechaspl[0] + '/' + fechaspl[2];
                        var date = new Date(fechaemi);
                        chargeDateInputDate(document.getElementById(`fechaAlta${tipo}_${rowIdx}`), date);
                    } else {
                        $(`#fechaAlta${tipo}_${rowIdx}`).val(data.fecha_emi);
                    }
                    
                });
            },
            order: [1, 'desc'],
            bDestroy: true
        });

        $(tablaDilig).DataTable().on("draw", function (data) {

            //activarBtnTurnopre();

        })
    });
}

function DetDilig(modDil, tipoDi, numFil, idqueja, tipo) {
    if ($(`#${tipoDi}`).val() !== '99' && $(`#fechaAlta_${numFil}`).val() !== '') {
        document.getElementById(modDil).style.display = "block";
        CreafrmDetaDiligen($(`#${tipoDi}`).val(), numFil, $(`#tipodilig${tipo}_${numFil}`).val(), $(`#fechaAlta${tipo}_${numFil}`).val(), idqueja, tipo);
        CargaDatosSelectOtro_(`#viaDil`, viainter, '99');
        CargaDatosSelectOtro_(`#atentido`, [{ idSelectGenerico: 1, descripcion: 'Si', seleccionable: true, ruta: null }, { idSelectGenerico: 2, descripcion: 'No', seleccionable: true, ruta: null }], '99');

        var arre = $(`#diligenArreg${tipo}_${numFil}`).val();
        if (arre !== '') {
            var datos = JSON.parse(arre);
            $('#descripcion').val(datos.descripcion);
            $('#descEvi').val(datos.descEvi);
            $('#archEvAd2t').val(datos.archEvi);
            if (parseInt(datos.tipodil) !== 3) {
                $('#viaDil').val(datos.viaDil);
                $('#noOfMe').val(datos.noOfMe);
                $('#plazo').val(datos.plazo);
                $('#atentido').val(datos.atentido);
                $('#archEvAdt').val(datos.archEvAd);

                var fecha = datos.Fecha_Soli.split(' ')[0];
                var fechaspl = fecha.split('/');
                var fechae = fechaspl[2] + '/' + fechaspl[1] + '/' + fechaspl[0];
                var date = new Date(fechae);
                chargeDateInputDate(document.getElementById(`Fecha_Soli`), date);
                fecha = datos.Fecha_Recib.split(' ')[0];
                fechaspl = fecha.split('/');
                fechae = fechaspl[1] + '/' + fechaspl[0] + '/' + fechaspl[2];
                date = new Date(fechae);
                chargeDateInputDate(document.getElementById(`Fecha_Recib`), date);
            }
        }
    } else {
        var mensaje = '';
        mensaje = $(`#fechaAlta${tipo}_${numFil}`).val();
        if ($(`#${tipoDi}`).val() === '99') {
            mensaje += Requeridos() + "Seleccione el tipo de diligencia <br>";
        }
        if ($(`#fechaAlta${tipo}_${numFil}`).val() === '') {
            mensaje += Requeridos() + "Seleccione la fecha de emisión <br>";
        }
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            html: mensaje,
        });
    }
}

function CreafrmDetaDiligen(tip, numF, tiD, FechEm, idqueja, tipo) {
    $('#frmDetaDiligen').empty();
    var guaD = tip + "," + numF;
    var arregloBlanco = [];
    var cuerpo1 = '', cuerpo2 = '', nomarch = `$('#archEvAdt').val()`, boton='';
    if (tipo === 'E') {
        boton = crea_Boton('button', 'Aceptar', 'guardaDil', 'btn btn-success', `guardaDili(${guaD})`);
    }
    if (tip !== '3') {
        cuerpo1 = Requeridos() + CreaSelectLabel('viaDil', '', arregloBlanco, '', 'Via: ', '')
            + Requeridos() + CreaInputs_Con_Label('noOfMe', 'noOfMe', '', 'text', 'Número de Oficio o Memorándum: ', 'textfield', '')
            + CreaBR()
            + Requeridos() + CreaInputs_Con_Label('Fecha_Soli', 'Fecha_Soli', '', 'date', 'Fecha de Solicitud: ', 'textfield', '')
            + CreaBR()
            + Crea_Label('textfield8', 'textfield8', '', 'Evidencia de Solicitud: ')
            + '<div class="input-group col-xs-12">'
            + '<input type="file" name="archEvAd" multiple id="archEvAd" class="input-file" accept=".pdf">'
            + '<input type="text" class="form-control" id="archEvAdt" disabled placeholder="Cargar archivos">'
            + '<span class="input-group-btn">'
            + '<button id="archEvAdb" class="upload-field btn btn-info" type="button"><i class="fa fa-search"></i> Buscar</button>'
            + '</span>'
            + `<button id="myBtn" type="button" onclick="GeneraDocumento_pdf($('#archEvAdt').val())" class="btn btn-link margin-iconbf">`
            + '<span class="fa fa-file-pdf-o color-muted fa-1x"></span></button>'
            + '</div>';
        cuerpo2 = Requeridos() + CreaInputs_Con_Label('plazo', 'plazo', '', 'number', 'Plazo de Atención: ', 'textfield', '')
            + Crea_Label('textfield8', 'textfield8', '', ' días.')
            + CreaBR()
            + CreaInputs_Con_Label('Fecha_Recib', 'Fecha_Recib', '', 'date', 'Fecha de Recibido de la Autoridad: ', 'textfield', '')
            + CreaBR()
            + CreaSelectLabeldisabled('atentido', '', arregloBlanco, '', 'Atendido: ', '');
    } 
    var cuerpo = '<div class="row col-12"><div class="col-6"><h6>Datos de Solicitud</h6>'
        + cuerpo1
        + Requeridos() + Crea_Label('textfield8', 'textfield8', '', 'Descripción de diligencia: ')
        + CreaTextArea('descripcion', '', 'style="width:100%; height:22%"')
        + '</div>'
        + '<div class="col-6"><h6>Datos de Atención</h6>'
        + cuerpo2
        + Crea_Label('textfield8', 'textfield8', '', 'Evidencia de Atención: ')
        + '<div class="input-group col-xs-12">'
        + '<input type="file" name="archEvAd2" multiple id="archEvAd2" class="input-file" accept=".pdf">'
        + '<input type="text" class="form-control" id="archEvAd2t" disabled placeholder="Cargar archivos">'
        + '<span class="input-group-btn">'
        + '<button id="archEvAdb2" class="upload-field btn btn-info" type="button"><i class="fa fa-search"></i> Buscar</button>'
        + '</span>'
        + `<button id="myBtn" type="button" onclick="GeneraDocumento_pdf($('#archEvAd2t').val())" class="btn btn-link margin-iconbf">`
        + '<span class="fa fa-file-pdf-o color-muted fa-1x"></span></button>'
        + '</div>'
        + Crea_Label('textfield8', 'textfield8', '', 'Descripción de Evidencia: ')
        + CreaTextArea('descEvi', '', 'style="width:100%; height:22%"')
        + CreaInputs('fila', 'fila', '', 'hidden')
        + CreaInputs('tipodil', 'tipodil', '', 'hidden')
        + CreaInputs('fecEm', 'fecEm', '', 'hidden')
        + CreaInputs('idqueja', 'idqueja', '', 'hidden')
        + '</div></div>'
        + '<div class="positionCenter" style="top:-70px; position: relative;">'
        + boton
        + '</div>';
    $('#frmDetaDiligen').append('<form class="text-justify formDetalleDil" id="formDetalleDil" name="formDetalleDil" method="post" style="width:100%; margin-left:2%;">' + cuerpo + '</form>');
    $('#fila').val(numF);
    $('#tipodil').val(tiD);
    $('#fecEm').val(FechEm);
    $('#idqueja').val(idqueja);
}

function checkbox(title, id, label, adichec, clase) {
    return `<label>${label} <input type="checkbox" class="${clase}" id="${id}" title="${title}" ${adichec}/></label>`;
}
function icono_editar(funcion, id, idico, tipo) {
    return `<i class='btn fa fa-pencil-square-o' id=${idico} onclick='HabilEdi(${id}, "#${funcion}","${tipo}")'></i>`;
}
function Requeridos() {
    return '<span style="color: red;">*</span>';
}
function chargeDateInputDate(elem, dateObject = new Date()) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var month = month > 9 ? month : "0" + month;
    var day = dateObject.getDate() > 9 ? dateObject.getDate() : "0" + dateObject.getDate();
    var dateFormat = year + "-" + month + "-" + day;
    elem.value = dateFormat;
}
function HabilEdi(id, identif, tipo) {
    $(identif).prop('disabled', false);
    switch (identif) {
        case '#hechosE':
            $(`#confi_hechos${tipo}`).prop('disabled', true);
            $(`#confi_hechos${tipo}`).removeClass('pulsacionrellow');
            confirmdatos($('#idquejaE').val(), '3', '', '');
            break;
        case '#municipioquejaE':
            $(`#confi_lughec${tipo}`).prop('disabled', true);
            $(`#confi_lughec${tipo}`).removeClass('pulsacionrellow');
            confirmdatos($('#idquejaE').val(), '', '3', '');
            break;
    }
}
function ElimFilaTab(nomTab) {
    console.log("eliminando ...........");
    var table = $(`${nomTab}`).DataTable();
    console.log(table);
    var dat = `${nomTab} tbody`;
    console.log(dat);
    $(dat).on('click', '.delete-btn', function () {
        // Encuentra la fila correspondiente
        var row = $(this).closest('tr');

        // Elimina la fila usando DataTables
        table.row(row).remove().draw();
        actualizarIndices(nomTab);
    });
}

function GuardarAp() {
    var expediente = $('#expedsc-frmDatosCalificacionE option:selected').text();
    var formDQOT = {
        idqueja: 0,
        viainterpos: '',
        Abogadoqueja: '',
        hechos: '',
        municipioqueja: '',
        visitaduriaqueja: '',
        Fecha_Registro: '',
        Fecha_TurnoVG: '',
        sedeRegistro: '',
        tema: '',
        programa: '',
        observaciones: '',
        tablaAutRe_HecVio: [],
        tablaMedCaut: [],
        tablaDilig: [],
    };

    //VARIABLES
    var AutRe_HecVioT = [], MedCaute = [], Diligen = [];
    var idquejaE = $('#idquejaE').val();
    //DATOS DQOT
    formDQOT = {
        tipGuarda: '',
        idqueja: idquejaE,
        viainterpos: $('#viainterposE').val(),
        Abogadoqueja: $('#AbogadoquejaE').val(),
        hechos: $('#hechosE').val(),
        municipioqueja: $('#municipioquejaE').val(),
        visitaduriaqueja: $('#visitaduriaquejaE').val(),
        Fecha_Registro: $('#Fecha_RegistroE').val(),
        Fecha_TurnoVG: $('#Fecha_TurnoVGE').val(),
        sedeRegistro: $('#sedeRegistroE').val(),
        observaciones: $('#observacionesE').val(),
        tablaAutRe_HecVio: AutRe_HecVioT,
        longitudtabla1: AutRe_HecVioT.length,
        tablaMedCaut: MedCaute,
        longitudtabla2: MedCaute.length,
        tablaDilig: Diligen,
        longitudtabla3: Diligen.length,
        arreglotemas: $('#tema-frmDatosCalificacionE').val(),
        tipexpediente: $("#tipexpediente-frmDatosCalificacionE").val(),
        expedsc: $("#expedsc-frmDatosCalificacionE").val(),
        descapo: $("#descapo-frmDatosCalificacionE").val()
    };
    var combinedData = formDQOT;
    if (($('#confi_hechosE').is(':checked') || $('#confi_hechosE').is(':disabled')) && ($('#confi_lughecE').is(':checked') || $('#confi_lughecE').is(':disabled')) && ($('#confi_peticionaE').is(':checked') || $('#confi_peticionaE').is(':disabled'))) {
        if (formDQOT.municipioqueja == '' || formDQOT.visitaduriaqueja == '99' || formDQOT.Fecha_TurnoVG == '' || formDQOT.hechos == '' || $("#tipexpediente-frmDatosCalificacionE").val() == '99' || $("#expedsc-frmDatosCalificacionE").val() == '99' || $("#descapo-frmDatosCalificacionE").val() == '') {
            var htm = `<div style ="float:left; font-weight: bold;">Completar los campos requeridos marcados con un ` + Requeridos() + `</p>`;
            if (formDQOT.municipioqueja == '') { htm = htm + Requeridos() + 'Lugar donde Ocurrieron los Hechos<br>'; }
            if (formDQOT.visitaduriaqueja == '') { htm = htm + Requeridos() + 'Visitaduría General<br>'; }
            if (formDQOT.Fecha_TurnoVG == '') { htm = htm + Requeridos() + 'Fecha de Recepción en VG<br>'; }
            if (formDQOT.hechos == '') { htm = htm + Requeridos() + 'Hechos DQOT<br>'; }
            if ($("#tipexpediente-frmDatosCalificacionE").val() == '99') { htm = htm + Requeridos() + 'Tipo Expediente<br>'; }
            if ($("#expedsc-frmDatosCalificacionE").val() == '99') { htm = htm + Requeridos() + 'Expediente a aportar<br>'; }
            if ($("#descapo-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Descripción de la aportación<br>'; }

            Swal.fire({
                icon: "error",
                html: htm,

            });
        } else {

            $.ajax({
                type: "POST",
                url: "GuardaCalifQuej",
                data: combinedData,
                dataType: "JSON",
                success: function (response) {
                    if (response.status = "OK") {
                        closeModal('modaltabCalif');
                        Swal.fire({
                            icon: "success",
                            title: "Registro Exitoso",
                            text: "ID aportado:" + response.no_exp + " a expediente: " + expediente,
                        });

                        $.ajax({
                            type: "POST",
                            url: "listadovisitadorGeneral",
                            data: { vis: codigoArea, idabogado: idusuario },
                            dataType: "JSON",
                            success: function (response) {
                                console.log(response.data)
                                mostrarResTblFormatos(response.data, response.data1);
                            }
                        });

                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Debes de Acpetar y/o Rechazar todos los ID´s",
                        });
                    }
                },
                error: function (error) {
                    console.error("Error al enviar los datos:", error);
                }
            });
        }
    } else {
        var htm = "Validar información de la DQOT: \n";
        if (!$('#confi_hechosE').is(':checked') && !$('#confi_hechosE').is(':disabled')) { htm += '-Hechos\n'; }
        if (!$('#confi_lughecE').is(':checked') && !$('#confi_lughecE').is(':disabled')) { htm += '-Lugar de los hechos\n'; }
        if (!$('#confi_peticionaE').is(':checked') && !$('#confi_peticionaE').is(':disabled')) { htm += '-Peticiona\n'; }
        $.notify(htm, {
            className: "warn",
            position: "bottom right",
            autoHide: true,
            autoHideDelay: 5000,
            style: 'bootstrap',
            globalPosition: 'top center',
            showDuration: 400,
            hideDuration: 400,
            gap: 2
        });
    }
    
}

$(document).ready(function () {
    $(document).on('submit', 'form[id^="frmDatosCalificacion"]', function (event) {
        event.preventDefault();


        console.log("Button clicked! Event type: " + event.type);
        var formDQOT = {
            idqueja: 0,
            viainterpos: '',
            Abogadoqueja: '',
            hechos: '',
            municipioqueja: '',
            visitaduriaqueja: '',
            Fecha_Registro: '',
            Fecha_TurnoVG: '',
            sedeRegistro: '',
            tema: '',
            programa: '',
            observaciones: '',
            tablaAutRe_HecVio: [],
            tablaMedCaut: [],
            tablaDilig: [],

        };
        //VARIABLES
        var AutRe_HecVioT = [], MedCaute = [], Diligen = [];
        var idquejaE = $('#idquejaE').val();
        //DATOS SELECT
        var formQueja = $(this).serializeArray();
        //TABLA AUTORIDADES RESPONSABLES - HECHOS VIOLATORIOS
        $('#tablaAutRe_HecVioTE tbody tr').each(function (x) {
            x = x + 1;
            //var autoridad = $(this).find('select[name="autoridadres"]').val();
            var tipo = $(this).find('input[id^="tipautoE_"]:checked').val();
            var autoridad = $(this).find('select[id^="autoridadresE_"]').val();
            var hecho = $(this).find('select[name^="hechvio"]').val();
            if (autoridad !== '99' && hecho !== '99' && typeof autoridad != 'undefined' && typeof hecho != 'undefined') {
                AutRe_HecVioT.push({
                    autoridad: autoridad,
                    hecho: hecho,
                    idquejaE: idquejaE,
                    idAutoHec: x,
                    tipoA: tipo
                });
            }

        });
        //OBTENER MEDIDAS CUATELARES
       
        if ($('input[id=idmedCuate' + idquejaE + ']:checked').val() == 'Si') {
            var badera_envío = false;
            $('#tablaMedCuateTE tbody tr').each(function (x) {
                console.log(x);
                /* var autoridad = $(this).find('select[name^="autoridadresMC"]').val();*/
                var fechaEmision = $(this).find('input[id="fechaEmisionE_' + x + '"]').val();
                var archivoEmision = $(this).find('input[id="archivoEmisionruta_' + x + '"]').val();
                var fechaAtencion = $(this).find('input[id="fechaAtencionE_' + x + '"]').val();
                var archivoAtencion = $(this).find('input[id="archivoAtencionRuta_' + x + '"]').val();
                var noOficioT = $(this).find('input[id="noOficioE_' + x + '"]').val();
                var obsEmision = $(this).find('textarea[id="obsEmisionE_' + x + '"]').val();
                var obsAtencion = $(this).find('textarea[id="obsAtencionE_' + x + '"]').val();
                var statust = 0;


                var banderaEstatus = document.getElementById('cumplioE1_' + x).checked;
                console.log('No_Oficio' + noOficioT);

                if (banderaEstatus) {
                    if (noOficioT == '' || fechaEmision == '' || fechaAtencion == '' || obsEmision == '' || obsAtencion == '') {
                        badera_envío = true;

                    }
                    MedCaute.push({
                        noOficio: noOficioT,
                        fechaEmision: fechaEmision,
                        archivoEmision: archivoEmision,
                        fechaAtencion: fechaAtencion,
                        archivoAtencion: archivoAtencion,
                        obsEmision: obsEmision,
                        obsAtencion: obsAtencion,
                        idMedCaut: x,
                        status: 1
                    });


                } else {
                    if (noOficioT == '' || fechaEmision == ''|| obsEmision == '') {
                        badera_envío = true;

                    }
                    MedCaute.push({
                        noOficio: noOficioT,
                        fechaEmision: fechaEmision,
                        archivoEmision: archivoEmision,
                        fechaAtencion: '',
                        archivoAtencion: '',
                        obsEmision: obsEmision,
                        obsAtencion: '',
                        idMedCaut: x,
                        status: 0
                    });

                }

                x = x + 1;

            });

            console.log(MedCaute);
        }
        //DILIGENCIAS
        $('#tablaDiligTE tbody tr').each(function (x) {
            x = x + 1;
            var dilig = $(this).find('input[id^="diligenArregE_"]').val();
            if (dilig !== '' && typeof dilig !='undefined') {
                var combinedDil = JSON.parse(dilig);
                var numOfMe = '', atencion = '', archAdj = '', viaint = 0, fecReci = '', fecha_soli = '';
                if (parseInt(combinedDil.tipodil) !== 3) {
                    numOfMe = combinedDil.noOfMe;
                    atencion = combinedDil.plazo;
                    archAdj = combinedDil.archEvAd;
                    viaint = combinedDil.viaDil;
                    fecReci = combinedDil.Fecha_Recib;
                    fecha_soli = combinedDil.Fecha_Soli;
                }
                if (combinedDil.descripcion !== '' && combinedDil.fecEm !== '' && combinedDil.tipodil !== '') {
                    Diligen.push({
                        tipodilig: combinedDil.tipodil,
                        descrip: combinedDil.descripcion,
                        fechaAlta: combinedDil.fecEm,
                        numOfMe: numOfMe,
                        atencion: atencion,
                        archAdj: archAdj,
                        idMedCaut: x,
                        viaint: viaint,
                        fecReci: fecReci,
                        archEvi: combinedDil.archEvi,
                        fecha_soli: fecha_soli,
                        desc_evi: combinedDil.descEvi
                    });
                }
            }
        });
        //DATOS DQOT


        formDQOT = {
            tipGuarda: '',
            idqueja: idquejaE,
            viainterpos: $('#viainterposE').val(),
            Abogadoqueja: $('#AbogadoquejaE').val(),
            hechos: $('#hechosE').val(),
            municipioqueja: $('#municipioquejaE').val(),
            visitaduriaqueja: $('#visitaduriaquejaE').val(),
            Fecha_Registro: $('#Fecha_RegistroE').val(),
            Fecha_TurnoVG: $('#Fecha_TurnoVGE').val(),
            sedeRegistro: $('#sedeRegistroE').val(),
            observaciones: $('#observacionesE').val(),
            tablaAutRe_HecVio: AutRe_HecVioT,
            longitudtabla1: AutRe_HecVioT.length,
            tablaMedCaut: MedCaute,
            longitudtabla2: MedCaute.length,
            tablaDilig: Diligen,
            longitudtabla3: Diligen.length,
            arreglotemas: $('#tema-frmDatosCalificacionE').val(),
            tipexpediente: $("#tipexpediente-frmDatosCalificacionE").val(),
            expedsc: '',
            descapo: ''
        };

        var combinedData = formQueja.reduce(function (acc, item) {
            acc[item.name] = item.value;
            return acc;
        }, formDQOT);

        var pro = $("#programa-frmDatosCalificacionE").val();
        var mate = $("#materia-frmDatosCalificacionE").val();
        var tip = $("#tipexpediente-frmDatosCalificacionE").val();
        var espe = $("#especializado-frmDatosCalificacionE").val();
        var tran = $("#trancpub-frmDatosCalificacionE").val();
        var niv = $("#nivries-frmDatosCalificacionE").val();
        if (($('#confi_hechosE').is(':checked') || $('#confi_hechosE').is(':disabled')) && ($('#confi_lughecE').is(':checked') || $('#confi_lughecE').is(':disabled')) && ($('#confi_peticionaE').is(':checked') || $('#confi_peticionaE').is(':disabled'))) {
            if (formDQOT.longitudtabla1 <= 0 || formDQOT.arreglotemas == '' || $("#programa-frmDatosCalificacionE").val() == '' || formDQOT.visitaduriaqueja == ''
                || $("#materia-frmDatosCalificacionE").val() == '' || $("#tipexpediente-frmDatosCalificacionE").val() == '' || $("#especializado-frmDatosCalificacionE").val() == '' || $("#trancpub-frmDatosCalificacionE").val() == ''
                || $("#nivries-frmDatosCalificacionE").val() == '' || formDQOT.Fecha_TurnoVG == '' || formDQOT.municipioqueja == '' || formDQOT.hechos == '' || badera_envío) {
                var htm = `<div style ="float:left; font-weight: bold;">Completar los campos requeridos marcados con un ` + Requeridos() + `</p>`;
                if ($("#programa-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Programa<br>'; }
                if (formDQOT.visitaduriaqueja == '') { htm = htm + Requeridos() + 'Visitaduría General<br>'; }
                if (formDQOT.hechos == '') { htm = htm + Requeridos() + 'Hechos DQOT <br>'; }
                if ($("#materia-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Materia<br>'; }
                if ($("#tipexpediente-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Tipo Expediente<br>'; }
                if ($("#especializado-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Especializado<br>'; }
                if ($("#trancpub-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Traciende a la opinión pública<br>'; }
                if ($("#nivries-frmDatosCalificacionE").val() == '') { htm = htm + Requeridos() + 'Nivel de Riesgo<br>'; }
                if (formDQOT.arreglotemas == '') { htm = htm + Requeridos() + 'Tema<br>'; }
                if (formDQOT.Fecha_TurnoVG == '') { htm = htm + Requeridos() + 'Fecha de Recepción en VG<br>'; }
                if (formDQOT.municipioqueja == '') { htm = htm + Requeridos() + 'Lugar donde Ocurrieron los Hechos<br>'; }
                if (formDQOT.longitudtabla1 <= 0) { htm = htm + Requeridos() + 'Autoridades - Hechos Violatorios<br>'; }
                if (badera_envío) { htm = htm + 'Verificar que los datos Requeridos de la tabla de medidas Cautelares estén completos'; }
                //if (formDQOT.longitudtabla2 <= 0) { htm = htm + Requeridos() + 'Medidas Cautelares<br>'; }
                //var valo = $('input[id=idmedCuate' + idquejaE + ']:checked').val();
                //if ($('input[id=idmedCuate' + idquejaE + ']:checked').val() == 'Si' && formDQOT.longitudtabla2 <= 0) {
                //    htm = htm + Requeridos() + 'Medidas Cuatelares<br>';
                //}
                Swal.fire({
                    icon: "error",
                    html: htm,

                });
            }
            else {

                $.ajax({
                    type: "POST",
                    url: "GuardaCalifQuej",
                    data: combinedData,
                    dataType: "JSON",
                    success: function (response) {
                        if (response.status = "OK") {
                            closeModal('modaltabCalif');
                            Swal.fire({
                                icon: "success",
                                title: "Expediente Calificado",
                                text: "Número de expediente :" + response.no_exp + "-2024",

                            });

                            $.ajax({
                                type: "POST",
                                url: "listadovisitadorGeneral",
                                data: { vis: codigoArea, idabogado: idusuario },
                                dataType: "JSON",
                                success: function (response) {
                                    console.log(response.data)
                                    mostrarResTblFormatos(response.data, response.data1);
                                }
                            });

                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Debes de Acpetar y/o Rechazar todos los ID´s",
                            });
                        }
                    },
                    error: function (error) {
                        console.error("Error al enviar los datos:", error);
                    }
                });
            }
        } else {
            var htm = "Validar información de la DQOT: \n";
            if (!$('#confi_hechosE').is(':checked') && !$('#confi_hechosE').is(':disabled')) { htm += '-Hechos\n'; }
            if (!$('#confi_lughecE').is(':checked') && !$('#confi_lughecE').is(':disabled')) { htm += '-Lugar de los hechos\n'; }
            if (!$('#confi_peticionaE').is(':checked') && !$('#confi_peticionaE').is(':disabled')) { htm += '-Peticiona\n'; }
            $.notify(htm, {
                className: "warn",
                position: "bottom right",
                autoHide: true,
                autoHideDelay: 5000,
                style: 'bootstrap',
                globalPosition: 'top center',
                showDuration: 400,
                hideDuration: 400,
                gap: 2
            });
        }
    });

});

function guardaDili(tip, numF) {
    var mensaje = 'Datos faltantes <br>';
    if (tip !== 3 && $('#viaDil').val() === '99' || $('#descripcion').val() === '' || $('#noOfMe').val() === '' || $('#Fecha_Soli').val() === '' /*|| $('#archEvAd').val() === ''*/ || $('#plazo').val() === '') {
        if ($(`#viaDil`).val() === '99') { mensaje += Requeridos() + "Via <br>"; }
        if ($('#descripcion').val() === '') { mensaje += Requeridos() + "Descripción <br>"; }
        if ($('#noOfMe').val() === '') { mensaje += Requeridos() + "Número de Oficio o Memorándum <br>"; }
        if ($('#Fecha_Soli').val() === '') { mensaje += Requeridos() + "Fecha Solicitud <br>"; }
        //if ($('#archEvAd').val() === '') { mensaje += Requeridos() + "Evidencia <br>"; }
        //if ($('#descEvi').val() === '') { mensaje += Requeridos() + "Descripción de Evidencia <br>"; }
        if ($('#plazo').val() === '') { mensaje += Requeridos() + "Plazo de Atención <br>"; }

        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            html: mensaje,
        });
    } else if ($('#descripcion').val() === '') {
        if ($(`#descripcion`).val() === '') { mensaje += Requeridos() + "Descripción <br>"; }
        //if ($('#archEvAd').val() === '') { mensaje += Requeridos() + "Evidencia <br>"; }
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            html: mensaje,
        });
    } else {
        $(`#descrip_${numF}`).val($('#descripcion').val());
        var formDetalleDil = $("#formDetalleDil").serializeArray();
        var combinedData = formDetalleDil.reduce(function (acc, item) {
            acc[item.name] = item.value;
            return acc;
        }, { archEvAd: $("#archEvAdt").val(), archEvi: $("#archEvAd2t").val()});
        var combinedDataJson = JSON.stringify(combinedData);
        $(`#diligenArregE_${numF}`).val('');
        $(`#diligenArregE_${numF}`).val(combinedDataJson);
        closeModal('modalDilig');
    }
}

function funcionesEscritoi() {
    //$(document).on('click', '.upload-field', function () {
    //    var file = $(this).parent().parent().parent().find('.input-file');
    //    file.trigger('click');
    //});
    //$(document).on('change', '.input-file', function () {
    //    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    //});

    $(document).on('click', '.upload-field', function () {
        var fileInput;
        if ($(this).attr('id') === 'archEvAdb') {
            fileInput = $('#archEvAd');
        } else if ($(this).attr('id') === 'archEvAdb2') {
            fileInput = $('#archEvAd2');
        } else {
            fileInput = $(this).closest('.input-group').siblings('.input-file');
        }
        if (fileInput.length) {
            fileInput.trigger('click');
        }
    });

    $(document).on('change', '.input-file', function () {
        $(this).parent().find('.form-control').val($(this)[0].files[0].name);
        //event.preventDefault();
        var fileInput = $(this)[0].files[0];
        if (!fileInput) {
            alert('Por favor selecciona un archivo PDF.');
            $(this).parent().find('.form-control').val();
            return;
        }

        if (fileInput.type !== 'application/pdf') {
            alert('Por favor selecciona un archivo PDF.');
            $(this).parent().find('.form-control').val();
            return;
        }
        $($(this).parent().find('.btn')[1]).attr('onClick', '');
        $($(this).parent().find('.btn')[1]).attr('onClick',`GeneraDocumento_pdf('${$(this)[0].files[0].name}')`);
        var formData = new FormData();
        formData.append('file', fileInput);

        $.ajax({
            url: 'subirarchivoserver', // Cambia esto por la URL de tu servidor
            type: 'POST',
            data: formData,
            processData: false, // No procesar los datos
            contentType: false, // No establecer el content-type
            success: function (response) {
                alert('Archivo PDF subido exitosamente');

                console.log(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error al subir el archivo');
                console.error(textStatus, errorThrown);
            }
        });
           
    });

}


function subirArchivo()
{
   

}

function GuardPrel() {
    console.log("Guarado preliminar de la información");
    var formDQOT = {
        idqueja: 0,
        viainterpos: '',
        Abogadoqueja: '',
        hechos: '',
        municipioqueja: '',
        visitaduriaqueja: '',
        Fecha_Registro: '',
        Fecha_TurnoVG: '',
        sedeRegistro: '',
        tema: '',
        programa: '',
        observaciones: '',
        tablaAutRe_HecVio: [],
        tablaMedCaut: [],
        tablaDilig: [],
    };
    //VARIABLES
    var AutRe_HecVioT = [], MedCaute = [], Diligen = [];
    var idquejaE = $('#idquejaE').val();
    //DATOS SELECT
    var formQueja = $(this).serializeArray();
    //TABLA AUTORIDADES RESPONSABLES - HECHOS VIOLATORIOS
    $('#tablaAutRe_HecVioTE tbody tr').each(function (x) {
        x = x + 1;
        //var autoridad = $(this).find('select[name="autoridadres"]').val();
        var tipo = $(this).find('input[id^="tipautoE_"]:checked').val();
        var autoridad = $(this).find('select[id^="autoridadresE_"]').val();
        var hecho = $(this).find('select[name^="hechvio"]').val();
        if (autoridad !== '99' && hecho !== '99' && typeof autoridad != 'undefined' && typeof hecho != 'undefined') {
            AutRe_HecVioT.push({
                autoridad: autoridad,
                hecho: hecho,
                idquejaE: idquejaE,
                idAutoHec: x,
                tipoA: tipo
            });
        }

    });
    //OBTENER MEDIDAS CUATELARES
    if ($('input[id=idmedCuate' + idquejaE + ']:checked').val() == 'Si') {
        $('#tablaMedCuateTE tbody tr').each(function (x) {
            console.log(x);
            /* var autoridad = $(this).find('select[name^="autoridadresMC"]').val();*/
            var fechaEmision = $(this).find('input[id="fechaEmisionE_' + x + '"]').val();
            var archivoEmision = $(this).find('input[id="archivoEmisionruta_' + x + '"]').val();
            var fechaAtencion = $(this).find('input[id="fechaAtencionE_' + x + '"]').val();
            var archivoAtencion = $(this).find('input[id="archivoAtencionRuta_' + x + '"]').val();
            var noOficioT = $(this).find('input[id="noOficioE_' + x + '"]').val();
            var obsEmision = $(this).find('textarea[id="obsEmisionE_' + x + '"]').val();
            var obsAtencion = $(this).find('textarea[id="obsAtencionE_' + x + '"]').val();
            var statust = 0;


            var banderaEstatus = document.getElementById('cumplioE1_' + x).checked;

            if (banderaEstatus) {

                MedCaute.push({
                    noOficio: noOficioT,
                    fechaEmision: fechaEmision,
                    archivoEmision: archivoEmision,
                    fechaAtencion: fechaAtencion,
                    archivoAtencion: archivoAtencion,
                    obsEmision: obsEmision,
                    obsAtencion: obsAtencion,
                    idMedCaut: x,
                    status: 1
                });


            } else {

                MedCaute.push({
                    noOficio: noOficioT,
                    fechaEmision: fechaEmision,
                    archivoEmision: archivoEmision,
                    fechaAtencion: '',
                    archivoAtencion: '',
                    obsEmision: obsEmision,
                    obsAtencion: '',
                    idMedCaut: x,
                    status: 0
                });

            }

            x = x + 1;

        });

        console.log(MedCaute);
    }
    //DILIGENCIAS
    $('#tablaDiligTE tbody tr').each(function (x) {
        x = x + 1;
        var dilig = $(this).find('input[id^="diligenArregE_"]').val();
        if (dilig !== '' && typeof dilig != 'undefined') {
            var combinedDil = JSON.parse(dilig);
            var numOfMe = '', atencion = '', archAdj = '', viaint = 0, fecReci = '', fecha_soli = '';
            if (parseInt(combinedDil.tipodil) !== 3) {
                numOfMe = combinedDil.noOfMe;
                atencion = combinedDil.plazo;
                archAdj = combinedDil.archEvAd;
                viaint = combinedDil.viaDil;
                fecReci = combinedDil.Fecha_Recib;
                fecha_soli = combinedDil.Fecha_Soli;
            }
            if (combinedDil.descripcion !== '' && combinedDil.fecEm !== '' && combinedDil.tipodil !== '') {
                Diligen.push({
                    tipodilig: combinedDil.tipodil,
                    descrip: combinedDil.descripcion,
                    fechaAlta: combinedDil.fecEm,
                    numOfMe: numOfMe,
                    atencion: atencion,
                    archAdj: archAdj,
                    idMedCaut: x,
                    viaint: viaint,
                    fecReci: fecReci,
                    archEvi: combinedDil.archEvi,
                    fecha_soli: fecha_soli,
                    desc_evi: combinedDil.descEvi
                });
            }
        }
    });
    //DATOS DQOT

    formDQOT = {
        tipGuarda: 'preliminar',
        idqueja: idquejaE,
        viainterpos: $('#viainterposE').val(),
        Abogadoqueja: $('#AbogadoquejaE').val(),
        hechos: $('#hechosE').val(),
        municipioqueja: $('#municipioquejaE').val(),
        visitaduriaqueja: $('#visitaduriaquejaE').val(),
        Fecha_Registro: $('#Fecha_RegistroE').val(),
        Fecha_TurnoVG: $('#Fecha_TurnoVGE').val(),
        sedeRegistro: $('#sedeRegistroE').val(),
        observaciones: $('#observacionesE').val(),
        tablaAutRe_HecVio: AutRe_HecVioT,
        longitudtabla1: AutRe_HecVioT.length,
        tablaMedCaut: MedCaute,
        longitudtabla2: MedCaute.length,
        tablaDilig: Diligen,
        longitudtabla3: Diligen.length,
        arreglotemas: $('#tema-frmDatosCalificacionE').val(),
        tipexpediente: $("#tipexpediente-frmDatosCalificacionE").val(),
        expedsc: $("#expedsc-frmDatosCalificacionE").val(),
        descapo: $("#descapo-frmDatosCalificacionE").val()
    };

    var combinedData = formQueja.reduce(function (acc, item) {
        acc[item.name] = item.value;
        return acc;
    }, formDQOT);
    $.ajax({
        type: "POST",
        url: "GuardaCalifQuej",
        data: combinedData,
        dataType: "JSON",
        success: function (response) {
            if (response.status = "OK") {
                //$("#modaltabCalif").modal("close");
                Swal.fire({
                    icon: "info",
                    title: "Información actualizada",
                    text: "Guardado Temporalmente",

                });

            }
        }
    });
}


function generaPDFCedula() {


    try {

        var id = $("#idquejaE").val();
        var exp = $("#Titulo_Modal").val();
        var folio = '';
        var viaI = $("#viainterposE").find('option:selected').text();
        var programaE = $("#programa-frmDatosCalificacionE").find('option:selected').text();
        var materia = $("#materia-frmDatosCalificacionE").find('option:selected').text();
        var abogadoT = '';
        var fechaCali = '';
        var fechaRegistro = $("#Fecha_RegistroE").val();
        var fechaTurnEle = $("#visitaduriaquejaE").val();
        var vis = $("#visitaduriaquejaE").val();
        var fechaFisicaVis = '';
        var fechaTurnoA = '';
        var lugarHechos = $("#municipioquejaE").find('option:selected').text();
        var peticionarios = '';
        var autoridad = '';
        var derHV = '';
        var HechoV = '';
        var tipoPet = '';
        var autoridadAmbi = '';
        var sexoPet = '';
        var hecho = $("#hechosE").val();
        var longitudHecho = $("#hechosE").val().length;
        console.log(hecho);
        console.log(peticionarios);

        var posicionY1 = 0;
        var posicionX1 = 0;
        var posicionY2 = 0;
        var posicionX2 = 0;
        var posicionY3 = 0;
        var posicionX3 = 0;

        /*       for (let index = 0; index < array.length; index++) {
            const element = array[index];
        
           }*/
        /*Nombre del peticionario*/

        var peticionario = peticionarios.split(',');
        var petici = peticionario[0].split('<');
        var peti = '';
        var contadorPeticionarios = 0;
        for (let index = 0; index < peticionario.length; index++) {
            peti = peti + peticionario[index].trim() + '\n';
            contadorPeticionarios = contadorPeticionarios + 1;
        }



        var autorida = autoridad.split('-');
        var autorida1 = autoridad.split('</td>');

        var aut = '';


        for (let index = 0; index < autorida.length - 1; index++) {
            aut = aut + autorida[index].trim() + '\n';
        }



        /*
               var uniqueArr = [...new Set(autorida1)]
               console.log(uniqueArr);
               for (let index = 0; index < uniqueArr.length; index++) {
                var auto=uniqueArr[index].split('<td>');
                console.log(auto);
                    if(auto.length==2){
                        console.log(auto);
                        if (auto[1]=="")
                        {
                        
                        }else {aut=aut+auto[1]+'\n';}
                    }
                }
    
        */
        //var autor=autorida[0];

        // var auto=autor.split('<td>');
        /*for (let index = 0; index < autorida.length; index++) {
         aut=aut+autorida[index].trim()+'\n';
        }*/


        //aut=auto[1];


        var deHV = derHV.split(',');
        var DHV = deHV[0];

        var hechv = HechoV.split('\n');
        var HV = '';

        for (let index = 0; index < hechv.length; index++) {
            HV = HV + hechv[index].trim() + '\n';
        }

        var ambitoA = autoridadAmbi.split(',');
        var ambito = '';
        var amb = '';
        var uniqueArr1 = [...new Set(ambitoA)]
        for (let index = 0; index < uniqueArr1.length; index++) {
            ambito = uniqueArr1[index];

            if (ambito == 'M') {
                amb = amb + 'MUNICIPAL' + '\n';
            } else if (ambito == 'E') {
                amb = amb + 'ESTATAL' + '\n';
            }


        }


        var sexoPetic = sexoPet.split(',');
        var sexop = sexoPetic[0];
        var sexp = '';

        console.log(sexop);

        if (sexop == '1') {
            sexp = 'PETICIONARIO';
        } else if (sexop == '2') {
            sexp = 'PETICIONARIA';
        } else {
            sexp = 'OTRO';
        }



        var tipoPE = tipoPet.split(',');
        var tipoP = tipoPE[0];
        var tipo = "";
        for (let index = 0; index < tipoPE.length - 1; index++) {
            if (tipoPE[index] == 'Q') {
                tipo = tipo + "PETICIONARIO" + '\n';
            } else {
                tipo = tipo + "AGRAVIADO" + '\n';
            }
        }



        var NombreV = '';
        var sexoV = '';
        console.log(vis);
        if (vis==1) {
            NombreV = 'LCDO. VICTOR KURI BUJAIDAR';
            sexoV = 'PRIMER VISITADOR GENERAL';
        }

        if (vis == 2) {
            NombreV = 'MTRO. ISRAEL VILLA COBOS';
            sexoV = 'SEGUNDO VISITADOR GENERAL';
        }

        if (vis == 3) {
            NombreV = 'MTRA. JESSICA CALDERON GARCIA';
            sexoV = 'TERCERA VISITADORA GENERAL';
        }

        if (vis == 4) {
            NombreV = 'MTRO.IVAN ANDRES FLORES CANO';
            sexoV = 'CUARTO VISITADOR GENERAL';
        }


        /*Función de la longitud del eje y cuando se tengan a mas de 2 peticionarios 08-09-2023*/
        //doc.setFontType("normal");doc.text(20, 125, tipo); -- Datos de referencia para la posición Inicial
        //doc.setFontType("normal");doc.text(120,125,  peti);-- Datos de referencia para la posición Inicial
        /*Posicion que inicia en el campo TIPO para agregar a mas de 2 peticionarios*/
        posicionX2 = 20;//Posición primera Columna
        posicionY2 = 125;
        var sizeFontPet = 10;
        var sizeFontAut = 8;
        /*Posicion QUE inicia en el campo Nombre para agregar a mas de 2 peticionarios*/
        posicionX3 = 120;//Posición Segunda Columna
        posicionY3 = 125;

        if (peticionario.length > 2) {
            for (let index = 0; index < peticionario.length; index++) {
                var sizeFontPet = 7;
                posicionY2 = posicionY2 + 2.25;//Adición de 14 unidades por cada peticionario extra que exista sobre la primera columna en el eje de las y
                posicionY3 = posicionY3 + 2.25;//Adición de 14 unidades por cada peticionario extra que exista sobre la Segunda columna en el eje de las y
            }
        }


        var doc = new jsPDF({ filters: ["ASCIIHexEncode"] });

        /*Colocación del logo izquierdo y derecho*/
        var logo = new Image();
        logo.src = "/img/cdh_imagotipo_completo-03.png";
        console.log(logo)

            //logo=img;
        logo.onload = function () {
            // Este código se ejecutará una vez que la imagen se haya cargado correctamente
            doc.addImage(logo, 'JPEG', 20, 1, 15, 18);

            //doc.addImage(logo, 'JPEG', 20, 1, 15, 18);//JPEG
            /*
         var logo1 = new Image();
         logo1.src = 'foto.jpg';
         doc.addImage(logo1, 'JPEG', 15, 40,148,210);
         */

            /*Colocación del logo izquierdo y derecho*/
            /*Cuerpo  del Documento*/
            doc.setFontType("bold");
            doc.setFontSize(10);

            /*Cominenza el encabezado*/
            doc.text(20, 20, '____________________________________________________________________________________');
            doc.text(100, 20, 'CÉDULA DE CALIFICACIÓN', { align: 'center' });
            doc.text(90, 25, 'EXPEDIENTE:', { align: 'center' });
            doc.setFontType("normal"); doc.text(110, 25, exp, { align: 'center' });
            doc.setFontType("bold"); doc.text(20, 30, 'ID:');
            doc.setFontType("normal"); doc.text(25, 30, id);
            doc.setFontType("bold"); doc.text(170, 30, 'FOLIO:');
            doc.setFontType("normal"); doc.text(183, 30, folio);
            doc.setFontType("bold"); doc.text(100, 40, 'DATOS GENERALES DE LA QUEJA ', { align: 'center' });
            /*Termina el encabezado*/

            /*Datos Generales de la queja*/
            doc.setFontType("bold"); doc.text(20, 50, 'FECHA Y HORA DE REGISTRO: ');
            doc.setFontType("normal"); doc.text(20, 55, fechaRegistro);
            doc.setFontType("bold"); doc.text(120, 50, 'FECHA TURNO ELECTRONICO A VG: ');
            doc.setFontType("normal"); doc.text(120, 55, fechaTurnEle);
            doc.setFontType("bold"); doc.text(20, 65, 'FECHA DE RECEPCIÓN FÍSICA A VG: ');
            doc.setFontType("normal"); doc.text(20, 70, fechaFisicaVis);
            doc.setFontType("bold"); doc.text(120, 65, 'FECHA TURNO ABOGADO');
            doc.setFontType("normal"); doc.text(120, 70, fechaTurnoA);
            doc.setFontType("bold"); doc.text(20, 80, 'VIA ENTRADA:');
            doc.setFontType("normal"); doc.text(20, 85, viaI);
            doc.setFontType("bold"); doc.text(120, 80, 'FECHA CALIFICACIÓN:');
            doc.setFontType("normal"); doc.text(120, 85, fechaCali);
            doc.setFontType("bold"); doc.text(20, 95, 'LUGAR DONDE SE COMETIRON LOS HECHOS VIOLATORIOS:');
            doc.setFontType("normal"); doc.text(20, 100, lugarHechos);
            /*Termina datos Generales de la queja*/

            var renglonHV = doc.splitTextToSize(HechoV, 70);
            /*Datos del peticionario*/
            doc.setFontType("bold"); doc.text(100, 110, 'PETICIONARIO(AS)/AGRAVIADOS(AS)', { align: 'center' });
            doc.text(20, 120, 'TIPO:');
            doc.setFontType("bold"); doc.text(120, 120, 'NOMBRE:');
            doc.setFontSize(sizeFontPet);
            doc.setFontType("normal"); doc.text(20, 125, tipo);
            doc.setFontType("normal"); doc.text(120, 125, peti);

            posicionX1 = 120;
            posicionY1 = 170;

            doc.setFontSize(10);

            // var longitud_Texo_autoridad=aut.length;
            var longitud_texto_Hecho_vi = HechoV.length;
            //console.log(longitud_Texo_autoridad);
            console.log(longitud_texto_Hecho_vi);
            /*Función de la longitud del eje y cuando se tengan a mas de 2 peticionarios 08-09-2023*/

            posicionY2 = posicionY2 + 10;//posición de los titulos
            doc.setFontType("bold"); doc.text(20, posicionY2, 'AUTORIDAD RESPONSABLE:');//pos 135
            doc.setFontSize(10);
            doc.setFontType("bold"); doc.text(120, posicionY2, 'ASUNTO:');//pos 135
            posicionY2 = posicionY2 + 5;//posición de las descripciones
            doc.setFontSize(8);
            doc.setFontType("normal"); doc.text(20, posicionY2, aut);//pos 140
            doc.setFontSize(8);
            doc.setFontType("normal"); doc.text(120, posicionY2, amb);//pos 140

            /* Function del eje Y cuando se tiene  mas de una autoridad 08-09-2023 */

            if (autorida.length > 2) {
                for (let index = 0; index < autorida.length; index++) {
                    var sizeFontAut = 7;
                    posicionY2 = posicionY2 + 2.25;//Adición de 10 unidades por cada autoridad extra que exista sobre la primera columna en el eje de las y
                    posicionY3 = posicionY3 + 2.25;//Adición de 10 unidades por cada autoridad extra que exista sobre la Segunda columna en el eje de las y
                }
            }

            console.log(posicionY2);

            /* Function del eje Y cuando se tiene  mas de una autoridad 08-09-2023 */

            posicionY2 = posicionY2 + 10;//posición de los titulos
            doc.setFontSize(10);
            doc.setFontType("bold"); doc.text(20, posicionY2, 'DERECHO HUMANO VULNERADO:');//pos 150
            doc.setFontSize(10);
            doc.setFontType("bold"); doc.text(120, posicionY2, 'HECHO VIOLATORIO:');//pos 150
            posicionY2 = posicionY2 + 5;//posición de las descripciones
            doc.setFontSize(8);
            doc.setFontType("normal"); doc.text(20, posicionY2, derHV);//pos 155
            doc.setFontSize(8);
            doc.setFontType("normal"); doc.text(120, posicionY2, renglonHV);//pos 155

            /* Function del eje Y cuando se tiene  mas de un Hecho Violatorio  08-09-2023 */

            if (hechv.length > 1) {
                for (let index = 0; index < autorida.length; index++) {
                    var sizeFontAut = 7;
                    posicionY2 = posicionY2 + 2.25;//Adición de 2.25 unidades por cada autoridad extra que exista sobre la primera columna en el eje de las y
                    posicionY3 = posicionY3 + 2.25;//Adición de 2.25 unidades por cada autoridad extra que exista sobre la Segunda columna en el eje de las y
                }
            }

            console.log(posicionY2);

            /* Function del eje Y cuando se tiene  mas de un Hecho Violatorio  08-09-2023 */


            /*Metodo para  ajustar el texto del Hecho violatorio*/
            if (longitud_texto_Hecho_vi <= 156) {
                posicionY2 = posicionY2 + 10;//posición de los titulos
                doc.setFontType("bold"); doc.text(120, posicionY2, 'PROGRAMA:');
                posicionY2 = posicionY2 + 5;//posición de las descripciones
                doc.setFontType("normal"); doc.text(120, posicionY2, programaE);

            } else if (longitud_texto_Hecho_vi > 156 && longitud_texto_Hecho_vi <= 170) {
                posicionY2 = posicionY2 + 10;
                doc.setFontType("bold"); doc.text(posicionX1, posicionY2, 'PROGRAMA:');
                posicionY2 = posicionY2 + 5;
                doc.setFontType("normal"); doc.text(posicionX1, posicionY2, programaE);

            } else {
                posicionY2 = posicionY2 + 20;
                doc.setFontType("bold"); doc.text(posicionX1, posicionY2, 'PROGRAMA:');
                posicionY2 = posicionY2 + 5;
                doc.setFontType("normal"); doc.text(posicionX1, posicionY2, programaE);
            }

            /*Metodo para  ajustar el texto del Hecho violatorio*/
            doc.setFontType("bold"); doc.text(20, posicionY2, 'MATERIA:');
            posicionY2 = posicionY2 + 5;
            doc.setFontType("normal"); doc.text(20, posicionY2, materia);//pos 175
            //aqui va el programa
            posicionY2 = posicionY2 + 10;
            doc.setFontType("bold"); doc.text(20, posicionY2, 'EL/LA AGRAVIADO/A TIENE EL CARACTER DE:');
            posicionY2 = posicionY2 + 5;
            doc.setFontType("normal"); doc.text(20, posicionY2, 'PROBABLE RESPONSABLE');//pos 190
            posicionY2 = posicionY2 + 10;
            doc.setFontType("bold"); doc.text(20, posicionY2, 'HECHOS:');//pos 200
            doc.setFontSize(10);
            //doc.setFontType("normal");doc.text(20, 205, hecho,{align: 'justify',lineHeightFactor:1,maxWidth:180});
            /*Datos del peticionario*/
            doc.setFontSize(10);

            /*Footer de todas las Hojas del sistema de quejas*/
            doc.text(20, 270, '____________________________________________________________________________________');
            doc.setFontType("normal"); doc.text(10, 275, 'Comisión de Derechos Humanos del Estado de Puebla 5 poniente 339, Centro Histórico, Puebla, Pue., C.P. 72000');
            doc.text(100, 280, 'www.cdhpuebla.org.mx', { align: 'center' });
            doc.text(100, 285, 'TODOS LOS SERVICIOS SON GRATUITOS', { align: 'center' });

            if (peticionario.length > 12) {
                posicionY2 = posicionY2 + 5;
                doc.setFontType("normal"); doc.text(20, posicionY2, hecho, { align: 'justify', lineHeightFactor: 1, maxWidth: 180 });
                doc.addPage();
                doc.text(20, 40, abogadoT);//20
                doc.setFontType("bold"); doc.text(20, 45, 'VISITADOR/A ADJUNTO/A');//25

                //Nombre de los visitadores*
                doc.setFontType("normal"); doc.text(120, 40, NombreV);//20
                doc.setFontType("bold"); doc.text(120, 45, sexoV);//25

                doc.text(20, 50, '____________________________________________________________________________________');//30
                doc.setFontType("normal"); doc.text(10, 55, 'Comisión de Derechos Humanos del Estado de Puebla 5 poniente 339, Centro Histórico, Puebla, Pue., C.P. 72000');//35
                doc.text(100, 60, 'www.cdhpuebla.org.mx', { align: 'center' });//40
                doc.text(100, 65, 'TODOS LOS SERVICIOS SON GRATUITOS', { align: 'center' });//45

                /*Metodo para adicionar la leyenda de abajo dependiendo de la longitud del Hecho  11-09-2023*/



                /*Metodo para adicionar la leyenda de abajo dependiendo de la longitud del Hecho 11-09-2023*/

            } else {
                if (longitudHecho > 800) {
                    posicionY2 = posicionY2 + 5;
                    doc.setFontType("normal"); doc.text(20, posicionY2, hecho, { align: 'justify', lineHeightFactor: 1, maxWidth: 180 });
                    doc.addPage();

                    doc.text(20, 40, abogadoT);
                    doc.setFontType("bold"); doc.text(20, 45, 'VISITADOR/A ADJUNTO/A');

                    doc.setFontType("normal"); doc.text(120, 40, NombreV);
                    doc.setFontType("bold"); doc.text(120, 45, sexoV);

                    doc.text(20, 50, '____________________________________________________________________________________');
                    doc.setFontType("normal"); doc.text(10, 55, 'Comisión de Derechos Humanos del Estado de Puebla 5 poniente 339, Centro Histórico, Puebla, Pue., C.P. 72000');
                    doc.text(100, 60, 'www.cdhpuebla.org.mx', { align: 'center' });
                    doc.text(100, 65, 'TODOS LOS SERVICIOS SON GRATUITOS', { align: 'center' });
                } else {
                    posicionY2 = posicionY2 + 5;
                    doc.setFontType("normal"); doc.text(20, posicionY2, hecho, { lineHeightFactor: 1, maxWidth: 180 });
                    doc.text(20, 250, abogadoT);
                    doc.setFontType("bold"); doc.text(20, 255, 'VISITADOR/A ADJUNTO/A');

                    /*Nombre de los visitadores*/
                    doc.setFontType("normal"); doc.text(120, 250, NombreV);
                    doc.setFontType("bold"); doc.text(120, 255, sexoV);

                    doc.text(20, 270, '____________________________________________________________________________________');
                    doc.setFontType("normal"); doc.text(10, 275, 'Comisión de Derechos Humanos del Estado de Puebla 5 poniente 339, Centro Histórico, Puebla, Pue., C.P. 72000');
                    doc.text(100, 280, 'www.cdhpuebla.org.mx', { align: 'center' });
                    doc.text(100, 285, 'TODOS LOS SERVICIOS SON GRATUITOS', { align: 'center' });
                }
            }

            doc.save(exp + fechaCali + ".pdf");
        };
    } catch (error) {

        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Hubo un error al generar la cedula',
            showConfirmButton: false,
            timer: 1500
        });
        console.error(error);
    }
}