using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Memorandum
{
    public int PkMemorandum { get; set; }

    public string NumMemorandum { get; set; }

    public DateTime? FechaDeCreacion { get; set; }

    public int? FkAreaOrigen { get; set; }

    public int? FkAreaDestinatario { get; set; }

    public string Asunto { get; set; }

    public int? UltimoUsuarioModifica { get; set; }

    public int? FkIduserdestinatario { get; set; }

    public int? FkStatus { get; set; }
}
