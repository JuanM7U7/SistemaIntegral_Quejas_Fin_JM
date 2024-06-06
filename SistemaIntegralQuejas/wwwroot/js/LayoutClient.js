"use strict";

const conexionLayout = new signalR.HubConnectionBuilder()
    .withUrl("/layoutHub")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();
 
const hub = "layoutHub";

conexionLayout.start().then(function () {}).catch(function (err) {
    return console.error(err.toString());
})

conexionLayout.on("OnConnected", function () {
    ConectadoLayautHub();
    ValidarTurnoEnCurso();
    ObtenerDispnibilidadUser();
    ValidarUsuariosActivos();
})

function ConectadoLayautHub() {
    const usuario = $("#usuario").val();
    const grupo = $("#grupohub").val();
    conexionLayout.invoke("GuardarConexionUsuario", usuario, grupo, hub).catch(function (err) {
        return console.error(err.toString());
    });
}

$('.chk_userActivo').on('change', function () { 
    let chkDisponibilidad = this.checked;

    if (chkDisponibilidad) {
        ActivarDispnibilidadUser(chkDisponibilidad);
    } else {
        ActivarDispnibilidadUser(chkDisponibilidad);
    }

})

function ValidarTurnoEnCurso() {
    const usuario = $("#idusuario").val();

    let frmUsuario = new FormData();
    frmUsuario.append('idusuario', usuario);

    fetchPost("Turnos/ValidaTurnoEnCurso", "json", frmUsuario, (resp) => {
        let turno = resp.data;
        console.log(turno)
        if (turno.length > 0) {
            document.getElementById("idmodulo_finalizar").value = turno[0].fkIdModulo;
            document.getElementById("idTurno_finalizar").value = turno[0].idTurno;
            $("#hero6").css("display", "inline");
            $("#color_mode").prop('disabled', true);
        } else {
            $("#hero6").css("display", "none");
            $("#color_mode").prop('disabled', false);
        }
    })

}
 
function ObtenerDispnibilidadUser() {
    const usuario = $("#idusuario").val();
    let frmUsuario = new FormData();
    frmUsuario.append('idusuario', usuario);

    fetchPost("Login/ObtenerDispnibilidadUser", "json", frmUsuario, (data) => {
        console.log('activo: ' + data.activo)
        console.log('ocupado: ' + data.ocupado)
        console.log('ocupado: ' + data.existesesion)


        if (data.activo && data.ocupado == 1 && data.existesesion) {
            $(".chk_userActivo").prop('checked', true);
            $("#color_mode").prop('disabled', false);
        } else if (data.activo && data.ocupado == 2 && data.existesesion) {
            $(".chk_userActivo").prop('checked', true);
            $("#color_mode").prop('disabled', true);
        }
        else if (data.activo == false && data.ocupado == 0 && data.existesesion) {
            $(".chk_userActivo").prop('checked', false);
            $("#color_mode").prop('disabled', false);
        }
        else if (data.activo == 0 && data.ocupado == 0 && data.existesesion == false) {
            console.log('adios')
            window.location.href = "/Login/CerrarSesion";
        }
    })
}
 
function ActivarDispnibilidadUser(status) {
    const usuario = $("#idusuario").val();
    let frmUsuario = new FormData();
    frmUsuario.append('idusuario', usuario);
    frmUsuario.append('disponiblidad', status);

    fetchPost("Login/ActivarDispnibilidadUser", "json", frmUsuario, (data) => {
        if (data.resp) {
            $(".chk_userActivo").prop('checked', status);
        } 
    })
}

// Activar alert de ultimo usuario conectado
function ValidarUsuariosActivos() {
    fetchGet("Login/Valida_Ultimo_User_Conectado", "json", (resp) => {

        const username = $("#usuario").val();
        if (resp.data.length == 1) {
            if (resp.data[0].usuario1 == username) {
                $("#alertNoHayConectados").css("display", "none");
                $("#alertUltimoConectado").css("display", "block");
            } else {
                $("#alertNoHayConectados").css("display", "none");
                $("#alertUltimoConectado").css("display", "none");
            }
        } else if (resp.data.length > 1) {
            $("#alertNoHayConectados").css("display", "none");
            $("#alertUltimoConectado").css("display", "none");
        } else {
            $("#alertUltimoConectado").css("display", "none");
            $("#alertNoHayConectados").css("display", "block");
        }
    })
}
// Fin Activar boton asignar turno 
 
// Mostrar alert de ultimo usuario activo
conexionLayout.on("ActivarWarningUsersDqot", (data) => {

    if (data == 'ultimouserdqot') {
        $("#alertNoHayConectados").css("display", "none");
        $("#alertUltimoConectado").css("display", "block");
    }
})

// Mostrar alert de no hay usuarios conectados
conexionLayout.on("ActivarDangerUsersDqot", (data) => {

    if (data == 'nousers') {
        $("#alertNoHayConectados").css("display", "block");
        $("#alertUltimoConectado").css("display", "none");
    }
}) 

// Remover alert de ultimo usuario activo
conexionLayout.on("DesWarningUsersDqot", (data) => {

    if (data == 'activosdqot') {
        $("#alertNoHayConectados").css("display", "none");
        $("#alertUltimoConectado").css("display", "none");
    }
})

// Cambiar abogado de un turno 
function cambiarAbogado() {
    $('.selCambAbog').on('change', function () {

        let selectTipoTurno = this.value;

        let idTurno = selectTipoTurno.split("/")[0];
        let idAbgNuevo = selectTipoTurno.split("/")[1];
        let usernameNuevo = selectTipoTurno.split("/")[2];
        let usernameAnterior = $('option:selected', this).data('useran');
        //let usernameAnterior = $(".selCambAbog option:selected").attr('data-useran');
        console.log("usern: " + usernameNuevo)
        console.log("userv: " + usernameAnterior)
         
        conexionLayout.invoke("CambiarAbogadoAdmin", idTurno, idAbgNuevo, usernameNuevo, usernameAnterior).catch(function (err) {
            return console.error(err.toString());
        });

    });
}

// Fin Cambiar abogado de un turno

// Limpiar tabla de turnos pendientes
conexionLayout.on("LimpiarTablaTurnosPendientes", (data) => {
    console.log("elimina turno")
    if (data) {
        $('#tblTurnosPendientesVAQ').dataTable().fnClearTable();
        $('#tblTurnosPendientesVAQ').dataTable().fnDestroy();

        $('#tblTurnosPendientesVAQ').DataTable({
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
            },
            bDestroy: true
        });
    }
})

// Dibujar turno reasignado
conexionLayout.on("DibujarTurnoReasignado", (data) => {
    console.log(data)
    $(`#tblTurnosPendientesVAQ tbody`).empty();
    if (data.length > 0) {
        DibujaTblTurnosPendientes(data)
    }
})

// Recargar tabla al cambiar a otro abogado Admin
conexionLayout.on("RecargaTablaPorCambiarAbog", (status, data) => {
    console.log(data)
    if (status) {
        if (data.length > 0) {
            DibujaTblTodosTurnos(data)
        } 
    }
})

conexionLayout.on("DeslogueaUsuario", (data, msg) => {

    if (data == 'desactivar') {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: msg,
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(function () {
            window.location.href = "/Login/CerrarSesionDuplicado";
        }, 2500);
    }
})

conexionLayout.on("UsuarioOcupado", (data) => {

    if (data == 'userocupado') {
        $("#color_mode").prop('disabled', true);
    }
})

conexionLayout.on("userdqotdisponible", (data) => {

    if (data == 'userocupado') {
        $("#color_mode").prop('disabled', false);
    }
})




















// FUNCIONES WEB SOCKET NOTIFICACIONES

conexionLayout.on("RecibeNotificacionTodos", (msj) => {
   // alert(msj)
    NotificacionGeneral(msj, 'Mensaje general')
})


conexionLayout.on("RecibeNotificacionGrupo", (msj) => {
    // alert("Grupo: " + msj)
    NotificacionGeneral(msj, 'Mensaje general')
})

// FIN FUNCIONES WEB SOCKET