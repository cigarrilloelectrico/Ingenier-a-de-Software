import api from './root.service';

export async function obtenerTiposObjeto() {
  const response = await api.get('/tipos-objeto');
  return response.data;
}

export async function obtenerRecintos() {
  const response = await api.get('/recintos');
  return response.data;
}

export async function registrarObjeto(formData) {
  const response = await api.post('/inventario', formData);
  return response.data;
}