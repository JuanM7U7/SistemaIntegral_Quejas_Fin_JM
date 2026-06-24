using Microsoft.AspNetCore.Mvc;
using SistemaIntegralQuejas.Models;
using System.Diagnostics;
//AUTHORIZACION
using Microsoft.AspNetCore.Authorization;

namespace SistemaIntegralQuejas.Controllers
{
	//AÑADIR LA AUTHORIZACION
	[Authorize]
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;

		public HomeController(ILogger<HomeController> logger)
		{
			_logger = logger;
		}
		 
        [Authorize(Roles = "ADMIN_DQOT,VA_DQOT")]
        public IActionResult Index()
		{
            if (User.Identity.IsAuthenticated)
            {
                return View();

			} else
			{
                return RedirectToAction("IniciarSesion", "Login");
            }
		}
        // Comentario de Prueba
        [Authorize(Roles = "ADMIN_DQOT")]
        public IActionResult Index_ADMIN_DQOT()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            else
            {
                return RedirectToAction("IniciarSesion", "Login");
            }
        }

        [Authorize(Roles = "ADMIN_DQOT,TV_DQOT")]
        public IActionResult Index_TV_DQOT()
		{
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            else
            {
                return RedirectToAction("IniciarSesion", "Login");
            }
        }

        [Authorize(Roles = "ADMIN_DQOT,VA_DQOT,ADMIN_DQOT_ESPECIAL")]
        public IActionResult Index_ADMIN_DQOT_ESPECIAL()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View("~/Views/Expediente/vistaCalificacion.cshtml");
            }
            else
            {
                return RedirectToAction("IniciarSesion", "Login");
            }
        }

        public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
