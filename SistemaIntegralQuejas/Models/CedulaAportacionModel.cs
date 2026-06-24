namespace SistemaIntegralQuejas.Models
{
    public class CedulaAportacionModel
    {
        public string LugarRecepcion { get; set; }
        public DateTime FechaRecepcion { get; set; }
        public TimeSpan HoraRecepcion { get; set; }
        public string Peticionario { get; set; }
        public string Autoridad { get; set; }
        public string Expediente { get; set; }
        public string Explicacion { get; set; }
        public string Abogado { get; set; }
        public DateTime FechaActual => DateTime.Now;
        public string MesActual => FechaActual.ToString("MMMM", new System.Globalization.CultureInfo("es-ES"));
    }
}