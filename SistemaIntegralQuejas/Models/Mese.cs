using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Mese
{
    public int IdMes { get; set; }

    public string Mes { get; set; }

    public int? Seleccionable { get; set; }
}
