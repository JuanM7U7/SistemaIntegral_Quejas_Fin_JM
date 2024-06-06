using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EnlacePersonaEscrito
{
    public int IdEnlacePersonaEscrito { get; set; }

    public int IdEscrito { get; set; }

    public string NombrePersona { get; set; }

    public string Cargo { get; set; }
}
