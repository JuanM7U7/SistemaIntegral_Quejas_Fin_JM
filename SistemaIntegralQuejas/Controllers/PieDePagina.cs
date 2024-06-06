using Microsoft.AspNetCore.Mvc;

namespace SistemaIntegralQuejas.Controllers
{
    public class PieDePagina : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
