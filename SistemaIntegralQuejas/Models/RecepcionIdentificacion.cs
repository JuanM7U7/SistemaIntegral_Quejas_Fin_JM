using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class RecepcionIdentificacion
{
    public int IdRelacion { get; set; }

    public string FotoIdentificacion { get; set; }

    public int IdRegistro { get; set; }

    public int IdIdentificacion { get; set; }

    public virtual CatIdentificacion IdIdentificacionNavigation { get; set; }

    public virtual RegRecepcion IdRegistroNavigation { get; set; }
}
