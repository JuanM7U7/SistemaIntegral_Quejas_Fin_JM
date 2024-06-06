using SistemaIntegralQuejas.SubscribeTableDependencies;

namespace SistemaIntegralQuejas.MiddlewareExtensions
{
    public static class AplicationBuilderExtension
    {
        public static void UseTableDependency<T>(this IApplicationBuilder applicationBuilder, string connectionStrig)
            where T : ISubscribeTableDependency
        {
            var serviceProvider = applicationBuilder.ApplicationServices;
            var service = serviceProvider.GetService<T>();
            service?.SubscribeTableDependency(connectionStrig);
        }
    }
}
