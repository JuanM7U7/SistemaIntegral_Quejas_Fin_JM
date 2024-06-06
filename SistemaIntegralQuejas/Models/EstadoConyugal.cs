using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EstadoConyugal
{
    public int IdEstadoConyugal { get; set; }

    public string Nombre { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
