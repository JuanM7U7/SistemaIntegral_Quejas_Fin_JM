using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaIntegralQuejas.Models;
using SistemaIntegralQuejas.Repos;
using SistemaIntegralQuejas.Hubs;
// REFERENCIAS AUTHENTICATION COOKIE
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace SistemaIntegralQuejas.Controllers
{
	public class LoginController : Controller
	{
        private SQLMODEL conexionsql = new();
        private Usuarios ModeloSession = new();
        LayoutHub notificationHub;
        UsuarioRepo UsuarioRepo;

        public LoginController(LayoutHub notificationHub)
        {
            this.notificationHub = notificationHub;
        }
        
        public IActionResult IniciarSesion()
		{
            string vistaPrincipal = "";
            string controlador = "";
            if (User.Identity.IsAuthenticated)
            {
                if (User.IsInRole("ADMIN_DQOT"))
                {
                    vistaPrincipal = "Index_ADMIN_DQOT";
                    controlador = "Home";
                }
                else if (User.IsInRole("VA_DQOT"))
                {
                    vistaPrincipal = "Index";
                    controlador = "Home";
                }
                else if(User.IsInRole("TV_DQOT"))
                {
                    vistaPrincipal = "Index_TV_DQOT";
                    controlador = "Home";
                }
                else if(User.IsInRole("VG"))
                {
                    vistaPrincipal = "Calificacion";
                    controlador = "Expediente";

                }
                else if(User.IsInRole("VAV"))
                {
                    vistaPrincipal = "VistaCalificacion";
                    controlador = "Expediente";

                }
                else if(User.IsInRole("ADMIN_DQOT_ESPECIAL"))
                {
                    vistaPrincipal = "Index_ADMIN_DQOT_ESPECIAL";
                    controlador = "Home";
                }


                return RedirectToAction(vistaPrincipal, controlador);
            } 

            return View();
		}
         
		[HttpPost]

		public async Task<IActionResult> IniciarSesion(string username, string password)
		{

            List<object> listaContenedora = new List<object>();
            String query = "exec Sp_Login_Usuario " + "'" + username + "'," + "'" + password + "'";
            string mensaje = "";
            listaContenedora = conexionsql.datos_Usuario(query, ref mensaje);
            string vistaPrincipal = "";
            string login_page = "";


            if (listaContenedora.Count > 0)
            {
                // VALIDAR USUARIO LOGUEADO
                if ( (bool)((Usuarios)listaContenedora[0]).Logueo )
                {
                    vistaPrincipal = "Userlogueado";

                    //2.- CONFIGURACION DE LA AUTENTICACION 
                    #region AUTENTICACTION  
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, ((Usuarios)listaContenedora[0]).Usuario1),
                        new Claim("Nombre", ((Usuarios)listaContenedora[0]).Nombre),
                    };

                    claims.Add(new Claim(ClaimTypes.Role, ((Usuarios)listaContenedora[0]).Rol));
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                    #endregion

                    HttpContext.Session.SetInt32("IdUsuario", ((Usuarios)listaContenedora[0]).IdUsuario);
                    HttpContext.Session.SetString("Username", ((Usuarios)listaContenedora[0]).Usuario1);
                    HttpContext.Session.SetString("Nombre", ((Usuarios)listaContenedora[0]).Nombre);
                    HttpContext.Session.SetString("Apellidop", ((Usuarios)listaContenedora[0]).Ap);
                    HttpContext.Session.SetString("Apellidom", ((Usuarios)listaContenedora[0]).Am);
                    HttpContext.Session.SetString("Rol", ((Usuarios)listaContenedora[0]).Rol);
                    HttpContext.Session.SetString("Grupo", ((Usuarios)listaContenedora[0]).Grupo);
                    HttpContext.Session.SetString("Area", ((Usuarios)listaContenedora[0]).area);
                    HttpContext.Session.SetString("Cargo", ((Usuarios)listaContenedora[0]).cargo);
                    HttpContext.Session.SetString("Idarea", ((Usuarios)listaContenedora[0]).IdArea);

                    //bool habialiar_dispo = Activar_Disponibilidad_User(((SessionModelo)listaContenedora[0]).IDusuario);
                    if ((((Usuarios)listaContenedora[0]).Rol) == "VA_DQOT")
                    {
                        login_page = "Index";
                    }

                    if ((((Usuarios)listaContenedora[0]).Rol) == "ADMIN_DQOT")
                    {
                        login_page = "Index_ADMIN_DQOT";
                    }

                    if ((((Usuarios)listaContenedora[0]).Rol) == "TV_DQOT")
                    {
                        login_page = "Index_TV_DQOT";
                    }
                    if ((((Usuarios)listaContenedora[0]).Rol) == "VG")
                    {
                        login_page = "Calificacion";
                    }
                    if (((Usuarios)listaContenedora[0]).Rol=="VAV")
                    {
                        login_page = "VistaCalificacion";

                    }
                    if (((Usuarios)listaContenedora[0]).Rol == "ADMIN_DQOT_ESPECIAL")
                    {
                        login_page = "Index_ADMIN_DQOT_ESPECIAL";

                    }
                    

                }
                else
                {

                    //2.- CONFIGURACION DE LA AUTENTICACION 
                    #region AUTENTICACTION  
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, ((Usuarios)listaContenedora[0]).Usuario1),
                        new Claim("Nombre", ((Usuarios)listaContenedora[0]).Nombre),
                    };

                    claims.Add(new Claim(ClaimTypes.Role, ((Usuarios)listaContenedora[0]).Rol));
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                    #endregion

                    HttpContext.Session.SetInt32("IdUsuario", ((Usuarios)listaContenedora[0]).IdUsuario);
                    HttpContext.Session.SetString("Username", ((Usuarios)listaContenedora[0]).Usuario1);
                    HttpContext.Session.SetString("Nombre", ((Usuarios)listaContenedora[0]).Nombre);
                    HttpContext.Session.SetString("Apellidop", ((Usuarios)listaContenedora[0]).Ap);
                    HttpContext.Session.SetString("Apellidom", ((Usuarios)listaContenedora[0]).Am);
                    HttpContext.Session.SetString("Rol", ((Usuarios)listaContenedora[0]).Rol);
                    HttpContext.Session.SetString("Grupo", ((Usuarios)listaContenedora[0]).Grupo);
                    HttpContext.Session.SetString("Area", ((Usuarios)listaContenedora[0]).area);
                    HttpContext.Session.SetString("Cargo", ((Usuarios)listaContenedora[0]).cargo);
                    HttpContext.Session.SetString("Idarea", ((Usuarios)listaContenedora[0]).IdArea);

                    //bool habialiar_dispo = Activar_Disponibilidad_User(((SessionModelo)listaContenedora[0]).IDusuario);
                    if ( (((Usuarios)listaContenedora[0]).Rol ) == "VA_DQOT" )
                    {
                        vistaPrincipal = "Index";
                        login_page = "Index";
                    }

                    if ((((Usuarios)listaContenedora[0]).Rol) == "ADMIN_DQOT")
                    {
                        vistaPrincipal = "Index_ADMIN_DQOT";
                        login_page = "Index_ADMIN_DQOT";
                    }

                    if ((((Usuarios)listaContenedora[0]).Rol) == "TV_DQOT")
                    {
                        vistaPrincipal = "Index_TV_DQOT";
                        login_page = "Index_TV_DQOT";
                    }
                    if ((((Usuarios)listaContenedora[0]).Rol) == "VG")
                    {
                        vistaPrincipal = "Calificacion";
                        login_page = "Calificacion";
                    }
                    if (((Usuarios)listaContenedora[0]).Rol == "VAV")
                    {
                        vistaPrincipal = "VistaCalificacion";
                        login_page = "VistaCalificacion";

                    }
                    if ((((Usuarios)listaContenedora[0]).Rol) == "ADMIN_DQOT_ESPECIAL")
                    {
                        vistaPrincipal = "Index_ADMIN_DQOT_ESPECIAL";
                        login_page = "Index_ADMIN_DQOT_ESPECIAL";
                    }
                }


            }
            else
            {
                vistaPrincipal = "Nouser";
                login_page = "IniciarSesion";
            }

            return Json(new { page = vistaPrincipal, login_page = login_page });
        }

        bool deslogueado = false;
        [HttpPost]
        public async Task<IActionResult> DeslogueaUserl(string username)
        {
            deslogueado = true;
            //await notificationHub.Desloguear_Usuario(username);

            return Json(new { data = deslogueado });
        }

        bool activarpapu = false;
        [HttpPost]
        public ActionResult ActivaUsuarioLogueo(string username)
        {
            List<object> listaContenedora = new List<object>();
            var query = "EXEC Sp_ActivarUser_Login " + "'" + username + "'" ;
            string mensaje = "";
            listaContenedora = conexionsql.Disponibilidad_Usuario(query, ref mensaje);
            activarpapu = true;

            return Json(new { data = activarpapu });
        }

        public async  Task<ActionResult> CerrarSesion()
		{
            string user = HttpContext.Session.GetString("Username");

            string query = "UPDATE USUARIOS SET LOGUEO = 0 WHERE USUARIO = " + "'" + user + "'";
            bool resp = conexionsql.InsertUpdateDelete(query);

            //3.- REMOVER LA AUTENTICACION
            #region AUTENTICACTION
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            #endregion
            HttpContext.Session.Remove("IdUsuario");
			HttpContext.Session.Remove("Username");
			HttpContext.Session.Remove("Nombre");
			HttpContext.Session.Remove("Apellidop");
			HttpContext.Session.Remove("Apellidom");
			HttpContext.Session.Remove("Rol");
			HttpContext.Session.Remove("Grupo");
            HttpContext.Session.Remove("Area");
            HttpContext.Session.Remove("Cargo");
            HttpContext.Session.Remove("Idarea");
            return RedirectToAction(nameof(IniciarSesion));
		}

        public async Task<ActionResult> CerrarSesionDuplicado()
        {
            string user = HttpContext.Session.GetString("Username");

            string query = "UPDATE USUARIOS SET LOGUEO = 1 WHERE USUARIO = " + "'" + user + "'";
            bool resp = conexionsql.InsertUpdateDelete(query);

            //3.- REMOVER LA AUTENTICACION
            #region AUTENTICACTION
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            #endregion
            HttpContext.Session.Remove("IdUsuario");
            HttpContext.Session.Remove("Username");
            HttpContext.Session.Remove("Nombre");
            HttpContext.Session.Remove("Apellidop");
            HttpContext.Session.Remove("Apellidom");
            HttpContext.Session.Remove("Rol");
            HttpContext.Session.Remove("Grupo");
            HttpContext.Session.Remove("Area");
            HttpContext.Session.Remove("Cargo");
            HttpContext.Session.Remove("Idarea");
            return RedirectToAction(nameof(IniciarSesion));
        }

        public ActionResult ActivarDispnibilidadUser(IFormCollection form)
        {
		   int idUsuario = Int32.Parse(form["idusuario"]);
           bool statusDis = bool.Parse(form["disponiblidad"]);
           bool status = false; 

		    string query = "EXEC Sp_Activar_Dispnibilidad_User " + "" + idUsuario + "," + ""+ statusDis + "";

            if (conexionsql.InsertUpdateDelete(query)){
                status = true;
            }

		   return Json(
		   new
		   {
			   resp = status
		   });
		}


        public ActionResult ObtenerDispnibilidadUser(IFormCollection form)
        {
            bool sesion = false;
            List<object> listaContenedora = new List<object>();

            if ((form["idusuario"]).ToString() != "")
            {
                int idUsuario = Int32.Parse(form["idusuario"]);

                var query = "EXEC Sp_Obtener_DisponibilidadUser " + idUsuario;
                string mensaje = "";
                listaContenedora = conexionsql.Disponibilidad_Usuario(query, ref mensaje);
                sesion = true;
                return Json(
                 new
                 {
                     Activo = ((Usuarios)listaContenedora[0]).Activo,
                     Ocupado = ((Usuarios)listaContenedora[0]).Ocupado,
                     Existesesion = sesion
                 });
            }
            else
            {
                sesion = false;
                return Json(
                new
                {
                    Activo = 0,
                    Ocupado = 0,
                    Existesesion = sesion
                });
            }

        }

        public ActionResult Valida_Ultimo_User_Conectado()
        {
            UsuarioRepo = new UsuarioRepo(conexionsql.ConnectionStrng());
            var usuariosActivos = UsuarioRepo.GetUsuariosActivos();

            return Json(
            new
            {
                data = usuariosActivos
            });
        }

    }
}

