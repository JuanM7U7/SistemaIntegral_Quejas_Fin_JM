using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatIdentificacion
{
    public int IdIdentificacion { get; set; }

    public string Descripcion { get; set; }

    public bool? Seleeccionable { get; set; }

    public virtual ICollection<Actac> Actacs { get; set; } = new List<Actac>();

    public virtual ICollection<RecepcionIdentificacion> RecepcionIdentificacions { get; set; } = new List<RecepcionIdentificacion>();
}
