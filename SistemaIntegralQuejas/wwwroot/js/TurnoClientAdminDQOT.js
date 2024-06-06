"use strict";

const conexionTurnos_vaq = new signalR.HubConnectionBuilder()
    .withUrl("/turnosHub")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

const hubTurnoVAQ = "turnosHub";

conexionTurnos_vaq.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
})

conexionTurnos_vaq.on("OnConnected_TblTurno", function () {
    ConectadoTurnoHub();
})

function ConectadoTurnoHub() {
    const usuario = $("#usuario").val();
    const grupo = $("#grupohub").val();
    conexionTurnos_vaq.invoke("GuardarConexionUsuario_TblTurno", usuario, grupo, hubTurnoVAQ).catch(function (err) {
        return console.error(err.toString());
    });
}

conexionTurnos_vaq.on("SonidoTurnosPendientesAdmin", (res) => {
    const sonidoplay = reproducirSonido(sonidoNuevoTurno);
    if (res) {
        sonidoplay.play();
    }
})

conexionTurnos_vaq.on("RegresaTurnosVGQ", (resp) => {
    if (resp.length > 0) {
        DibujaTblTodosTurnos(resp)
    } else {
        console.log("No hay turnos")
    }
})

