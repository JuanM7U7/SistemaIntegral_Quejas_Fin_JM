using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class TipoViolencium
{
    public int IdTipoViolencia { get; set; }

    public string NombreTipoViolencia { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
