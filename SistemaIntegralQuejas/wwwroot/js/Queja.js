


$(document).ready(function () {

    Crear_Formulario_Queja();
    EstadoGeneral();
    cargaCatalogos_complementoQ();//cargar el id de la queja
    guardarQueja();

});

/*Funciones para crear Inputs,labels, textarea, select dinámicos*/
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
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" name="' + id + '" ' + tiposelect + '> <option value="">Seleccione una opción</option>';
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
    let htmld = '<label for= "' + namelabel + '" >' + textoLabel + '</label ><select id="' + id + '" name="' + id + '" ' + tiposelect + '> <option value="">Seleccione una opción</option>';
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
function CreaSelectLabelSelect2DI(id, tiposelect, arreglo, nombreDiv, textoLabel, namelabel, estiloLabel, estiloselect) {
    let htmld = '<label for= "' + namelabel + '" ' + estiloLabel + ' >' + textoLabel + '</label ><select id="' + id + '" name="' + nombreDiv + '" ' + tiposelect + ' ' + estiloselect + '> <option value="">Seleccione una opción</option>';
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
    return "<input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' > </br> "
}
function CreaInputs_Con_Label(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaInputs_Con_Labelval(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel, val) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input value=" + val + " type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaInputs_Con_LabelID(idParrafo, Name, clas, tipo, textolabel, namelabel, adicion, adicionlabel) {
    return "<label for= '" + namelabel + "' " + adicionlabel + " >" + textolabel + "</label ><input type='" + tipo + "' id='" + idParrafo + "' class='" + clas + "' name='" + Name + "' " + adicion + " >"
}
function CreaBR() {
    return "</br>"
}
function CreaTextArea(Name, clas, adicion) {
    return "<textarea class='" + clas + "' id='" + Name +"' name='" + Name + "' rows='5' cols='50' " + adicion + " ></textarea>";
}
/** Funciones para crear Inputs,labels, textarea, select dinámicos*/

/*Metodos*/
function Crear_Formulario_Queja()
{
    var arregloBlanco = [];
    var cuerpoIzquierda = CreaInputs_Con_Label('idqueja', 'idqueja', '', 'text', 'ID:', 'textfield', 'mes')
        + CreaBR()
        + CreaSelectLabel('Abogadoqueja', '', arregloBlanco, '', 'Abogado quien Recibe: ', '')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Hechos: ')
        + CreaBR()
        + CreaTextArea('hechos', '', 'style="width:100% "')
        + CreaBR()
        + Crea_Label('textfield8', 'textfield8', '', 'Lugar de los hechos: ')
        + CreaBR()
        + CreaSelectLabel('estadoqueja', '', arregloBlanco, '', 'Estado: ', '')
        + CreaBR()
        + CreaSelectLabel('municipioqueja', '', arregloBlanco, '', 'Municipio: ', '');
    var cuerpoDerecha = Crea_Label('textfield8', 'textfield8', '', 'Peticionario: ')
        + CreaBR()
        //+ CreaInputs_Con_Label('nombrequejoso', 'nombrequejoso', '', 'text', 'Nombre(s):', 'textfield', 'Nombre')
        //+ CreaBR()
        //+ CreaInputs_Con_Label('Apellidos', 'Apellidos', '', 'text', 'Apellidos: ', 'textfield', 'Apellido paterno - Aepllido Materno')
        //+ CreaBR()
        //+ CreaInputs_Con_Label('curp', 'curp', '', 'text', 'CURP: ', 'textfield', 'CURP')
        + "<div id='contenedor_Usuarios'>" + DivPequenios('Christopher marquez', 'MALC961120HNERPH05', '1') + DivPequenios('Christopher marquez', 'MALC961120HNERPH05', '1') + "</div>"
        + CreaBR()
        + CreaSelectLabel('visitaduriaqueja', '', arregloBlanco, '', 'Visitaduria: ', '')
        + CreaBR()
        + CreaInputs_Con_Label('Fecha_Registro', 'Fecha_Registro', '', 'date', 'Fecha de Registro: ', 'textfield', '')
        + CreaBR()
        + CreaSelectLabel('sedeRegistro', '', arregloBlanco, '', 'Sede de Registro: ', '')
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
    return formualarioCompleto;
}
function guardarQueja() {
    $("#saveQueja").click(function (e) {
        e.preventDefault();
        if (validarCamposVaciosInput())
        {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Tienes que completar todos los campos para continuar',
                showConfirmButton: false,
                timer: 1500
            });
        }
        else
        { 
        $.ajax({
            type: "POST",
            url: "GuardarQueja",
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
            }
        });
      
        }
    });
}
function EnviarQueja() { }
function validarCamposVaciosInput()
{
    $("#parrafo").css("color", "#000000");
    var validacion = false;
    if ($('#idqueja').val().length === 0) {
        validacion=estiloinputvalidacion('#idqueja', validacion);
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

    return validacion;
}
function estiloinputvalidacion(nombreInput,boleano)
{
    $(nombreInput).css("border", "solid .5px red");
    boleano = true;
    return boleano;
}
function regresaEstadoInputs(idinput)
{
    $(idinput).click(function (e) {
        $(idinput).css("border","solid .5px lightgray");
    });
}
function EstadoGeneral()
{
    regresaEstadoInputs('#idqueja');
    //regresaEstadoInputs('#nombrequejoso');
    //regresaEstadoInputs('#Apellidos');
    //regresaEstadoInputs('#curp');
    regresaEstadoInputs('#Fecha_Registro');
}
function DivPequenios(nombrepeticionario,curp,idpeticionario)
{
    var div = "<div id='Divpequenios'>"
        +
        `
			<div class="dummy dummy-text">
			<p><span class="tooltipbox tooltipbox-effect-1"><span class="tooltipbox-item">${nombrepeticionario}</span><span class="tooltipbox-content clearfix">
            <span class="tooltipbox-text"><span style="color:#c39f76">Infromación del Peticionario</span><br>
             ID DEL PETIC.: ${idpeticionario}<br>
             CURP:${curp}<br>
             NOMBRE:${nombrepeticionario}<br>
            </span></span></span></p>
			</div>
        `+ "</div>";
        +"<img id='add' src='/img/signomas.png'>"




    return div;
}
function cargaCatalogos_complementoQ()
{
    $.ajax({
        type: "POST",
        url: "RegresaListaCatalogos",
        data: $('.formQueja').serialize(),
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            /*response.informarcionC.informacioncomplementariapeticionario.curp 
            response.informarcionC.informacioncomplementariapeticionario.id_registro
            response.informarcionC.informacioncomplementariapeticionario.nombre_peticionario*/
            CargaDatosSelectOtro_("#Abogadoqueja", response.lista_abogado, response.informarcionC.id_abogado_recibe);
            //CargaDatosSelectOtro_("", response.lista_autoridad);
            CargaDatosSelectOtro_("#estadoqueja", response.lista_estado);
            CargaDatosSelectOtro_("#municipioqueja", response.lista_municipio, response.informarcionC.id_lugar_hechos);
            CargaDatosSelectOtro_("#sedeRegistro", response.lista_sedes, response.informarcionC.id_sede);
            CargaDatosSelectOtro_("#visitaduriaqueja", response.listavisitadurias, 3);
            $("#idqueja").val(response.informarcionC.id_expediente);
            $("#hechos").val(response.informarcionC.hechos);
            $("#Fecha_Registro").val(response.informarcionC.fecha_registro);
            $("#contenedor_Usuarios").html(DivPequenios(response.informarcionC.informacioncomplementariapeticionario.nombre_peticionario, response.informarcionC.informacioncomplementariapeticionario.curp, response.informarcionC.informacioncomplementariapeticionario.id_registro));

            /*Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se ha cargado la Información Correctamente',
                showConfirmButton: false,
                timer: 1500
            });*/
        }
    });
}
function CargaDatosSelectOtro_(select, arreglo,valor) {
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
function Seleccionar_ValorSelect(nombreSelect,valorPorDefecto)
{
    $(nombreSelect +" > option[value='" + valorPorDefecto + "']").attr("selected", true);
}
/*Metodos*/
