using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Moduloatenciondqot
{
    public int IdModuloDqot { get; set; }

    public string NombreModulo { get; set; }

    public int? Status { get; set; }

    public int? StatusDisponible { get; set; }

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
