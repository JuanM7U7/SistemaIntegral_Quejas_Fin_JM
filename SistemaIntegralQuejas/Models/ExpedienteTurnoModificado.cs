namespace SistemaIntegralQuejas.Models
{
    public class ExpedienteTurnoModificado : ExpedienteTurno
    {
        public string Txtvisitaduria { get; set; }
        public string Fechaturnovisitaduriatxt { get; set; }
        public string FechastrFinDqot { get; set; }
        public int fk_iduserdestinatario { get; set; }
        public string memorandum { get; set; }
    }
}
