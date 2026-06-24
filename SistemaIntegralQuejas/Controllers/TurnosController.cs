using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.Models;
using SistemaIntegralQuejas.Repos;

namespace SistemaIntegralQuejas.Controllers
{
    public class TurnosController : Controller
    {
        private SQLMODEL conexionsql = new();
        private static Queue<TurnoModificado> listaTurno = new Queue<TurnoModificado>();
        TurnosRepo TurnosRepo;
        UsuarioRepo UsuarioRepo;
        LayoutHub notificationHub;
        public TurnosController(LayoutHub notificationHub)  
        {
            TurnosRepo = new TurnosRepo(conexionsql.ConnectionStrng());
            UsuarioRepo = new UsuarioRepo(conexionsql.ConnectionStrng());
            this.notificationHub = notificationHub;
        }
        public IActionResult Index()
        {
            return View();
        }

        // Dibujar tabla VA DQO
        public ActionResult Turnos_Pendientes()
        {

            listaTurno = new Queue<TurnoModificado>();
            var respTurnos = TurnosRepo.GetTurnos();
            foreach (var turno in respTurnos)
            {
                listaTurno.Enqueue(turno);
            }

            return Json(
            new
            {
                turnosPendientes = respTurnos
            });
        }

        public ActionResult Tblvaq_Turnos_Pendientes(IFormCollection form)
        {
            string username = (form["user"]).ToString();
            int status = Int32.Parse(form["status"]);
            string fechainicio = (form["fechainicio"]).ToString();
            string fechafin = (form["fechafin"]).ToString();

            var turnos = TurnosRepo.GetTurnosxUser(username, status);

            return Json(
            new
            {
                data = turnos
            });
        }

        // Busqueda de turnos con filtros
        public ActionResult Tblvaq_Filtro_Turnos(IFormCollection form)
        {
            string username = (form["user"]).ToString();
            int status = Int32.Parse(form["status"]);
            string fechainicio = (form["fechainicio"]).ToString();
            string fechafin = (form["fechafin"]).ToString();

            var turnos = TurnosRepo.GetTurnos_Filtros(username, status, fechainicio, fechafin);

            return Json(
            new
            {
                data = turnos
            });
        }

        // LLenar select de estado de un turno
        public ActionResult Status_TurnosTbl()
        {
            List<GeneralModel.Selectmaster> getStatusTurno = new List<GeneralModel.Selectmaster>();

            String query = "exec Sp_Select_Estado_Turno";
            string mensaje = "";
            getStatusTurno = conexionsql.selectMaestro(query, ref mensaje);

            if (getStatusTurno.Count > 0)
            {
                return Json(
                    new
                    {
                        data = getStatusTurno
                    });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }

        // Dibujar tabla para Administrador DQO
        public ActionResult TurnosAdmin_TurnosTbl()
        {
            var turnosAdmin = TurnosRepo.GetTurnosAdmin();
            return Json(new { data = turnosAdmin });
        }
        // Busqueda de turnos con filtros Administradores DQO
        public ActionResult TblAdmin_Filtro_Turnos(IFormCollection form)
        {
            int status = Int32.Parse(form["status"]);
            string fechainicio = (form["fechainicio"]).ToString();
            string fechafin = (form["fechafin"]).ToString();

            var turnos = TurnosRepo.GetTurnosAdmin_Filtros(status, fechainicio, fechafin);

            return Json(
            new
            {
                data = turnos
            });
        }

        // Obtener datos de un peticionario
        public ActionResult Get_DatosPeticionario(IFormCollection form)
        {
            int idPeticionario = Int32.Parse(form["idPeticionario"]);

            var Peticionario = TurnosRepo.GetPeticionarioRepo(idPeticionario);
            return Json(new { data = Peticionario });
        }
        // Aignar turno aleatoriamente

        bool asignar = false;
        public async Task<bool> GeneraTurnosAleatorio(string IdUser)
        {
            listaTurno = new Queue<TurnoModificado>();
            Random rnd = new Random();
            var turnos = TurnosRepo.GetTurnos();
            var users = UsuarioRepo.GetUsuariosActivos();

            foreach (var turnoItem in turnos)
            {
                listaTurno.Enqueue(turnoItem);
            }

            if (users.Count == 0)
            {
                asignar = false;
            }
            else
            {
                int indexUserElElegido = rnd.Next(0, users.Count - 1);
                asignar = TurnosRepo.Re_AsignarTurno(turnos[0].IdTurno, users[indexUserElElegido].IdUsuario, users[indexUserElElegido].Usuario1);
                await notificationHub.DesabilitarCambioStatus(users[indexUserElElegido].Usuario1);
                //asignar = TurnoRepository.Re_AsignarTurno(products[0].ID_TURNO, int.Parse(IdUser));
            }

            return asignar;
        }

        // Atender turno asignado
        public ActionResult ActualizarStatusModulo(IFormCollection form)
        {
            int idturno = Int32.Parse(form["idturno"]);
            int idmodulo = Int32.Parse(form["idmodulo"]);
            int iduser = Int32.Parse(form["iduser"]);
            string username = (form["username"]).ToString();

            bool respuesta = TurnosRepo.UpdateModuloSeleccionado(idturno, idmodulo, iduser, username);
            return Json(new { data = respuesta });
        }

        // Finalizar turno
        public async Task<ActionResult> FinalizarTurnovaq(IFormCollection form)
        {
            int idmodulo_fin = Int32.Parse(form["idmodulo_fin"]);
            int idturno_fin = Int32.Parse(form["idturno_fin"]);
            int iduser = Int32.Parse(form["iduser"]);
            string username = (form["username"]).ToString();

            String query = "exec Sp_Finaliza_Turno " +
                           "" + idturno_fin + "";
            String querydos = "exec Sp_Desocupar_Modulo " +
                           "" + idmodulo_fin + "";
            String querytres = "exec Sp_Activar_Usuario " +
                           "" + iduser + "";

            bool turnofin = conexionsql.InsertUpdateDelete(query);
            bool modulodesocupar = conexionsql.InsertUpdateDelete(querydos);
            bool reactivar_usuario = conexionsql.InsertUpdateDelete(querytres);
            await notificationHub.HabilitarCambioStatus(username);

            return Json(
                new
                {
                    status = turnofin,
                    msg = "Turno Finalizado Correctamente"
                });
        }

        // Obtener turno en curso por abogado

        public ActionResult ValidaTurnoEnCurso(IFormCollection form)
        {
            if ( (form["idusuario"]).ToString() != "" )
            {
                string iduser = (form["idusuario"]).ToString();


                var TurnoAtendiendo = TurnosRepo.GetTurnosEnCursoxUser(iduser);
                return Json(new { data = TurnoAtendiendo });
            } else
            {
                return RedirectToAction("IniciarSesion", "Login");
            }

        }

        public ActionResult ObtenerTurnosEnCurso()
        {
            var TurnoAtendiendo = TurnosRepo.GetTurnosAtendiendo();

            return Json(new { data = TurnoAtendiendo });
        }

    }
}
