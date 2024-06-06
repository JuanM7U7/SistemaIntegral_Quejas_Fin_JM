using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatEstado
{
    public int? IdEstado { get; set; }

    public string CveEstado { get; set; }

    public string Descripcion { get; set; }

    public string Seleccionable { get; set; }
}
