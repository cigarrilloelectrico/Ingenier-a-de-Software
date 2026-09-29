const mockAvisos = [
  // 1. El caso intermedio (90%)
  { id: 1, id_tipo_objeto: 3, color: 'Negro', id_sede: 1, fecha_perdida: '2026-09-25', estado: 'publicado' },
  
  // 2. El caso descartable (40%)
  { id: 2, id_tipo_objeto: 3, color: 'Blanco', id_sede: 2, fecha_perdida: '2026-09-20', estado: 'publicado' },
  
  // 3. LA TRAMPA: Fecha de pérdida imposible (Un día DESPUÉS del hallazgo) - Debería ser filtrado
  { id: 3, id_tipo_objeto: 3, color: 'Negro', id_sede: 1, fecha_perdida: '2026-09-27', estado: 'publicado' },
  
  // 4. LA TRAMPA: Estado inactivo (Ya fue entregado/cerrado) - Debería ser filtrado
  { id: 4, id_tipo_objeto: 3, color: 'Negro', id_sede: 1, fecha_perdida: '2026-09-26', estado: 'inactivo' },
  
  // 5. EL CASO PERFECTO: Mismo día, sede, tipo y color - Debería sacar 100%
  { id: 5, id_tipo_objeto: 3, color: 'Negro', id_sede: 1, fecha_perdida: '2026-09-26', estado: 'publicado' },
  
  // 6. DISTINTO TIPO: Un polerón (id: 8) comparado con audífonos. Solo coincidirá la sede y fecha - Debería sacar 50%
  { id: 6, id_tipo_objeto: 8, color: 'Rojo', id_sede: 1, fecha_perdida: '2026-09-26', estado: 'publicado' }
];

const mockObjetos = [
  { id: 101, id_tipo_objeto: 3, color: 'Negro', id_sede: 1, fecha_hallazgo: '2026-09-26' }
];

export { mockAvisos, mockObjetos };