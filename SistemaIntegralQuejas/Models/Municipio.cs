using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Municipio
{
    public int Consecutivo { get; set; }

    public string Cvemun { get; set; }

    public string Estado { get; set; }

    public string Municipio1 { get; set; }

    public long? ClaveMunicipio { get; set; }

    public virtual ICollection<Actac> Actacs { get; set; } = new List<Actac>();
}
