using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Area
{
    public int IdArea { get; set; }

    public string Descripcion { get; set; }

    public string Siglas { get; set; }

    public bool? Seleccionable { get; set; }

    public virtual ICollection<RegistroAsistencium> RegistroAsistencia { get; set; } = new List<RegistroAsistencium>();
}
