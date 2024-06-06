using Microsoft.AspNetCore.Mvc;

namespace SistemaIntegralQuejas.Controllers
{
    public class Encabezado : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
