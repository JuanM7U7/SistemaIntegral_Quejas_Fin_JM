namespace SistemaIntegralQuejas.Models
{
    public class FormatoRechazoRequest
    {
        public int IdQueja { get; set; }
        public string Visitaduria { get; set; }
        public string Memorandum { get; set; }
        public string PrimeraParte { get; set; }
        public string SegundaParte { get; set; }
        public string TerceraParte { get; set; }
        public string Firma { get; set; }
        public int AreaId { get; set; }
        public List<ObservacionRequest> Observaciones { get; set; }
        public List<string> IdsAceptados { get; set; }
    }

    public class ObservacionRequest
    {
        public string IdExpediente { get; set; }
        public string Justificacion { get; set; }
    }
}
