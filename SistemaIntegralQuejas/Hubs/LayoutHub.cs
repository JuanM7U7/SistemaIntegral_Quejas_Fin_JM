using Microsoft.AspNetCore.SignalR;
using SistemaIntegralQuejas.Models;
using SistemaIntegralQuejas.Repos;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System;
using System.Configuration;
using System.Data.Common;
using System.Reflection;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SistemaIntegralQuejas.Hubs
{
    public class LayoutHub : Hub
    {
        public string hub = "";
        public string grupoHub = "";
        public string username = "";
        NotificacionRepo NotificacionRepo;
        UsuarioRepo UsuarioRepo;
        TurnosRepo TurnosRepo;
        private SQLMODEL conexionsql = new();

        public LayoutHub()
        {
            UsuarioRepo = new UsuarioRepo(conexionsql.ConnectionStrng());
            TurnosRepo= new TurnosRepo(conexionsql.ConnectionStrng());
            NotificacionRepo = new NotificacionRepo(conexionsql.ConnectionStrng());
        }
        // Fin Conexion DB

        // Se conecta al hub
        public override Task OnConnectedAsync()
        {
            Clients.Caller.SendAsync("OnConnected");
            return base.OnConnectedAsync();
        }

        // Se guardan datos de conexion
        public async Task GuardarConexionUsuario(string usuario, string grupo, string hubGet)
        {
            var conexionId = Context.ConnectionId;
            grupoHub = grupo;
            hub = hubGet;
            username = usuario;
            Groups.AddToGroupAsync(conexionId, grupoHub);
            bool UsuarioGuardado = UsuarioRepo.GuardarConexionUsuario(Context.ConnectionId,usuario, grupo, hub);

            await Clients.Client(conexionId).SendAsync("GuardarConexion", UsuarioGuardado);

        }

        // Se desconceta del hub
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Groups.RemoveFromGroupAsync(Context.ConnectionId, grupoHub);
            UsuarioRepo.EliminaConexionHubUser(Context.ConnectionId, username);

            return base.OnDisconnectedAsync(exception);
        }

        // Verificar usuario conectado
        public async Task Verificar_UsuariosConectados()
        {
            var usuariosActivos = UsuarioRepo.GetUsuariosActivos();

            if (usuariosActivos.Count == 0)
            {
                string mensaje = "nousers";
                string hubVADQOT = "VA_DQOT";
                string hubAdminDQOT = "ADMIN_DQOT";

                var verificar_grupoAdminDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubAdminDQOT);
                var verificar_grupoVaDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubVADQOT);

                if (verificar_grupoAdminDQOT.Count > 0)
                {
                  await Clients.Group(hubAdminDQOT).SendAsync("ActivarDangerUsersDqot", mensaje);
                }

                if (verificar_grupoVaDQOT.Count > 0)
                {
                    await Clients.Group(hubVADQOT).SendAsync("ActivarDangerUsersDqot", mensaje);
                }

            }
            else if (usuariosActivos.Count == 1)
            {
                string respuesta = "ultimouserdqot"; 
                string respuesta2 = "activosdqot";

                var usuario_hubConnect = UsuarioRepo.GetHubUser(usuariosActivos[0].Usuario1.ToString(), hub);
                //var usuarios_excepto = UsuarioRepo.GetHubUserAllExcept(usuariosActivos[0].Usuario1.ToString(), hub);

                if (usuario_hubConnect.Count == 1)
                {
                    await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("ActivarWarningUsersDqot", respuesta);
                    await Clients.AllExcept(usuario_hubConnect[0].ConnectionId).SendAsync("DesWarningUsersDqot", respuesta2);
                }

                //foreach (var hubItem in usuarios_excepto)
                //{
                //    await Clients.Client(hubItem.ConnectionId).SendAsync("DesWarningUsersDqot", respuesta2); 
                //}

            } else
            {
                string mensaje = "activosdqot";
                string hubVADQOT = "VA_DQOT";
                string hubAdminDQOT = "ADMIN_DQOT";

                var verificar_grupoAdminDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubAdminDQOT);
                var verificar_grupoVaDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubVADQOT);

                if (verificar_grupoAdminDQOT.Count > 0)
                {
                    await Clients.Group(hubAdminDQOT).SendAsync("DesWarningUsersDqot", mensaje);
                }

                if (verificar_grupoVaDQOT.Count > 0)
                {
                    await Clients.Group(hubVADQOT).SendAsync("DesWarningUsersDqot", mensaje);
                }

            }
            
        }

        // Reasignar turno (Solo para Administradores DQO)
        bool reasignado = false;
        public async Task CambiarAbogadoAdmin(string idturno, string idAbogadoNuevo, string usuario, string idUser_ant)
        {
            string hunb = "layoutHub";
            var Peticionario = TurnosRepo.GetStatusAbogadoReasignado(usuario);
            var TurnoAtendiendo = TurnosRepo.GetTurnosEnCursoxUser(idAbogadoNuevo);
             
            if (Peticionario.Count > 0 && TurnoAtendiendo.Count == 0)
            {
                string query = "EXEC Sp_Cambiar_AbogadoVAQ " + "" + idturno + "," + "" + idAbogadoNuevo + "," + usuario + "";
                string queryUser = "UPDATE USUARIOS SET ACTIVO = 1, OCUPADO = 2 WHERE USUARIO = " + "'" + usuario + "'";
                string queryUserAnt = "UPDATE USUARIOS SET ACTIVO = 1, OCUPADO = 1 WHERE USUARIO = " + "'" + idUser_ant + "'";

                bool resp = conexionsql.InsertUpdateDelete(query);
                bool respUser = conexionsql.InsertUpdateDelete(queryUser);
                bool respUserAnt = conexionsql.InsertUpdateDelete(queryUserAnt);
                reasignado = true;
            }
            else
            {
                reasignado = false;
            }

            var usuario_hubConnect = UsuarioRepo.GetHubUser(idUser_ant, hunb);
            var usuario_hubConnectNuevo = UsuarioRepo.GetHubUser(usuario, hunb);

            string hubAdminDQOT = "ADMIN_DQOT";
            string mensaje = "recargabgcambiado";
            var verificar_grupoAdminDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubAdminDQOT);
            

            if (usuario_hubConnect.Count > 0 && usuario_hubConnectNuevo.Count > 0)
            {
                if (verificar_grupoAdminDQOT.Count > 0)
                {
                    var turnosAdmin = TurnosRepo.GetTurnosAdmin();
                    await Clients.Group(hubAdminDQOT).SendAsync("RecargaTablaPorCambiarAbog", mensaje, turnosAdmin);
                }
                var turnos = TurnosRepo.GetTurnosxUser(usuario, 2);
                await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("LimpiarTablaTurnosPendientes", reasignado);
                await Clients.Client(usuario_hubConnectNuevo[0].ConnectionId).SendAsync("DibujarTurnoReasignado", turnos);
            }
            else
            {
                //reasignado = false;
                //if (verificar_grupoAdminDQOT.Count > 0)
                //{

                //    await Clients.Group(hubAdminDQOT).SendAsync("RecargaTablaPorCambiarAbog", mensaje, turnosAdmin);
                //}
                await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("LimpiarTablaTurnosPendientes", reasignado);
            }

        }

        public async Task Desloguear_Usuario(string usuario)
        {
            string hubx = "layoutHub";
            var usuario_hubConnect = UsuarioRepo.GetHubUser(usuario, hubx);

            string data = "desactivar";
            string mensaje = "Se inicio sesión con su cuenta en otra computadora";
            if (usuario_hubConnect.Count > 0)
            {
                await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("DeslogueaUsuario", data, mensaje); 
            }
        }
         
        public async Task DesabilitarCambioStatus(string usuario)
        {
            var usuario_hubConnect = UsuarioRepo.GetHubUser(usuario, hub);
            string data = "userocupado";

            if (usuario_hubConnect.Count > 0)
            {
                await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("UsuarioOcupado", data);
            }
        }

        public async Task HabilitarCambioStatus(string usuario)
        {
            var usuario_hubConnect = UsuarioRepo.GetHubUser(usuario, hub);
            string data = "userdqotdisponible";

            if (usuario_hubConnect.Count > 0)
            {
                await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("UsuarioDisponibledqot", data);
            }
        }

        // Notificaciones
        public async Task EnviarNotificacionTodos(string mensaje)
        {
            await Clients.All.SendAsync("RecibeNotificacionTodos", mensaje);
        }


        public async Task EnviarNotificacionGrupo(string mensaje, string grupo)
        {
            await Clients.Group(grupo).SendAsync("RecibeNotificacionGrupo", mensaje);
        }

    }
}
