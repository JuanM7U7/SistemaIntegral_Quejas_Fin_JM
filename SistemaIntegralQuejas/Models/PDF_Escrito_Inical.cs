namespace SistemaIntegralQuejas.Models
{
    public class PDF_Escrito_Inical : EscritoOk
    {
        public List<RegRecepcion> reg_recepcion { get; set; }
        public List<PDF_Lugarhechos> lugar_hechos { get; set; }
        public List<PDF_Autoridadesei> enlace_ea { get; set; }
        public List<EnlaceArchivoadjuntoEscritoi> uploadsei { get; set; }
        public DateTime? fechactual { get; set; }
    }

    public class PDF_Lugarhechos
    {
        public string estado { get; set; }
        public string municipio { get; set; }
        public string calle { get; set; }
        public string num_ext { get; set; }
        public string num_int { get; set; }
        public int cp { get; set; }
        public string colonia { get; set; }
    }

    public class PDF_Autoridadesei
    {
        public string? autoridad { get; set; }
        public string? cargo_persona { get; set; }
        public string? nombre_persona { get; set; }
    }


}
