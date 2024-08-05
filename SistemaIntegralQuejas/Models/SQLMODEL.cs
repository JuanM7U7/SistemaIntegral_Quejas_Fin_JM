using SistemaIntegralQuejas.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Data;
using System.Data.SqlClient;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static SistemaIntegralQuejas.Controllers.ExpedienteController;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models
{
    public class SQLMODEL
    {
        //string ConnectionString = @"Data Source=192.168.1.14; Initial Catalog=DB_SistemaIntegralQuejas;TrustServerCertificate=True; User Id=sbdquejasok; Password=123456";
       public static string ConnectionString = @"Data Source=192.168.1.50; Initial Catalog=DB_SistemaIntegralQuejasQA;TrustServerCertificate=True; User Id=CDHDPITQA; Password=Cdhp2022*-+;";
        //public static string ConnectionString = @"Data Source=20.246.13.106; Initial Catalog=DB_SistemaIntegralQuejas;TrustServerCertificate=True; User Id=CDHPDPIT; Password=Cdhp2022*-+;";


        public string ConnectionStrng()
        { 
        return ConnectionString; }
        public SqlConnection conexion(ref string mensaje)
        {

            SqlConnection Connection = new SqlConnection(ConnectionString);
            try
            {
                Connection.Open();
                mensaje = "Conexion exitosa a la db CRACKuuuuuuuu";
            }
            catch (Exception ex)
            {

                mensaje = ex.Message;
            }

            return Connection;

        }

        public bool InsertUpdateDelete(string query)
        {
            bool respuesta = false;
            string  mensaje = "";
			try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    cmd.ExecuteNonQuery();
                }
				respuesta = true;
            }
            catch (Exception ex)
            {
				respuesta = false;
            }
            return respuesta;
        }

        public int InsertUpdateDeleteRegresaid(string query)
        {
            int idinsertado = 0;
            string mensaje = "";
            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    idinsertado = Convert.ToInt32(cmd.ExecuteScalar());
                }
            }
            catch (Exception ex)
            {
                idinsertado = 0;
            }
            return idinsertado;
        }
        public List<object> datos_Usuario(string query, ref string mensaje)
        {
            mensaje = "";
            List<object> lista = new List<object>();
            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();

                    Usuarios modelo = new Usuarios();
                    while (lector.Read())
                    {
                        modelo.IdUsuario = int.Parse(lector[0].ToString());
                        modelo.Usuario1 = lector[1].ToString();
                        modelo.Nombre = lector[2].ToString();
                        modelo.Ap = lector[3].ToString();
                        modelo.Am = lector[4].ToString();
                        modelo.Rol = lector[5].ToString();
                        modelo.Grupo = lector[6].ToString();
                        modelo.Correo = lector[7].ToString();
                        modelo.Logueo = (bool)(lector[8]);
                        modelo.area = lector[10].ToString();
                        modelo.cargo = lector[9].ToString();
                        modelo.IdArea = lector[11].ToString();
                        lista.Add(modelo);
                    }
                }
            }
            catch (Exception)
            {


            }


            return lista;
        }

		public List<SelectGenerico> lista_SelectGenerica(string query, ref string mensaje)
		{
			mensaje = "";
			List<SelectGenerico> lista = new List<SelectGenerico>();
			SqlDataReader lector;

			try
			{
				using (SqlConnection conn = conexion(ref mensaje))
				{
					SqlCommand cmd = new SqlCommand();
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = query;
					cmd.Connection = conn;
					lector = cmd.ExecuteReader();

					SelectGenerico modelo;
					while (lector.Read())
					{
						modelo = new SelectGenerico();
						modelo.idSelectGenerico = int.Parse(lector[0].ToString());
						modelo.Descripcion = lector[1].ToString();
						modelo.seleccionable = bool.Parse(lector[2].ToString());
						modelo.ruta = lector[3].ToString();
						lista.Add(modelo);
					}
				}
			}
			catch (Exception)
			{


			}


			return lista;
		}

		public List<SelectGenerico> lista_SelectGenericaSelect(string query, ref string mensaje)
		{
			mensaje = "";
			List<SelectGenerico> lista = new List<SelectGenerico>();
			SqlDataReader lector;

			try
			{
				using (SqlConnection conn = conexion(ref mensaje))
				{
					SqlCommand cmd = new SqlCommand();
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = query;
					cmd.Connection = conn;
					lector = cmd.ExecuteReader();

					SelectGenerico modelo;
					while (lector.Read())
					{
						modelo = new SelectGenerico();
						modelo.idSelectGenerico = int.Parse(lector[0].ToString());
						modelo.Descripcion = lector[1].ToString();
						modelo.seleccionable = bool.Parse(lector[2].ToString());
						lista.Add(modelo);
					}
				}
			}
			catch (Exception)
			{


			}


			return lista;
		}

        public List<SelectAUT_HEV> lista_SelectAutHev(string query, ref string mensaje)
        {
            mensaje = "";
            List<SelectAUT_HEV> lista = new List<SelectAUT_HEV>();
            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();

                    SelectAUT_HEV modelo;
                    while (lector.Read())
                    {
                        modelo = new SelectAUT_HEV();
                        modelo.id_queja = int.Parse(lector[0].ToString());
                        modelo.id_autoridad = int.Parse(lector[1].ToString());
                        modelo.id_hechov = int.Parse(lector[2].ToString());
                        modelo.id_linea = int.Parse(lector[3].ToString());
                        modelo.Version = int.Parse(lector[4].ToString());
                        modelo.Eliminado = int.Parse(lector[5].ToString());
                        lista.Add(modelo);
                    }
                }
            }
            catch (Exception)
            {


            }


            return lista;
        }

        public List< informacioncomplementariapeticionario> datoscomplementariospeticionario(string query, ref string mensaje)
		{
			mensaje = "";
			List<informacioncomplementariapeticionario> lista = new List<informacioncomplementariapeticionario>();
			SqlDataReader lector;

			try
			{
				using (SqlConnection conn = conexion(ref mensaje))
				{
					SqlCommand cmd = new SqlCommand();
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = query;
					cmd.Connection = conn;
					lector = cmd.ExecuteReader();
					informacioncomplementariapeticionario modelo;
					while (lector.Read())
					{
						lista.Add( new informacioncomplementariapeticionario(int.Parse(lector[0].ToString()), lector[1].ToString(), lector[2].ToString()));

					}
				}
			}
			catch (Exception)
			{


			}


			return lista;
		}

        public List<informacioncomplementariaautoridad> datoscomplementariosautoridad(string query, ref string mensaje)
        {
            mensaje = "";
            List < informacioncomplementariaautoridad >lista = new List<informacioncomplementariaautoridad>();
            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    informacioncomplementariaautoridad modelo;
                    while (lector.Read())
                    {
                        lista.Add(new informacioncomplementariaautoridad(int.Parse(lector[0].ToString()), lector[1].ToString(), lector[2].ToString()));

                    }
                }
            }
            catch (Exception)
            {
            }
            return lista;
        }

        public informacioncomplementaria datoscomplementarios(string query, ref string mensaje,string query1, string query2)
		{
			mensaje = "";
			informacioncomplementaria lista = new informacioncomplementaria();
			SqlDataReader lector;

			try
			{
				using (SqlConnection conn = conexion(ref mensaje))
				{
					SqlCommand cmd = new SqlCommand();
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = query;
					cmd.Connection = conn;
					lector = cmd.ExecuteReader();

					informacioncomplementaria modelo;
                   List< informacioncomplementariapeticionario> modelo1 = datoscomplementariospeticionario(query1,ref mensaje);
                   List< informacioncomplementariaautoridad> modelo2 = datoscomplementariosautoridad(query2, ref mensaje);
                    while (lector.Read())
					{
						lista = new informacioncomplementaria(int.Parse(lector[0].ToString()),int.Parse(lector[1].ToString()), lector[2].ToString(), lector[3].ToString(), int.Parse(lector[4].ToString()), int.Parse(lector[5].ToString()),modelo1,modelo2, int.Parse(lector[6].ToString()), int.Parse(lector[7].ToString()),lector[8].ToString(), 0,0,0,0,0,0);

					}

                   return lista;
				}
			}
			catch (Exception)
			{


			}


			return lista;
		}

        public informacioncomplementaria datoscomplementariosCalif(string query, ref string mensaje, string query1, string query2)
        {
            mensaje = "";
            informacioncomplementaria lista = new informacioncomplementaria();
            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();

                    informacioncomplementaria modelo;
                    List<informacioncomplementariapeticionario> modelo1 = datoscomplementariospeticionario(query1, ref mensaje);
                    List<informacioncomplementariaautoridad> modelo2 = datoscomplementariosautoridad(query2, ref mensaje);
                    while (lector.Read())
                    {
                        lista = new informacioncomplementaria(int.Parse(lector[0].ToString()), int.Parse(lector[1].ToString()), lector[2].ToString(), lector[3].ToString(), int.Parse(lector[4].ToString()), int.Parse(lector[5].ToString()), modelo1, modelo2, int.Parse(lector[6].ToString()), int.Parse(lector[7].ToString()), lector[8].ToString(),
                            lector[9] != DBNull.Value ? int.Parse(lector[9].ToString()) : 99,
    lector[10] != DBNull.Value ? int.Parse(lector[10].ToString()) : 99,
    lector[11] != DBNull.Value ? int.Parse(lector[11].ToString()) : 99,
    lector[12] != DBNull.Value ? int.Parse(lector[12].ToString()) : 99,
    lector[13] != DBNull.Value ? int.Parse(lector[13].ToString()) : 99,
    lector[14] != DBNull.Value ? int.Parse(lector[14].ToString()) : 99);
                    }

                    return lista;
                }
            }
            catch (Exception)
            {


            }


            return lista;
        }

        public List<espedientetema> datostemaExpediente(string query, ref string mensaje)
        {
            mensaje = "";
            List<espedientetema> lista = new List<espedientetema>();
            SqlDataReader lector;
            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    espedientetema modelo;
                    while (lector.Read())
                    {
                        modelo = new espedientetema(int.Parse(lector[0].ToString()), int.Parse(lector[1].ToString()), lector[2].ToString(), lector[3].ToString());
                        lista.Add(modelo);
                    }
                    return lista;
                }
            }
            catch (Exception)
            {
            }
            return lista;
        }

        public List<object> Disponibilidad_Usuario(string query, ref string mensaje)
        {
            mensaje = "";
            List<object> lista = new List<object>();
            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();

                    Usuarios modelo = new Usuarios();
                    while (lector.Read())
                    {
                        modelo.Activo = bool.Parse(lector[0].ToString());
                        modelo.Ocupado = Int32.Parse(lector[1].ToString());
                        lista.Add(modelo);
                    }
                }
            }
            catch (Exception)
            {

            }

            return lista;
        }

        public List<GeneralModel.Selectmaster> selectMaestro(string query, ref string mensaje)
        {
            mensaje = "";
            List<GeneralModel.Selectmaster> lista = new List<GeneralModel.Selectmaster>();
            SqlDataReader lector;
            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    lista = new List<GeneralModel.Selectmaster>();
                    GeneralModel.Selectmaster oSelectmaster;

                    while (lector.Read())
                    {
                        oSelectmaster = new GeneralModel.Selectmaster();
                        oSelectmaster.idSelect = int.Parse(lector[0].ToString());
                        oSelectmaster.Descripcion = lector[1].ToString();
                        lista.Add(oSelectmaster);
                    }
                }
            }
            catch (Exception)
            {
            }
            return lista;
        }

        public List<GeneralModel.SelecVisitaduria> selectVisitadurias(string query, ref string mensaje)
        {
            mensaje = "";
            List<GeneralModel.SelecVisitaduria> lista = new List<GeneralModel.SelecVisitaduria>();
            SqlDataReader lector;
            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    lista = new List<GeneralModel.SelecVisitaduria>();
                    GeneralModel.SelecVisitaduria oSelectmaster;

                    while (lector.Read())
                    {
                        oSelectmaster = new GeneralModel.SelecVisitaduria();
                        oSelectmaster.idSelect = int.Parse(lector[0].ToString());
                        oSelectmaster.Descripcion = lector[1].ToString();
                        oSelectmaster.idUserTitular = int.Parse(lector[2].ToString());
                        lista.Add(oSelectmaster);
                    }
                }
            }
            catch (Exception)
            {
            }
            return lista;
        }

        public EscritoModificado regresaEscritoInicial(int id, string query, ref string mensaje)
        {
            mensaje = "";
            EscritoModificado modelo = new EscritoModificado();

            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    string fechaN = "";
                    while (lector.Read())
                    {
                        modelo = new EscritoModificado(int.Parse(lector[0].ToString()), lector[1].ToString(), lector[2].ToString(), lector[3].ToString(), lector[4].ToString(), lector[5].ToString() + "<br>" + lector[6].ToString() + "<br>", lector[6].ToString());
                    };
                }
            }
            catch (Exception)
            {


            }
            return modelo;
        }

        public ActacModificado regresaActaCircunstanciada(int id, string query, ref string mensaje)
        {
            mensaje = "";
            ActacModificado modelo = new ActacModificado();

            SqlDataReader lector;

            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    while (lector.Read())
                    {
                        string[] arreglofechaI = lector[8].ToString().Split(' ');
                        string[] arregloHoraI = arreglofechaI[1].ToString().Split(':');
                        string[] arreglofechaH = lector[22].ToString().Split(' ');
                        string[] arregloHoraH = arreglofechaH[1].ToString().Split(':');
                        string[] arreglofechaT = lector[25].ToString().Split(' ');
                        string[] arregloHoraT = arreglofechaT[1].Split(':');


                        int Id = int.Parse(lector[0].ToString());
                        string Lugar = lector[1].ToString();
                        int DiaFecha = int.Parse(lector[2].ToString());
                        string Mes = lector[3].ToString();
                        string Anio = lector[4].ToString();
                        string NomAbogado = lector[5].ToString();
                        string PuestoAbogado = lector[6].ToString();
                        string AreaAbogado = lector[7].ToString();
                        TimeOnly HoraInicio = new TimeOnly(int.Parse(arregloHoraI[0]), int.Parse(arregloHoraI[1]));
                        string Ubicacion = lector[9].ToString();
                        string NombrePet = lector[10].ToString();
                        string consentiemiento = lector[11].ToString();
                        string OrigenPet = lector[12].ToString();
                        int EdadPet = int.Parse(lector[13].ToString());
                        string CallePet = lector[14].ToString();
                        string NumextPet = lector[15].ToString();
                        string CpPet = lector[16].ToString();
                        string ColoniaPet = lector[17].ToString();
                        string MunicipioPet = lector[18].ToString();
                        string OcupacionPet = lector[19].ToString();
                        string TelPet = lector[20].ToString();
                        string CorreoPet = lector[21].ToString();
                        string FechaHechos = arreglofechaH[0].ToString();
                        TimeOnly HoraHechos = new TimeOnly(int.Parse(arregloHoraH[0]), int.Parse(arregloHoraH[1]));
                        string UbiHechos = lector[23].ToString();
                        string Hechos = lector[24].ToString();
                        TimeOnly HoraTermino = new TimeOnly(int.Parse(arregloHoraT[0]), int.Parse(arregloHoraT[1]));
                        /*Datos Faltantes*/
                        string sabeLeer = "";
                        string escolaridadPet = "";
                        string EstadoPet = "";
                        string IdenttificacionPet = "";
                        string OrigenPetExt = lector[27].ToString() + '-' + lector[28].ToString();
                        string ComplementoPetExt = lector[28].ToString();
                        int id_pet = int.Parse(lector[31].ToString());
                        int id_complementopet = int.Parse(lector[32].ToString());
                        DateTime fechaActual = DateTime.Now;
                        /*Datos Faltantes*/

                        modelo = new ActacModificado(Id, Lugar, DiaFecha, Mes, Anio, NomAbogado, PuestoAbogado, AreaAbogado, HoraInicio, Ubicacion, NombrePet, consentiemiento, OrigenPet,
                                                    EdadPet, sabeLeer, escolaridadPet, CallePet, NumextPet, CpPet, ColoniaPet, MunicipioPet, EstadoPet, OcupacionPet, TelPet,
                                                    CorreoPet, IdenttificacionPet, FechaHechos, HoraHechos, UbiHechos, Hechos, HoraTermino, OrigenPetExt, ComplementoPetExt, id_pet, id_complementopet, fechaActual);
                    };
                }
            }
            catch (Exception)
            {


            }

            return modelo;
        }

        public string ObtenerReader(string query)
        {
            string mensaje = "";
            string resultado = "";
            using (SqlConnection conn = conexion(ref mensaje))
            {
                SqlCommand command = new SqlCommand();
                command.CommandText = query;
                command.Connection = conn;
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        resultado = reader[0].ToString();

                    }

                }
            }

            return resultado;

        }

        public List<SelectAUT_HEV> SelectAutHec(string query, ref string mensaje)
        {
            mensaje = "";
            List<SelectAUT_HEV> lista = new List<SelectAUT_HEV>();
            SqlDataReader lector;
            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    SelectAUT_HEV modelo;
                    while (lector.Read())
                    {//int id_queja, int id_autoridad, int id_hechov, int id_linea, int Version, int Eliminado, int tipo
                        modelo = new SelectAUT_HEV(int.Parse(lector[0].ToString()), int.Parse(lector[1].ToString()), int.Parse(lector[2].ToString()), int.Parse(lector[3].ToString()), int.Parse(lector[4].ToString()), int.Parse(lector[5].ToString()), int.Parse(lector[6].ToString()));
                        lista.Add(modelo);
                    }
                    return lista;
                }
            }
            catch (Exception)
            {
            }
            return lista;
        }


        public List<inforaportaciones> Obtaport(string query, ref string mensaje)
        {
            mensaje = "";
            List<inforaportaciones> lista = new List<inforaportaciones>();
            SqlDataReader lector;
            try
            {
                using (SqlConnection conn = conexion(ref mensaje))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = query;
                    cmd.Connection = conn;
                    lector = cmd.ExecuteReader();
                    inforaportaciones modelo;
                    while (lector.Read())
                    {
                        modelo = new inforaportaciones(int.Parse(lector[0].ToString()), int.Parse(lector[1].ToString()), int.Parse(lector[2].ToString()), lector[3].ToString(), lector[4].ToString());
                        lista.Add(modelo);
                    }
                    return lista;
                }
            }
            catch (Exception)
            {
            }
            return lista;
        }
    }
}
