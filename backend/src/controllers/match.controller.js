import { calcularCoincidencias } from '../services/match.service.js';

export const getMatches = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id);
    const { objetoBuscado, resultados } = await calcularCoincidencias(targetId);

    res.status(200).json({
      success: true,
      objetoConsultado: objetoBuscado,
      totalResultados: resultados.length,
      data: resultados
    });
  } catch (error) {
    next(error); 
  }
};