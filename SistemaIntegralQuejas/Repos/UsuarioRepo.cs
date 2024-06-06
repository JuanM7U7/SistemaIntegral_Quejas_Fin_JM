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
    public class UsuarioRepo
    {
        string connectionString = "";

        public UsuarioRepo(string connectionString)
        {
            this.connectionString = connectionString;
        }

        // Guardar conexion de hub
        bool usuarioGuardado = false;
        public bool GuardarConexionUsuario(string conexionId, string usuario, string grupo, string hub)
        {
            string queryDelete = "exec Sp_EliminaHub_Duplicado '" + usuario + "','" + hub + "'";
            string query = "exec Sp_Guardar_Conexion_User '" + conexionId + "','" + usuario + "','" + grupo + "', '" + hub + "'";
            try
            {
                ejecutaconsulta(queryDelete);
                ejecutaconsulta(query);

                usuarioGuardado = true;

            }
            catch (Exception ex)
            {

                usuarioGuardado = false;
            }
            return usuarioGuardado;
        }

        public void EliminaConexionHubUser(string conexionId, string username)
        {
            string query = "DELETE FROM HubConnection WHERE ConnectionId = '" + conexionId + "'";
            //string queryDesconectar = "UPDATE USUARIOS SET ACTIVO = 0, OCUPADO = 0 WHERE USUARIO = " + "'" + username + "'" ;
            try
            {
                ejecutaconsulta(query);
                //ejecutaconsulta(queryDesconectar);

            }
            catch (Exception ex)
            {
                throw;
            }

        }

        // TURNOS EN CURSO
        public List<HubConnection> GetHubUser(string usuario, string hub)
        {
            List<HubConnection> hubUserContenedor = new List<HubConnection>();
            var query = "Sp_Buscar_Usuario_HubConexion";

            var data = ConexionUsuario(query, usuario, hub);

            foreach (DataRow row in data.Rows)
            {
                HubConnection hubuser = new HubConnection();
                hubuser.ConnectionId = row["ConnectionId"].ToString();

                hubUserContenedor.Add(hubuser);

            }

            return hubUserContenedor;
        }

        public List<HubConnection> GetHubUserAllExcept(string usuario, string hub)
        {
            List<HubConnection> hubUserContenedor = new List<HubConnection>();
            var query = "Sp_EnviarMsgDqotAllExcept " + "'"+ usuario +"'," + "'"+ hub +"'";

            var data = ConexionUsuario(query, usuario, hub);

            foreach (DataRow row in data.Rows)
            {
                HubConnection hubuser = new HubConnection();
                hubuser.ConnectionId = row["ConnectionId"].ToString();

                hubUserContenedor.Add(hubuser);

            }

            return hubUserContenedor;
        }

        // UsuariosActivos 
        public List<Usuarios> GetUsuariosActivos()
        {
            List<Usuarios> usuarios = new List<Usuarios>();
            var queryUsers = "EXEC Sp_Ver_UsuariosActivos_Dqot"; 

            var data = GetDatosGeneral(queryUsers);

            foreach (DataRow row in data.Rows)
            {
                Usuarios itemUser = new Usuarios();
                itemUser.IdUsuario = Convert.ToInt32(row["ID_USUARIO"]);
                itemUser.Usuario1 = (row["USUARIO"]).ToString();

                usuarios.Add(itemUser);
            }

            return usuarios;
        }

        public List<HubConnection> ContadorUsuariosGrupo(string grupo)
        {
            List<HubConnection> usuarios = new List<HubConnection>();
            var queryUsers = "EXEC Sp_Contador_Usuarios_GrupoHub " + "'" + grupo + "'";

            var data = GetDatosGeneral(queryUsers);

            foreach (DataRow row in data.Rows)
            {
                HubConnection itemUser = new HubConnection();
                itemUser.ConnectionId = (row["ConnectionId"]).ToString();
                itemUser.Username = (row["Username"]).ToString();
                itemUser.Grupo = (row["Grupo"]).ToString();

                usuarios.Add(itemUser);
            }

            return usuarios;
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

                    using (SqlCommand command = new SqlCommand(query, connection))
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
                    connection.Close();
                    throw;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        private DataTable ConexionUsuario(string query, string usuario, string hub)
        {
            DataTable dt = new DataTable();

            using (SqlConnection c = new SqlConnection(connectionString))
            {
                using (SqlDataAdapter sda = new SqlDataAdapter(query, c))
                {
                    sda.SelectCommand.CommandType = CommandType.StoredProcedure;

                    sda.SelectCommand.Parameters.AddWithValue("@user", usuario);
                    sda.SelectCommand.Parameters.AddWithValue("@hub", hub);

                    sda.Fill(dt);
                }
            }

            return dt;
        }


    }

}
