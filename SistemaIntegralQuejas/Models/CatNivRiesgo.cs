using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatNivRiesgo
{
    public int IdNivRiesgo { get; set; }

    public string Descripcion { get; set; }

    public bool? Seleccionable { get; set; }

    public virtual ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}
