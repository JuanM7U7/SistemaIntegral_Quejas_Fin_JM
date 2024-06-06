namespace SistemaIntegralQuejas.Models
{
    public class MemorandumModificado : Memorandum
    {
        public List<Area> lstArea { get; set; }
        public List<Area> lstAreades { get; set; }
        // Titular del area destino
        public List<Usuario> lstUsuario { get; set; }
        public List<ExpedienteTurno> lstExpturnados { get; set; }

    }
}


