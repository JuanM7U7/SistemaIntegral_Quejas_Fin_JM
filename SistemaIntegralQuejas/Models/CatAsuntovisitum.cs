using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class CatAsuntovisitum
{
    public int IdAsunto { get; set; }

    public string Descripcion { get; set; }

    public bool? Seleeccionable { get; set; }

    public virtual ICollection<RegistroAsistencium> RegistroAsistencia { get; set; } = new List<RegistroAsistencium>();
}
