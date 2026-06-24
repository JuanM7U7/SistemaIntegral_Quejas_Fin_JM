namespace SistemaIntegralQuejas.Models
{
    public class CedulaIncompetenciaModel
    {
        public string IdEscrito { get; set; }
        public string Folio { get; set; }
        public string LugarRecepcion { get; set; }
        public DateTime FechaRecepcion { get; set; }
        public TimeSpan HoraRecepcion { get; set; }
        public string Peticionario { get; set; }
        public string Oficio { get; set; }
        public string Institucion { get; set; }
	    public string Remitente { get; set; }
        public string Explicacion { get; set; }
        public string Abogado { get; set; }
        public DateTime FechaActual => DateTime.Now;
        public string MesActual => FechaActual.ToString("MMMM", new System.Globalization.CultureInfo("es-ES"));
    }
}
