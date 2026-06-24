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
//let contadorSelect = 0;
let peticionariosGuardados = [];
let peticionariosGuardadosok = [];
let SelAutoridad = [];
let filtradonuevo = [];
let filtradoadd = [];
let idqueja = "";
let crearformularios = 0;
let Morales = "";
var ipAcceso = '';
let tipoPeticionarioSeleccionado = "";

(function ($) {
    "use strict"

    fetchGet("Expediente/Llenarselects_tevi", "json", (data) => {
        let res = data.tipoescrito;
        let viainterposicion = data.viainterposicion;

        console.log(res)
        console.log(viainterposicion)

        // CORREGIDO: Se agrega la opción por defecto
        let html = '<select id="select_tipoescritoc" class="form-control form-control-lg">';
        html += '<option value="">Seleccione una opción</option>'; // Esta línea estaba faltando
        for (let i = 0; i < res.length; i++) {
            html += `<option value="${res[i].idSelect}">${res[i].descripcion}</option>`;
        }
        html += "</select>";
        $("#select_tipoescrito").empty().append(html); // Se recomienda usar .empty() antes de .append()

        let htmld = '<select id="select_viainterposicionc" class="form-control form-control-lg">';
        htmld += '<option value="">Seleccione una opción</option>';
        for (let v = 0; v < viainterposicion.length; v++) {
            htmld += `<option value="${viainterposicion[v].idSelect}">${viainterposicion[v].descripcion}</option>`;
        }
        htmld += "</select>";
        $("#select_viainterposicion").empty().append(htmld);

        // --- Evento: cuando cambia la vía, reiniciar tipo de escrito --- JM --------------------------------------
        $("#select_viainterposicionc").on("change", function () {
            // Reinicia el select de tipo de escrito al valor por defecto
            $("#select_tipoescritoc").val("");
        });

        changeselects();
    });


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


    $(document).on('click', "#save", function () { /*Guardado Escrito Inicial 2023*/

        let btn = $(this);

        if (btn.prop('disabled')) return; // evita doble ejecución

        btn.prop('disabled', true); // 🔒 bloquea botón

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
        dataEscritoi.append('Input_LugarHechosDescripcion', $('select[id="Input_LugarHechos"] option:selected').text());
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
                                //$('#hechos1').val($('#CircunstanciasHechos').val()) <-- Heredaba el campo de los hechos del escrito y los ponía dentro del Acta Circunstanciada

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

    // David 16 06 2025 Añadi un metodo para el guardado unicamente del formulario de orientacion
    /// Modificacion 26 06 2025: Ajuste a los cambios en los campos del formulario
    /// Modificacion Cris y David 15 07 2025: Ajuste a los cambios en los campos del formulario
    /// Modificacion Cris 28.07.2025 Ajuste a los cambios en los campos del formulario

    $(document).on('click', '#saveOrientacion', function () {
        // Deshabilitar el botón 
        $('#saveOrientacion').prop('disabled', true);
        // Validación general antes de iniciar
        if (
            !$('#Input_Peticionario').val() ||
            !$('#Input_ID').val() ||
            !$('#ExplicacionOrientacion').val() ||
            !$('#Input_LugarHechos').val() ||
            !$('#Input_FechaRecepcion').val() ||
            !$('#Input_HoraRecepcion').val() ||
            !$('#sedeRegistro').val()
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab2");
            return;
        }

        // Validacion campos no requeridos pero vacios - agrega un default
        let defaultOrientacionText = 'No proporcionado';
        if (
            !$('#Input_autoridadresp').val() ||
            !$('#Input_institucion').val()
        ) {
            $('#Input_autoridadresp').val(defaultOrientacionText);
            $('#Input_institucion').val(defaultOrientacionText);
        }

        let peticionarios = $('.linksfrmpetit');
        let totalPeticionarios = peticionarios.length;

        if (totalPeticionarios === 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'No hay peticionarios para guardar',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Obtenemos el peticionario seleccionado en el select de orientación
        let peticionarioSeleccionado = $('#Input_Peticionario').find('option:selected').text().trim();

        let peticionariosData = [];

        for (let i = 1; i <= totalPeticionarios; i++) {
            let dataOrientacionInd = new FormData();

            // Campos generales
            dataOrientacionInd.append('Input_ID', $('#Input_ID').val() || '');
            dataOrientacionInd.append('Input_folio', $('#Input_folio').val() || '');
            dataOrientacionInd.append('Input_LugarHechos', $('#Input_LugarHechos').val() || '');
            dataOrientacionInd.append('Input_LugarHechosDescripcion', $('#Input_LugarHechos option:selected').text() || '');
            dataOrientacionInd.append('Input_FechaRecepcion', $('#Input_FechaRecepcion').val() || '');
            dataOrientacionInd.append('Input_HoraRecepcion', $('#Input_HoraRecepcion').val() || '');
            dataOrientacionInd.append('Input_autoridadresp', $('#Input_autoridadresp').val() || '');
            dataOrientacionInd.append('Input_institucion', $('#Input_institucion').val() || '');
            dataOrientacionInd.append('ExplicacionOrientacion', $('#ExplicacionOrientacion').val() || '');
            dataOrientacionInd.append('sedeRegistro', $('#sedeRegistro').val() || '');
            dataOrientacionInd.append('sederegistro_desc', $('#sedeRegistro option:selected').text() || '');
            dataOrientacionInd.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text() || '');
            dataOrientacionInd.append('usuarioL', $('#usuarioL').text() || '');

            // Obtener id complemento peticionario para buscar nombre en peticionariosGuardados
            let idComplemento = $(`#idcomplementopet${i}`).val();

            // Buscar el peticionario en arreglo guardado
            let pet = peticionariosGuardados.find(p => p.idcomplementopet == idComplemento);

            let petName = pet ? pet.nombrepeti.trim() : '';
            if (!petName) {
                // Si por alguna razón no existe, tratar de obtenerlo desde el select (fallback)
                petName = $(`#frmDatosPersonales${i} select[name="Input_Peticionario"]`).find('option:selected').text().trim() || '';
            }

            dataOrientacionInd.append('Input_Peticionario', petName);

            let idPersona = pet ? pet.idpeticionario : '';  // O ajusta según tu estructura real
            dataOrientacionInd.append('id_personas', idPersona);

            // Aquí agregamos el campo documento
            if (petName === peticionarioSeleccionado) {
                dataOrientacionInd.append('documento', 'SI');
            } else {
                dataOrientacionInd.append('documento', 'NO');
            }

            // Edad
            let edad = $(`#edad_petit-frmDatosPersonales${i}`).val() || '';
            // Si 'edad' es "No proporcionado" asigna un nulo
            if (edad === "No proporcionado" || edad.trim() === "") {
                edad = null;
            } else {
                edad = parseInt(edad) || null; // Verifica que sea un entero
            }
            dataOrientacionInd.append('edad', edad);

            // Sexo
            let sexoId = $(`input[name="radsexo_petit-frmDatosPersonales${i}"]:checked`).val();
            let sexoTexto = '';
            if (sexoId === '1') sexoTexto = 'Masculino';
            else if (sexoId === '2') sexoTexto = 'Femenino';
            else if (sexoId === '3') sexoTexto = 'No proporcionado';
            dataOrientacionInd.append('sexo', sexoTexto);

            // Género
            let genero = $(`#genero_petit-frmDatosPersonales${i}`).val() || '';
            if (genero === 'Otro') {
                let generoOtro = ($(`#ogenero_petit-frmDatosPersonales${i}`).val() || '').trim();
                genero = generoOtro.length > 0 ? generoOtro : '';
            }
            dataOrientacionInd.append('genero', genero);

            // Tipo usuario
            let tipoUsuarioRaw = $(`input[name="qatu_petit-frmDatosPersonales${i}"]:checked`).val() || '';
            let tipoUsuario = tipoUsuarioRaw === 'Peticionario' ? 'Quejoso' : tipoUsuarioRaw;
            dataOrientacionInd.append('tipo_usuario', tipoUsuario);

            // Solo el primer peticionario incluye el archivo PDF
            if (i === 1) {
                let archivo = $('#pdfEscritoi')[0]?.files[0];
                if (archivo) {
                    dataOrientacionInd.append('pdfEscritoi', archivo);
                }
            }

            // DEBUG: Mostrar datos en consola
            for (let pair of dataOrientacionInd.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            peticionariosData.push(dataOrientacionInd);
        }

        // Variables para control de respuestas
        let enviados = 0;
        let errores = 0;

        peticionariosData.forEach(function (formData) {
            $.ajax({
                type: 'POST',
                url: '/AltaExpediente/GuardarOrientacion',
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    console.log('Respuesta del servidor:', res);
                    enviados++;
                    if (res.status !== true) errores++;
                    console.warn('Error en registro individual:', res);
                    if (enviados === peticionariosData.length) {
                        if (errores === 0) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Todos los datos se guardaron correctamente',
                                showConfirmButton: false,
                                timer: 2500
                            });
                            frmcompleto("#tab2");
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Algunos registros no se guardaron correctamente',
                                text: 'Verifica la información ingresada',
                                timer: 3000
                            });
                        }
                    }
                },
                error: function () {
                    errores++;
                    enviados++;
                    if (enviados === peticionariosData.length) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de red',
                            text: 'Hubo errores al guardar uno o más registros.'
                        });
                    }
                }
            });
        });
    });
    //bloque para actualizar e insertar orientaciones
    //metodo update orientacion 21/10/25
    $(document).on('click', '#updateOrientacion', function () {
        let tablaReferencia = "ORIENTACION";
        // Validación general
        if (

            !$('#Input_ID').val() ||
            !$('#ExplicacionCedula').val() ||
            !$('#Input_LugarHechos_C').val() ||
            !$('#Input_FechaRecepcion_C').val() ||
            !$('#Input_HoraRecepcion_C').val() ||
            !$('#sedeRegistro_C').val()
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Debe llenar todos los campos obligatorios para actualizar',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab2");
            return;
        }

        // Valores por defecto si están vacíos
        let defaultText = 'No proporcionado';
        if (!$('#Input_autoridadresp_C').val()) $('#Input_autoridadresp_C').val(defaultText);
        if (!$('#Input_institucion_C').val()) $('#Input_institucion_C').val(defaultText);

        let formData = new FormData();

        // Campos del formulario
        formData.append('tablaReferencia', 'ORIENTACION');
        formData.append('Input_ID', $('#Input_ID').val());
        formData.append('Input_folio_C', $('#Input_folio_C').val());
        formData.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        formData.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        formData.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        formData.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        formData.append('Input_autoridadresp_C', $('#Input_autoridadresp_C').val());
        formData.append('Input_institucion_C', $('#Input_institucion_C').val());
        formData.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        formData.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        formData.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        formData.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text() || '');
        formData.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        formData.append('Input_Peticionario', $('#Input_Peticionario_C option:selected').text().trim());

        // Documento
        formData.append('documento', 'SI');

        // Datos personales
        let edad = $('#edad_petit-frmDatosPersonales1').val();
        formData.append('edad', edad || '');
        let sexo = $('input[name="radsexo_petit-frmDatosPersonales1"]:checked').val();
        formData.append('sexo', sexo || '');
        let genero = $('#genero_petit-frmDatosPersonales1').val();
        if (genero === 'Otro') {
            let otroGenero = $('#ogenero_petit-frmDatosPersonales1').val().trim();
            genero = otroGenero.length > 0 ? otroGenero : '';
        }
        formData.append('genero', genero || '');
        let tipoUsuario = $('input[name="qatu_petit-frmDatosPersonales1"]:checked').val();
        formData.append('tipo_usuario', tipoUsuario === 'Peticionario' ? 'Quejoso' : tipoUsuario || '');

        // ID persona
        let idPersonas = $('#id_personas').val();
        if (idPersonas) {
            formData.append('id_personas', idPersonas);
        } else {
            formData.append('id_personas', 0);  // pendiente
        }

        // Archivo PDF
        // modificado
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                formData.append('pdfEscritoi', archivos[i]);
            }
        }


        console.log("PRUEBAS DATOS ORIENTACION", formData);
        // Enviar al backend
        fetchPost("AltaExpediente/GuardarEditarCedula", "json", formData, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });
    //METODO INSERTAR ORIENTACION
    $(document).on('click', '#insertOrientacion', function () {
        let tablaReferencia = "ORIENTACION";
        // Validación general
        if (

            !$('#Input_ID').val() ||
            !$('#ExplicacionCedula').val() ||
            !$('#Input_LugarHechos_C').val() ||
            !$('#Input_FechaRecepcion_C').val() ||
            !$('#Input_HoraRecepcion_C').val() ||
            !$('#sedeRegistro_C').val()
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Debe llenar todos los campos obligatorios para actualizar',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab2");
            return;
        }

        // Valores por defecto si están vacíos
        let defaultText = 'No proporcionado';
        if (!$('#Input_autoridadresp_C').val()) $('#Input_autoridadresp_C').val(defaultText);
        if (!$('#Input_institucion_C').val()) $('#Input_institucion_C').val(defaultText);

        let formData = new FormData();

        // Campos del formulario
        formData.append('tablaReferencia', 'ORIENTACION');
        formData.append('Input_ID', $('#Input_ID').val());
        formData.append('Input_folio_C', $('#Input_folio_C').val());
        formData.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        formData.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        formData.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        formData.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        formData.append('Input_autoridadresp_C', $('#Input_autoridadresp_C').val());
        formData.append('Input_institucion_C', $('#Input_institucion_C').val());
        formData.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        formData.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        formData.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        formData.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text() || '');
        formData.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        formData.append('Input_Peticionario', $('#Input_Peticionario option:selected').text().trim());
        formData.append('via_interposicion', $('#via_interposicion').val());

        // Documento
        formData.append('documento', 'SI');

        // Datos personales
        formData.append('edad', $('#edad').val() || 0);
        formData.append('genero', $('#genero').val() || '');
        formData.append('tipo_usuario', $('#tipo_usuario').val() || '');
        formData.append('sexo', $('#sexo').val() || '');

        // ID persona
        let idPersonas = $('#id_personas').val();
        if (idPersonas) {
            formData.append('id_personas', idPersonas);
        } else {
            formData.append('id_personas', 0);  // pendiente
        }

        // Archivo PDF
        // modificado
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                formData.append('pdfEscritoi', archivos[i]);
            }
        }


        console.log("PRUEBAS DATOS ORIENTACION", formData);
        // Enviar al backend
        fetchPost("AltaExpediente/InsertarCedula", "json", formData, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });
    //fin bloque



    /// Cris y David 17 06 2025: Metodo guardado de Alta de Remision
    /// Modificacion 26 06 2025: Ajuste a los cambios en los campos del formulario
    /// Modificacion David 17 07 2025: Cambio en la info del formdata, pdf adjunto y campos requeridos

    $(document).on('click', '#saveRemision', function () {
        // Validación general
        if (
            !$('#Input_Peticionario').val() ||
            !$('#Input_ID').val() ||
            !$('#Input_LugarHechos').val() ||
            !$('#Input_FechaRecepcion').val() ||
            !$('#Input_HoraRecepcion').val() ||
            !$('#nomAbogado2').val() ||
            !$('#Input_numOficio').val() ||
            !$('#Input_institucion').val() ||
            !$('#ExplicacionRemision').val() ||
            !$('#sedeRegistro').val()
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab5");
            return;
        }

        let peticionarios = $('.linksfrmpetit');
        let totalPeticionarios = peticionarios.length;

        if (totalPeticionarios === 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'No hay peticionarios para guardar',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let peticionarioSeleccionado = $('#Input_Peticionario option:selected').text().trim();

        let peticionariosData = [];

        for (let i = 1; i <= totalPeticionarios; i++) {
            let formData = new FormData();

            // Datos generales del formulario
            formData.append('Input_ID', $('#Input_ID').val());
            formData.append('Input_folio', $('#Input_folio').val());
            formData.append('Input_LugarHechos', $('#Input_LugarHechos').val());
            formData.append('Input_LugarHechosDescripcion', $('#Input_LugarHechos option:selected').text());
            formData.append('Input_FechaRecepcion', $('#Input_FechaRecepcion').val());
            formData.append('Input_HoraRecepcion', $('#Input_HoraRecepcion').val());
            formData.append('Input_numOficio', $('#Input_numOficio').val());
            formData.append('Input_institucion', $('#Input_institucion').val());
            formData.append('nomAbogado', $('#nomAbogado2 option:selected').text());
            formData.append('ExplicacionRemision', $('#ExplicacionRemision').val());
            formData.append('sedeRegistro', $('#sedeRegistro').val());
            formData.append('sederegistro_desc', $('#sedeRegistro option:selected').text());
            formData.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
            formData.append('usuarioL', $('#usuarioL').text());

            // Peticionario
            let idComplemento = $(`#idcomplementopet${i}`).val();
            let pet = peticionariosGuardados.find(p => p.idcomplementopet == idComplemento);
            let petName = pet ? pet.nombrepeti.trim() : '';
            if (!petName) {
                petName = $(`#frmDatosPersonales${i} select[name="Input_Peticionario"]`).find('option:selected').text().trim();
            }

            formData.append('Input_Peticionario', petName);
            formData.append('id_personas', pet ? pet.idpeticionario : '');

            // Documento
            if (petName === peticionarioSeleccionado) {
                formData.append('documento', 'SI');
            } else {
                formData.append('documento', 'NO');
            }

            // Datos personales
            // Edad
            let edad = $(`#edad_petit-frmDatosPersonales${i}`).val() || '';
            // Si 'edad' es "No proporcionado" asigna un nulo
            if (edad === "No proporcionado" || edad.trim() === "") {
                edad = null;
            } else {
                edad = parseInt(edad) || null; // Verifica que sea un entero
            }
            formData.append('edad', edad);

            let sexoId = $(`input[name="radsexo_petit-frmDatosPersonales${i}"]:checked`).val();
            let sexoTexto = '';
            if (sexoId === '1') sexoTexto = 'Masculino';
            else if (sexoId === '2') sexoTexto = 'Femenino';
            else sexoTexto = 'No proporcionado';
            formData.append('sexo', sexoTexto);

            let genero = $(`#genero_petit-frmDatosPersonales${i}`).val() || '';
            if (genero === 'Otro') {
                let otroGenero = $(`#ogenero_petit-frmDatosPersonales${i}`).val().trim();
                genero = otroGenero || '';
            }
            formData.append('genero', genero);

            let tipoUsuarioRaw = $(`input[name="qatu_petit-frmDatosPersonales${i}"]:checked`).val() || '';
            let tipoUsuario = tipoUsuarioRaw === 'Peticionario' ? 'Quejoso' : tipoUsuarioRaw;
            formData.append('tipo_usuario', tipoUsuario);

            // PDF solo para el primer peticionario
            if (i === 1) {
                let archivo = $('#pdfEscritoi')[0]?.files[0];
                if (archivo) {
                    formData.append('pdfEscritoi', archivo);
                }
            }

            peticionariosData.push(formData);
        }

        // Enviar los datos
        let enviados = 0;
        let errores = 0;

        peticionariosData.forEach(function (formData) {
            $.ajax({
                type: 'POST',
                url: '/AltaExpediente/GuardarRemision',
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    enviados++;
                    if (!res.status) errores++;

                    if (enviados === peticionariosData.length) {
                        if (errores === 0) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Todos los datos se guardaron correctamente',
                                showConfirmButton: false,
                                timer: 2500
                            });
                            frmcompleto("#tab6");
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Algunos registros no se guardaron correctamente',
                                text: 'Verifica la información ingresada',
                                timer: 3000
                            });
                        }
                    }
                },
                error: function () {
                    errores++;
                    enviados++;
                    if (enviados === peticionariosData.length) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de red',
                            text: 'Hubo errores al guardar uno o más registros.'
                        });
                    }
                }
            });
        });
    });
    //bloque para actualizar e insertar remisiones
    //INSERTAR REMISION 08/12/2025
    $(document).on('click', '#insertRemision', function () {
        let tablaReferencia = "REMISION";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#nomAbogado4', nombre: 'Nombre de la persona remitente' },
            { id: '#Input_numOficio_C', nombre: 'Número de oficio' },
            { id: '#Input_institucion_C', nombre: 'Institución' },
            { id: '#ExplicacionCedula', nombre: 'Explicación de la Remisión' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        let remisionDatos = new FormData();
        // Campos del formulario
        remisionDatos.append('tablaReferencia', 'REMISION');
        remisionDatos.append('Input_ID', $('#Input_ID').val());
        remisionDatos.append('Input_folio_C', $('#Input_folio_C').val());
        remisionDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        remisionDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        remisionDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        remisionDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        remisionDatos.append('Input_numOficio_C', $('#Input_numOficio_C').val());
        remisionDatos.append('Input_institucion_C', $('#Input_institucion_C').val());
        remisionDatos.append('nomAbogado', $('#nomAbogado4 option:selected').text());
        remisionDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        remisionDatos.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        remisionDatos.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        remisionDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        remisionDatos.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        remisionDatos.append('Input_Peticionario', $('#Input_Peticionario option:selected').text().trim());
        remisionDatos.append('via_interposicion', $('#via_interposicion').val());

        // Documento
        remisionDatos.append('documento', 'SI');

        // Datos personales
        remisionDatos.append('edad', $('#edad').val() || '');
        remisionDatos.append('genero', $('#genero').val() || '');
        remisionDatos.append('tipo_usuario', $('#tipo_usuario').val() || '');
        remisionDatos.append('sexo', $('#sexo').val() || '');

        // ID persona
        let idPersonas = $('#id_personas').val();
        if (idPersonas) {
            remisionDatos.append('id_personas', idPersonas);
        } else {
            remisionDatos.append('id_personas', 0);  // pendiente
        }

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //  remisionDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                remisionDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS REMISION", remisionDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/InsertarCedula", "json", remisionDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });
    // Metodo actualizado: Guardado Remision 27 10 2025 David
    $(document).on('click', '#updateRemision', function () {
        let tablaReferencia = "REMISION";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#nomAbogado4', nombre: 'Nombre de la persona remitente' },
            { id: '#Input_numOficio_C', nombre: 'Número de oficio' },
            { id: '#Input_institucion_C', nombre: 'Institución' },
            { id: '#ExplicacionCedula', nombre: 'Explicación de la Remisión' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        let remisionDatos = new FormData();
        // Campos del formulario
        remisionDatos.append('tablaReferencia', 'REMISION');
        remisionDatos.append('Input_ID', $('#Input_ID').val());
        remisionDatos.append('Input_folio_C', $('#Input_folio_C').val());
        remisionDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        remisionDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        remisionDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        remisionDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        remisionDatos.append('Input_numOficio_C', $('#Input_numOficio_C').val());
        remisionDatos.append('Input_institucion_C', $('#Input_institucion_C').val());
        remisionDatos.append('nomAbogado', $('#nomAbogado4 option:selected').text());
        remisionDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        remisionDatos.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        remisionDatos.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        remisionDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        remisionDatos.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        remisionDatos.append('Input_Peticionario', $('#Input_peticionario_C').val());

        // Documento
        remisionDatos.append('documento', 'SI');

        // Datos personales
        let edad = $('#edad_petit-frmDatosPersonales1').val();
        remisionDatos.append('edad', edad || '');
        let sexo = $('input[name="radsexo_petit-frmDatosPersonales1"]:checked').val();
        remisionDatos.append('sexo', sexo || '');
        let genero = $('#genero_petit-frmDatosPersonales1').val();
        if (genero === 'Otro') {
            let otroGenero = $('#ogenero_petit-frmDatosPersonales1').val().trim();
            genero = otroGenero.length > 0 ? otroGenero : '';
        }
        remisionDatos.append('genero', genero || '');
        let tipoUsuario = $('input[name="qatu_petit-frmDatosPersonales1"]:checked').val();
        remisionDatos.append('tipo_usuario', tipoUsuario === 'Peticionario' ? 'Quejoso' : tipoUsuario || '');

        // ID persona
        remisionDatos.append('id_personas', $('#id_personas').val() || '');

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //  remisionDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                remisionDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS REMISION", remisionDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/GuardarEditarCedula", "json", remisionDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });
    //fin bloque


    /// David: Modificacion 27 06 2025: Ajuste a los cambios en los campos del formulario de Incompetencia
    /// Modificacion David 17 07 2025: Cambio en la info del formdata, pdf adjunto y campos requeridos

    $(document).on('click', '#saveIncompetencia', function () {
        // Validación general
        if (
            !$('#Input_ID').val() ||
            !$('#Input_Peticionario').val() ||
            !$('#Input_LugarHechos').val() ||
            !$('#Input_FechaRecepcion').val() ||
            !$('#Input_HoraRecepcion').val() ||
            !$('#nomAbogado3').val() ||
            !$('#ExplicacionIncompetencia').val() ||
            !$('#sedeRegistro').val()
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab5");
            return;
        }

        // Validacion campos no requeridos pero vacios - agrega un default
        let defaultIncompetenciaText = 'No proporcionado';
        if (
            !$('#Input_numOficio').val() ||
            !$('#Input_institucion').val()
        ) {
            $('#Input_numOficio').val(defaultIncompetenciaText);
            $('#Input_institucion').val(defaultIncompetenciaText);
        }

        let peticionarios = $('.linksfrmpetit');
        let totalPeticionarios = peticionarios.length;

        if (totalPeticionarios === 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'No hay peticionarios para guardar',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let peticionarioSeleccionado = $('#Input_Peticionario option:selected').text().trim();

        let peticionariosData = [];

        for (let i = 1; i <= totalPeticionarios; i++) {
            let dataIncompetencia = new FormData();

            // Datos generales del formulario
            dataIncompetencia.append('Input_ID', $('#Input_ID').val());
            dataIncompetencia.append('Input_folio', $('#Input_folio').val());
            dataIncompetencia.append('Input_LugarHechos', $('#Input_LugarHechos').val());
            dataIncompetencia.append('Input_LugarHechosDescripcion', $('#Input_LugarHechos option:selected').text());
            dataIncompetencia.append('Input_FechaRecepcion', $('#Input_FechaRecepcion').val());
            dataIncompetencia.append('Input_HoraRecepcion', $('#Input_HoraRecepcion').val());
            dataIncompetencia.append('Input_numOficio', $('#Input_numOficio').val());
            dataIncompetencia.append('Input_institucion', $('#Input_institucion').val());
            dataIncompetencia.append('nomAbogado', $('#nomAbogado3 option:selected').text());
            dataIncompetencia.append('ExplicacionIncompetencia', $('#ExplicacionIncompetencia').val());
            dataIncompetencia.append('sedeRegistro', $('#sedeRegistro').val());
            dataIncompetencia.append('sederegistro_desc', $('#sedeRegistro option:selected').text());
            dataIncompetencia.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
            dataIncompetencia.append('usuarioL', $('#usuarioL').text());

            // Peticionario
            let idComplemento = $(`#idcomplementopet${i}`).val();
            let pet = peticionariosGuardados.find(p => p.idcomplementopet == idComplemento);
            let petName = pet ? pet.nombrepeti.trim() : '';
            if (!petName) {
                petName = $(`#frmDatosPersonales${i} select[name="Input_Peticionario"]`).find('option:selected').text().trim();
            }

            dataIncompetencia.append('Input_Peticionario', petName);
            dataIncompetencia.append('id_personas', pet ? pet.idpeticionario : '');

            // Documento
            if (petName === peticionarioSeleccionado) {
                dataIncompetencia.append('documento', 'SI');
            } else {
                dataIncompetencia.append('documento', 'NO');
            }

            // Datos personales
            // Edad
            let edad = $(`#edad_petit-frmDatosPersonales${i}`).val() || '';
            // Si 'edad' es "No proporcionado" asigna un nulo
            if (edad === "No proporcionado" || edad.trim() === "") {
                edad = null;
            } else {
                edad = parseInt(edad) || null; // Verifica que sea un entero
            }
            dataIncompetencia.append('edad', edad);

            let sexoId = $(`input[name="radsexo_petit-frmDatosPersonales${i}"]:checked`).val();
            let sexoTexto = '';
            if (sexoId === '1') sexoTexto = 'Masculino';
            else if (sexoId === '2') sexoTexto = 'Femenino';
            else sexoTexto = 'No proporcionado';
            dataIncompetencia.append('sexo', sexoTexto);

            let genero = $(`#genero_petit-frmDatosPersonales${i}`).val() || '';
            if (genero === 'Otro') {
                let otroGenero = $(`#ogenero_petit-frmDatosPersonales${i}`).val().trim();
                genero = otroGenero || '';
            }
            dataIncompetencia.append('genero', genero);

            let tipoUsuarioRaw = $(`input[name="qatu_petit-frmDatosPersonales${i}"]:checked`).val() || '';
            let tipoUsuario = tipoUsuarioRaw === 'Peticionario' ? 'Quejoso' : tipoUsuarioRaw;
            dataIncompetencia.append('tipo_usuario', tipoUsuario);

            // PDF solo para el primer peticionario
            if (i === 1) {
                let archivo = $('#pdfEscritoi')[0]?.files[0];
                if (archivo) {
                    dataIncompetencia.append('pdfEscritoi', archivo);
                }
            }

            peticionariosData.push(dataIncompetencia);
        }

        // Enviar los datos
        let enviados = 0;
        let errores = 0;

        peticionariosData.forEach(function (dataIncompetencia) {
            $.ajax({
                type: 'POST',
                url: '/AltaExpediente/GuardarIncompetencia',
                data: dataIncompetencia,
                contentType: false,
                processData: false,
                success: function (res) {
                    enviados++;
                    if (!res.status) errores++;

                    if (enviados === peticionariosData.length) {
                        if (errores === 0) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Todos los datos se guardaron correctamente',
                                showConfirmButton: false,
                                timer: 2500
                            });
                            frmcompleto("#tab6");
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Algunos registros no se guardaron correctamente',
                                text: 'Verifica la información ingresada',
                                timer: 3000
                            });
                        }
                    }
                },
                error: function () {
                    errores++;
                    enviados++;
                    if (enviados === peticionariosData.length) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de red',
                            text: 'Hubo errores al guardar uno o más registros.'
                        });
                    }
                }
            });
        });
    });

    //bloque actualizar e insertar incompetencia
    //INSERT INCOMPETENCIA 08/12/2025
    $(document).on('click', '#insertIncompetencia', function () {
        let tablaReferencia = "INCOMPETENCIA";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_ID', nombre: 'Id de expediente' },
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#nomAbogado5', nombre: 'Nombre de la persona remitente' },
            { id: '#ExplicacionCedula', nombre: 'Explicación de la Incompetencia' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        // Validacion campos no requeridos pero vacios - agrega un default
        let defaultIncompetenciaText = 'No proporcionado';
        if (
            !$('#Input_numOficio').val() ||
            !$('#Input_institucion').val()
        ) {
            $('#Input_numOficio').val(defaultIncompetenciaText);
            $('#Input_institucion').val(defaultIncompetenciaText);
        }

        let incompetenciaDatos = new FormData();

        // Campos del formulario
        incompetenciaDatos.append('tablaReferencia', 'INCOMPETENCIA');
        incompetenciaDatos.append('Input_ID', $('#Input_ID').val());
        incompetenciaDatos.append('Input_folio_C', $('#Input_folio_C').val());
        incompetenciaDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        incompetenciaDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        incompetenciaDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        incompetenciaDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        incompetenciaDatos.append('Input_numOficio_C', $('#Input_numOficio_C').val());
        incompetenciaDatos.append('nomAbogado', $('#nomAbogado5 option:selected').val());
        incompetenciaDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        incompetenciaDatos.append('Input_institucion_C', $('#Input_institucion_C').val());
        incompetenciaDatos.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        incompetenciaDatos.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        incompetenciaDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        incompetenciaDatos.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        incompetenciaDatos.append('Input_Peticionario', $('#Input_Peticionario option:selected').text().trim());
        incompetenciaDatos.append('via_interposicion', $('#via_interposicion').val());

        // Documento
        incompetenciaDatos.append('documento', 'SI');

        // Datos personales
        incompetenciaDatos.append('edad', $('#edad').val() || '');
        incompetenciaDatos.append('genero', $('#genero').val() || '');
        incompetenciaDatos.append('tipo_usuario', $('#tipo_usuario').val() || '');
        incompetenciaDatos.append('sexo', $('#sexo').val() || '');

        // ID persona
        let idPersonas = $('#id_personas').val();
        if (idPersonas) {
            incompetenciaDatos.append('id_personas', idPersonas);
        } else {
            incompetenciaDatos.append('id_personas', 0);  // pendiente
        }

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //incompetenciaDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                incompetenciaDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS INCOMPETENCIA", incompetenciaDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/InsertarCedula", "json", incompetenciaDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });



    //27 10 25 Metodo update incompetencia
    $(document).on('click', '#updateIncompetencia', function () {
        let tablaReferencia = "INCOMPETENCIA";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_ID', nombre: 'Id de expediente' },
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#nomAbogado5', nombre: 'Nombre de la persona remitente' },
            { id: '#ExplicacionCedula', nombre: 'Explicación de la Incompetencia' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        // Validacion campos no requeridos pero vacios - agrega un default
        let defaultIncompetenciaText = 'No proporcionado';
        if (
            !$('#Input_numOficio').val() ||
            !$('#Input_institucion').val()
        ) {
            $('#Input_numOficio').val(defaultIncompetenciaText);
            $('#Input_institucion').val(defaultIncompetenciaText);
        }

        let incompetenciaDatos = new FormData();

        // Campos del formulario
        incompetenciaDatos.append('tablaReferencia', 'INCOMPETENCIA');
        incompetenciaDatos.append('Input_ID', $('#Input_ID').val());
        incompetenciaDatos.append('Input_folio_C', $('#Input_folio_C').val());
        incompetenciaDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        incompetenciaDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        incompetenciaDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        incompetenciaDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        incompetenciaDatos.append('Input_numOficio_C', $('#Input_numOficio_C').val());
        incompetenciaDatos.append('nomAbogado', $('#nomAbogado5 option:selected').val());
        incompetenciaDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        incompetenciaDatos.append('Input_institucion_C', $('#Input_institucion_C').val());
        incompetenciaDatos.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        incompetenciaDatos.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        incompetenciaDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        incompetenciaDatos.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        incompetenciaDatos.append('Input_Peticionario', $('#Input_peticionario_C').val());

        // Documento
        incompetenciaDatos.append('documento', 'SI');

        // Datos personales
        let edad = $('#edad_petit-frmDatosPersonales1').val();
        incompetenciaDatos.append('edad', edad || '');
        let sexo = $('input[name="radsexo_petit-frmDatosPersonales1"]:checked').val();
        incompetenciaDatos.append('sexo', sexo || '');
        let genero = $('#genero_petit-frmDatosPersonales1').val();
        if (genero === 'Otro') {
            let otroGenero = $('#ogenero_petit-frmDatosPersonales1').val().trim();
            genero = otroGenero.length > 0 ? otroGenero : '';
        }
        incompetenciaDatos.append('genero', genero || '');
        let tipoUsuario = $('input[name="qatu_petit-frmDatosPersonales1"]:checked').val();
        incompetenciaDatos.append('tipo_usuario', tipoUsuario === 'Peticionario' ? 'Quejoso' : tipoUsuario || '');

        // ID persona
        incompetenciaDatos.append('id_personas', $('#id_personas').val() || '');

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //incompetenciaDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                incompetenciaDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS INCOMPETENCIA", incompetenciaDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/GuardarEditarCedula", "json", incompetenciaDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });
    //fin bloque


    /// David: Modificacion 27 06 2025: Ajuste a los cambios en los campos del formulario de Antecedente
    /// Modificacion Cris y David 16 07 2025: Cambio en la info del formdata, pdf adjunto y campos requeridos
    $(document).on('click', '#saveAntecedente', function () {
        // Validación general antes de iniciar
        if (
            !$('#Input_ID').val() ||
            !$('#Input_Peticionario').val() ||
            !$('#Input_autoridadresp').val() ||
            !$('#ExplicacionAntecedente').val() ||
            !$('#Input_LugarHechos').val() ||
            !$('#Input_FechaRecepcion').val() ||
            !$('#Input_HoraRecepcion').val() ||
            !$('#sedeRegistro').val()
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab5"); // Indicador visual
            return;
        }

        let peticionarios = $('.linksfrmpetit');
        let totalPeticionarios = peticionarios.length;

        if (totalPeticionarios === 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'No hay peticionarios para guardar',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let peticionarioSeleccionado = $('#Input_Peticionario').find('option:selected').text().trim();
        let peticionariosData = [];

        for (let i = 1; i <= totalPeticionarios; i++) {
            let dataAntecedente = new FormData();

            // Campos originales
            dataAntecedente.append('Input_ID', $('#Input_ID').val());
            dataAntecedente.append('Input_folio', $('#Input_folio').val());
            dataAntecedente.append('Input_LugarHechos', $('#Input_LugarHechos').val());
            dataAntecedente.append('Input_LugarHechosDescripcion', $('#Input_LugarHechos option:selected').text());
            dataAntecedente.append('Input_FechaRecepcion', $('#Input_FechaRecepcion').val());
            dataAntecedente.append('Input_HoraRecepcion', $('#Input_HoraRecepcion').val());
            dataAntecedente.append('Input_autoridadresp', $('#Input_autoridadresp').val());
            dataAntecedente.append('ExplicacionAntecedente', $('#ExplicacionAntecedente').val());
            dataAntecedente.append('sedeRegistro', $('#sedeRegistro').val());
            dataAntecedente.append('sederegistro_desc', $('#sedeRegistro option:selected').text());
            dataAntecedente.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
            dataAntecedente.append('usuarioL', $('#usuarioL').text());

            // Peticionario dinámico
            let idComplemento = $(`#idcomplementopet${i}`).val();
            let pet = peticionariosGuardados.find(p => p.idcomplementopet == idComplemento);

            let petName = pet ? pet.nombrepeti.trim() : '';
            if (!petName) {
                petName = $(`#frmDatosPersonales${i} select[name="Input_Peticionario"]`).find('option:selected').text().trim() || '';
            }

            dataAntecedente.append('Input_Peticionario', petName);

            let idPersona = pet ? pet.idpeticionario : '';
            dataAntecedente.append('id_personas', idPersona);

            // Campo documento
            dataAntecedente.append('documento', petName === peticionarioSeleccionado ? 'SI' : 'NO');

            // Edad
            // Edad
            let edad = $(`#edad_petit-frmDatosPersonales${i}`).val() || '';
            // Si 'edad' es "No proporcionado" asigna un nulo
            if (edad === "No proporcionado" || edad.trim() === "") {
                edad = null;
            } else {
                edad = parseInt(edad) || null; // Verifica que sea un entero
            }
            dataAntecedente.append('edad', edad);

            // Sexo
            let sexoId = $(`input[name="radsexo_petit-frmDatosPersonales${i}"]:checked`).val();
            let sexoTexto = '';
            if (sexoId === '1') sexoTexto = 'Masculino';
            else if (sexoId === '2') sexoTexto = 'Femenino';
            else if (sexoId === '3') sexoTexto = 'No proporcionado';
            dataAntecedente.append('sexo', sexoTexto);

            // Género
            let genero = $(`#genero_petit-frmDatosPersonales${i}`).val() || '';
            if (genero === 'Otro') {
                let generoOtro = ($(`#ogenero_petit-frmDatosPersonales${i}`).val() || '').trim();
                genero = generoOtro.length > 0 ? generoOtro : '';
            }
            dataAntecedente.append('genero', genero);

            // Tipo usuario
            let tipoUsuarioRaw = $(`input[name="qatu_petit-frmDatosPersonales${i}"]:checked`).val() || '';
            let tipoUsuario = tipoUsuarioRaw === 'Peticionario' ? 'Quejoso' : tipoUsuarioRaw;
            dataAntecedente.append('tipo_usuario', tipoUsuario);

            // Archivo solo para el primer peticionario
            if (i === 1) {
                let archivo = $('#pdfEscritoi')[0]?.files[0];
                if (archivo) {
                    dataAntecedente.append('pdfEscritoi', archivo);
                }
            }

            peticionariosData.push(dataAntecedente);
        }

        let enviados = 0;
        let errores = 0;

        peticionariosData.forEach(function (formData) {
            $.ajax({
                type: 'POST',
                url: '/AltaExpediente/GuardarAntecedente',
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    enviados++;
                    if (res.status !== true) errores++;

                    if (enviados === peticionariosData.length) {
                        if (errores === 0) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Todos los datos se guardaron correctamente',
                                showConfirmButton: false,
                                timer: 2500
                            });
                            frmcompleto("#tab6"); // Indicador visual de formulario completo
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Algunos registros no se guardaron correctamente',
                                text: 'Verifica la información ingresada',
                                timer: 3000
                            });
                        }
                    }
                },
                error: function () {
                    errores++;
                    enviados++;
                    if (enviados === peticionariosData.length) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de red',
                            text: 'Hubo errores al guardar uno o más registros.'
                        });
                    }
                }
            });
        });
    });
    //bloque para actualiza e insertar antecedente
    //INSERTAR ANTECEDENTE 08/12/2025
    $(document).on('click', '#insertAntecedente', function () {
        let tablaReferencia = "ANTECEDENTE";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_ID', nombre: 'ID de expediente' },
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#Input_autoridadresp_C', nombre: 'Autoridad responsable' },
            { id: '#ExplicacionCedula', nombre: 'Explicación del Antecedente' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        let AntecedenteDatos = new FormData();

        // Campos del formulario
        AntecedenteDatos.append('tablaReferencia', 'ANTECEDENTE');
        AntecedenteDatos.append('Input_ID', $('#Input_ID').val());
        AntecedenteDatos.append('Input_folio_C', $('#Input_folio_C').val());
        AntecedenteDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        AntecedenteDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        AntecedenteDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        AntecedenteDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        AntecedenteDatos.append('Input_autoridadresp_C', $('#Input_autoridadresp_C').val());
        AntecedenteDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        AntecedenteDatos.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        AntecedenteDatos.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        AntecedenteDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        AntecedenteDatos.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        AntecedenteDatos.append('Input_Peticionario', $('#Input_Peticionario option:selected').text().trim());
        AntecedenteDatos.append('via_interposicion', $('#via_interposicion').val());

        // Documento
        AntecedenteDatos.append('documento', 'SI');

        // Datos personales
        AntecedenteDatos.append('edad', $('#edad').val() || '');
        AntecedenteDatos.append('genero', $('#genero').val() || '');
        AntecedenteDatos.append('tipo_usuario', $('#tipo_usuario').val() || '');
        AntecedenteDatos.append('sexo', $('#sexo').val() || '');


        // ID persona
        let idPersonas = $('#id_personas').val();
        if (idPersonas) {
            AntecedenteDatos.append('id_personas', idPersonas);
        } else {
            AntecedenteDatos.append('id_personas', 0);  // pendiente
        }

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //AntecedenteDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                AntecedenteDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS ANTECEDENTE", AntecedenteDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/InsertarCedula", "json", AntecedenteDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });



    // metodo updateAntecedente 27 10 2025
    $(document).on('click', '#updateAntecedente', function () {
        let tablaReferencia = "ANTECEDENTE";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_ID', nombre: 'ID de expediente' },
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#Input_autoridadresp_C', nombre: 'Autoridad responsable' },
            { id: '#ExplicacionCedula', nombre: 'Explicación del Antecedente' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        let AntecedenteDatos = new FormData();

        // Campos del formulario
        AntecedenteDatos.append('tablaReferencia', 'ANTECEDENTE');
        AntecedenteDatos.append('Input_ID', $('#Input_ID').val());
        AntecedenteDatos.append('Input_folio_C', $('#Input_folio_C').val());
        AntecedenteDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        AntecedenteDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        AntecedenteDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        AntecedenteDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        AntecedenteDatos.append('Input_autoridadresp_C', $('#Input_autoridadresp_C').val());
        AntecedenteDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        AntecedenteDatos.append('sedeRegistro_C', $('#sedeRegistro_C').val());
        AntecedenteDatos.append('sederegistro_desc_C', $('#sedeRegistro_C option:selected').text());
        AntecedenteDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        AntecedenteDatos.append('usuarioL', $('#usuarioL').text());

        // Peticionario
        AntecedenteDatos.append('Input_Peticionario', $('#Input_peticionario_C').val());

        // Documento
        AntecedenteDatos.append('documento', 'SI');

        // Datos personales
        let edad = $('#edad_petit-frmDatosPersonales1').val();
        AntecedenteDatos.append('edad', edad || '');
        let sexo = $('input[name="radsexo_petit-frmDatosPersonales1"]:checked').val();
        AntecedenteDatos.append('sexo', sexo || '');
        let genero = $('#genero_petit-frmDatosPersonales1').val();
        if (genero === 'Otro') {
            let otroGenero = $('#ogenero_petit-frmDatosPersonales1').val().trim();
            genero = otroGenero.length > 0 ? otroGenero : '';
        }
        AntecedenteDatos.append('genero', genero || '');
        let tipoUsuario = $('input[name="qatu_petit-frmDatosPersonales1"]:checked').val();
        AntecedenteDatos.append('tipo_usuario', tipoUsuario === 'Peticionario' ? 'Quejoso' : tipoUsuario || '');

        // ID persona
        AntecedenteDatos.append('id_personas', $('#id_personas').val() || '');

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //AntecedenteDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                AntecedenteDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS ANTECEDENTE", AntecedenteDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/GuardarEditarCedula", "json", AntecedenteDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo eliminar el peticionario.'
                });
            }
        });
    });

    //fin bloque

    /// Cris y David 21 07 2025: Metodo guardado de Alta de Aportacion
    $(document).on('click', '#saveAportacion', function () {
        let dataAportacion = new FormData();

        // Validacion campos no requeridos pero vacios - agrega un default
        let defaultAportacionText = 'No proporcionado';
        if (!$('#Input_autoridadresp').val()) {
            $('#Input_autoridadresp').val(defaultAportacionText);
        }

        // Concatenar Expediente y Año
        let expediente = $('#Input_ExpedienteAportacion').val();
        let año = $('#Input_year').val();
        let expedienteCompleto = expediente + '-' + año;  // Formato: expediente-año (ejemplo: 31265564-2025)

        // Llenar datos del formulario
        dataAportacion.append('Input_LugarHechos', $('#Input_LugarHechos').val());
        dataAportacion.append('Input_LugarHechosDescripcion', $('#Input_LugarHechos option:selected').text());
        dataAportacion.append('Input_FechaRecepcion', $('#Input_FechaRecepcion').val());
        dataAportacion.append('Input_HoraRecepcion', $('#Input_HoraRecepcion').val());
        dataAportacion.append('Input_NombrePetAportacion', $('#Input_NombrePetAportacion').val());
        dataAportacion.append('Input_autoridadresp', $('#Input_autoridadresp').val());
        dataAportacion.append('Input_ExpedienteAportacion', expedienteCompleto); // Agregar el expediente concatenado
        dataAportacion.append('JustificacionAportacion', $('#JustificacionAportacion').val());
        dataAportacion.append('sedeRegistroAportacion', $('#sedeRegistroAportacion option:selected').text());
        dataAportacion.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        dataAportacion.append('usuarioL', $('#usuarioL').text());

        let archivo = $('#pdfEscritoi')[0].files[0];
        if (archivo) {
            dataAportacion.append('pdfEscritoi', archivo);
        }

        // Validaciones de campos vacíos antes de enviar
        if (
            $('#JustificacionAportacion').val() === '' ||
            $('#Input_LugarHechos').val() === '' ||
            $('#Input_FechaRecepcion').val() === '' ||
            $('#Input_HoraRecepcion').val() === '' ||
            $('#Input_NombrePetAportacion').val() === '' ||
            $('#Input_ExpedienteAportacion').val() === '' ||
            $('#Input_year').val() === '' ||  // Validación del año
            $('#sedeRegistro').val() === ''
        ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para guardar debe llenar todos los datos necesarios',
                showConfirmButton: false,
                timer: 3000
            });
            frmincompleto("#tab5");
            return;
        }

        // Llamada al controlador para guardar
        $.ajax({
            type: 'POST',
            url: '/AltaExpediente/GuardarAportacion',
            data: dataAportacion,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status === true) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Información guardada Correctamente: ',
                        showConfirmButton: false,
                        timer: 2500
                    });
                    frmcompleto("#tab6");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al guardar',
                        text: res.mensaje || 'Error interno',
                        timer: 2000
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red o servidor',
                    text: xhr.responseText || 'Error desconocido'
                });
            }
        });
    });
    //bloque para actualizar e insertar aportaciones
    //INSERT APORTACION 08/12/2025
    $(document).on('click', '#insertAportacion', function () {
        let tablaReferencia = "APORTACION";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#Input_NombrePetAportacion_C', nombre: 'Nombre del peticionario' },
            { id: '#Input_ExpedienteAportacion_C', nombre: 'Expediente al que aporta' },
            { id: '#ExplicacionCedula', nombre: 'Explicación de la Aportacion' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' },
            { id: '#Input_year', nombre: 'Año' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        // Valores por defecto si están vacíos
        let defaultAportacionTexto = 'No proporcionado';
        if (!$('#Input_autoridadresp_C').val()) $('#Input_autoridadresp_C').val(defaultAportacionTexto);

        let AportacionDatos = new FormData();

        // Concatenar Expediente y Año
        let expediente = $('#Input_ExpedienteAportacion_C').val();
        let año = $('#Input_year').val();
        let expedienteCompleto = expediente + '-' + año;  // Formato: expediente-año (ejemplo: 31265564-2025)
        let idaport = $('#Id_Tipo').val(); // recupera el hidden




        // Campos del formulario
        AportacionDatos.append('tablaReferencia', 'APORTACION');
        AportacionDatos.append('Id_aportacion', $('#Input_IdAportacion_C').val()); // 🔑 enviar el id único
        AportacionDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        AportacionDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        AportacionDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        AportacionDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        AportacionDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        AportacionDatos.append('Input_Peticionario', $('#Input_NombrePetAportacion_C').val());
        AportacionDatos.append('Input_autoridadresp_C', $('#Input_autoridadresp_C').val());
        AportacionDatos.append('Input_ExpedienteAportacion_C', expedienteCompleto); // Agregar el expediente concatenado
        AportacionDatos.append('sedeRegistro_C', $('#sedeRegistro_C option:selected').text());
        AportacionDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        AportacionDatos.append('usuarioL', $('#usuarioL').text());

        // Documento
        AportacionDatos.append('documento', 'SI');

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //  AportacionDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                AportacionDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS APORTACION", AportacionDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/InsertarCedula", "json", AportacionDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo Insertar la aportacion'
                });
            }
        });
    });

    // metodo updateAportacion
    $(document).on('click', '#updateAportacion', function () {
        let tablaReferencia = "APORTACION";
        // Validación general: Se hace un arreglo de los campos con su nombre
        let campos = [
            { id: '#Input_LugarHechos_C', nombre: 'Lugar de los hechos' },
            { id: '#Input_FechaRecepcion_C', nombre: 'Fecha de recepción' },
            { id: '#Input_HoraRecepcion_C', nombre: 'Hora de recepción' },
            { id: '#Input_NombrePetAportacion_C', nombre: 'Nombre del peticionario' },
            { id: '#Input_ExpedienteAportacion_C', nombre: 'Expediente al que aporta' },
            { id: '#ExplicacionCedula', nombre: 'Explicación de la Aportacion' },
            { id: '#sedeRegistro_C', nombre: 'Sede de registro' },
            { id: '#Input_year', nombre: 'Año' }
        ];

        // Se buscan campos vacíos
        let camposFaltantes = campos
            .filter(campo => !$(campo.id).val() || $(campo.id).val().trim() === '')
            .map(campo => `• ${campo.nombre}`);

        // Si hay algun campo vacío se muestra una alerta añadiendo el campo faltante
        if (camposFaltantes.length > 0) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan campos obligatorios',
                html: `<br>${camposFaltantes.join('<br>')}`,
                showConfirmButton: true
            });
            frmincompleto("#tab2");
            return;
        }

        // Valores por defecto si están vacíos
        let defaultAportacionTexto = 'No proporcionado';
        if (!$('#Input_autoridadresp_C').val()) $('#Input_autoridadresp_C').val(defaultAportacionTexto);

        let AportacionDatos = new FormData();

        // Concatenar Expediente y Año
        let expediente = $('#Input_ExpedienteAportacion_C').val();
        let año = $('#Input_year').val();
        let expedienteCompleto = expediente + '-' + año;  // Formato: expediente-año (ejemplo: 31265564-2025)





        // Campos del formulario
        AportacionDatos.append('tablaReferencia', 'APORTACION');
        AportacionDatos.append('Id_aportacion', $('#Input_IdAportacion_C').val()); // 🔑 enviar el id único
        AportacionDatos.append('ExplicacionCedula', $('#ExplicacionCedula').val());
        AportacionDatos.append('Input_LugarHechos_C', $('#Input_LugarHechos_C').val());
        AportacionDatos.append('Input_LugarHechosDescripcion_C', $('#Input_LugarHechos_C option:selected').text());
        AportacionDatos.append('Input_FechaRecepcion_C', $('#Input_FechaRecepcion_C').val());
        AportacionDatos.append('Input_HoraRecepcion_C', $('#Input_HoraRecepcion_C').val());
        AportacionDatos.append('Input_Peticionario', $('#Input_NombrePetAportacion_C').val());
        AportacionDatos.append('Input_autoridadresp_C', $('#Input_autoridadresp_C').val());
        AportacionDatos.append('Input_ExpedienteAportacion_C', expedienteCompleto); // Agregar el expediente concatenado
        AportacionDatos.append('sedeRegistro_C', $('#sedeRegistro_C option:selected').text());
        AportacionDatos.append('select_viainterposicionc', $('#select_viainterposicionc option:selected').text());
        AportacionDatos.append('usuarioL', $('#usuarioL').text());

        // Documento
        AportacionDatos.append('documento', 'SI');

        // Archivo PDF
        //let archivo = $('#pdfEscritoi')[0]?.files[0];
        //if (archivo) {
        //  AportacionDatos.append('pdfEscritoi', archivo);
        //}
        let archivos = $('#pdfEscritoi')[0]?.files;
        if (archivos && archivos.length > 0) {
            for (let i = 0; i < archivos.length; i++) {
                AportacionDatos.append('pdfEscritoi', archivos[i]);
            }
        }
        console.log("PRUEBAS DATOS APORTACION", AportacionDatos);
        // Enviar al backend
        fetchPost("AltaExpediente/GuardarEditarCedula", "json", AportacionDatos, (resp) => {
            if (resp.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    Swal.fire({
                        text: 'Cargando Cedulas...',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    $.ajax({
                        type: "POST",
                        url: "TablaObtenerCedulas",
                        data: $('#frm_busquedorCedulas').serialize(),
                        dataType: "JSON",
                        success: function (response) {
                            console.log(response.data);
                            if (typeof mostrarTablaCedulas === 'function') {
                                mostrarTablaCedulas(response.data);
                            } else {
                                console.warn("mostrarTablaCedulas no está definida");
                            }
                            Swal.close();
                            $('#modalCedulas').modal('hide');
                        },
                        error: function (err) {
                            console.error("Error al obtener las cédulas:", err);
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al cargar las cédulas',
                                text: 'Intenta nuevamente más tarde'
                            });
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'No se pudo actualizar la aportacion'
                });
            }
        });
    });

    //fin bloque



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

        // Evento de pevisualizacion de pdf para Orientacion - nos lleva a los metodos de la rotativa mediante ese url
    $(document).on('click', "#OrientacionPDF", function () {
        let idExpediente = $("#Input_ID").val()?.trim();

        if (!idExpediente) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe ingresar primero un ID de expediente',
                timer: 2500
            });
            return;
        }

        const url = "/Expediente/Cedula_Orientacion?idescrito=" +
            encodeURIComponent(idExpediente);

        window.open(url, "_blank");


    });

        // Evento de pevisualizacion de pdf para Remision - nos lleva a los metodos de la rotativa mediante ese url
    $(document).on('click', "#RemisionPDF", function () {
        let idExpediente = $("#Input_ID").val()?.trim();

        if (!idExpediente) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe ingresar primero un ID de expediente',
                timer: 2500
            });
            return;
        }

        const url = "/Expediente/Cedula_Remision?idescrito=" +
            encodeURIComponent(idExpediente);

        window.open(url, "_blank");

    });

        //Evento de pevisualizacion de pdf para Incompetencia - nos lleva a los metodos de la rotativa mediante ese url
    $(document).on('click', "#IncompetenciaPDF", function () {
        let idExpediente = $("#Input_ID").val()?.trim();

        if (!idExpediente) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe ingresar primero un ID de expediente',
                timer: 2500
            });
            return;
        }

        const url = "/Expediente/Cedula_Incompetencia?idescrito=" +
            encodeURIComponent(idExpediente);

        window.open(url, "_blank");


    });

        // Evento de pevisualizacion de pdf para Antecedente - nos lleva a los metodos de la rotativa mediante ese url
    $(document).on('click', "#AntecedentePDF", function () {
        let idExpediente = $("#Input_ID").val()?.trim();

        if (!idExpediente) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe ingresar primero un ID de expediente',
                timer: 2500
            });
            return;
        }

        const url = "/Expediente/Cedula_Antecedente?idescrito=" +
            encodeURIComponent(idExpediente);

        window.open(url, "_blank");


    });

        // Evento de pevisualizacion de pdf para Aportacion - nos lleva a los metodos de la rotativa mediante ese url
    $(document).on('click', "#AportacionPDF", function () {

        const url = "/Expediente/Cedula_Aportacion";

        window.open(url, "_blank");

        // Recargar la página después de 5 segundos
        setTimeout(function () {
            location.reload();
        }, 15000);

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

    $(document).on('keypress', "#cpLH", function (e) { // se ejecuta al presionar tecla en #cpLH
        if (e.key === 'Enter') {
            e.preventDefault();

            // Sanitizar: solo dígitos y máximo 5
            var cp = ($("#cpLH").val() || '').replace(/\D+/g, '').slice(0, 5);
            $("#cpLH").val(cp);

            if (cp.length !== 5) {
                console.warn('CP inválido (debe ser 5 dígitos).');
                return;
            }

            $.getJSON("https://api.copomex.com/query/info_cp/" + cp + "?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
                if (!copomex || !copomex.response) {
                    console.warn('Sin datos para el CP proporcionado.');
                    return;
                }

                console.log(copomex.response);
                // Asegura que el input queda con el CP normalizado de la API
                $("#cpLH").val(copomex.response.cp || cp);

                // Llenar colonias/asentamientos en tu select
                // Asumo que CargaDatosSelect(selector, arregloStrings) ya limpia/agrega opciones
                var asentamientos = copomex.response.asentamiento || [];
                CargaDatosSelect('#coloniaLH', asentamientos);
            })
                .fail(function () {
                    console.log('Ha ocurrido un error al consultar Copomex');
                });
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

    $(document).on('click', '#icono_agregarI', function (event) {/*Evento del check, datos complementarios de la calle*/
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

function getIP(json) {
    document.write("Tu ip es: ", json.ip);
}

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



function validaVacios(formpapa, tipoelemento, elementoavalidar, elementoclick) {

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
        /*var vari9 = $("#edadPet" + nfrm).val()*/
        var vari9 = $("#edadPet" + nfrm).val();

        if (!vari9 || vari9.trim() === "" || vari9 === "No proporcionado") {
            vari9 = 0;
        } else {
            vari9 = parseInt(vari9);
        }
        // 🔥 IMPORTANTE: actualizar el input antes de enviar
        $("#edadPet" + nfrm).val(vari9);
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
            /*|| $("#origenPetval" + nfrm).val() == ''*/ || $("#edadPet" + nfrm).val() == '' || $("#sabeleerPet" + nfrm).val() == '' /*|| $("#escolaridad" + nfrm).val() == '' */ || $("#callePet" + nfrm).val() == ''
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
            //$("#CircunstanciasHechos").val(vari25);

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

                        if (!idenlaceformatos || idenlaceformatos == 0) {
                            console.log('se inserto enlace')
                            $('#id_actacgenerado' + nfrm).val(data.idActac);
                            /* let idescritook = $('#id_escritoigenerado').val() != '' ? $('#id_escritoigenerado').val() : 1;*/
                            let idescritook = $('#id_escritoigenerado' + nfrm).val() != ''
                                ? $('#id_escritoigenerado' + nfrm).val()
                                : 1;

                            let FrmEnFormatQueja = new FormData();
                            FrmEnFormatQueja.append('id_queja', $('.idquejagenerado').val());
                            FrmEnFormatQueja.append('id_escrito', idescritook);
                            FrmEnFormatQueja.append('id_actac', data.idActac);
                            FrmEnFormatQueja.append('id_peticionario', data.listat.idPet);
                            FrmEnFormatQueja.append('id_complementopet', data.listat.complementoPeticionario);
                            console.log({
                                id: data.listat.id,
                                idPet: data.listat.idPet,
                                complemento: data.listat.complementoPeticionario
                            });

                            fetchPost("Expediente/InsertEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {
                                if (resp.status) {

                                    $('#saveActaC').prop('disabled', true);

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
                            $('#id_actacgenerado' + nfrm).val(data.idActac);
                            let FrmEnFormatQueja = new FormData();
                            FrmEnFormatQueja.append('id_documento', data.idActac);
                            FrmEnFormatQueja.append('id_enlace', $('#idenlaceformatquejac' + nfrm).val());
                            FrmEnFormatQueja.append('documento', 'actac');
                            FrmEnFormatQueja.append('num_frm', nfrm);

                            fetchPost("Expediente/ActualizaEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {
                                if (resp.status) {

                                    $('#saveActaC').prop('disabled', true);

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
        /*  $('#origenPetval').val($("#origenPet" + nfrm + " option:selected").val());*/
        $('#origenPetval' + nfrm).val($("#origenPet" + nfrm + " option:selected").val());

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
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select class="' + clas + '" data-idfrmac="' + atributos + '" name="' + id + '" id="' + id + '" ' + tiposelect + '> <option value="99" selected disabled hidden>Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabel_UNO(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, clas = '', atributos = '') {

    let htmld = `
        <label for="${namelabel}">${textoLabel}</label>
        <select ${atributos}class="${clas}" name="${id}" id="${id}" ${tiposelect}></select>`;
    for (let v = 0; v < arreglo.length; v++) {
        if (arreglo[v].descripcion.trim().toLowerCase() === 'seleccione una opción') {
            continue;
        }
        htmld += `
            <option selected disabled hidden value="${arreglo[v].idSelect}">
                ${arreglo[v].descripcion}
            </option>
        `;
    }
    return htmld;
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
    let htmld = `
    <label for="${namelabel}" ${estiloLabel}>${textoLabel}</label>
    <select ${atributos} class="${clas}" id="${id}" ${tiposelect} ${estiloselect}></select>`;

    for (let v = 0; v < arreglo.length; v++) {
        htmld += `<option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>`;
    }

    return htmld;
}

// Corregi partes de, optimice el codigo retirando lineas como el 'case', ahora necesitas seleccionar ambas opciones para que te cargue el formulario correspondiente 28/03/2025 -Fred & cristobal
// reduccion a de codigo
// cambio 25/06/2025    

$(document).ready(function () {
    changeselects();
});

// David 12 08 2025: Cambios en los metodos relacionados con las personas fisicas y morales de la via de interposicion - abajo se describen
    //  Esta version de cambios para petit fisico - moral solo contempla un registro de petit, esta pendiente la implementacion final (formularios dinamicos)
function changeselects() {
    let valueVInterposicion = "";
    let tipoescrito = "";
    let tipoPeticionarioSeleccionado = null;

    const tabsPorDefault = ["#tab1", "#tab2", "#tab3", "#tab4"];

    // 🔹 Mostrar tabs específicos
    function mostrarTabs(tabs) {
        $("#tab1,#tab2,#tab3,#tab4").hide();
        tabs.forEach(tab => $(tab).show());
    }

    // 🔹 Limpiar selectTipoQueja
    function limpiarSelectTipoQueja() {
        $("#selectTipoQueja").val(null).trigger('change.select2');
        $('#selectTipoQueja').next('.select2-container').hide();
    }

    // 🔹 Limpiar selectTipoEscrito
    function limpiarSelectTipoEscrito() {
        $("#select_tipoescritoc").val(null).trigger('change.select2');
        tipoescrito = "";
    }

    // 🔹 Limpiar contenedor dependiente
    function limpiarDependeSeleccionado() {
        $('#contenedorDependeSeleccionado').empty();
    }

    // 🔹 Reiniciar dependencias
    function reiniciarDependencias() {
        limpiarSelectTipoQueja();
        limpiarDependeSeleccionado();
    }

    // 🔹 Asignar valores al selectTipoQueja
    function asignarValoresSelectTipoQueja(te, valores) {
        if (te == 1) {
            $("#selectTipoQueja").val(valores).trigger('change.select2');
            $('#selectTipoQueja').next('.select2-container').show();
        }
    }

    // 🔹 Crear formulario y asignar selectTipoQueja
    function crearFormulario(valor, te, valoresQueja = []) {
        if (valoresQueja.length === 0) {
            if (["1", "2", "3"].includes(valor)) {
                valoresQueja = [1, 2, 3, 4];
            } else if (["4", "5", "6", "7", "8"].includes(valor)) {
                valoresQueja = [1, 2, 4];
            }
        }

        CrearFormularioCrearEscrito(valor, te, valoresQueja);
        asignarValoresSelectTipoQueja(te, valoresQueja);

        if (["1", "2", "3"].includes(valor)) {
            mostrarTabs(tabsPorDefault);
            validaVacios("#frmFromatoQueja", "input", "", "");
            validaVacios("#frmFromatoQueja", "select", "", "");
            validaVacios("#frmFromatoQueja", "textarea", "", "");
        } else if (["4", "5", "6", "7", "8"].includes(valor)) {
            mostrarTabs(["#tab1", "#tab2", "#tab4"]);
        }
    }

    // 🔹 Swal Peticionario

    //// 🔹 Reemplazar input por select Morales
    //function reemplazarInputPorSelectMorales() {
    //    let $input = $('#nombre_petit-frmDatosPersonales1');
    //    let $select = $('<select></select>')
    //        .addClass('form-control eliminaformaes ob max-20 eliminaformaes')
    //        .attr({
    //            'data-idfrmit': '',
    //            'name': $input.attr('name'),
    //            'id': $input.attr('id'),
    //            'required': true
    //        });

    //    $.each(Morales, function (index, item) {
    //        $select.append($('<option></option>').val(item.idSelect).text(item.descripcion));
    //    });

    //    $input.replaceWith($select);
    //    $('.noproporcionado').prop('checked', true).trigger('change');
    //    $("#frmDatosPersonales1 input, #frmDatosPersonales1 select").prop("disabled", true);
    //    $("#nombre_petit-frmDatosPersonales1").prop("disabled", false);
    //    $("input[name='nombre_petitno-frmDatosPersonales1']").prop("hidden", true).prop("checked", false).trigger("change");
    //}

    // 🔹 Limpiar todo el formulario principal
    function limpiarFormularioCompleto() {
        const $form = $("#formularioaltaescritodqot");

        if ($form.length) {
            if ($form.is("form")) {
                // Si realmente es un <form>, usa reset()
                $form[0].reset();
            } else {
                // Si NO es un <form>, limpiamos manualmente todos los campos
                $form.find("input[type='text'], input[type='number'], input[type='date'], input[type='email'], textarea").val('');
                $form.find("input[type='checkbox'], input[type='radio']").prop('checked', false);
                $form.find("select").val(null).trigger('change.select2');
                $form.find("select").prop('selectedIndex', 0);
            }
        }

        // También limpia dependencias y tabs
        reiniciarDependencias();
        mostrarTabs([]); // Oculta todos
        console.log("🧹 Formulario limpiado completamente");
    }

    // 🔹 Ejecutar cuando cambie vía o escrito
    function ejecutarCambio() {
        reiniciarDependencias();
        limpiarSelectTipoQueja();

        if (!valueVInterposicion || !tipoescrito) return;

        crearFormulario(valueVInterposicion, tipoescrito);

        if (["6", "7"].includes(valueVInterposicion)) {
            manejarSwalPeticionario();
        }
    }

    // 🔹 EVENTOS
    $('#select_viainterposicionc').off('change').on('change', function () {
        valueVInterposicion = this.value;
        console.log("Vía de interposición cambiada:", valueVInterposicion);

        // 🔹 Reiniciar todo al cambiar vía
        limpiarFormularioCompleto();
        limpiarSelectTipoEscrito();

        ejecutarCambio();
    });

    $('#select_tipoescritoc').off('change').on('change', function () {
        tipoescrito = this.value;
        console.log("Escrito:", tipoescrito);
        ejecutarCambio();
    });
}

function manejarSwalPeticionario(nfin) {
    Swal.fire({
        title: 'Tipo de Peticionario(a)',
        html: `
            <label for="options">Selecciona una opción:</label>
            <select id="options" class="swal2-input">
                <option value="moral">Moral</option>
                <option value="fisica">Física</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        preConfirm: () => document.getElementById('options').value
    }).then((result) => {
        if (result.isConfirmed) {
            tipoPeticionarioSeleccionado = result.value;
            if (result.value === 'fisica') {
                /*mostrarTabs(["#tab1", "#tab2", "#tab4"]);*/
            } else if (result.value === 'moral') {
                // Aquí aplicamos los cambios sobre el bloque específicoEST
                reemplazarInputPorSelectNombre(nfin);
                deshabilitarCamposPersonales(nfin);
                rellenarCamposPorDefecto(nfin);
               /* mostrarTabs(["#tab1", "#tab2", "#tab4"]);*/
            }
        }
    });
}

// ============================ JM INICIO
// FUNCIONES DE MOSTRAR/OCULTAR
// ============================
function mostrarPestaniaPorValor(valor) {
    switch (String(valor)) {
        case '1': $("#tab1").show(); break; // Datos Personales
        case '2': $("#tab2").show(); break; // Escrito Inicial
        case '3': $("#tab3").show(); break; // Acta Circunstanciada
        case '4': $("#tab4").show(); break; // Datos Complementarios
    }
}

function ocultarPestaniaPorValor(valor) {
    switch (String(valor)) {
        case '1': $("#tab1").hide(); break;
        case '2': $("#tab2").hide(); break;
        case '3': $("#tab3").hide(); break;
        case '4': $("#tab4").hide(); break;
    }
}

// ============================
// SINCRONIZA PESTAÑAS CON SELECT
// ============================
function syncTabsWithSelect() {
    $("#tab1, #tab2, #tab3, #tab4").hide(); // Oculta todas
    const valores = $("#selectTipoQueja").val() || [];
    valores.forEach(v => mostrarPestaniaPorValor(v));
}

// ============================
// EVENTOS SELECT2
// ============================

// Cuando se selecciona una opción
$(document).on('select2:select', '#selectTipoQueja', function (e) {
    const valor = e.params.data.id;

    // 🚫 Evita seleccionar la opción "Selecciona una opción"
    if (valor === "" || valor === "0") {
        // La quita inmediatamente
        $(this).find('option[value=""]').prop('selected', false);
        $(this).trigger('change.select2');
        return;
    }

    mostrarPestaniaPorValor(valor);
});

// Cuando se deselecciona una opción (clic en la X)
$(document).on('select2:unselect', '#selectTipoQueja', function (e) {
    const valor = e.params.data.id;
    ocultarPestaniaPorValor(valor);
});

// Si algo cambia fuera de los eventos select2 (por .val().trigger('change'))
$(document).on('change', '#selectTipoQueja', function () {
    syncTabsWithSelect();
});

// ============================
// LLAMAR DESPUÉS DE REGENERAR FORMULARIO
// ============================
// Ejemplo: al final de CrearFormularioCrearEscrito(...)
function despuesDeCrearFormulario() {
    // Re-sincroniza pestañas con lo que esté seleccionado
    syncTabsWithSelect();

    // Si usas placeholder en Select2, asegúrate de definirlo así:
    $('#selectTipoQueja').select2({
        placeholder: 'Selecciona una opción',
        allowClear: true
    });
}
// ============================JM FIN
function mostrarSelectorTipoPeticionario(callback) {
    Swal.fire({
        title: 'Tipo de Peticionario(a)',
        html: `
            <label for="options">Selecciona una opción:</label>
            <select id="options" class="swal2-input">
                <option value="opcion1">Moral</option>
                <option value="opcion2">Física</option>
            </select>`,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        preConfirm: () => document.getElementById('options').value
    }).then((result) => {
        if (result.isConfirmed) {
            callback(result.value);
        }
    });
}

function prepararFormularioTipoPeticionario(tipo) {
    // Si el formulario esta cargado solo se deshabilitaran/habilitaran los labels
    if ($('#formularioaltaescritodqot').children().length === 0) {
        const formPetit = formPeticionario(1); // Formulario de datos personales

        // Si es físico o moral, se agrega el formulario correspondiente
        if (tipo === 'opcion2') {
            $('#formularioaltaescritodqot').append(formularioFisica);
        } else {
            $('#formularioaltaescritodqot').append(formularioMoral);
        }

        $('#ref-frm-frmDatosPersonales1').append(formPetit);
        $('#frm_altaqueja').append(traeInformacionDatosComplementarios);
    }
    // Checamos que los campos están deshabilitados correctamente
    deshabilitarCamposPersonales();
    reemplazarInputPorSelectNombre();
    rellenarCamposPorDefecto();
}


function reemplazarInputPorSelectNombre(nfin) {
    const $input = $('#nombre_petit-frmDatosPersonales' + nfin);
    console.log("Reemplazando input en bloque:", nfin, "Elemento encontrado:", $input.length);

    if ($input.length === 0) return; // si no existe, salir

    const $select = $('<select></select>')
        .addClass('form-control eliminaformaes ob max-20 eliminaformaes')
        .attr({
            'data-idfrmit': '',
            'name': $input.attr('name'),
            'id': $input.attr('id'),
            'required': true
        });

    $.each(Morales, function (index, item) {
        $select.append($('<option></option>').val(item.idSelect).text(item.descripcion));
    });

    $input.replaceWith($select);
}

function deshabilitarCamposPersonales(nfin) {
    const prefix = "#frmDatosPersonales" + nfin;
    $(prefix + " input[type='checkbox'].noproporcionado")
        .prop("disabled", true).prop('checked', true).trigger('change');
    $(prefix + " input[type='text'], " + prefix + " input[type='radio'], " + prefix + " input[type='date'], " + prefix + " select")
        .prop("disabled", true);
    $("#nombre_petit-frmDatosPersonales" + nfin).prop("disabled", false);
    $("input[name='nombre_petitno-frmDatosPersonales" + nfin + "']")
        .prop("hidden", true).prop("checked", false).trigger("change");
}

function rellenarCamposPorDefecto(nfin) {
    $("#colonia_petit-frmDatosPersonales" + nfin).val('No proporcionado');
    $("#ciudad_petit-frmDatosPersonales" + nfin).val('No proporcionado');
    $("#genero_petit-frmDatosPersonales" + nfin).val('No proporcionado');
    $("#escosel_petit-frmDatosPersonales" + nfin).val(14);
    $("#econyugal_petit-frmDatosPersonales" + nfin).val(8);
    $("#ocupacion_petit-frmDatosPersonales" + nfin).val(9);
    $("#discapacidad_petit-frmDatosPersonales" + nfin).val(7);
    $("#gsoci_petit-frmDatosPersonales" + nfin).val(9);
    $("#leindi_petit-frmDatosPersonales" + nfin).val('No');
    $("#idQuejoso" + nfin + ", #idNosexo" + nfin + ", #idNoGenero" + nfin + ", #idNopSabeLeer" + nfin)
        .prop("checked", true);
    $("#edad_petit-frmDatosPersonales" + nfin).val('');
}

function CrearFormularioCrearEscrito(vinterpoiscion, tescrito, arregloSelects) {
    console.log("Entró a la creación del formulario de quejas");

    const visibilidadTabs = {
        1: arregloSelects.includes(1),
        2: arregloSelects.includes(2),
        3: arregloSelects.includes(3),
        4: arregloSelects.includes(4)
    };

    // 25 05 2025 Cris y David: 

    const formPetit = formPeticionario(1);
    const formularios = {
        1: formularioqueja,
        2: formulariorientacion,
        3: formularioRemsion,
        4: formularioIncompetencia,
        5: formularioAntecedente,
        6: formularioAportacion,
    };

    if (!formularios[tescrito]) return;

    $('.eliminaformaes').remove();
    $('#formularioaltaescritodqot').empty();
    $('#formularioaltaescritodqot').append(formularios[tescrito]);

    //$('#ref-frm-frmDatosPersonales1').append(formPetit);
    if ($('#ref-frm-frmDatosPersonales1').children().length === 0) {
        const formPetit = formPeticionario(1);
        $('#ref-frm-frmDatosPersonales1').append(formPetit);
    }
    $('#divformularioEscritoInicial').append(formEscritoInicial2('#', 'frmFromatoQueja'));
    $('#divformularioActaCircunstanciada').append(formActacircunstanciada2c(1));
    $('#divformularioOrientacion').append(formOrientacion('#', 'formularioAltaOrientacion'));
    //$('#divformularioremision').append(formRemision('#', 'formularioremision'));
    $('#divformularioremision').append(formRemision('#', 'formularioremision', 2));
    cargarSelectAbogados(2);    // David 17 07 2025: Cambio para ver la lista de abogados
    $('#divformularioIncompetencia').append(formIncompetencia('#', 'formularioIncompetencia', 3));
    cargarSelectAbogados(3);    // David 17 07 2025: Cambio para ver la lista de abogados
    $('#divformularioAntecedente').append(formAntecedente('#', 'formularioAntecedente'));
    $('#divformularioaportacion').append(formAportacion('#', 'formularioaportacion'));
    cargarSedes("#sedeRegistroAportacion"); // David 21 07 2025 Carga las sedes para el id del select de Aportacion

    $('#frm_altaqueja').append(traeInformacionDatosComplementarios);

    mostrarTabs(visibilidadTabs);

    CargaDatosSelecAutori("#catAutoridad1", SelAutoridad);
    funcionesGeneralesFormulario();
    $('#Input_autoridades, #Input_autoridades1').select2();
    $(".origenPetExt, .origenPetExtedo").hide();
}



// David 21 07 2025: Metodo para cargar las sedes mediante el controlador ObtenerListaSedes, pensado para funcionar con el form de Aportacion
function cargarSedes(selectorSede) {
    $.ajax({
        type: "GET",
        url: "/AltaExpediente/ObtenerListaSedes",
        dataType: "json",
        success: function (response) {
            // Vacía el select y carga los datos en el select indicado
            $(selectorSede).empty();
            CargaDatosSelectOtro_(selectorSede, response.lista_sedes, null);
        },
        error: function () {
            console.error("No se pudo cargar la lista de sedes");
        }
    });
}

    // David 17 07 2025 Nueva funcion para la  carga de la lista completa de abogados en el select de los formularios
function cargarSelectAbogados(idFrm) {
    fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
        let lista = data.lista3;
        //console.log('Lista de abogados:', lista);

        const $select = $('#nomAbogado' + idFrm);
        const $hidden = $('#idabogado' + idFrm);
        const idActual = $('#idusuario').val();

        if (!$select.length) {
            console.warn('No se encontró el select #nomAbogado' + idFrm);
            return;
        }

        // Limpiar y cargar opciones
        $select.empty();
        $select.append('<option value="">Seleccione abogado</option>');

        lista.forEach(item => {
            const selected = item.idSelectGenerico == idActual ? 'selected' : '';
            $select.append(`<option value="${item.idSelectGenerico}" ${selected}>${item.descripcion}</option>`);
        });

        // Inicializar/refrescar Select2
        if ($select.hasClass('select2-hidden-accessible')) {
            $select.select2('destroy');
        }

        $select.select2({ width: '100%' });

        $hidden.val(idActual);
    });
}

function mostrarTabs(visibilidad) {
    const tabIds = {
        1: "#tab1",
        2: "#tab2",
        3: "#tab3",
        4: "#tab4"
    };

    Object.entries(tabIds).forEach(([key, selector]) => {
        visibilidad[key] ? $(selector).show() : $(selector).hide();
    });
}

function funcionesGeneralesFormulario() {
    addPeticionarios();
    guardarDatosPeticionarios();
    chkNoproporcinado();
    seltxt();
    keypresscp();
    buscapeticionariocurpnom();
    funcionesEscritoi();
    addActacir();
    funcionesActac(1);
    Carga_Informacion_selec_quejas(1);
}


/////////////////////////////////////////////////////////////
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
                            // Normaliza CP por si llega con espacios/guiones
                            var cp = (response.data[0].codigoPostal || '').replace(/\D+/g, '').slice(0, 5);
                            $("#cp_petit-frmDatosPersonales" + idform).val(cp);

                            let estado = '';
                            let municipio = '';

                            $.getJSON(
                                "https://api.copomex.com/query/info_cp/" + cp + "?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee",
                                function (copomex) {
                                    if (!copomex || !copomex.response) {
                                        console.warn('No se encontraron datos para el CP.');
                                        return;
                                    }

                                    estado = copomex.response.estado || '';
                                    municipio = copomex.response.municipio || '';

                                    $("#municipio_petit-frmDatosPersonales" + idform).val(municipio);
                                    $("#estado_petit-frmDatosPersonales" + idform).val(estado);
                                    $("#cp_petit-frmDatosPersonales" + idform).val(copomex.response.cp || cp);

                                    // Colonias / asentamientos
                                    var asentamientos = copomex.response.asentamiento || [];
                                    AgregarOptionSelect(
                                        idform,
                                        'deloptioncolonia',
                                        '#colonia_petit-frmDatosPersonales' + idform,
                                        asentamientos
                                    );
                                }
                            ).done(function () {

                                // Evita la consulta si estado/municipio quedaron vacíos
                                if (!estado || !municipio) {
                                    console.warn('Estado/Municipio vacíos; se omite consulta de localidades.');
                                    return;
                                }

                                $.getJSON(
                                    "https://api.copomex.com/query/get_localidad_por_estado_municipio/?" +
                                    "estado=" + encodeURIComponent(estado) +
                                    "&municipio=" + encodeURIComponent(municipio) +
                                    "&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee",
                                    function (copomex2) {
                                        if (!copomex2 || !copomex2.response || !copomex2.response.localidad_clave) {
                                            console.warn('No se encontraron localidades para el estado/municipio proporcionados.');
                                            return;
                                        }
                                        var localidades = Object.keys(copomex2.response.localidad_clave);
                                        AgregarOptionSelect(
                                            idform,
                                            'deloptionloca',
                                            '#ciudad_petit-frmDatosPersonales' + idform,
                                            localidades
                                        );
                                    }
                                ).done(function () {
                                    // Restaura valores del registro como en tu flujo original
                                    $("#estado_petit-frmDatosPersonales" + idform).val(response.data[0].estado || estado);
                                    $("#municipio_petit-frmDatosPersonales" + idform).val(response.data[0].municipio || municipio);
                                    $("#colonia_petit-frmDatosPersonales" + idform).val(response.data[0].colonia || '');
                                    $("#ciudad_petit-frmDatosPersonales" + idform).val(response.data[0].ciudad || '');

                                    $("#colonia_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                                    $("#ciudad_petit-frmDatosPersonales" + idform).selectpicker('refresh');

                                }).fail(function () {
                                    console.log('Ha ocurrido un error en obtener las localidades');
                                });

                            }).fail(function () {
                                console.log('Ha ocurrido un error al obtener datos de un CP');
                            });
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
// David 12 08 2025: Cambios en los metodos relacionados con las personas fisicas y morales de la via de interposicion - abajo se describen
//  Esta version de cambios para petit fisico - moral solo contempla un registro de petit, esta pendiente la implementacion final (formularios dinamicos)

// Ricardo 03 09 2025: Cambios para mostrar labels de peticionarios(petit) como "no proporcionados" en todos los formularios.
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
        console.log(nfin);

        if ($('#idcomplementopet' + npmax).val() != '' && $('#idpeticionarioi' + npmax).val() != '') {
            NuevoNavHrzPeticionario(nfin);
            guardarDatosPeticionarios();
            chkNoproporcinado();
            seltxt();
            keypresscp();
            buscapeticionariocurpnom();

            let valueVInterposicion = $('#select_viainterposicionc').val();
            console.log("valueVInterposicion actual:", valueVInterposicion);

            if (["6", "7"].includes(valueVInterposicion)) {
                manejarSwalPeticionario(nfin);
            }


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
// David 12 08 2025: Cambios en los metodos relacionados con las personas fisicas y morales de la via de interposicion - abajo se describen
//  Esta version de cambios para petit fisico - moral solo contempla un registro de petit, esta pendiente la implementacion final (formularios dinamicos)
//function changeselects() {
//    //let valueVInterposicion = "";
//    //let tipoescrito = "";

//    function validarYCrearFormulario() {
//        if (valueVInterposicion && tipoescrito) {
//            CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito, [1, 2, 3, 4, 5]);
//        }
//    }

//    $('#select_viainterposicionc').on('change', function () {
//        valueVInterposicion = this.value;
//        console.log("Valor de select_viainterposicionc:", valueVInterposicion);
//        validarYCrearFormulario();

//        if (valueVInterposicion === "6" || valueVInterposicion === "7") {
//            $("#selectTipoQueja").val([1, 2, 4]).trigger('change.select2');

//            mostrarSelectorTipoPeticionario(tipoSeleccionado => {

//                // Guarda el tipo de persona fisica o moral para usar como identificador adelante
//                tipoPeticionarioSeleccionado = tipoSeleccionado;

//                // Solo ejecuta el metodo de preparación si el tipo de escrito ya está seleccionado
//                if (tipoescrito) {
//                    prepararFormularioTipoPeticionario(tipoSeleccionado);
//                }
//            });
//        } else {
//            $('#formularioaltaescritodqot').empty();
//        }
//    });

//    $('#select_tipoescritoc').on('change', function () {
//        tipoescrito = this.value;
//        console.log("Valor de select_tipoescritoc:", tipoescrito);
//        validarYCrearFormulario();
//        // Si ya se eligio vía entonces hace una validacion y si se tiene el tipo peticionario, ejecuta la preparación
//        if ((valueVInterposicion === "6" || valueVInterposicion === "7") && tipoPeticionarioSeleccionado) {
//            prepararFormularioTipoPeticionario(tipoPeticionarioSeleccionado);
//        }

//    });
//}


//function mostrarSelectorTipoPeticionario(callback) {
//    Swal.fire({
//        title: 'Tipo de Peticionario(a)',
//        html: `
//            <label for="options">Selecciona una opción:</label>
//            <select id="options" class="swal2-input">
//                <option value="opcion1">Moral</option>
//                <option value="opcion2">Física</option>
//            </select>`,
//        showCancelButton: true,
//        confirmButtonText: 'Aceptar',
//        preConfirm: () => document.getElementById('options').value
//    }).then((result) => {
//        if (result.isConfirmed) {
//            callback(result.value);
//        }
//    });
//}

//function prepararFormularioTipoPeticionario(tipo, numFormulario = 1) {
//    const refContenedor = `#ref-frm-frmDatosPersonales${numFormulario}`;
//    const idFormulario = `#frmDatosPersonales${numFormulario}`;

//    // Verificar si el contenedor del formulario de peticionario ya tiene contenido
//    if ($(refContenedor).children().length === 0) {
//        const formPetit = formPeticionario(numFormulario); // Formulario dinámico

//        // Insertar el formulario dinámico en su contenedor específico
//        $(refContenedor).append(formPetit);

//        // Insertar el formulario correspondiente a tipo físico/moral (solo si es el primer formulario)
//        if (numFormulario === 1) {
//            if (tipo === 'opcion2') {
//                $('#formularioaltaescritodqot').append(formularioFisica);
//            } else {
//                $('#formularioaltaescritodqot').append(formularioMoral);
//            }

//            $('#frm_altaqueja').append(traeInformacionDatosComplementarios);
//        }
//        deshabilitarCamposPersonales(numFormulario);
//        reemplazarInputPorSelectNombre(numFormulario);
//        rellenarCamposPorDefecto(numFormulario);
//    }
//    deshabilitarCamposPersonales(numFormulario);
//    reemplazarInputPorSelectNombre(numFormulario);
//    rellenarCamposPorDefecto(numFormulario);

//}



function reemplazarInputPorSelectNombre(numFormulario = 1) {
    const idInput = `#nombre_petit-frmDatosPersonales${numFormulario}`;
    const $input = $(idInput);

    //verificar que exista el input antes de reemplazar
    if ($input.length === 0) return;

    const $select = $('<select></select>')
        .addClass('form-control eliminaformaes ob max-20 eliminaformaes')
        .attr({
            'data-idfrmit': '',
            'name': $input.attr('name'),
            'id': $input.attr('id'),
            'required': true
        });

    $.each(Morales, function (index, item) {
        $select.append($('<option></option>').val(item.idSelect).text(item.descripcion));
    });

    $input.replaceWith($select);
}

function deshabilitarCamposPersonales(numFormulario = 1) {
    const formPrefix = `#frmDatosPersonales${numFormulario}`;
    $(`${formPrefix} input[type='checkbox'].noproporcionado`).prop("disabled", true).prop('checked', true).trigger('change');
    $(`${formPrefix} input[type='text'], ${formPrefix} input[type='radio'], ${formPrefix} input[type='date'], ${formPrefix} select`).prop("disabled", true);

    $(`#nombre_petit-frmDatosPersonales${numFormulario}`).prop("disabled", false);
    $(`input[name='nombre_petitno-frmDatosPersonales${numFormulario}']`).prop("hidden", true).prop("checked", false).trigger("change");
}


function rellenarCamposPorDefecto(numFormulario = 1) {
    const prefix = `#frmDatosPersonales${numFormulario}`;

    console.log("Ejecutando rellenarCamposPorDefecto para:", numFormulario);

    $(`${prefix} #colonia_petit-frmDatosPersonales${numFormulario}`).val('No proporcionado');
    $(`${prefix} #ciudad_petit-frmDatosPersonales${numFormulario}`).val('No proporcionado');
    $(`${prefix} #genero_petit-frmDatosPersonales${numFormulario}`).val('No proporcionado');
    $(`${prefix} #escosel_petit-frmDatosPersonales${numFormulario}`).val(14);
    $(`${prefix} #econyugal_petit-frmDatosPersonales${numFormulario}`).val(8);
    $(`${prefix} #ocupacion_petit-frmDatosPersonales${numFormulario}`).val(9);
    $(`${prefix} #discapacidad_petit-frmDatosPersonales${numFormulario}`).val(7);
    $(`${prefix} #gsoci_petit-frmDatosPersonales${numFormulario}`).val(9);
    $(`${prefix} #leindi_petit-frmDatosPersonales${numFormulario}`).val('No');
    $(`${prefix} #idQuejoso, ${prefix} #idNosexo, ${prefix} #idNoGenero, ${prefix} #idNopSabeLeer`).prop("checked", true);
    // David 19 08 2025: Relleno del campo de edad por un vacio - evita que se guarde No proporcionado
    $(`${prefix} #edad_petit-frmDatosPersonales${numFormulario}`).val('00');
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

// btn Imprimir registro datos personales David Y Cris 2/06/25
// Correccion btn imprimir: 1) Vertificacion del frame, sino existe se crea. 2) seleccion y carga de plantilla. 
//3) Cambios del blopque de estructura del AJAX (datos y checkbox). 4) Nueva funcion para marcar visualmente los cehckbox
function btnGenerapdfp(element) {
    const idform = element.dataset.idform;

    // Verifica si el iframe ya existe
    let iframe = document.getElementById('frame');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    // Cargar la plantilla en el iframe
    iframe.src = './PlantillaDPeticionario';
    iframe.onload = function () {
        const doc = iframe.contentWindow.document;
        const html = doc.all;

        const idcomplemento = $("#idcomplementopet" + idform).val();
        const curpd = $("#CURP_petit-frmDatosPersonales" + idform).val();
        const nombrep = $("#nombre_petit-frmDatosPersonales" + idform).val();
        const apellidope = $("#apellidop_petit-frmDatosPersonales" + idform).val();
        const apellidome = $("#apellidom_petit-frmDatosPersonales" + idform).val();

        const fechaActual = new Date();
        const fechTxt = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}`;

        if (!idcomplemento || (!curpd && (!nombrep || !apellidope || !apellidome))) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Complete la CURP o el nombre completo del peticionario',
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
                if (!response.data.length) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Datos no encontrados, verifique la CURP o el nombre del peticionario',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }

                const data = response.data[0];
                if (html.dateact) html.dateact.textContent = fechTxt;

                // Textos básicos
                html.txtNombre.textContent = data.nombre || '';
                html.txtApaterno.textContent = data.apellidoPat || '';
                html.txtAmaterno.textContent = data.apellidoMat || '';
                html.txtCalle.textContent = data.calle || '';
                html.numExt.textContent = data.numExterior || '';
                html.numInt.textContent = data.numInterior || '';
                html.txtColonia.textContent = data.colonia || '';
                html.txtCiudadloc.textContent = data.ciudad || '';
                html.txtMunicipio.textContent = data.municipio || '';
                html.txtEstado.textContent = data.estado || '';
                html.txtCp.textContent = data.codigoPostal || '';
                html.txtTelefono.textContent = data.telefono || '';
                html.txtEdad.textContent = data.edad || '';
                html.txtEmail.textContent = data.email || '';

                html.txtOtroGenero.textContent = data.otroGenero || '';
                html.txtOtraLengiai.textContent = data.lenguaIndigena || '';
                html.txtOtroGsoc.textContent = data.otroGsocial || '';
                html.txtOrigenmig.textContent = data.origenMigrante || '';
                html.txtDestinomig.textContent = data.destinoMigrante || '';

                // Fecha de nacimiento
                if (html.txtFechaNaci) {
                    if (data.fechaNacimiento.includes('1900-01-01')) {
                        html.txtFechaNaci.textContent = 'No proporcionado';
                        html.txtFechaNaci.style.fontStyle = 'italic';
                    } else {
                        html.txtFechaNaci.textContent = moment(new Date(data.fechaNacimiento).toISOString().split("T")[0]).format('DD/MM/YYYY');
                    }
                }

                // === Marcar checkboxes ===
                marcarGrupo(doc, 'chkSexo', data.fkSexo);
                marcarGrupo(doc, 'chkGenero', data.genero);
                marcarGrupo(doc, 'chkEscolaridad', data.fkEscolaridad);
                marcarGrupo(doc, 'chkEstadocon', data.fkEstadoConyugal);
                marcarGrupo(doc, 'chkOcupacion', data.fkOcupacion);
                marcarGrupo(doc, 'chkNacionalidad', data.nacionalidad);
                marcarGrupo(doc, 'chkSabeleer', data.sabeLeer);
                marcarGrupo(doc, 'chkDispacacidad', data.fkDiscapacidad);
                marcarGrupo(doc, 'chkGsocial', data.fkGrupoSocial);
                marcarGrupo(doc, 'chkHablali', data.hablaLenguai);
                marcarGrupo(doc, 'chkTipoaq', data.tipoUsuario);
                marcarGrupo(doc, 'chkPrimeravm', data.primeravmexMigrante);
                marcarGrupo(doc, 'chkViolenmuj', data.violenciaVm);

                if (data.violenciaVm == 1) {
                    html.txtCanalizacionvm.textContent = data.canalizacionVm || '';
                    html.txtIngresosmens.textContent = '$' + (data.ingresosMensuales || '0');
                    marcarGrupo(doc, 'chkEmbarazada', data.embarazadaVm);
                    marcarGrupo(doc, 'chkSinhijos', data.fkHijosVivos);
                    marcarGrupo(doc, 'chkModalidadv', data.fkModalidadViolencia);
                    marcarGrupo(doc, 'chkTipov', data.fkTipoViolencia);
                    marcarGrupo(doc, 'chkRelacionAgr', data.fkRelacionAgresor);
                }

                // Deshabilitar todos los checkboxes
                doc.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.disabled = true);

                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            }
        });
    };
}


// 4) Nueva función agregada al btn auxiliar para marcar checkboxes  visualmente en el pdf - 04062025
function marcarGrupo(doc, groupName, valor) {
    const checkboxes = doc.getElementsByName(groupName);
    if (!checkboxes.length) return;
    checkboxes.forEach(cb => {
        cb.checked = cb.value == valor;
    });
}

////
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

// Buscar informacion sobre cp; Cambio de aceptacion de la solicitud de las APIS usando el Token, mensajes de alertas al buscar un CP y cambio de la posisión de de los datos en otro orden 19/03/2025 - Fred
function keypresscp() {
    $(document).on('input', ".buscacp", function () {
        let codigoPostal = this.value.trim();
        let idfrm = this.dataset.idfrmit;

        if (codigoPostal.length === 5 && !isNaN(codigoPostal)) {
            // Primera petición: obtener estado, municipio y colonias
            $.getJSON(`https://api.copomex.com/query/info_cp/${codigoPostal}?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee`)
                .done(function (copomex) {
                    if (!copomex.response) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se encontraron datos para este código postal.',
                            confirmButtonColor: '#d33'
                        });
                        return;
                    }

                    let estado = copomex.response.estado || '';
                    let municipio = copomex.response.municipio || '';

                    $("#municipio_petit-frmDatosPersonales" + idfrm).val(municipio);
                    $("#estado_petit-frmDatosPersonales" + idfrm).val(estado);
                    $("#cp_petit-frmDatosPersonales" + idfrm).val(codigoPostal);

                    AgregarOptionSelect(idfrm, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idfrm, copomex.response.asentamiento);

                    // Segunda petición: obtener localidades
                    $.getJSON(`https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=${estado}&municipio=${municipio}&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee`)
                        .done(function (copomexLocalidad) {
                            if (!copomexLocalidad.response) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Sin Localidades',
                                    text: 'No se encontraron localidades para este estado y municipio.',
                                    confirmButtonColor: '#3085d6'
                                });
                                return;
                            }

                            let localidades = Object.keys(copomexLocalidad.response.localidad_clave);
                            AgregarOptionSelect(idfrm, 'deloptionloca', '#ciudad_petit-frmDatosPersonales' + idfrm, localidades);
                        })
                        .fail(function () {
                            console.log('Error al obtener las localidades');
                        });
                })
                .fail(function () {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron obtener los datos del código postal.',
                        confirmButtonColor: '#d33'
                    });
                });
        } else if (codigoPostal.length > 5) {
            this.value = codigoPostal.slice(0, 5); // Limita a 5 caracteres
        }
    });
}




function formPeticionario(idformulario) {
    const selectorPais = `#migorig_petit-frmDatosPersonales${idformulario}`;
    const selectorEstado = `#migdesti_petit-frmDatosPersonales${idformulario}`;

    let frmDatosPersonales = crearForumulario(
        {
            idformulario: "frmDatosPersonales" + idformulario,
            numForm: idformulario
        },
        {//Formulario para el "Alta de escrito inicial" cambio de posision 17/03/2025 - Fred
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
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "estado_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
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
                        required: 'required oninput="validaNumeroKeyPress(this)" maxlength="3"',
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
                        typechk: "chkx",
                        maxlength: "10"
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
    cargarPais(selectorPais);
    cargarEstado(selectorEstado);

    return frmDatosPersonales;
}
//17/12/2025
function cargarPais(selectorPais) {
    $.ajax({
        type: "GET",
        url: "/AltaExpediente/ObtenerListaPaises",
        dataType: "json",
        success: function (response) {
            // Vacía el select y carga los datos en el select indicado
            $(selectorPais).empty();
            CargaDatosSelectOtro_(selectorPais, response.lista_paises, null);
        },
        error: function () {
            console.error("No se pudo cargar la lista de paises");
        }
    });
}

function cargarEstado(selectorEstado) {
    $.ajax({
        type: "GET",
        url: "/AltaExpediente/ObtenerListaEstados",
        dataType: "json",
        success: function (response) {
            // Vacía el select y carga los datos en el select indicado
            $(selectorEstado).empty();
            CargaDatosSelectOtro_(selectorEstado, response.lista_estados, null);
            console.log("listaestados", response.lista_estados)
        },
        error: function () {
            console.error("No se pudo cargar la lista de estados");
        }
    });
}

//fin bloque
// se le puso un limite de caracteres al edad  23/05/2025 Cris
function validaNumeroKeyPress(input) {
    if (input.name.startsWith("edad_petit-frmDatosPersonales")) {
        input.value = input.value.replace(/\D/g, '').slice(0, 3);
    } else {
        input.value = input.value.replace(/\D/g, ''); // Solo limpia no números
    }
}

// se le puso un limite de caracteres del telefono 23/05/2025 Cris
function validaNumeroKeyPress(input) {
    if (input.name.startsWith("telefono_petit-frmDatosPersonales")) {
        input.value = input.value.replace(/\D/g, '').slice(0, 10);
    } else {
        input.value = input.value.replace(/\D/g, ''); // Solo limpia no números
    }
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

//  David 01 09 2025 Nuevo metodo: Actualiza el campo de tipo de escrito dado el id de expediente y el tipo de escrito seleccionado
function insertarTipoEscrito(idExpediente, tipoescrito) {
    if (!idExpediente || !tipoescrito) {
        console.warn("❗ Falta idExpediente o tipoescrito");
        return;
    }

    $.ajax({
        type: "POST",
        url: '/Expediente/InsertarTipoEscrito',
        data: {
            idExpediente: idExpediente,
            tipo: tipoescrito
        },
        dataType: "json",
        success: function (response) {
            if (response.status) {
                console.log("Tipo escrito insertado correctamente.");
            } else {
                console.error("Error del servidor:", response.mensaje);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error AJAX:", error);
        }
    });
}

// [Modificado] Ricardo 12-09-2025:  El nombre del peticionario se guardaba vacío en formularios 2+, ahora ya en el select del Alta se guardan todos los nombres
// Se estaba obteniendo el nombre del peticionario del formulario 1, ahora se obtiene de cada formulario con valor dinamico "numFrm"

function obtenerFechaHora() {
    let fechaActual = new Date();

    // Fecha en formato YYYY-MM-DD
    let year = fechaActual.getFullYear();
    let month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    let day = String(fechaActual.getDate()).padStart(2, '0');
    let fechaRecepcion = `${year}-${month}-${day}`;

    // Hora en formato HH:mm:ss
    let hours = String(fechaActual.getHours()).padStart(2, '0');
    let minutes = String(fechaActual.getMinutes()).padStart(2, '0');
    let seconds = String(fechaActual.getSeconds()).padStart(2, '0');
    let horaRecepcion = `${hours}:${minutes}:${seconds}`;

    return { fechaRecepcion, horaRecepcion };
}


//Se obtienen los datos de formularios de manera dinámica con numFrm
function guardaDataComplPeticionario(idForm, numFrm) {

    let btn = $(`#submitForm-${numFrm}`);

    // 🔥 EVITA DOBLE CLICK
    if (btn.prop('disabled')) return false;
    btn.prop('disabled', true);

    $(`#frmDatosPersonales${numFrm} input[type='text']`).prop('disabled', false);
    $(`#frmDatosPersonales${numFrm} input[type='radio']`).prop('disabled', false);
    $(`#frmDatosPersonales${numFrm} input[type='date']`).prop('disabled', false);
    $(`#frmDatosPersonales${numFrm} select`).prop('disabled', false);

    let nombre = $(`#nombre_petit-frmDatosPersonales${numFrm} option:selected`).text();
    //FrmEnlacefq.append('ip_acceso', ipAcceso);

    var ip = $("#ipAccesible").html();
    console.log("Esta es la ip que se va a pasar:" + ip);

    $.ajax({
        type: "post",
        url: 'GuardarDataComplPeticionario',
        content: "application/json; charset=utf-8",
        data: $(idForm).serialize() + '&nombreS=' + nombre + '&Ipaccesible=' + ip,
        dataType: "json",
        success: function (data) {
            console.log(data)
            let selectsPet = document.querySelectorAll('.selectpetactac').length;

            if (nombre != "") {
                $(`#frmDatosPersonales${numFrm} input[type='radio']`).prop("disabled", true);
                $(`#frmDatosPersonales${numFrm} select`).prop('disabled', true);
                $(`#frmDatosPersonales${numFrm} input[type='date']`).prop('disabled', true);
                $(`#nombre_petit-frmDatosPersonales${numFrm}`).prop("disabled", false);
            }
            // Si se guardo de forma correcta te regresa el id de peticionario generado de la tabla Reg_recepcion
            // De igual forma te regresa el id de complemento generado
            if (data.idpeticionario > 0 && data.idcomplemento > 0) {

                $(`#idcomplementopet${numFrm}`).val(data.idcomplemento);
                $(`#idpeticionarioi${numFrm}`).val(data.idpeticionario);

                console.log('Input_Peticionario');

                let arrids_competicionarios = [];

                // Se crea arreglo de peticinarios registrados para un select, ya que se usara uno para los siguientes formatos
                let nombreDesdeData = (data.nombrepet || '').replace(/No Proporcionado/g, '').trim();
                let nombreFinal = nombreDesdeData;

                // Fallback: si viene vacío, tomamos el texto seleccionado en el formulario
                if (!nombreFinal) {
                    nombreFinal = $(`#frmDatosPersonales${numFrm} select[name="Input_Peticionario"]`)
                        .find('option:selected')
                        .text()
                        .trim();
                }

                let index = peticionariosGuardados.findIndex(p => p.idpeticionario == data.idpeticionario);

                if (index !== -1) {
                    // ✅ ACTUALIZA
                    peticionariosGuardados[index] = {
                        idpeticionario: data.idpeticionario,
                        idcomplementopet: data.idcomplemento,
                        nombrepeti: nombreFinal
                    };
                } else {
                    // ✅ INSERTA SOLO SI NO EXISTE
                    peticionariosGuardados.push({
                        idpeticionario: data.idpeticionario,
                        idcomplementopet: data.idcomplemento,
                        nombrepeti: nombreFinal
                    });
                }

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
                    // Se valida que el input hidden que guarda el id de queja este vacio
                    if ($('.idquejagenerado').val() == '') {
                        let FrmEnlacefq = new FormData();
                        FrmEnlacefq.append('num_frmpetit', numFrm);
                        FrmEnlacefq.append('id_complemento', $(`#idcomplementopet${numFrm}`).val());
                        FrmEnlacefq.append('id_peticionario', $(`#idpeticionarioi${numFrm}`).val());
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
                                let tipoescrito = $('#select_tipoescritoc').val();
                                
                                // Si ya esta creado el id de queja se actualiza en la DB campo ID_EXPEDIENTE del complemento peticionario
                                let { fechaRecepcion, horaRecepcion } = obtenerFechaHora();

                                $('#Input_FechaRecepcion').val(fechaRecepcion).prop("disabled", true);
                                $('#Input_HoraRecepcion').val(horaRecepcion).prop("disabled", true);

                                
                                console.log(idqueja);
                                console.log(tipoescrito);
                                insertarTipoEscrito(idqueja, tipoescrito);
                                let FrmIdQueja = new FormData();
                                let idscomplementos_petit = document.querySelectorAll(".idscomplepeticionarios");

                                for (var cp = 0; cp < idscomplementos_petit.length; cp++) {
                                    arrids_competicionarios.push(idscomplementos_petit[cp].value);
                                }

                                FrmIdQueja.append('id_queja', idqueja);
                                FrmIdQueja.append('ids_complementos', arrids_competicionarios);
                                0
                                fetchPost("Expediente/UpdateComPetExpQujoso", "json", FrmIdQueja, (resp) => {
                                    console.log(resp)
                                    let update = resp.data;
                                });

                                // Si se genero el id de queja se crea select de los peticionarios dados de alta
                                // para que puedan ser seleccionados en los otros formatos
                                if (filtradonuevo.length > 0) {
                                    $('.listapet').append(selectPetACircunstanciada(idqueja, filtradonuevo, 'escritoi', 'Input_Peticionario'));
                                }
                                $('.listapetactac').append(selectPetACircunstanciada(idqueja, filtradonuevo, 'actac', 'nombrePet'));
                                changeSelectPetActac();
                            } else {
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
                        let idquejahidden = $('.idquejagenerado').val();
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
                                console.log(resp.data)
                            });
                        }

                        if (filtradonuevo.length > 0) {
                            console.log(filtradonuevo)
                            let updatedArray = filtradonuevo.map(p =>
                                p.idcomplementopet != data.idcomplemento && p.idpeticionario === data.idpeticionario
                                    ? { idpeticionario: data.idpeticionario, idcomplementopet: data.idcomplemento, nombrepeti: data.nombrepet }
                                    : p
                            );

                            console.log('entra el primero 1')
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

                            console.log('entra el segundo')
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
                    let idquejahidden = $('.idquejagenerado').val();

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
                                console.log(resp.data)
                            }
                        });
                    }

                    // Se crea select de los peticionarios dados de alta
                    // para que puedan ser seleccionados en los otros formatos
                    if (filtradonuevo.length > 0) {
                        $('.listapet').append(selectPetACircunstanciada($('.idquejagenerado').val(), filtradonuevo, 'escritoi', 'Input_Peticionario'));
                        $('.listapetactac').append(selectPetACircunstanciada($('.idquejagenerado').val(), filtradonuevo, 'actac', 'nombrePet'));
                        changeSelectPetActac();
                    } else {
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
                });
            }
        }
    });
}


function Agrega_PersonaAutoridad(nfin) {
    var arregloBlanco = [];

    var cuerpo = `
        <div class="autoridad-item" id="autoridad_${nfin}" data-idinei="${nfin}">
            ${CreaInputs_Con_Label(
        'Input_nombres' + nfin,
        'Input_nombres' + nfin,
        'arrInput_nombres',
        'text',
        'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;',
        'Input_nombres' + nfin,
        'placeholder="Nombres y apellidos" data-idinei="' + nfin + '" style="float:left;"',
        'style="float:left;"'
    )}
            ${CreaInputs_Con_Label(
        'Input_cargo' + nfin,
        'Input_cargo' + nfin,
        '',
        'text',
        '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;',
        'Input_cargo',
        'placeholder="cargo" style="float:left;" data-idinei="' + nfin + '"',
        'style="float:left;"'
    )}
            ${CreaSelectLabelSelect2(
        'Input_autoridades' + nfin,
        "",
        arregloBlanco,
        '',
        '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;',
        '',
        'style="float:left;"',
        'data-idinei="' + nfin + '" style="float:left;max-width:180px!important;"',
        ''
    )}
            <button type="button" class="btn btn-danger btn-sm eliminarAutoridad" data-id="${nfin}" style="margin-left:10px;">Eliminar</button>
            ${CreaBR()}
            ${CreaBR()}
        </div>
    `;

    return cuerpo;
}
$(document).on('click', '.eliminarAutoridad', function () {
    let id = $(this).data('id');
    $('#autoridad_' + id).remove();
});

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
        + Crea_Parrafos('parrafo0', 'parrafo0', 'col-md-3 parrafo', 'ROSA ISELA SANCHEZ SOYA</br>PRESIDENTA DE LA COMISIÓN DE DERECHOS HUMANOS DEL ESTADO DE PUEBLA', 'style ="text-align: left;font-weight: bold;"')
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
        //+ CreaInputs_Con_Label('Input_nombres1', 'Input_nombres1', 'arrInput_nombres', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres1', 'placeholder="Nombres y apellidos" data-idinei="1" style ="float:left;"', ' style ="float:left;"')
        //+ CreaInputs_Con_Label('Input_cargo1', 'Input_cargo1', 'arrInput_cargo', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" data-idinei="1" style ="float:left;"', ' style ="float:left;"')
        //+ CreaSelectLabelSelect2('Input_autoridades1', "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' data-idinei="1" style="float:left;"', ' style ="width:180px!important; float:left;max-width:180px!important;"', 'arrInput_autoridades')
        + '&nbsp;&nbsp;<img src="/img/Agregar_PNG.png" id="icono_agregarI" style="width:32px;height:32px;">'
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
    //Formulario para llenar DATOS EN "generar Acta circunstanciada"
    var formInnicial = `<h1>ACTA CIRCUNSTANCIADA</h1><form class="text-justify form_acta" data-nformac=${numfrm} id="formActa${numfrm}" name="formActa${numfrm}" method="post" style="width:90%; margin-left:5%" >`;
    var cuerpo =
        CreaSelectLabel('lugar' + numfrm, '', arregloBlanco, '', 'En', '', 'lugar', idfrm) + Requeridos()
        + CreaInputs_Con_Label('diaFecha' + numfrm, 'diaFecha' + numfrm, 'inputac', 'number', ', a los', 'textfield', '', idfrm) + Requeridos()
        + CreaSelectLabel('mes' + numfrm, '', arregloMeses(), '', 'días del mes de', 'textfield4', 'mes', idfrm) + Requeridos()
        + CreaSelectLabeldisabled('anio' + numfrm, '', arregloAnio(), '', 'de', 'anio', idfrm)
        //+ CreaSelectLabeldisabled('anio' + numfrm, '', arregloAnio(), '', 'de', '', 'anio', idfrm) //cambio para que el abogado seleccione el año-06/03/2025 - Fred
        + CreaSelectLabel('nomAbogado' + numfrm, '', arregloBlanco, '', ', el/la suscrito/a, abogado/a', '', 'nomAbogado', idfrm)
        + CreaInputs_Con_Label('puestoAbogado' + numfrm, 'puestoAbogado' + numfrm, 'inputac', 'text', ', en mi carácter de', 'textfield6', 'placeholder="cargo de abogado" value="' + Cargo + '" disabled', idfrm)
        + CreaInputs_Con_Label('areaAbogado' + numfrm, 'areaAbogado' + numfrm, 'inputac', 'text', ', de la', 'textfield7', 'placeholder="área de abogado" value="' + Area + '" disabled', idfrm)
        + Crea_Label('textfield8', 'textfield8', '', 'de la Comisión de Derechos Humanos del Estado de Puebla, con la fe pública que me confiere el artículo 21 y 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, así como 7, 8, 9, 48, 59, 60, 61, 64 y 66 de su Reglamento Interno, publicados en el Periódico Oficial del Estado, respectivamente')
        + Crea_LabelCentro('textfield8', 'textfield8', '', '<b>.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.CERTIFICO:.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-</b>')
        + CreaInputs_Con_Label('horaInicio' + numfrm, 'horaInicio' + numfrm, 'inputac', 'time', 'Que siendo las', 'textfield9', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('ubicacion' + numfrm, 'ubicacion' + numfrm, 'inputac', 'text', 'horas del día del día en que se actúa, encontrándome en las instalaciones que ocupa', 'textfield10', 'placeholder="lugar de entrevista"', idfrm) + Requeridos()
        + Crea_Label('textfield8', 'textfield8', '', ',donde procedo a entrevistarme con la persona que dijo llamarse') + Requeridos()
        + '<div style="margin-top: -28px; display: flex; justify-content: flex-end;" data--idfrmac="' + numfrm + '" class="listapetactac listapetactacc' + numfrm + ' d-flex"></div>'
        + CreaSelectLabel('consentimiento' + numfrm, '', SeleccionMultiple(), '', 'a quien previa identificación de la persona suscrita, le hago saber que derivado de su queja deberá manifestar su deseo de ratificar la misma, y en su uso de la voz la persona peticionaria <strong>MANIFESTÓ: </strong>', '', 'consentimiento', idfrm) + Requeridos()
        + CreaSelectLabel('origenPet' + numfrm, '', arregloBlanco, '', 'ratifico la presente queja. Acto seguido, indicó llamarse como ha quedado escrito, ser originario/a de', '', 'origenPet', idfrm) + Requeridos()
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
        + CreaSelectLabel('identificacionPet' + numfrm, '', arregloIdentificación(), '', 'quien se identifica con', '', 'identificacionPet', idfrm) + Requeridos()
        + Crea_LabelCentro('textfield11', 'textfield11', '', 'y en relación a los hechos de la queja que nos ocupa, <strong>MANIFESTÓ: </strong><br>')
        + CreaInputs_Con_Label('fechaHechos' + numfrm, 'fechaHechos' + numfrm, 'inputac', 'date', 'Que es mi deseo ratificar la queja, precisando la fecha de los hechos', 'textfield10', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('horaHechos' + numfrm, 'horaHechos' + numfrm, 'inputac', 'time', 'a las', 'textfield10', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('ubiHechos' + numfrm, 'ubiHechos' + numfrm, 'inputac', 'text', 'encontrándome en', 'textfield10', 'placeholder="lugar de hechos"', idfrm) + Requeridos()
        //+ CreaSelectLabel('catMunicipio_hechos' + numfrm, '', {}, '', 'ubicado en el municipio de', '', 'catMunicipio_hechos', idfrm) + Requeridos()
        //+ CreaSelectLabel('catEstado_hechos' + numfrm, '', arreglo_Estados(), '', 'del estado de ', '', 'catEstado_hechos', idfrm) + Requeridos()
        + CreaSelectLabel('catAutoridad' + numfrm, '', [], '', ', la(s) autoridad(es)', '', 'catAutoridad', idfrm) + Requeridos()
        + CreaTextArea('hechos' + numfrm, '', 'style="width:100%"', idfrm) + Requeridos()
        + CreaInputs_Con_Label('', '', 'inputac', 'text', 'que es todo lo que tiene que manifestar.  DOY FE. ---------------------------------------------------------------------------------------', 'textfield10', 'hidden', idfrm)
        + CreaInputs_Con_Label('horaTermino' + numfrm, 'horaTermino' + numfrm, 'inputac', 'time', 'Dando por terminada la presente diligencia siendo las', 'textfield10', '', idfrm) + Requeridos()
        + CreaInputs_Con_Label('', '', 'inputac', 'text', 'horas, del día en que se actúa. Lo anterior se hace constar para los efectos legales a que haya lugar, de conformidad con lo establecido en los numerales 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla DOY FE. ----------------------------------', 'textfield10', 'hidden', idfrm)
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
    setTimeout(() => {
        const anioActual = new Date().getFullYear();
        const select = document.getElementById('anio' + numfrm);
        const hidden = document.getElementById('id_anio' + numfrm);

        if (select) {
            select.value = anioActual;
        }

        if (hidden) {
            hidden.value = anioActual;
        }
    }, 100);


    return formualarioCompleto;
}
// se puso el nuevo formulario de orintacion y una nueva pestaña 07/05/2025 cris 
//Actualizacion de formatos 26/06/2025 Cris
function formOrientacion(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        // 09 07 25 Pendiente revisar: Input folio validacion al enviar solo acepte numeros. Caso de que no admite ceros a la izquierda
    //+ CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" ', '')
        + CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">' 
        + '</div></div>' 
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion', 'Input_FechaRecepcion', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion', 'Input_HoraRecepcion', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp', 'Input_autoridadresp', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp', 'placeholder="Nombre de la Autoridad" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion', 'Input_institucion', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE CANALIZACIÓN:&nbsp;&nbsp;', 'Input_institucion', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción II </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Orientación</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE ORIENTACIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionOrientacion', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'OrientacionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'saveOrientacion', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
// Formularios para edicion y insertar orientaciones adair 16/12/2025
function formOrientacionCedula(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        // 09 07 25 Pendiente revisar: Input folio validacion al enviar solo acepte numeros. Caso de que no admite ceros a la izquierda
        //+ CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" ', '')
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp_C', 'Input_autoridadresp_C', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp_C', 'placeholder="Nombre de la Autoridad" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion_C', 'Input_institucion_C', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE CANALIZACIÓN:&nbsp;&nbsp;', 'Input_institucion_C', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción II </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Orientación</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE ORIENTACIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'OrientacionPDF', 'btn btn-pinterest')
       /* + crea_Botonei('button', 'Guardar', 'updateOrientacion', 'btn btn-success')*/
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')


    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
//INSERTAR ORIENTACION 08/12/2025
function InsertarOrientacionCedula(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        // 09 07 25 Pendiente revisar: Input folio validacion al enviar solo acepte numeros. Caso de que no admite ceros a la izquierda
        //+ CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" ', '')
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp_C', 'Input_autoridadresp_C', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp_C', 'placeholder="Nombre de la Autoridad" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion_C', 'Input_institucion_C', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE CANALIZACIÓN:&nbsp;&nbsp;', 'Input_institucion_C', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción II </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Orientación</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE ORIENTACIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'OrientacionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'insertOrientacion', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')
        + CreaInputs('tipo_usuario', 'tipo_usuario', '', 'hidden')
        + CreaInputs('genero', 'genero', '', 'hidden')
        + CreaInputs('edad', 'edad', '', 'hidden')
        + CreaInputs('via_interposicion', 'via_interposicion', '', 'hidden')
        + CreaInputs('sexo', 'sexo', '', 'hidden')


    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}

//fin del bloque


//Actualizacion de formatos 26/06/2025 Cris
// David 17 07 2025 Actualice el label para mostrar correctamente la lista de abogados en el formulario
function formRemision(action, id, idfrm) {
    let nfrm = idfrm;
    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion', 'Input_FechaRecepcion', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion', 'Input_HoraRecepcion', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_numOficio', 'Input_numOficio', 'arrInput_numOficio', 'text', '&nbsp;&nbsp;&nbsp;NÚMERO DE OFICIO:&nbsp;', 'Input_numOficio', 'placeholder="No. Oficio generado" data-idinei="1" style ="float:left;width:17%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion', 'Input_institucion', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE REMISIÓN:&nbsp;&nbsp;', 'Input_institucion', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        //+ CreaSelectLabel('nomAbogado', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado')
        + CreaSelectLabel('nomAbogado' + idfrm, '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', idfrm) + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción III </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Remisión</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE REMISIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionRemision', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'RemisionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'saveRemision', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
//forms para la edicion e isertar remisiones adair 16/12/2025
function formRemisionCedula(action, id, idfrm) {

    let nfrm = idfrm;
    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_numOficio_C', 'Input_numOficio_C', 'arrInput_numOficio', 'text', '&nbsp;&nbsp;&nbsp;NÚMERO DE OFICIO:&nbsp;', 'Input_numOficio_C', 'placeholder="No. Oficio generado" data-idinei="1" style ="float:left;width:17%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion_C', 'Input_institucion_C', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE REMISIÓN:&nbsp;&nbsp;', 'Input_institucion_C', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaSelectLabel('nomAbogado' + idfrm, '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', idfrm) + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción III </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Remisión</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE REMISIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'RemisionPDF', 'btn btn-pinterest')
       /* + crea_Botonei('button', 'Guardar', 'updateRemision', 'btn btn-success')*/
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')


    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
// Insertar 08/12/2025
function InsertarRemisionCedula(action, id, idfrm) {

    let nfrm = idfrm;
    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_numOficio_C', 'Input_numOficio_C', 'arrInput_numOficio', 'text', '&nbsp;&nbsp;&nbsp;NÚMERO DE OFICIO:&nbsp;', 'Input_numOficio_C', 'placeholder="No. Oficio generado" data-idinei="1" style ="float:left;width:17%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion_C', 'Input_institucion_C', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE REMISIÓN:&nbsp;&nbsp;', 'Input_institucion_C', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaSelectLabel('nomAbogado' + idfrm, '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', idfrm) + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción III </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Remisión</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE REMISIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'RemisionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'insertRemision', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')
        + CreaInputs('tipo_usuario', 'tipo_usuario', '', 'hidden')
        + CreaInputs('genero', 'genero', '', 'hidden')
        + CreaInputs('edad', 'edad', '', 'hidden')
        + CreaInputs('via_interposicion', 'via_interposicion', '', 'hidden')
        + CreaInputs('sexo', 'sexo', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
//fin del bloque

//Actualizacion de formatos 26/06/2025 Cris
// David 17 07 2025 Actualice el label para mostrar correctamente la lista de abogados en el formulario
function formIncompetencia(action, id, idfrm) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion', 'Input_FechaRecepcion', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion', 'Input_HoraRecepcion', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_numOficio', 'Input_numOficio', 'arrInput_numOficio', 'text', '&nbsp;&nbsp;&nbsp;NÚMERO DE OFICIO:&nbsp;', 'Input_numOficio', 'placeholder="No. Oficio generado" data-idinei="1" style ="float:left;width:17%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion', 'Input_institucion', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE REMISIÓN:&nbsp;&nbsp;', 'Input_institucion', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        //+ CreaSelectLabel('nomAbogado', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', 1)
        + CreaSelectLabel('nomAbogado' + idfrm, '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', idfrm) + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción IV </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Incompetencia</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE INCOMPETENCIA:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionIncompetencia', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'IncompetenciaPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'saveIncompetencia', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;
    
    return formualarioCompleto;
}
//forms para editar e insertar incompetencias adair 16/12/2025
function formIncompetenciaCedula(action, id, idfrm) {

    let nfrm = idfrm;
    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_numOficio_C', 'Input_numOficio_C', 'arrInput_numOficio', 'text', '&nbsp;&nbsp;&nbsp;NÚMERO DE OFICIO:&nbsp;', 'Input_numOficio_C', 'placeholder="No. Oficio generado" data-idinei="1" style ="float:left;width:17%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion_C', 'Input_institucion_C', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE REMISIÓN:&nbsp;&nbsp;', 'Input_institucion_C', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaSelectLabel('nomAbogado' + idfrm, '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', idfrm) + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción IV </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Incompetencia</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE INCOMPETENCIA:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'IncompetenciaPDF', 'btn btn-pinterest')
       /* + crea_Botonei('button', 'Guardar', 'updateIncompetencia', 'btn btn-success')*/
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')


    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;


    return formualarioCompleto;
}
//insertar 08/12/2025
function InsertarIncompetenciaCedula(action, id, idfrm) {

    let nfrm = idfrm;
    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_numOficio_C', 'Input_numOficio_C', 'arrInput_numOficio', 'text', '&nbsp;&nbsp;&nbsp;NÚMERO DE OFICIO:&nbsp;', 'Input_numOficio_C', 'placeholder="No. Oficio generado" data-idinei="1" style ="float:left;width:17%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_institucion_C', 'Input_institucion_C', 'arrInput_institucion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA INSTITUCIÓN EN CASO DE REMISIÓN:&nbsp;&nbsp;', 'Input_institucion_C', 'placeholder="Nombre de la Institución" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaSelectLabel('nomAbogado' + idfrm, '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;NOMBRE DE LA PERSONA REMITENTE:&nbsp;&nbsp;', '', 'nomAbogado', idfrm) + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción IV </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Incompetencia</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE INCOMPETENCIA:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'RemisionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'insertIncompetencia', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')
        + CreaInputs('tipo_usuario', 'tipo_usuario', '', 'hidden')
        + CreaInputs('genero', 'genero', '', 'hidden')
        + CreaInputs('edad', 'edad', '', 'hidden')
        + CreaInputs('via_interposicion', 'via_interposicion', '', 'hidden')
        + CreaInputs('sexo', 'sexo', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}

//fin del bloque

function formAntecedente(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio', 'Input_folio', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion', 'Input_FechaRecepcion', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion', 'Input_HoraRecepcion', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp', 'Input_autoridadresp', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp', 'placeholder="Nombre de la Autoridad" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción V </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Antecedente / Copia de conocimiento</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE ANTECEDENTE:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionAntecedente', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'AntecedentePDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'saveAntecedente', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
//forms para editar y insertar antecedentes
function InsertarAntecedenteCedula(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp_C', 'Input_autoridadresp_C', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp_C', 'placeholder="Nombre de la Autoridad" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción V </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Antecedente / Copia de conocimiento</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE ANTECEDENTE:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'AntecedentePDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'insertAntecedente', 'btn btn-success')
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')
        + CreaInputs('tipo_usuario', 'tipo_usuario', '', 'hidden')
        + CreaInputs('genero', 'genero', '', 'hidden')
        + CreaInputs('edad', 'edad', '', 'hidden')
        + CreaInputs('via_interposicion', 'via_interposicion', '', 'hidden')
        + CreaInputs('sexo', 'sexo', '', 'hidden')


    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
//insertar 08/12/2025
function formAntecedenteCedula(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_folio_C', 'Input_folio_C', 'arrInput_folio', 'number', 'FOLIO:&nbsp;', 'Input_folio_C', 'placeholder="No. de folio" min="0" ', '')
        + CreaBR()
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp_C', 'Input_autoridadresp_C', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp_C', 'placeholder="Nombre de la Autoridad" data-idinei="1" style ="float:left;width:30%!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66,<b> 77 fracción V </b>del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Antecedente / Copia de conocimiento</b>.', 'style ="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'EXPLICACIÓN DE ANTECEDENTE:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'AntecedentePDF', 'btn btn-pinterest')
     /*   + crea_Botonei('button', 'Guardar', 'updateAntecedente', 'btn btn-success')*/
        + '</div>'
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden')
        + CreaInputs('id_personas', 'id_personas', '', 'hidden')

    var fin_formulario = '</form>';

    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}


//fin del bloque

// 25 06 2025 Cris: Modificacion del formulario de aportaciones
//  Se cambio el formato incluyendo y eliminando nuevos campos. Se quito el registro de datos personales y el ID. Tambien se incluyo el boton de cargar y ver pdf.
function formAportacion(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';

    var cuerpo = '<div class="text-right">'
        + '<div class="listapet">'
        + '</div></div>'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion', 'Input_FechaRecepcion', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion', 'Input_HoraRecepcion', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_NombrePetAportacion', 'Input_NombrePetAportacion', 'arrInput_NombrePetAportacion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DEL PETICIONARIO:&nbsp;', 'Input_NombrePetAportacion', 'placeholder="NOMBRE DEL PETICIONARIO:" data-idinei="1" style ="float:left;width:480px!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp', 'Input_autoridadresp', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp', 'placeholder="AUTORIDAD PRESUNTAMENTE RESPONSABLE" data-idinei="1" style ="float:left;width:480px!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_ExpedienteAportacion', 'Input_ExpedienteAportacion', 'arrInput_ExpedienteAportacion', 'text', '&nbsp;&nbsp;&nbsp;EXPEDIENTE AL QUE APORTA:&nbsp;', 'Input_ExpedienteAportacion', 'placeholder="EXPEDIENTE AL QUE APORTA" maxlength="10" pattern="\\d*" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" style="float:left;width:100px!important;"', 'style="float:left;"') + Requeridos()
        + '<span style="float:left; line-height:32px; font-size:24px; font-weight:bold; margin: 0 10px;">-</span>'
        + CreaInputs_Con_Label('Input_year', 'Input_year', 'arrInput_year', 'text', '', 'Input_year', 'placeholder="año" data-idinei="1" maxlength="4" pattern="\\d*" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" style="float:left;width:100px!important;"', 'style="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('textfield12', 'textfield12', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66, <b>77 fracción V</b> del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Aportación</b>.', 'style="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'EXPLICACIÓN DE APORTACIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('JustificacionAportacion', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistroAportacion', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'AportacionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'saveAportacion', 'btn btn-success')
        + '</div>'
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden');

    var fin_formulario = '</form>';

    let formularioCompleto = formulario + cuerpo + fin_formulario;

    //$('#municipioqueja').select2?.();

    return formularioCompleto;
}
//forms para editar e insertar aportaciones

function formAportacionCedula(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_NombrePetAportacion_C', 'Input_NombrePetAportacion_C', 'arrInput_NombrePetAportacion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DEL PETICIONARIO:&nbsp;', 'Input_NombrePetAportacion_C', 'placeholder="NOMBRE DEL PETICIONARIO:" data-idinei="1" style ="float:left;width:480px!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp_C', 'Input_autoridadresp_C', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp_C', 'placeholder="AUTORIDAD PRESUNTAMENTE RESPONSABLE" data-idinei="1" style ="float:left;width:480px!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_ExpedienteAportacion_C', 'Input_ExpedienteAportacion_C', 'arrInput_ExpedienteAportacion', 'text', '&nbsp;&nbsp;&nbsp;EXPEDIENTE AL QUE APORTA:&nbsp;', 'Input_ExpedienteAportacion_C', 'placeholder="EXPEDIENTE AL QUE APORTA" maxlength="10" pattern="\\d*" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" style="float:left;width:100px!important;"', 'style="float:left;"') + Requeridos()
        + '<span style="float:left; line-height:32px; font-size:24px; font-weight:bold; margin: 0 10px;">-</span>'
        + CreaInputs_Con_Label('Input_year', 'Input_year', 'arrInput_year', 'text', '', 'Input_year', 'placeholder="año" data-idinei="1" maxlength="4" pattern="\\d*" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" style="float:left;width:100px!important;"', 'style="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('textfield12', 'textfield12', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66, <b>77 fracción V</b> del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Aportación</b>.', 'style="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'EXPLICACIÓN DE APORTACIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'AportacionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'updateAportacion', 'btn btn-success')
        + '</div>'
        + CreaInputs('Input_IdAportacion_C', 'Input_IdAportacion_C', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden');
    // Campo oculto para enviar el Id_aportacion





    var fin_formulario = '</form>';
    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}
//insert 08/12/2025
function InsertarAportacionCedula(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaBR()
        + CreaBR()
        + CreaSelectLabelSelect2('Input_LugarHechos_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;LUGAR DE RECEPCIÓN:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_FechaRecepcion_C', 'Input_FechaRecepcion_C', '', 'date', '&nbsp;&nbsp;&nbsp;FECHA Y HORA DE RECEPCIÓN:&nbsp;', 'textfield', 'placeholder="fecha recepcion" style ="float:left; border-right: none !important;  border-left: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; height: 30px;"', ' style ="float:left;"') + Requeridos()
        + CreaInputs_Con_Label('Input_HoraRecepcion_C', 'Input_HoraRecepcion_C', '', 'time', '', 'textfield', 'placeholder="hora recepcion" style ="float:left; border-left: none !important; border-right: 1px solid #767676 !important; border-bottom: 1px solid #767676 !important; border-top: 1px solid #767676 !important; border-radius: 0px; height: 30px;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_NombrePetAportacion_C', 'Input_NombrePetAportacion_C', 'arrInput_NombrePetAportacion', 'text', '&nbsp;&nbsp;&nbsp;NOMBRE DEL PETICIONARIO:&nbsp;', 'Input_NombrePetAportacion_C', 'placeholder="NOMBRE DEL PETICIONARIO:" data-idinei="1" style ="float:left;width:480px!important;"', ' style ="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_autoridadresp_C', 'Input_autoridadresp_C', 'arrInput_autoridadresp', 'text', '&nbsp;&nbsp;&nbsp;AUTORIDAD PRESUNTAMENTE RESPONSABLE:&nbsp;', 'Input_autoridadresp_C', 'placeholder="AUTORIDAD PRESUNTAMENTE RESPONSABLE" data-idinei="1" style ="float:left;width:480px!important;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_ExpedienteAportacion_C', 'Input_ExpedienteAportacion_C', 'arrInput_ExpedienteAportacion', 'text', '&nbsp;&nbsp;&nbsp;EXPEDIENTE AL QUE APORTA:&nbsp;', 'Input_ExpedienteAportacion_C', 'placeholder="EXPEDIENTE AL QUE APORTA" maxlength="10" pattern="\\d*" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" style="float:left;width:100px!important;"', 'style="float:left;"') + Requeridos()
        + '<span style="float:left; line-height:32px; font-size:24px; font-weight:bold; margin: 0 10px;">-</span>'
        + CreaInputs_Con_Label('Input_year', 'Input_year', 'arrInput_year', 'text', '', 'Input_year', 'placeholder="año" data-idinei="1" maxlength="4" pattern="\\d*" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');" style="float:left;width:100px!important;"', 'style="float:left;"') + Requeridos()
        + CreaBR()
        + CreaBR()
        + '<div class="text-justify">'
        + Crea_Parrafos('textfield12', 'textfield12', 'col-md-12 parrafo', 'Con fundamento en lo dispuesto por los artículos 1, 2, 3, 4, 5 y 25 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, 48 fracciones II, IV, y VI, 59, 61, 62, 64, 66, <b>77 fracción V</b> del Reglamento Interno de la Comisión de Derechos Humanos del Estado de Puebla, se califica provisionalmente como: <b>Aportación</b>.', 'style="text-align: left"')
        + CreaBR()
        + Crea_Label('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'EXPLICACIÓN DE APORTACIÓN:&nbsp;') + Requeridos()
        + CreaTextArea('ExplicacionCedula', 'col-md-12 parrafo')
        + CreaInput()
        + CreaBR()
        + crealert('ideleteUpload', 'danger', 'Archivo adjunto eliminado')
        + '<div id="containerImages"></div >'
        + CreaBR()
        + CreaSelectLabelSelect2('sedeRegistro_C', '', arregloBlanco, '', '&nbsp;&nbsp;&nbsp;SEDE DE REGISTRO:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%!important;"') + Requeridos()
        + '</div>'
        + CreaBR()
        + '<div class="text-center">'
        + CreaBR()
        + CreaBR()
        + crea_Botonei('button', 'Previsualizar PDF', 'AportacionPDF', 'btn btn-pinterest')
        + crea_Botonei('button', 'Guardar', 'insertAportacion', 'btn btn-success')
        + '</div>'
        + CreaInputs('Input_IdAportacion_C', 'Input_IdAportacion_C', '', 'hidden')
        + CreaInputs('idenlaceformatquejaei', 'idenlaceformatquejaei', '', 'hidden')
        + CreaInputs('id_escritoigenerado', 'id_escritoigenerado', '', 'hidden');


    var fin_formulario = '</form>';
    let formualarioCompleto = formulario + cuerpo + fin_formulario;

    return formualarioCompleto;
}




//fin del bloque


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

// Elección de los formularios a llenar
let formularioqueja = `
<div class="card-header eliminaformaes">
    <h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
            <li class="nav-item eliminaformaes tab2">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_escrito" id="tab2">Alta Escrito inicial</a>
            </li>
            <li class="nav-item eliminaformaes tab3">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_acta" id="tab3">Alta Acta Circunstanciada</a>
            </li>
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#altaqueja" id="tab4">Datos Complementarios</a>
            </li>
        </ul>

        <div class="tab-content eliminaformaes">
            <!-- TAB 1 - Datos Personales -->
            <div class="tab-pane fade eliminaformaes" id="datospersonales" role="tabpanel">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-body eliminaformaes">
                            <div id="accordion-seven-dp" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                                <div class="accordion__item eliminaformaes">
                                    <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#collapseDatosPersonales">
                                        <span class="accordion__header--icon eliminaformaes"></span>
                                        <span class="accordion__header--text eliminaformaes">Datos del Peticionario</span>
                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                    </div>
                                    <div id="collapseDatosPersonales" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven-dp">
                                        <div class="accordion__body--text eliminaformaes">
                                            <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">
                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclasprticinariso">
                                                                <a href="#ref-frm-frmDatosPersonales1" data-toggle="pill" data-numpetit="1" class="nav-link active show eliminaformaes linksfrmpetit">Peticionario 1</a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addPeticionariodp" style="margin-top: 5px;border: none;">
                                                                <i class="fas fa-user-plus eliminaformaes"></i>
                                                            </button>
                                                        </div>
                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmPeticionarios">
                                                                <div id="ref-frm-frmDatosPersonales1" class="tab-pane fade active show divformularioDatosPersonales eliminaformaes">
                                                                    <!-- Formulario del Peticionario -->
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
            </div>

            <!-- TAB 2 - Escrito Inicial -->
            <div class="tab-pane fade eliminaformaes" id="alta_escrito">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-body eliminaformaes">
                            <div id="accordion-seven-ei" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                                <div class="accordion__item eliminaformaes">
                                    <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#collapseEscritoInicial">
                                        <span class="accordion__header--icon eliminaformaes"></span>
                                        <span class="accordion__header--text eliminaformaes">Datos para generar Escrito Inicial</span>
                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                    </div>
                                    <div id="collapseEscritoInicial" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven-ei">
                                        <div class="accordion__body--text eliminaformaes" id="divformularioEscritoInicial">
                                            <h3 style="font-size: small; font-style: italic; color: black; font-weight: bold; text-align: right;">
                                                <span style="color: red;">*</span> Campos Requeridos
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 3 - Acta Circunstanciada -->
            <div class="tab-pane fade eliminaformaes" id="alta_acta">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-body eliminaformaes">
                            <div id="accordion-seven-ac" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                                <div class="accordion__item eliminaformaes">
                                    <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#collapseActaCircunstanciada">
                                        <span class="accordion__header--icon eliminaformaes"></span>
                                        <span class="accordion__header--text eliminaformaes">Datos para generar Acta circunstanciada</span>
                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                    </div>
                                    <div id="collapseActaCircunstanciada" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven-ac">
                                        <div class="accordion__body--text eliminaformaes">
                                            <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">
                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclassactac">
                                                                <a href="#ref-frm-frmActacir1" data-toggle="pill" data-numactac="1" class="nav-link active show eliminaformaes linksfrmActaci">Acta circunstanciada 1</a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addActac" style="margin-top: 5px;border: none;">
                                                                <i class="fas fa-plus-circle eliminaformaes"></i>
                                                            </button>
                                                        </div>
                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmActacircu">
                                                                <div id="ref-frm-frmActacir1" class="tab-pane fade active show divformularioActacir eliminaformaes">
                                                                    <div class="hoja_acta">
                                                                        <div class="accordion__body--text eliminaformaes" id="divformularioActaCircunstanciada">
                                                                            <h3 style="font-size: small; font-style: italic; color: black; font-weight: bold; text-align: right;">
                                                                                <span style="color: red;">*</span> Campos Requeridos
                                                                            </h3>
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
                    </div>
                </div>
            </div>

            <!-- TAB 4 - Datos Complementarios -->
            <div class="tab-pane active fade eliminaformaes" id="altaqueja">
                <div class="pt-4 eliminaformaes">
                    <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                        <div id="izquierda" class="row col-6"></div>
                        <div id="derecha" class="row col-6"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
`;
let formulariorientacion = `
<div class="card-header eliminaformaes">
    <h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>

<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#aorientacion" id="tab2">Alta de una Orientacion</a>
            </li>
           
        </ul>

         <div class="tab-content eliminaformaes">
            <!-- TAB 1 - Datos Personales -->
            <div class="tab-pane fade eliminaformaes" id="datospersonales" role="tabpanel">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-body eliminaformaes">
                            <div id="accordion-seven-dp" class="accordion accordion-header-bg accordion-bordered eliminaformaes">
                                <div class="accordion__item eliminaformaes">
                                    <div class="accordion__header accordion__header--tit eliminaformaes" data-toggle="collapse" data-target="#collapseDatosPersonales">
                                        <span class="accordion__header--icon eliminaformaes"></span>
                                        <span class="accordion__header--text eliminaformaes">Datos del Peticionario</span>
                                        <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                    </div>
                                    <div id="collapseDatosPersonales" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven-dp">
                                        <div class="accordion__body--text eliminaformaes">
                                            <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">
                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclasprticinariso">
                                                                <a href="#ref-frm-frmDatosPersonales1" data-toggle="pill" data-numpetit="1" class="nav-link active show eliminaformaes linksfrmpetit">Peticionario 1</a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addPeticionariodp" style="margin-top: 5px;border: none;">
                                                                <i class="fas fa-user-plus eliminaformaes"></i>
                                                            </button>
                                                        </div>
                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmPeticionarios">
                                                                <div id="ref-frm-frmDatosPersonales1" class="tab-pane fade active show divformularioDatosPersonales eliminaformaes">
                                                                    <!-- Formulario del Peticionario -->
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
            </div>

            <div class="tab-pane fade eliminaformaes" id="aorientacion" role="tabpanel">
                <div class="pt-4 eliminaformaes">
                    <div id="divformularioOrientacion"></div>
                </div>
            </div>

            <div class="tab-pane fade eliminaformaes" id="altaqueja">
    <div class="pt-4 eliminaformaes">
        <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
            <div id="izquierda" class="row col-6"></div>
            <div id="derecha" class="row col-6"></div>
        </form>
    </div>
</div>
</div>
</div>
</div>
</div>
`;
let formularioRemsion = `
<div class="card-header eliminaformaes">
    <h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>

<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#aremision" id="tab6">Alta Remision</a>
            </li>
            
        </ul>

        <div class="tab-content eliminaformaes">
            <div class="tab-pane fade eliminaformaes" id="datospersonales" role="tabpanel">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-header d-block eliminaformaes"></div>
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
                                            <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">
                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclasprticinariso">
                                                                <a href="#ref-frm-frmDatosPersonales1" data-toggle="pill" data-numpetit="1" class="nav-link active show eliminaformaes linksfrmpetit">Peticionario 1</a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addPeticionariodp" style="margin-top: 5px; border: none;">
                                                                <i class="fas fa-user-plus eliminaformaes"></i>
                                                            </button>
                                                        </div>
                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmPeticionarios">
                                                                <div id="ref-frm-frmDatosPersonales1" class="tab-pane fade active show divformularioDatosPersonales eliminaformaes"></div>
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

            <div class="tab-pane fade eliminaformaes" id="aremision" role="tabpanel">
                <div class="pt-4 eliminaformaes">
                    <div id="divformularioremision"></div>
                </div>
            </div>

            <div class="tab-pane active fade eliminaformaes" id="altaqueja">
                <div class="pt-4 eliminaformaes">
                    <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                        <div id="izquierda" class="row col-6"></div>
                        <div id="derecha" class="row col-6"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
`;
let formularioIncompetencia = `
<div class="card-header eliminaformaes">
    <h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>

<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#aIncompetencia" id="tab7">Alta Incompetencia</a>
            </li>
            
        </ul>

        <div class="tab-content eliminaformaes">
            <div class="tab-pane fade eliminaformaes" id="datospersonales" role="tabpanel">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-header d-block eliminaformaes"></div>
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
                                            <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">
                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclasprticinariso">
                                                                <a href="#ref-frm-frmDatosPersonales1" data-toggle="pill" data-numpetit="1" class="nav-link active show eliminaformaes linksfrmpetit">Peticionario 1</a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addPeticionariodp" style="margin-top: 5px; border: none;">
                                                                <i class="fas fa-user-plus eliminaformaes"></i>
                                                            </button>
                                                        </div>
                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmPeticionarios">
                                                                <div id="ref-frm-frmDatosPersonales1" class="tab-pane fade active show divformularioDatosPersonales eliminaformaes"></div>
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

            <div class="tab-pane fade eliminaformaes" id="aIncompetencia" role="tabpanel">
                <div class="pt-4 eliminaformaes">
                    <div id="divformularioIncompetencia"></div>
                </div>
            </div>

            <div class="tab-pane active fade eliminaformaes" id="altaqueja">
                <div class="pt-4 eliminaformaes">
                    <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                        <div id="izquierda" class="row col-6"></div>
                        <div id="derecha" class="row col-6"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
`;
let formularioAntecedente = `
<div class="card-header eliminaformaes">
    <h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>

<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#aAntecedente" id="tab8">Alta Antecedente</a>
            </li>
            
        </ul>

        <div class="tab-content eliminaformaes">
            <div class="tab-pane fade eliminaformaes" id="datospersonales" role="tabpanel">
                <div class="col-md-12 eliminaformaes">
                    <div class="cardpeque eliminaformaes">
                        <div class="card-header d-block eliminaformaes"></div>
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
                                            <div class="cardpeque eliminaformaes">
                                                <div class="cardpeque-body eliminaformaes">
                                                    <div class="row eliminaformaes">
                                                        <div class="col-xl-2 eliminaformaes">
                                                            <div class="nav flex-column nav-pills eliminaformaes divanclasprticinariso">
                                                                <a href="#ref-frm-frmDatosPersonales1" data-toggle="pill" data-numpetit="1" class="nav-link active show eliminaformaes linksfrmpetit">Peticionario 1</a>
                                                            </div>
                                                            <button class="eliminaformaes" id="addPeticionariodp" style="margin-top: 5px; border: none;">
                                                                <i class="fas fa-user-plus eliminaformaes"></i>
                                                            </button>
                                                        </div>
                                                        <div class="col-xl-10 eliminaformaes">
                                                            <div class="tab-content eliminaformaes tabfrmPeticionarios">
                                                                <div id="ref-frm-frmDatosPersonales1" class="tab-pane fade active show divformularioDatosPersonales eliminaformaes"></div>
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

            <div class="tab-pane fade eliminaformaes" id="aAntecedente" role="tabpanel">
                <div class="pt-4 eliminaformaes">
                    <div id="divformularioAntecedente"></div>
                </div>
            </div>

            <div class="tab-pane active fade eliminaformaes" id="altaqueja">
                <div class="pt-4 eliminaformaes">
                    <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                        <div id="izquierda" class="row col-6"></div>
                        <div id="derecha" class="row col-6"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
`;
let formularioAportacion = `
<div class="card-header eliminaformaes">
    <h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
                <a class="nav-link eliminaformaes" data-toggle="tab" href="#aaportacion" id="tab9">Alta Aportación</a>
            </li>
        </ul>
       <div class="tab-content eliminaformaes">
            <div class="tab-pane fade eliminaformaes" id="aaportacion" role="tabpanel">
                <div class="pt-4 eliminaformaes">
                    <div id="divformularioaportacion"></div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
// se escribio asi pare diferenciar cuando se hace el cambio tablas cuando se toma una u otra opcion 07/05/2025 cris
let formularioFisica = `
<div class="card-header eliminaformaes">
<h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">

            <li class="nav-item eliminaformaes">
                <a class="nav-link  eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
          
            
        </ul>
        <div class="tab-content eliminaformaes">
            <div class="tab-pane fade show  eliminaformaes" id="datospersonales" role="tabpanel">
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
            </div>
            <div class="tab-pane active fade eliminaformaes" id="altaqueja">
                <div class="pt-4 eliminaformaes">
                    <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                        <div id="izquierda" class="row col-6"></div>
                        <div id="derecha" class="row col-6"></div>
                    </form>
                </div>
            </div>

            <div class="tab-pane fade eliminaformaes" id="alta_escrito">
                <div class="tab-content eliminaformaes">
                    <div class="tab-pane fade show active eliminaformaes" id="datosescritoinicial" role="tabpanel">
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
        </div>
    </div>
</div>
`;
let formularioMoral = `
<div class="card-header eliminaformaes">
<h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">

            <li class="nav-item eliminaformaes">
                <a class="nav-link  eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
           
           
        </ul>
        <div class="tab-content eliminaformaes">
            <div class="tab-pane fade show  eliminaformaes" id="datospersonales" role="tabpanel">
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
            </div>
            <div class="tab-pane active fade eliminaformaes" id="altaqueja">
                <div class="pt-4 eliminaformaes">
                    <form id="frm_altaqueja" name="frm_altaqueja" class="row col-12">
                        <div id="izquierda" class="row col-6"></div>
                        <div id="derecha" class="row col-6"></div>
                    </form>
                </div>
            </div>

            <div class="tab-pane fade eliminaformaes" id="alta_escrito">
                <div class="tab-content eliminaformaes">
                    <div class="tab-pane fade show active eliminaformaes" id="datosescritoinicial" role="tabpanel">
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
// retire el arreglo manual para que el año se actualice al año en curso de manera automatica con este ciclo
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
    arreglo.push(objeto5); arreglo.push(objeto);

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
        // david 17 07
       //console.log('Lista de abogados:', data.lista3);

    });

}
function arreglo_Estados(callback) {
    var arregloEdos = [];

    $.getJSON("https://api.copomex.com/query/get_estado_clave?token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee")
        .done(function (copomex) {
            var estadoClave = copomex && copomex.response && copomex.response.estado_clave;

            if (estadoClave && typeof estadoClave === 'object') {
                for (var estado in estadoClave) {
                    if (Object.prototype.hasOwnProperty.call(estadoClave, estado)) {
                        arregloEdos.push({
                            idSelect: estadoClave[estado],
                            descripcion: estado
                        });
                    }
                }
            } else if (Array.isArray(estadoClave)) {
                for (var i = 0; i < estadoClave.length; i++) {
                    var par = estadoClave[i];
                    arregloEdos.push({ idSelect: par[0], descripcion: par[1] });
                }
            }

            if (typeof callback === 'function') callback(arregloEdos);
        })
        .fail(function () {
            if (typeof callback === 'function') callback([]);
        });
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
        //se modifico el tamaño del cuadro de observaciones 23/05/2025 cris
        + CreaTextArea('observaciones', '', 'style="width:100%; height:20%;"')
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
    //$('#municipioqueja').attr("disabled","true");
    $('#municipioqueja').select2();
    return formualarioCompleto;
}

//  Funcion para formulario de orientacion 



// Método que recibe un elemento input date y un objeto date
function chargeDateInputDate(elem, dateObject = new Date()) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var month = month > 9 ? month : "0" + month;
    var day = dateObject.getDate() > 9 ? dateObject.getDate() : "0" + dateObject.getDate();
    var dateFormat = year + "-" + month + "-" + day;
   /* elem.value = dateFormat;*/
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
    //url: "https://localhost:7126/AltaExpediente/RegresaListaCatalogos",
    $.ajax({
        type: "POST",
        url: listacatalogos,
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
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario.replace(/No Proporcionado/g, '')}</span><span class="tooltipbox-content clearfix">
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
    $('#municipioqueja').removeAttr("disabled");
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
                url: actualizaestatus,
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
                    $('#municipioqueja').attr("disabled", "true");
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
        } else {
            $("#CircunstanciasHechos").val($("#hechos").val());

            var form_data = new FormData();
            var form_2 = $('.formQueja').serializeArray();

            var abogado = obtenerTextoSelectGenerico('#Abogadoqueja');
            var estado = "Turno Preliminar";
            var municipio = obtenerTextoSelectGenerico('#municipioqueja');
            var sede = obtenerTextoSelectGenerico('#sedeRegistro');
            var viainter = obtenerTextoSelectGenerico('#viainterpos');

            form_data.append("abogado_desc", abogado);
            form_data.append("estadoqueja_desc", estado);
            form_data.append("municipioqueja_desc", municipio);
            form_data.append("sederegistro_desc", sede);
            form_data.append("viainterdesc", viainter);

            form_2.forEach(function (fields) {
                form_data.append(fields.name, fields.value);
            });

            let json = formDataToJson(form_data);

            // Validar antes de guardar
            let idqueja = $("#idquejaDC").val();
            console.log("expediente", idqueja);
            obtenerEstatusExpediente(idqueja, function (estatusExpediente) {
                if (!estatusExpediente) {
                    console.log("No se recibió estatus del SP");
                    return;
                }

                let estatusNormalizado = estatusExpediente.trim();

                if (estatusNormalizado === "Completo" || estatusNormalizado === "NoAplica") {
                    //Guardar solo si está completo
                    $.ajax({
                        type: "POST",
                        url: guardaquejadqot,
                        data: json,
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
                } else {
                    // Bloquear si está incompleto
                    Swal.fire({
                        icon: 'error',
                        title: 'No se puede guardar la queja',
                        text: 'Falta acta circunstanciada.',
                        confirmButtonText: 'Entendido'
                    });
                    $('#frm_altaqueja button[type="button"]').hide();
                }
            });
        }
    });
}

//Añadir abajo 

function obtenerEstatusExpediente(idExpediente, callback) {
    $.ajax({
        type: "POST",
        url: "/AltaExpediente/ValidarExpediente",
        data: { idExpediente: idExpediente },
        dataType: "JSON",
        success: function (res) {
            console.log("Respuesta completa del SP:", res);
            if (callback) callback(res.estatus);
        },
        error: function () {
            alert("Error al validar expediente.");
            if (callback) callback(null);
        }
    });
}
function obtenerTextoSelectGenerico(select) {
    var opcionSeleccionada = $(`${select} option:selected`);
    var texto = opcionSeleccionada.text();
    return texto
}

function formDataToJson(formData) {
    let obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}
function validarCamposVaciosInput() {
    $("#parrafo").css("color", "#000000");
    var validacion = false;
    try {
        /*if ($('#idqueja').val().length === 0) {
            validacion = estiloinputvalidacion('#idqueja', validacion);
        }*/
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