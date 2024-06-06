using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatEstadoturno
{
    public int IdEstado { get; set; }

    public string Descripcion { get; set; }

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
