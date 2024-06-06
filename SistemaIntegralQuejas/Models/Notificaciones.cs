using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Notificaciones
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Nombreuser { get; set; } = null!;

    public string Titulo { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string MessageType { get; set; } = null!;

    public string? Grupo { get; set; }

    public string? Url { get; set; }

    public DateTime? NotificationDateTime { get; set; }
}
