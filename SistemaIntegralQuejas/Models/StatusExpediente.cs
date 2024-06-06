using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class StatusExpediente
{
    public int PkStatusExpediente { get; set; }

    public string Descripcion { get; set; }

    public virtual ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}
