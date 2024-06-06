namespace SistemaIntegralQuejas.Models
{
    public class GeneralModel
    {
        public class Selectmaster
        {
            public int idSelect { get; set; }
            public string Descripcion { get; set; }
            public Selectmaster() { }
            public Selectmaster(int i1, string s1)
            {
                idSelect = i1;
                Descripcion = s1;
            }
        }

        public class SelecVisitaduria
        {
            public int idSelect { get; set; }
            public string Descripcion { get; set; }
            public int idUserTitular { get; set; }

        }
    }
}
