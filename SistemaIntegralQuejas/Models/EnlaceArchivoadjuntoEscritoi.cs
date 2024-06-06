using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EnlaceArchivoadjuntoEscritoi
{
    public int PkEnlaceAdjescritoi { get; set; }

    public int? IdEscritoinicial { get; set; }

    public string RutaArchivo { get; set; }

    public int? FkStatus { get; set; }

    public string Type { get; set; }
}
