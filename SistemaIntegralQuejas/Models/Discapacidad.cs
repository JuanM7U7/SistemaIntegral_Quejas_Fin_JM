using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Discapacidad
{
    public int IdDiscapacidad { get; set; }

    public string NombreDiscapacidad { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
