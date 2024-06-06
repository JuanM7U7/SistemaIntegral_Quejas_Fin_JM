using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatInterpo
{
    public int IdViainterpo { get; set; }

    public string Descripcion { get; set; }

    public bool? Seleccionable { get; set; }

    public virtual ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}
