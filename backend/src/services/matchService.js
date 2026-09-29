import { mockAvisos, mockObjetos } from '../../mockData.js';

const calcularCoincidencias = (idObjetoEncontrado) => {
  const objeto = mockObjetos.find(obj => obj.id === idObjetoEncontrado);
  if (!objeto) throw new Error('Objeto no encontrado en el inventario');

  const fechaHallazgo = new Date(objeto.fecha_hallazgo);

  // Filtro estricto de avisos
  const avisosValidos = mockAvisos.filter(aviso => {
    if (aviso.estado !== 'publicado') return false;
    const fechaPerdida = new Date(aviso.fecha_perdida);
    return fechaPerdida <= fechaHallazgo;
  });

  // Sistema de Score (100 pts)
  const resultados = avisosValidos.map(aviso => {
    let score = 0;
    
    // Tipo de Objeto (35 Puntos)
    if (aviso.id_tipo_objeto === objeto.id_tipo_objeto) {
      score += 35;
    }

    // Sede de Hallazgo (25 Puntos)
    if (aviso.id_sede === objeto.id_sede) {
      score += 25;
    }

    // Color (15 Puntos)
    if (aviso.color.toLowerCase() === objeto.color.toLowerCase()) {
      score += 15;
    }

    // Proximidad de Fecha (25, 15, 5 Puntos)
    const fechaPerdida = new Date(aviso.fecha_perdida);
    const diferenciaMilisegundos = Math.abs(fechaHallazgo - fechaPerdida);
    const diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
      score += 25; // Mismo día
    } else if (diferenciaDias <= 3) {
      score += 15; // Entre 1 y 3 días
    } else {
      score += 5;  // Más de 3 días
    }

    return { 
      aviso_id: aviso.id, 
      porcentaje_match: score,
      detalles: aviso 
    };
  });

  // Ordenar de mayor a menor y limitar a los 20 resultados
  return resultados
    .sort((a, b) => b.porcentaje_match - a.porcentaje_match)
    .slice(0, 20);
};

export { calcularCoincidencias };