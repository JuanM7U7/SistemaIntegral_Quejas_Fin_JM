using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EnlaceEscritoAutoridad
{
    public int IdUnionAutEscrito { get; set; }

    public int IdEscrito { get; set; }

    public int IdAutoridad { get; set; }

    public string NombrePersona { get; set; }

    public string CargoPersona { get; set; }

    public int? IdQueja { get; set; }

    public int? FkStatus { get; set; }
}
