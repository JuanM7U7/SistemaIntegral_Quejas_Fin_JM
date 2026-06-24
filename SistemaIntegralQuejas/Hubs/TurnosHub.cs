using Microsoft.AspNetCore.SignalR;
using SistemaIntegralQuejas.Models;
using SistemaIntegralQuejas.Repos;
using System.Data;
using System.Data.SqlClient;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System;
using System.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace SistemaIntegralQuejas.Hubs
{
    public class TurnosHub : Hub
    {
        public string hub = "";
        public string grupoHub = "";
        public string username = "";
        private static Queue<TurnoModificado> listaTurno = new Queue<TurnoModificado>();
        UsuarioRepo UsuarioRepo;
        TurnosRepo TurnosRepo;
        private SQLMODEL conexionsql = new();
        public TurnosHub()
        {
            UsuarioRepo = new UsuarioRepo(conexionsql.ConnectionStrng());
            TurnosRepo = new TurnosRepo(conexionsql.ConnectionStrng());
        }
        // Fin Conexion DB

        // Se conecta al hub
        public override Task OnConnectedAsync()
        {
            Clients.Caller.SendAsync("OnConnected_TblTurno");
            return base.OnConnectedAsync();
        }

        public async Task GuardarConexionUsuario_TblTurno(string usuario, string grupo, string hubGet)
        {
            var conexionId = Context.ConnectionId;
            grupoHub = grupo;
            hub = hubGet;
            username = usuario;
            Groups.AddToGroupAsync(conexionId, grupoHub);
            bool UsuarioGuardado = UsuarioRepo.GuardarConexionUsuario(Context.ConnectionId, usuario, grupo, hub);
            await Clients.Client(conexionId).SendAsync("GuardarConexion", UsuarioGuardado);

        }

        // Se desconceta del hub
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Groups.RemoveFromGroupAsync(Context.ConnectionId, grupoHub);
            UsuarioRepo.EliminaConexionHubUser(Context.ConnectionId, username);

            return base.OnDisconnectedAsync(exception);
        }

        //FUNCIONES TURNOS

        // Reproduce sonido al llegar turno nuevo
        public async Task ContadorTurnosPendientes_TblTurno(string grupo)
        {
            string delimitador = "/";
            string[] grupoDividido = grupo.Split(delimitador);
            bool sonidoAdmin = false;

            listaTurno = new Queue<TurnoModificado>();
            var respTurnos = TurnosRepo.GetTurnos();
            foreach (var turno in respTurnos)
            {
                listaTurno.Enqueue(turno);
            }

            if (respTurnos.Count > 0)
            {
                sonidoAdmin = true;
            }

            string grupoADMIN_DQOT = grupoDividido[0];
            string grupoVA_DQOT = grupoDividido[1];

            var verificar_grupoAdminDQOT = UsuarioRepo.ContadorUsuariosGrupo(grupoADMIN_DQOT);
            var verificar_grupoVaDQOT = UsuarioRepo.ContadorUsuariosGrupo(grupoVA_DQOT);

            // Sonido para administradores
            if (verificar_grupoAdminDQOT.Count > 0)
            {
                await Clients.Group(grupoADMIN_DQOT).SendAsync("SonidoTurnosPendientesAdmin", sonidoAdmin);
                await Clients.Group(grupoADMIN_DQOT).SendAsync("SonidoTurnosPendientes", sonidoAdmin);
            }
            //Activar boton para asignar turno 
            if (verificar_grupoVaDQOT.Count > 0)
            {
                await Clients.Group(grupoVA_DQOT).SendAsync("SonidoTurnosPendientes", sonidoAdmin);
            }
        }
        // Activa o desactiva boton de Asignar Turno
        public async Task StatusBtn_AsignarTurno_TblTurno()
        {
            listaTurno = new Queue<TurnoModificado>();
            var respTurnos = TurnosRepo.GetTurnos();
            foreach (var turno in respTurnos)
            {
                listaTurno.Enqueue(turno);
            }

            // ARRAY TURNOS PENDIENTES
            string hubVADQOT = "VA_DQOT";
            string hubAdminDQOT = "ADMIN_DQOT";

            var verificar_grupoAdminDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubAdminDQOT);
            var verificar_grupoVaDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubVADQOT);

            if (verificar_grupoAdminDQOT.Count > 0)
            {
                await Clients.Group("ADMIN_DQOT").SendAsync("StatusBtnAsignarTurnos", respTurnos);
            }

            if (verificar_grupoVaDQOT.Count > 0)
            {
                await Clients.Group("VA_DQOT").SendAsync("StatusBtnAsignarTurnos", respTurnos);
            }
        }

        // Cambiar de VA el turno

        // FIN Cambiar de VA el turno

        // Obtener Modulos disponibles
        public async Task GetModulos()
        {
            var modulos = TurnosRepo.GetModulosDisponibles();
            await Clients.All.SendAsync("RecibeMoudlosDqotDisponibles", modulos);
        }
        // FIN Obtener Modulos disponibles
        public async Task Tabla_Administrador_TblTurno()
        {
            var turnosAdmin = TurnosRepo.GetTurnosAdmin();
            string hubAdminDQOT = "ADMIN_DQOT";
            var verificar_grupoAdminDQOT = UsuarioRepo.ContadorUsuariosGrupo(hubAdminDQOT);

            if (verificar_grupoAdminDQOT.Count > 0)
            {
                await Clients.Group(grupoHub).SendAsync("RegresaTurnosVGQ", turnosAdmin);
            }
        }
        // Tabla VA_DQOT 
        public async Task TablaVA_Dqot_TblTurno(string username)
        {
            int status = 2;
            var usuario_hubConnect = UsuarioRepo.GetHubUser(username, hub);
            var turnos = TurnosRepo.GetTurnosxUser(username, status);

            if (usuario_hubConnect.Count > 0)
            {
                await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("TurnosPendientesVAQ_TblTurno", turnos);
            }
        }
        // Tabla Pantalla TV 
        public async Task Tabla_PantallaTv_TblTurno(string grupotv)
        {
            var turnos = TurnosRepo.GetTurnosAtendiendo();
            var verificar_grupoTvDQOT = UsuarioRepo.ContadorUsuariosGrupo(grupotv);

            if (verificar_grupoTvDQOT.Count > 0)
            {
                await Clients.Group(grupotv).SendAsync("RecibeTurnosEnCurso", turnos);
            }
        }
        // Sonido para pantalla TV DQO
        public async Task Sonido_TV_DQOT(string grupotv)
        {
            bool status = true;
            var verificar_grupoTvDQOT = UsuarioRepo.ContadorUsuariosGrupo(grupotv);

            if (verificar_grupoTvDQOT.Count > 0)
            {
                await Clients.Group(grupotv).SendAsync("SonidoPantallasTvDqot", status);
            }
        }
        // FUNCIONES PARA ENVIAR MENSAJES
        public async Task EnviarNotificacionTodos_TblTurno()
        {
            int turnosPendientes = 0;
            await Clients.All.SendAsync("RecibeNotificacionTodos_TblTurno", turnosPendientes);
        }

        public async Task EnviarNotificacionPersonal_TblTurno(string usuario)
        {
            string mensaje = "";
            var usuario_hubConnect = UsuarioRepo.GetHubUser(usuario, hub);
            await Clients.Client(usuario_hubConnect[0].ConnectionId).SendAsync("RecibeNotificacionPersonal_TblTurno", mensaje, usuario);
        }
        public async Task EnviarNotificacionGrupo_TblTurno(string grupo)
        {
            string mensaje = "hola papitos";
            var verificar_grupo = UsuarioRepo.ContadorUsuariosGrupo(grupo);

            if (verificar_grupo.Count > 0)
            {
                await Clients.Group(grupo).SendAsync("RecibeNotificacionGrupo_TblTurno", mensaje);
            }

        }

        // FIN FUNCIONES PARA ENVIAR MENSAJES

    }
}
