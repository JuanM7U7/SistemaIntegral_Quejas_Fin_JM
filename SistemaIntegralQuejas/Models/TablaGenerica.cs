namespace SistemaIntegralQuejas.Models
{
    public class TablaGenerica
    {
        public int Id { get; set; }
        public string Expediente { get; set; }
        public string FechaTurno { get; set; }
        public string FechaRecep { get; set; }
        public string FechaCalific { get; set; }
        public string FechaTunAbo { get; set; }
        public string Status { get; set; }
        public string otro { get; set; }
        public string semaforo1 { get; set; }
        public string Concluido { get; set; }
        public string semaforo2 { get; set; }


        public TablaGenerica() { }
        public TablaGenerica(int i ,string exp,string fechaTurno, string status) { Id = i;Expediente = exp; FechaTurno = fechaTurno;Status = status; }

    }

    public class selectGenerico 
    {
    public string s1 { get; set; }
    public string s2 { get; set; }


        public selectGenerico() { }

        public selectGenerico(string s1, string s2) 
        {
            this.s1 = s1;
            this.s2 = s2;
        }
    }
}
