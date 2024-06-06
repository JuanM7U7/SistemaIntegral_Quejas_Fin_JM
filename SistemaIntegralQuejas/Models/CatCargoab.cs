using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatCargoab
{
    public int IdCargo { get; set; }

    public string Descripcion { get; set; }

    public bool? Seleccionable { get; set; }

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
