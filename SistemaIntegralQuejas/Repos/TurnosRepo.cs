using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SistemaIntegralQuejas.Models;
using System.Data;
using System.Data.Common;
using System.Drawing;
using System.Text.RegularExpressions;

namespace SistemaIntegralQuejas.Repos
{
    public class TurnosRepo
    {
        string connectionString = "";

        public TurnosRepo(string connectionString)
        {
            this.connectionString = connectionString;
        }

        // Obtener Turnos Pedientes 
        public List<TurnoModificado> GetTurnos()
        {
            List<TurnoModificado> turnos = new List<TurnoModificado>();
            var query = "EXEC Sp_Turnos_Pendientes";

            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turno = new TurnoModificado();
                turno.IdTurno = Convert.ToInt32(row["ID_TURNO"]);
                turno.NumTurno = Convert.ToInt32(row["NUM_TURNO"]);
                turno.Estado = Convert.ToInt32(row["ESTADO"]);
                turno.IdRegistro = Convert.ToInt32(row["ID_REGISTRO"]);
                turno.FECHA_HORA_RECEPCION = Convert.ToDateTime(row["FECHA_VISITA"]);

                turnos.Add(turno);

            }

            return turnos;
        }

        // Tabla turnos administrador

        public List<TurnoModificado> GetTurnosAdmin()
        {
            List<TurnoModificado> turnosadm = new List<TurnoModificado>();
            List<Usuarios> user_abogadosvaq = new List<Usuarios>();

            var query = "EXEC Sp_Turnos_Admindqot";
            var queryUsuarioQuejas = "EXEC Sp_Get_AbogadosDQOT";

            var data = GetDatosGeneral(query);
            var data_abog_dqot = GetDatosGeneral(queryUsuarioQuejas);

            foreach (DataRow row in data_abog_dqot.Rows)
            {
                Usuarios usersvadqot = new Usuarios();
                usersvadqot.IdUsuario = Convert.ToInt32(row["ID_USUARIO"]);
                usersvadqot.Nombre = (row["NOM_ABOGADO_DQOT"]).ToString();
                usersvadqot.Activo = bool.Parse(row["ACTIVO"].ToString());
                usersvadqot.Ocupado = Int32.Parse(row["OCUPADO"].ToString());
                usersvadqot.Usuario1 = (row["USUARIO"]).ToString();
                user_abogadosvaq.Add(usersvadqot);
            }


            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turnoa = new TurnoModificado();
                turnoa.ID_TURNO = Convert.ToInt32(row["ID_TURNO"]);
                turnoa.NUM_TURNO = Convert.ToInt32(row["NUM_TURNO"]);
                turnoa.FECHA_INICIO = Convert.ToDateTime(row["FECHA_INICIO"]);
                turnoa.FECHA_FIN = Convert.ToDateTime(row["FECHA_FIN"]);
                turnoa.ID_ABOGADO = Convert.ToInt32(row["ID_ABOGADO"]);
                turnoa.USER = (row["NOM_ABOGADO"]).ToString();
                turnoa.NOM_ABOGADOS = user_abogadosvaq;
                turnoa.ID_MODULO = Convert.ToInt32(row["ID_MODULO"]);
                turnoa.NOMBRE_MODULO = (row["NOMBRE_MODULO"]).ToString();
                turnoa.STATUS_TURNO_TXT = (row["STATUS_TURNO_TXT"]).ToString();
                turnoa.ID_REGISTRO = Convert.ToInt32(row["ID_REGISTRO"]);
                turnoa.FECHA_HORA_RECEPCION = Convert.ToDateTime(row["FECHA_VISITA"]);
                turnoa.FECHA_HORA_TOMA_ATN = Convert.ToDateTime(row["FECHA_HORA_TOMA_ATN"]);

                turnosadm.Add(turnoa);

            }

            return turnosadm;

        }
         
        // Turnos Administradores DQOT con filtros
        public List<TurnoModificado> GetTurnosAdmin_Filtros(int status, string fechainicio, string fechafin)
        {
            List<TurnoModificado> turnosadm = new List<TurnoModificado>();
            List<Usuarios> user_abogadosvaq = new List<Usuarios>();

            var query = "EXEC Sp_FiltrosTurnos_Admindqot " + "" + status + "," + "'" + fechainicio + "'," + "'" + fechafin + "'";
            var queryUsuarioQuejas = "EXEC Sp_Get_AbogadosDQOT";

            var data = GetDatosGeneral(query);
            var data_abog_dqot = GetDatosGeneral(queryUsuarioQuejas);

            foreach (DataRow row in data_abog_dqot.Rows)
            {
                Usuarios usersvadqot = new Usuarios();
                usersvadqot.IdUsuario = Convert.ToInt32(row["ID_USUARIO"]);
                usersvadqot.Nombre = (row["NOM_ABOGADO_DQOT"]).ToString();
                usersvadqot.Activo = bool.Parse(row["ACTIVO"].ToString());
                usersvadqot.Ocupado = Int32.Parse(row["OCUPADO"].ToString());
                usersvadqot.Usuario1 = (row["USUARIO"]).ToString();
                user_abogadosvaq.Add(usersvadqot);
            }


            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turnoa = new TurnoModificado();
                turnoa.ID_TURNO = Convert.ToInt32(row["ID_TURNO"]);
                turnoa.NUM_TURNO = Convert.ToInt32(row["NUM_TURNO"]);
                turnoa.FECHA_INICIO = Convert.ToDateTime(row["FECHA_INICIO"]);
                turnoa.FECHA_FIN = Convert.ToDateTime(row["FECHA_FIN"]);
                turnoa.ID_ABOGADO = Convert.ToInt32(row["ID_ABOGADO"]);
                turnoa.USER = (row["NOM_ABOGADO"]).ToString();
                turnoa.NOM_ABOGADOS = user_abogadosvaq;
                turnoa.ID_MODULO = Convert.ToInt32(row["ID_MODULO"]);
                turnoa.NOMBRE_MODULO = (row["NOMBRE_MODULO"]).ToString();
                turnoa.STATUS_TURNO_TXT = (row["STATUS_TURNO_TXT"]).ToString();
                turnoa.ID_REGISTRO = Convert.ToInt32(row["ID_REGISTRO"]);
                turnoa.FECHA_HORA_RECEPCION = Convert.ToDateTime(row["FECHA_VISITA"]);
                turnoa.FECHA_HORA_TOMA_ATN = Convert.ToDateTime(row["FECHA_HORA_TOMA_ATN"]);

                turnosadm.Add(turnoa);

            }

            return turnosadm;

        }

        public List<HubConnection> GetStatusAbogadoReasignado(string username)
        {
            List<HubConnection> HubConnections = new List<HubConnection>();
            var queryUsuarioQuejas = "SELECT * FROM HubConnection WHERE Hub = 'layoutHub' AND Username = " + "'" + username  + "'" ;

            var data_abog_dqot = GetDatosGeneral(queryUsuarioQuejas);

            foreach (DataRow row in data_abog_dqot.Rows)
            {
                HubConnection userItem = new HubConnection();

                userItem.Id = Int32.Parse(row["Id"].ToString());
                userItem.Username = (row["Username"]).ToString();

                HubConnections.Add(userItem);
            }

            return HubConnections;

        }

        public List<RegRecepcion> GetPeticionarioRepo(int idPeticionario)
        {
            List<RegRecepcion> user_abogadosvaq = new List<RegRecepcion>();

            var queryUsuarioQuejas = "SELECT * FROM REG_RECEPCION WHERE ID_REGISTRO = " + idPeticionario;

            var data_abog_dqot = GetDatosGeneral(queryUsuarioQuejas);

            foreach (DataRow row in data_abog_dqot.Rows)
            {
                RegRecepcion peticionarioItem = new RegRecepcion();
                peticionarioItem.IdRegistro = Int32.Parse(row["ID_REGISTRO"].ToString());
                peticionarioItem.Nombre = (row["NOMBRE"]).ToString();
                peticionarioItem.ApellidoPat = (row["APELLIDO_PAT"]).ToString();
                peticionarioItem.ApellidoMat = (row["APELLIDO_MAT"]).ToString();
                peticionarioItem.Procedencia = (row["PROCEDENCIA"]).ToString();
                peticionarioItem.DocIdentificatorio = (row["DOC_IDENTIFICATORIO"]).ToString();
                user_abogadosvaq.Add(peticionarioItem);
            }

            return user_abogadosvaq;

        }

        public List<TurnoModificado> GetTurnosxUser(string username, int estado)
        {
            List<TurnoModificado> turnos = new List<TurnoModificado>();
            var query = "EXEC Sp_Turnos_PendientesxUsuario " + "'" + username + "',"
                                                             + "" + estado + "";

            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turno = new TurnoModificado();
                turno.ID_TURNO = Convert.ToInt32(row["ID_TURNO"]);
                turno.NUM_TURNO = Convert.ToInt32(row["NUM_TURNO"]);
                turno.Estado = Convert.ToInt32(row["ESTADO"]);
                turno.ID_REGISTRO = Convert.ToInt32(row["ID_REGISTRO"]);
                turno.IdAbogadoAtendio = Int32.Parse(row["ID_ABOGADO_ATENDIO"].ToString());
                turno.FECHA_HORA_RECEPCION = Convert.ToDateTime(row["FECHA_VISITA"]);
                turno.FechaHoraTerminaAtencion = Convert.ToDateTime(row["FECHA_HORA_TERMINA_ATENCION"]);
                turno.FECHA_HORA_TOMA_ATN = Convert.ToDateTime(row["FECHA_HORA_TOMA_ATN"]);


                turnos.Add(turno);

            }

            return turnos;
        }

        // Busqueda con filtros
        public List<TurnoModificado> GetTurnos_Filtros(string username, int estado, string fechainicio, string fechafin)
        {
            List<TurnoModificado> turnos = new List<TurnoModificado>();
            var query = "EXEC Sp_FiltroTurnos " + "'" + username + "',"
                                                      + "" + estado + ","
                                                      + "'" + fechainicio + "',"
                                                      + "'" + fechafin + "'";
                                                      
            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turno = new TurnoModificado();
                turno.ID_TURNO = Convert.ToInt32(row["ID_TURNO"]);
                turno.NUM_TURNO = Convert.ToInt32(row["NUM_TURNO"]);
                turno.Estado = Convert.ToInt32(row["ESTADO"]);
                turno.ID_REGISTRO = Convert.ToInt32(row["ID_REGISTRO"]);
                turno.IdAbogadoAtendio = Int32.Parse(row["ID_ABOGADO_ATENDIO"].ToString());
                turno.FECHA_HORA_RECEPCION = Convert.ToDateTime(row["FECHA_VISITA"]);
                turno.FechaHoraTerminaAtencion = Convert.ToDateTime(row["FECHA_HORA_TERMINA_ATENCION"]);
                turno.FECHA_HORA_TOMA_ATN = Convert.ToDateTime(row["FECHA_HORA_TOMA_ATN"]);


                turnos.Add(turno);

            }

            return turnos;
        }
        // Obtener modulos disponibles
        public List<Moduloatenciondqot> GetModulosDisponibles()
        {
            List<Moduloatenciondqot> modulos = new List<Moduloatenciondqot>();
            var query = "EXEC Sp_Mostrar_Modulos_Disponibles";

            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                Moduloatenciondqot modulo = new Moduloatenciondqot();
                modulo.IdModuloDqot = Convert.ToInt32(row["idModuloDqot"]);
                modulo.NombreModulo = (row["nombreModulo"]).ToString();
                modulo.StatusDisponible = Convert.ToInt32(row["STATUS_DISPONIBLE"]);
                modulos.Add(modulo);

            }

            return modulos;
        }

        // Asignar turno

        bool turno_asignado = false;
        public bool Re_AsignarTurno(int idturno, int idUser,string username)
        {
            string query = "exec Sp_Asignar_Turno " +
                            "" + idturno + "," +
                            "" + idUser + "," +
                            "'" + username + "'";

            string queryUser = "exec Sp_Usuario_Ocupado " +
                            "" + idUser + "";

            ejecutaconsulta(query);
            ejecutaconsulta(queryUser);

            turno_asignado = true;

            return turno_asignado;
        }

        // Atendiendo turno

        bool editmodulo = false;
        public bool UpdateModuloSeleccionado(int idturno, int idmodulo, int iduser, string username)
        {

            string query = "exec Sp_Update_Status_ModuloDQOT " +
                            "" + idmodulo + "," +
                            "" + idturno + "," + 
                            "'" + username + "'";

            string querydos = "exec Sp_Update_Status_ModulodisDQOT " +
                            "" + idmodulo + "";

            string queryUserOcupado = "exec Update_Usuario_Ocupado " +
                        "" + iduser + "";

            try
            {
                ejecutaconsulta(query);
                ejecutaconsulta(querydos);
                ejecutaconsulta(queryUserOcupado);

                editmodulo = true;

            }
            catch (Exception ex)
            { 
                editmodulo = false;
            }

            return editmodulo;
        }

        // TURNOS EN CURSO 
        public List<TurnoModificado> GetTurnosEnCursoxUser(string iduser)
        {
            List<TurnoModificado> turnosA = new List<TurnoModificado>();
            var query = "EXEC Sp_TurnoAtendiendoxUser " + "" + iduser + "";

            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turno = new TurnoModificado();
                turno.IdTurno = Convert.ToInt32(row["ID_TURNO"]);
                turno.NumTurno = Convert.ToInt32(row["NUM_TURNO"]);
                turno.FkIdModulo = Convert.ToInt32(row["FK_ID_MODULO"]);

                turnosA.Add(turno);

            }

            return turnosA;
        }

        // Dibujar tabla TV DQOT (Turnos atendiendo)

        public List<TurnoModificado> GetTurnosAtendiendo()
        {
            List<TurnoModificado> turnosA = new List<TurnoModificado>();
            var query = "EXEC Sp_Turnos_Atendiendo";

            var data = GetDatosGeneral(query);
             
            foreach (DataRow row in data.Rows)
            {
                TurnoModificado turno = new TurnoModificado();
                turno.IdTurno = Convert.ToInt32(row["ID_TURNO"]);
                turno.NumTurno = Convert.ToInt32(row["NUM_TURNO"]);
                turno.NOMBRE_ABG_ATENDIENDO = row["NOMBREA"].ToString();
                turno.FkIdModulo = Convert.ToInt32(row["FK_ID_MODULO"]);

                turnosA.Add(turno);

            }

            return turnosA;
        }

        // Metodos generales
        private void ejecutaconsulta(string query)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand cmdmodul = new SqlCommand(query, connection))
                    {
                        cmdmodul.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {

                    connection.Close();
                }

            }
        }

        private DataTable GetDatosGeneral(string query)
        {

            DataTable dataTable = new DataTable();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query,connection))
                    {
                       
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            dataTable.Load(reader);
                        }
                    }

                    return dataTable;
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    connection.Close();
                }
            }
        }
    }
}
