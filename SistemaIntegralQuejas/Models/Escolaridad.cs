using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Escolaridad
{
    public int IdEscolaridad { get; set; }

    public string Nombre { get; set; }

    public int IdGrupoEscolaridad { get; set; }

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();

    public virtual GrupoEscolaridad IdGrupoEscolaridadNavigation { get; set; }
}
