using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatTipoqueja
{
    public int IdTipoqueja { get; set; }

    public string Descripción { get; set; }

    public bool? Seleccionable { get; set; }

    public virtual ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}
