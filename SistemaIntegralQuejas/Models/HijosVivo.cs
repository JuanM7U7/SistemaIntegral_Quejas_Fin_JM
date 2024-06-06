using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class HijosVivo
{
    public int IdHijosVivos { get; set; }

    public string NombreHijosVivos { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
