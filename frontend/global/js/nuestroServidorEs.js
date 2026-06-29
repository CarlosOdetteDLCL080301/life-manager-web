/*
Esto es un archivo de configuración para determinar la URL base de la API según el entorno en el que se esté ejecutando la aplicación. Si se está ejecutando en localhost, se utilizará la URL de desarrollo (Uvicorn), de lo contrario, se utilizará la URL del servidor de producción.
Ahorrando en todos los JS, se puede cambiar la URL de la API en un solo lugar sin tener que modificar múltiples archivos.
*/
/**
 * Retorna la URL base de la API según el entorno actual.
 */
export function getApiUrl(endpoint) {
    const isLocalhost = ["127.0.0.1", "localhost", ""].includes(window.location.hostname);
    
    //const baseUrl = isLocalhost 
    //    ? "http://127.0.0.1:8000" 
    //    : "https://odette.admimpulsa.com.mx/api";
    const baseUrl = isLocalhost 
        ? "http://127.0.0.1:8000" 
        : "http://127.0.0.1:8000";
        
    console.log(`Usando la URL de la API2: ${baseUrl}${endpoint}`);
    return `${baseUrl}${endpoint}`;
}