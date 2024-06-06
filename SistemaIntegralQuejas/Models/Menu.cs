using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Menu
{
    public int IdMenu { get; set; }

    public string Descripcion { get; set; }

    public bool? Habilitado { get; set; }

    public string Ruta { get; set; }
}
