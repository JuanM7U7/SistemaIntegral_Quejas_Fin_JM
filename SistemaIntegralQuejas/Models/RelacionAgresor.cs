using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class RelacionAgresor
{
    public int IdRelacionAgresor { get; set; }

    public string NombreRelacionAgresor { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
