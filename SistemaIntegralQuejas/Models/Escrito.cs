using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Escrito
{
    public int Id { get; set; }

    public string Peticionarios { get; set; }

    public string FechaHechos { get; set; }

    public string LugarHechos { get; set; }

    public string CircunstanciasHechos { get; set; }

    public string NombresFinales { get; set; }

    public string Autoridades { get; set; }

    public string RutaDocumento { get; set; }

    public virtual ICollection<Actac> Actacs { get; set; } = new List<Actac>();
}
