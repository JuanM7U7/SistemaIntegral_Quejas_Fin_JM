using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatTema
{
    public int IdTema { get; set; }

    public string Descripcion { get; set; }

    public bool? Seleccionable { get; set; }

    public virtual ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}
