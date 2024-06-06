namespace SistemaIntegralQuejas.Models
{
    public class CancelacionExpedientesPeticionarios
    {
       public int idExp { get; set; }
        public int idComplementoPeticionario { get; set; }
        public int idPeticionario { get; set;}
        public string NombrePeticionario{ get; set;}

        public CancelacionExpedientesPeticionarios() { }
        public CancelacionExpedientesPeticionarios(int idExp, int idComplementoPeticionario, int idPeticionario, string nombrePeticionario)
        {
            this.idExp = idExp;
            this.idComplementoPeticionario = idComplementoPeticionario;
            this.idPeticionario = idPeticionario;
            NombrePeticionario = nombrePeticionario;
        }
    }

    public class CancelacionExpedientesActaC
    {
        public int IDexp { get; set; }
        public int IDActaC { get; set; }

        public CancelacionExpedientesActaC() { }
        public CancelacionExpedientesActaC(int iDexp, int iDActaC)
        {
            IDexp = iDexp;
            IDActaC = iDActaC;
        }
    }
}
