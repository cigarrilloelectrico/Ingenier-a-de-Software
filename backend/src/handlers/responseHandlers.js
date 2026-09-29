/**
 * @brief Función para manejar respuestas exitosas en la API.
 *        Envía una respuesta JSON con el mensaje y los datos proporcionados.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {number} statusCode - Código de estado HTTP de la respuesta.
 * @param {string} message - Mensaje que se enviará en la respuesta.
 * @param {Object|null} [data=null] - Datos adicionales que se enviarán en la respuesta.
 * @return {void} - Envía la respuesta con los datos y el estado de éxito.
 */
export const handleSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    message,
    data,
    status: "Success",
  });
};

/**
 * @brief Función para manejar errores del cliente en la API.
 *        Envía una respuesta JSON con el mensaje de error y detalles adicionales, si los hay.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {number} statusCode - Código de estado HTTP de la respuesta.
 * @param {string} message - Mensaje de error que se enviará en la respuesta.
 * @param {Object|null} [errorDetails=null] - Detalles del error que se enviarán en la respuesta.
 * @return {void} - Envía la respuesta con el mensaje de error y los detalles del cliente.
 */
export const handleErrorClient = (res, statusCode, message, errorDetails = null) => {
  res.status(statusCode).json({
    message,
    errorDetails,
    status: "Client error",
  });
};

/**
 * @brief Función para manejar errores del servidor en la API.
 *        Registra el error completo en la consola y envía al cliente solo el mensaje:
 *        los detalles internos (stack, SQL, rutas) no deben salir del servidor.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {number} statusCode - Código de estado HTTP de la respuesta.
 * @param {string} message - Mensaje de error que se enviará en la respuesta.
 * @param {Object|null} [errorDetails=null] - Detalles del error que se registrarán en la consola.
 * @return {void} - Envía la respuesta con el mensaje de error del servidor.
 */
export const handleErrorServer = (res, statusCode, message, errorDetails = null) => {
  console.error("Server Error:", message, errorDetails);
  res.status(statusCode).json({
    message,
    errorDetails: null,
    status: "Server error",
  });
};
