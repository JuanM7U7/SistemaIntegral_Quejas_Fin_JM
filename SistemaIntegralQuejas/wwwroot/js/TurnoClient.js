"use strict";

const conexionTurnos_vaq = new signalR.HubConnectionBuilder()
    .withUrl("/turnosHub")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

let statusQueja = '';

conexionTurnos_vaq.start().then(function () {}).catch(function (err) {
    return console.error(err.toString());
})

conexionTurnos_vaq.on("OnConnected_TblTurno", function () {
    const iduser = $("#idusuario").val();
    statusQueja = $("#listEstadoTurnos").val();

    ConectadoTurnoHub();

})

function ConectadoTurnoHub() {
    const usuario = $("#usuario").val();
    const grupo = $("#grupohub").val();

    conexionTurnos_vaq.invoke("GuardarConexionUsuario_TblTurno", usuario, grupo, hubTurnoVAQ).catch(function (err) {
        return console.error(err.toString());
    });
}

conexionTurnos_vaq.on("SonidoTurnosPendientes", (resp) => {

    const sonidoplay = reproducirSonido(sonidoNuevoTurno);
    if (resp) {
        sonidoplay.play();
    }
})

conexionTurnos_vaq.on("StatusBtnAsignarTurnos", (resp) => {
    if (resp.length > 0) {
        $("#btnTurnoAle").removeAttr('disabled');
    } else {
        $("#btnTurnoAle").attr('disabled', 'disabled');
    }
})

conexionTurnos_vaq.on("TurnosPendientesVAQ_TblTurno", function (resp) {
    if (resp.length > 0) {

        DibujaTblTurnosPendientes(resp);
        $("#color_mode").prop('disabled', true);
    } else {
        table.dataTable().fnClearTable();
        table.dataTable().fnDestroy();
        $("#color_mode").prop('disabled', false);
    }

});

// Funcion mostrar modulos disponibles

function mostrarModulos(element, idmodulo) {

    $("#idturno").val(idmodulo);
    $("#modal_atender").modal("show");
    conexionTurnos_vaq.invoke("GetModulos").catch(function (err) {
        return console.error(err.toString());
    });
    conexionTurnos_vaq.on("RecibeMoudlosDqotDisponibles", function (resp) {
        var delchkModulos = document.querySelectorAll(".delchkmodules");
        var contenido = "";

        for (var d = 0; d < delchkModulos.length; d++) {
            delchkModulos[d].remove()
        }

        for (var i = 0; i < resp.length; i++) {
            contenido += `
				<div class="form-check delchkmodules">
					<input class="form-check-input selmodulo delchkmodules" type="radio" name="Radios" id="Radios2" value="${resp[i].idModuloDqot}">
					<label class="form-check-label delchkmodules" for="Radios2">
							${resp[i].nombreModulo}
						</label>		
				</div>
             `;
        }

        $("#formModulos").append(contenido)

    });

}

// Funcion para dibujar tabla de la pantalla de turnos DQO 

conexionTurnos_vaq.on("RecibeTurnosEnCurso", (resp) => {

    if (resp.length == 0) {
        $('#example tbody').empty();
        let tr;
        let products = resp;
        $.each(products, function (index, product) {

            tr = $(`<tr class='borrafila' />`);
            tr.append(`<td class='borrafila'> ATN - ${product.numTurno}</td>`);
            tr.append(`<td class='borrafila'>${product.nombrE_ABG_ATENDIENDO}</td>`);
            tr.append(`<td class='borrafila'> ATN-0${product.fkIdModulo}</td>`);
            $('#example').append(tr);

        });

        $('#Id_Turno').text('');
        $('#id_Modulo').text('');
    } else {
        console.log(resp)
        BindProductsToGridN(resp);
    }
});

function BindProductsToGridN(products) {
    $('#example tbody').empty();
    let tr;
    $.each(products, function (index, product) {
        tr = $(`<tr />`);
        tr.append(`<td style="font-weight: bolder; font-size: xx-large;"> ATN - ${product.numTurno}</td>`);
        tr.append(`<td style="font-weight: bolder; font-size: xx-large;">${product.nombrE_ABG_ATENDIENDO}</td>`);
        tr.append(`<td style="font-weight: bolder; font-size: xx-large;"> ATN-0${product.fkIdModulo}</td>`);
        $('#example').append(tr);

    });

    $('#Id_Turno').html(`ATN - ${products[0].numTurno}`);
    $('#id_Modulo').html(`ATN-0 ${products[0].fkIdModulo}`);

}


// Funcion para sonido TV DQO

conexionTurnos_vaq.on("SonidoPantallasTvDqot", (resp) => {
    const sonidoAtendiendoplay = reproducirSonido(sonidoAtendiendo);
    if (resp) {
        sonidoAtendiendoplay.play();
    }
});