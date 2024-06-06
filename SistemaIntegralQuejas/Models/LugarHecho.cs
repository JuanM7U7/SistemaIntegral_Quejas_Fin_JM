using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class LugarHecho
{
    public int Id { get; set; }

    public int? IdMunicipio { get; set; }

    public string Calle { get; set; }

    public string NumeroExt { get; set; }

    public string NumeroInt { get; set; }

    public int? Cp { get; set; }

    public string Colonia { get; set; }
}
