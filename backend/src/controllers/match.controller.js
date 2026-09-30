import { calcularCoincidencias } from '../services/match.service.js';
import { handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export const getMatches = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { objetoBuscado, resultados } = await calcularCoincidencias(targetId);

    res.status(200).json({
      success: true,
      objetoConsultado: objetoBuscado,
      totalResultados: resultados.length,
      data: resultados,
    });
  } catch (error) {
    if (error.statusCode) {
      return handleErrorClient(res, error.statusCode, error.message);
    }
    return handleErrorServer(res, 500, 'Error al calcular las coincidencias', error); 
  }
};