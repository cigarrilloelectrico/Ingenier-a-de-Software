import * as matchService from '../services/matchService.js';

const getMatches = (req, res) => {
  try {
    const idObjeto = parseInt(req.params.id);
    const resultados = matchService.calcularCoincidencias(idObjeto);
    
    res.json({
      success: true,
      data: resultados
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export { getMatches };