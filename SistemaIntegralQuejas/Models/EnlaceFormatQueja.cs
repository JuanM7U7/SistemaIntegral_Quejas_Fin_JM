using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EnlaceFormatQueja
{
    public int IdUnionFormatosQueja { get; set; }

    public int? FkExpediente { get; set; }

    public int? FkComplementoPeticionario { get; set; }

    public int? FkEscritoOk { get; set; }

    public int? FkActac { get; set; }

    public int? FkPeticionario { get; set; }

    public virtual Actac FkActacNavigation { get; set; }

    public virtual ComplementoPeticionario FkComplementoPeticionarioNavigation { get; set; }

    public virtual EscritoOk FkEscritoOkNavigation { get; set; }

    public virtual Expediente FkExpedienteNavigation { get; set; }

    public virtual RegRecepcion FkPeticionarioNavigation { get; set; }
}
