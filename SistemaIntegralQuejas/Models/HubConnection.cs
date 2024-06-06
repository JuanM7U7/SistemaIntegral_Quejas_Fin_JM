using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class HubConnection
{
    public int Id { get; set; }

    public string ConnectionId { get; set; }

    public string Username { get; set; }

    public string Grupo { get; set; }

    public string Hub { get; set; }

    public int? Status { get; set; }
}
