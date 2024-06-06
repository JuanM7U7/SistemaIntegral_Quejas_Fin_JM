using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class ExpedienteTurno
{
    public int PkExpedienteTurno { get; set; }

    public string IdExpediente { get; set; }

    public DateTime? Fechaturnovisitaduria { get; set; }

    public DateTime? Fechaturnovisitaduriaelectronico { get; set; }

    public int? Clavevisitaduria { get; set; }

    public int? Claveabogadoturnado { get; set; }

    public DateTime? Fecharecepfis { get; set; }

    public int? FkMemorandum { get; set; }

    public int? NumFojas { get; set; }

    public string Observaciones { get; set; }

    public DateTime? FechaFinDqot { get; set; }
}
