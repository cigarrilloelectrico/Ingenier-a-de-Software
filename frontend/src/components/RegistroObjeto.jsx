import { useEffect, useState } from 'react';
import {
  obtenerRecintos,
  obtenerTiposObjeto,
  registrarObjeto,
} from '../services/inventario.service';

function RegistroObjeto() {
  const [tiposObjeto, setTiposObjeto] = useState([]);
  const [recintos, setRecintos] = useState([]);

  const [formulario, setFormulario] = useState({
    tipoObjetoId: '',
    recintoHallazgoId: '',
    color: '',
    descripcion: '',
    fechaRecepcion: '',
    entregadoPor: '',
  });

  const [fotos, setFotos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [respuestaTipos, respuestaRecintos] = await Promise.all([
          obtenerTiposObjeto(),
          obtenerRecintos(),
        ]);

        setTiposObjeto(respuestaTipos.data);
        setRecintos(respuestaRecintos.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'No se pudieron cargar los tipos de objeto y recintos.'
        );
      }
    }

    cargarDatos();
  }, []);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function manejarFotos(evento) {
    setFotos(Array.from(evento.target.files));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setMensaje('');
    setError('');

    if (fotos.length === 0) {
      setError('Debes adjuntar al menos una imagen.');
      return;
    }

    const datos = new FormData();

    datos.append('tipoObjetoId', formulario.tipoObjetoId);
    datos.append('recintoHallazgoId', formulario.recintoHallazgoId);
    datos.append('color', formulario.color);
    datos.append('descripcion', formulario.descripcion);
    datos.append('fechaRecepcion', formulario.fechaRecepcion);

    if (formulario.entregadoPor.trim()) {
      datos.append('entregadoPor', formulario.entregadoPor.trim());
    }

    fotos.forEach((foto) => {
      datos.append('fotos', foto);
    });

    try {
      setCargando(true);

      const respuesta = await registrarObjeto(datos);

      setMensaje(respuesta.message || 'Objeto registrado correctamente.');

      setFormulario({
        tipoObjetoId: '',
        recintoHallazgoId: '',
        color: '',
        descripcion: '',
        fechaRecepcion: '',
        entregadoPor: '',
      });

      setFotos([]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'No se pudo registrar el objeto.'
      );
    } finally {
      setCargando(false);
    }
  }

  const fechaActual = new Date().toISOString().split('T')[0];

  return (
    <main>
      <h1>Registrar objeto encontrado</h1>

      {mensaje && <p>{mensaje}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={manejarEnvio}>
        <div>
          <label htmlFor="tipoObjetoId">Tipo de objeto</label>
          <select
            id="tipoObjetoId"
            name="tipoObjetoId"
            value={formulario.tipoObjetoId}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo</option>

            {tiposObjeto.map((tipo) => (
              <option
                key={tipo.tipoObjetoId}
                value={tipo.tipoObjetoId}
              >
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="color">Color</label>
          <input
            id="color"
            name="color"
            type="text"
            value={formulario.color}
            onChange={manejarCambio}
            maxLength={40}
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion">
            Características particulares
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            minLength={20}
            maxLength={500}
            required
          />
        </div>

        <div>
          <label htmlFor="recintoHallazgoId">
            Lugar del hallazgo
          </label>
          <select
            id="recintoHallazgoId"
            name="recintoHallazgoId"
            value={formulario.recintoHallazgoId}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un recinto</option>

            {recintos.map((recinto) => (
              <option
                key={recinto.recintoId}
                value={recinto.recintoId}
              >
                {recinto.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fechaRecepcion">
            Fecha de recepción
          </label>
          <input
            id="fechaRecepcion"
            name="fechaRecepcion"
            type="date"
            value={formulario.fechaRecepcion}
            onChange={manejarCambio}
            max={fechaActual}
            required
          />
        </div>

        <div>
          <label htmlFor="entregadoPor">
            Entregado por (opcional)
          </label>
          <input
            id="entregadoPor"
            name="entregadoPor"
            type="text"
            value={formulario.entregadoPor}
            onChange={manejarCambio}
            maxLength={120}
          />
        </div>

        <div>
          <label htmlFor="fotos">Imágenes del objeto</label>
          <input
            id="fotos"
            name="fotos"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={manejarFotos}
            required
          />
          <small>
            Formatos permitidos: JPG y PNG. Máximo 5 imágenes de 5 MB cada una.
          </small>
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar objeto'}
        </button>
      </form>
    </main>
  );
}

export default RegistroObjeto;