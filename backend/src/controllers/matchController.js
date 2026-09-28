const { calcularCoincidencias } = require('../services/matchService');
const { mockAvisos, mockObjetos } = require('../../mockData'); // Importamos ambos

const getMatches = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id);
    const objetoBuscado = mockObjetos.find(item => item.id === targetId);

    if (!objetoBuscado) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el objeto reportado para calcular coincidencias."
      });
    }

    const resultados = calcularCoincidencias(objetoBuscado, mockAvisos);

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

module.exports = { getMatches };