let valueVInterposicion = "";
let tipoescrito = "";
var body = '<div id="Contenedor_Datos_LE"></div>';
let Escolaridad = "";
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
let contadorSelect = 0;
let peticionariosGuardados = [];
let peticionariosGuardadosok = [];
let SelAutoridad = [];
let filtradonuevo = [];
let filtradoadd = [];
let idqueja = "";
let crearformularios = 0;
let Morales = "";

(function ($) {
    "use strict"

    fetchGet("Expediente/Llenarselects_tevi", "json", (data) => {
        //console.log(data)
        let res = data.tipoescrito;
        let viainterposicion = data.viainterposicion;
        console.log(res)
        console.log(viainterposicion)

        let html = '<select id="select_tipoescritoc" class="form-control form-control-lg"> ';
        for (let i = 0; i < res.length; i++) {
            html += `
                <option value="${res[i].idSelect}">${res[i].descripcion}</option>
            `;
        }
        html += "</select>";
        $("#select_tipoescrito").append(html)


        let htmld = '<select id="select_viainterposicionc" class="form-control form-control-lg"> <option value="">Seleccione una opción</option>';
        for (let v = 0; v < viainterposicion.length; v++) {
            htmld += `
                <option value="${viainterposicion[v].idSelect}">${viainterposicion[v].descripcion}</option>
            `;
        }
        htmld += "</select>";
        $("#select_viainterposicion").append(htmld)

        changeselects();

    })

    CreaSelect("selectTipoQueja", "multiple='multiple'", arregloDocumentos(), "#select_Documentos_LLenar");
    $("#selectTipoQueja").select2();

    fetchGet("Expediente/SelectEscolaridad", "json", (data) => {
        Escolaridad = data.escolaridad;
        escolaridadInicio = Escolaridad.slice(0, 9);
        escolaridadFinal = Escolaridad.slice(10);

    })

    fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => { SelAutoridad = data.lista2; })

    fetchGet("Expediente/SelectEstadoConyugal", "json", (data) => { EstadoConyugal = data.estadoconyugal; })

    fetchGet("Expediente/SelectOcupacion", "json", (data) => { Ocupacion = data.ocupacion; })

    fetchGet("Expediente/SelectDiscapacidad", "json", (data) => { Discapacidad = data.discapacidad; })

    fetchGet("Expediente/SelectGrupoSocial", "json", (data) => { GrupoSocial = data.gruposocial; })

    fetchGet("Expediente/SelectHijosVivos", "json", (data) => { HijosVivos = data.hijosvivos; })

    fetchGet("Expediente/SelectModalidadViolencia", "json", (data) => { ModalidadViolencia = data.modalidadviolencia; })

    fetchGet("Expediente/SelectTipoViolencia", "json", (data) => { TipoViolencia = data.tipoviolencia; })

    fetchGet("Expediente/SelectRelacionAgresor", "json", (data) => { RelacionAgresor = data.relacionagresor; })

    fetchGet("Expediente/SelectMorales", "json", (data) => { Morales = data.tipomorales; })

    $(document).on('change', '#selectTipoQueja', function (event) {

        console.log($("#selectTipoQueja").val());
        var arreTemas = [];
        arreTemas = $("#selectTipoQueja").val();
        var TemasSele = arreTemas.toString();
        console.log(TemasSele);

        if (crearformularios == 0) {

            CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito, arreTemas);
            crearformularios = 1;
        } else {

            console.log("Entró a la creación del formulario de quejas")
            var visibilidadPestaniaRDP = false;
            var visibilidadPestaniaAQ = false;
            var visibilidadPestañaAI = false;
            var visibilidadPestañaAC = false;
            var arreglo1 = [];
            let arregloSelects = arreTemas;

            if (arregloSelects.indexOf("1") >= 0) { visibilidadPestaniaRDP = true } else { visibilidadPestaniaRDP = false }
            if (arregloSelects.indexOf("2") >= 0) { visibilidadPestañaAI = true } else { visibilidadPestañaAI = false }
            if (arregloSelects.indexOf("3") >= 0) { visibilidadPestañaAC = true } else { visibilidadPestañaAC = false }
            if (arregloSelects.indexOf("4") >= 0) { visibilidadPestaniaAQ = true } else { visibilidadPestaniaAQ = false }
            $("#tab4").css('display', 'none');

            if (visibilidadPestaniaRDP) {
                console.log("RDP");
                $("#tab1").css('display', 'block');
            } else {
                $("#tab1").css('display', 'none');
            }

            if (visibilidadPestañaAI) {
                let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
                //$('#Input_autoridades1').select2();
                $("#tab2").css('display', 'block');
                console.log($('#divformularioEscritoInicial'));
            } else {
                $("#tab2").css('display', 'none');
            }
            if (visibilidadPestañaAC) {
                let iformActaCircunstanciada = formActacircunstanciada2c();
                console.log("Se ve AC");
                $("#tab3").css('display', 'block');
            } else {
                $("#tab3").css('display', 'none');
            }

            if (visibilidadPestaniaAQ) {

                console.log("Se ve Aq");
                $("#tab4").css('display', 'block');
            } else {
                $("#tab4").css('display', 'none');
            }





        }

    });
    //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);

    $(document).on('click', "#save", function () { /*Guardado Escrito Inicial 2023*/

        let autoridades = document.querySelectorAll('.arrInput_nombres');
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
        dataEscritoi.append('idenlaceformatquejaei', $('#idenlaceformatquejaei').val());
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
                console.log('entra if')
            } else {
                for (var i = 0; i < autoridades.length - 1; i++) {
                    let idfrmautoridad = autoridades[i].dataset.idinei;
                    arrAutoridades[i] = {
                        NombrePersona: $('#Input_nombres' + idfrmautoridad).val() != "" ? $('#Input_nombres' + idfrmautoridad).val() : 'No proporcionado',
                        CargoPersona: $('#Input_cargo' + idfrmautoridad).val() != "" ? $('#Input_cargo' + idfrmautoridad).val() : 'No proporcionado',
                        IdAutoridad: $('#Input_autoridades' + idfrmautoridad).val() != "" ? $('#Input_autoridades' + idfrmautoridad).val() : 285
                    };
                }
                console.log('entra else')
            }
        }
        dataEscritoi.append('autoridades', JSON.stringify(arrAutoridades));
        dataEscritoi.append('tipoform', 'index');
        dataEscritoi.append('conteditfiles', '0');

        if ($('#Input_ID').val() == '' || $('#Input_Peticionario').val() == '' || $('#Input_FechaHechos').val() == '' || $('#Input_HoraHechos').val() == '' || $('#Input_LugarHechos').val() == '' || $('#CircunstanciasHechos').val() == '') {
            //colorerror("#select2-Input_LugarHechos-container");
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab2");

        } else {

            $.ajax({
                type: "post",
                url: 'GeneraEscritoInicialnuevo',
                contentType: false,
                processData: false,
                data: dataEscritoi,
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.mensaje == 'ok') {

                        $('#id_escritoigenerado').val(data.listat.id);

                        let FrmEnFormatQueja = new FormData();
                        FrmEnFormatQueja.append('id_documento', data.listat.id);
                        FrmEnFormatQueja.append('id_enlace', $('.idquejagenerado').val());
                        FrmEnFormatQueja.append('documento', 'escritoi');

                        traeInformacionDatosComplementarios($('#Input_ID').val());
                        fetchPost("Expediente/ActualizaEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {

                            console.log(resp)
                            if (resp.status) {
                                // window.open(ExportaDocumento, '_blank');
                                $('#fechaHechos1').val($('#Input_FechaHechos').val())
                                $('#horaHechos1').val($('#Input_HoraHechos').val())
                                $('#catMunicipio_hechos1').val($('#Input_LugarHechos').val())
                                $('#catMunicipio_hechos1').val($('#Input_LugarHechos').val()).trigger('change.select2');
                                $('#catEstado_hechos1').val(21)
                                $('#catEstado_hechos1').val(21).trigger('change.select2');
                                $('#hechos1').val($('#CircunstanciasHechos').val())

                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Información guardada Correctamente: ',
                                    showConfirmButton: false,
                                    timer: 2500
                                });
                                frmcompleto("#tab2");
                                //$("#save").attr("disabled",true);
                            }



                        });
                        

                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Error al Insertar los datos',
                            showConfirmButton: false,
                            timer: 2500
                        })
                    }
                }
            });
        }

    });

    $(document).on('click', "#generaPDF", function () { //esta función se ejecutará en todos los casos

        let idei = document.getElementById('id_escritoigenerado').value.trim();
        if (idei == '') {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para generar el pdf debe guardar primero la información ingresada',
                showConfirmButton: false,
                timer: 2500
            });
            return;
        }
        window.open(ExportaDocumento + idei, '_blank');

    });

    $(document).on('click', ".generaPDFActaC", function () { //esta función se ejecutará en todos los casos

        let nfrm = this.dataset.idfrmac;
        let idac = document.getElementById('id_actacgenerado' + nfrm).value.trim();

        if (idac == '') {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para generar el pdf debe guardar primero la información ingresada',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        window.open(ExportaDocumentoacta + idac, '_blank');


    });

    $(document).on('keypress', "#cpLH", function (e) { //esta función se ejecutará en todos los casos
        if (e.which == 13) {
            $.getJSON("https://api.copomex.com/query/info_cp/" + $("#cpLH").val() + "?type=simplified&token=pruebas", function (copomex) {
                console.log(copomex.response);
                $("#cpLH").val(copomex.response.cp);
                CargaDatosSelect('#coloniaLH', copomex.response.asentamiento);
            })

                .fail(function () { console.log('Ha ocurrido un error') });
        }

    });

    $(document).on('change', '#CheckDcompleta', function (event) {/*Evento del check, datos complementarios de la calle*/
        var contenedor = '';
        $('#Contenedor_Datos_LE').empty();
        if ($('#CheckDcompleta').prop('checked')) {
            contenedor = complementoFormLugarHchos(true);
            console.log("Entró al check");
            $("#sino").val("si");
        } else {
            contenedor = complementoFormLugarHchos(false);
            $("#sino").val("no");
        }
        $('#Contenedor_Datos_LE').append(contenedor);

        return body;
    });

    $(document).on('click', '#icono_agregar', function (event) {/*Evento del check, datos complementarios de la calle*/
        var contenedor = '';
        let arrNumPet = [];
        let npmax = 1;
        let autoridades = document.querySelectorAll('.arrInput_nombres');

        for (var i = 0; i < autoridades.length; i++) {
            arrNumPet.push(parseInt(autoridades[i].dataset.idinei))
        }

        npmax = Math.max.apply(null, arrNumPet);

        let nfin = npmax + 1;

        if ($('#Input_nombres' + npmax).val() != '' || $('#Input_cargo' + npmax).val() != '' || $('#Input_autoridades' + npmax).val() != '') {
            contenedor = Agrega_PersonaAutoridad(nfin);

            $('#Contenedor_Cargos_Personas').append(contenedor);
            fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
                let autoridad = data.lista2;
                CargaDatosSelecAutori("#Input_autoridades" + nfin, autoridad);
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para agregar otra autoridad debe llenar al menos un campo del anterior',
                showConfirmButton: false,
                timer: 2000
            });
        }



        return body;
    });

    $(document).ready(function () {


        $("body").on("click", ".nav-item", function (event) {

            var target = $(this).find('a').attr("href");
            console.log("Tab mostrado: " + target);
            // Aquí puedes ejecutar las acciones que necesites

            if (target == "#alta_escrito") {
                validaVacios("#frmFromatoQueja", "input", "", target);
                validaVacios("#frmFromatoQueja", "select", "", target);
                validaVacios("#frmFromatoQueja", "textarea", "", target);
            } else {

                validaVacios(".form_acta", "input", "", target);
                //validaVacios(".form_acta", "select", "99", target);
            }
        });

        //$("body").on("click", "#tab2", function (event) {
        //    validaVacios("#frmFromatoQueja", "input", "", "#tab2");
        //    validaVacios("#frmFromatoQueja", "select", "", "#tab2");
        //    validaVacios("#frmFromatoQueja", "textarea", "", "#tab2");
        //});

        //$("input").focus(function () {
        //    $(this).css({ "background": "trasnparent" });
        //});
      
    });





})(jQuery);
function ejecutatab2() {

    //$("#tab2").click();
    validaVacios(".form_acta", "input", "", "#tab3");
    validaVacios(".form_acta", "select", "99", "#tab3");
}

function ejecutatab3() {
    //$("#tab3").click();
    validaVacios("#frmFromatoQueja", "input", "", "#tab2");
    validaVacios("#frmFromatoQueja", "select", "", "#tab2");
    validaVacios("#frmFromatoQueja", "textarea", "", "#tab2");
}



function validaVacios( formpapa,tipoelemento ,elementoavalidar,elementoclick)
{

    //$(formpapa).find('span').remove();
    ////contador = 0;
    //var inputs = document.querySelectorAll(formpapa + ' > ' + tipoelemento);
    ////console.log(inputs);
    //var alerta = false;

    //for (var i = 0; i < inputs.length; i++) {
    //    if (inputs[i].value.trim() === elementoavalidar) {

    //        if (inputs[i].offsetParent !== null) {

    //            $('#miDiv').find('span').remove();
    //            inputs[i].style.cssText = "border:1px solid #f09e94; color: black;";// Colocar el foco en el input vacío
    //            const nuevoParrafo = document.createElement("span");
    //            nuevoParrafo.textContent = "*"; nuevoParrafo.style.color = "red";
    //            inputs[i].parentNode.insertBefore(nuevoParrafo, inputs[i]);
    //        } else {
    //            console.log("hidden");
    //        }
    //    }
    //}
    ////contador++
}
function funcionesActac(nfrm) {
    $(document).on('click', "#saveActaC", function (e) { //esta función se ejecutará en todos los casos
        console.log('hola funcionesActac')
        e.preventDefault();
        e.stopImmediatePropagation();

        let nfrm = this.dataset.idfrmac;
        //habilitarAlta(nfrm);
        console.log('frm actac: ' + nfrm)

        var vari = $("#id_lugar" + nfrm).val()
        var vari1 = $("#diaFecha" + nfrm).val()
        var vari2 = $("#id_mes" + nfrm).val()
        var vari3 = $("#id_anio" + nfrm).val()
        var vari4 = $("#horaInicio" + nfrm).val()
        var vari5 = $("#ubicacion" + nfrm).val()
        var vari6 = $("#idpeticionarioelegido" + nfrm).val()
        var vari7 = $("#idconsentimiento" + nfrm).val()
        var vari8 = $("#origenPet" + nfrm).val()
        var vari9 = $("#edadPet" + nfrm).val()
        var vari10 = $("#sabeleerPet" + nfrm).val()
        var vari11 = $("#escolaridad" + nfrm).val()
        var vari12 = $("#callePet" + nfrm).val()
        var vari13 = $("#numextPet" + nfrm).val()
        var vari14 = $("#cpPet" + nfrm).val()
        var vari15 = $("#coloniaPet" + nfrm).val()
        var vari16 = $("#municipioPet" + nfrm).val()
        var vari17 = $("#estadoPet" + nfrm).val()
        var vari18 = $("#ocupacionPet" + nfrm).val()
        var vari19 = $("#telPet" + nfrm).val()
        var vari20 = $("#correoPet" + nfrm).val()
        var vari21 = $("#idcredencial" + nfrm).val()
        var vari22 = $("#horaHechos" + nfrm).val()
        var vari23 = $("#fechaHechos" + nfrm).val()
        var vari24 = $("#ubiHechos" + nfrm).val()
        var vari25 = $("#hechos" + nfrm).val()
        var vari26 = $("#horaTermino" + nfrm).val()
        $('#id_anio' + nfrm).val($("#anio" + nfrm + " option:selected").val());



        if ($("#id_lugar" + nfrm).val() == '' || $("#diaFecha" + nfrm).val() == '' || $("#id_mes" + nfrm).val() == '' || $("#id_anio" + nfrm).val() == '' || $("#horaInicio" + nfrm).val() == ''
            || $("#ubicacion" + nfrm).val() == '' || $("#idpeticionarioelegido" + nfrm).val() == '' || $("#idconsentimiento" + nfrm).val() == ''
            /*|| $("#origenPetval" + nfrm).val() == ''*/ || $("#edadPet" + nfrm).val() == '' || $("#sabeleerPet" + nfrm).val() == '' /*|| $("#escolaridad" + nfrm).val() == '' */|| $("#callePet" + nfrm).val() == ''
            || $("#numextPet" + nfrm).val() == '' || $("#cpPet" + nfrm).val() == '' || $("#coloniaPet" + nfrm).val() == '' || $("#municipioPet" + nfrm).val() == '' || $("#estadoPet" + nfrm).val() == ''
            || $("#ocupacionPet" + nfrm).val() == '' || $("#telPet" + nfrm).val() == '' || $("#correoPet" + nfrm).val() == '' || $("#idcredencial" + nfrm).val() == '' || $("#horaHechos" + nfrm).val() == ''
            || $("#fechaHechos" + nfrm).val() == '' || $("#ubiHechos" + nfrm).val() == '' || $("#hechos" + nfrm).val() == '' || $("#horaTermino" + nfrm).val() == '') {
            //colorerror("#select2-Input_LugarHechos-container");
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab3");

        } else {
            $("#CircunstanciasHechos").val(vari25);

            $.ajax({
                type: "post",
                url: 'GeneraActaCircunstanciadaNuevo',
                content: "application/json; charset=utf-8",
                data: $('#formActa' + nfrm).serialize(),
                dataType: "json",
                success: function (data) {
                    console.log(data)

                    if (data.mensaje == 'ok') {

                        let idenlaceformatos = $('#idenlaceformatquejac' + nfrm).val();
                        console.log(idenlaceformatos)

                        if (idenlaceformatos == '') {
                            console.log('se inserto enlace')
                            $('#id_actacgenerado' + nfrm).val(data.listat.id);
                            let idescritook = $('#id_escritoigenerado').val() != '' ? $('#id_escritoigenerado').val() : 1;

                            let FrmEnFormatQueja = new FormData();
                            FrmEnFormatQueja.append('id_queja', $('.idquejagenerado').val());
                            FrmEnFormatQueja.append('id_escrito', idescritook);
                            FrmEnFormatQueja.append('id_actac', data.listat.id);
                            FrmEnFormatQueja.append('id_peticionario', data.listat.idPet);
                            FrmEnFormatQueja.append('id_complementopet', data.listat.complementoPeticionario);

                            fetchPost("Expediente/InsertEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {
                                if (resp.status) {
                                    $('#idenlaceformatquejac' + nfrm).val(resp.idinsertado);
                                    

                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Información guardada Correctamente',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                               
                            });

                        } else {
                            console.log('se actualizo enlace')
                            $('#id_actacgenerado' + nfrm).val(data.listat.id);
                            let FrmEnFormatQueja = new FormData();
                            FrmEnFormatQueja.append('id_documento', data.listat.id);
                            FrmEnFormatQueja.append('id_enlace', $('#idenlaceformatquejac' + nfrm).val());
                            FrmEnFormatQueja.append('documento', 'actac');
                            FrmEnFormatQueja.append('num_frm', nfrm);

                            fetchPost("Expediente/ActualizaEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {
                                if (resp.status) {
                                    $('#idenlaceformatquejac' + nfrm).val(resp.respidenlacequeja);
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Información guardada Correctamente',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }

                            });

                        }

                        frmcompleto("#tab3");
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Error al Insertar los datos',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    /*Metodos para jalar el ID de la queja al formulario del complemento*/
                    idqueja = $('#Input_ID').val();//Asiganción del id de la queja cuando se esta dando de alta
                    console.log("Id_Queja:" + idqueja);
                    traeInformacionDatosComplementarios(idqueja);
                    /*Metodos para jalar el ID de la queja al formulario del complemento*/
                }
            });
        }
    });

    //$(document).on('click', "#generaPDFActaC" + nfrm, function () { //esta función se ejecutará en todos los casos

    //    window.open(ExportaDocumentoacta, '_blank');

    //});

    $(document).on('change', '.nomAbogado', function (event) {
        let nfrm = this.dataset.idfrmac;
        console.log($("#nomAbogado" + nfrm + " option:selected").val());
        $('#idabogado' + nfrm).val($("#nomAbogado" + nfrm + " option:selected").val());
        //$('#idpet').val('1165');
        //$('#idEscrito_').val('2');
    });

    $(document).on('change', '.consentimiento', function (event) {
        let nfrm = this.dataset.idfrmac;
        console.log($("#consentimiento" + nfrm + " option:selected").val());
        $('#idconsentimiento' + nfrm).val($("#consentimiento" + nfrm + " option:selected").val());
    });

    $(document).on('change', '.identificacionPet', function (event) {
        let nfrm = this.dataset.idfrmac;
        console.log($("#identificacionPet" + nfrm + " option:selected").val());
        $('#idcredencial' + nfrm).val($("#identificacionPet" + nfrm + " option:selected").val());
    });

    $(document).on('change', '.mes', function (event) {
        let nfrm = this.dataset.idfrmac;
        console.log(this)
        console.log($("#mes" + nfrm + " option:selected").val());
        $('#id_mes' + nfrm).val($("#mes" + nfrm + " option:selected").val());
    });

    $(document).on('change', '.anio', function (event) {
        let nfrm = this.dataset.idfrmac;
        console.log($("#anio" + nfrm + " option:selected").val());
        $('#id_anio' + nfrm).val($("#anio" + nfrm + " option:selected").val());
    });

    $(document).on('change', '.lugar', function (event) {
        let nfrm = this.dataset.idfrmac;
        console.log(this)
        console.log($("#lugar" + nfrm + " option:selected").val());
        $('#id_lugar' + nfrm).val($("#lugar" + nfrm + " option:selected").val());
    });

    $(document).on('change', '.origenPet', function (event) {/*Adicion del Origen del peticionario cuando es extranjero en el catalogo es 246*/

        let nfrm = this.dataset.idfrmac;

        var seleccion = $("#origenPet" + nfrm + " option:selected").val();
        $('#origenPetval').val($("#origenPet" + nfrm + " option:selected").val());

        if (seleccion == '218') {
            $("#origenPetExt" + nfrm).css("display", "block");
            $("#origenPetExtedo" + nfrm).css("display", "block");

            fetchGet("Expediente/SelectPaises", "json", (data) => {
                let Paises = data.relacionpaises;
                //AgregarOptionSelectPais(1, '', '#origenPetExt', Paises);
                CargaDatosSelectOtroPaises('#origenPetExt' + nfrm, Paises)
            });

        } else {
            console.log("Entro al else ");
            $("#origenPetExt" + nfrm).select2().next().hide();
            $("#origenPetExtedo" + nfrm).css("display", "none");
            $("#origenPetvalExt" + nfrm).val("");
            $("#origenPetExtedo" + nfrm).val("");

        }

    });

    $(document).on('change', '.origenPetExt', function (event) {/*Adicion del Origen del peticionario cuando es extranjero en el catalogo es 246*/
        let nfrm = this.dataset.idfrmac;

        console.log($("#origenPetExt" + nfrm + " option:selected").val());/*Desde el origen Vine Vacio*/
        var seleccion = $("#origenPetExt" + nfrm + " option:selected").val();
        $('#origenPetvalExt' + nfrm).val($("#origenPetExt" + nfrm + " option:selected").val());

    });

    // Pasar select peticionario


    let htmlselect = '<select id="nombrePet' + nfrm + '" name="nombrePet' + nfrm + '" style="width: 22%;" class="col-lg-2 selectpetactac delselect"></select>';
    $('.listapetactacc' + nfrm).append(htmlselect)
    //document.querySelector('.listapetactac').insertAdjacentHTML("afterbegin", htmlselect);


    let select = document.getElementById('nombrePet' + nfrm);
    let select2 = document.getElementById('nombrePet');

    if (select2 != null) {
        select.options.length = select2.options.length;

        for (a = 0; a < select2.options.length; a++) {
            select.options[a].value = select2.options[a].value;
            select.options[a].text = select2.options[a].text;
            select.options[a].className = 'delselectp';
        }
    }

}
function CreaSelect(id, tiposelect, arreglo, nombreDiv, clas = '', atributos = '') {
    let htmld = '<select id="' + id + '" "' + atributos + '" class="form-control form-control-lg ' + clas + '" ' + tiposelect + '> <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(nombreDiv).append(htmld)
    $("#" + id).select2();

}
function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '', atributos = '') {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select data-idfrmac="' + atributos + '" class="' + clas + '" name="' + id + '" id="' + id + '" ' + tiposelect + '> <option value="99">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabelinverso(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '', atributos = '') {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select data-idfrmac="' + atributos + '" class="' + clas + '" name="' + id + '" id="' + id + '" ' + tiposelect + '> <option value="99">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].idSelect}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '', atributos = '') {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select class="' + clas + '" data-idfrmac="' + atributos + '" name="' + id + '" id="' + id + '" ' + tiposelect + '> <option value="99">Seleccione una opción</option>';
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
function CreaSelectLabelSelect2(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, estiloLabel, estiloselect, clas = '', atributos = '') {
    let htmld = '<label for= "' + namelabel + '" ' + estiloLabel + ' >' + textoLabel + '</label ><select "' + atributos + '" class="' + clas + '" id="' + id + '" ' + tiposelect + ' ' + estiloselect + '> <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld;
     $("#" + id).select2();
}
function changeselects() {
    $('#select_viainterposicionc').on('change', function () {
        valueVInterposicion = this.value;
        //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);
        var valor = this.value;
        console.log(valor);

        switch (valor) {

            case "1":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 3, 4]);
                crearformularios = 1;
                $("#tab1").show();
                $("#tab2").show();
                $("#tab3").show();
                $("#tab4").show();
                //alert("Pilin");
                $("#selectTipoQueja").val([1, 2, 3, 4]).trigger('change.select2');

                validaVacios("#frmFromatoQueja", "input", "", "");
                validaVacios("#frmFromatoQueja", "select", "", "");
                validaVacios("#frmFromatoQueja", "textarea", "", "");
                break;
            case "2":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 3, 4]);
                crearformularios = 1;
                $("#tab1").show();
                $("#tab2").show();
                $("#tab3").show();
                $("#tab4").show();
                $("#selectTipoQueja").val([1, 2, 3, 4]).trigger('change.select2');
                break;
            case "3":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 3, 4]);
                crearformularios = 1;
                $("#tab1").show();
                $("#tab2").show();
                $("#tab3").show();
                $("#tab4").show();
                $("#selectTipoQueja").val([1, 2, 3, 4]).trigger('change.select2');
                break;
            case "4":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 3, 4]);
                crearformularios = 1;
                $("#tab1").show();
                $("#tab2").show();
                $("#tab4").show();
                $("#selectTipoQueja").val([1, 2, 3, 4]).trigger('change.select2');
                break;
            case "5":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 4]);
                crearformularios = 1;
                $("#tab1").show();
                $("#tab2").show();
                $("#tab4").show();
                $("#selectTipoQueja").val([1, 2, 4]).trigger('change.select2');
                break;
            case "6":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 4]);
                $("#selectTipoQueja").val([1, 2, 4]).trigger('change.select2');
                crearformularios = 1;
                Swal.fire({
                    title: 'Tipo de Peticionario(a)',
                    html: `
                                <label for="options">Selecciona una opción:</label>
                                <select id="options" class="swal2-input">
                                <option value="opcion1">Moral</option>
                                <option value="opcion2">Física</option>
                                </select>
                             `,
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    preConfirm: () => {
                        const selectedOption = document.getElementById('options').value;
                        return selectedOption;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {

                        if (result.value == 'opcion2') {
                            $("#tab1").show();
                            $("#tab2").show();
                            $("#tab4").show();
                        }
                        else {
                            var $input = $('#nombre_petit-frmDatosPersonales1');

                            // Creamos el nuevo select con las mismas clases y atributos que el input
                            var $select = $('<select></select>')
                                .addClass('form-control eliminaformaes ob max-20 eliminaformaes')
                                .attr({
                                    'data-idfrmit': '',
                                    'name': $input.attr('name'),
                                    'id': $input.attr('id'),
                                    'required': true
                                });

                            // Llenamos el select con las opciones del arreglo
                            $.each(Morales, function (index, item) {
                                $select.append($('<option></option>').val(item.idSelect).text(item.descripcion));
                            });

                            // Reemplazamos el input con el select
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

                            $("#tab1").show();
                            $("#tab2").show();
                            $("#tab4").show();
                        }
                    }
                });
                break;
            case "7":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 4]);
                crearformularios = 1;
                Swal.fire({
                    title: 'Tipo de Peticionario(a)',
                    html: `
                                <label for="options">Selecciona una opción:</label>
                                <select id="options" class="swal2-input">
                                <option value="opcion1">Moral</option>
                                <option value="opcion2">Física</option>
                                </select>
                             `,
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    preConfirm: () => {
                        const selectedOption = document.getElementById('options').value;
                        return selectedOption;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {

                        if (result.value == 'opcion2') {
                            $("#tab1").show();
                            $("#tab2").show();
                            $("#tab4").show();
                        }
                        else {
                            /*let options = {};
                            $.map(Morales, function (o) {
                                options[o.idSelect] = o.descripcion;
                            });

                            Swal.fire({
                                title: "Selecciona el Peticionario Moral",
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
                                            resolve('Debes seleccionar un elemento');
                                        }
                                    });
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    
                                    $("#tab2").show();
                                    $("#tab4").show();
                                }
                            });*/

                            //$('select').prop('disabled', true);
                            //$('input[type="radio"]').prop('disabled', true);

                            var $input = $('#nombre_petit-frmDatosPersonales1');

                            // Creamos el nuevo select con las mismas clases y atributos que el input
                            var $select = $('<select></select>')
                                .addClass('form-control eliminaformaes ob max-20 eliminaformaes')
                                .attr({
                                    'data-idfrmit': '',
                                    'name': $input.attr('name'),
                                    'id': $input.attr('id'),
                                    'required': true
                                });

                            // Llenamos el select con las opciones del arreglo
                            $.each(Morales, function (index, item) {
                                $select.append($('<option></option>').val(item.idSelect).text(item.descripcion));
                            });

                            // Reemplazamos el input con el select
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

                            $("#tab1").show();
                            $("#tab2").show();
                            $("#tab4").show();
                        }
                    }
                });
                break;
            case "8":
                CrearFormularioCrearEscrito(valueVInterposicion, 1, [1, 2, 4]);
                crearformularios = 1;
                $("#tab1").show();
                $("#tab2").show();
                $("#tab4").show();
                break;


            default:
                break;
        }


    });

    $('#select_tipoescritoc').on('change', function () {
        tipoescrito = this.value;
        // CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);
    });

    //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);


}
function CrearFormularioCrearEscrito(vinterpoiscion, tescrito, arregloSelects) {

    console.log("Entró a la creación del formulario de quejas")
    var visibilidadPestaniaRDP = false;
    var visibilidadPestaniaAQ = false;
    var visibilidadPestañaAI = false;
    var visibilidadPestañaAC = false;
    var arreglo1 = [];
    arreglo1 = arregloSelects;
    if (arregloSelects.indexOf("1") >= 0) { visibilidadPestaniaRDP = true } else { visibilidadPestaniaRDP = false }
    if (arregloSelects.indexOf("2") >= 0) { visibilidadPestañaAI = true } else { visibilidadPestañaAI = false }
    if (arregloSelects.indexOf("3") >= 0) { visibilidadPestañaAC = true } else { visibilidadPestañaAC = false }


    console.log('vi: ' + vinterpoiscion + ' te: ' + tescrito)
    let eliminarform = document.querySelectorAll('.eliminaformaes');
    for (var i = 0; i < eliminarform.length; i++) {
        eliminarform[i].remove();
    }

    let formPetit = formPeticionario(1);
    //let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
    //let iformActaCircunstanciada = formActacircunstanciada2c();

    if (vinterpoiscion != '' && tescrito != '') {

        //Queja
        if (tescrito == 1) {
            $('#formularioaltaescritodqot').append(formularioqueja);

            $("#tab4").css('display', 'none');
            $("#tab1").css('display', 'none');
            $("#tab2").css('display', 'none');
            $("#tab3").css('display', 'none');


            $('#ref-frm-frmDatosPersonales1').append(formPetit);
            $('#divformularioEscritoInicial').append(formEscritoInicial2('#', 'frmFromatoQueja'));
            //$('#Input_autoridades1').select2();
            $('#divformularioActaCircunstanciada').append(formActacircunstanciada2c(1));
            CargaDatosSelecAutori("#catAutoridad1", SelAutoridad);
            $(`#anio${1}`).val(2024);
            if (visibilidadPestaniaRDP) {
                console.log("RDP");
                $("#tab1").css('display', 'block');
            } else {
                $("#tab1").css('display', 'none');
            }

            if (visibilidadPestañaAI) {
                //let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
                $("#tab2").css('display', 'block');
                console.log($('#divformularioEscritoInicial'));
            } else {
                $("#tab2").css('display', 'none');
            }

            if (visibilidadPestañaAC) {
                // let iformActaCircunstanciada = formActacircunstanciada2c();
                console.log("Se ve AC");
                $("#tab3").css('display', 'block');
            } else {
                $("#tab3").css('display', 'none');
            }


            addPeticionarios();
            guardarDatosPeticionarios();
            chkNoproporcinado();
            seltxt();
            keypresscp();
            buscapeticionariocurpnom();
            /* Funciones escritoi */
            funcionesEscritoi();
            /* Actac */
            addActacir();
            funcionesActac(1);
            Carga_Informacion_selec_quejas(1);
            /* Fin Actac */
            fetchGet("Expediente/SelectPaises", "json", (data) => {
                let Paises = data.relacionpaises;
                console.log(Paises)
                AgregarOptionSelectPais(1, 'dellistpaiseso', '#migorig_petit-frmDatosPersonales1', Paises);
                AgregarOptionSelectPais(1, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales1', Paises);
            })

            Crear_Formulario_Queja();
            var idqueja = 0;
            /*Metodos para jalar el ID de la queja al formulario del complemento*/
            idqueja = $('#Input_ID').val();//Asiganción del id de la queja cuando se esta dando de alta
            console.log("Id_Queja:" + idqueja);
            traeInformacionDatosComplementarios(idqueja);
            /*Metodos para jalar el ID de la queja al formulario del complemento*/
        } else if (tescrito == 2) {
            // Orientación
            $('#formularioaltaescritodqot').append(formulariorientacion);
        } else if (tescrito == 3) {
            //Canalización
            $('#formularioaltaescritodqot').append(formulariocanalizacion);
        }

    }

    $('#Input_autoridades').select2();
    $('#Input_autoridades1').select2();
    $(".origenPetExt").css("display", "none");
    $(".origenPetExtedo").css("display", "none");


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
                        console.log(response.data)

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
function addPeticionarios() {
    $('#addPeticionariodp').click(function (e) {
        e.preventDefault();

        let elemntsNp = document.querySelectorAll('.linksfrmpetit');
        let arrNumPet = [];
        let npmax = 1;

        for (var i = 0; i < elemntsNp.length; i++) {
            arrNumPet.push(parseInt(elemntsNp[i].dataset.numpetit))
        }
        console.log(arrNumPet)

        npmax = Math.max.apply(null, arrNumPet);
        let nfin = npmax + 1;

        if ($('#idcomplementopet' + npmax).val() != '' && $('#idpeticionarioi' + npmax).val() != '') {
            NuevoNavHrzPeticionario(nfin);
            guardarDatosPeticionarios();
            chkNoproporcinado();
            seltxt();
            keypresscp();
            buscapeticionariocurpnom();
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para agregar otro peticionario debe guardar los anteriores',
                showConfirmButton: false,
                timer: 2000
            });
        }


    });
}
function addActacir() {

    $('#addActac').click(function (e) {
        e.preventDefault();

        let elemntsNp = document.querySelectorAll('.linksfrmActaci');
        console.log(elemntsNp)
        let arrNumPet = [];
        let npmax = 1;

        for (var i = 0; i < elemntsNp.length; i++) {
            arrNumPet.push(parseInt(elemntsNp[i].dataset.numactac))
        }
        console.log(arrNumPet)

        npmax = Math.max.apply(null, arrNumPet);
        let nfin = npmax + 1;
        console.log(nfin)

        NuevoNavHrzActac(nfin);
        funcionesActac(nfin);
        $('#idquejaactac' + nfin).val($('.idquejagenerado').val());
        Carga_Informacion_selec_quejas(nfin);
        changeSelectPetActac();

    });

}
function btnGenerapdfp(element) {

    let idform = element.dataset.idform;
    let wspFrame = document.getElementById('frame').contentWindow;
    let html = wspFrame.document.all;

    let idcomplemento = $("#idcomplementopet" + idform).val()
    let curpd = $("#CURP_petit-frmDatosPersonales" + idform).val()
    let nombrep = $("#nombre_petit-frmDatosPersonales" + idform).val()
    let apellidope = $("#apellidop_petit-frmDatosPersonales" + idform).val()
    let apellidome = $("#apellidom_petit-frmDatosPersonales" + idform).val()

    if (idcomplemento == '') {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Aún no guarda los datos del peticionario',
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
                console.log(response.data[0]);

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
                if (response.data[0].apellidoMat.toUpperCase() === 'NO PROPORCIONADO') { html.txtAmaterno.style.fontStyle = 'italic';}
                if (response.data[0].calle.toUpperCase() === 'NO PROPORCIONADO') { html.txtCalle.style.fontStyle = 'italic'; }
                if (response.data[0].numExterior.toUpperCase() === 'NO PROPORCIONADO') { html.numExt.style.fontStyle = 'italic'; }
                if (response.data[0].numInterior.toUpperCase() === 'NO PROPORCIONADO') { html.numInt.style.fontStyle = 'italic';}
                if (response.data[0].colonia.toUpperCase() === 'NO PROPORCIONADO') { html.txtColonia.style.fontStyle = 'italic'; }
                if (response.data[0].ciudad.toUpperCase() === 'NO PROPORCIONADO') { html.txtCiudadloc.style.fontStyle = 'italic'; }
                if (response.data[0].municipio.toUpperCase() === 'NO PROPORCIONADO') { html.txtMunicipio.style.fontStyle = 'italic'; }
                if (response.data[0].estado.toUpperCase() === 'NO PROPORCIONADO') { html.txtEstado.style.fontStyle = 'italic'; }
                if (response.data[0].codigoPostal.toUpperCase() === 'NO PROPORCIONADO') { html.txtCp.style.fontStyle = 'italic';}
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
                if(response.data[0].fechaNacimiento.includes('1900-01-01')) {
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
function NuevoNavHrzPeticionario(numconsecutivo) {

    let elementNav = `<a href="#ref-frm-frmDatosPersonales${numconsecutivo}" data-toggle="pill" data-numpetit="${numconsecutivo}" class="nav-link show eliminaformaes linksfrmpetit frmDatosPersonales${numconsecutivo}">Peticionario ${numconsecutivo}
                        <button class="btnDelPetit eliminaformaes delPeticionariodp" data-idfrmdel="${numconsecutivo}" id="delPeticionariodp-frmDatosPersonales${numconsecutivo}">
                            <i b-oo5lp8m93w="" class="fas fa-user-minus eliminaformaes"></i> 
                        </button>
                     </a>`;

    $('.divanclasprticinariso').append(elementNav);

    let formPetitn = formPeticionario(numconsecutivo);

    let elementBody = `<div id="ref-frm-frmDatosPersonales${numconsecutivo}" class="form-validation tab-pane fade divformularioDatosPersonales eliminaformaes frmDatosPersonales${numconsecutivo}">
                        ${formPetitn}
                        </div>`;

    $('.tabfrmPeticionarios').append(elementBody);

    fetchGet("Expediente/SelectPaises", "json", (data) => {
        let Paises = data.relacionpaises;
        console.log(Paises)
        AgregarOptionSelectPais(numconsecutivo, 'dellistpaiseso', '#migorig_petit-frmDatosPersonales' + numconsecutivo, Paises);
        AgregarOptionSelectPais(numconsecutivo, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales' + numconsecutivo, Paises);
    })
    deleteFormulario();
}
function NuevoNavHrzActac(numconsecutivo) {

    let elementNav = `<a href="#ref-frm-frmActacir${numconsecutivo}" data-toggle="pill" data-numactac="${numconsecutivo}" class="nav-link show eliminaformaes linksfrmActaci frmActac${numconsecutivo}">Acta circunstanciada ${numconsecutivo}
                        <button class="btnDelActac eliminaformaes delActacadd" data-idfrmdel="${numconsecutivo}" id="delActac-frmActac${numconsecutivo}">
                            <i b-oo5lp8m93w="" class="fas fa-minus-circle eliminaformaes"></i> 
                        </button>
                     </a>`;

    $('.divanclassactac').append(elementNav);

    let formNavActac = formActacircunstanciada2c(numconsecutivo);

    let elementBody = `<div id="ref-frm-frmActacir${numconsecutivo}" class="form-validation tab-pane fade divformularioActacir eliminaformaes frmActac${numconsecutivo}">
                        ${formNavActac}
                        </div>`;
    $('.tabfrmActacircu').append(elementBody);
    CargaDatosSelecAutori(`#catAutoridad${numconsecutivo}`, SelAutoridad);
    $(`#anio${numconsecutivo}`).val(2024);
    deleteFormularioActac();
}
function deleteFormularioActac() {
    $('.btnDelActac').click(function (e) {
        e.preventDefault();
        let arrid = this.id.split('-');
        let idfrmdel = this.dataset.idfrmdel;

        swal.fire({
            title: 'Eliminar Acta Circunstanciada',
            text: "¿Desea eliminar esta acta circunstanciada?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(function (resp) {
            if (resp.isConfirmed) {
                let elementDel = document.querySelectorAll('.' + arrid[1]);

                for (var i = 0; i < elementDel.length; i++) {
                    elementDel[i].remove();
                }

            }
        })

    });
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
function formPeticionario(idformulario) {

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
                        type: "hidden",
                        classControl: "eliminaformaes"
                    },
                    {
                        valhidden: "",
                        name: "idcomplementopet" + idformulario,
                        type: "hidden",
                        classControl: "eliminaformaes idscomplepeticionarios"
                    },
                    {
                        valhidden: "",
                        name: "idpeticionarioi" + idformulario,
                        type: "hidden",
                        classControl: "eliminaformaes"
                    },
                    {
                        valhidden: "",
                        name: "idquejagenerado",
                        type: "hidden",
                        classControl: "eliminaformaes"
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
                        classControl: "ob max-20 eliminaformaes validaTxt",
                        noproporcionado: true,
                        required: 'required oninput="validarTxtKeyPress(this)"',
                        namenoprop: "nombre_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Apellido Paterno",
                        name: "apellidop_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes validaTxt",
                        noproporcionado: true,
                        required: 'required oninput="validarTxtKeyPress(this)"',
                        namenoprop: "apellidop_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Apellido Materno",
                        name: "apellidom_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes validaTxt",
                        noproporcionado: true,
                        required: 'required oninput="validarTxtKeyPress(this)"',
                        namenoprop: "apellidom_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-4",
                        label: "Código Postal",
                        name: "cp_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes buscacp validaNumero",
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
                        classControl: "ob max-300 eliminaformaes validaTxt",
                        noproporcionado: true,
                        required: 'required oninput="validarTxtKeyPress(this)"',
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
                        required: 'required oninput="validarTxtKeyPress(this)"',
                        classControl: "ob max-300 eliminaformaes validaTxt",
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
                        classControl: "ob max-300 eliminaformaes validaNumero",
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
                        classControl: "ob max-300 eliminaformaes validaNumero",
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
                        classControl: "ob max-300 eliminaformaes validaNumero",
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
                        classControl: "ob max-300 eliminaformaes validaNumero",
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
                        classradio: "tipousuario",
                        required: 'required',
                        checked: [
                        ],
                        name: "qatu_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob eliminaformaes max-300 eliminaformaes"
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
                        classControl: "ob max-300 eliminaformaes",
                        classradio: "eliminaformaes"
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
function guardarDatosPeticionarios() {

    $('.formularioPeticionario').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Se validan los campos para que tengan un formato correcto, de lo contrario no los deja guardar
        // No se puede registrar un nombre con numeros o una edad con letas etc etc
        if (validaTxt() || validaNumero()) {
            return;
        }

        let numFrm = this.dataset.numform;
        let idForm = '#frmDatosPersonales' + numFrm;
        // Se guardan los datos del peticionario en la tabla Reg_Recepcion si no estan registrados(si ya existen, se actualiza)
        // De igual forma se crea una version de su complemento de peticionario

        if (/*$('#fenac_petit-frmDatosPersonales' + numFrm).val() == '' ||*/ $('#genero_petit-frmDatosPersonales' + numFrm).val() == '' || $('#escosel_petit-frmDatosPersonales' + numFrm).val() == ''
            || $('#ocupacion_petit-frmDatosPersonales' + numFrm).val() == '' || $('#gsoci_petit-frmDatosPersonales' + numFrm).val() == '' || $('#leindi_petit-frmDatosPersonales' + numFrm).val() == '') {

            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab1");
        }
        else {
            if ($('input[name="radsinoviomu_petit-frmDatosPersonales' + numFrm + '"]:checked').val() === 'Si') {
                if ($('#vmcanadep_petit-frmDatosPersonales' + numFrm).val() === '' || $('#vmingrmen_petit-frmDatosPersonales' + numFrm).val() === ''
                /*|| $('#vmhijos_petit-frmDatosPersonales' + numFrm).val() == ''*/ /*|| $('#vmmodvio_petit-frmDatosPersonales' + numFrm).val() == ''*/ /*|| $('#vmtvio_petit-frmDatosPersonales' + numFrm).val() == ''*/) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Para guardar debe llenar todos los datos necesarios',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    frmincompleto("#tab1");
                } else {
                    guardaDataComplPeticionario(idForm, numFrm);
                }
            } else {
                guardaDataComplPeticionario(idForm, numFrm);
            }

        }
    });


}

function guardaDataComplPeticionario(idForm, numFrm) {
    $("#frmDatosPersonales1 input[type='text']").prop('disabled', false);
    $("#frmDatosPersonales1 input[type='radio']").prop('disabled', false);
    $("#frmDatosPersonales1 input[type='date']").prop('disabled', false);
    $("#frmDatosPersonales1 select").prop('disabled', false);

    let nombre = $('#nombre_petit-frmDatosPersonales1 option:selected').text();

    $.ajax({
        type: "post",
        url: 'GuardarDataComplPeticionario',
        content: "application/json; charset=utf-8",
        data: $(idForm).serialize() + '&nombreS=' + nombre,
        dataType: "json",
        success: function (data) {

            console.log(data)
            let selectsPet = document.querySelectorAll('.selectpetactac').length;
            $("#frmDatosPersonales1 input[type='radio']").prop("disabled", true);
            $("#frmDatosPersonales1 select").prop('disabled', true);
            $("#frmDatosPersonales1 input[type='date']").prop('disabled', true);
            $("#nombre_petit-frmDatosPersonales1").prop("disabled", false);
            // Si se guardo de forma correcta te regresa el id de peticionario generado de la tabla Reg_recepcion
            // De igual forma te regresa el id de complemento generado
            if (data.idpeticionario > 0 && data.idcomplemento > 0) {

                $('#idcomplementopet' + numFrm).val(data.idcomplemento);
                $('#idpeticionarioi' + numFrm).val(data.idpeticionario);

                console.log('Input_Peticionario');

                let arrids_competicionarios = [];
                // Se crea arreglo de peticinarios registrados para un select, ya que se usara uno para los siguientes formatos
                peticionariosGuardados.push({
                    idpeticionario: data.idpeticionario,
                    idcomplementopet: data.idcomplemento,
                    nombrepeti: data.nombrepet.replace(/No Proporcionado/g, '') //Se quita de lista las palabras 'No Proporcionado'
                });

                // Se valida que el arreglo de peticionarios para los select no se repitan usuarios 
                let petnoduplicados = peticionariosGuardados.reduce(function (prev, curr) {
                    if (prev.ids.indexOf(curr.idcomplementopet) === -1) {
                        prev.array.push(curr);
                        prev.ids.push(curr.idcomplementopet);
                    } else {
                        let inidicedel = prev.array.findIndex(x => x.idcomplementopet === curr.idcomplementopet);
                        prev.array.splice(inidicedel, 1);
                        prev.array.push(curr);
                    }
                    return prev;
                }, { array: [], ids: [] });
                console.log(petnoduplicados)
                peticionariosGuardados = petnoduplicados.array;
                filtradonuevo = petnoduplicados.array;

                const ids = peticionariosGuardados.map(({ idcomplementopet }) => idcomplementopet);
                let ids_unicos = Array.from(new Set(ids));
                peticionariosGuardadosok = peticionariosGuardados.filter(({ idcomplementopet }, index) => !ids_unicos.includes(idcomplementopet, index + 1));
                // Si el peticionario agregado es Agraviado procede a obtener un id de queja, si es quejoso aun no se le da id de queja
                if (data.tipousuario == 'Agraviado' || data.tipousuario == 'Peticionario') {
                    // Se valida que el input hidden que guarda el id de queja ste vacio
                    if ($('.idquejagenerado').val() == '') {

                        let FrmEnlacefq = new FormData();
                        FrmEnlacefq.append('num_frmpetit', numFrm);
                        FrmEnlacefq.append('id_complemento', $('#idcomplementopet' + numFrm).val());
                        FrmEnlacefq.append('id_peticionario', $('#idpeticionarioi' + numFrm).val());
                        FrmEnlacefq.append('id_via_interposicion', $('#select_viainterposicionc').val());
                        FrmEnlacefq.append('id_Abogado_Queja', $('#idusuario').val());
                        // Se genera id de queja
                        fetchPost("Expediente/GeneraIdQueja", "json", FrmEnlacefq, (resp) => {
                            idqueja = resp.idqueja;

                            if (resp.status) {
                                // Se pasa id de Enlace_Formats_Queja
                                $('#idenlaceformatquejac1').val(resp.idenlacequeja);
                                $('#idenlaceformatquejaei').val(resp.idenlacequeja);
                                // Se pasan valores a los otros formatos
                                $('.idquejagenerado').val(idqueja);
                                // Escrito Inicial
                                $('#Input_ID').val(idqueja);
                                $('#Input_ID').prop('readonly', true);
                                // Pasar ide de queja a Acta circunstanciada
                                $('#idquejaactac1').val(idqueja);
                                // Si ya esta creado el id de queja se actualiza en la DB campo ID_EXPEDIENTE del complemento peticionario
                                let FrmIdQueja = new FormData();
                                let idscomplementos_petit = document.querySelectorAll(".idscomplepeticionarios");

                                for (var cp = 0; cp < idscomplementos_petit.length; cp++) {
                                    arrids_competicionarios.push(idscomplementos_petit[cp].value);
                                }

                                FrmIdQueja.append('id_queja', idqueja);
                                FrmIdQueja.append('ids_complementos', arrids_competicionarios);

                                fetchPost("Expediente/UpdateComPetExpQujoso", "json", FrmIdQueja, (resp) => {
                                    console.log(resp)
                                    let update = resp.data;


                                });

                                // Si se genero el id de queja se crea select de los peticionarios dados de alta
                                // para que puedan ser seleccionados en los otros formatos
                                if (filtradonuevo.length > 0) {
                                    console.log('entra al primero 2')
                                    console.log(filtradonuevo)
                                    $('.listapet').append(selectPetACircunstanciada(idqueja, filtradonuevo, 'escritoi', 'Input_Peticionario'));
                                } $('.listapetactac').append(selectPetACircunstanciada(idqueja, filtradonuevo, 'actac', 'nombrePet'));

                                changeSelectPetActac();
                            } else {
                                console.log('entra al segundo')
                                $('.listapet').append(selectPetACircunstanciada(idqueja, peticionariosGuardadosok, 'escritoi', 'Input_Peticionario'));
                                $('.listapetactac').append(selectPetACircunstanciada(idqueja, peticionariosGuardadosok, 'actac', 'nombrePet'));
                                changeSelectPetActac();
                            }

                            seleccionarSelectacp();

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Información guardada Correctamente, Id Queja: ' + idqueja,
                                showConfirmButton: false,
                                timer: 1500
                            });

                            frmcompleto("#tab1");
                        });

                    } else {

                        let idquejahidden = $('.idquejagenerado').val()
                        // Al dar de alta un quejoso se valida si ya se genero id de queja
                        if (idquejahidden != '') {
                            // Si ya esta creado el id de queja se actualiza en la DB campo ID_EXPEDIENTE del complemento peticionario
                            let FrmIdQueja = new FormData();
                            let idscomplementos_petit = document.querySelectorAll(".idscomplepeticionarios");
                            for (var cp = 0; cp < idscomplementos_petit.length; cp++) {
                                arrids_competicionarios.push(idscomplementos_petit[cp].value);
                            }

                            FrmIdQueja.append('id_queja', idquejahidden);
                            FrmIdQueja.append('ids_complementos', arrids_competicionarios);

                            fetchPost("Expediente/UpdateComPetExpQujoso", "json", FrmIdQueja, (resp) => {
                                let update = resp.data;

                                if (resp.status) {
                                    console.log(update)
                                }

                            });
                        }

                        if (filtradonuevo.length > 0) {
                            console.log(filtradonuevo)

                            let updatedArray = filtradonuevo.map(p =>
                                p.idcomplementopet != data.idcomplemento && p.idpeticionario === data.idpeticionario
                                    ? { idpeticionario: data.idpeticionario, idcomplementopet: data.idcomplemento, nombrepeti: data.nombrepet }
                                    : p
                            );

                            console.log('entra al primero 1')
                            console.log(updatedArray)
                            $('.listapet').append(selectPetACircunstanciada(idqueja, updatedArray, 'escritoi', 'Input_Peticionario'));
                            $('.listapetactac').append(selectPetACircunstanciada(idqueja, updatedArray, 'actac', 'nombrePet'));
                            changeSelectPetActac();

                        } else {

                            let updatedArrayd = peticionariosGuardadosok.map(p =>
                                p.idcomplementopet === data.idcomplemento
                                    ? { idpeticionario: data.idpeticionario, idcomplementopet: data.idcomplemento, nombrepeti: data.nombrepet }
                                    : p
                            );

                            console.log('entra al segundo')
                            $('.listapet').append(selectPetACircunstanciada(idqueja, updatedArrayd, 'escritoi', 'Input_Peticionario'));
                            $('.listapetactac').append(selectPetACircunstanciada(idqueja, updatedArrayd, 'actac', 'nombrePet'));
                            changeSelectPetActac();
                        }

                        seleccionarSelectacp();

                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Información guardada Correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                } else {
                    let idquejahidden = $('.idquejagenerado').val()

                    // Al dar de alta un quejoso se valida si ya se genero id de queja
                    if (idquejahidden != '') {
                        // Si ya esta creado el id de queja se actualiza en la DB campo ID_EXPEDIENTE del complemento peticionario
                        let FrmIdQueja = new FormData();
                        let idscomplementos_petit = document.querySelectorAll(".idscomplepeticionarios");
                        for (var cp = 0; cp < idscomplementos_petit.length; cp++) {
                            arrids_competicionarios.push(idscomplementos_petit[cp].value);
                        }

                        FrmIdQueja.append('id_queja', idquejahidden);
                        FrmIdQueja.append('ids_complementos', arrids_competicionarios);

                        fetchPost("Expediente/UpdateComPetExpQujoso", "json", FrmIdQueja, (resp) => {
                            let update = resp.data;

                            if (resp.status) {
                                console.log(update)
                            }

                        });
                    }

                    // Se crea select de los peticionarios dados de alta
                    // para que puedan ser seleccionados en los otros formatos
                    if (filtradonuevo.length > 0) {
                        console.log('entra al tercero')
                        $('.listapet').append(selectPetACircunstanciada($('.idquejagenerado').val(), filtradonuevo, 'escritoi', 'Input_Peticionario'));
                        $('.listapetactac').append(selectPetACircunstanciada($('.idquejagenerado').val(), filtradonuevo, 'actac', 'nombrePet'));
                        changeSelectPetActac();
                    } else {
                        console.log('entra al cuarto')
                        $('.listapet').append(selectPetACircunstanciada($('.idquejagenerado').val(), peticionariosGuardadosok, 'escritoi', 'Input_Peticionario'));
                        $('.listapetactac').append(selectPetACircunstanciada($('.idquejagenerado').val(), peticionariosGuardadosok, 'actac', 'nombrePet'));
                        changeSelectPetActac();
                    }

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Información guardada Correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }


            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error al Insertar los datos, reporte el error del sistema',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        }

    });
}
function Agrega_PersonaAutoridad(nfin) {
    var arregloBlanco = [];

    var cuerpo = CreaInputs_Con_Label('Input_nombres' + nfin, 'Input_nombres' + nfin, 'arrInput_nombres', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres' + nfin, 'placeholder="Nombres y apellidos"  data-idinei="' + nfin + '" style ="float:left;"', ' style ="float:left;"')
        + CreaInputs_Con_Label('Input_cargo' + nfin, 'Input_cargo' + nfin, '', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" style ="float:left;" data-idinei="' + nfin + '"', ' style ="float:left;"')
        + CreaSelectLabelSelect2('Input_autoridades' + nfin, "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' style ="float:left;"', 'data-idinei="' + nfin + '" style ="float:left;max-width: 180px !important;"', '')
        + CreaBR()
        + CreaBR();
    return cuerpo;

}
function selectPetACircunstanciada(idqueja, arrPeticionarios, frm, idelement) {

    //  document.querySelectorAll('.delselect').forEach(p => p.remove() );

    let html = "";
    let hash = {};
    arrPeticionarios = arrPeticionarios.filter(o => hash[o.idpeticionario] ? false : hash[o.idpeticionario] = true);

    if (idqueja != '') {
        // <option value="idqueja/idregrecepcion/idcomplementopeticionario"> Ever </option>
        console.log(idqueja)
        console.log(frm)
        console.log(idelement)
        if (frm == 'escritoi') {
            document.querySelectorAll('.delselectei').forEach(p => p.remove());
            html = `<label for="textfield" class="delselectei" style="margin-left: 65%;">Peticionario/Agraviado:&nbsp;</label><select id="${idelement}" name="${idelement}" style="margin-left: auto;" class="col-lg-2 delselectei"> <option class="delselectei" value="">Seleccione una opción</option>`;
            for (var i = 0; i < arrPeticionarios.length; i++) {
                html += `<option class="delselectei" value="${arrPeticionarios[i].idpeticionario + '/' + arrPeticionarios[i].idcomplementopet}">${arrPeticionarios[i].nombrepeti}</option>`;
            }
        } else if (frm == 'actac') {
            document.querySelectorAll('.delselect').forEach(p => p.remove());

            html = `<select id="${idelement}" name="${idelement}" style="width: 22%;" class="col-lg-2 selectpetactac delselect"> <option class="delselect" value="">Seleccione una opción</option>`;
            for (var i = 0; i < arrPeticionarios.length; i++) {

                html += `<option class="delselect" value="${idqueja + '/' + arrPeticionarios[i].idpeticionario + '/' + arrPeticionarios[i].idcomplementopet}">${arrPeticionarios[i].nombrepeti}</option>`;

            }
        }

        html += `</select>`;
    }
    return html;
}
function changeSelectPetActac() {

    $('.selectpetactac').on('change', function () {

        let idformularioac = this.parentNode.dataset.Idfrmac;

        if (this.value != '') {

            let valor = (this.value).split('/');
            console.log(valor)

            let FrmDataPet = new FormData();
            FrmDataPet.append('id_queja', valor[0]);
            FrmDataPet.append('id_peticionario', valor[1]);
            FrmDataPet.append('id_complemento', valor[2]);

            fetchPost("Expediente/DatosPeticionarioActac", "json", FrmDataPet, (resp) => {

                if (resp.status) {
                    let p = resp.data[0];
                    console.log(p)
                    $('#edadPet' + idformularioac).val(p.edad.toLowerCase());
                    $('#sabeleerPet' + idformularioac).val(p.sabeLeer.toLowerCase());
                    $('#escolaridadPet' + idformularioac).val(p.nombreEscolaridad.toLowerCase());
                    $('#callePet' + idformularioac).val(p.calle.toLowerCase());
                    $('#numextPet' + idformularioac).val(p.numExterior.toLowerCase());
                    $('#numintPet' + idformularioac).val(p.numInterior.toLowerCase());
                    $('#cpPet' + idformularioac).val(p.codigoPostal.toLowerCase());
                    $('#coloniaPet' + idformularioac).val(p.colonia.toLowerCase());
                    $('#municipioPet' + idformularioac).val(p.municipio.toLowerCase());
                    $('#estadoPet' + idformularioac).val(p.estado.toLowerCase());
                    $('#ocupacionPet' + idformularioac).val(p.nombreOcupacion.toLowerCase());
                    $('#telPet' + idformularioac).val(p.telefono.toLowerCase());
                    $('#correoPet' + idformularioac).val(p.email.toLowerCase());
                    $('#idpeticionarioelegido' + idformularioac).val(p.fkRegRecepcion)
                    $('#id_petselac' + idformularioac).val(valor)

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

    });

}
function seleccionarSelectacp() {
    let actasc = document.querySelectorAll('.form_acta');
    console.log(actasc)

    for (var i = 0; i < actasc.length; i++) {

        let nfrm = actasc[i].dataset.nformac;
        let selectsepet = $('#id_petselac' + nfrm).val();
        let array = selectsepet != '' ? selectsepet.split(',') : [];

        if (nfrm == 1) {
            if (selectsepet != '') {
                $('#nombrePet').val(array[0] + '/' + array[1] + '/' + array[2]);
            }
        } else {
            if (selectsepet != '') {
                $('#nombrePet' + nfrm).val(array[0] + '/' + array[1] + '/' + array[2]);
            }
        }

    }
}
function formEscritoInicial2(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + Crea_Parrafos('parrafo0', 'parrafo0', 'col-md-3 parrafo', 'DR. JOSÉ FELIX CEREZO VÉLEZ</br>PRESIDENTE DE LA COMISIÓN DE DERECHOS HUMANOS DEL ESTADO DE PUEBLA', 'style ="text-align: left;font-weight: bold;"')
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en los artículos 2, 4, 5, 13 fracciones I, II, III, IV y V, 25, 28 y demás relativos y aplicables de la Ley de la Comisión de Derechos Humanos del Estado, ante personal de este organismo y por mi propio derecho, acudo a denunciar actos u omisiones que a mi juicio constituyen violación a mis derechos humanos, en los términos que a continuación se expresan:', 'style ="text-align: left"')
        + '</div>'
        + CreaInputs_Con_Label('Input_FechaHechos', 'Input_FechaHechos', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA EN QUE OCURRIERON LOS HECHOS:&nbsp;', 'textfield', 'placeholder="fecha hechos" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraHechos', 'Input_HoraHechos', '', 'time', '', 'textfield', 'placeholder="hora hechos" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        //+ CreaInputs_Con_Label('Input_LugarHechos', 'Input_LugarHechos', '', 'text', 'Lugar en donde Ocurrieron los Hechos: ', 'Input_LugarHechos', 'placeholder="Lugar de los Hechos" style ="float:left;"', ' style ="float:left;"')
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR EN QUE SE SUSCITARON LOS HECHOS:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + CreaInputs_Con_Label('CheckDcompleta', 'CheckDcompleta', '', 'checkbox', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;¿SABE LA DIRECCIÓN COMPLETA?&nbsp;&nbsp;', 'CheckDcompleta', '', '') 
        + '<div id="Contenedor_Datos_LE"></div>'
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'CIRCUNSTANCIAS BAJO LAS CUALES OCURRIERON LOS HECHOS:&nbsp;') + Requeridos()
        + CreaTextArea('CircunstanciasHechos', 'col-md-12 parrafo')
        + CreaInput()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'AUTORIDAD(ES) INVOLUCRADA(S):&nbsp;&nbsp;&nbsp;')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_nombres1', 'Input_nombres1', 'arrInput_nombres', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres1', 'placeholder="Nombres y apellidos" data-idinei="1" style ="float:left;"', ' style ="float:left;"')
        + CreaInputs_Con_Label('Input_cargo1', 'Input_cargo1', 'arrInput_cargo', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" data-idinei="1" style ="float:left;"', ' style ="float:left;"')
        + CreaSelectLabelSelect2('Input_autoridades1', "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' data-idinei="1" style="float:left;"', ' style ="width:180px!important; float:left;max-width:180px!important;"', 'arrInput_autoridades')
        + '&nbsp;&nbsp;<img src="/img/Agregar_PNG.png" id="icono_agregar" style="width:32px;height:32px;">'
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
        + crea_Botonei('button', 'Previsualizar PDF', 'generaPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'save', 'btn btn-success')
        + '</div>'
        + CreaInputs('sino', 'sino', '', 'hidden')
        + CreaInputs('autoridadesselect', 'autoridadesselect', '', 'hidden')
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('coloniainputs', 'coloniainputs', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
function complementoFormLugarHchos(estado) {
    var cuerpo = '';
    if (estado) {
        console.log("Pintando Cuerpo");
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
function formActacircunstanciada2c(idfrm) {

    var idUser = $("#idusuario").val();
    var Area = $("#areaUser").val();
    var Cargo = $("#cargoUser").val();
    let numfrm = idfrm;

    console.log("ID_USER:" + idUser);
    console.log("AREA_USER:" + Area);
    console.log("CARGO_USER:" + Cargo);
    var f = new Date();
    var arregloBlanco = [];

    var formInnicial = `<h1>FE DE HECHOS</h1><form class="text-justify form_acta" data-nformac=${numfrm} id="formActa${numfrm}" name="formActa${numfrm}" method="post" style="width:90%; margin-left:5%" >`;
    var cuerpo =
        CreaSelectLabel('lugar' + numfrm, '', arregloBlanco, '', 'En', '', 'lugar', idfrm) + Requeridos()
        + CreaInputs_Con_Label('diaFecha' + numfrm, 'diaFecha' + numfrm, 'inputac', 'number', ', a los', 'textfield', '', idfrm) + Requeridos()
        + CreaSelectLabel('mes' + numfrm, '', arregloMeses(), '', 'días del mes de', 'textfield4', 'mes', idfrm) + Requeridos()
        + CreaSelectLabeldisabled('anio' + numfrm, '', arregloAnio(), '', 'de', '', 'anio', idfrm)
        + CreaSelectLabel('nomAbogado' + numfrm, '', arregloBlanco, '', ', el suscrito, licenciado', '', 'nomAbogado', idfrm)
        + CreaInputs_Con_Label('puestoAbogado' + numfrm, 'puestoAbogado' + numfrm, 'inputac', 'text', ', en mi carácter de', 'textfield6', 'placeholder="cargo de abogado" value="' + Cargo + '" disabled', idfrm)
        + CreaInputs_Con_Label('areaAbogado' + numfrm, 'areaAbogado' + numfrm, 'inputac', 'text', ', de la', 'textfield7', 'placeholder="área de abogado" value="' + Area + '" disabled', idfrm)
        + Crea_Label('textfield8', 'textfield8', '', 'de la Comisión de Derechos Humanos del Estado de Puebla, con la fe pública que me confiere el artículo 21 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, así como 30, 37, y 39 de su Reglamento Interno, publicados en el Periódico Oficial del Estado, respectivamente')
        + Crea_LabelCentro('textfield8', 'textfield8', '', '<b>CERTIFICO:</b>')
        + CreaInputs_Con_Label('horaInicio' + numfrm, 'horaInicio' + numfrm, 'inputac', 'time', 'Que siendo las', 'textfield9', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('ubicacion' + numfrm, 'ubicacion' + numfrm, 'inputac', 'text', 'horas del día en que se actúa, me constituí en', 'textfield10', 'placeholder="lugar de entrevista"', idfrm) + Requeridos()
        + Crea_Label('textfield8', 'textfield8', '', ', donde atendí a quien dijo llamarse ') + Requeridos()
        + '<div style="margin-top: -28px; display: flex; justify-content: flex-end;" data--idfrmac="' + numfrm + '" class="listapetactac listapetactacc' + numfrm + ' d-flex"></div>'
        + CreaSelectLabel('consentimiento' + numfrm, '', SeleccionMultiple(), '', 'ante quien una vez que me identifiqué plenamente como servidor público adscrito a este Organismo Autónomo, con la respectiva identificación que esta Comisión de Derechos Humanos del Estado de Puebla me expidió, se le hizo de su conocimiento el motivo de la diligencia, se le solicitó su autorización para ser entrevistado, expresando que', '', 'consentimiento', idfrm) + Requeridos()
        + CreaSelectLabel('origenPet' + numfrm, '', arregloBlanco, '', 'otorga su consentimiento para llevar a cabo la entrevista, por lo que se le exhortó para que se conduzca con verdad ante el personal de la Comisión de Derechos Humanos del Estado de Puebla, comprometiéndose así hacerlo y al respecto <strong>MANIFESTÓ: </strong>Llamarse como ha quedado escrito, ser originario de', '', 'origenPet', idfrm) + Requeridos()
        + CreaSelectLabel('origenPetExt' + numfrm, '', arregloBlanco, '', '', '', 'origenPetExt', idfrm)
        + CreaInputs_Con_Label('origenPetExtedo' + numfrm, 'origenPetExtedo' + numfrm, 'inputac', 'text', '', 'textfield', '', idfrm)
        + CreaInputs_Con_Label('edadPet' + numfrm, 'edadPet' + numfrm, 'datapet inputac', 'number', 'de', 'textfield10', 'placeholder="edad de peticionario"', idfrm)
        + CreaInputs_Con_Label('sabeleerPet' + numfrm, 'sabeleerPet' + numfrm, 'datapet inputac', 'text', 'años de edad, que', '', 'placeholder="sabe leer"', idfrm)
        + CreaInputs_Con_Label('escolaridadPet' + numfrm, 'escolaridadPet' + numfrm, 'datapet inputac', 'text', ', sabe leer y escribir por haber cursado hasta ', 'textfield10', 'placeholder="escolaridad"', idfrm)
        + CreaInputs_Con_Label('callePet' + numfrm, 'callePet' + numfrm, 'datapet inputac', 'text', ', con el domicilio ubicado en ', 'textfield10', 'placeholder="calle"', idfrm)
        + CreaInputs_Con_Label('numextPet' + numfrm, 'numextPet' + numfrm, 'datapet inputac', 'text', '', '', 'placeholder="número exterior"', idfrm)
        + CreaInputs_Con_Label('numintPet' + numfrm, 'numintPet' + numfrm, 'datapet inputac', 'text', '', '', 'placeholder="número interior"', idfrm)
        + CreaInputs_Con_Label('cpPet' + numfrm, 'cpPet' + numfrm, 'datapet inputac', 'text', '', '', 'placeholder="código postal"', idfrm)
        + CreaInputs_Con_Label('coloniaPet' + numfrm, 'coloniaPet' + numfrm, 'datapet inputac', 'text', '', '', 'placeholder="colonia"', idfrm)
        + CreaInputs_Con_Label('municipioPet' + numfrm, 'municipioPet' + numfrm, 'datapet inputac', 'text', '', '', 'placeholder="municipio"', idfrm)
        + CreaInputs_Con_Label('estadoPet' + numfrm, 'estadoPet' + numfrm, 'datapet inputac', 'text', '', '', 'placeholder="estado"', idfrm)
        + CreaInputs_Con_Label('ocupacionPet' + numfrm, 'ocupacionPet' + numfrm, 'datapet inputac', 'text', 'de ocupación', 'textfield10', 'placeholder="ocupación de peticionario"', idfrm)
        + CreaInputs_Con_Label('telPet' + numfrm, 'telPet' + numfrm, 'datapet inputac', 'text', 'con número de teléfono', 'textfield10', 'placeholder="telefono de peticionario"', idfrm)
        + CreaInputs_Con_Label('correoPet' + numfrm, 'correoPet' + numfrm, 'datapet inputac', 'text', ', correo electrónico,', 'textfield10', 'placeholder="correo de peticionario"', idfrm)
        + CreaSelectLabel('identificacionPet' + numfrm, '', arregloIdentificación(), '', 'identificándose ante el suscrito con', '', 'identificacionPet', idfrm) + Requeridos()
        + Crea_LabelCentro('textfield11', 'textfield11', '', 'y en relación a los hechos de la queja que nos ocupa, <strong>DECLARO:</strong><br>')
        + CreaInputs_Con_Label('fechaHechos' + numfrm, 'fechaHechos' + numfrm, 'inputac', 'date', 'Que el día', 'textfield10', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('horaHechos' + numfrm, 'horaHechos' + numfrm, 'inputac', 'time', 'a las', 'textfield10', '', idfrm) + Requeridos() 
        + CreaInputs_Con_Label('ubiHechos' + numfrm, 'ubiHechos' + numfrm, 'inputac', 'text', 'estando en', 'textfield10', 'placeholder="lugar de hechos"', idfrm) + Requeridos()
        + CreaSelectLabel('catMunicipio_hechos' + numfrm, '', {}, '', 'ubicado en el municipio de', '', 'catMunicipio_hechos', idfrm) + Requeridos()
        + CreaSelectLabel('catEstado_hechos' + numfrm, '', arreglo_Estados(), '', 'del estado de ', '', 'catEstado_hechos', idfrm) + Requeridos()
        + CreaSelectLabel('catAutoridad' + numfrm, '', [], '', ', la(s) autoridad(es)', '', 'catAutoridad', idfrm) + Requeridos()
        + CreaTextArea('hechos' + numfrm, '', 'style="width:100%"', idfrm) + Requeridos()
        + CreaInputs_Con_Label('horaTermino' + numfrm, 'horaTermino' + numfrm, 'inputac', 'time', ', dando por terminada la presente actuación a  las', 'textfield10', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('', '', 'inputac', 'text', 'horas.', 'textfield10', 'hidden', idfrm)
        + Crea_LabelCentro('textfield12', 'textfield12', '', 'Hago constar lo anterior de conformidad con lo establecido en los numerales 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla para los efectos correspondientes----------------------------------<b>DOY FE.</b> ')
        + crea_Boton('button', 'Previsualizar PDF', 'generaPDFActaC', 'btn btn-pinterest nfrm generaPDFActaC', idfrm)
        + crea_Boton('button', 'Guardar', 'saveActaC', 'btn btn-success saveActaC', idfrm)
        + CreaInputs('idabogado' + idfrm, 'idabogado' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idpet' + idfrm, 'idpet' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idconsentimiento' + idfrm, 'idconsentimiento' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idcredencial' + idfrm, 'idcredencial' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idEscrito_' + idfrm, 'idEscrito_' + idfrm, 'idEscrito_', 'hidden', idfrm)
        + CreaInputs('id_lugar' + idfrm, 'id_lugar' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('id_mes' + idfrm, 'id_mes' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('id_anio' + idfrm, 'id_anio' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('origenPetval' + idfrm, 'origenPetval' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('origenPetvalExt' + idfrm, 'origenPetvalExt' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idquejaactac' + idfrm, 'idquejaactac' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idpeticionarioelegido' + idfrm, 'idpeticionarioelegido' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('id_actacgenerado' + idfrm, 'id_actacgenerado' + idfrm, '', 'hidden', idfrm)
        + CreaInputs('idenlaceformatquejac' + idfrm, 'idenlaceformatquejac' + idfrm, 'idenlaceformatquejac', 'hidden', idfrm)
        + CreaInputs('numeroformulario', 'numeroformulario', '', 'hidden', idfrm, idfrm)
        + CreaInputs('id_petselac' + idfrm, 'id_petselac' + idfrm, '', 'hidden', idfrm)

    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpo + fin_form;

    return formualarioCompleto;
}
function crea_Botonei(tipo, texto, id, clase, atributos = '') {
    return " <button id='" + id + "' class='" + clase + "' type='" + tipo + "' data-idfrmac='" + atributos + "' value='" + texto + "''>" + texto + "</button>";
}
function crea_Boton(tipo, texto, id, clase, atributos = '') {
    return " <button id='" + id + "' class='" + clase + "' type='" + tipo + "' data-idfrmac='" + atributos + "' value='" + texto + "''>" + texto + "</button>";
}
function crea_BotonAltaComplemento(tipo, texto, id, clase, atributos = '') {
    return " <button id='" + id + "' class='" + clase + ' ' + "' type='" + tipo + "' data-idfrmac='" + atributos + "' value='" + texto + "''>" + texto + "</button>";
}
function Crea_Parrafos(idParrafo, Name, clas, texto, atributos = '') {
    return "<p name='" + Name + "' id='" + idParrafo + "' '" + atributos + "' class='" + clas + "'>" + texto + "</p > ";
}
function Crea_Label(idParrafo, Name, clas, texto, atributos = '') {
    return "<label name='" + Name + "' id='" + idParrafo + "' '" + atributos + "' class='" + clas + "'>" + texto + "</label> ";
}
function Crea_LabelCentro(idParrafo, Name, clas, texto, atributos = '') {
    return "<center><label name='" + Name + "' id='" + idParrafo + "' '" + atributos + "' class='" + clas + "'>" + texto + "</label></center></br>";
}
function CreaInputs(idParrafo, Name, clas, tipo, atributos = '', val = '') {
    return "<input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' data-idfrmac='" + atributos + "' name='" + Name + "' value='" + val + "' > </br> "
}
function CreaInputs_Con_Label(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel, atributos = '') {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' data-idfrmac='" + atributos + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaInputs_Con_LabelID(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel, atributos = '') {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' '" + atributos + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaBR() {
    return "</br>"
}
function CreaTextArea(Name, clas, adicion, atributos = '') {
    return "<textarea class='" + clas + "' data-idfrmac='" + atributos + "' name='" + Name + "' id='" + Name + "' rows='10' cols='50' " + adicion + " ></textarea>";
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
let formularioqueja = `
<div class="card-header eliminaformaes">
<h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">

            <li class="nav-item eliminaformaes">
            <a class="nav-link  eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
             <li class="nav-item eliminaformaes tab2">
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_escrito" id="tab2">Alta Escrito inicial</a>
            </li>
            <li class="nav-item eliminaformaes tab3" >
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_acta" id="tab3">Alta Acta Circunstanciada</a>
            </li>
            <li class="nav-item eliminaformaes">
            <a class="nav-link active eliminaformaes" data-toggle="tab" href="#altaqueja" id="tab4">Datos Complementarios</a>
            </li>
        </ul>
        <div class="tab-content eliminaformaes">
        <div class="tab-pane fade show  eliminaformaes" id="datospersonales" role="tabpanel">
                <!-- Inicio tabl vertical -->
            <div class="col-md-12 eliminaformaes">
                <div class="cardpeque eliminaformaes">
                    <div class="card-header d-block eliminaformaes">
                    </div>
                    <div class="card-body eliminaformaes">
                        <div id="accordion-seven" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                            <div class="accordion__item eliminaformaes">
                                <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseOne">
                                    <span class="accordion__header--icon eliminaformaes"></span>
                                    <span class="accordion__header--text eliminaformaes">Datos del Peticionario</span>
                                    <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                </div>
                                <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                    <div class="accordion__body--text eliminaformaes" >
                                           
                                            <div class="cardpeque eliminaformaes">
                                            <div class="cardpeque-body eliminaformaes">
                                                <div class="row eliminaformaes">

                                                    <div class="col-xl-2 eliminaformaes">
                                                        <div class="nav flex-column nav-pills eliminaformaes divanclasprticinariso">
                                                            <a href="#ref-frm-frmDatosPersonales1" data-toggle="pill" data-numpetit="1" class="nav-link active show eliminaformaes linksfrmpetit">Peticionario 1
                                                            </a>
                                                        </div>
                                                        <button class="eliminaformaes" id="addPeticionariodp" style="margin-top: 5px;border: none;">
                                                            <i b-oo5lp8m93w="" class="fas fa-user-plus eliminaformaes"></i>
                                                        </button>
                                                    </div>

                                                    <div class="col-xl-10 eliminaformaes">
                                                        <div class="tab-content eliminaformaes tabfrmPeticionarios">   
                                                            <div id="ref-frm-frmDatosPersonales1" class="tab-pane fade active show divformularioDatosPersonales eliminaformaes">
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </div>
                <!-- Fin tab vertical -->
        </div>
        <div class="tab-pane active fade eliminaformaes" id="altaqueja">
            <div class="pt-4 eliminaformaes">
                        <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                                <div id="izquierda" class="row col-6" ></div>
                                <div id="derecha" class="row col-6" ></div>
                        </form>
                </div>
            </div>

          <div class="tab-pane fade eliminaformaes" id="alta_escrito">
            <div class="tab-content eliminaformaes">
        <div class="tab-pane fade show active eliminaformaes" id="datosescritoinicial" role="tabpanel">
                <!-- Inicio tabl vertical -->
            <div class="col-md-12 eliminaformaes">
                <div class="cardpeque eliminaformaes">
                    <div class="card-header d-block eliminaformaes">
                    </div>
                    <div class="card-body eliminaformaes">
                        <div id="accordion-seven" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                            <div class="accordion__item eliminaformaes">
                                <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseOne">
                                    <span class="accordion__header--icon eliminaformaes"></span>
                                    <span class="accordion__header--text eliminaformaes">Datos para generar Escrito Inicial</span>
                                    <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                </div>
                                <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                    <div class="accordion__body--text eliminaformaes" id="divformularioEscritoInicial">
                                       <h3 style="font-size: small; font-style: italic; color: black; font-weight: bold; text-align: right;padding"><span style="color: red;">*</span> Campos Requeridos</h3>
                                    </div>
                                </div>
                            </div>

                      

                        </div>
                    </div>
                </div>
                </div>
            </div>


        </div>
            </div>

        <!-- Inicio actac -->
         <div class="tab-pane fade eliminaformaes" id="alta_acta">
             <div class="tab-content eliminaformaes">
            <div class="tab-pane fade show active eliminaformaes" id="datosactacircunstanciada" role="tabpanel">
                <!-- Inicio tabl vertical actac -->
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-header d-block eliminaformaes">
                        </div>
                        <div class="card-body eliminaformaes">
                            <div id="accordion-seven" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                                <div class="accordion__item eliminaformaes">
                                    <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseOne">
                                        <span class="accordion__header--icon eliminaformaes"></span>
                                        <span class="accordion__header--text eliminaformaes">Datos para generar Acta circunstanciada</span>
                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                    </div>
                                    <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                        <div class="accordion__body--text eliminaformaes" >
                                    
                                                <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">

                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclassactac">
                                                                <a href="#ref-frm-frmActacir1" data-toggle="pill" data-numactac="1" class="nav-link active show eliminaformaes linksfrmActaci">Acta circunstanciada 1
                                                                </a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addActac" style="margin-top: 5px;border: none;">
                                                                <i b-oo5lp8m93w="" class="fas fa-plus-circle eliminaformaes"></i>
                                                            </button>
                                                        </div>

                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmActacircu">   
                                                                <div id="ref-frm-frmActacir1" class="tab-pane fade active show divformularioActacir eliminaformaes">
                                                                    <div class ="hoja_acta">
                                                                        <div class="accordion__body--text eliminaformaes" id="divformularioActaCircunstanciada">
                                       <h3 style="font-size: small; font-style: italic; color: black; font-weight: bold; text-align: right;padding"><span style="color: red;">*</span> Campos Requeridos</h3>
                                                                        </div>
                                                                    <div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <!-- Fin tab vertical actac -->
            </div>
        </div>
        <!-- Fin actac -->
</div>
`;
let formulariorientacion = `
<div class="card-header eliminaformaes">
<h4 class="card-title eliminaformaes">Alta de Orientación</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
            <a class="nav-link active eliminaformaes" data-toggle="tab" href="#datospersonales">Registro de Datos Personales</a>
            </li>
            <li class="nav-item eliminaformaes">
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#aorientacion">Alta de una orientación</a>
            </li>
        </ul>
        <div class="tab-content eliminaformaes">
        <div class="tab-pane fade show active eliminaformaes" id="datospersonales" role="tabpanel">
                <!-- Inicio tabl vertical -->
            <div class="col-md-12 eliminaformaes">
                <div class="cardpeque eliminaformaes">
                    <div class="card-header d-block eliminaformaes">
                    </div>
                    <div class="card-body eliminaformaes">
                        <div id="accordion-seven" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                            <div class="accordion__item eliminaformaes">
                                <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseOne">
                                    <span class="accordion__header--icon eliminaformaes"></span>
                                    <span class="accordion__header--text eliminaformaes">Datos del Peticionario</span>
                                    <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                </div>
                                <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                    <div class="accordion__body--text eliminaformaes">
                                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                                    </div>
                                </div>
                            </div>
                            <div class="accordion__item eliminaformaes">
                                <div class="accordion__header collapsed accordion__header--info eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseTwo">
                                    <span class="accordion__header--icon eliminaformaes"></span>
                                    <span class="accordion__header--text eliminaformaes">Escrito de queja</span>
                                    <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                </div>
                                <div id="header-bg_collapseTwo" class="collapse accordion__body eliminaformaes" data-parent="#accordion-seven">
                                    <div class="accordion__body--text eliminaformaes">
                                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </div>
                <!-- Fin tab vertical -->
        </div>

        <div class="tab-pane fade eliminaformaes" id="aorientacion">
            <div class="pt-4 eliminaformaes">
            <h4 class="eliminaformaes">Formulario Orientación</h4>
                <p class="eliminaformaes">
                    Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.
                </p>
                <p class="eliminaformaes">
                    Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.
                </p>
                </div>
            </div>
        </div>
    </div>
</div>
`;
let formulariocanalizacion = `
  <div class="card-header eliminaformaes">
                    <h4 class="card-title eliminaformaes">Alta de Canalización</h4>
                    </div>
                    <div class="card-body eliminaformaes">
                        <div class="default-tab eliminaformaes">
                            <ul class="nav nav-tabs eliminaformaes" role="tablist">
                                <li class="nav-item eliminaformaes">
                                <a class="nav-link active eliminaformaes" data-toggle="tab" href="#datospersonales">Registro de Datos Personales</a>
                                </li>
                                <li class="nav-item eliminaformaes">
                                <a class="nav-link eliminaformaes" data-toggle="tab" href="#acanallizacion">Alta de una canalización</a>
                                </li>
                            </ul>
                            <div class="tab-content eliminaformaes">
                            <div class="tab-pane fade show active eliminaformaes" id="datospersonales" role="tabpanel">
                                    <!-- Inicio tabl vertical -->
                                <div class="col-md-12 eliminaformaes">
                                    <div class="cardpeque eliminaformaes">
                                        <div class="card-header d-block eliminaformaes">
                                        </div>
                                        <div class="card-body eliminaformaes">
                                            <div id="accordion-seven" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                                                <div class="accordion__item eliminaformaes">
                                                    <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseOne">
                                                        <span class="accordion__header--icon eliminaformaes"></span>
                                                        <span class="accordion__header--text eliminaformaes">Datos del Peticionario</span>
                                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                                    </div>
                                                    <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                                        <div class="accordion__body--text eliminaformaes">
                                                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="accordion__item eliminaformaes">
                                                    <div class="accordion__header collapsed accordion__header--info eliminaformaes" data-toggle="collapse" data-target="#header-bg_collapseTwo">
                                                        <span class="accordion__header--icon eliminaformaes"></span>
                                                        <span class="accordion__header--text eliminaformaes">Escrito de queja</span>
                                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                                    </div>
                                                    <div id="header-bg_collapseTwo" class="collapse accordion__body eliminaformaes" data-parent="#accordion-seven">
                                                        <div class="accordion__body--text eliminaformaes">
                                                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <!-- Fin tab vertical -->
                            </div>

                            <div class="tab-pane fade eliminaformaes" id="acanallizacion">
                                <div class="pt-4 eliminaformaes">
                                    <h4 class="eliminaformaes">Formulario canalización</h4>
                                    <p class="eliminaformaes">
                                        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove.
                                    </p>
                                    <p class="eliminaformaes">
                                            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove.
                                        </p>
                                    </div>
                            </div>

                        </div>
                    </div>
`;
function arregloDocumentos() {
    var arreglo = [];
    const objeto = { idSelect: 1, descripcion: 'Hoja de Datos Personales' }
    const objeto1 = { idSelect: 2, descripcion: 'Escrito Inicial de queja' }
    const objeto2 = { idSelect: 3, descripcion: 'Acta circunstanciada' }
    const objeto3 = { idSelect: 4, descripcion: 'Datos Complementarios' }

    arreglo.push(objeto);
    arreglo.push(objeto1);
    arreglo.push(objeto2);
    arreglo.push(objeto3);

    return arreglo;
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
function CargaDatosSelect(select, arreglo) {
    var htmld = select;
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v]}">${arreglo[v]}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    $(select).select2();
}
function CargaDatosSelectOtro(select, arreglo) {
    var htmld = select;
    htmld += ' <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelectGenerico}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    $(select).select2();
}
function CargaDatosSelectOtroPaises(select, arreglo) {
    var htmld = select;
    htmld += ' <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    $(select).select2();
}
function Carga_Informacion_selec_quejas(nfrm) {

    fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
        //console.log(data)
        let abogado = data.lista3;
        let estado = data.lista4;
        let autoridad = data.lista2;
        let estadoRM = data.lista5;
        console.log(abogado);
        console.log(estado);
        console.log(estadoRM);

        CargaDatosSelectOtro("#lugar" + nfrm, estado);
        CargaDatosSelectOtro("#nomAbogado" + nfrm, abogado);
        CargaDatosSelectOtro("#Input_LugarHechos", estado);
        CargaDatosSelecAutori("#Input_autoridades" + nfrm, autoridad);
        CargaDatosSelectOtro("#origenPet" + nfrm, estado);
        CargaDatosSelectOtro("#catMunicipio_hechos" + nfrm, estado);
        CargaDatosSelectOtro("#catEstado_hechos" + nfrm, estadoRM);

        var idUser = $("#idusuario").val();

        $('#nomAbogado' + nfrm + ' > option[value="' + idUser + '"]').attr('selected', 'selected');
        $('#idabogado' + nfrm).val(idUser);

        $('#idpet1').val('1165');
        $('.idEscrito_').val('2');
        $('#nomAbogado' + nfrm).val(idUser).trigger('change.select2');
        $("#nomAbogado" + nfrm).prop('disabled', true);
    });

}
function arreglo_Estados() {
    var arregloEdos = [];
    $.getJSON("https://api.copomex.com/query/get_estado_clave?token=pruebas", function (copomex) {
        console.log(copomex.response.estado_clave);
        arregloEdos = copomex.response.estado_clave;


        for (i = 0; i < arregloEdos.length; i++) {
            var objeto0 = { idSelect: arregloEdos[i][0], descripcion: arregloEdos[i] };
            arregloEdos.push(objeto0);
        }


    })
    return arregloEdos;
}
function deleteFormulario() {
    $('.btnDelPetit').click(function (e) {
        e.preventDefault();
        let arrid = this.id.split('-');
        let idfrmdel = this.dataset.idfrmdel;
        let idcomplementodel = $('#idcomplementopet' + idfrmdel).val();

        swal.fire({
            title: 'Eliminar Peticionario',
            text: "¿Desea eliminar el peticioanrio para este escrito?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(function (resp) {
            if (resp.isConfirmed) {
                let elementDel = document.querySelectorAll('.' + arrid[1]);

                for (var i = 0; i < elementDel.length; i++) {
                    elementDel[i].remove();
                }

                const ids = peticionariosGuardados.map(({ idcomplementopet }) => idcomplementopet);
                console.log(ids)
                console.log(idcomplementodel)
                peticionariosGuardadosok = peticionariosGuardados.filter(({ idcomplementopet }, index) => !ids.includes(idcomplementopet, index + 1));
                filtradonuevo = peticionariosGuardadosok.filter(item => item.idcomplementopet != idcomplementodel)

                $('.listapet').append(selectPetACircunstanciada($('.idquejagenerado').val(), filtradonuevo, 'escritoi', 'Input_Peticionario'));
                $('.listapetactac').append(selectPetACircunstanciada($('.idquejagenerado').val(), filtradonuevo, 'actac', 'nombrePet'));


            }
        })

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
}
function habilitarAlta(nfrm) {
    let FrmDataExp = new FormData();
    FrmDataExp.append('id_queja', '384');

    fetchPost("Expediente/obtenerValidacion", "json", FrmDataExp, (resp) => {
        console.log(resp)

        if (resp.status == 'SI') {
            $("#tab4").css('display', 'block');
        } else {
            $("#tab4").css('display', 'none');
        }

    });


}
/*apartado datos complementarios de la queja*/
function Crear_Formulario_Queja() {
    var arregloBlanco = [];
    var cuerpoIzquierda = CreaInputs_Con_Label('idquejaDC', 'idquejaDC', '', 'text', 'ID:', 'textfield', 'mes')
        + CreaSelectLabel('viainterpos', '', arregloBlanco, '', 'Via de interposición: ', '')
        + CreaBR()
        + CreaBR()
        + CreaSelectLabel('Abogadoqueja', '', arregloBlanco, '', 'Abogado quien Recibe: ', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Hechos: ')
        + CreaBR()
        + CreaTextArea('hechos', '', 'style="width:100% "')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Autoridad(es): ')
        + CreaBR()
        + "<div id='contenedor_Autoridades'>" /*+ DivPequeniosautoridad('Honorable Congreso del Estado', 'Estatal', '1245')*/ + "</div>";
    var cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', 'Lugar de los hechos: ')
        + CreaBR() + CreaSelectLabel('municipioqueja', '', arregloBlanco, '', 'Municipio y estado: ', '')
        + CreaBR() + Crea_Label('textfield8', 'textfield8', '', 'Peticionario(s): ')
        + CreaBR()
        //+ CreaInputs_Con_Label('nombrequejoso', 'nombrequejoso', '', 'text', 'Nombre(s):', 'textfield', 'Nombre')
        //+ CreaBR()
        //+ CreaInputs_Con_Label('Apellidos', 'Apellidos', '', 'text', 'Apellidos: ', 'textfield', 'Apellido paterno - Aepllido Materno')
        //+ CreaBR()
        //+ CreaInputs_Con_Label('curp', 'curp', '', 'text', 'CURP: ', 'textfield', 'CURP')
        + "<div id='contenedor_Usuarios'>" /*+ DivPequenios('Christopher marquez', 'MALC961120HNERPH05', '1')*/ + "</div>"
        //+ CreaBR()
        + CreaSelectLabeldisabled('visitaduriaqueja', '', arregloBlanco, '', 'Visitaduria: ', '')
        + CreaBR()
        + CreaInputs_Con_Label('Fecha_Registro', 'Fecha_Registro', '', 'date', 'Fecha de Registro: ', 'textfield', '')
        + CreaBR()
        + CreaSelectLabel('sedeRegistro', '', arregloBlanco, '', 'Sede de Registro: ', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Observaciones: ')
        + CreaBR()
        + CreaTextArea('observaciones', '', 'style="width:100%; height=180px"')
        + CreaBR()
        + CreaBR()
        + crea_Boton('button', 'Guardar', 'saveQueja', 'btn btn-success', 'guardarQueja()')
        + crea_Boton('button', 'Enviar', 'enviarQueja', 'btn btn-success', 'EnviarQueja()');
    var formInnicial = '<form class="text-justify formQueja" id="formQueja" name="formQueja" method="post" style="width:90%; margin-left:5%" >';
    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpoIzquierda + fin_form;
    let formualarioCompleto1 = formInnicial + cuerpoDerecha + fin_form;

    $('#izquierda').append(formualarioCompleto);
    $('#derecha').append(formualarioCompleto1);
    $('#Abogadoqueja').select2();
    $('#municipioqueja').select2();
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
function traeInformacionDatosComplementarios(idqueja) {
    $('#izquierda').empty();
    $('#derecha').empty();
    Crear_Formulario_Queja();
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
            $("#idquejaDC").val(response.informarcionC.id_expediente);
            $("#hechos").val(response.informarcionC.hechos);
            var inputDate = document.getElementById("Fecha_Registro");
            var date = new Date(response.informarcionC.fecha_registro)
            chargeDateInputDate(inputDate, date);
            //$("#Fecha_Registro").val(response.informarcionC.fecha_registro.toJSON().slice(0, 10));
            if (response.informarcionC.informacioncomplementariapeticionario != null) {
                var contadorpeticionarios = response.informarcionC.informacioncomplementariapeticionario.length;
                for (var i = 0; i < contadorpeticionarios; i++) {
                    console.log(contadorpeticionarios);
                    $("#contenedor_Usuarios").html($("#contenedor_Usuarios").html() + DivPequenios(response.informarcionC.informacioncomplementariapeticionario[i].nombre_peticionario.replace(/No Proporcionado/g, ''), response.informarcionC.informacioncomplementariapeticionario[i].curp, response.informarcionC.informacioncomplementariapeticionario[i].id_registro));
                }
            }

            if (response.informarcionC.informacioncomplementariaautoridad != null) {
                var contadorautoridades = response.informarcionC.informacioncomplementariaautoridad.length;
                for (var i = 0; i < contadorautoridades; i++) {
                    console.log(contadorautoridades);
                    $("#contenedor_Autoridades").html($("#contenedor_Autoridades").html() + DivPequeniosautoridad(response.informarcionC.informacioncomplementariaautoridad[i].nombre_autoridad, response.informarcionC.informacioncomplementariaautoridad[i].ambito, response.informarcionC.informacioncomplementariaautoridad[i].id_registro));
                }
            }


            // $("#modaldatoscomplementariosqueja").modal("show");

        }
    });
}
function DivPequenios(nombrepeticionario, curp, idpeticionario) {
    var div = "<div id='Divpequenios'>"
        +
        `
			<div class="dummy dummy-text">
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario.replace(/No Proporcionado/g, '') }</span><span class="tooltipbox-content clearfix">
            <span class="tooltipbox-text"><span style="color:#c39f76">Infromación del Peticionario</span><br>
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
            <span class="tooltipbox-text"><span style="color:#c39f76">Infromación de la autoridad</span><br>
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

function CargaDatosSelecAutori(select, arreglo) {
    var htmld = select;
    htmld += '';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].clave}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    $(select).append(htmld)
    $(select).select2();
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
                        title: 'Se ha actualizado el status de la queja',
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
                            mostrarResTblFormatos(response.data);
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
            frmincompleto("#tab4");
        }
        else {
            $("#CircunstanciasHechos").val($("#hechos").val());
            $("#hechos1").val($("#hechos").val());
            
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
                    frmcompleto("#tab4");
                }
            });

        }
    });
}
function validarCamposVaciosInput() {
    $("#parrafo").css("color", "#000000");
    var validacion = false;
    try {
        if ($('#idqueja').val().length === 0) {
            validacion = estiloinputvalidacion('#idqueja', validacion);
        }
    } catch (e) {
        if ($('#idquejaDC').val().length === 0) {
            validacion = estiloinputvalidacion('#idquejaDC', validacion);
        }
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
/*apartado datos complementarios de la queja*/

function frmincompleto(nombre) {
    //$(nombre).css('border-color', 'red');
    $(nombre).css('background', 'linear-gradient(white, #ff00004d)');
}

function frmcompleto(nombre) {
    //$(nombre).css('border-color', 'green');
    $(nombre).css('background', 'linear-gradient(white, #78f381)');
}

function Requeridos() {
    return '<span style="color: red;">*</span>';
}