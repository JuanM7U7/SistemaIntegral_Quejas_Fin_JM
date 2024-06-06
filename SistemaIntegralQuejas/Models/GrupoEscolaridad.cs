using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class GrupoEscolaridad
{
    public int IdGrupoEscolaridad { get; set; }

    public string Descripcion { get; set; }

    public virtual ICollection<Escolaridad> Escolaridads { get; set; } = new List<Escolaridad>();
}
