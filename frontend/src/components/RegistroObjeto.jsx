function RegistroObjeto() {
  return (
    <main>
      <h1>Registrar objeto encontrado</h1>

      <form>
        <div>
          <label htmlFor="tipo">Tipo de objeto</label>
          <input
            id="tipo"
            name="tipo"
            type="text"
          />
        </div>

        <div>
          <label htmlFor="color">Color</label>
          <input
            id="color"
            name="color"
            type="text"
          />
        </div>

        <div>
          <label htmlFor="caracteristicas">Características particulares</label>
          <textarea
            id="caracteristicas"
            name="caracteristicas"
          />
        </div>

        <div>
          <label htmlFor="lugarHallazgo">Lugar del hallazgo</label>
          <input
            id="lugarHallazgo"
            name="lugarHallazgo"
            type="text"
          />
        </div>

        <div>
          <label htmlFor="fechaRecepcion">Fecha de recepción</label>
          <input
            id="fechaRecepcion"
            name="fechaRecepcion"
            type="date"
          />
        </div>

        <div>
          <label htmlFor="imagen">Imagen del objeto</label>
          <input
            id="imagen"
            name="imagen"
            type="file"
          />
        </div>

        <button type="submit">
          Registrar objeto
        </button>
      </form>
    </main>
  )
}

export default RegistroObjeto