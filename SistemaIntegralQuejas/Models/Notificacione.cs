using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Notificacione
{
    public int Id { get; set; }

    public string Username { get; set; }

    public string Nombreuser { get; set; }

    public string Titulo { get; set; }

    public string Message { get; set; }

    public string MessageType { get; set; }

    public string Grupo { get; set; }

    public string Url { get; set; }

    public DateTime? NotificationDateTime { get; set; }
}
