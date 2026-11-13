import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  // Envía la cookie accessToken en cada petición; sin esto el backend responde 401
  withCredentials: true,
});

api.interceptors.response.use(
  // El backend responde { message, data, status }: devolvemos ese objeto directo
  (response) => response.data,
  // Si falla, lanzamos el mensaje que manda el backend y conservamos el código HTTP en error.status
  (error) => {
    const mensaje = error.response?.data?.message || 'No se pudo conectar con el servidor';
    const errorApi = new Error(mensaje);
    errorApi.status = error.response?.status;

    // Si el backend rechazó un formulario, también manda qué falló en cada campo (ej: "El dígito verificador del rut no es válido")
    const detalles = error.response?.data?.errorDetails;
    errorApi.detalles = Array.isArray(detalles) ? detalles.map((detalle) => detalle.message || detalle.mensaje) : [];

    return Promise.reject(errorApi);
  }
);

export default api;