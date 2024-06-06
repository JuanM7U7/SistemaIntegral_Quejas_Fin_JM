using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatVisitaduria
{
    public string Descripcion { get; set; }

    public int? Estatus { get; set; }

    public int? IdVisitaduria { get; set; }

    public int? FkIdTitular { get; set; }
}
