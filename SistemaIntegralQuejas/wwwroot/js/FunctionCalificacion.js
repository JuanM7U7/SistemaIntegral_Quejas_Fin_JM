
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
$(document).ready(function () {

    $("#vistavis").html($("#areaUser").val());
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

            
            console.log(index + ": " + $(this).val());
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
            } else
            {
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
                (async () => { // PDF Rechazado -Fred

                    const result = await Swal.fire({
                        title: 'Memorándum de IDs rechazados',
                        html: Inputs1,
                        focusConfirm: false,
                        preConfirm: () => {

                            var arreglo_Justificaciones = [];
                            var arregloIds = [];

                            $(".input_justi").each(function () {
                                var idElemento = $(this).attr('id');
                                var idArreglo = idElemento.replace("swal-input", "");
                                arreglo_Justificaciones.push($(this).val());
                                arregloIds.push(idArreglo);
                            });

                            var memorandum = $("#memoandum").val();
                            var p1 = $("#p1").val();
                            var p2 = $("#p2").val();
                            var p3 = $("#p3").val();

                            var visitaduriad = '';
                            var visitador = '';
                            var numeroVisiaduria = codigoArea;


                            return {
                                memorandum,
                                p1,
                                p2,
                                p3,
                                visitaduriad,
                                areaId: numeroVisiaduria,
                                arregloIds,
                                arreglo_Justificaciones
                            };
                        }
                    });

                    if (result.isConfirmed) {

                        GeneraPdfRechazados({
                            idQueja: 225,
                            visitaduria: result.value.visitaduriad,
                            areaId: result.value.areaId,
                            memorandum: result.value.memorandum,
                            primeraParte: result.value.p1,
                            segundaParte: result.value.p2,
                            terceraParte: result.value.p3,
                            observaciones: result.value.arregloIds.map((id, i) => ({
                                idExpediente: id,
                                justificacion: result.value.arreglo_Justificaciones[i]
                            }))
                        });
                    }

                })();
            } else {
                console.log(aceptados);
                return GeneraPdfRechazados({ IdQueja: 225, IdsAceptados: aceptados, Observaciones: [] });
            }
        /*Metodo de swetalert*/

        //console.log(elementos);
    });
    codigoArea = $("#idArea").val();
    console.log(codigoArea);

    $.ajax({
        type: "POST",
        url: "/Expediente/listadovisitadorGeneral",
        data: { vis: codigoArea },
        dataType: "JSON",
        success: function (response) {
            //console.log(response.data)
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
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function modalShow(id) {
    var modal = document.getElementById("modaltabDetalle");
    //console.log(modal);
    modal.style.display = "block";
    document.getElementById("defaultOpen").click();
    //RecuperaIds(id);
    Crear_Formulario_Queja(id);
    traeInformacionDatosComplementarios(id);
    //editFormatDatosPersonales('1447', '1447', '3');


}
var tableBuscadorFormatos = $("#tablaRecepcion");

function btnGenraBitacorCamb(exped) {
    window.open(CedBitacoraCambioPDF + exped, '_blank');
}

function mostrarResTblFormatos(response,response1) {

    tableBuscadorFormatos.DataTable({
        language: {
            "url": "/js/TablaJson.json"
        },
        iDisplayLength: 10,
        data: response,
        fixedHeader: true,
        columns: [
            {
                'mRender': function (data, type, full) {


                    btnEscritook = `<button id="myBtn" type='button' onclick='modalShow(${full.id})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-plus color-muted fa-2x'></span>
                                           </button>`+ `</br><button type='button' 
	                                                    title='Bitácora de cambios' 
	                                                    onclick='btnGenraBitacorCamb(${full.id})' 
	                                                    class='btn btn-link margin-iconbf'>
	                                                    <img src="../icons/personalizados/detective.png" height="35"/>
	                                                    </button>`;
                    return btnEscritook
                }
            }                ,          
            {
                data: 'id'

            },
            {
                data: 'fechaTurno'

            },
                        {
                data: 'fechaRecep'

            }
            ,
            {
                data: 'status'

            }
            ,
            {
                'mRender': function (data, type, full) {

                    if (full.status == 'Turnado parcial a VG') {

                        btnEscritook = `
                                       <select class="statusf">
                        <option value="99">Selecciona</option>
                        <option value="1-${full.id}">Aceptar</option>
                        <option value="0-${full.id}">Rechazar</option>
                    </select>`;
                    } else
                    {
                        if (full.status == 'Pendiente de Returno')
                        {
                            btnEscritook = `Rechazado`;
                           
                        } else
                        {
                            btnEscritook = `Aceptado`;
                        }
                       
                    }
                    return btnEscritook 
                }

            }/*,
            {
                'mRender': function (data, type, full) {


                    btnEscritook = `<button id="myBtn" type='button' onclick='modalShow(${full.id})' class='btn btn-link margin-iconbf'>
                                                <span class='fa fa-search color-muted fa-2x'></span>
                                           </button>`;
                    return btnEscritook
                }

            }*/
            ,
            {
                'mRender': function (data, type, full) {
                    var sel = "";
                    if (full.otro != '') {
                        if (full.status === 'Concluido') {
                            btnEscritook = `Se turnó a : ${full.otro}`;
                        } else {
                            btnEscritook = `Se turnó a : ${full.otro} <input type="button" value="Returnar ID" id="returnaIDS-${full.id}" class="returnaIDS">`;
                        }
                        $('[id *= "returnaIDS"]').on('click', function () {
                            //alert(this.id);
                            for (var i = 0; i < response1.length; i++) {
                                sel += `
                                    <option value="${response1[i].s2}-${full.id}">${response1[i].s1}</option>
                                    `;
                                arregloAbogados.push(response1[i].s2 + "-" + response1[i].s1);
                            }
                            ventana_acpeta_visitaduria("Selecciona el abogado(a) a returnar", this.id, arregloAbogados)

                        });

                    } else {
                        $("#EnvioID").removeAttr("Disabled");
                        for (var i = 0; i < response1.length; i++) {
                            sel += `
                                    <option value="${response1[i].s2}-${full.id}">${response1[i].s1}</option>
                                    `;
                            arregloAbogados.push(response1[i].s2+"-" + response1[i].s1);
                        }
                        if (full.status == 'Turnado a VG' || full.status == 'Returnado a VG') {

                            btnEscritook = `
                                       <select class="idAbogados">
                        <option value="99">Selecciona</option>${sel}
                         </select>`;
                        } else {
                            btnEscritook = "";
                        }

                    }

                    return btnEscritook
                }

            }
        ],
        initComplete: function () {

        },
        order: [1, 'desc'],
        bDestroy: true
    });

    // 🔥 EVENTO CORRECTO (DELEGADO)
    $(document).off('change', '.idAbogados').on('change', '.idAbogados', function () {
        if ($(this).val() !== "99") {
            $('#turnarAbo').prop('disabled', false);
        } else {
            $('#turnarAbo').prop('disabled', true);
        }
    });

    // 🔥 EVENTO PARA RETURNAR
    $(document).off('click', '[id^="returnaIDS-"]').on('click', '[id^="returnaIDS-"]', function () {

        let arregloAbogados = [];

        for (var i = 0; i < response1.length; i++) {
            arregloAbogados.push(response1[i].s2 + "-" + response1[i].s1);
        }

        ventana_acpeta_visitaduria(
            "Selecciona el abogado(a) a returnar",
            this.id,
            arregloAbogados
        );
    });

    tableBuscadorFormatos.DataTable().on("draw", function (data) {

        //activarBtnTurnopre();

    })
}



function ModalDetalle()
{
    $("#modalformularioEscritoInicial").modal("show");
}



function RecuperaIds(idexp)
{

    $.ajax({
        type: "POST",
        url: "/Expediente/RegresaIDSFormatos_chris",
        data: { idExp: idexp },
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            for (var i = 0; i < response.lista1.length; i++) {
            $("#DatosPersonales").append(`<button class="tablinks"
                               onclick="btnGenerapdfp(${ response.lista1[i].idComplementoPeticionario},'', '${ response.lista1[i].nombrePeticionario}','', '')"
                id="defaultOpen"> peticionario: ${ response.lista1[i].nombrePeticionario}</button>`);
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
    console.log("Entro al método de crear el formulario de queja");
    var arregloBlanco = [];
    var cuerpoIzquierda = CreaInputs_Con_Labeldisabled('idqueja', 'idqueja', '', 'text', 'ID:', 'textfield', 'mes')
        + CreaBR()
        + CreaSelectLabeldisabled('viainterpos', '', arregloBlanco, '', 'Via de interposición: ', '')
        + CreaBR()
        + Crea_Label_Icono('textfield8', 'textfield8', '', 'Acta Circunstanciada: ', id,1)
        + CreaBR()
        + Crea_Label_Icono('textfield8', 'textfield8', '', 'Escrito Inicial: ', id,2)
        + CreaBR()
        + CreaSelectLabeldisabled('Abogadoqueja', '', arregloBlanco, '', 'Abogado quien Recibe: ', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Hechos: ')
        + CreaBR()
        + CreaTextAreadisabled('hechos', '', 'style="width:100% "')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Autoridad(es): ')
        + CreaBR()
        + "<div id='contenedor_Autoridades'></div>";
    var cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', 'Lugar de los hechos. Municipio y estado: ')
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
        + Crea_Label('textfield8', 'textfield8', '', 'Observaciones DQO: ')
        + CreaBR()
        + CreaTextAreadisabled('observaciones', '', 'style="width:100%; height:20%"')
        + CreaBR()
        + CreaBR();
    var formInnicial = '<form class="text-justify formQueja" id="formQueja" name="formQueja" method="post" style="width:90%; margin-left:5%" >';
    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
    let formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;

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
        url: "/AltaExpediente/RegresaListaCatalogos",
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
            var fechaStr = response.informarcionC.fecha_registro; // "23/12/2025 12:28:52"
            var partes = fechaStr.split(" ")[0].split("/"); // ["23","12","2025"]
            var fechaFormateada = partes[2] + "-" + partes[1] + "-" + partes[0]; // "2025-12-23"
            $("#Fecha_Registro").val(fechaFormateada);
            console.log("Fecha_Registro en input:", $("#Fecha_Registro").val());
            $("#observaciones").val(response.informarcionC.observaciones);
            console.log("Observaciones en textarea:", $("#observaciones").val());
            //$("#Fecha_Registro").val(response.informarcionC.fecha_registro.toJSON().slice(0, 10));
            if (response.informarcionC.informacioncomplementariapeticionario != null) {
                var contadorpeticionarios = response.informarcionC.informacioncomplementariapeticionario.length;
                for (var i = 0; i < contadorpeticionarios; i++) {
                    console.log(contadorpeticionarios);
                    $("#contenedor_Usuarios").html($("#contenedor_Usuarios").html() + DivPequenios(
                        response.informarcionC.informacioncomplementariapeticionario[i].nombre_peticionario.replace(/No Proporcionado/g, ''),
                        response.informarcionC.informacioncomplementariapeticionario[i].curp,
                        response.informarcionC.informacioncomplementariapeticionario[i].id_registro,
                        response.informarcionC.informacioncomplementariapeticionario[i].id_complemento_peticionario
                    ));
                }
            }

            if (response.informarcionC.informacioncomplementariaautoridad != null) {
                var contadorautoridades = response.informarcionC.informacioncomplementariaautoridad.length;
                for (var i = 0; i < contadorautoridades; i++) {
                    console.log(contadorautoridades);
                    $("#contenedor_Autoridades").html($("#contenedor_Autoridades").html() + DivPequeniosautoridad(response.informarcionC.informacioncomplementariaautoridad[i].nombre_autoridad, response.informarcionC.informacioncomplementariaautoridad[i].ambito, response.informarcionC.informacioncomplementariaautoridad[i].id_registro));
                }
            }
            if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar') {
                $('#frm_altaqueja button[type="button"]').hide();
            }

            $("#modaldatoscomplementariosqueja").modal("show");

        }
    });
}
function DivPequenios(nombrepeticionario, curp, idpeticionario) {

    // Escapar comillas simples
    let nombreSafe = nombrepeticionario.replace(/'/g, "\\'");
    let curpSafe = curp.replace(/'/g, "\\'");


    var div = `
<div id='Divpequenios'>
<div class="dummy dummy-text">
<p>
<span class="tooltipbox tooltipbox-effect-1">
<span class="tooltipbox-item">${nombrepeticionario}</span>
<span class="tooltipbox-content clearfix">
<span class="tooltipbox-text">
<span style="color:black;font-weight: bold;">
                                Información del Peticionario
</span><br>
                            ID DEL PETIC.: ${idpeticionario}<br>
                            CURP: ${curp}<br>
                            NOMBRE: ${nombrepeticionario}<br>
</span>
</span>
</span>
 
                <button type="button"
                    onclick="btnGenerapdfp(${idpeticionario}, '${curpSafe}', '${nombreSafe}', '', '')"
                    class="btn btn-link margin-iconbf">
<span class="fa fa-file-pdf-o color-muted fa-1x"></span>
</button>
 
            </p>
</div>
</div>
    `;

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
                url: "/AltaExpediente/ActualizaEstatus",
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
                url: "/AltaExpediente/GuardarQueja",
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
function CreaBR() {
    return "</br>"
}
function Crea_Label(idParrafo, Name, clas, texto) {
    return "<label name='" + Name + "' id='" + idParrafo + "' class='" + clas + "'>" + texto + "</label> ";
}
function Crea_Label_Icono(idParrafo, Name, clas, texto, idexpediente,modo) {
    var complmento = '';
    if (modo == 1) {
        $.ajax({
            type: "POST",
            async: false,
            url: "/Expediente/RegresaIDSFormatos_chris",
            data: { idExp: idexpediente },
            dataType: "JSON",
            success: function (response) {
                for (var i = 0; i < response.lista2.length; i++) {
                    complmento += `<button id="myBtn" type="button" onclick="GeneraActaC_pdf(${response.lista2[i].idActaC})" class="btn btn-link margin-iconbf">
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
                url: "/Expediente/RegresaIDSFormatos_chris",
                data: { idExp: idexpediente },
                dataType: "JSON",
                success: function (response) {
                    for (var i = 0; i < response.lista3.length; i++) {
                        complmento += `<button id="myBtn" type="button" onclick="GeneraEscrito_pdf(${response.lista3[i].idActaC})" class="btn btn-link margin-iconbf">
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

function CreaInputs_Con_Labeldisabled(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " disabled>"
}

function CreaTextAreadisabled(Name, clas, adicion) {
    return "<textarea class='" + clas + "' name='" + Name + "' id='" + Name + "' rows='7' cols='50' " + adicion + " disabled></textarea>";
}
function crea_Boton(tipo, texto, id, clase, click) {
    return " <button onclick=" + click + " id='" + id + "' class='" + clase + "' type='" + tipo + "' value='" + texto + "''>" + texto + "</button>";
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
function editFormatDatosPersonales(idregistro, idcomplemento, estatus) {

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

                $("#idcomplementopet1").val(idcomplemento)
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


                if (response.data[0].codigoPostal != "") {
                    $("#cp_petit-frmDatosPersonales" + idform).val(response.data[0].codigoPostal)

                    let estado = '';
                    let municipio = '';

                    $.getJSON("https://api.copomex.com/query/info_cp/" + response.data[0].codigoPostal + "?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
                        estado = copomex.response.estado;
                        municipio = copomex.response.municipio;
                        $("#municipio_petit-frmDatosPersonales" + idform).val(municipio);
                        $("#estado_petit-frmDatosPersonales" + idform).val(estado);
                        $("#cp_petit-frmDatosPersonales" + idform).val(copomex.response.cp);
                        AgregarOptionSelect(idform, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idform, copomex.response.asentamiento);
                    }).done(function () {

                        $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
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
                if (estatus == 'Eliminado' || estatus == 'Pendiente de turnar') {
                    $('.frmEditDatosPersonales button[type="submit"]').hide();
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

            $.getJSON("https://api.copomex.com/query/info_cp/" + this.value + "?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
                estado = copomex.response.estado;
                municipio = copomex.response.municipio;
                $("#municipio_petit-frmDatosPersonales" + idfrm).val(municipio);
                $("#estado_petit-frmDatosPersonales" + idfrm).val(estado);
                $("#cp_petit-frmDatosPersonales" + idfrm).val(copomex.response.cp);
                AgregarOptionSelect(idfrm, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idfrm, copomex.response.asentamiento);
            }).done(function () {

                $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
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
        url: "GetDataActaCircunstanciada", // Acta Circunstanciada 1
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
        + CreaSelectLabeldisabled('anio', '', arregloAnio(), '', 'de', 'textfield4', 'validaselectdac')
        //+ CreaInputs_Con_Label('nomAbogado', 'nomAbogado', '', 'text', ', , licenciado', 'textfield5', 'placeholder="nombre de abogado"')
        + CreaSelectLabel('nomAbogado', '', arregloBlanco, '', ', el/la suscrito/a, abogado/a', '', 'validaselectdac')
        + CreaInputs_Con_Label('puestoAbogado', 'puestoAbogado', '', 'text', ', en mi carácter de', 'textfield6', 'placeholder="cargo de abogado" value="' + Cargo + '" disabled')
        + CreaInputs_Con_Label('areaAbogado', 'areaAbogado', '', 'text', ', de la', 'textfield7', 'placeholder="área de abogado" value="' + Area + '" disabled')
        + Crea_Label('textfield8', 'textfield8', '', 'de la Comisión de Derechos Humanos del Estado de Puebla, con la fe pública que me confiere el artículo 21 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, así como 30, 37, y 39 de su Reglamento Interno, publicados en el Periódico Oficial del Estado, respectivamente')
        + Crea_LabelCentro('textfield8', 'textfield8', '', '<b>.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.CERTIFICO:.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-</b>')
        + CreaInputs_Con_Label('horaInicio', 'horaInicio', 'validatimeac', 'time', 'Que siendo las', 'textfield9', '')
        + CreaInputs_Con_Label('ubicacion', 'ubicacion', 'validatxtac', 'text', 'horas del día del día en que se actúa, encontrándome en las instalaciones que ocupa', 'textfield10', 'placeholder="lugar de entrevista"')
        + CreaInputs_Con_Label('nombrePet', 'nombrePet', '', 'text', ', donde procedo a entrevistarme con la persona que dijo llamarse ', 'textfield10', 'placeholder="nombre de peticionario"')
        + CreaSelectLabel('consentimiento', '', SeleccionMultiple(), '', 'a quien previa identificación de la persona suscrita, le hago saber que derivado de su queja deberá manifestar su deseo de ratificar la misma, y en su uso de la voz la persona peticionaria <strong>MANIFESTÓ: </strong>', '', 'validaselectdac', '')
        //+ CreaInputs_Con_Label('origenPet', 'origenPet', '', 'text', 'otorga su consentimiento para llevar a cabo la entrevista, por lo que se le exhortó para que se conduzca con verdad ante el personal de la Comisión de Derechos Humanos del Estado de Puebla, comprometiéndose así hacerlo y al respecto <strong>MANIFESTÓ: </strong>Llamarse como ha quedado escrito, ser originario de', 'textfield10', 'placeholder="origen de peticionario"')
        + CreaSelectLabel('origenPet', '', arregloBlanco, '', 'ratifico la presente queja. Acto seguido, indicó llamarse como ha quedado escrito, ser originario/a de ', '', 'validaselectdac')
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
        + CreaSelectLabel('identificacionPet', '', arregloIdentificación(), '', 'quien se identifica con', '', 'validaselectdac')
        + Crea_LabelCentro('textfield11', 'textfield11', '', 'y en relación a los hechos de la queja que nos ocupa, <strong>MANIFESTÓ: </strong><br>')
        + CreaInputs_Con_Label('fechaHechos', 'fechaHechos', 'validadateac', 'date', 'Que es mi deseo ratificar la queja, precisando la fecha de los hechos', 'textfield10', '')
        + CreaInputs_Con_Label('horaHechos', 'horaHechos', 'validatimeac', 'time', 'a las', 'textfield10', '')
        + CreaInputs_Con_Label('ubiHechos', 'ubiHechos', 'validatxtac', 'text', 'encontrándome en', 'textfield10', 'placeholder="lugar de hechos"')
        //+ CreaSelectLabel('catMunicipio_hechos', '', arregloMun(), '', 'ubicado en el municipio de', '', 'validaselectdac')
        /*+ CreaSelectLabel('catEstado_hechos', '', arreglo_Estados(), '', 'del estado de ', '', 'validaselectdac')*/
        //+ CreaSelectLabel('catAutoridad', '', arregloEstado(), '', ', la(s) autoridad(es)', '')
        + CreaInputs_Con_Label('AutoridadesEI', 'AutoridadesEI', '', 'text', 'la(s) autoridad(es)', 'textfield10', 'placeholder="Autoridades" style = "width:100%"')
        + CreaTextArea('hechos', 'validanovacioac', 'style="width:100%"')
        + Crea_LabelCentro('textfield12', 'textfield12', '', 'que es todo lo que tiene que manifestar. DOY FE..-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-<b></b> ')
        + CreaInputs_Con_Label('horaTermino', 'horaTermino', 'validatimeac', 'time', 'Dando por terminada la presente diligencia siendo las ', 'textfield10', '')
        + CreaInputs_Con_Label('', '', 'inputac', 'text', 'horas, del día en que se actúa. Lo anterior se hace constar para los efectos legales a que haya lugar, de conformidad con lo establecido en los numerales 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla DOY FE. .-.-.-.-.-.-.-.-.-.-..-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-', 'textfield10', 'hidden', '')
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
        + Crea_Parrafos('parrafo0', 'parrafo0', 'col-md-3 parrafo', 'ROSA ISELA SANCHEZ SOYA</br>PRESIDENTA DE LA COMISIÓN DE DERECHOS HUMANOS DEL ESTADO DE PUEBLA', 'style ="text-align: left;font-weight: bold;"')
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
        + crea_Boton('button', 'Previsualizar PDF', 'generaPDF', 'btn btn-pinterest', 'GeneraEscrito_pdf(${nuevoId})')  ///
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

function turnoAbogado(idquej,idabogad)
{
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

async function GeneraPdfRechazados(data) {

    const response = await fetch('/Expediente/GenerarFormatoRechazo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const contentType = response.headers.get("content-type");
    if (contentType.includes("application/json")) {
        const json = await response.json();

        if (json.soloAceptados) {
            Swal.fire({
                icon: "success",
                title: "ID´s Aceptados",
                text: "Todos los ID´s Fueron aceptados"
            }).then(() => location.reload());

            return;
        }
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);

    setTimeout(() => location.reload(), 800);
}



function btnGenerapdfp(Idcomplemento, Curpd, Nombrep, Apellidope, Apellidome) {

    let wspFrame = document.getElementById('frame').contentWindow;
    let html = wspFrame.document;
    let fechActual = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
    let fechatxt = fechActual.toString();

    let idcomplemento = Idcomplemento;
    let curpd = Curpd;
    let nombrep = Nombrep;
    let apellidope = Apellidope;
    let apellidome = Apellidome;
    let esCurpValida = curpd && curpd !== "No Proporcionado";


    $.ajax({
        type: "POST",
        url: "GetDataPeticionario",
        data: { curp: esCurpValida ? curpd : null, nombre: nombrep, apellidop: apellidope, apellidom: apellidome, idcomp: idcomplemento, tipoBusqueda: esCurpValida ? "FISICA" : "MORAL" },
        dataType: "JSON",
        success: function (response) {

            if (!response.data || response.data.length === 0) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Datos no encontrados, verifique la curp o el nombre del peticionario',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            const data = response.data[0];
            const frame = document.getElementById('frame');

            if (!frame) {
                console.error("Iframe no encontrado");
                return;
            }

            const cargarDatos = () => {

                const doc = frame.contentWindow.document;
                const setText = (id, value) => {
                    const el = doc.getElementById(id);
                    if (el) el.textContent = value ?? '';
                };

                const setChecks = (name, value) => {
                    doc.querySelectorAll(`input[name="${name}"]`)
                        .forEach(input => input.checked = (String(input.value) === String(value)));
                };
                const ahora = new Date();
                const fechaTxt = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()} ${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, '0')}`;
                setText("dateact", fechaTxt);
                setText("txtNombre", data.nombre);
                setText("txtApaterno", data.apellidoPat);
                setText("txtAmaterno", data.apellidoMat);
                setText("txtEdad", data.edad);
                setText("txtEmail", data.email);
                setText("txtTelefono", data.telefono);
                setText("txtCalle", data.calle);
                setText("numExt", data.numExterior);
                setText("numInt", data.numInterior);
                setText("txtColonia", data.colonia);
                setText("txtCiudadloc", data.ciudad);
                setText("txtMunicipio", data.municipio);
                setText("txtEstado", data.estado);
                setText("txtCp", data.codigoPostal);
                setChecks("chkTipoaq", data.tipoUsuario);
                setChecks("chkSexo", data.fkSexo);
                setChecks("chkGenero", data.genero);
                setChecks("chkEscolaridad", data.fkEscolaridad);
                setChecks("chkEstadocon", data.fkEstadoConyugal);
                setChecks("chkOcupacion", data.fkOcupacion);
                setChecks("chkNacionalidad", data.nacionalidad);
                setChecks("chkSabeleer", data.sabeLeer);
                setChecks("chkDispacacidad", data.fkDiscapacidad);
                setChecks("chkGsocial", data.fkGrupoSocial);
                setChecks("chkHablali", data.hablaLenguai);
                setText("txtOtroGenero", data.otroGenero);
                setText("chkOtraocupacion", data.otraOcupacion);
                setText("txtOtroGsoc", data.otroGsocial);
                setText("txtOtraLengiai", data.lenguaIndigena);
                if (data.fechaNacimiento) {
                    const fechaNac = moment(data.fechaNacimiento).format('DD/MM/YYYY');
                    setText("txtFechaNaci", fechaNac);
                }
                setText("txtOrigenmig", data.origenMigrante || "");
                setText("txtDestinomig", data.destinoMigrante);
                setChecks("chkPrimeravm", data.primeravmexMigrante);
                setChecks("chkViolenmuj", data.violenciaVm);

                if (data.violenciaVm == 1) {
                    setText("txtCanalizacionvm", data.canalizacionVm);
                    setChecks("chkEmbarazada", data.embarazadaVm);
                    setChecks("chkSinhijos", data.fkHijosVivos);
                    setChecks("chkModalidadv", data.fkModalidadViolencia);
                    setChecks("chkTipov", data.fkTipoViolencia);
                    setChecks("chkRelacionAgr", data.fkRelacionAgresor);
                    setText("txtIngresosmens", `$${data.ingresosMensuales}`);
                }
                frame.contentWindow.focus();
                frame.contentWindow.print();
            };
            if (frame.contentDocument.readyState === 'complete') {
                cargarDatos();
            } else {
                frame.onload = cargarDatos;
            }
        }
    });
}


function ventana_acpeta_visitaduria(mensaje, idexpediente, peticionarios) {
    options = [];
    $.map(peticionarios,
        function (o) {
            console.log(o);
            options[o] =o;
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