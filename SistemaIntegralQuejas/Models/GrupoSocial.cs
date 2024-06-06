using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class GrupoSocial
{
    public int IdGrupoSocial { get; set; }

    public string NombreGrupoSocial { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();
}
