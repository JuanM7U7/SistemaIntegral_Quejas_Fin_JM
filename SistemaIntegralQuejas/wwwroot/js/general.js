// Variables que se tienen que cambiar cada año
let rutaUploadei = '../Uploads/escrito_inicialdequeja/';
let festivos = [ // Agregamos los festivos (dia, mes)
    [25, 12],
    [1, 1]
];
// Fin Variables que se tienen que cambiar cada año

let rolUser = document.getElementById('rolUser').value;
/*apartado modal datos complementarios de la queja*/
let fechActual = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();
// crea un nuevo objeto `Date`
let fechahoy = new Date();
console.log(fechahoy);
let horaActual = fechahoy;
let horaActualFin = horaActual.toString().split(' ')[4];
console.log(horaActualFin);
async function fetchPost(url, tiporespuesta, frm, callback) {
    try {

        //document.getElementById("divLoading").style.display = "flex";
        let urlCompleta = window.location.protocol + "//" + window.location.host + "/" + url
        let res = await fetch(urlCompleta, {
            method: "POST",
            body: frm
        });
        if (tiporespuesta == "json")
            res = await res.json();
        else if (tiporespuesta == "text")
            res = await res.text();
        //JSON (Object)
        callback(res)
        //document.getElementById("divLoading").style.display = "none";

    } catch (e) {
        console.log(e)
        //alert("Ocurrion un error");
        //document.getElementById("divLoading").style.display = "none";
    }
}

async function fetchGet(url, tiporespuesta, callback, retorno = false) {
    //document.getElementById("divLoading").style.display = "block";
    try {
        let urlCompleta = window.location.protocol + "//" + window.location.host + "/" + url
        let res = await fetch(urlCompleta)
        if (tiporespuesta == "json")
            res = await res.json();
        else if (tiporespuesta == "text")
            res = await res.text();
        //JSON (Object)

        //document.getElementById("divLoading").style.display = "none";
        if (retorno == false || retorno == null)
            callback(res)
        else
            return res;
    } catch (e) {
        //alert("Ocurrion un error");
        console.log(e)
        //document.getElementById("divLoading").style.display = "none";
    }
}


function get(idcontrol) {
    return document.getElementById(idcontrol).value;
}
function getI(idcontrol) {
    return document.getElementById(idcontrol).innerHTML;
}
function set(idcontrol, valor) {
    if (document.getElementById(idcontrol))
        document.getElementById(idcontrol).value = valor;
}
function setI(idcontrol, valor) {
    if (document.getElementById(idcontrol))
        document.getElementById(idcontrol).innerHTML = valor;
}
function setC(selector, valor = true) {
    if (document.querySelector(selector))
        document.querySelector(selector).checked = valor;
}
function setN(namecontrol, valor, idformulario) {
    if (idformulario == undefined) {
        document.getElementsByName(namecontrol)[0].value = valor;
    }
    else {
        document.querySelector("#" + idformulario + " [name='" + namecontrol + "']").value = valor;
    }
}
function setSRC(namecontrol, valor, idformulario) {
    if (idformulario == undefined) {
        document.getElementsByName(namecontrol)[0].src = valor;
    }
    else {
        document.querySelector("#" + idformulario + " [name='" + namecontrol + "']").src = valor;
    }
}

function getN(namecontrol) {
    return document.getElementsByName(namecontrol)[0].value
}

function getChk(nameControl) {
    return $("input[name='" + nameControl + "[]']:checked").val();
}

function getRadio(nameControl, idFormulario) {
    return $('input[name="' + nameControl + '"]:checked', idFormulario).val()
}

function getSelect(idControl) {

    return $('select[id=' + idControl + ']').val();
}

// Notificaciones con toast js

function NotificacionGeneral(mensaje, titulo) {
    setTimeout(function () {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000
        };
        toastr.info(mensaje, titulo)
    }, 1300)
}

function NotificacionPersonal(mensaje, titulo) {
    console.log("hola")
    setTimeout(function () {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000
        };
        toastr.success(mensaje, titulo)
    }, 1300)
}

// Reproducir sonido para notificaciones

// El sonido que podemos reproducir o pausar
const sonidoNuevoTurno = "../media/sonidos/tono2.wav";
const sonidoAtendiendo = "../media/sonidos/sonidoAtendiendo.mp3";

const reproducirSonido = function (fuente) {

    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);

    return sonido;
};

//function CierraPopup() {
//    $("#modal_atender").modal('hide');//ocultamos el modal
//    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
//    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
//}
// Mostrar Datos Peticinario

function DatosPeticionario(idPeticionario) {

    const frmPeticionario = new FormData();
    frmPeticionario.append("idPeticionario", idPeticionario);

    fetchPost("Turnos/Get_DatosPeticionario", "json", frmPeticionario, function (data) {
        let peticionario = data.data[0];
        if (data.data.length > 0) {
            $("#iconuser" + idPeticionario).tooltip({
                container: 'body',
                placement: 'top',
                trigger: "click",
                title: 'Datos peticionario',
                template: `
                <div class="popover" role="tooltip">
                    <div class="arrow">
                    </div>
                    <h3 class="popover-header">Datos del Peticionario</h3>
                    <div class="popover-body">
                      <table> 
                      <tr> 
                         <td><b>Nombre:</td>
                         <td style="text-align: right;"> ${peticionario.nombre + ' ' + peticionario.apellidoPat + ' ' + peticionario.apellidoMat} </td> 
                      </tr> 
                      <tr> 
                         <td><b>Procedencia:</td>
                         <td style="text-align: right;"> ${peticionario.procedencia} </td> 
                      </tr> 
                      <tr> 
                         <td><b>Curp:</td> 
                         <td style="text-align: right;"> ${peticionario.docIdentificatorio} </td> 
                      </tr> 
                      </table>
                    </div>
                </div>`
            });
        }
    })

}

// Crear formulario
var idradios = [];

function crearForumulario(objForumlario, objElementos) {

    let objetoActual;
    var contenido = "";
    let required = "required";

    contenido += `<form id="${objForumlario.idformulario}" data-numform="${objForumlario.numForm}" method="post" class="mb-3 form-valide eliminaformaes formularioPeticionario">`;
    if (objForumlario.numForm == 1) {
        contenido += `<input type="text" name="idquejagenerado" id="idquejagenerado" class="idquejagenerado" hidden value="">`;
    }
    //console.log(objElementos)
    contenido += "<div class='row eliminaformaes'>";
    for (var i = 0; i < objElementos.formulario.length; i++) {
        objetoActual = objElementos.formulario[i];
        if (objetoActual.class == undefined) objetoActual.class = ""
        if (objetoActual.type == undefined) objetoActual.type = "text"
        if (objetoActual.readonly == undefined) objetoActual.readonly = false
        if (objetoActual.label == undefined) objetoActual.label = ""
        if (objetoActual.name == undefined) objetoActual.name = ""
        if (objetoActual.inputdata == undefined) objetoActual.inputdata = false
        if (objetoActual.valinputdata == undefined) objetoActual.valinputdata = ""
        if (objetoActual.classControl == undefined) objetoActual.classControl = ""
        if (objetoActual.id == undefined) objetoActual.id = ""
        if (objetoActual.icon == undefined) objetoActual.icon = ""
        if (objetoActual.classSubmit == undefined) objetoActual.classSubmit = ""
        if (objetoActual.submitLabel == undefined) objetoActual.submitLabel = ""
        if (objetoActual.classSpan == undefined) objetoActual.classSpan = ""
        if (objetoActual.optgroup == undefined) objetoActual.optgroup = ""
        if (objetoActual.combooptions == undefined) objetoActual.combooptions = ""
        if (objetoActual.otraopcion == undefined) objetoActual.otraopcion = false
        if (objetoActual.bgselect == undefined) objetoActual.bgselect = ''
        if (objetoActual.typechk == undefined) objetoActual.typechk = ''
        if (objetoActual.valhidden == undefined) objetoActual.valhidden = ''
        if (objetoActual.data == undefined) objetoActual.data = ''
        if (objetoActual.onclick == undefined) objetoActual.onclick = ''
        if (objetoActual.iformularioit == undefined) objetoActual.iformularioit = ''
        if (objetoActual.classlabel == undefined) objetoActual.classlabel = ''
        if (objetoActual.classradio == undefined) objetoActual.classradio = ''
        if (objetoActual.required == undefined) objetoActual.required = ''
        if (objetoActual.functions == undefined) objetoActual.functions = ''
        if (objetoActual.propiedades == undefined) objetoActual.propiedades = ''


        contenido += `<div class="${objetoActual.class} eliminaformaes">`;
        contenido += `<label for="${objetoActual.name}" class="eliminaformaes ${objetoActual.classlabel} labelt">${objetoActual.label}</label>`;

        if (objetoActual.type == "text" || objetoActual.type == "number") {
            if (objetoActual.noproporcionado) {
                contenido += `<div class="input-group eliminaformaes mb-1 ${objetoActual.classlabel}">
                <div class="input-group-prepend eliminaformaes ${objetoActual.classlabel}">
                    <div title="No proporcionado" class="input-group-text eliminaformaes ${objetoActual.classlabel}">
                        <input name="${objetoActual.namenoprop}" data-infrm="${objetoActual.name}" class="noproporcionado eliminaformaes ${objetoActual.classlabel} ${objetoActual.typechk}" title="No proporcionado" type="checkbox">
                    </div>
                </div>`;
            }
            contenido += `
                      <input type="${objetoActual.type}" ${objetoActual.readonly == true ? "readonly" : ""} class="form-control eliminaformaes ${objetoActual.classControl}"
                              data-idfrmit="${objetoActual.iformularioit}" name="${objetoActual.name}" id="${objetoActual.name}" ${objetoActual.required} ${objetoActual.functions} />
                  `;
            if (objetoActual.noproporcionado) {
                contenido += `</div>`;
            }
        } if (objetoActual.type == "date") {
            if (objetoActual.noproporcionado) {
                contenido += `<div class="input-group eliminaformaes mb-3">
                <div class="eliminaformaes input-group-prepend">
                    <div title="No proporcionado" class="input-group-text eliminaformaes">
                        <input name="${objetoActual.namenoprop}"class="noproporcionado eliminaformaes ${objetoActual.typechk}" title="No proporcionado" type="checkbox">
                    </div>
                </div>`;
            }
            contenido += `
                      <input type="${objetoActual.type}"  ${objetoActual.readonly == true ? "readonly" : ""}  class="form-control eliminaformaes ${objetoActual.classControl}"
                              name="${objetoActual.name}" id="${objetoActual.name}" ${objetoActual.required} />
                  `;
            if (objetoActual.noproporcionado) {
                contenido += `</div>`;
            }
        } else if (objetoActual.type == "textarea") {

            contenido += `
                    <textarea name="${objetoActual.name}" ${objetoActual.readonly == true ? "readonly" : ""} ${objetoActual.required} class="form-control eliminaformaes ${objetoActual.classControl}" ></textarea>
                `;

        } else if (objetoActual.type == "combobox") {

            if (objetoActual.multiple) {
                contenido += `<select data-live-search="true" ${objetoActual.required} id="${objetoActual.name}" name="${objetoActual.name}" data-idfrmit="${objetoActual.iformularioit}" class="selectpicker eliminaformaes form-control ${objetoActual.classlabel}" multiple="${objetoActual.multiple}"> <option class="eliminaformaes ${objetoActual.classlabel}" value="" >Seleccione una opción</option>`;
                for (let v = 0; v < objetoActual.combooptions.length; v++) {
                    contenido += `
                    <option class="${objetoActual.classlabel} eliminaformaes" value="${objetoActual.combooptions[v].idSelect}">${objetoActual.combooptions[v].descripcion}</option>
                `;
                }
                contenido += `</select>`;
            } else {
                contenido += `<select data-live-search="true" ${objetoActual.required} id="${objetoActual.name}" name="${objetoActual.name}" data-idfrmit="${objetoActual.iformularioit}" class="selectpicker eliminaformaes form-control ${objetoActual.classlabel}"> <option class="eliminaformaes ${objetoActual.classlabel}" value="" >Seleccione una opción</option>`;
                for (let v = 0; v < objetoActual.combooptions.length; v++) {
                    contenido += `
                    <option class="${objetoActual.classlabel} eliminaformaes" value="${objetoActual.combooptions[v].idSelect}">${objetoActual.combooptions[v].descripcion}</option>
                `;
                }
                contenido += `</select>`;

            }



        } else if (objetoActual.type == "radio" || objetoActual.type == "checkbox") {
            contenido += "<br />"
            for (var z = 0; z < objetoActual.labels.length; z++) {
                contenido += `
                <div class="form-check eliminaformaes">
                  <label class="form-check-label eliminaformaes">
                       <input class="eliminaformaes ${objetoActual.classradio}" ${objetoActual.required} data-idfrmit="${objetoActual.iformularioit}" type="${objetoActual.type}" ${objetoActual.checked.includes(objetoActual.ids[z]) ? "checked" : ""} id="${objetoActual.ids[z]}"
                         name="${objetoActual.name}${objetoActual.type == "checkbox" ? "[]" : ""}" 
                         value="${objetoActual.values[z]}" /> ${objetoActual.labels[z]}
                </div>
                     `;
            }
            //checked(string)
            if (objetoActual.type == "radio")
                idradios.push(objetoActual.checked);
            else
                idradios = idradios.concat(objetoActual.checked)

        } else if (objetoActual.type == "file") {
            contenido += ` <br />
                <img id="img${objetoActual.namefoto}" width="${objetoActual.imgwidth}" class="${objetoActual.classControl}"
                            alt="" style="visibility:hidden"
                      height="${objetoActual.imgheight}" name="${objetoActual.namefoto}"  />
                <br />
                <input accept=".jpg,.png" onchange='previewImage(this,"img${objetoActual.namefoto}")' 
                     type="file" name="${objetoActual.name}" />`
        } else if (objetoActual.type == "dropdowninput") {
            let gruposopt = objetoActual.optgroup;

            contenido += `<br />
            <div class="input-group eliminaformaes my-group"> 
            <select id="${objetoActual.name}" name="${objetoActual.name}" data-selidotro="${objetoActual.nameInputText}" class="seltxt eliminaformaes selectpicker form-control ${objetoActual.bgselect}"> <optgroup class="seltxt eliminaformaes label=""> <option class="eliminaformaes" value=""> Seleccione una opción </option> </optgroup>`;
            for (var g = 0; g < gruposopt.length; g++) {
                if (gruposopt[g].lableoptgrup == undefined) gruposopt[g].lableoptgrup = '';

                contenido += `<optgroup class="eliminaformaes" label="${gruposopt[g].lableoptgrup}">`;
                let options = gruposopt[g].options;

                for (let o = 0; o < options.length; o++) {
                    contenido += `
                        <option class="eliminaformaes" value="${options[o].idSelect}"> ${options[o].descripcion}</option>
                    `;
                }
                contenido += `</optgroup>`;
            }

            contenido += `</select>`;
            if (objetoActual.otraopcion) {
                contenido += `<input type="text" disabled style="background-color: white;" class="form-control eliminaformaes d-none" id="${objetoActual.nameInputText}" name="${objetoActual.nameInputText}" placeholder="Otro">`;
            }
            contenido += "</div>";

        } else if (objetoActual.type == "separacion") {

            contenido += `<hr class="eliminaformaes ${objetoActual.classlabel}"> <label class="eliminaformaes labelt ${objetoActual.classlabel}">${objetoActual.labelhr}</label>`

        } else if (objetoActual.type == "hidden") {

            contenido += `	<input type="text" name="${objetoActual.name}" id="${objetoActual.name}" hidden class="${objetoActual.classControl}" value="${objetoActual.valhidden}">`

        } else if (objetoActual.type == "submiticon") {
            contenido += ` <br />
               <button type="submit" name="${objetoActual.name}" id="${objetoActual.name}" class="eliminaformaes ${objetoActual.classSubmit}">${objetoActual.submitLabel} <span class="${objetoActual.classSpan} eliminaformaes"><i class="${objetoActual.icon} eliminaformaes"></i></span>
             </button>`
        } else if (objetoActual.type == "button") {
            contenido += ` <br />
               <button type="button" ${objetoActual.propiedades} onclick="${objetoActual.onclick}(this)" name="${objetoActual.name}" id="${objetoActual.name}" data-idform="${objetoActual.data}" class="${objetoActual.classSubmit} eliminaformaes">${objetoActual.submitLabel} <span class="${objetoActual.classSpan} eliminaformaes"><i class="${objetoActual.icon} eliminaformaes"></i></span>
             </button>`
        } else if (objetoActual.type == "anclaredirect") {
            contenido += ` <br />
               <a href="${objetoActual.url}" target="_blank" class="${objetoActual.classSubmit} eliminaformaes">${objetoActual.submitLabel} <span class="${objetoActual.classSpan} eliminaformaes"><i class="${objetoActual.icon} eliminaformaes"></i></span>
             </a>`
        }

        contenido += `</div>`;
    }

    contenido += `</form>`;

    return contenido;
}


function AgregarOptionSelect(idfrm, classdelopt, id, arreglo) {

    let optdelete = document.querySelectorAll('.' + classdelopt + idfrm);
    let iterador = 0;
    for (let i = 0; i < optdelete.length; i++) {
        optdelete[i].remove();
        iterador++;
    }

    if (iterador === optdelete.length) {
        let htmld = ``;
        for (let v = 0; v < arreglo.length; v++) {
            htmld += `
                    <option class="${classdelopt + idfrm}" value="${arreglo[v]}">${arreglo[v]}</option>
                `;
        }
        //htmld += `<option class="${classdelopt + idfrm}" value="No proporcionado">No proporcionado</option>`;
        $(id).append(htmld);
        $(id).selectpicker('refresh');
    }

}

function AgregarOptionSelectPais(idfrm, classdelopt, id, arreglo) {

    let optdelete = document.querySelectorAll('.' + classdelopt + idfrm);
    let iterador = 0;
    for (let i = 0; i < optdelete.length; i++) {
        optdelete[i].remove();
        iterador++;
    }

    if (iterador === optdelete.length) {
        let htmld = '';
        for (let v = 0; v < arreglo.length; v++) {
            htmld += `
                    <option class="${classdelopt + idfrm}" value="${arreglo[v].descripcion}">${arreglo[v].descripcion}</option>
                `;
        }
        htmld += `<option class="${classdelopt + idfrm}" value="No proporcionado">No proporcionado</option>`;
        $(id).append(htmld);
        $(id).selectpicker('refresh');
    }
}

//Función para validar una CURP

function curpValida(curp) {
    let re = /^([A-ZÑ][AEIOUXÁÉÍÓÚ][A-ZÑ]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = curp.match(re);

    if (!validado)  //Coincide con el formato general?
        return false;

    //Validar que coincida el dígito verificador
    function digitoVerificador(curp17) {
        //Fuente https://consultas.curp.gob.mx/CurpSP/
        let diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
            lngSuma = 0.0,
            lngDigito = 0.0;
        for (let i = 0; i < 17; i++)
            lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
        lngDigito = 10 - lngSuma % 10;
        if (lngDigito == 10) return 0;
        return lngDigito;
    }

    if (validado[2] != digitoVerificador(validado[1]))
        return false;

    return true; //Validado
}


function validarInput(input) {
    let curp = input.value.toUpperCase();
    valido = "No válido";
    let idformu = input.dataset.idfrmit;

    if (curpValida(curp)) { // ⬅️ Acá se comprueba 
        valido = "CURP Válido";
        console.log(valido)
        $("#CURP_petit-frmDatosPersonales" + idformu).notify(
            "CURP válido",
            { position: "top left", className: 'success', autoHideDelay: 1500 }
        );
        $("[id^='submitForm']").attr("disabled", false);
    } else {
        console.log('CURP no válido')
        $("#CURP_petit-frmDatosPersonales" + idformu).notify(
            "CURP no válido",
            { position: "top left", autoHide: false}
        );
        $("[id^='submitForm']").attr("disabled", true);
    }

}

function validarTxtKeyPress(input) {

    let str = input.value;
    let patt = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');
    let res = patt.test(str);

    if (res == false) {
        $('#' + input.id).notify(
            "Solo se permite texto en este campo",
            { position: "top left", autoHide: false }
        );
        $('#' + input.id).focus()
    } else {
        $('#' + input.id).notify(
            "Formato correcto",
            { position: "top left", autoHide: true, className: 'success', autoHideDelay: 1500 }
        );
    }

}

function validaTxt() {

    let doctxt = document.querySelectorAll('.validaTxt');
    let patt = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');
    let contador = 0;

    for (var i = 0; i < doctxt.length; i++) {
        let str = doctxt[i].value;
        let res = patt.test(str);

        if (res == false) {
            $('#' + doctxt[i].id).notify(
                "Solo se permite texto en este campo",
                { position: "top left", autoHide: false }
            );
            $('#' + doctxt[i].id).focus();
            contador++;
        }
    }

    if (contador > 0) {
        return true;
    } else {
        return false;
    }

}

function validaTexto(clas) {

    let doctxt = document.querySelectorAll('.' + clas);
    let patt = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');
    let contador = 0;

    for (var i = 0; i < doctxt.length; i++) {
        let str = doctxt[i].value;
        let res = patt.test(str);

        if (res == false) {
            $('#' + doctxt[i].id).notify(
                "Solo se permite texto en este campo",
                { position: "top left", autoHide: true, autoHideDelay: 2500 }
            );
            $('#' + doctxt[i].id).focus();
            contador++;
        }
    }

    if (contador > 0) {
        return true;
    } else {
        return false;
    }
}

function validainputvacio(clas, msg = 'Este campo es requerido'){
    let doctxt = document.querySelectorAll('.' + clas);
    let contador = 0;
    console.log(doctxt)
    for (var i = 0; i < doctxt.length; i++) {
        let numeroInput = doctxt[i].value;

        if (numeroInput == '') {
            $('#' + doctxt[i].id).notify(
                msg,
                { position: "top left", autoHide: true, autoHideDelay: 2500 }
            );
            $('#' + doctxt[i].id).focus();
            contador++;
        }
    }
    console.log(contador)
    if (contador > 0) {
        return true;
    } else {
        return false;
    }
}

function validaNum(clas) {
    let doctxt = document.querySelectorAll('.' + clas);
    let contador = 0;
    console.log(doctxt)
    for (var i = 0; i < doctxt.length; i++) {
        let numeroInput = doctxt[i].value;

        if (isNaN(numeroInput) && numeroInput || numeroInput == '') {
            $('#' + doctxt[i].id).notify(
                "Solo se permiten números en este campo",
                { position: "top left", autoHide: true, autoHideDelay: 2500 }
            );
            $('#' + doctxt[i].id).focus();
            contador++;
        }
    }
    console.log(contador)
    if (contador > 0) {
        return true;
    } else {
        return false;
    }
}

function validaNumero() {
    let doctxt = document.querySelectorAll('.validaNumero');
    let contador = 0;

    for (var i = 0; i < doctxt.length; i++) {
        let numeroInput = doctxt[i].value;

        if (isNaN(numeroInput) && numeroInput != 'No proporcionado') {
            $('#' + doctxt[i].id).notify(
                "Solo se permiten números en este campo",
                { position: "top left", autoHide: false }
            );
            $('#' + doctxt[i].id).focus();
            contador++;
        }
    }
    console.log(contador)
    if (contador > 0) {
        return true;
    } else {
        return false;
    }
}

function validaNumeroKeyPress(input) {

    let numeroInput = input.value;

    if (isNaN(numeroInput) && numeroInput != 'No proporcionado') {
        $('#' + input.id).notify(
            "Solo se permiten números en este campo",
            { position: "top left", autoHide: false }
        );
        $('#' + input.id).focus()
    } else {
        $('#' + input.id).notify(
            "Formato correcto",
            { position: "top left", autoHide: true, className: 'success', autoHideDelay: 1500 }
        );
    }

}

function validaEmailKeyPress(input){

    let str = input.value;
    let ExpRegEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //Evaluación de Cadena Valida de Email 
    if (str.match(ExpRegEmail) != null || str == 'No proporcionado') {
        $('#' + input.id).notify(
            "Formato de Email correcto",
            { position: "top left", autoHide: true, className: 'success', autoHideDelay: 1500 }
        );
    } else {
        $('#' + input.id).notify(
            "Formato de correo inválido",
            { position: "top left", autoHide: false }
        );
        $('#' + input.id).focus()
    }

}


function getSinFestivosNiFinDeSemana(fechap, diasAdd) {
    let arrFecha = fechap.split('/');
    let fecha = new Date(arrFecha[0], arrFecha[1] - 1, arrFecha[2]);

    for (let i = 0; i < diasAdd; i++) {
        let diaInvalido = false;
        fecha.setDate(fecha.getDate() + 1); // Sumamos de dia en dia
        for (let j = 0; j < festivos.length; j++) { // Verificamos si el dia + 1 es festivo
            let mesDia = festivos[j];
            if (fecha.getMonth() + 1 == mesDia[1] && fecha.getDate() == mesDia[0]) {
                console.log(fecha.getDate() + ' es dia festivo (Sumamos un dia)');
                diaInvalido = true;
                break;
            }
        }
        if (fecha.getDay() == 0 || fecha.getDay() == 6) { // Verificamos si es sábado o domingo
            console.log(fecha.getDate() + ' es sábado o domingo (Sumamos un dia)');
            diaInvalido = true;
        }
        if (diaInvalido)
            diasAdd++; // Si es fin de semana o festivo le sumamos un dia
    }

    return fecha.getFullYear() + '/' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' + fecha.getDate().toString().padStart(2, '0');
}