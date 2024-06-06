using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatSede
{
    public int IdSede { get; set; }

    public string Descripcion { get; set; }

    public int? Status { get; set; }
}
