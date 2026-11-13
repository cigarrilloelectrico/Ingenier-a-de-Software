import api from './api';

export async function obtenerTiposObjeto() {
  const response = await api.get('/tipos-objeto');
  return response;
}

export async function obtenerRecintos() {
  const response = await api.get('/recintos');
  return response;
}

export async function registrarObjeto(formData) {
  const response = await api.post('/inventario', formData);
  return response;
}