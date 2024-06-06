using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.Models;
using TableDependency.SqlClient.Base.EventArgs;
using TableDependency.SqlClient;

namespace SistemaIntegralQuejas.SubscribeTableDependencies
{
    public class SucscribeUsuariosTableDependency : ISubscribeTableDependency
    {
        SqlTableDependency<Usuarios> tableDependency;
        LayoutHub notificationHub;

        public SucscribeUsuariosTableDependency(LayoutHub notificationHub)
        {
            this.notificationHub = notificationHub;
        }

        public void SubscribeTableDependency(string connectionstring)
        {
            tableDependency = new SqlTableDependency<Usuarios>(connectionstring);
            tableDependency.OnChanged += Tabledependency_OnChanged;
            tableDependency.OnError += TableDependency_OnError;
            tableDependency.Start();
        }

        private void TableDependency_OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"{nameof(Usuarios)} SqlDependency usuario error: {e.Error.Message}");
        }

        private async void Tabledependency_OnChanged(object sender, RecordChangedEventArgs<Usuarios> e)
        {
            if (e.ChangeType != TableDependency.SqlClient.Base.Enums.ChangeType.None)
            {
                //var user = e.Entity;

                await notificationHub.Verificar_UsuariosConectados();

                //if (user.Activo == true && user.Ocupado == 2)
                //{
                //    await notificationHub.DesabilitarCambioStatus(user.Usuario1);
                //}
            }
        }
    }
}
