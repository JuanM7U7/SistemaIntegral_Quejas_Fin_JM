using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class ModalidadViolencium
{
    public int IdModalidadViolencia { get; set; }

    public string NombreModalidadViolencia { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
