
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
var activopeticionario = '';
var activoAltaEscrito = '';
var activoActaC = '';
let escolaridadInicio = '';
let escolaridadFinal = '';
let contadorSelect = 0;
let formularioqueja = `
<div class="card-header eliminaformaes">
<h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
            <a class="nav-link active eliminaformaes" data-toggle="tab" href="#altaqueja" style="display:none;">Alta de una queja</a>
            </li>
            <li class="nav-item eliminaformaes">
            <a class="nav-link  eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
             <li class="nav-item eliminaformaes">
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_escrito" id="tab2">Alta Escrito inicial</a>
            </li>
            <li class="nav-item eliminaformaes">
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_acta" id="tab3">Alta Acta Circunstanciada</a>
            </li>
        </ul>
        <div class="tab-content eliminaformaes">
        <div class="tab-pane  ${ activopeticionario} fade show  eliminaformaes" id="datospersonales" role="tabpanel">
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
        <div class="tab-pane   fade eliminaformaes" id="altaqueja">
            <div class="pt-4 eliminaformaes">
                    <h4 class="eliminaformaes">Formulario Alta de queja</h4>
                    <p class="eliminaformaes">
                        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.
                    </p>
                    <p class="eliminaformaes">
                        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.
                    </p>
                </div>
            </div>

          <div class="tab-pane fade  ${  activoAltaEscrito}  eliminaformaes" id="alta_escrito">
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

         <div class="tab-pane fade  ${ activoActaC } eliminaformaes" id="alta_acta">
             <div class="tab-content eliminaformaes">
        <div class="tab-pane fade show active eliminaformaes" id="datosactacircunstanciada" role="tabpanel">
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
                                    <span class="accordion__header--text eliminaformaes">Datos para generar Acta circunstanciada</span>
                                    <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                </div>
                                <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                     <div class ="hoja_acta">
                                    <div class="accordion__body--text eliminaformaes" id="divformularioActaCircunstanciada">
                                    <h1>FE DE HECHOS</h1>
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


(function ($) {
    "use strict"
    fetchGet("Expediente/Llenarselects_tevi", "json", (data) => {
        //console.log(data)
        let res = data.tipoescrito;
        let viainterposicion = data.viainterposicion;
        console.log(res)
        console.log(viainterposicion)

        let html = '<select id="select_tipoescritoc" class="form-control form-control-lg"> <option value="" selected>Seleccione una opción</option> ';
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
    fetchGet("EditarFormatosExp/SelectEscolaridad", "json", (data) => {
        Escolaridad = data.escolaridad;
        escolaridadInicio = Escolaridad.slice(0, 9);
        escolaridadFinal = Escolaridad.slice(10);
        CargaDatosSelectOtroO("#escosel_petit-frmDatosPersonales1", data.escolaridad);
    })
    fetchGet("EditarFormatosExp/SelectEstadoConyugal", "json", (data) => {
        EstadoConyugal = data.estadoconyugal; console.log(EstadoConyugal); CargaDatosSelectOtroO("#econyugal_petit-frmDatosPersonales1", data.estadoconyugal);
    });
    fetchGet("EditarFormatosExp/SelectOcupacion", "json", (data) => { Ocupacion = data.ocupacion; CargaDatosSelectOtroO("#ocupacion_petit-frmDatosPersonales1", data.ocupacion); });
    fetchGet("EditarFormatosExp/SelectDiscapacidad", "json", (data) => { Discapacidad = data.discapacidad; CargaDatosSelectOtroO("#discapacidad_petit-frmDatosPersonales1", data.discapacidad); });
    fetchGet("EditarFormatosExp/SelectGrupoSocial", "json", (data) => { GrupoSocial = data.gruposocial; CargaDatosSelectOtroO("#gsoci_petit-frmDatosPersonales1", data.gruposocial); });
    fetchGet("EditarFormatosExp/SelectHijosVivos", "json", (data) => { HijosVivos = data.hijosvivos; });
    fetchGet("EditarFormatosExp/SelectModalidadViolencia", "json", (data) => { ModalidadViolencia = data.modalidadviolencia; });
    fetchGet("EditarFormatosExp/SelectTipoViolencia", "json", (data) => { TipoViolencia = data.tipoviolencia; });
    fetchGet("EditarFormatosExp/SelectRelacionAgresor", "json", (data) => { RelacionAgresor = data.relacionagresor; });

    //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito, ['1']);
    CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito, ['1']);


    $(document).on('change', '#selectTipoQueja', function (event) {


        console.log($("#selectTipoQueja").val());
		var arreTemas = [];
        arreTemas = $("#selectTipoQueja").val();
        var TemasSele = arreTemas.toString();

        console.log(TemasSele);
        CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito, arreTemas);
    });
    //CrearFormularioCrearEscrito(valueVInterposicion, tipoescrito);
    $(document).on('click', "#save", function () { /*Guardado Escrito Inicial 2023*/

        var valor_selects = '';
        $('[id^="Input_autoridades"]').each(function () {
            valor_selects += $(this).val() + ',';
        });

        console.log(valor_selects);

        $("#autoridadesselect").val(valor_selects);
        $("#lugarselect").val($("#Input_LugarHechos").val());
        $("#coloniainputs").val($("#coloniaLH").val());


        console.log("Autoridades: " + $("#autoridadesselect").val());
        console.log("lugar: " + $("#lugarselect").val());
        console.log("sino: " + $("#sino").val());
        console.log("colonia: " + $("#coloniainputs").val());

        $.ajax({
            type: "post",
            url: 'GeneraEscritoInicial',
            content: "application/json; charset=utf-8",
            data: $('#frmFromatoQueja').serialize(),
            dataType: "json",
            success: function (data) {

                if (data.mensaje == 'ok') {
                    window.open(ExportaDocumento, '_blank');
                    //location.href = ExportaDocumento;
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Información guardada Correctamente: ',
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Error al Insertar los datos',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        });
    });
    $(document).on('click', "#saveActaC", function () { //esta función se ejecutará en todos los casos
        $.ajax({
            type: "post",
            url: 'GeneraActaCircunstanciada',
            content: "application/json; charset=utf-8",
            data: $('#formActa').serialize(),
            dataType: "json",
            success: function (data) {

                if (data.mensaje == 'ok') {
                    //location.href = ExportaDocumento;
                    window.open(ExportaDocumentoacta, '_blank');
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Información guardada Correctamente: ',
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Error al Insertar los datos',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        });
    });
    $(document).on('keypress', "#cpPet", function (e) { //esta función se ejecutará en todos los casos
        if (e.which == 13) {
            $.getJSON("https://api.copomex.com/query/info_cp/" + $("#cpPet").val() + "?type=simplified&token=pruebas", function (copomex) {
                console.log(copomex.response);
                $("#municipioPet").val(copomex.response.municipio);
                $("#estadoPet").val(copomex.response.estado);
                $("#cpPet").val(copomex.response.cp);
                CargaDatosSelect('#coloniaPet', copomex.response.asentamiento);
            })

                .fail(function () { console.log('Ha ocurrido un error') });
        }

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
    $(document).on('change', '#nomAbogado', function (event) {
        console.log($("#nomAbogado option:selected").val());
        $('#idabogado').val($("#nomAbogado option:selected").val());
        $('#idpet').val('1165');
        $('#idEscrito_').val('2');
    });
    $(document).on('change', '#consentimiento', function (event) {
        console.log($("#consentimiento option:selected").val());
        $('#idconsentimiento').val($("#consentimiento option:selected").val());
    });
    $(document).on('change', '#identificacionPet', function (event) {
        console.log($("#identificacionPet option:selected").val());
        $('#idcredencial').val($("#identificacionPet option:selected").val());
    });
    $(document).on('change', '#mes', function (event) {
        console.log($("#mes option:selected").val());
        $('#id_mes').val($("#mes option:selected").val());
    });
    $(document).on('change', '#anio', function (event) {
        console.log($("#anio option:selected").val());
        $('#id_anio').val($("#anio option:selected").val());
    });
    $(document).on('change', '#lugar', function (event) {
        console.log($("#lugar option:selected").val());
        $('#id_lugar').val($("#lugar option:selected").val());
    });
    $(document).on('change', '#origenPet', function (event) {/*Adicion del Origen del peticionario cuando es extranjero en el catalogo es 246*/
        console.log($("#origenPet option:selected").val());
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

        } else
        {
            console.log("Entro al else ");
            $("#origenPetExt").select2().next().hide();
            $("#origenPetExtedo").css("display", "none");
            $("#origenPetvalExt").val("");
            $("#origenPetExtedo").val("");

        }

    });
    $(document).on('change', '#origenPetExt', function (event) {/*Adicion del Origen del peticionario cuando es extranjero en el catalogo es 246*/
        console.log($("#origenPetExt option:selected").val());/*Desde el origen Vine Vacio*/
        var seleccion = $("#origenPetExt option:selected").val();
        $('#origenPetvalExt').val($("#origenPetExt option:selected").val());

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
        contenedor = Agrega_PersonaAutoridad();
        $('#Contenedor_Cargos_Personas').append(contenedor);
        fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
            let autoridad = data.lista2;

            CargaDatosSelectOtro("#Input_autoridades" + contadorSelect + "", autoridad);
            contadorSelect++;
        })
        //Carga_Informacion_selec_quejas();

        return body;
    });

   
})(jQuery);
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
function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel) {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" ' + tiposelect + '> <option value="">Seleccione una opción</option>';
    for (let v = 0; v < arreglo.length; v++) {
        htmld += `
                <option value="${arreglo[v].idSelect}">${arreglo[v].descripcion}</option>
            `;
    }
    htmld += "</select>";

    return htmld
    //$("#" + id).select2();
}
function CreaSelectLabel(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel) {
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" ' + tiposelect + '> <option value="">Seleccione una opción</option>';
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
    // $("#" + id).select2();
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
function creaFormularioCompleto(act1,act2,act3)
{
    console.log('activo 1:' + act1);
    console.log('activo 2:' + act2);
    console.log('activo 3:' + act3);
    var formularioqueja = `
<div class="card-header eliminaformaes">
<h4 class="card-title eliminaformaes">Depende lo seleccionado</h4>
</div>
<div class="card-body eliminaformaes">
    <div class="default-tab eliminaformaes">
        <ul class="nav nav-tabs eliminaformaes" role="tablist">
            <li class="nav-item eliminaformaes">
            <a class="nav-link active eliminaformaes" data-toggle="tab" href="#altaqueja" style="display:none;">Alta de una queja</a>
            </li>
            <li class="nav-item eliminaformaes">
            <a class="nav-link  eliminaformaes" data-toggle="tab" href="#datospersonales" id="tab1">Registro de Datos Personales</a>
            </li>
             <li class="nav-item eliminaformaes">
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_escrito" id="tab2">Alta Escrito inicial</a>
            </li>
            <li class="nav-item eliminaformaes">
            <a class="nav-link eliminaformaes" data-toggle="tab" href="#alta_acta" id="tab3">Alta Acta Circunstanciada</a>
            </li>
        </ul>
        <div class="tab-content eliminaformaes">
        <div class="tab-pane ${act1} fade show eliminaformaes" id="datospersonales" role="tabpanel">
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
                                                            
                                                            <div id="ref-frm-frmDatosPersonales1" class="tab-pane active fade show divformularioDatosPersonales eliminaformaes">
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
        <div class="tab-pane   fade eliminaformaes" id="altaqueja">
            <div class="pt-4 eliminaformaes">
                    <h4 class="eliminaformaes">Formulario Alta de queja</h4>
                    <p class="eliminaformaes">
                        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.
                    </p>
                    <p class="eliminaformaes">
                        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.
                    </p>
                </div>
            </div>

          <div class="tab-pane ${act2} fade show  eliminaformaes" id="alta_escrito">
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

         <div class="tab-pane ${act3} fade show eliminaformaes" id="alta_acta">
             <div class="tab-content eliminaformaes">
        <div class="tab-pane fade show active eliminaformaes" id="datosactacircunstanciada" role="tabpanel">
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
                                    <span class="accordion__header--text eliminaformaes">Datos para generar Acta circunstanciada</span>
                                    <span class="accordion__header--indicator indicator_bordered eliminaformaes"></span>
                                </div>
                                <div id="header-bg_collapseOne" class="collapse accordion__body show eliminaformaes" data-parent="#accordion-seven">
                                     <div class ="hoja_acta">
                                    <div class="accordion__body--text eliminaformaes" id="divformularioActaCircunstanciada">
                                    <h1>FE DE HECHOS</h1>
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
`;
    return formularioqueja;
}
function CrearFormularioCrearEscrito(vinterpoiscion, tescrito, arregloSelects) {
    console.log("Entró a la creación del formulario de quejas ");
   var visibilidadPestaniaRDP = false;
    var visibilidadPestaniaAQ = false;
    var visibilidadPestañaAI = false;
    var visibilidadPestañaAC = false;
    var arreglo1 = [];
    arreglo1 = arregloSelects;
    if (arregloSelects.indexOf("1") >= 0) { visibilidadPestaniaRDP = true; activopeticionario = 'active' } else { visibilidadPestaniaRDP = false; activopeticionario = ''; }
    if (arregloSelects.indexOf("2") >= 0) { visibilidadPestañaAI = true; activoAltaEscrito = 'active' } else { visibilidadPestañaAI = false; activoAltaEscrito = ''; }
    if (arregloSelects.indexOf("3") >= 0) { visibilidadPestañaAC = true; activoActaC = 'active' } else { visibilidadPestañaAC = false; activoActaC = ''; }
    if (arregloSelects.indexOf("4") >= 0) { visibilidadPestaniaAQ = true; } else { visibilidadPestaniaAQ = false; }

        /**/
    console.log('vi: ' + vinterpoiscion + ' te: ' + tescrito)
    let eliminarform = document.querySelectorAll('.eliminaformaes');
    for (var i = 0; i < eliminarform.length; i++) {
        eliminarform[i].remove();
    }

    let formPetit = formPeticionario(1);
    //let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');
    //let iformActaCircunstanciada = formActacircunstanciada2c();



    $('#formularioaltaescritodqot').append(creaFormularioCompleto(activopeticionario, activoAltaEscrito, activoActaC));

            $("#tab1").css('display', 'none');
            $("#tab2").css('display', 'none');
            $("#tab3").css('display', 'none');
    if (visibilidadPestaniaRDP) {
        console.log("RDP"); $("#tab1").css('display', 'block'); $('#ref-frm-frmDatosPersonales1').append(formPetit); TraeInformaciónPet('GALE991231HPLRPV04', 'Alexa', 'Vdfvdfvdf', 'Lopez');} else { $("#tab1").css('display', 'none'); }
            if (visibilidadPestañaAI){let iformEscritoInicial = formEscritoInicial2('#', 'frmFromatoQueja');$('#divformularioEscritoInicial').append(iformEscritoInicial);$("#tab2").css('display', 'block');console.log($('#divformularioEscritoInicial'));} else {$("#tab2").css('display', 'none');}
            if (visibilidadPestañaAC) {let iformActaCircunstanciada = formActacircunstanciada2c();$('#divformularioActaCircunstanciada').append(formActacircunstanciada2c());console.log("Se ve AC");$("#tab3").css('display', 'block');} else {$("#tab3").css('display', 'none');}
         
            addPeticionarios();
            guardarDatosPeticionarios();
            chkNoproporcinado();
            seltxt();
            keypresscp();
            fetchGet("Expediente/SelectPaises", "json", (data) => {
                let Paises = data.relacionpaises;
                console.log(Paises)
                AgregarOptionSelectPais(1, 'dellistpaiseso', '#migorig_petit-frmDatosPersonales1', Paises);
                AgregarOptionSelectPais(1, 'dellistpaisesd', '#migdesti_petit-frmDatosPersonales1', Paises);
            })


   

    Carga_Informacion_selec_quejas();
    $('#Input_autoridades').select2();
    $("#origenPetExt").css("display", "none");
    $("#origenPetExtedo").css("display", "none");
   
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
        console.log(nfin)

        NuevoNavHrzPeticionario(nfin);
        guardarDatosPeticionarios();
        chkNoproporcinado();
        seltxt();
        keypresscp();
    });
}
function btnGenerapdfp(element) {

    let idform = element.dataset.idform;
    let wspFrame = document.getElementById('frame').contentWindow;
    let html = wspFrame.document.all;
    let curpd = $("#CURP_petit-frmDatosPersonales" + idform).val()
    let nombrep = $("#nombre_petit-frmDatosPersonales" + idform).val()
    let apellidope = $("#apellidop_petit-frmDatosPersonales" + idform).val()
    let apellidome = $("#apellidom_petit-frmDatosPersonales" + idform).val()


    if (curpd == '') {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ingrese la CURP o el nombre completo del peticoinario',
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

}
function TraeInformaciónPet(curpd, nombrep, apellidop, apellidom)
{
    /*
   form["CURP_petit-frmDatosPersonales" + numFrm].ToString().ToUpper();
   form["nombre_petit-frmDatosPersonales" + numFrm].ToString().ToLower();
   form["apellidop_petit-frmDatosPersonales" + numFrm].ToString().ToLower();
   form["apellidom_petit-frmDatosPersonales" + numFrm].ToString().ToLower();
   form["calle_petit-frmDatosPersonales" + numFrm].ToString();
   form["nexterior_petit-frmDatosPersonales" + numFrm].ToString();
   form["ninterior_petit-frmDatosPersonales" + numFrm].ToString();

   form["colonia_petit-frmDatosPersonales" + numFrm].ToString();
   form["ciudad_petit-frmDatosPersonales" + numFrm].ToString();

   form["municipio_petit-frmDatosPersonales" + numFrm].ToString();
   form["estado_petit-frmDatosPersonales" + numFrm].ToString();
   form["cp_petit-frmDatosPersonales" + numFrm].ToString();
   form["telefono_petit-frmDatosPersonales" + numFrm].ToString();
   form["edad_petit-frmDatosPersonales" + numFrm].ToString();
   form["email_petit-frmDatosPersonales" + numFrm].ToString();
   form["ogenero_petit-frmDatosPersonales" + numFrm].ToString();
   form["escosel_petit-frmDatosPersonales" + numFrm].ToString();
   form["econyugal_petit-frmDatosPersonales" + numFrm].ToString();
   form["ocupacion_petit-frmDatosPersonales" + numFrm].ToString();
   form["ocupacioninpt_petit-frmDatosPersonales" + numFrm].ToString();
   form["chknacionalidad_petit-frmDatosPersonales" + numFrm].ToString();
   form["chksleer_petit-frmDatosPersonales" + numFrm].ToString();
   form["discapacidad_petit-frmDatosPersonales" + numFrm].ToString());
   form["gsoci_petit-frmDatosPersonales" + numFrm].ToString();
   form["gsociinpt_petit-frmDatosPersonales" + numFrm].ToString();
   form["leindi_petit-frmDatosPersonales" + numFrm].ToString();
   form["oleindi_petit-frmDatosPersonales" + numFrm].ToString();
   form["fenac_petit-frmDatosPersonales" + numFrm].ToString();
   $("input[name='CURP_petit-frmDatosPersonales1']")
   */
    let wspFrame = document.getElementById('frmDatosPersonales1');
    let html = frmDatosPersonales1;
    console.log(EstadoConyugal);

    $.ajax({
        type: "POST",
        url: "GetDataPeticionario",
        data: { curp: curpd, nombre: nombrep, apellidop: apellidop, apellidom: apellidom },
        dataType: "JSON",
        success: function (response) {

            if (response.data.length > 0) {
                console.log(response.data[0])
                console.log(wspFrame);
                console.log(html);
                console.log(response.data[0].colonia);
                console.log(response.data[0].fkSexo);
                console.log(response.data[0].fkEscolaridad);

                $("input[name='curp_petit-frmDatosPersonales1']").val(curpd);/*No esta el input del CURP*/
                $("input[name='nombre_petit-frmDatosPersonales1']").val(response.data[0].nombre);
                $("input[name='apellidop_petit-frmDatosPersonales1']").val(response.data[0].apellidoPat);
                $("input[name='apellidom_petit-frmDatosPersonales1']").val(response.data[0].apellidoMat);
                $("input[name='calle_petit-frmDatosPersonales1']").val(response.data[0].calle);
                $("input[name='nexterior_petit-frmDatosPersonales1']").val(response.data[0].numExterior);
                $("input[name='ninterior_petit-frmDatosPersonales1']").val(response.data[0].numInterior);
                $("#colonia_petit-frmDatosPersonales1 option:contains('" + response.data[0].colonia + "')").attr("selected", "true");/*Seleccion del elemento dentro de un select*/
                $("#ciudad_petit-frmDatosPersonales1 option:contains('" + response.data[0].ciudad + "')").attr("selected", "true");
                $("input[name='municipio_petit-frmDatosPersonales1']").val(response.data[0].municipio);
                $("input[name='estado_petit-frmDatosPersonales1']").val(response.data[0].estado);
                $("input[name='cp_petit-frmDatosPersonales1']").val(response.data[0].codigoPostal);
                $("input[name='telefono_petit-frmDatosPersonales1']").val(response.data[0].telefono);
                $("input[name='edad_petit-frmDatosPersonales1']").val(response.data[0].edad);
                $("input[name='email_petit-frmDatosPersonales1']").val(response.data[0].email);

                //$("input[type=checkbox]").prop("checked", true);

                $('input[value=' + response.data[0].fkSexo + ']').prop('checked', true);/*Seleccionar lapropiedad checked en True*/
                $('input[value=' + response.data[0].tipoUsuario + ']').prop('checked', true);
                $('input[value=' + response.data[0].nacionalidad + ']').prop('checked', true);
                $('input[value=' + response.data[0].sabeLeer + ']').prop('checked', true);

                $("#genero_petit-frmDatosPersonales1 option[value=" + response.data[0].genero + "]").attr("selected", "true");
               //$("#escosel_petit-frmDatosPersonales1").select2().val(response.data[0].fkEscolaridad).trigger('change');
                //$("#escosel_petit-frmDatosPersonales1 option[value=" + response.data[0].fkEscolaridad + "]").attr("selected", "true");
                $("#econyugal_petit-frmDatosPersonales1 option[value=" + response.data[0].fkEstadoConyugal + "]").attr("selected", "true");
                $("#ocupacion_petit-frmDatosPersonales1 option[value=" + response.data[0].fkOcupacion + "]").attr("selected", "true");
                $("#discapacidad_petit-frmDatosPersonales1 option[value=" + response.data[0].fkDiscapacidad + "]").attr("selected", "true");
                $("#gsoci_petit-frmDatosPersonales1 option[value=" + response.data[0].fkGrupoSocial + "]").attr("selected", "true");
                $("#leindi_petit-frmDatosPersonales1 option[value=" + response.data[0].hablaLenguai + "]").attr("selected", "true");

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
                        <button class="btnDelPetit eliminaformaes delPeticionariodp" id="delPeticionariodp-frmDatosPersonales${numconsecutivo}">
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
function deleteFormulario() {
    $('.btnDelPetit').click(function (e) {
        e.preventDefault();
        let arrid = this.id.split('-');

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

            $.getJSON("https://api.copomex.com/query/info_cp/" + this.value + "?type=simplified&token=7ff4022f-4cf6-46b1-8385-0e60ef8ee446", function (copomex) {
                estado = copomex.response.estado;
                municipio = copomex.response.municipio;
                $("#municipio_petit-frmDatosPersonales" + idfrm).val(municipio);
                $("#estado_petit-frmDatosPersonales" + idfrm).val(estado);
                $("#cp_petit-frmDatosPersonales" + idfrm).val(copomex.response.cp);
                AgregarOptionSelect(idfrm, 'deloptioncolonia', '#colonia_petit-frmDatosPersonales' + idfrm, copomex.response.asentamiento);
            }).done(function () {

                $.getJSON("https://api.copomex.com/query/get_localidad_por_estado_municipio/?estado=" + estado + "&municipio=" + municipio + "&token=7ff4022f-4cf6-46b1-8385-0e60ef8ee446", function (copomex) {
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
                        type: "hidden"
                    },
                    {
                        valhidden: "",
                        name: "idcomplementopet",
                        type: "hidden"
                    },
                    {
                        valhidden: "",
                        name: "idpeticionarioi",
                        type: "hidden"
                    },
                    {
                        class: "col-md-6",
                        label: "CURP",
                        type: "text",
                        name: "curp_petit-frmDatosPersonales" + idformulario,
                        classControl: "ob max-20 eliminaformaes",
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
                        label: "Código Postal",
                        name: "cp_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        iformularioit: idformulario,
                        classControl: "ob max-300 eliminaformaes buscacp",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "cp_petitno-frmDatosPersonales" + idformulario,
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
                        required: 'required',
                        name: "nexterior_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        namenoprop: "nexterior_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "No. Interior",
                        required: 'required',
                        name: "ninterior_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes",
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
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
                        namenoprop: "edad_petitno-frmDatosPersonales" + idformulario,
                        typechk: "chkx"
                    },
                    {
                        class: "col-md-3",
                        label: "Teléfono",
                        name: "telefono_petit-frmDatosPersonales" + idformulario,
                        type: "text",
                        classControl: "ob max-300 eliminaformaes",
                        noproporcionado: true,
                        required: 'required',
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
                        required: 'required',
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
                        classControl: "dis-none ob max-20 eliminaformaes frmviolenciam" + idformulario,
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

        let numFrm = this.dataset.numform;
        let idForm = '#frmDatosPersonales' + numFrm;

        $.ajax({
            type: "post",
            url: 'GuardarDataComplPeticionario',
            content: "application/json; charset=utf-8",
            data: $(idForm).serialize(),
            dataType: "json",
            success: function (data) {
                console.log(data)

                if (data.idpeticionario > 0 && data.idcomplemento > 0) {

                    $('#idcomplementopet').val(data.idcomplemento);
                    $('#idpeticionarioi').val(data.idpeticionario);

                    if (data.tipousuario == 'Agraviado') {
                        let FrmEnlacefq = new FormData();
                        FrmEnlacefq.append('id_complemento', $('#idcomplementopet').val());
                        FrmEnlacefq.append('id_peticionario', $('#idpeticionarioi').val());

                        fetchPost("Expediente/GeneraIdQueja", "json", FrmEnlacefq, (resp) => {
                            console.log(resp)
                            let idqueja = resp.idqueja;

                            if (resp.status) {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Información guardada Correctamente, Id Queja: ' + idqueja,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }

                        });

                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Información guardada Correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Error al Insertar los datos, comuniquese ',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        });

        //    //let FrmPeticionario = new FormData();

        //    //FrmPeticionario.append('tipo_usuario', getRadio('qatu_petit-frmDatosPersonales' + numFrm, idForm));


        //    //console.log(getRadio('qatu_petit-frmDatosPersonales' + numFrm, idForm));
        //    //console.log(getChk('chksexo_petit-frmDatosPersonales' + numFrm));
        //    //console.log(getSelect('escosel_petit-frmDatosPersonales' + numFrm));

    });
}
function Agrega_PersonaAutoridad() {
    var arregloBlanco = [];
    var cuerpo = CreaInputs_Con_Label('Input_nombres', 'Input_nombres', '', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres', 'placeholder="Nombres y apellidos" style ="float:left;"', ' style ="float:left;"')
        + CreaInputs_Con_Label('Input_cargo', 'Input_cargo', '', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" style ="float:left;"', ' style ="float:left;"')
        + CreaSelectLabelSelect2('Input_autoridades' + contadorSelect + '', "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' style ="float:left;"', ' style ="float:left;max-width: 180px !important;"')
        + CreaBR()
        + CreaBR();
    return cuerpo;

}
function formEscritoInicial2(action, id) {

    var arregloBlanco = [];

    var formulario = '<form id="' + id + '" action="" method="" class="text-left">';
        var cuerpo = '<div class="text-right">'
        + CreaInputs_Con_LabelID('Input_ID', 'Input_ID', '', 'text', 'ID:&nbsp;', 'textfield', 'placeholder="ID del expediente"', ' style ="margin-left: 65%;"')
        + CreaBR()
        + CreaInputs_Con_Label('Input_Peticionario', 'Input_Peticionario', '', 'text', 'Peticionaria/o:&nbsp;', 'textfield', 'placeholder="Nombre del peticionario"', 'style ="margin-left: 60%;"')
        + '</div>'
        + Crea_Parrafos('parrafo0', 'parrafo0', 'col-md-3 parrafo', 'DR. JOSÉ FELIX CEREZO VÉLEZ</br>PRESIDENTE DE LA COMISIÓN DE DERECHOS HUMANOS DEL ESTADO DE PUEBLA', 'style ="text-align: left;font-weight: bold;"')
        + '<div class="text-justify">'
        + Crea_Parrafos('parrafo1', 'parrafo1', 'col-md-12 parrafo', 'Con fundamento en los artículos 2, 4, 5, 13 fracciones I, II, III, IV y V, 25, 28 y demás relativos y aplicables de la Ley de la Comisión de Derechos Humanos del Estado, ante personal de este organismo y por mi propio derecho, acudo a denunciar actos u omisiones que a mi juicio constituyen violación a mis derechos humanos, en los términos que a continuación se expresan:', 'style ="text-align: left"')
        + '</div>'
            + CreaInputs_Con_Label('Input_FechaHechos', 'Input_FechaHechos', '', 'datetime-local', '&nbsp;&nbsp;&nbsp;FECHA EN QUE OCURRIERON LOS HECHOS:&nbsp;', 'textfield', 'placeholder="fecha hechos" style ="float:left;"', ' style ="float:left;"')
        + CreaBR()
        + CreaBR()
        //+ CreaInputs_Con_Label('Input_LugarHechos', 'Input_LugarHechos', '', 'text', 'Lugar en donde Ocurrieron los Hechos: ', 'Input_LugarHechos', 'placeholder="Lugar de los Hechos" style ="float:left;"', ' style ="float:left;"')
            + CreaSelectLabelSelect2('Input_LugarHechos', '', arregloAutoridades(), '', '&nbsp;&nbsp;&nbsp;LUGAR EN QUE SE SUSCITARON LOS HECHOS:&nbsp;', '', ' style ="float:left;"', ' style ="float:left; width:40%;"')
        + CreaInputs_Con_Label('CheckDcompleta', 'CheckDcompleta', '', 'checkbox', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;¿SABE LA DIRECCIÓN COMPLETA?&nbsp;&nbsp;', 'CheckDcompleta', '', '')
        + '<div id="Contenedor_Datos_LE"></div>'
        + CreaBR()
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'CIRCUNSTANCIAS BAJO LAS CUALES OCURRIERON LOS HECHOS:&nbsp;')
        + CreaTextArea('CircunstanciasHechos', 'col - md - 12 parrafo')
        + Crea_Label('parrafo4', 'parrafo4', 'col-md-12 parrafo', 'AUTORIDAD(ES) INVOLUCRADA(S):&nbsp;&nbsp;&nbsp;')
        + CreaBR()
        + CreaBR()
        + CreaInputs_Con_Label('Input_nombres', 'Input_nombres', '', 'text', 'PROPORCIONAR SUS NOMBRES, APELLIDOS:&nbsp;', 'Input_nombres', 'placeholder="Nombres y apellidos" style ="float:left;"', ' style ="float:left;"')
        + CreaInputs_Con_Label('Input_cargo', 'Input_cargo', '', 'text', '&nbsp;&nbsp;&nbsp;CARGO:&nbsp;', 'Input_cargo', 'placeholder="cargo" style ="float:left;"', ' style ="float:left;"')
            + CreaSelectLabelSelect2('Input_autoridades', "", arregloBlanco, '', '&nbsp;&nbsp;&nbsp;AUTORIDAD:&nbsp;', '', ' style ="float:left;"', ' style ="width:180px!important; float:left;max-width:180px!important;"')
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
        + crea_Boton('button', 'Previsualizar PDF', 'generaPDF', 'btn btn-pinterest')
        + crea_Boton('button', 'Guardar', 'save', 'btn btn-success')
        + '</div>'
        + CreaInputs('sino', 'sino', '', 'hidden')
        + CreaInputs('autoridadesselect', 'autoridadesselect', '', 'hidden')
        + CreaInputs('lugarselect', 'lugarselect', '', 'hidden')
        + CreaInputs('coloniainputs', 'coloniainputs', '', 'hidden');

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
function formActacircunstanciada2c() {

    var idUser = $("#idusuario").val();
    var Area = $("#areaUser").val();
    var Cargo = $("#cargoUser").val();

    console.log("ID_USER:" + idUser);
    console.log("AREA_USER:" + Area);
    console.log("CARGO_USER:" + Cargo);
    var arregloBlanco = [];

    var formInnicial = '<form class="text-justify form_acta" id="formActa" name="formActa" method="post" style="width:90%; margin-left:5%" >';
    var cuerpo =
        //CreaInputs_Con_Label('lugar', 'lugar', '', 'text', 'En', 'textfield2')
        CreaSelectLabel('lugar', '', arregloBlanco, '', 'En', '')
        + CreaInputs_Con_Label('diaFecha', 'diaFecha', '', 'number', ', a los', 'textfield', 'mes')
        + CreaSelectLabel('mes', '', arregloMeses(), '', 'días del mes de', 'textfield4')
        + CreaSelectLabel('anio', '', arregloAnio(), '', 'de', '')
        //+ CreaInputs_Con_Label('nomAbogado', 'nomAbogado', '', 'text', ', el suscrito, licenciado', 'textfield5', 'placeholder="nombre de abogado"')
        + CreaSelectLabel('nomAbogado', '', arregloBlanco, '', ', el suscrito, licenciado', '')
        + CreaInputs_Con_Label('puestoAbogado', 'puestoAbogado', '', 'text', ', en mi carácter de', 'textfield6', 'placeholder="cargo de abogado" value="' + Cargo + '" disabled')
        + CreaInputs_Con_Label('areaAbogado', 'areaAbogado', '', 'text', ', de la', 'textfield7', 'placeholder="área de abogado" value="' + Area + '" disabled')
        + Crea_Label('textfield8', 'textfield8', '', 'de la Comisión de Derechos Humanos del Estado de Puebla, con la fe pública que me confiere el artículo 21 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla, así como 30, 37, y 39 de su Reglamento Interno, publicados en el Periódico Oficial del Estado, respectivamente')
        + Crea_LabelCentro('textfield8', 'textfield8', '', '<b>CERTIFICO:</b>')
        + CreaInputs_Con_Label('horaInicio', 'horaInicio', '', 'time', 'Que siendo las', 'textfield9', '')
        + CreaInputs_Con_Label('ubicacion', 'ubicacion', '', 'text', 'horas del día del día en que se actúa, me constituí en', 'textfield10', 'placeholder="lugar de entrevista"')
        + CreaInputs_Con_Label('nombrePet', 'nombrePet', '', 'text', ', donde atendí a quien dijo llamarse', 'textfield10', 'placeholder="nombre de peticionario"')
        + CreaSelectLabel('consentimiento', '', SeleccionMultiple(), '', 'ante quien una vez que me identifiqué plenamente como servidor público adscrito a este Organismo Autónomo, con la respectiva identificación que esta Comisión de Derechos Humanos del Estado de Puebla me expidió, se le hizo de su conocimiento el motivo de la diligencia, se le solicitó su autorización para ser entrevistado, expresando que', '')
        //+ CreaInputs_Con_Label('origenPet', 'origenPet', '', 'text', 'otorga su consentimiento para llevar a cabo la entrevista, por lo que se le exhortó para que se conduzca con verdad ante el personal de la Comisión de Derechos Humanos del Estado de Puebla, comprometiéndose así hacerlo y al respecto <strong>MANIFESTÓ: </strong>Llamarse como ha quedado escrito, ser originario de', 'textfield10', 'placeholder="origen de peticionario"')
        + CreaSelectLabel('origenPet', '', arregloBlanco, '', 'otorga su consentimiento para llevar a cabo la entrevista, por lo que se le exhortó para que se conduzca con verdad ante el personal de la Comisión de Derechos Humanos del Estado de Puebla, comprometiéndose así hacerlo y al respecto <strong>MANIFESTÓ: </strong>Llamarse como ha quedado escrito, ser originario de', '')
        + CreaSelectLabel('origenPetExt', '', arregloBlanco, '', '', '')
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
        + CreaSelectLabel('identificacionPet', '', arregloIdentificación(), '', 'identificándose ante el suscrito con', '')
        + Crea_LabelCentro('textfield11', 'textfield11', '', 'y en relación a los hechos de la queja que nos ocupa, <strong>DECLARO:</strong><br>')
        + CreaInputs_Con_Label('fechaHechos', 'fechaHechos', '', 'date', 'Que el día', 'textfield10', '')
        + CreaInputs_Con_Label('horaHechos', 'horaHechos', '', 'time', 'a las', 'textfield10', '')
        + CreaInputs_Con_Label('ubiHechos', 'ubiHechos', '', 'text', 'estando en', 'textfield10', 'placeholder="lugar de hechos"')
        + CreaSelectLabel('catMunicipio_hechos', '', arregloMun(), '', 'ubicado en el municipio de', '')
        + CreaSelectLabel('catEstado_hechos', '', arreglo_Estados(), '', 'del estado dee', '')
        + CreaSelectLabel('catAutoridad', '', arregloEstado(), '', ', la(s) autoridad(es)', '')
        + CreaTextArea('hechos', '', 'style="width:100%"')
        + CreaInputs_Con_Label('horaTermino', 'horaTermino', '', 'time', ', dando por terminada la presente actuación a  las', 'textfield10', '')
        + Crea_LabelCentro('textfield12', 'textfield12', '', 'horas. Hago constar lo anterior de conformidad con lo establecido en los numerales 31 de la Ley de la Comisión de Derechos Humanos del Estado de Puebla para los efectos correspondientes----------------------------------<b>DOY FE.</b> ')
        + crea_Boton('button', 'Previsualizar PDF', 'generaPDFActaC', 'btn btn-pinterest')
        + crea_Boton('button', 'Guardar', 'saveActaC', 'btn btn-success')
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
    


    var fin_form = '</form>';

    let formualarioCompleto = formInnicial + cuerpo + fin_form;




    return formualarioCompleto;
}
function crea_Boton(tipo, texto, id, clase) {
    return " <button id='" + id + "' class='" + clase + "' type='" + tipo + "' value='" + texto + "''>" + texto + "</button>";
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
    return "<input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' > </br> "
}
function CreaInputs_Con_Label(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaInputs_Con_LabelID(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaBR() {
    return "</br>"
}
function CreaTextArea(Name, clas, adicion) {
    return "<textarea class='" + clas + "' name='" + Name + "' rows='10' cols='50' " + adicion + " ></textarea>";
}
function formEscritoInicial() {
    let frmEscritoInicial = crearForumulario(
        {
            idformulario: "frmEscritoInicial"
        },
        {
            formulario:
                [
                    {
                        class: "col-md-6",
                        label: "Nombre(s)",
                        name: "nombre_petit",
                        type: "text",
                        classControl: "ob max-20"
                    },
                    {
                        class: "col-md-6",
                        label: "Apellido Paterno",
                        name: "apellidop_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Apellido Materno",
                        name: "apellidom_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Fecha en que ocurrieron los hechos (dd/mm/aaaa)",
                        name: "fecha_hechos",
                        type: "text",
                        lassControl: "ob max-20"
                    },
                    {
                        class: "col-md-6",
                        label: "Municipio",
                        name: "municipio_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Estado",
                        name: "estado_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-12",
                        label: "Circunstancias bajo las cuales ocurrieron los hechos",
                        name: "circunstancias_hechos",
                        type: "textarea",
                        classControl: "ob max-3000",

                    },

                    {
                        class: "col-md-6",
                        label: "Nombre(s)",
                        name: "nombre_altaqueja",
                        type: "text",
                        classControl: "ob max-20"
                    },
                    {
                        class: "col-md-6",
                        label: "Apellido Paterno",
                        name: "apellidop_altaqueja",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Apellido Materno",
                        name: "apellidom_altaqueja",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Cargo",
                        name: "cargo",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Autoridad a la que pertenece",
                        name: "autoridad",
                        type: "text",
                        classControl: "ob max-300"
                    },

                ]
        }
    );
    return frmEscritoInicial;
}
function formActaCircunstanciada() {

    let frmActaCircunstanciada = crearForumulario(
        {
            idformulario: "frmActaCircunstanciada"
        },
        {
            formulario:
                [
                    {
                        class: "col-md-3",
                        label: "Consentimiento del peticionario",
                        type: "radio",
                        labels: [
                            'Sí', 'No'
                        ],
                        ids: {
                            0: 'id1',
                            1: 'id2'
                        },
                        values: {
                            0: 'vid1',
                            1: 'vid2'
                        },
                        class: "col-md-3",
                        checked: [

                        ],
                        name: "consentimiento",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Sabe leer",
                        type: "radio",
                        labels: [
                            'Sí', 'No'
                        ],
                        ids: {
                            0: 'id1',
                            1: 'id2'
                        },
                        values: {
                            0: 'vid1',
                            1: 'vid2'
                        },
                        class: "col-md-3",
                        checked: [

                        ],
                        name: "leer_petit",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Lugar de creación de acta",
                        name: "lugar",
                        type: "text",
                        classControl: "ob max-20"
                    },

                    {
                        class: "col-md-6",
                        label: "Nombre(s)",
                        name: "nombre_petit",
                        type: "text",
                        classControl: "ob max-20"
                    },
                    {
                        class: "col-md-6",
                        label: "Apellido Paterno",
                        name: "apellidop_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Apellido Materno",
                        name: "apellidom_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Calle",
                        name: "calle_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "No. Exterior",
                        name: "nexterior_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "No. Interior",
                        name: "ninterior_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Colonia",
                        name: "colonia_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Ciudad/Localidad",
                        name: "ciudad_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "Municipio",
                        name: "municipio_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Estado",
                        name: "estado_petit",
                        type: "text",
                        classControl: "ob max-300"
                    }
                    ,
                    {
                        class: "col-md-3",
                        label: "Teléfono",
                        name: "telefono_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-6",
                        label: "correo electronico",
                        name: "correo_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Edad",
                        name: "edad_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Escolaridad",
                        name: "escolaridad_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Ocupación",
                        name: "ocupación_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },
                    {
                        class: "col-md-3",
                        label: "Tipo de Identificación",
                        name: "identificación_petit",
                        type: "text",
                        classControl: "ob max-300"
                    },


                    {
                        class: "col-md-12",
                        label: "Narración de los hechos",
                        name: "narracion_hechos",
                        type: "textarea",
                        classControl: "ob max-300",

                    },

                ]
        }
    );

    return frmActaCircunstanciada;
}
function arregloDocumentos() {
    var arreglo = [];
    const objeto = { idSelect: 1, descripcion: 'Hoja de Datos Personales' }
    const objeto1 = { idSelect: 2, descripcion: 'Escrito Inicial de queja' }
    const objeto2 = { idSelect: 3, descripcion: 'Acta circunstanciada' }

    arreglo.push(objeto);
    arreglo.push(objeto1);
    arreglo.push(objeto2);

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
function CargaDatosSelectOtroO(select, arreglo) {
    var htmld = select;
    htmld += ' <option value="">Seleccione una opción</option>';
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
function Carga_Informacion_selec_quejas() {
    fetchGet("Expediente/selectsCreacionExpediente", "json", (data) => {
        //console.log(data)
        let abogado = data.lista3;
        let estado = data.lista4;
        let autoridad = data.lista2;
        let estadoRM = data.lista5;
        console.log(abogado);
        console.log(estado);
        console.log(estadoRM);

        CargaDatosSelectOtro("#lugar", estado);
        CargaDatosSelectOtro("#nomAbogado", abogado);
        CargaDatosSelectOtro("#Input_LugarHechos", estado);
        CargaDatosSelectOtro("#Input_autoridades", autoridad);
        CargaDatosSelectOtro("#origenPet", estado);
        CargaDatosSelectOtro("#catMunicipio_hechos", estado);
        CargaDatosSelectOtro("#catEstado_hechos", estadoRM);
        

        var idUser = $("#idusuario").val();
        console.log("ID_USER_SELECT:" + idUser);
        //$("#nomAbogado option[value='" + idUser + "'']").attr("selected", true);
        $('#nomAbogado > option[value="' + idUser + '"]').attr('selected', 'selected');
        $('#idabogado').val(idUser);
        $('#idpet').val('1165');
        $('#idEscrito_').val('2');
        //$("#nomAbogado").val(idUser);
        $('#nomAbogado').val(idUser).trigger('change.select2');
        $("#nomAbogado").prop('disabled', true);
    })
}
function arreglo_Estados()
{
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