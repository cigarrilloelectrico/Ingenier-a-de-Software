const { mockAvisos, mockObjetos } = require('../../mockData');

const calcularCoincidencias = (idObjetoEncontrado) => {
  const objeto = mockObjetos.find(obj => obj.id === idObjetoEncontrado);
  if (!objeto) throw new Error('Objeto no encontrado en el inventario');

  // Convertimos la fecha de hallazgo una sola vez para optimizar
  const fechaHallazgo = new Date(objeto.fecha_hallazgo);

  // 1. Filtro estricto: Solo avisos activos cuya fecha de pérdida no sea en el futuro respecto al hallazgo
  const avisosValidos = mockAvisos.filter(aviso => {
    if (aviso.estado !== 'publicado') return false;
    const fechaPerdida = new Date(aviso.fecha_perdida);
    return fechaPerdida <= fechaHallazgo; // No puede perderse después de ser encontrado
  });

  // 2. Sistema de Scoring (Max 100 pts)
  const resultados = avisosValidos.map(aviso => {
    let score = 0;
    
    // Ponderación 1: Tipo de Objeto (35 Puntos)
    if (aviso.id_tipo_objeto === objeto.id_tipo_objeto) {
      score += 35;
    }

    // Ponderación 2: Sede de Hallazgo (25 Puntos)
    if (aviso.id_sede === objeto.id_sede) {
      score += 25;
    }

    // Ponderación 3: Color (15 Puntos)
    // Usamos toLowerCase() para evitar errores por mayúsculas/minúsculas
    if (aviso.color.toLowerCase() === objeto.color.toLowerCase()) {
      score += 15;
    }

    // Ponderación 4: Proximidad de Fecha (25 Puntos escalonados)
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

  // 3. Ordenar de mayor a menor y truncar a 20 resultados
  return resultados
    .sort((a, b) => b.porcentaje_match - a.porcentaje_match)
    .slice(0, 20);
};

module.exports = { calcularCoincidencias };