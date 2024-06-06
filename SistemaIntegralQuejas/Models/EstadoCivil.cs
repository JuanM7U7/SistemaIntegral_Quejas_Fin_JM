using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EstadoCivil
{
    public int IdEstadoCivil { get; set; }

    public string Nombre { get; set; }

    public virtual ICollection<Direccion> Direccions { get; set; } = new List<Direccion>();
}
