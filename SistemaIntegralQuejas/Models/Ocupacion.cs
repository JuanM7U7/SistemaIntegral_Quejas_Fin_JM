using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Ocupacion
{
    public int IdOcupacion { get; set; }

    public string NombreOcupacion { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
