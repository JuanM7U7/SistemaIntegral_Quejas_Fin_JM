//Tabla
const tableBuscadorFormatos = $('#tableEditFormatosDqot');
const tableBuscadorCedulas = $('#tableEditCedula');
const tableMemorandum = $('#tableMemoDqot');
let EstadoConyugalTabla = "";
let OcupacionTabla = "";
let DiscapacidadTabla = "";
let HijosVivosAlta = "";
let ModalidadViolenciaTabla = "";
let RelacionAgresorTabla = "";
let GrupoSocialTabla = "";
let TipoViolenciaTabla = "";
let escolaridadInicioTabla = '';
let escolaridadFinalTabla = '';
let visitaduriasTabla = "";
let contadorSelect = 0;
let options = {};

let agrupado = {};
/// David 09 09 2025: Metodo de agrupacion de cedulas por ids, agrupa toda la info de los petits y sus cedulas en una sola fila para mostrar en la tabla

function agruparPorCedulas(data) {
    agrupado = {};
    //hola
    data.forEach(item => {
        // filtra por expediente o id escrito
        const tipo = item.tipo_cedula;
        const id = tipo === 'Aportación' ? `${item.expediente}_${item.id_tipo}` : item.id_escrito;

        if (!agrupado[id]) {
            agrupado[id] = {
                id_escrito: tipo === 'Aportación' ? null : id,
                expediente: item.expediente,
                tipo_cedula: tipo,
                fecha_recepcion: item.fecha_recepcion,
                hora_recepcion: item.hora_recepcion,
                via_interposicion: item.via_interposicion,
                dp_fecha_registro: item.dP_FechaRegistro,
                dp_via_interposicion: item.dP_Via_interposicion,
                id_tipo: item.id_tipo,
                cedula: null,
                peticionarios: [],
                candidatosCedula: [],
                estatus_columna: item.estatus_columna,
                e_ExpEstatus: item.e_ExpEstatus 
            };
        }

        // Si es tipo Aportación, agrupar directamente
        if (tipo === 'Aportación') {
            if (!agrupado[id].agrupacionAportacion) {
                agrupado[id].agrupacionAportacion = [];
            }
            agrupado[id].agrupacionAportacion.push({
                estatus: item.estatus,
                estatus_columna: item.estatus_columna,
                tipo_cedula: item.tipo_cedula,
                id_tipo: item.id_tipo,
                expediente: item.expediente
            });
        }

        // Acumula posibles cédulas si DOCUMENTO == 'SI'
        if (item.documento === 'SI') {
            agrupado[id].candidatosCedula.push({ ...item });
        }

        // 🔹 Agrega los datos personales del peticionario aunque no haya cédula
        if (item.dP_idCompPetit || item.dP_status !== undefined) {
            agrupado[id].peticionarios.push({
                idCompPeticionario: item.dP_idCompPetit,
                id_escrito_peticionario: item.id_escrito || id, // usa id agrupado si no hay id_escrito
                nombre: item.dP_Nombre,
                apellidoPaterno: item.dP_ApellidoPaterno,
                apellidoMaterno: item.dP_ApellidoMaterno,
                CURP: item.dP_CURP,
                fecha_registro: item.dP_FechaRegistro,
                tipo_usuario: item.dP_TipoUsuario,
                calle: item.dP_Calle,
                numExterior: item.dP_NumExterior,
                numInterior: item.dP_NumInterior,
                colonia: item.dP_Colonia,
                municipio: item.dP_Municipio,
                estado: item.dP_Estado,
                cuidad: item.dP_Ciudad,
                codigo_postal: item.dP_CodigoPostal,
                telefono: item.dP_Telefono,
                edad: item.dP_Edad,
                email: item.dP_Email,
                sexo: item.dP_Sexo,
                escolaridad: item.dP_Escolaridad,
                estado_conyugal: item.dP_EstadoConyugal,
                ocupacion: item.dP_Ocupacion,
                otra_ocupacion: item.dP_OtraOcupacion,
                nacionalidad: item.dP_Nacionalidad,
                sabe_leer: item.dP_SabeLeer,
                discapacidad: item.dP_Discapacidad,
                grupo_social: item.dP_GrupoSocial,
                otro_grupoSocial: item.dP_OtroGrupoSocial,
                habla_lengua: item.dP_HablaLengua,
                lengua_indigena: item.dP_LenguaIndigena,
                fecha_nacimiento: item.dP_FechaNacimiento,
                origen_migrante: item.dP_OrigenMigrante,
                destino_migrante: item.dP_DestinoMigrante,
                primera_vezMexico: item.dP_PrimeraVezMexico,
                violencia_VM: item.dP_ViolenciaVM,
                canalizacion: item.dP_Canalizacion,
                embarazada: item.dP_Embarazada,
                hijos_vivos: item.dP_HijosVivos,
                modalidad_violencia: item.dP_ModalidadViolencia,
                tipo_violencia: item.dP_TipoViolencia,
                relacion_agresor: item.dP_RelacionAgresor,
                ingresos_mensuales: item.dP_IngresosMensuales,
                genero: item.dP_Genero,
                otro_genero: item.dP_OtroGenero,
                statusdp: item.dP_status,
                id_registroRecepcion: item.id_personas,
                via_interposicion: item.dP_Via_interposicion,
                Reg_recepcion: item.dP_persona
            });

        }
    });

    // Asignamos la cédula válida (si existe)
    Object.values(agrupado).forEach(grupo => {

        const candidatos = grupo.candidatosCedula;

        if (candidatos.length > 0) {
            const ultimo = candidatos[candidatos.length - 1];
            grupo.cedula = {
                id_escrito: ultimo.id_escrito,
                folio: ultimo.folio,
                lugar_hechos: ultimo.lugar_hechos,
                fecha_recepcion: ultimo.fecha_recepcion,
                hora_recepcion: ultimo.hora_recepcion,
                dp_fecha_registro: grupo.dp_fecha_registro, 
                autoridad: ultimo.autoridad,
                numero_oficio: ultimo.numero_oficio,
                institucion: ultimo.institucion,
                remitente: ultimo.remitente,
                explicacion: ultimo.explicacion,
                sede_registro: ultimo.sede_registro,
                via_interposicion: ultimo.via_interposicion,
                abogado: ultimo.abogado,
                peticionario: ultimo.peticionario,
                expediente: ultimo.expediente,
                edad: ultimo.edad,
                genero: ultimo.genero,
                sexo: ultimo.sexo,
                id_tipo: ultimo.id_tipo,
                tipo_usuario: ultimo.tipo_usuario,
                alta: ultimo.documento,
                id_peticionario: ultimo.id_personas,
                Reg_recepcion: ultimo.dP_persona,
                estatus: ultimo.estatus,
                tipo_cedula: ultimo.tipo_cedula,
                estatus_columna: ultimo.estatus_columna,
                archivos: candidatos.map(c => ({
                    archivo: c.archivo,
                    tipo_Archivo: c.tipo_Archivo
                }))
            };
        }

        // Lógica de estatus
        Object.values(agrupado).forEach(grupo => {
            if (grupo.e_ExpEstatus == 3) {
                grupo.estatus = 'Eliminado';
            } else if (grupo.tipo_cedula === 'Aportación') {
                grupo.estatus = (grupo.cedula && grupo.cedula.estatus == 1) ? 'Completo' : 'Incompleto';
            } else {
                const tieneCedulaValida = grupo.cedula && grupo.cedula.estatus == 1;
                const tieneDatosPersonalesValidos = grupo.peticionarios.some(p => p.statusdp == 1);
                grupo.estatus = (tieneCedulaValida && tieneDatosPersonalesValidos) ? 'Completo' : 'Incompleto';
            }
        });
    });

    return Object.values(agrupado);
}

// Función independiente para calcular estatus fuera de la agrupación AE
function calcularEstatus(row) {
    if (!row) return 'Incompleto';
    if (row.e_ExpEstatus == 3) {
        return 'Eliminado';
    }
    const tieneCedulaValida = row.cedula && row.cedula.estatus == 1;
    const todosPeticionariosValidos = Array.isArray(row.peticionarios) && row.peticionarios.every(p => p.statusdp == 1);

    return (tieneCedulaValida && todosPeticionariosValidos)
        ? 'Completo'
        : 'Incompleto';
}


// David 10/09/2025: Metodo auxiliar para mostrar el frm de datos personales "heredado" de la otra tabla
function verFormatoDP(row, estatus) {
    $('.frmEditDatosPersonales').empty();

    if (!row.peticionarios) {
        row = { peticionarios: [row] };
    }
    // Filtrar solo peticionarios activos 
    const activos = row.peticionarios.filter(p => parseInt(p.statusdp) === 1);

    activos.forEach((pet, i) => {

        let fechaFormateada = pet.fecha_nacimiento.split('T')[0];
        const index = i + 1; // para el sufijo del ID del formulario
        //violencia mujeres adair 26/09/25
        let violenciaVM = pet.violencia_VM === 1 ? 'Si' : 'No';
        //extrangero adair 26/09/25
        const Nacionalidad = pet.nacionalidad?.trim();
        let cpAnterior = "";
        // Agregar formulario y datos al form adair 24/09/25
        const formHtml = formPeticionario(index);
        $('.frmEditDatosPersonales').append(formHtml);

        // David 7 10 2025: Se utilizaran los valores de id complemento pet y id queja generado para agregar/editar peticionarios
        $(`#idcomplementopet${index}`).val(pet.idCompPeticionario);
        let idComplementoPetit = pet.idCompPeticionario;
        console.log("wawawawawa wewewewew");
        console.log(idComplementoPetit);
        $('#idquejagenerado').val(pet.id_escrito_peticionario);
        $(`#CURP_petit-frmDatosPersonales${index}`).val(pet.CURP);
        $(`#nombre_petit-frmDatosPersonales${index}`).val(pet.nombre);
        $(`#apellidop_petit-frmDatosPersonales${index}`).val(pet.apellidoPaterno);
        $(`#apellidom_petit-frmDatosPersonales${index}`).val(pet.apellidoMaterno);
        $(`#cp_petit-frmDatosPersonales${index}`).val(pet.codigo_postal);
        $(`#colonia_petit-frmDatosPersonales${index}`).val(pet.colonia);
        $(`#ciudad_petit-frmDatosPersonales${index}`).val(pet.ciudad);
        $(`#municipio_petit-frmDatosPersonales${index}`).val(pet.municipio);
        $(`#estado_petit-frmDatosPersonales${index}`).val(pet.estado);
        // Ejecutar consulta solo si el CP tiene 5 dígitos
        $(`#cp_petit-frmDatosPersonales${index}`).on('input', function () {
            const cp = $(this).val().trim();

            if (cp.length === 5 && !isNaN(cp) && cp !== cpAnterior) {
                cpAnterior = cp;

                const idfrm = index;
                let estado = '';
                let municipio = '';
                $.getJSON(`https://api.copomex.com/query/info_cp/${cp}?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee`)
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

                        estado = copomex.response.estado || '';
                        municipio = copomex.response.municipio || '';

                        $(`#municipio_petit-frmDatosPersonales${idfrm}`).val(municipio);
                        $(`#estado_petit-frmDatosPersonales${idfrm}`).val(estado);
                        $(`#cp_petit-frmDatosPersonales${idfrm}`).val(cp);

                        AgregarOptionSelect(idfrm, 'deloptioncolonia', `#colonia_petit-frmDatosPersonales${idfrm}`, copomex.response.asentamiento);

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
                                AgregarOptionSelect(idfrm, 'deloptionloca', `#ciudad_petit-frmDatosPersonales${idfrm}`, localidades);
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
            } else if (cp.length > 5) {
                $(this).val(cp.slice(0, 5)); // Limita a 5 caracteres
            }
        });

        $(`#nexterior_petit-frmDatosPersonales${index}`).val(pet.numExterior);
        $(`#ninterior_petit-frmDatosPersonales${index}`).val(pet.numInterior);
        $(`#calle_petit-frmDatosPersonales${index}`).val(pet.calle);
        $(`#colonia_petit-frmDatosPersonales${index}`).val(pet.colonia).trigger('change');
        $(`#telefono_petit-frmDatosPersonales${index}`).val(pet.telefono);
        $(`#fenac_petit-frmDatosPersonales${index}`).val(fechaFormateada);
        $(`#edad_petit-frmDatosPersonales${index}`).val(pet.edad);
        $(`#email_petit-frmDatosPersonales${index}`).val(pet.email);
        $(`input[name="radsexo_petit-frmDatosPersonales${index}"][value="${pet.sexo}"]`).prop('checked', true);
        //$(`#genero_petit-frmDatosPersonales${index}`).val(pet.genero);
        //$(`#ogenero_petit-frmDatosPersonales${index}`).val(pet.otro_genero);

        mostrarCampoGenero(index, pet.genero, pet.otro_genero);


        $(`#escosel_petit-frmDatosPersonales${index}`).val(pet.escolaridad);

        //$(`input[name="chknacionalidad_petit-frmDatosPersonales${index}"][value="${pet.nacionalidad.trim()}"]`).prop('checked', true);
        //funcionabilidad para que solo cuenado es extrangero se despliegue la informacion de esta seccion  adair 26/09/25
        if (Nacionalidad) {
            $(`input[name="chknacionalidad_petit-frmDatosPersonales${index}"][value="${Nacionalidad}"]`).prop('checked', true);

            if (Nacionalidad === 'Extranjero') {
                $(`.frmextrsnwno${index}`).removeClass('dis-none');
            }
        }

        $(`input[name="chksleer_petit-frmDatosPersonales${index}"][value="${pet.sabe_leer}"]`).prop('checked', true);
        $(`input[name="qatu_petit-frmDatosPersonales${index}"][value="${pet.tipo_usuario}"]`).prop('checked', true);
        $(`#econyugal_petit-frmDatosPersonales${index}`).val(pet.estado_conyugal);
        $(`#discapacidad_petit-frmDatosPersonales${index}`).val(pet.discapacidad);
        $(`#ocupacion_petit-frmDatosPersonales${index}`).val(pet.ocupacion);
        $(`#ocupacioninpt_petit-frmDatosPersonales${index}`).val(pet.otra_ocupacion);
        $(`#gsoci_petit-frmDatosPersonales${index}`).val(pet.grupo_social);
        $(`#gsociinpt_petit-frmDatosPersonales${index}`).val(pet.otro_grupoSocial);
        $(`#leindi_petit-frmDatosPersonales${index}`).val(pet.habla_lengua);
        $(`#oleindi_petit-frmDatosPersonales${index}`).val(pet.lengua_indigena);

        $(`input[name="radsinoviomu_petit-frmDatosPersonales${index}"][value="${violenciaVM}"]`).prop('checked', true);
        // Mostrar u ocultar sección según el valor adair 26/09/25
        const claseViolencia = `.frmviolenciam${index}`;
        if (violenciaVM === 'Si') {
            $(claseViolencia).removeClass('dis-none');
        } else {
            $(claseViolencia).addClass('dis-none');
        }


        //adair 25/09/2025
        const selectorpais = `#migorig_petit-frmDatosPersonales${index}`;
        cargarPais(selectorpais); // llena el select

        setTimeout(() => {
            const valor = pet.origen_migrante;
            if (valor) {
                if ($(selectorpais).find(`option[value="${valor}"]`).length === 0) {
                    $(selectorpais).append(`<option value="${valor}">${valor}</option>`);
                }
                $(selectorpais).val(valor).trigger('change');
            }
        }, 300);

        // adair 25/09/25
        const selectorestado = `#migdesti_petit-frmDatosPersonales${index}`;
        cargarEstado(selectorestado); // llena el select

        setTimeout(() => {
            const valor = pet.destino_migrante;
            if (valor) {
                if ($(selectorestado).find(`option[value="${valor}"]`).length === 0) {
                    $(selectorestado).append(`<option value="${valor}">${valor}</option>`);
                }
                $(selectorestado).val(valor).trigger('change');
            }
        }, 300);



        $(`#migprmex_petit-frmDatosPersonales${index}`).val(pet.primera_vezMexico);

        //casos contra mujeres
        $(`#vmcanadep_petit-frmDatosPersonales${index}`).val(pet.canalizacion);
        $(`#vmembara_petit-frmDatosPersonales${index}`).val(pet.embarazada);
        $(`#vmhijos_petit-frmDatosPersonales${index}`).val(pet.hijos_vivos);
        $(`#vmmodvio_petit-frmDatosPersonales${index}`).val(pet.modalidad_violencia);
        $(`#vmtvio_petit-frmDatosPersonales${index}`).val(pet.tipo_violencia);
        $(`#vmreviagr_petit-frmDatosPersonales${index}`).val(pet.relacion_agresor);
        $(`#vmingrmen_petit-frmDatosPersonales${index}`).val(pet.ingresos_mensuales);

        //  David 07 10 2025: Llamada a enlace btn guardar formulario datos personales
        actualizarDatosPeticionariosCedulas(idComplementoPetit, index);
        $('.frmEditDatosPersonales button[type="submit"]').show();

        const botonId = '#submitForm-' + index;
        const estatusF = estatus || calcularEstatus(row);

        if (estatusF === 'Completo' || estatusF === 'Eliminado') {
            $(botonId).hide();
        } else if (estatusF === 'Incompleto') {
            $(botonId).show();
        }

        chkNoproporcinado();
        seltxt();
        keypresscp();
    });
    console.log("valoresdatospersonales")
    $('#modalFormPeticionario').modal('show');
}


function mostrarCampoGenero(index, genero, otroGenero) {
    $(`#genero_petit-frmDatosPersonales${index}`).val(genero);
    if (genero === 'Otro') {
        $(`#ogenero_petit-frmDatosPersonales${index}`).val(otroGenero).show();
    } else {
        $(`#ogenero_petit-frmDatosPersonales${index}`).val('').hide();
    }
}

function actualizarUbicacionDesdeCopomex(cp, index) {
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



//Metodo para que se refleje la otra parte del formulario en el casi si,para violencia contyra mujeres adair 24/09/25
$(document).on('change', `input[name^="radsinoviomu_petit-frmDatosPersonales"]`, function () {
    const index = this.name.split('radsinoviomu_petit-frmDatosPersonales')[1];
    const valor = $(this).val();
    const claseViolencia = `.frmviolenciam${index}`;

    if (valor === 'Si') {
        $(claseViolencia).removeClass('dis-none');
    } else {
        $(claseViolencia).addClass('dis-none');
    }
});

// Adair 25 09 2025 Metodos copiados del respaldo
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

//  David 18 09 2025: Metodo que carga la lista de abogados remitentes, duplicado para pruebas
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

// Función para cargar los catálogos necesarios para mostrar en la tabla de cedulas, heredado de alta escrito DQO,duplicado para pruebas
function cargaCatalogos(idqueja, valoresSeleccionados = {}, callback) {
    $.ajax({
        type: "POST",
        url: listacatalogos,
        data: { identificadorQueja: idqueja },
        dataType: "JSON",
        success: function (response) {
            // Llenar selects con el valor correspondiente
            console.log("Input_LugarHechos_C:", valoresSeleccionados.lugarHechos);
            console.log("sedeRegistro_C:", valoresSeleccionados.sedeRegistro);
            CargaDatosSelectTabla(
                "#Input_LugarHechos_C",
                response.lista_municipio,
                valoresSeleccionados.lugarHechos ?? response.informarcionC.id_lugar_hechos
            );

            CargaDatosSelectTabla(
                "#sedeRegistro_C",
                response.lista_sedes,
                valoresSeleccionados.sedeRegistro ?? response.informarcionC.id_sede
            );

            if (callback) callback(response);
            console.log("Input_LugarHechos_C:", valoresSeleccionados.lugarHechos);
            console.log("sedeRegistro_C:", valoresSeleccionados.sedeRegistro);
        },
        error: function (error) {
            console.error("Error al cargar los catálogos:", error);
        }
    });
}
function cargaSelectsPorEscrito(idEscrito) {
    $.ajax({
        type: "POST",
        url: listacatalogos, // ← tu endpoint que recibe id_escrito
        data: { id_escrito: idEscrito },
        dataType: "JSON",
        success: function (response) {
            const sedeRegistro = response.sede_registro;
            const lugarHechos = response.lugar_hechos;

            if (!sedeRegistro && !lugarHechos) {
                console.warn("No se encontraron datos para los selects con id_escrito:", idEscrito);
                return;
            }

            // Asignar valores directamente a los selects
            $('#sedeRegistro').val(sedeRegistro).trigger('change');
            $('#Input_LugarHechos').val(lugarHechos).trigger('change');
        },
        error: function (err) {
            console.error("Error al obtener datos del escrito:", err);
        }
    });
}
// David 18 09 2025: Metodo heredado de alta escrito DQO, duplicado para pruebas
function CargaDatosSelectTabla(select, arreglo, valor) {
    $(select).empty(); // limpia cualquier contenido previo

    // Agrega una opción inicial
    $(select).append(`<option value="">- Seleccione una opción -</option>`);

    for (let v = 0; v < arreglo.length; v++) {
        let descripcion = arreglo[v].descripcion.trim();
        // Aquí el value ES el texto
        $(select).append(`<option value="${descripcion}">${descripcion}</option>`);
    }

    // Seleccionar el valor (que ahora es el texto)
    if (valor) {
        $(select).val(valor.trim()).trigger('change');
    }
}
function validaYEliminaFormatoDatosPersonales(idcomplemento, grupo) {
    Swal.fire({
        title: 'Eliminar Peticionario',
        text: '¿Desea eliminar este peticionario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (!result.isConfirmed) return;

        // Validación directa por estatus de la cédula
        const estatusCedula = grupo?.cedula?.estatus;

        if (estatusCedula === 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Acción no permitida',
                text: 'Este peticionario está ligado a una cédula activa y no se puede eliminar.',
                showConfirmButton: true
            });
            return;
        }

        // Proceder con la eliminación
        const FrmDelPetit = new FormData();
        FrmDelPetit.append('id_complemento', idcomplemento);
        console.log("Valor enviado a DeleteDatosPersonales:", idcomplemento);

        fetchPost("Expediente/DeleteDatosPersonales", "json", FrmDelPetit, (resp) => {
            if (resp.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Peticionario Eliminado',
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
}

function eliminarFormularioCedula(expedienteId, expediente, peticionarioCedula, id_tipo) {
    let idCedula = +expedienteId;
    let expedienteCedula = expediente;
    let idaportacion = id_tipo;

    // Validación: verificar si hay archivos adjuntos
    fetch(`/Expediente/ObtenerArchivosCedulas`, {
        method: 'POST',
        body: new URLSearchParams({ 'IdExpediente': idCedula, 'Expediente_Aportacion': expedienteCedula })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.archivos && data.archivos.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'No se puede eliminar',
                    text: 'La cédula tiene archivos adjuntos. Elimine primero los archivos antes de borrar la cédula.'
                });
                return; // 🚫 Detener aquí, no continuar con la eliminación
            }

            // Si no hay archivos, continuar con el flujo normal
            Swal.fire({
                title: 'Eliminar Cédula de Calificación',
                text: "¿Desea eliminar esta cédula ligada al peticionario " + peticionarioCedula + "?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then(function (resp) {
                if (!resp.isConfirmed) return;

                // Mostrar carga mientras se elimina
                Swal.fire({
                    text: 'Eliminando cédula...',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                // Llamada para eliminar la cédula
                $.ajax({
                    type: 'POST',
                    url: actualizaEstatusUrl,
                    data: { expediente_id: idCedula, expediente: expedienteCedula, id_tipo: idaportacion },
                    success: function (response) {
                        console.log('Respuesta del servidor:', response);

                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Cédula eliminada',
                                text: response.message || 'La cédula fue eliminada correctamente.',
                                timer: 1500,
                                showConfirmButton: false
                            });

                            Swal.fire({
                                text: 'Cargando cédulas...',
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

                        } else {
                            Swal.close();
                            Swal.fire('Error', response.message || 'Hubo un problema al eliminar la cédula.', 'error');
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.close();
                        Swal.fire('Error', 'Hubo un error al contactar con el servidor. Intenta nuevamente.', 'error');
                        console.error(error);
                    }
                });
            });
        })
        .catch(err => {
            console.error("Error al verificar archivos adjuntos:", err);
            Swal.fire('Error', 'No se pudo verificar si la cédula tiene archivos adjuntos.', 'error');
        });
}

function eliminarID(expedienteId, expediente, idtipo) {
    let idCedula = +expedienteId;
    let expedienteCedula = expediente;
    let idaport = idtipo
    const peticionarios = agrupado[idCedula]?.peticionarios || [];
    const tieneActivo = peticionarios.some(p => p.statusdp === 1);

    if (tieneActivo) {
        Swal.fire({
            icon: 'warning',
            title: 'Acción no permitida',
            text: 'Este ID está ligado a un formato de datos personales activo y no se puede eliminar.',
            showConfirmButton: true
        });
        return;
    }
    const claveAgrupado = `${expediente}_${idaport}`;
    const validarexp = agrupado[claveAgrupado]?.agrupacionAportacion || [];
    const expst = validarexp.some(e => e.estatus === 1);

    const tipocedula = agrupado[claveAgrupado]?.agrupacionAportacion || [];
    const apt = tipocedula.some(ap => ap.tipo_cedula === 'Aportación');

    if (apt && expst) {
        Swal.fire({
            icon: 'warning',
            title: 'Acción no permitida',
            text: 'Este expediente esta ligado a una cedula activa y no se puede eliminar.',
            showConfirmButton: true
        });
        return;
    }
    console.log("expediente", claveAgrupado);
    console.log("vexpediente", validarexp);
    console.log("cedula", tipocedula);
    console.log("ID", idaport);
    Swal.fire({
        title: 'Eliminar ID de la cédula',
        text: "¿Desea eliminar este ID?",
        icon: 'warning',
        input: "textarea",
        inputPlaceholder: "Ingrese el motivo por el cual desea eliminar la cédula",
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then(function (resp) {
        if (resp.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: actualizaIDUrl,
                data: {
                    expediente_id: idCedula,
                    expediente: expedienteCedula,
                    motivo: resp.value,
                    id_tipo: idaport

                },
                success: function (response) {
                    if (response.success) {

                        Swal.fire({
                            text: 'Cargando Cédulas...',
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
                                }
                                Swal.close();
                            },
                            error: function () {
                                Swal.fire('Error', 'No se pudo recargar la tabla de cédulas.', 'error');
                            }
                        });
                    } else {
                        Swal.fire('Error', response.message || 'Hubo un problema al eliminar el ID.', 'error');
                    }
                },
                error: function () {
                    Swal.fire('Error', 'Hubo un error al contactar con el servidor.', 'error');
                }
            });
        }
    });
}

// Función para eliminar la fila de la tabla (si la necesitas)
/*function eliminarFilaDeTabla(expedienteId) {
    const row = document.querySelector(`tr[data-expediente-id="${expedienteId}"]`);
    if (row) {
        row.remove();  // Elimina la fila de la tabla
    }
}*/


/// David 09/09/2025: Borrador de metodo para la logica de seleccion de formularios de cedulas aun con error en las llamadas a los forms
function abrirFormularioCedula(tipoCedula, datosCedula) {
    console.log("Tipo de cédula:", tipoCedula); // Verifica si está llegando el tipo de cédula correcto
    $('#divformularioCedula').empty(); // Se limpia el contenedor antes de agregar el nuevo formulario
    let formHtml = "";

    // Se agrega el formulario correspondiente segun el frm
    switch (tipoCedula) {
        case 'Orientación':
            console.log("Formulario de Orientación")
            formHtml = formOrientacionCedula('#', 'formularioAltaOrientacion');
            $('#divformularioCedula').append(formHtml);

            break;
        case 'Remisión':
            console.log("Formulario de Remisión");
            formHtml = formRemisionCedula('#', 'formularioremision', 4);
            cargarSelectAbogados(4);
            $('#divformularioCedula').append(formHtml);
            break;
        case 'Incompetencia':
            console.log("Formulario de Incompetencia");
            formHtml = formIncompetenciaCedula('#', 'formularioIncompetencia', 5);
            cargarSelectAbogados(5);
            $('#divformularioCedula').append(formHtml);
            break;
        case 'Antecedente':
            console.log("Formulario de Antecedente");
            formHtml = formAntecedenteCedula('#', 'formularioAntecedente');
            $('#divformularioCedula').append(formHtml);

            break;
        case 'Aportación':
            console.log("Formulario de Aportación");
            formHtml = formAportacionCedula('#', 'formularioaportacion');
            $('#divformularioCedula').append(formHtml);
            cargarSedes("#sedeRegistroAportacion_C")
            break;
        default:
            alert("Error, no se encontró la cédula: " + tipoCedula);
            return;
    }
    // Llamar a la función para cargar los catálogos y luego llenar el formulario con los datos
    cargaCatalogos(datosCedula.idqueja, {
        lugarHechos: datosCedula.lugar_hechos,
        sedeRegistro: datosCedula.sede_registro
    }, function () {
        llenarFormularioCedulas(datosCedula); // llena los seleccionables
    });
    if (datosCedula.peticionarios && datosCedula.peticionarios.length > 0) {
        $('#id_personas').val(datosCedula.peticionarios[0].Reg_recepcion || "");
        console.log("Valor cargado en id_personas:", $('#id_personas').val());
       
    }
    ArchivoCedula();
    // Mostrar el contenedor del modal
    $('#modalCedulas').modal('show');

}

function agregarCedula(row) {
    const tipoCedula = row.tipo_cedula || 'Sin Cédula';
    console.log("Tipo de cédula agregar:", tipoCedula); // Verifica si está llegando el tipo de cédula correcto

    $('#divformularioCedula').empty(); // Se limpia el contenedor antes de agregar el nuevo formulario
    let formHtml = "";

    // Se agrega el formulario correspondiente segun el frm
    switch (tipoCedula) {
        case 'Orientación':
            console.log("Formulario de Orientación")
            formHtml = InsertarOrientacionCedula('#', 'formularioAltaOrientacion');
            $('#divformularioCedula').append(formHtml);
            break;
        case 'Remisión':
            console.log("Formulario de Remisión");
            formHtml = InsertarRemisionCedula('#', 'formularioremision', 4);
            cargarSelectAbogados(4);
            $('#divformularioCedula').append(formHtml);
            break;
        case 'Incompetencia':
            console.log("Formulario de Incompetencia");
            formHtml = InsertarIncompetenciaCedula('#', 'formularioIncompetencia', 5);
            cargarSelectAbogados(5);
            $('#divformularioCedula').append(formHtml);
            break;
        case 'Antecedente':
            console.log("Formulario de Antecedente");
            formHtml = InsertarAntecedenteCedula('#', 'formularioAntecedente');
            $('#divformularioCedula').append(formHtml);
            break;
        case 'Aportación':
            console.log("Formulario de Aportación");
            formHtml = InsertarAportacionCedula('#', 'formularioaportacion');
            $('#divformularioCedula').append(formHtml);
            cargarSedes("#sedeRegistroAportacion_C")
            break;
        default:
            alert("Error, no se encontró la cédula: " + tipoCedula);
            return;
    }
    // Carga de catalogos para el formulario sin datos
    cargaCatalogos(row.id_escrito, {
        lugarHechos: null,
        sedeRegistro: null
    });
    // Carga ID expediente generado
    $('#Input_ID').val(row.id_escrito || "").prop('disabled', true);
    // ID único de la aportación
    $('#Input_IdAportacion_C').val(row.id_tipo || "");

    if (row.expediente && row.expediente.includes('-')) {
        const [numeroExpediente, añoExpediente] = row.expediente.split('-');
        $('#Input_ExpedienteAportacion_C').val(numeroExpediente || "").trigger('change').prop('disabled', true);
        $('#Input_year').val(añoExpediente || "").prop('disabled', true);
    }

    if (row.peticionarios && row.peticionarios.length > 0) {
        const selectHtml = selectPeticionarioCedula(
            row.id_escrito,
            row.peticionarios,
            'Input_Peticionario',
            null // No hay seleccionado aún porque es nuevo
        );
        $('.listapet').append(selectHtml);

        // Escuchar el cambio en el select
        $('#Input_Peticionario').on('change', function () {
            const selectedReg = $(this).val(); // valor del option (Reg_recepcion)
            const peticionario = row.peticionarios.find(p => p.Reg_recepcion == selectedReg);

            if (peticionario) {
                $('#id_personas').val(peticionario.Reg_recepcion || "");
                $('#tipo_usuario').val(peticionario.tipo_usuario || "");
                $('#genero').val(peticionario.genero || "");
                $('#edad').val(peticionario.edad || "");
                $('#via_interposicion').val(peticionario.via_interposicion || "");
                $('#sexo').val(peticionario.sexo || "");

                console.log("Peticionario seleccionado:", peticionario);
            }
        });

        // Opcional: cargar el primero por defecto
        const primerPeticionario = row.peticionarios[0];
        if (primerPeticionario) {
            $('#id_personas').val(primerPeticionario.Reg_recepcion || "");
            $('#tipo_usuario').val(primerPeticionario.tipo_usuario || "");
            $('#genero').val(primerPeticionario.genero || "");
            $('#edad').val(primerPeticionario.edad || "");
            $('#via_interposicion').val(primerPeticionario.via_interposicion || "");
            $('#sexo').val(primerPeticionario.sexo || "");
        }


        // FECHA Y HORA DE RECEPCIÓN (del expediente)
        if (row.dp_fecha_registro) {
            const fecha = new Date(row.dp_fecha_registro);

            // Fecha en formato YYYY-MM-DD
            const fechaFormateada = fecha.toISOString().split('T')[0];
            $('#Input_FechaRecepcion_C').val(fechaFormateada || "").prop('disabled', true);

            // Hora en formato HH:MM:SS
            const horaFormateada = fecha.toTimeString().split(' ')[0]; // "12:26:52"
            $('#Input_HoraRecepcion_C').val(horaFormateada || "").prop('disabled', true);
        } else {
            $('#Input_FechaRecepcion_C').val("");
            $('#Input_HoraRecepcion_C').val("");
        }


    }

    ArchivoCedula();
    // Mostrar el contenedor del modal
    $('#modalCedulas').modal('show');

    console.log("idaportacion", row.id_tipo);
}
//16/12/2025
function ArchivoCedula() {
    $(document).on('click', '.upload-field', function () {
        var file = $(this).parent().parent().parent().find('.input-file');
        file.trigger('click');
    });

    $(document).on('change', '.input-file', function () {
        $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

    // Manejo para abrir el pdf adjunto en la cedula

    if (document.querySelector('#foto')) {
        var foto = document.querySelector("#foto");

        foto.onchange = function (e) {
            var uploadFoto = document.querySelector('#foto').value;
            var fileimg = document.querySelector("#foto").files;
            var nav = window.URL || window.webkitURL;
            var contactAlert = document.querySelector('#form_alert');

            if (uploadFoto != '') {
                var type = fileimg[0].type;
                var name = fileimg[0].name;
                if (type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png') {
                    contactAlert.innerHTML = '<p class="errorArchivo">El archivo no tiene un formato válido.</p';
                    if (documnet.querySelector('#img')) {
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
                    document.querySelector('.prevPhoto div').innerHTML = "<img id ='img' src=" + objeto_url + ">";
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
        var delPhoto = document.querySelector("#delPhoto");
        delPhoto.onclick = function (e) {
            removePhoto();
        }
    }
} 

// Metodo que hace la carga de archivos - editando
function cargaArchivosCedula(cedula, tipo_cedula, id_escrito, expediente) {
    let html = "";
    let rutaDocumentoCedula = '../Uploads/Archivos_Cedulas/';
    // La ruta Archivos_Cedulas se definieron en los metodos de guardado de cedula (GuardarOrientacion) aqui solo referenciamos
    // OJO Esta ruta es LOCAL, cuando se haga la migracion al server se necesitara cambiar esta direccion

    // Llamada al controlador para obtener los archivos adjuntos usando el idExpediente y tipoCedula
    fetch(`/Expediente/ObtenerArchivosCedulas`, {
        method: 'POST',
        body: new URLSearchParams({ 'IdExpediente': id_escrito, 'Expediente_Aportacion': expediente })
    })
        .then(res => res.json())
        .then(data => {
            // Caso: Consulta exitosa
            if (data.success) {
                console.log("Consulta exitosa de archivos");
                // Caso: No hay archivos adjuntos para el expediente
                if (!data.archivos || data.archivos.length === 0) {
                    document.getElementById("containerImages").innerHTML = "<p>No hay archivos adjuntos disponibles</p>";
                    return;
                }
                console.log(data);
                // Recorrer cada archivo
                data.archivos.forEach((archivoObj, index) => {
                    console.log(archivoObj);
                    //if (!archivoObj.Nombre_Archivo || !archivoObj.Tipo_Archivo) {
                    //  return; // Saltar si falta información
                    //}

                    let rutaNormalizada = archivoObj.nombre_Archivo.replaceAll(/\\/g, "/");
                    console.log(rutaNormalizada);
                    let id = `${cedula.id_escrito}_${index}`;
                    console.log(id);
                    let tipo = archivoObj.tipo_Archivo.toLowerCase();
                    console.log(tipo);
                    let clase = `removadj${id}`;
                    console.log(clase);

                    // Vista previa
                    let vistaPrevia = "";
                    if (tipo === ".jpg" || tipo === ".png") {
                        vistaPrevia = `<img class="${clase}" src="${rutaDocumentoCedula + rutaNormalizada}">`;
                    } else if (tipo === ".pdf") {
                        vistaPrevia = `<img class="${clase}" src="${rutaDocumentoCedula}/pdf_file.png">`;
                    } else {
                        vistaPrevia = `<p class="${clase}">Archivo adjunto (${tipo})</p>`;
                    }

                    // Construir HTML por archivo
                    html += `
                    <div data-contup="${id}" class="divuploads ${clase}" id="div${id}">
                        <div class="prevImage ${clase}">
                            ${vistaPrevia}
                        </div>
                        <button class="btnVerAdj ${clase}" type="button" onclick="verArchivoCedula('${id}','${archivoObj.nombre_Archivo}','${tipo}', '${rutaDocumentoCedula}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btnDeleteImage ${clase}" type="button" onclick="fntDelItemCedula(${archivoObj.id_Archivo_Cedulas})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    `;
                });
                document.getElementById("containerImages").innerHTML = html;

                const estatusCedula = cedula && cedula.estatus == 1;

                if (estatusCedula > 0) {
                    $('.btnDeleteImage').hide();
                    console.log("Botón delete ocultado (Completo)");
                } else {
                    $('.btnDeleteImage').show();
                    console.log("Botón delete mostrado (Incompleto)");
                }

            } else {
                alert("Error al obtener archivos adjuntos");
            }
        })
        .catch(err => console.error("Error:", err));
}
function obtenerDatosCedula() {
    return {
        idqueja: $('#idQuejaActual').val(),
        lugar_hechos: $('#lugarHechosActual').val(),
        sede_registro: $('#sedeRegistroActual').val()
    };
}

function activarCargaDeArchivos() {
    $(document).on('click', '.abrir-explorador', function () {
        $(this).closest('#contenedorArchivo').find('.input-file').click();
    });

    $(document).on('change', '.input-file', function () {
        const archivos = Array.from(this.files).map(file => file.name).join(', ');
        $(this).closest('#contenedorArchivo').find('.nombre-archivo').val(archivos);
    });
}
/*
 * David 17 09 2025: Metodo que llena con la informacion correspondiente cada formulario
 * Aqui nos auxiliamos de que los datos ya estan organizados por IDs entonces el metodo funciona de forma casi global
 * Pendiente: error en los select que tienen catalogo, parece que la llamada ajax que trae los catalogos no se completa cuando traemos el formulario mediante el modal
 */
function llenarFormularioCedulas(cedula) {
    $('#Input_ID').val(cedula.id_escrito || "").prop('disabled', true);


    $('#Input_folio_C').val(cedula.folio || "").trigger('change');

    // SELECT PETICIONARIO(S)

    $('.listapet').append(

        selectPeticionarioCedula(cedula.id_escrito, cedula.peticionarios, 'Input_Peticionario', cedula.Reg_recepcion)

    );

    $('#Input_Peticionario').prop('disabled', true);


    // LUGAR DE RECEPCIÓN
    if (cedula.lugar_hechos) {
        $('#Input_LugarHechos_C').val(cedula.lugar_hechos).trigger('change');
    } else {
        $('#Input_LugarHechos_C').val('No disponible').trigger('change');
    }

    // FECHA DE RECEPCIÓN
    console.log("Fecha registro expediente:", cedula.dp_fecha_registro);
    // FECHA Y HORA DE RECEPCIÓN (del expediente)
    if (cedula.dp_fecha_registro) {
        const fecha = new Date(cedula.dp_fecha_registro);

        // Fecha en formato YYYY-MM-DD
        const fechaFormateada = fecha.toISOString().split('T')[0];
        $('#Input_FechaRecepcion_C').val(fechaFormateada || "").prop('disabled', true);

        // Hora en formato HH:MM:SS
        const horaFormateada = fecha.toTimeString().split(' ')[0]; // "12:26:52"
        $('#Input_HoraRecepcion_C').val(horaFormateada || "").prop('disabled', true);
    } else {
        $('#Input_FechaRecepcion_C').val("");
        $('#Input_HoraRecepcion_C').val("");
    }

    // AUTORIDAD PRESUNTAMENTE RESPONSABLE
    $('#Input_autoridadresp_C').val(cedula.autoridad || "");

    // NO OFICIO GENERADO
    $('#Input_numOficio_C').val(cedula.numero_oficio || "");

    // INSTITUCIÓN
    $('#Input_institucion_C').val(cedula.institucion || "");

    // REMITENTE
    if (cedula.remitente) {
        $('#nomAbogado5').val(cedula.remitente).prop('disabled', false);
        $('#nomAbogado4').val(cedula.remitente).prop('disabled', false);
    } else {
        $('#nomAbogado').val('No disponible').prop('disabled', true);
    }

    // EXPLICACIONES
    $('#ExplicacionCedula').val(cedula.explicacion || "");
    console.log('explicaccion', cedula.explicacion);

    // SEDE DE REGISTRO
    if (cedula.sede_registro) {
        $('#sedeRegistro_C').val(cedula.sede_registro).trigger('change');
    } else {
        $('#sedeRegistro_C').val('No disponible').trigger('change');
    }

    $('#Input_NombrePetAportacion_C').val(cedula.peticionario).prop('disabled', true);

    //expediente aportacion
    if (cedula.expediente && cedula.expediente.includes('-')) {
        const [numeroExpediente, añoExpediente] = cedula.expediente.split('-');
        $('#Input_ExpedienteAportacion_C').val(numeroExpediente).trigger('change').prop('disabled', true);
        $('#Input_year').val(añoExpediente).trigger('change').prop('disabled', true);
    } else {
        $('#Input_ExpedienteAportacion_C').val('').trigger('change');
        $('#Input_year').val('').trigger('change');
    }
    // ID único de la aportación
    $('#Input_IdAportacion_C').val(cedula.id_tipo || "");
    cargaArchivosCedula(cedula, cedula.tipo_cedula, cedula.id_escrito, cedula.expediente);


}

//16/12/2025
function selectPeticionarioCedula(idqueja, peticionariosArr, idelement, idSeleccionado = null) {
    let html = "";
    if (!peticionariosArr || peticionariosArr.length === 0) {
        return "<p>No hay peticionarios disponibles</p>";
    }

    document.querySelectorAll('.delselectei').forEach(p => p.remove());

    html = `<label for="textfield" class="delselectei" style="margin-left: 65%;">Peticionario/Agraviado:&nbsp;</label>
            <select id="${idelement}" name="${idelement}" style="margin-left: auto;" class="col-lg-2 delselectei">
                <option class="delselectei" value="">Seleccione una opción</option>`;
    // Recorre todos los perticionarios del expediente para encontrar el que hizo la cedula (en caso de que haya) y aparezca pre seleccionado
    peticionariosArr.forEach(p => {
        const nombreCompleto = `${p.nombre} ${p.apellidoPaterno || ''} ${p.apellidoMaterno || ''}`.trim();
        const selected = (idSeleccionado && p.Reg_recepcion == idSeleccionado) ? "selected" : "";
        html += `<option class="delselectei" value="${p.Reg_recepcion}" ${selected}>${nombreCompleto}</option>`;
    });
    console.log("ID seleccionado:", idSeleccionado);
    console.log("Lista de peticionarios:", peticionariosArr);

    html += `</select>`;
    return html;
}

$(document).ready(function () {


    $("#buscar_idqueja").click(function (e) {
        e.preventDefault();
        var idusuario = $('#idusuario').val();
        var usuario = $('#usuario').val();


        $('#txt_abogado').val($('#idusuario').val());
        $('#txt_abogado_rol').val($('#grupohub').val());

        Swal.fire({
            title: 'Cargando Quejas',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,

            // --- Estilos de la Ventana ---
            background: '#ffffff',
            color: '#334155',
            backdrop: `
        rgba(15, 23, 42, 0.2)
        backdrop-filter: blur(8px)
    `,

            // --- Inyectamos el Skeleton en lugar del Spinner feo ---
            html: `
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
            Estamos preparando la información, por favor espera.
        </p>
        <div class="swal-skeleton-container">
            <div class="swal-skeleton-line" style="width: 100%; height: 35px;"></div>
        </div>

        <style>
            .swal-skeleton-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px 5px;
            }
            .swal-skeleton-line {
                background: #eee;
                background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                background-size: 200% 100%;
                border-radius: 6px;
                animation: swalShine 1.5s linear infinite;
            }
            @keyframes swalShine {
                to { background-position-x: -200%; }
            }
            /* Ocultamos el spinner clásico por defecto de SweetAlert */
            .swal2-loader {
                display: none !important;
            }
        </style>
    `,

            customClass: {
                popup: 'rounded-3xl shadow-2xl',
            },

            didOpen: () => {
                // Quitamos el showLoading() original para que no dibuje el círculo azul clásico
            }
        });

        $.ajax({
            type: "POST",
            url: "BuscardorFormatos",
            data: $('#frm_busquedaFormatos').serialize(),
            dataType: "JSON",
            success: function (response) {
                // SOLUCIÓN: Cerramos el Swal de manera nativa e inmediata, liberando el navegador
                Swal.close();

                console.log(response.data);

            // Ahora el navegador dibuja la tabla sin el "lag" del modal anterior

                mostrarResTblFormatos(response.data);
                var intro = document.getElementById('tableEditFormatosDqot tr');
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
        escolaridadInicioTabla = Escolaridad.slice(0, 9);
        escolaridadFinalTabla = Escolaridad.slice(10);
    })
    fetchGet("Expediente/SelectEstadoConyugal", "json", (data) => { EstadoConyugalTabla = data.estadoconyugal; })
    fetchGet("Expediente/SelectOcupacion", "json", (data) => { OcupacionTabla = data.ocupacion; })
    fetchGet("Expediente/SelectDiscapacidad", "json", (data) => { DiscapacidadTabla = data.discapacidad; })
    fetchGet("Expediente/SelectGrupoSocial", "json", (data) => { GrupoSocialTabla = data.gruposocial; })
    fetchGet("Expediente/SelectHijosVivos", "json", (data) => { HijosVivosAlta = data.hijosvivos; })
    fetchGet("Expediente/SelectModalidadViolencia", "json", (data) => { ModalidadViolenciaTabla = data.modalidadviolencia; })
    fetchGet("Expediente/SelectTipoViolencia", "json", (data) => { TipoViolenciaTabla = data.tipoviolencia; })
    fetchGet("Expediente/SelectRelacionAgresor", "json", (data) => { RelacionAgresorTabla = data.relacionagresor; })
    fetchGet("Expediente/SelectVisitadurias", "json", (data) => { visitaduriasTabla = data.visitadurias; })
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
        e.preventDefault();
        var seleccion = $("#origenPetExt option:selected").val();
        $('#origenPetvalExt').val($("#origenPetExt option:selected").val());

    });
    $(document).on('change', '#CheckDcompleta', function (event) {

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
    $(document).on('click', '#icono_agregar', function (e) {
        e.preventDefault();

        let arrNumPet = [];
        let autoridades = document.querySelectorAll('.arrInput_nombres');

        // Recolecta los IDs existentes
        for (let i = 0; i < autoridades.length; i++) {
            let valor = parseInt(autoridades[i].dataset.idinei);
            if (!isNaN(valor)) {
                arrNumPet.push(valor);
            }
        }

        // Calcula el máximo y el siguiente índice
        let npmax = (arrNumPet.length > 0) ? Math.max.apply(null, arrNumPet) : 0;
        let nfin = npmax + 1;

        console.log("npmax:", npmax, "nfin:", nfin);

        // Valida que el último bloque tenga al menos un campo lleno
        if (
            $('#Input_nombres' + npmax).val() != '' ||
            $('#Input_cargo' + npmax).val() != '' ||
            $('#Input_autoridades' + npmax).val() != ''
        ) {
            // Genera el nuevo bloque
            let bloque = Agrega_PersonaAutoridadvalvacio(nfin);
            $('#Contenedor_Cargos_Personas').append(bloque);

            // Carga las opciones y luego inicializa select2
            fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
                let autoridad = data.lista2;
                let selector = "#Input_autoridades" + nfin;
                CargaDatosSelecAutori(selector, autoridad);
                $(selector).select2(); // inicializar después de cargar opciones
            });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Para agregar otra autoridad debe llenar al menos un campo del anterior',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
    $(document).on('click', '#Eliminare', function (event) {/*Evento del check, datos complementarios de la calle*/
        e.preventDefault();
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
    $(document).on('click', '#icono_eliminar', function (e) {/*Evento del check, datos complementarios de la calle*/
        e.preventDefault();
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
        e.preventDefault();
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

    /// 29 09 2025 Pendiente utilizar despues de eliminar una cedula
    function obtenerYMostrarCedulas() {
        var idusuario = $('#idusuario').val();
        var usuario = $('#usuario').val();
        $('#txt_abogado').val($('#idusuario').val());
        $('#txt_abogado_rol').val($('#grupohub').val());

        Swal.fire({
            text: 'Cargando Cédulas...',
            didOpen: () => {
                Swal.showLoading();
            },
            timer: 20000,
            timerProgressBar: true,
        });

        $.ajax({
            type: "POST",
            url: "TablaObtenerCedulas",
            data: $('#frm_busquedorCedulas').serialize(),
            dataType: "JSON",
            success: function (response) {
                Swal.fire({ showConfirmButton: false, timer: 1 });
                console.log(response.data);
                mostrarTablaCedulas(response.data);
            },
            error: function () {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error al obtener las cédulas.',
                    showConfirmButton: true
                });
            }
        });
    }


    //  David 02 09 2025: Evento btn buscador cedulas provisionales

    $("#buscar_idCedulas").click(function (e) {
        e.preventDefault();
        var idusuario = $('#idusuario').val();
        var usuario = $('#usuario').val();
        $('#txt_abogado').val($('#idusuario').val());
        $('#txt_abogado_rol').val($('#grupohub').val());
        Swal.fire({
            text: 'Cargando Cédulas...',
            didOpen: () => {
                Swal.showLoading();
            },
            timer: 20000,
            timerProgressBar: true,
        });
        $.ajax({
            type: "POST",
            url: "TablaObtenerCedulas",    // controlador
            data: $('#frm_busquedorCedulas').serialize(),
            dataType: "JSON",
            success: function (response) {
                Swal.fire({
                    showConfirmButton: false,
                    timer: 1
                });
                console.log(response.data)
                // Llamada al metodo que hara el formateo de la tabla con los datos
                mostrarTablaCedulas(response.data);
                var intro = document.getElementById('#frm_busquedorCedulas tr');
            },
            error: function () {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error al obtener las cédulas.',
                    showConfirmButton: true
                });
            }
        });

    });

    



   // tableBuscadorCedulas.DataTable().on("draw", function (data) {

     //   activarBtnTurnopre();

//    }) 


});

/// Adair 08 09 2025: Borrador del metodo que formateara la tabla de las cedulas
function mostrarTablaCedulas(response) {
    const datosAgrupados = agruparPorCedulas(response);

    const datosFiltrados = datosAgrupados.filter(grupo => {
        // Excluir los eliminados definitivos
        if (grupo.peticionarios?.every(p => Number(p.statusdp) === 2)) {
            return false;
        }

        const esCedulaActiva = Number(grupo.estatus_columna) === 1;
        const tienePeticionarioActivoSinCedula = !grupo.cedula && grupo.peticionarios.some(p => Number(p.statusdp) === 1);
        const tienePeticionarioEliminado = grupo.peticionarios.some(p => Number(p.statusdp) === 0);
        const disponibleParaEliminacion = Number(grupo.estatus_columna) === 0
            && grupo.peticionarios.length > 0
            && grupo.peticionarios.every(p => Number(p.statusdp) === 0);

        return esCedulaActiva || tienePeticionarioActivoSinCedula || tienePeticionarioEliminado || disponibleParaEliminacion;
    });


    console.log("IDs que se pintan en el DataTable:", datosFiltrados.map(g => g.id_escrito));
    $('#tablaCedulas').DataTable({

        language: { url: '/js/TablaJson.json' },
        destroy: true,
        data: aplicarFiltros(datosFiltrados),
        columns: [
            {
                className: 'details-control',
                defaultContent: '',
                data: null,
                orderable: false
            },
            {
                title: 'Expediente / ID',
                data: 'id_escrito', // este es el valor base que DataTables pasa como "data"
                render: function (data, type, row) {
                    // Variable que decide qué mostrar en la columna
                    const mostrar = row.tipo_cedula === 'Aportación'
                        ? row.expediente   // si es aportación, mostrar el expediente
                        : row.id_escrito;  // si no, mostrar el id_escrito

                    // Variable que decide qué ID usar para la bitácora
                    const id = row.tipo_cedula === 'Aportación'
                        ? row.id_tipo   // ID real de aportación
                        : row.id_escrito;     // ID real de expediente

                    // Función dinámica según el tipo
                    const funcion = row.tipo_cedula === 'Aportación'
                        ? `btnGenraBitacoraportacion(${id})`
                        : `btnGenraBitacorCamb(${id})`;

                    return `
                    ${mostrar}
                      <br/>
                     <button type="button" title="Bitácora de cambios"
                         onclick="${funcion}"
                         class="btn btn-link margin-iconbf">
                         <img src="../icons/personalizados/detective.png" height="35"/>
                     </button>
                    `;
                }
            },
            {
                title: 'TIPO ESCRITO',
                data: 'tipo_cedula',
                render: data => data || 'Pendiente'
            },
            {
                title: 'FORMATO DATOS PERSONALES',
                data: null,
                render: function (data, type, row) {
                    const activos = (row.peticionarios || []).filter(p => parseInt(p.statusdp) === 1);
                    const eliminados = (row.peticionarios || []).filter(p => parseInt(p.statusdp) === 0);
                    let contenido = '';

                    // Fecha de referencia
                    let fechaBase = activos[0]?.fecha_registro || row.dp_fecha_registro || row.fecha_recepcion;
                    let ahora = new Date();
                    let diferenciaHoras = fechaBase ? (ahora - new Date(fechaBase)) / (1000 * 60 * 60) : 0;
                    let expiro = diferenciaHoras > 72;

                    // NUEVA CONDICIÓN: si estatus_columna y todos los peticionarios están en 0
                    if (Number(row.estatus_columna) === 0 && eliminados.length > 0 && activos.length === 0) {
                        contenido = `
                           <button type='button' title='Agregar nuevo peticionario'
                            onclick='agregarDatosPersonalesCedula(${row.id_escrito})'
                            class='btn btn-link margin-iconbf'>
                            <span class='fa fa-user-plus color-muted fa-2x'></span>
                           </button>
                        `;
                    } else if (row.tipo_cedula === 'Aportación') {
                        contenido = `<span class="badge badge-secondary">N/A</span>`;
                    } else if (activos.length > 1) {
                        // Agrupar por tipo_usuario
                        const conteoPorTipo = activos.reduce((acc, pet) => {
                            acc[pet.tipo_usuario] = (acc[pet.tipo_usuario] || 0) + 1;
                            return acc;
                        }, {});

                        // Construir badges por cada tipo
                        let badges = Object.entries(conteoPorTipo).map(([tipo, cantidad]) => {
                            return `
                    <span class="badge badge-info" style="margin-right:5px;">
                        ${cantidad} ${tipo}${cantidad > 1 ? 's' : ''} activos
                    </span>
                `;
                        }).join('');

                        contenido = `<div>${badges}</div>`;
                    } else if (activos.length === 1) {
                        const pet = activos[0];
                        const peticionarioStr = JSON.stringify(row).replace(/"/g, '&quot;');
                        const grupoStr = JSON.stringify(row).replace(/"/g, '&quot;');

                        if (row.estatus === 'Completo') {
                            contenido = `
                    <div><strong>${pet.tipo_usuario}: ${pet.nombre}</strong></div>
                    <button type='button' title='Ver ${pet.tipo_usuario}'
                        class='btn btn-link margin-iconbf'
                        onclick='verFormatoDP(${peticionarioStr})'>
                        <span class='fa fa-search color-muted fa-2x'></span>
                    </button>
                `;
                        } else {
                            if (!expiro) {
                                contenido = `
                        <div><strong>${pet.tipo_usuario}: ${pet.nombre}</strong></div>
                        <button type='button' title='Editar ${pet.tipo_usuario}'
                            class='btn btn-link margin-iconbf'
                            onclick='verFormatoDP(${peticionarioStr})'>
                            <span class='fa fa-pencil color-muted fa-2x'></span>
                        </button>
                        <button type='button' title='Eliminar ${pet.tipo_usuario}'
                            class='btn btn-link margin-iconbf'
                            onclick="validaYEliminaFormatoDatosPersonales('${pet.idCompPeticionario}', ${grupoStr})">
                            <span class='fa fa-trash color-danger fa-2x'></span>
                        </button>
                        <button type='button' title='Agregar nuevo ${pet.tipo_usuario}'
                            onclick='agregarDatosPersonalesCedula(${row.id_escrito})'
                            class='btn btn-link margin-iconbf'>
                            <span class='fa fa-user-plus color-muted fa-2x'></span>
                        </button>
                    `;
                            } else {
                                contenido = `
                        <div><strong>${pet.tipo_usuario}: ${pet.nombre}</strong></div>
                        <button type='button' title='Ver ${pet.tipo_usuario}'
                            class='btn btn-link margin-iconbf'
                            onclick='verFormatoDP(${peticionarioStr})'>
                            <span class='fa fa-search color-muted fa-2x'></span>
                        </button>
                    `;
                            }
                        }
                    } else {
                        // Ningún peticionario activo
                        if (row.estatus === 'Completo') {
                            contenido = `<span class="badge badge-info">Sin peticionarios (visualización)</span>`;
                        } else {
                            if (!expiro) {
                                contenido = `
                                    <button type='button' title='Agregar nuevo peticionario'
                                        onclick='agregarDatosPersonalesCedula(${row.id_escrito})'
                                        class='btn btn-link margin-iconbf'>
                                        <span class='fa fa-user-plus color-muted fa-2x'></span>
                                    </button>
                                `;
                            } else {
                                contenido = `<span class="badge badge-secondary">No disponible para su modificación</span>`;
                            }
                        }
                    }

                    return contenido;
                }
            },
            {
                title: 'CÉDULA DE CALIFICACIÓN',
                render: function (data, type, row) {
                    const estatus = row.estatus;
                    let fechaBase = row.cedula?.fecha_registro || row.dp_fecha_registro || row.fecha_recepcion;
                    let ahora = new Date();
                    let diferenciaHoras = fechaBase ? (ahora - new Date(fechaBase)) / (1000 * 60 * 60) : 0;
                    let expiro = diferenciaHoras > 72;

                    if (estatus === 'Completo') {
                        if (row.cedula) {
                            const cedulaConPeticionarios = { ...row.cedula, peticionarios: row.peticionarios || [] };
                            const cedulaStr = JSON.stringify(cedulaConPeticionarios).replace(/"/g, '&quot;');
                            return `
                                <button type='button' title='Ver cédula'
                                    class='btn btn-link margin-iconbf'
                                    onclick='abrirFormularioCedula("${row.cedula.tipo_cedula}", ${cedulaStr})'>
                                    <span class='fa fa-search color-muted fa-2x'></span>
                                </button>
                            `;
                        }
                        return `<span class="badge badge-secondary">Cédula no disponible</span>`;
                    } else {
                        // Mostrar botón de Agregar Cédula si no ha expirado
                        // O si estatus_columna = 0 y todos los peticionarios.statusdp = 0
                        if (
                            !expiro ||
                            (Number(row.estatus_columna) === 0 &&
                                row.peticionarios &&
                                row.peticionarios.every(p => Number(p.statusdp) === 0))
                        ) {
                            const rowSinCedula = JSON.stringify(row).replace(/"/g, '&quot;');
                            return `
                                <button type='button' title='Agregar Cédula'
                                    class='btn btn-link margin-iconbf'
                                    onclick='agregarCedula(${rowSinCedula})'>
                                    <img src="../icons/personalizados/add-file.png" height="40">
                                </button>
                            `;
                        }

                        return `<span class="badge badge-secondary">No disponible para su modificación</span>`;
                    }
                }
            },
            {
                title: 'FECHA REGISTRO',
                data: null,
                render: function (data, type, row) {
                    const pet = row.peticionarios?.[0];
                    // 1. Si hay fecha en peticionario
                    if (pet?.fecha_registro) {
                        const fechaFormateada = pet.fecha_registro.split('T')[0];
                        const horaFormateada = pet.fecha_registro.split('T')[1].split('.')[0];
                        return `${fechaFormateada} ${horaFormateada}`;
                    }
                    // 2. Si no hay peticionario, usar la fecha del grupo (expediente)
                    else if (row.dp_fecha_registro) {
                        const fechaFormateada = row.dp_fecha_registro.split('T')[0];
                        const horaFormateada = row.dp_fecha_registro.split('T')[1].split('.')[0];
                        return `${fechaFormateada} ${horaFormateada}`;
                    }
                    // 3. Fallback aportaciones
                    else if (row.fecha_recepcion && row.hora_recepcion) {
                        const fechaFormateada = row.fecha_recepcion.split('T')[0];
                        return `${fechaFormateada} ${row.hora_recepcion}`;
                    }
                    return 'Sin información';
                }
            },
            {
                title: 'VÍA INTERPOSICIÓN',
                data: null,
                render: function (data, type, row) {
                    const pet_via = row.peticionarios?.[0]?.via_interposicion;
                    const via_num = pet_via || row.dp_via_interposicion; // <-- fallback al valor del expediente
                    if (via_num) {
                        switch (via_num) {
                            case 1: return "Física";
                            case 2: return "Telefónica";
                            case 3: return "WhatsApp";
                            case 4: return "E-mail";
                            case 5: return "Correspondencia";
                            case 6: return "Remisión";
                            case 7: return "Oficio";
                            case 8: return "Escrito";
                        }
                    }
                    if (row.via_interposicion) {
                        return row.via_interposicion;
                    }
                    return 'Sin información';
                }
            },
            {
                title: 'ESTATUS',
                render: function (data, type, row) {
                    // Usamos directamente el campo "estatus" que ya se calculó previamente
                    let estatus = row.estatus || 'Pendiente';
                    let badgeClass = 'badge-secondary';
                    let pendientes = [];

                    // Definimos el color del badge
                    if (estatus === 'Completo') {
                        badgeClass = 'badge-success';
                    } else if (estatus === 'Incompleto') {
                        badgeClass = 'badge-danger';
                        // Mostrar qué formulario falta
                        if (row.tipo_cedula !== 'Aportación') {
                            if (!row.peticionarios || !row.peticionarios.some(p => p.statusdp == 1)) {
                                pendientes.push('Datos personales');
                            }
                        }
                        if (!row.cedula || row.cedula.estatus == 0) {
                            pendientes.push('Cédula de calificación');
                        }
                    } else if (estatus === 'Eliminado') {
                        badgeClass = 'badge-dark';
                    }

                    // Mostrar detalles de pendientes, si es que hay
                    let pendientesMostrar = '';
                    if (pendientes.length > 0) {
                        pendientesMostrar = `
               <div class="badge badge-secondary">
               <div class="badge-pill badge-dark">Pendientes:</div> 
               ${pendientes.join('<br>')}
            </div>`;
                    }

                    return `
          <div class="badge status-badge ${badgeClass}">${estatus}</div><br>
          ${pendientesMostrar}
        `;
                }
            }

        ],
        //order: [[1, 'desc']] // Orden por ID
        order: [[5, 'desc']]    // Orden por Fecha
    });
    // 4. Enganchar los inputs para refrescar la tabla
    $('#frm_busquedorCedulas input, #frm_busquedorCedulas select').on('keyup change', function () {
        var filtrados = aplicarFiltros(datosFiltrados);
        var table = $('#tablaCedulas').DataTable();
        table.clear().rows.add(filtrados).draw();
    });

}


///filtro tabla cedulas
function normalizar(texto) {
    return texto
        ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";
}


function aplicarFiltros(datos) {
    //  Normaliza cadenas: minúsculas, sin espacios y sin acentos
    function normalizar(str) {
        return (str || '')
            .toString()
            .trim()
            .toLowerCase()
            .normalize("NFD")                // descompone caracteres con acento
            .replace(/[\u0300-\u036f]/g, ""); // elimina los acentos
    }

    //  Normaliza fechas a YYYY-MM-DD
    function normalizarFecha(fechaStr) {
        if (!fechaStr) return null;
        fechaStr = fechaStr.trim();

        if (fechaStr.includes('T')) return fechaStr.split('T')[0];
        if (fechaStr.includes(' ')) return fechaStr.split(' ')[0];
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
            const [d, m, y] = fechaStr.split('/');
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        return fechaStr;
    }

    //  Traduce vía numérica a nombre
    function traducirVia(via_num) {
        switch (via_num) {
            case 1: return "fisica";
            case 2: return "telefonica";
            case 3: return "whatsapp";
            case 4: return "e-mail";
            case 5: return "correspondencia";
            case 6: return "remision";
            case 7: return "oficio";
            case 8: return "escrito";
            default: return null;
        }
    }

    return datos.filter(row => {
        // Filtros del formulario
        const filtroId = normalizar($('#txt_idcedula').val());
        const filtroEstatus = normalizar($('#txt_EstCedula').val());
        const filtroTipo = normalizar($('#txt_tipoescrito').val());
        const filtroVia = normalizar($('#txt_viaI').val());
        const filtroNombre = normalizar($('#txt_nombre').val());
        const filtroCurp = normalizar($('#txt_idcurp').val());
        const filtroFecha = ($('#txt_fecha').val() || '').trim();

        // Valores del registro
        const idValor = normalizar(row.id_escrito ? row.id_escrito.toString() : (row.expediente || ''));
        const estatusValor = normalizar(row.estatus || 'Pendiente');
        const tipoValor = normalizar(row.tipo_cedula || 'Pendiente');

        // 🔹 Vía de interposición
        const pet_via = row.peticionarios?.[0]?.via_interposicion;
        const via_num = pet_via || row.dp_via_interposicion;
        let viaValor = null;
        if (via_num) {
            viaValor = traducirVia(via_num); // ya normalizado sin acentos
        } else if (row.via_interposicion) {
            viaValor = normalizar(row.via_interposicion);
        }
        const coincideVia = !filtroVia || (viaValor && viaValor.includes(filtroVia));

        // 🔹 Fecha
        let fechaRegistro = null;
        const pet = row.peticionarios?.[0];
        if (pet?.fecha_registro) fechaRegistro = normalizarFecha(pet.fecha_registro);
        else if (row.dp_fecha_registro) fechaRegistro = normalizarFecha(row.dp_fecha_registro);
        else if (row.fecha_recepcion) fechaRegistro = normalizarFecha(row.fecha_recepcion);

        // 🔹 Peticionarios válidos
        const peticionariosValidos = (row.peticionarios || []).filter(p => p.statusdp === 1);

        const coincideNombre = !filtroNombre || peticionariosValidos.some(p => {
            const nombreCompleto = normalizar(`${p.nombre || ''} ${p.apellidoPaterno || ''} ${p.apellidoMaterno || ''}`);
            return nombreCompleto.includes(filtroNombre);
        });

        const coincideCurp = !filtroCurp || peticionariosValidos.some(p => {
            return normalizar(p.CURP || '').includes(filtroCurp);
        });

        // Resultado final
        return (!filtroId || idValor.includes(filtroId))
            && coincideCurp
            && coincideNombre
            && (!filtroEstatus || estatusValor === filtroEstatus)
            && coincideVia
            && (!filtroFecha || (fechaRegistro === filtroFecha))
            && (!filtroTipo || tipoValor.includes(filtroTipo));
    });
}






/////

tableBuscadorCedulas.DataTable().on("draw", function (data) {

    activarBtnTurnopre();

})

$('#tablaCedulas tbody').on('click', 'td.details-control', function () {
    const table = $('#tablaCedulas').DataTable();
    const tr = $(this).closest('tr');
    const row = table.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
    } else {
        row.child(formatearFilaExpandidaCedula(row.data())).show();
        tr.addClass('shown');
    }


});

function formatearFilaExpandidaCedula(data) {
    const activos = (data.peticionarios || []).filter(p => parseInt(p.statusdp) === 1);
    const eliminados = (data.peticionarios || []).filter(p => parseInt(p.statusdp) === 0);
    let peticionariosHtml = '';

    // Lógica de estatus y tiempo
    const estatus = data.estatus;
    let fechaBase = data.dp_fecha_registro || data.fecha_recepcion;
    let ahora = new Date();
    let diferenciaHoras = fechaBase ? (ahora - new Date(fechaBase)) / (1000 * 60 * 60) : 0;
    let expiro = diferenciaHoras > 72;

    if (activos.length > 1) {
        // Tabla con todos los activos
        peticionariosHtml += `
            <h5>Peticionarios activos:</h5>
            <table class="table table-bordered">
                <thead><tr><th>Tipo Usuario</th><th>Nombre</th><th>Acciones</th></tr></thead><tbody>
        `;

        activos.forEach(pet => {
            const peticionarioStr = JSON.stringify(pet).replace(/"/g, '&quot;');
            const grupoStr = JSON.stringify(data).replace(/"/g, '&quot;');

            peticionariosHtml += `
                <tr>
                    <td>${pet.tipo_usuario}</td>
                    <td>${pet.nombre}</td>
                    <td>
                        <button type='button' title='Ver ${pet.tipo_usuario}'
                            class='btn btn-link margin-iconbf'
                           onclick='verFormatoDP(${peticionarioStr}, "${data.estatus}")'>
                            <span class='fa fa-search color-muted fa-2x'></span>
                        </button>
                        ${estatus === 'Incompleto' && !expiro ? `
                        <button type='button' title='Eliminar ${pet.tipo_usuario}'
                            class='btn btn-link margin-iconbf'
                            onclick="validaYEliminaFormatoDatosPersonales('${pet.idCompPeticionario}', ${grupoStr})">
                            <span class='fa fa-trash color-danger fa-2x'></span>
                        </button>` : ''}
                    </td>
                </tr>
            `;
        });

        peticionariosHtml += '</tbody></table>';

        if (estatus === 'Incompleto' && !expiro) {
            peticionariosHtml += `
                <div style="margin-top:10px;">
                    <button type='button' title='Agregar nuevo peticionario'
                        onclick='agregarDatosPersonalesCedula(${data.id_escrito})'
                        class='btn btn-link margin-iconbf'>
                        <span class='fa fa-user-plus color-muted fa-2x'></span> Agregar nuevo peticionario
                    </button>
                </div>
            `;
        }
    } else if (activos.length === 1) {
        peticionariosHtml = `
            <p><em>No disponible para eliminar</em></p>
        `;
    } else {
        // 🔹 Caso especial: todos los peticionarios eliminados
        if (eliminados.length > 0 && activos.length === 0 && data.estatus_columna == 0) {
            peticionariosHtml = `
                <button type="button" class="btn btn-rounded btn-danger"
                    style="background-color: red !important;"
                    value="${data.id_escrito}" 
                    title="Eliminar expediente"
                    onclick='eliminarID("${data.id_escrito}", "${data.tipo_cedula === 'Aportación' ? data.expediente : data.id_escrito}", "${data.id_tipo}")'>
                    <span class="btn-icon-left text-danger">
                        <i style="color: white;" class="fa fa-trash color-danger fa-2x"></i>
                    </span> Eliminar ID
                </button>
            `;
        } else if (estatus === 'Incompleto' && !expiro) {
            peticionariosHtml = `
                <button type="button" class="btn btn-rounded btn-danger"
                    style="background-color: red !important;"
                    value="${data.id_escrito}" 
                    title="Eliminar cédula"
                    onclick='eliminarID("${data.id_escrito}", "${data.tipo_cedula === 'Aportación' ? data.expediente : data.id_escrito}", "${data.id_tipo}")'>
                    <span class="btn-icon-left text-danger">
                        <i style="color: white;" class="fa fa-trash color-danger fa-2x"></i>
                    </span> Eliminar
                </button>
            `;
        } else {
            peticionariosHtml = `
                <p><em>No disponible para eliminar</em></p>
            `;
        }
    }
    return `<div>${peticionariosHtml}</div>`;
}



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
    console.log("Autoridades como array:", arrAutoridades);
    console.log("Autoridades como JSON:", JSON.stringify(arrAutoridades));
    dataEscritoi.append('autoridades', JSON.stringify(arrAutoridades));
    dataEscritoi.append('tipoform', 'buscadorfirmatos');
    dataEscritoi.append('conteditfiles', archivos_existentes.length);

    console.log("LugarHechos enviado:", $('#Input_LugarHechos').val());


    $.ajax({
        type: "post",
        url: 'GeneraEscritoInicialnuevo',
        contentType: false,
        processData: false,
        data: dataEscritoi,
        dataType: "json",
        success: function (data) {

            console.log("RESPUESTA SERVER:", data);

            if (data.mensaje == 'ok') {

                $('#id_escritoigenerado').val(data.listat.id);

                let FrmEnFormatQueja = new FormData();
                FrmEnFormatQueja.append('id_documento', data.listat.id);
                FrmEnFormatQueja.append('id_enlace', $('#Input_ID').val());
                FrmEnFormatQueja.append('documento', 'escritoi');

                fetchPost("Expediente/ActualizaEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {

                    if (resp.status) {

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
                    title: 'Error al Insertar los datos'
                })

            }

        },
        error: function (xhr, status, error) {
            console.log("STATUS:", status);
            console.log("ERROR:", error);
            console.log("RESPUESTA:", xhr.responseText);

            Swal.fire({
                icon: 'error',
                title: 'Error del servidor',
                text: xhr.responseText
            });
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
    const anio = $('#anio').val();
    $('#anioND').val(anio);

    // Validaciones
    if (
        validaTexto('validatxtac') ||
        validaNum('validanumerosac') ||
        validainputvacio('validaselectdac') ||
        validainputvacio('validadateac') ||
        validainputvacio('validatimeac') ||
        validainputvacio('validanovacioac')
    )
    {
        return;
    }
    // Guardado de acta
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
                //  Lógica de insertar/actualizar enlace
                let idenlaceformatos = $('#idenlaceformatquejac1').val(); // input hidden
                let idescritook = $('#id_escritoigenerado').val() != '' ? $('#id_escritoigenerado').val() : 1;

                if (idenlaceformatos == '') {
                    // Inserta nuevo enlace
                    let FrmEnFormatQueja = new FormData();
                    FrmEnFormatQueja.append('id_queja', $('.idquejagenerado').val());
                    FrmEnFormatQueja.append('id_escrito', idescritook);
                    FrmEnFormatQueja.append('id_actac', response.idActaC);
                    FrmEnFormatQueja.append('id_peticionario', response.idPet);
                    FrmEnFormatQueja.append('id_complementopet', response.complementoPeticionario);

                    fetchPost("Expediente/InsertEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {
                        if (resp.status) {
                            $('#idenlaceformatquejac1').val(resp.idinsertado);
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Enlace insertado correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                } else {
                    // Actualiza enlace existente
                    let FrmEnFormatQueja = new FormData();
                    FrmEnFormatQueja.append('id_documento', response.idActaC);
                    FrmEnFormatQueja.append('id_enlace', idenlaceformatos);
                    FrmEnFormatQueja.append('documento', 'actac');
                    FrmEnFormatQueja.append('num_frm', 1);

                    fetchPost("Expediente/ActualizaEnlaceFormatoQueja", "json", FrmEnFormatQueja, (resp) => {
                        if (resp.status) {
                            $('#idenlaceformatquejac1').val(resp.respidenlacequeja);
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Enlace actualizado correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                }

                // Refrescar resultados
                $.ajax({
                    type: "POST",
                    url: "BuscardorFormatos",
                    data: $('#frm_busquedaFormatos').serialize(),
                    dataType: "JSON",
                    success: function (res) {
                        mostrarResTblFormatos(res.data);
                        $("#modalFormPeticionario").modal("hide");
                        $("#modalformularioActaCircunstanciada").modal("hide");
                        Swal.close();

                        // Añadir acta al contenedor
                        const nuevaActaNum = $('#Contenedor_Actas').find('p').length + 1;
                        const nuevoID = response.idActaC || 0;

                        $("#Contenedor_Actas").append(`
                         <p>Acta Circunstanciada ${nuevaActaNum}</p>
                         <button type='button' title='Editar Acta Circunstanciada' onclick='traeInformacionActaC(${nuevoID}, "Activa", 1, 1, false)' class='btn btn-link margin-iconbf'>
                             <span class='fa fa-pencil color-muted fa-2x'></span>
                         </button>
                         <button type='button' title='Eliminar Acta Circunstanciada' onclick='eliminarActac(${nuevoID})' class='btn btn-link margin-iconbf'>
                             <span class='fa fa-trash color-danger fa-2x'></span>
                         </button><br/>
                     `);
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
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: 'No se pudo guardar el acta. Intente más tarde.'
            });
        }
    });
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
                window.peticionariosGlobal = response.data[0].peticionarios;
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

                // ✅ Estatus que NO permiten edición
                let estatusBloqueados = [
                    'Pendiente de turnar',
                    'Turnado parcial a VG',
                    'Completo',
                    'Eliminado'
                ];

                let soloLectura = estatusBloqueados.includes(estatus);

                if (soloLectura) {

                    // ❌ Ocultar botón Guardar
                    $('.formularioEscritoInicial button:contains("Guardar")').hide();

                    // ❌ Ocultar botón eliminar PDF
                    $('.btnDeleteImage').hide();

                    // ❌ Deshabilitar inputs (opcional pero recomendable)
                    $('.formularioEscritoInicial input, .formularioEscritoInicial textarea, .formularioEscritoInicial select')
                        .prop('disabled', true);
                }


                $("#Input_ID").prop('readOnly', true);
                $("#Input_Peticionario2").prop('readOnly', true);
                $("#Input_ID").css("font-weight", "bold");
                $("#Input_Peticionario2").css("font-weight", "bold");
                $("#Input_ID").css("background-color", "#D8D8D8");
                $("#Input_Peticionario2").css("background-color", "#D8D8D8");

                if (estatus == 'Eliminado' /*|| estatus == 'Pendiente de turnar' */|| validafechamodifdqot === true) {
                    //Se muestra solamente el boton de pdf y los demás se ocultan
                    $('.formularioEscritoInicial button[type="button"]').not('#generaPDF').hide();
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
    /*Carga_Informacion_selec_quejas();*/

    ventana_eligepeticionario_ei('Selecciona el peticionario para continuar', idExpediente, peticionarios)
        .then((result) => {

            if (result.isConfirmed) {

                $('.formularioEscritoInicial').append(iformEscritoInicial);

                // 🔥 ESPERAR a que carguen los datos
                Carga_Informacion_selec_quejas().then(() => {

                    // 🔥 YA con datos, inicializas select2
                    $('#Input_LugarHechos').select2({
                        dropdownParent: $('#modalformularioEscritoInicial')
                    });

                    changePeticionarioselEi(result.value, idExpediente);

                    funcionesEscritoi();

                    $("#modalformularioEscritoInicial").modal("show");
                });
            }
        });
}

function formEscritoInicial2(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
    var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_Peticionario2', 'Input_Peticionario2', '', 'text', 'Peticionario/Agraviado:&nbsp;', 'textfield', 'placeholder="Nombre del peticionario"', 'style ="margin-left: 60%;"')
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
       // + '&nbsp;&nbsp;<img src="/img/Eliminar_PNG.png" id="icono_eliminar" style="width:24px;height:24px;">'
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

                    let validafecha_modificaciondqot = false;
                    // Verificacion en fecha antres de mandarlo, problema de declaracion nula. cris y david 29/052025
                    if (full.expedienteTurno && full.expedienteTurno.length > 0) {
                        validafecha_modificaciondqot = validafechamodificacionDqot(
                            full.expedienteTurno[0].fechaturnovisitaduria,
                            full.expedienteTurno[0].fechaFinDqot
                        );
                    }

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
                        || validafecha_modificaciondqot === true) {
                        // iconadd no se muestra
                    } else {
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
                                        <label class='delbtnfdp${full.fkExpediente}'>${full.agravQuej[i].nombre} ${full.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${full.agravQuej[i].apellidoMat.replace("No Proporcionado", '')} (${full.agravQuej[i].tipoUsuario})</label> <br/> 
                                        <button type='button' title='Ver quejoso' onclick='editFormatDatosPersonales(${full.agravQuej[i].fkRegRecepcion} , ${full.agravQuej[i].idComplementoPeticionario},"${full.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf delbtnfdp${full.fkExpediente}'>
                                            <span class='fa fa-search color-muted fa-2x delbtnfdp${full.fkExpediente}'></span>
                                        </button>`;
                                } else {
                                    peticionarioslist += `
                                        <label class='delbtnfdp${full.fkExpediente}'>${full.agravQuej[i].nombre} ${full.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${full.agravQuej[i].apellidoMat.replace("No Proporcionado", '')} (${full.agravQuej[i].tipoUsuario})</label> <br/> 
                                        <button type='button' title='Editar quejoso' onclick='editFormatDatosPersonales(${full.agravQuej[i].fkRegRecepcion} , ${full.agravQuej[i].idComplementoPeticionario},"${full.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf delbtnfdp${full.fkExpediente}'>
                                            <span class='fa fa-pencil color-muted fa-2x delbtnfdp${full.fkExpediente}'></span>
                                        </button>
                                        <button type='button' title='Eliminar quejoso' onclick='eliminaFormatoDatosPeronsales(${full.agravQuej[i].idComplementoPeticionario}, this)' class='btn btn-link margin-iconbf delbtnfdp${full.fkExpediente}'>
                                            <span class='fa fa-trash color-danger fa-2x delbtnfdp${full.fkExpediente}'></span>
                                        </button>  <br/>`;
                                }

                                if (full.agravQuej[i].tipoUsuario == "Agraviado") {
                                    contador_agraviado++;
                                } else if (full.agravQuej[i].tipoUsuario == "Peticionario") {
                                    contador_quejoso++;
                                }
                            }

                            if (full.agravQuej.length == 1 && full.status_Expediente != 'Eliminado') {
                                return peticionarioslist + iconadd;
                            } else if (full.agravQuej.length == 1 && full.status_Expediente == 'Eliminado') {
                                return peticionarioslist;
                            } else {
                                return `<p> ${contador_agraviado} Agraviado(s) </p><br>
                                        <p> ${contador_quejoso} Peticionario(s)</p>`;
                            }
                        }

                        return peticionarioslist + iconadd;
                    }

                    anterior = full.fkExpediente;
                }
            },
            {
                'mRender': function (data, type, full) {

                    let iconaddEscrito = '';
                    let btnEscritook = "";
                    let peticionarios = JSON.stringify(full.agravQuej);
                    let validafecha_modificaciondqot = false;
                    // Verificacion en fecha antres de mandarlo, problema de declaracion nula. cris y david 29/052025
                    if (full.expedienteTurno && full.expedienteTurno.length > 0) {
                        validafecha_modificaciondqot = validafechamodificacionDqot(
                            full.expedienteTurno[0].fechaturnovisitaduria,
                            full.expedienteTurno[0].fechaFinDqot
                        );
                    }
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
                    let iconaddActac = '';
                    let btnActacircu = '';
                    let peticionariosactac = JSON.stringify(full.agravQuejactac).replace(/"/g, '&quot;');
                    let idEscrito = full.escritoia.length > 0 ? full.escritoia[0].idEscrito : 1;
                    let validafecha_modificaciondqot = false;

                    if (full.expedienteTurno && full.expedienteTurno.length > 0) {
                        validafecha_modificaciondqot = validafechamodificacionDqot(
                            full.expedienteTurno[0].fechaturnovisitaduria,
                            full.expedienteTurno[0].fechaFinDqot
                        );
                    }

                    // 🔴 VALIDACIÓN CENTRAL
                    const soloLectura =
                        full.status_Expediente == 'Eliminado' ||
                        full.status_Expediente == 'Pendiente de turnar' ||
                        full.status_Expediente == 'Turnado parcial a VG' ||
                        full.status_Expediente == 'Turnado a VG' ||
                        full.status_Expediente == 'Pendiente de Returno' ||
                        full.status_Expediente == 'Returnado a VG' ||
                        full.status_Expediente == 'Returnado parcial' ||
                        full.status_Expediente == 'Turnado a VA' ||
                        validafecha_modificaciondqot === true;

                    // 🔴 BOTÓN AGREGAR (solo si se puede editar)
                    if (!soloLectura) {
                        iconaddActac = `
            <button type="button" title="Agregar Acta Circunstanciada"
            onclick='AddActac("${full.fkExpediente}", "${idEscrito}", \`${JSON.stringify(full.agravQuejactac || []).replace(/`/g, "\\`")}\`)'
            class="btn btn-link margin-iconbf">
            <img src="../icons/personalizados/add-file.png" height="40"/>
            </button><br>`;
                    }

                    // 🔴 ACTAS EXISTENTES
                    if (full.actaCa.length > 0) {

                        full.actaCa.forEach((acta) => {

                            if (soloLectura) {

                                // 🔍 SOLO VER
                                btnActacircu += `
                    <button type='button' title='Ver Acta Circunstanciada'
                        onclick='traeInformacionActaC(${acta.idActac},"${full.status_Expediente}", ${idEscrito}, ${full.fkExpediente}, ${validafecha_modificaciondqot})'
                        class='btn btn-link margin-iconbf'>
                        <span class='fa fa-search color-muted fa-2x'></span>
                    </button>`;

                            } else {

                                // ✏️ EDITAR
                                btnActacircu += `
                    <button type='button' title='Editar Acta Circunstanciada'
                        onclick='traeInformacionActaC(${acta.idActac},"${full.status_Expediente}", ${idEscrito}, ${full.fkExpediente}, ${validafecha_modificaciondqot})'
                        class='btn btn-link margin-iconbf'>
                        <span class='fa fa-pencil color-muted fa-2x'></span>
                    </button>
                    <button type='button' title='Eliminar Acta Circunstanciada'
                        onclick='eliminarActac(${acta.idActac}, "${acta.nombre_petligado}")'
                        class='btn btn-link margin-iconbf'>
                        <span class='fa fa-trash color-danger fa-2x'></span>
                    </button>`;
                            }

                        });

                        return btnActacircu + '<br>' + iconaddActac;
                    }

                    return iconaddActac;
                }
            },
            {
                'mRender': function (data, type, full) {

                    if (full.fechaRegistro) {
                        return full.fechaRegistro.replace('T', ' ');
                    }

                    return 'Sin información';
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
                        let validafecha_modificaciondqot = false;
                        // Verificacion en fecha antres de mandarlo, problema de declaracion nula. cris y david 29/052025
                        if (full.expedienteTurno && full.expedienteTurno.length > 0) {
                            validafecha_modificaciondqot = validafechamodificacionDqot(
                                full.expedienteTurno[0].fechaturnovisitaduria,
                                full.expedienteTurno[0].fechaFinDqot
                            );
                        }

                        if (full.status_Expediente == 'Eliminado'
                            || full.status_Expediente == 'Pendiente de turnar'
                            || full.status_Expediente == 'Turnado parcial a VG'
                            || full.status_Expediente == 'Turnado a VG'
                            || full.status_Expediente == 'Pendiente de Returno'
                            || full.status_Expediente == 'Returnado a VG'
                            || full.status_Expediente == 'Returnado parcial'
                            || full.status_Expediente == 'Turnado a VA'
                            || validafecha_modificaciondqot === true) {
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
                    // Ricardo 01 10 2025 Modificaciones para mostrar el select de turno en caso de estar pendiente de turnar
                    if (rolAbogado == 'VA_DQOT' || rolAbogado == 'ADMIN_DQOT') {

                        let iconVermemo = '';
                        // fecha 1900-01-01 10:00:00 PM se usa por default para valores nulos
                        let disabled = full.status_Expediente == 'Turnado parcial a VG' ? 'disabled' : '';
                        let cadena = `<div class="form-group"> <select class="form-control selTurno" ${disabled} style="width: auto;" id="selectTurnoexp${full.fkExpediente}"> <option value="">Seleccionar</option>`;
                        let cont = 0;

                        if (full.fkExpediente == 521) {
                            let vas = full.fkExpediente;
                        }

                        for (i = 0; i < visitaduriasTabla.length; i++) {
                            if (full.status_Expediente == 'Pendiente de turnar' || full.status_Expediente == 'Pendiente de Returno') {
                                cont++;
                                cadena = cadena + '<option data-idexpt="' + full.fkExpediente + '" class="btn-success" value=' + visitaduriasTabla[i].idSelect + '/' + full.fkExpediente + '/' + visitaduriasTabla[i].idUserTitular + '>' + visitaduriasTabla[i].descripcion + '</option>';
                            } else if (full.status_Expediente == 'Turnado parcial a VG' || full.status_Expediente == 'Pendiente de Returno') {
                                cont++;

                                // PROTECCIÓN: Validamos que expedienteTurno exista y tenga al menos un elemento
                                if (full.expedienteTurno && full.expedienteTurno.length > 0 && visitaduriasTabla[i].idSelect == full.expedienteTurno[0].clavevisitaduria) {
                                    cadena = cadena + '<option selected data-idexpt="' + full.fkExpediente + '" class="btn-success" value=' + visitaduriasTabla[i].idSelect + '/' + full.fkExpediente + '/' + visitaduriasTabla[i].idUserTitular + '>' + visitaduriasTabla[i].descripcion + '</option>';
                                } else {
                                    cadena = cadena + '<option data-idexpt="' + full.fkExpediente + '" class="btn-success" value=' + visitaduriasTabla[i].idSelect + '/' + full.fkExpediente + '/' + visitaduriasTabla[i].idUserTitular + '>' + visitaduriasTabla[i].descripcion + '</option>';
                                }
                            }
                        }
                        cadena = cadena + '</select> </div >';

                        // PROTECCIÓN: Validamos también aquí antes de intentar renderizar el botón de memorándum
                        if (full.status_Expediente == 'Turnado parcial a VG' && full.expedienteTurno && full.expedienteTurno.length > 0) {
                            cadena += `<button type='button' title='Memorándum ${full.expedienteTurno[0].memorandum}' onclick='verMemoturno(${full.fkExpediente},${full.expedienteTurno[0].fkMemorandum}, "${full.expedienteTurno[0].memorandum}")' class='btn btn - link margin - iconbf'>
                <span class='fa fa-file-text color-muted fa-2x'></span>
            </button > <br>`;
                        }

                        if (cont > 0) {
                            return cadena;
                        } else {
                            return '';
                        }
                    } else {
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
                            && full.agravQuej[i].lPeticionario[e].fkHijosVivos != '' && full.agravQuej[i].lPeticionario[e].fkModalidadViolencia <= 8 && full.agravQuej[i].lPeticionario[e].fkTipoViolencia <= 8 && full.agravQuej[i].lPeticionario[e].fkRelacionAgresor != 8) {
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
    //cambio en la validacion del estatus AE
    if (full.escritoia.length > 0) {
        Cont = 0;
        for (var i = 0; i < full.escritoia.length; i++) {
            if (full.escritoia[i].lEscritoI.length > 0) {
                for (var e = 0; e < full.escritoia[i].lEscritoI.length; e++) {
                    let escrito = full.escritoia[i].lEscritoI[e];
                    let idEscrito = full.escritoia[i].idEscrito;

                    // Validamos solo lo que realmente guarda el escrito
                    if (
                        escrito.peticionarios !== '' &&
                        escrito.fechahd &&
                        escrito.estado !== '' &&
                        escrito.circuns_Hechos !== ''
                    ) {
                        Cont++;
                    } else {
                        console.log("Escrito incompleto en ID:", idEscrito, escrito);
                    }
                }
            }
        }
        // Si al menos hay un escrito válido, lo contamos
        if (Cont > 0) {
            contador++;
        } else {
            estatus = estatus + 'Escrito Inicial <br>';
        }
    } else {
        estatus = estatus + 'Escrito Inicial <br>';
    }


    //FIN ESCRITO INICIAL DE QUEJAS

    //ACTA DE CIRCUNSTANCIAS
    //cambio en la validacion del estatus AE
    if (full.viA_INTERPOSICION == "Telefónica" || full.viA_INTERPOSICION == "WhatsApp" || full.viA_INTERPOSICION == "Física") {
        viaInterpo = "CuatroFomat";
        if (full.actaCa.length > 0) {
            Cont = 0;
            for (var i = 0; i < full.actaCa.length; i++) {
                // Si el acta tiene status "completo" o al menos existe (aunque status esté vacío)
                if (full.actaCa[i].status && full.actaCa[i].status.toLowerCase().trim() === 'completo') {
                    Cont++;
                } else if (full.actaCa[i].status === '' || full.actaCa[i].status == null) {
                    // Considerar acta como cargada aunque no tenga status
                    Cont++;
                }
            }
            if (Cont === full.actaCa.length) {
                contador++;
            } else {
                estatus = estatus + 'Acta de Circunstancias <br>';
            }
        } else {
            estatus = estatus + 'Acta de Circunstancias <br>';
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
    // Al final de la función, antes del return
    console.log("=== Resumen expediente:", full.fkExpediente, "===");
    console.log("Via de interposición:", viaInterpo);
    console.log("Contador final:", contador);

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

function btnGenraBitacoraportacion(idAportacion) {
    window.open(CedBitacoraCambioPDFAportacion + idAportacion, '_blank');
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

    let options = {};

    $.map(peticionarios, function (o) {
        options[
            idexpediente + "/" + o.fkRegRecepcion + "/" + o.idComplementoPeticionario + "/" +
            o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '')
        ] =
            o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '');
    });

    return Swal.fire({
        title: mensaje,
        input: 'select',
        inputOptions: options,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,

        didOpen: () => {
            const select = document.getElementById('swal2-select');
            if (select) {
                select.style.setProperty('display', 'block', 'important'); // 🔥 mata el flex
            }
        },
        inputValidator: function (value) {
            if (value !== '') return null;
            return 'Debes de Seleccionar un elemento';
        }
    });
}


function ventana_eligepeticionario_ei(mensaje, idexpediente, peticionarios) {
    let options = {};

    $.map(peticionarios, function (o) {
        options[
            idexpediente + "/" + o.fkRegRecepcion + "/" + o.idComplementoPeticionario + "/" +
            o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '')
        ] =
            o.nombre + ' ' + o.apellidoPat.replace("No Proporcionado", '') + ' ' + o.apellidoMat.replace("No Proporcionado", '');
    });

    return Swal.fire({
        title: mensaje,
        input: 'select',
        inputOptions: options,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,

        didOpen: () => {
            const select = document.getElementById('swal2-select');
            if (select) {
                select.style.setProperty('display', 'block', 'important'); // 🔥 mata el flex
            }
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
                // Posible error 001-Fred
                $('#AutoridadesEI').val("------");
                $('#nombrePet').val(valor[3].toLowerCase()); //Este trae los datos al acta circuentanciada lo que se encuentra entre corchetes es el dato que trae
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

                // 🔥 AQUÍ VA EL MENSAJE (CORRECTO)
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Peticionario cargado correctamente',
                    showConfirmButton: false,
                    timer: 2000
                });

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
    console.log(data);  // Verifica los datos que recibes

    let btnEliminar = '';
    let acta = '';
    let peticionarioslist = '';
    let peticionarios = JSON.stringify(data.agravQuej);
    let peticionariosactac = JSON.stringify(data.agravQuejactac);
    let validafecha_modificaciondqot = validafechamodificacionDqot(data.expedienteTurno[0].fechaturnovisitaduria, data.expedienteTurno[0].fechaFinDqot);
    let iconadd = '';
    let iconaddActac = '';

    // Verificar si la fecha de modificación no es válida
    if (validafecha_modificaciondqot === false) {
        console.log('La fecha de modificación de DQO no es válida.');
        iconadd += `<button type='button' title='Agregar nuevo quejoso' onclick='AddFormatDatosPersonales(${data.fkExpediente}, ${peticionarios})' class='btn btn-link margin-iconbf'>
                               <span class='fa fa-user-plus color-muted fa-2x'></span>
                            </button>`;

        if (peticionariosactac == "[]") {
            iconaddActac += `<button type='button' title='Agregar Acta Circunstanciada' onclick='AddActac(${data.fkExpediente}, ${data.escritoia.length > 0 ? data.escritoia[0].idEscrito : 1}, ${peticionarios})' class='btn btn-link margin-iconbf' disabled>
                                               <img src="../icons/personalizados/add-file.png" height="40" />
                                </button> <br>`;
        } else {
            iconaddActac += `<button type='button' title='Agregar Acta Circunstanciada' onclick='AddActac(${data.fkExpediente}, ${data.escritoia.length > 0 ? data.escritoia[0].idEscrito : 1}, ${peticionarios})' class='btn btn-link margin-iconbf'>
                                               <img src="../icons/personalizados/add-file.png" height="40"/>
                                </button> <br>`;
        }
    }

    // Generación del botón de eliminar, dependiendo del estado del expediente
    if (data.status_Expediente != 'Eliminado') {
        if ((data.agravQuej.length > 0) || (data.escritoia.length > 0) || (data.actaCa.length > 0)) {
            btnEliminar = `<button type="button" class="btn eliminaExpediente2 btn-rounded btn-danger" style="background-color: red !important;" value="${data.fkExpediente}"><span class="btn-icon-left text-danger"><i style="color: white;" class="fa fa-trash color-danger fa-2x"></i>
                     </span> Eliminar ID</button>`;
        }
        else {
            btnEliminar = `<button type="button" class="btn eliminaExpediente btn-rounded btn-danger" style="background-color: red !important;" value="${data.fkExpediente}"><span class="btn-icon-left text-danger"><i style="color: white;" class="fa fa-trash color-danger fa-2x"></i>
                     </span> Eliminar ID</button>`;
        }
    }

    // Generación de los peticionarios (quejosos)
    if (data.agravQuej.length > 0) {
        for (var i = 0; i < data.agravQuej.length; i++) {
            if ((data.status_Expediente == 'Eliminado')) {
                peticionarioslist += `
                              <label>${data.agravQuej[i].nombre} ${data.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${data.agravQuej[i].apellidoMat.replace("No Proporcionado", '')} (${data.agravQuej[i].tipoUsuario})</label> <br/> 
                              <button type='button' title='Ver quejoso' onclick='editFormatDatosPersonales(${data.agravQuej[i].fkRegRecepcion}, ${data.agravQuej[i].idComplementoPeticionario}, "${data.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-search color-muted fa-2x'></span>
                               </button>`;
            } else {
                peticionarioslist += `
                              <label>${data.agravQuej[i].nombre} ${data.agravQuej[i].apellidoPat.replace("No Proporcionado", '')} ${data.agravQuej[i].apellidoMat.replace("No Proporcionado", '')} (${data.agravQuej[i].tipoUsuario})</label> <br/>
                              <button type='button' title='Editar quejoso' onclick='editFormatDatosPersonales(${data.agravQuej[i].fkRegRecepcion}, ${data.agravQuej[i].idComplementoPeticionario}, "${data.status_Expediente}", ${validafecha_modificaciondqot})' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-pencil color-muted fa-2x'></span>
                               </button>
                              <button type='button' title='Eliminar quejoso' onclick='eliminaFormatoDatosPeronsales(${data.agravQuej[i].idComplementoPeticionario}, this)' class='btn btn-link margin-iconbf'>
                                   <span class='fa fa-trash color-danger fa-2x'></span>
                              </button>  <br/> `;
            }
        }
    }

    // Generación de las actas circunstanciadas
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

    // Generación de la tabla dependiendo de la cantidad de quejosos y el estado del expediente
    if (data.agravQuej.length < 1 && data.status_Expediente != 'Eliminado') {
        return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
		        <thead></thead>
		        <tbody>
			        <tr>
				        <td style="text-align: end;"> ${btnEliminar} </td>  
			        </tr>
		        </tbody>
	        </table>`;

    }
    else if (data.agravQuej.length == 1 && data.status_Expediente != 'Eliminado') {
        if (data.actaCa.length > 1) {
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
            return `<table style="min-width: 100%; width: 100%; border-collapse: collapse;">
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
                        //var ip = $("#ipAccesible").html();

                        fetchPost("Expediente/DeleteExpediente", "json", FrmDelExp, (resp) => {
                            //console.log(resp)
                            //$.get("https://api.ipify.org?callback=getIP", "json", (data) => { console.log("Tu ip es: " + data); $("#ipAccesible").html(data); })

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
    $('.eliminaExpediente2').click(function (e) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al eliminar el ID, aún tienes información cargada en el escrito inicial',
            showConfirmButton: false,
            timer: 3000

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

function traeInformacionActaC(idActaC, estatus, idescrito, idqueja, fechavalidaeditdqot) {
    let iformActaCircunstanciada = formActacircunstanciada2c();
    $('.formularioActaCircunstanciada').empty().append(iformActaCircunstanciada);
    $('#anio').val(2026);
    $("#origenPetExt, #origenPetExtedo").hide();

    Carga_Informacion_selec_quejas().then(() => {
        if (idActaC === 0) {
            // Caso: Crear nueva acta
            $("input[name='idactac']").val(0);
            $("input[name='idescritoim']").val(idescrito);
            $("input[name='idqueja']").val(idqueja);
            $("input[name='idactaedit']").val(0);

            // 🔽 TRAER PETICIONARIO DE LA QUEJA
            $.ajax({
                type: "POST",
                url: "GetPeticionarioQueja",
                data: { idqueja: idqueja },
                dataType: "JSON",
                success: function (resp) {

                    if (resp.data.length > 0) {

                        $("input[name='nombrePet']").val(resp.data[0].nombre);
                        $("input[name='idpeti']").val(resp.data[0].idPet);
                        $("input[name='idpet']").val(resp.data[0].idPet); // 👈 AGREGE ESTA LINEA JM
                        $("input[name='idcompet']").val(resp.data[0].idComplemento);

                    }

                }
            });

            // Habilitar botones siempre para nueva acta
            $('#modalformularioActaCircunstanciada button[type="button"]').show();

            // Inicialización de Select2
            $('#lugar, #origenPet, #catEstado_hechos').select2();

            $("#modalformularioActaCircunstanciada").modal("show");
            RecorreInput('.formularioActaCircunstanciada');
            return;
        }

        // Caso: Cargar acta existente
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
                    $("input[name='nombrePet']").val(response.data[0].nombrePet); //carga del dato existente -Fred 
                    $("input[name='idpeti']").val(response.data[0].idPet);
                    $("input[name='idcompet']").val(response.data[0].complementoPeticionario);
                    $('#consentimiento > option[value="' + response.data[0].consentimiento + '"]').attr('selected', 'selected');
                    $("input[name='edadPet']").val(response.data[0].edadPet);
                    $("input[name='escolaridadPet']").val(response.data[0].escolaridadPet);
                    $("input[name='sabeleerPet']").val(response.data[0].sabePet);
                    $("input[name='callePet']").val(response.data[0].callePet);
                    $("input[name='numextPet']").val(response.data[0].numextPet);
                    $("input[name='numintPet']").val(response.data[0].numintPet);
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
                    if (
                        estatus == 'Eliminado' ||
                        estatus == 'Pendiente de turnar' ||
                        estatus == 'Turnado parcial a VG' ||
                        estatus == 'Turnado a VG' ||
                        estatus == 'Turnado a VA' ||
                        estatus == 'Returnado a VG' ||
                        estatus == 'Returnado parcial' ||
                        fechavalidaeditdqot === true
                    ) {
                        // Oculta SOLO el botón Guardar
                        $('#modalformularioActaCircunstanciada button:contains("Guardar")').hide();
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

//Acta cicusntanciada de buscador de ID´s
function AddActac(idExpediente, idescritoi, peticionarios) {

    try {
        peticionarios = peticionarios.replace(/&quot;/g, '"');
        peticionarios = JSON.parse(peticionarios);
    } catch (e) {
        console.error("Error al parsear peticionarios:", e);
        peticionarios = [];
    }

    let iformActaCircunstanciada = formActacircunstanciada2c();
    $('.formularioActaCircunstanciada').empty();

    // 🔥 1. Seleccionar peticionario (esperar resultado)
    ventana_acpeta_visitaduria('Selecciona el peticionario para continuar', idExpediente, peticionarios)
        .then((result) => {

            if (result.isConfirmed) {

                // 🔥 2. Crear HTML
                $('.formularioActaCircunstanciada').append(iformActaCircunstanciada);

                // 🔥 3. Setear valores base
                $('#anio').val(2026);
                $('#idescritoim').val(idescritoi);
                $('#idqueja').val(idExpediente);

                $("#origenPetExt").hide();
                $("#origenPetExtedo").hide();

                // 🔥 4. Cargar selects (esperar async)
                Carga_Informacion_selec_quejas().then(() => {

                    // 🔥 5. Inicializar Select2 ya con datos
                    $('#modalformularioActaCircunstanciada #lugar, \
                      #modalformularioActaCircunstanciada #origenPet, \
                      #modalformularioActaCircunstanciada #catEstado_hechos, \
                      #modalformularioActaCircunstanciada #Input_autoridades')
                        .select2({
                            dropdownParent: $('#modalformularioActaCircunstanciada')
                        });

                    // 🔥 6. Llenar datos del peticionario
                    changeSelectPetActac(result.value);

                    // 🔥 7. Otras funciones
                    RecorreInput('.formularioActaCircunstanciada');

                    // 🔥 8. Abrir modal AL FINAL
                    $("#modalformularioActaCircunstanciada").modal("show");
                });
            }
        });
}
// Este es el del acta circusntanciada pero para editar!!
function formActacircunstanciada2c
    () {

    var idUser = $("#idusuario").val();
    var Area = $("#areaUser").val();
    var Cargo = $("#cargoUser").val();

    //console.log("ID_USER:" + idUser);
    //console.log("AREA_USER:" + Area);
    //console.log("CARGO_USER:" + Cargo);
    var arregloBlanco = [];
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
    $(document).on('input', ".buscacp", function () {
        let codigoPostal = this.value.trim();
        let idfrm = this.dataset.idfrmit;

        if (codigoPostal.length === 5 && !isNaN(codigoPostal)) {
            let estado = '';
            let municipio = '';

            $.getJSON("https://api.copomex.com/query/info_cp/" + codigoPostal + "?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
                if (!copomex.response) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se encontraron datos para este código postal.',
                        confirmButtonColor: '#d33'
                    });
                    return;
                }

                estado = copomex.response.estado || '';
                municipio = copomex.response.municipio || '';

                $("#municipio_petit-frmDatosPersonales" + idfrm).val(municipio);
                $("#estado_petit-frmDatosPersonales" + idfrm).val(estado);
                $("#cp_petit-frmDatosPersonales" + idfrm).val(copomex.response.cp);
                AgregarOptionSelect(idfrm, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idfrm, copomex.response.asentamiento);
            }).done(function () {
                $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
                    if (!copomex.response) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sin Localidades',
                            text: 'No se encontraron localidades para este estado y municipio.',
                            confirmButtonColor: '#3085d6'
                        });
                        return;
                    }

                    let localidadaes = Object.keys(copomex.response.localidad_clave);
                    AgregarOptionSelect(idfrm, 'deloptionloca', '#ciudad_petit-frmDatosPersonales' + idfrm, localidadaes);
                }).fail(function () {
                    console.log('Ha ocurrido un error en obtener las localidades');
                });
            }).fail(function () {
                console.log('Ha ocurrido un error al obtener datos de un cp');
            });
        } else if (codigoPostal.length > 5) {
            this.value = codigoPostal.slice(0, 5); // Limita a 5 caracteres
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
                    // Normaliza CP a 5 dígitos
                    var cp = (response.data[0].codigoPostal || '').replace(/\D+/g, '').slice(0, 5);
                    $("#cp_petit-frmDatosPersonales" + idform).val(cp);

                    let estado = '';
                    let municipio = '';

                    $.getJSON(
                        "https://api.copomex.com/query/info_cp/" + cp + "?type=simplified&token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee",
                        function (copomex) {
                            if (!copomex || !copomex.response) {
                                console.warn('No se encontraron datos para el CP proporcionado.');
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

                        // No consultes localidades si no hay estado/municipio válidos
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

                                let localidades = Object.keys(copomex2.response.localidad_clave);
                                AgregarOptionSelect(
                                    idform,
                                    'deloptionloca',
                                    '#ciudad_petit-frmDatosPersonales' + idform,
                                    localidades
                                );
                            }
                        ).done(function () {
                            // Restaura los valores originales del registro y refresca selectpicker
                            $("#estado_petit-frmDatosPersonales" + idform).val(response.data[0].estado || estado);
                            $("#municipio_petit-frmDatosPersonales" + idform).val(response.data[0].municipio || municipio);
                            $("#colonia_petit-frmDatosPersonales" + idform).val(response.data[0].colonia || '');
                            $("#ciudad_petit-frmDatosPersonales" + idform).val(response.data[0].ciudad || '');

                            $("#colonia_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                            $("#ciudad_petit-frmDatosPersonales" + idform).selectpicker('refresh');

                            $("#modalFormPeticionario").modal("show");
                            RecorreInput('.frmEditDatosPersonales');
                        }).fail(function () {
                            console.log('Ha ocurrido un error en obtener las localidades');
                        });

                    }).fail(function () {
                        console.log('Ha ocurrido un error al obtener datos de un cp');
                    });

                } else {

                    if (response.data[0].codigoPostal == 'No proporcionado')
                    {
                        $("#cp_petit-frmDatosPersonales" + idform).val('No proporcionado');
                    }
                    // 👉 ESTADO Y MUNICIPIO (SIEMPRE MOSTRAR)
                    let estado = response.data[0].estado || '';
                    let municipio = response.data[0].municipio || '';

                    // 👉 SI NO EXISTEN EN EL SELECT, AGREGARLOS
                    if ($("#estado_petit-frmDatosPersonales" + idform + " option[value='" + estado + "']").length === 0 && estado !== '') {
                        $("#estado_petit-frmDatosPersonales" + idform)
                            .append(new Option(estado, estado));
                    }

                    if ($("#municipio_petit-frmDatosPersonales" + idform + " option[value='" + municipio + "']").length === 0 && municipio !== '') {
                        $("#municipio_petit-frmDatosPersonales" + idform)
                            .append(new Option(municipio, municipio));
                    }

                    // 👉 ASIGNAR VALOR
                    $("#estado_petit-frmDatosPersonales" + idform).val(estado);
                    $("#municipio_petit-frmDatosPersonales" + idform).val(municipio);

                    // 👉 REFRESCAR (IMPORTANTE)
                    $("#estado_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                    $("#municipio_petit-frmDatosPersonales" + idform).selectpicker('refresh');
                    //if (response.data[0].estado == 'No proporcionado') { $("#estado_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    //if (response.data[0].municipio == 'No proporcionado') { $("#municipio_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (response.data[0].colonia == 'No proporcionado') { $("#colonia_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (response.data[0].ciudad == 'No proporcionado') { $("#ciudad_petit-frmDatosPersonales" + idform).val('No proporcionado'); }
                    if (fecha_nac == '1900-01-01') { $("#fenac_petit-frmDatosPersonales" + idform).val(''); }

                    if ((response.data[0].docIdentificatorio.toUpperCase() == 'NO PROPORCIONADO') && (response.data[0].apellidoPat == 'No proporcionado') && (response.data[0].apellidoMat == 'No proporcionado'))
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
function agregarDatosPersonalesCedula(idExpediente) {

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

    })
    fetchGet("Expediente/SelectEstados", "json", (data) => {
        let Estados = data.relacionestado;
        //console.log(Paises)

        AgregarOptionSelectPais(1, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales1', Estados);
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
    actualizarPeticionariosCedula();
}
function AddFormatDatosPersonales(idExpediente) {
    // 🔥 LIMPIAR FORMULARIO ANTERIOR
    $('.frmEditDatosPersonales').empty();

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

    })
    fetchGet("Expediente/SelectEstados", "json", (data) => {
        let Estados = data.relacionestado;
        //console.log(Paises)

        AgregarOptionSelectPais(1, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales1', Estados);
    })

    let idform = 1;
    let curpd = '';
    let nombrep = '';
    let apellidope = '';
    let apellidome = '';
    let violenciamujer = '';

    $('#idquejagenerado').val(idExpediente);
    //$("input[name=qatu_petit-frmDatosPersonales" + idform + "][value = 'Agraviado']").prop("disabled", true);

    // 🔥 LIMPIAR IDS
    $('#idpeticionarioi1').val(0);
    $('#idcomplementopet1').val(0);

    $("#modalFormPeticionario").modal("show");
   /* updateDatosPeticionariosBusq();*/

    updateDatosPeticionarios(0, 'NUEVO');
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
                                options: escolaridadInicioTabla
                            },
                            {
                                lableoptgrup: 'Estudios técnico o comerciales con:',
                                options: escolaridadFinalTabla
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
                        combooptions: EstadoConyugalTabla
                    },
                    {
                        label: "Ocupación",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Ocupación',
                                options: OcupacionTabla
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
                        combooptions: DiscapacidadTabla
                    },
                    {
                        label: "¿Pertenece algún grupo social específico?",
                        type: "dropdowninput",
                        optgroup: [
                            {
                                lableoptgrup: 'Grupo Social',
                                options: GrupoSocialTabla
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
                        combooptions: HijosVivosAlta
                    },
                    {
                        class: "col-md-3",
                        label: "002 Modalidad de Violencia",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmmodvio_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: ModalidadViolenciaTabla
                    },
                    {
                        class: "col-md-3",
                        label: "Tipo de Violencia",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmtvio_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: TipoViolenciaTabla
                    },
                    {
                        class: "col-md-4",
                        label: "017 Tipo de relación o vínculo con el/la agresor/a",
                        classlabel: "dis-none viomujer frmviolenciam" + idformulario,
                        name: "vmreviagr_petit-frmDatosPersonales" + idformulario,
                        type: "combobox",
                        classControl: "dis-none ob max-300 eliminaformaes frmviolenciam" + idformulario,
                        combooptions: RelacionAgresorTabla
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
                        classSubmit: "btn btn-success submitForm", // clase exclusiva
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

function CargaDatosSelectOtro_(selector, lista, valorSeleccionado) {
    lista.forEach(item => {
        $(selector).append(`<option value="${item.idSelect}">${item.descripcion}</option>`);
    });

    if (valorSeleccionado) {
        $(selector).val(valorSeleccionado).trigger('change');
    }
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
    $.getJSON("https://api.copomex.com/query/get_estado_clave?token=a4e44c7e-6e9b-4c43-8a3b-a6900bb54cee", function (copomex) {
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
    // construimos el label
    let htmld = `<label for="${namelabel}" ${estiloLabel}>${textoLabel}</label>`;

    // construimos el select con atributos correctos
    htmld += `<select id="${id}" ${tiposelect} ${estiloselect}>`;
    htmld += `<option value="">Seleccione una opción</option>`;

    // agregamos las opciones
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `<option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>`;
    }

    htmld += `</select>`;

    return htmld;
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
    console.log(cuerpo);

    return cuerpo;
}
$(document).on('click', '.eliminarAutoridad', function () {
    let id = $(this).data('id');
    $('#autoridad_' + id).remove();
});


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
            /*$('#idpet').val('2'); */
            $('#idEscrito_').val('1');
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
            $("#nombrePet").css({
                "font-weight": "bold",
                "width": "25%"
            });
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
            $("#correoPet").css({
                "font-weight": "bold",
                "width": "25%"
            });
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

// david
function actualizarDatosPeticionariosCedulas() {
    // Actualizar Peticionario
    $('.formularioPeticionario').submit(function (e) {
        e.preventDefault();
        if (validaTxt() || validaNumero()) {
            return;
        }   // Validaciones de texto y numero, si hace return no se ejecutara la petit AJAX
        let numFrm = 1;
        let idForm = '#frmDatosPersonales' + numFrm;
        let nombre = $('#nombre_petit-frmDatosPersonales1 option:selected').text();
        var ip = $("#ipAccesible").html();
        console.log(idForm);
        $.ajax({
            type: "post",
            url: 'GuardarDatosPersonalesCedula',
            content: "application/json; charset=utf-8",
            data: $(idForm).serialize() + '&nombreS=' + nombre + '&Ipaccesible=' + ip,
            dataType: "json",
            success: function (data) {
                console.log("Datos que llegaron:");
                console.log(data);
                //console.log(data)
                if (data != "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Información Actualizada Correctamente :)',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        Swal.fire({
                            text: 'Cargando Cédulas...',
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                        // Llamada a metodo que recarga de nuevo la info de las cedula (info personal e ing)
                        $.ajax({
                            type: "POST",
                            url: "TablaObtenerCedulas",
                            data: $('#frm_busquedorCedulas').serialize(),
                            dataType: "JSON",
                            success: function (response) {
                                Swal.fire({ showConfirmButton: false, timer: 1 });
                                console.log(response.data);
                                mostrarTablaCedulas(response.data);
                                $("#modalFormPeticionario").modal("hide");
                                Swal.close();
                            },
                            error: function () {
                                Swal.close();
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: 'Hubo un error al obtener las cédulas.',
                                    showConfirmButton: true
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

function actualizarPeticionariosCedula() {
    // Actualizar Peticionario
    $('.formularioPeticionario').submit(function (e) {
        e.preventDefault();

        // Validar los campos de texto o numéricos antes de enviar
        if (validaTxt() || validaNumero()) {
            return;
        }

        let numFrm = 1;
        let idForm = '#frmDatosPersonales' + numFrm;
        let nombre = $('#nombre_petit-frmDatosPersonales1 option:selected').text();
        let ip = $("#ipAccesible").html();

        // Habilitar campos deshabilitados antes de enviar
        $('input[type=radio][name="qatu_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
        $('#idquejagenerado, #versioncomplementopeticionario').prop('disabled', false);

        // Habilitar todos los campos relevantes del formulario
        $('#CURP_petit-frmDatosPersonales1, #apellidop_petit-frmDatosPersonales1, #apellidom_petit-frmDatosPersonales1, #cp_petit-frmDatosPersonales1, #estado_petit-frmDatosPersonales1, #colonia_petit-frmDatosPersonales1, #municipio_petit-frmDatosPersonales1, #ciudad_petit-frmDatosPersonales1, #calle_petit-frmDatosPersonales1, #nexterior_petit-frmDatosPersonales1, #ninterior_petit-frmDatosPersonales1, #fenac_petit-frmDatosPersonales1, #edad_petit-frmDatosPersonales1, #telefono_petit-frmDatosPersonales1, #email_petit-frmDatosPersonales1, #qatu_petit-frmDatosPersonales1, #radsexo_petit-frmDatosPersonales1, #genero_petit-frmDatosPersonales1, #chknacionalidad_petit-frmDatosPersonales1, #chksleer_petit-frmDatosPersonales1, #escosel_petit-frmDatosPersonales1, #econyugal_petit-frmDatosPersonales1, #ocupacion_petit-frmDatosPersonales1, #discapacidad_petit-frmDatosPersonales1, #gsoci_petit-frmDatosPersonales1, #leindi_petit-frmDatosPersonales1, #radsinoviomu_petit-frmDatosCalificacion1').prop('disabled', false);
        $('#numFrm,#idcomplementopet1,#idpeticionarioi1,#idquejagenerado').prop('disabled', false);

        $('input[type=radio][name="radsexo_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
        $('input[type=radio][name="chknacionalidad_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
        $('input[type=radio][name="chksleer_petit-frmDatosPersonales1"]:disabled').prop('disabled', false);
        $('input[type=radio][name="radsinoviomu_petit-frmDatosCalificacion1"]:disabled').prop('disabled', false);

        // AJAX: guardar datos del peticionario
        $.ajax({
            type: "post",
            url: 'GuardarDatosPersonalesCedula',
            content: "application/json; charset=utf-8",
            data: $(idForm).serialize() + '&nombreS=' + nombre + '&Ipaccesible=' + ip,
            dataType: "json",
            success: function (data) {
                console.log("Datos que llegaron:");
                console.log(data);
                //console.log(data)
                if (data != "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Información Actualizada Correctamente :)',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        Swal.fire({
                            text: 'Cargando Cédulas...',
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                        // Llamada a metodo que recarga de nuevo la info de las cedula (info personal e ing)
                        $.ajax({
                            type: "POST",
                            url: "TablaObtenerCedulas",
                            data: $('#frm_busquedorCedulas').serialize(),
                            dataType: "JSON",
                            success: function (response) {
                                Swal.fire({ showConfirmButton: false, timer: 1 });
                                console.log("Llamada a reset tabla");
                                console.log(response.data);
                                mostrarTablaCedulas(response.data);
                                $("#modalFormPeticionario").modal("hide");
                                Swal.close();
                            },
                            error: function () {
                                Swal.close();
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: 'Hubo un error al obtener las cédulas.',
                                    showConfirmButton: true
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
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la comunicación con el servidor'
                });
            }
        });

    });
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

    let idcomplemento = $("#idcomplementopet" + idform).val()
    let curpd = $("#CURP_petit-frmDatosPersonales" + idform).val()
    let nombrep = $("#nombre_petit-frmDatosPersonales" + idform).val()
    let apellidope = $("#apellidop_petit-frmDatosPersonales" + idform).val()
    let apellidome = $("#apellidom_petit-frmDatosPersonales" + idform).val()
    console.log(idcomplemento);
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
                // David 040625 Funcion para deshabilitar los checkbox del pdf en la ventana de impresion - aplica unicamente en la vista de -buscar id-editar info
                (Array.from(wspFrame.document.querySelectorAll('input[type="checkbox"]'))).forEach(function (checkbox) {
                    checkbox.disabled = true;
                   
                });
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
// David 05 11 2025: Duplicado de fntVerArchivo metodo aux para ver pdf
function verArchivoCedula(idarchivo, objarchivos, tipoimg, ruta) {

    if (tipoimg == '.png' || tipoimg == '.jpg' || tipoimg == '.jpeg') {

        var items = [],
            options = {
                index: 0,
                resizable: false,
                initMaximized: true,
                headerToolbar: ['close'],
            };
        items.push({
            src: ruta + objarchivos,
            title: objarchivos
        });

        new PhotoViewer(items, options);

    } else if (tipoimg == '.pdf') {
        // Pendiente cambiar rutas, ahora sigue siendo locales
        document.getElementById('titleModaladei').textContent = objarchivos;
        document.getElementById('pdfuploadei').src = ruta + objarchivos;
        $("#modalArchivoadj").modal("show");
    }
}

function fntDelItemCedula(idelement) {

    swal.fire({
        title: 'Eliminar Archivo Adjunto',
        text: "¿Desea eliminar este archivo ajunto que esta ligado a esta cédula de calificación?",
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

            fetchPost("Expediente/EliminarArchivoAdjCedula", "json", FrmArchadj, (resp) => {

                if (resp.status) {

                    document.getElementById('ideleteUpload').style.display = 'block';
                    removePhotoCedula(idelement);
                    setTimeout(() => {
                        document.getElementById('ideleteUpload').style.display = 'none';
                    }, "3000");

                }

            });

        }
    })

}
function removePhotoCedula(idArchivoBD) {
    const boton = document.querySelector(`button[onclick*="fntDelItemCedula(${idArchivoBD})"]`);
    if (boton) {
        const bloque = boton.closest(".divuploads");
        if (bloque) bloque.remove();
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
    guardarQueja();
    /* 
    let iformdatosComplementariosQueja = 
    $('.formulariodatoscomplementariosqueja').empty()                                       
    $('.formulariodatoscomplementariosqueja').append(iformdatosComplementariosQueja);*/
    $.ajax({
        type: "POST",
        url: listacatalogos,
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
            $('#municipioqueja').attr("disabled", "true");
            CargaDatosSelectOtro_("#sedeRegistro", response.lista_sedes, response.informarcionC.id_sede);
            CargaDatosSelectOtro_("#viainterpos", response.listavi, response.informarcionC.via_interpos);//Cambiar por el id_Via_Interposición
            CargaDatosSelectOtro_("#visitaduriaqueja", response.listavisitadurias, response.informarcionC.visitaduria);

            // Ricardo Agregado 26/09/2025: Se extrae solo la fecha sin la hora y se le da el formato correcto "YYYY-MM-DD"
            var inputDate = document.getElementById("Fecha_Registro");
            let fechaTexto = response.informarcionC.fecha_registro;
            let date = new Date(); // valor por defecto

            if (fechaTexto) {
                console.log("Fecha cruda recibida:", fechaTexto);

                // Extraer solo la parte de la fecha
                const soloFecha = fechaTexto.split(" ")[0]; // "DD/MM/YYYY"
                const [dia, mes, anio] = soloFecha.split("/");

                if (dia && mes && anio) {
                    date = new Date(`${anio}-${mes}-${dia}T12:00:00`);
                }

                console.log("Fecha convertida:", date);
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

            obtenerEstatusExpediente(idqueja, function (estatusExpediente) {
                if (!estatusExpediente) {
                    console.log("No se recibió estatus del SP");
                    return;
                }

                let estatusNormalizado = estatusExpediente.trim();

                if (estatusNormalizado === "Completo") {
                    EnviarQueja(); 
                } else if (estatusNormalizado === "Incompleto") {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se puede enviar la queja',
                        text: 'Falta acta circunstanciada.',
                        confirmButtonText: 'Entendido'
                    });
                    $('#frm_altaqueja button[type="button"]').hide();
                }
            });

            RecorreInput('.formulariodatoscomplementariosqueja');
            $("#modaldatoscomplementariosqueja").modal("show");
        }
    });
}

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
                    $('#municipioqueja').attr("disabled", "true");
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
    $('#municipioqueja').removeAttr("disabled");
    console.log("ElementoHabilitado");
    $("#saveQueja").off("click").on("click", function (e) {

        e.preventDefault();
        if (validarCamposVaciosInput() || validarCamposVaciosSelect()) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Tienes que completar todos los campos para continuar',
                showConfirmButton: false,
                timer: 1500
            });
            $('#municipioqueja').attr("disabled", "true");
        }
        else {

            var form_data = new FormData();
            var form_2 = $('.formQueja').serializeArray();


            var abogado = obtenerTextoSelectGenerico('#Abogadoqueja');
            var estado = "Turno Preliminar";
  
            var municipio = obtenerTextoSelectGenerico('#municipioqueja');
            var sede = obtenerTextoSelectGenerico('#sedeRegistro');
            var viainter = obtenerTextoSelectGenerico('#viainterpos');

            form_data.append("abogado_desc", abogado);//$("#documento_usuario").val())
            form_data.append("estadoqueja_desc", estado);
            form_data.append("municipioqueja_desc", municipio);
            form_data.append("sederegistro_desc", sede);
            form_data.append("viainterdesc", viainter);

            form_2.forEach(function (fields) {
                form_data.append(fields.name, fields.value);
            });

            let json = formDataToJson(form_data);
            console.log(json);
 
            $.ajax({
                type: "POST",
                url: guardaquejadqot,
                data: json,
                dataType:'JSON',
                success: function (response) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Se ha Registrado la Información Correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $("#modaldatoscomplementariosqueja").modal("hide");
                    //$('#municipioqueja').attr("disabled", "true");
                    location.reload(); // 🔁 recarga la página
                }
            });

        }
    });
}

function obtenerTextoSelectGenerico(select)
{
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