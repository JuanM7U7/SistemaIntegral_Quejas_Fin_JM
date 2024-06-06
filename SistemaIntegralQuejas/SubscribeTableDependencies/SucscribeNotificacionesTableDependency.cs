using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.Models;
using TableDependency.SqlClient;
using TableDependency.SqlClient.Base.EventArgs;

namespace SistemaIntegralQuejas.SubscribeTableDependencies
{
    public class SucscribeNotificacionesTableDependency : ISubscribeTableDependency
    {
        SqlTableDependency<Notificaciones> tableDependency;
        LayoutHub notificationHub;

        public SucscribeNotificacionesTableDependency(LayoutHub notificationHub)
        {
            this.notificationHub = notificationHub;
        }

        public void SubscribeTableDependency(string connectionstring)
        {
            tableDependency = new SqlTableDependency<Notificaciones>(connectionstring);
            tableDependency.OnChanged += Tabledependency_OnChanged;
            tableDependency.OnError += TableDependency_OnError;
            tableDependency.Start();
        }

        private void TableDependency_OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"{nameof(Notificaciones)} SqlDependency error: {e.Error.Message}");
        }

        private async void Tabledependency_OnChanged(object sender, RecordChangedEventArgs<Notificaciones> e)
        {
            if (e.ChangeType != TableDependency.SqlClient.Base.Enums.ChangeType.None)
            {
                // Botón activar turnos pendientes
                //await notificationHub.ActivarBotonTomarTurno();
                // Fin botón activar turnos pendientes

                var notification = e.Entity;

                if (notification.MessageType == "All")
                {
                     await notificationHub.EnviarNotificacionTodos(notification.Message);
                }
                else if (notification.MessageType == "Personal")
                
                {
                     //await notificationHub.EnviarNotificacionPersonal(notification.Message, notification.Username);
                }
                else if (notification.MessageType == "Grupo")
                {
                     await notificationHub.EnviarNotificacionGrupo(notification.Message, notification.Grupo);
                }
            }
        }
    }
}
