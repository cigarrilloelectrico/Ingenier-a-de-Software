import bcrypt from 'bcryptjs';
import { prisma } from './src/config/configDb.js';

async function main() {
  console.log('🌱 Cargando datos de prueba...');
  const passwordHash = await bcrypt.hash('Alumno123!', 10);
  const funcionarioPasswordHash = await bcrypt.hash('Funcionario123!', 10);

  const recinto = await prisma.recinto.upsert({
    where: { nombre: 'Campus Concepción' },
    update: {},
    create: {
      nombre: 'Campus Concepción',
      latitud: -36.827,
      longitud: -73.05,
      horarioAtencion: 'Lunes a viernes, 09:00 a 17:00',
      estado: 'Activo',
    },
  });

  const tipoMochila = await prisma.tipoObjeto.upsert({
    where: { nombre: 'Mochila' },
    update: {},
    create: { nombre: 'Mochila', estado: 'Activo' },
  });

  const alumno = await prisma.usuario.upsert({
    where: { correo: 'alumno@alumnos.ubiobio.cl' },
    update: {
      nombre: 'Juan',
      apellidos: 'Pérez',
      rol: 'Alumno',
      estado: 'Activo',
      passwordHash,
    },
    create: {
      correo: 'alumno@alumnos.ubiobio.cl',
      rol: 'Alumno',
      estado: 'Activo',
      nombre: 'Juan',
      apellidos: 'Pérez',
      passwordHash,
    },
  });

  const funcionario = await prisma.usuario.upsert({
    where: { correo: 'funcionario@ubiobio.cl' },
    update: {
      nombre: 'Carlos',
      apellidos: 'González',
      rol: 'Funcionario',
      estado: 'Activo',
      recintoId: recinto.recintoId,
      passwordHash: funcionarioPasswordHash,
    },
    create: {
      correo: 'funcionario@ubiobio.cl',
      rol: 'Funcionario',
      estado: 'Activo',
      nombre: 'Carlos',
      apellidos: 'González',
      recintoId: recinto.recintoId,
      passwordHash: funcionarioPasswordHash,
    },
  });

  const objeto = await prisma.objeto.upsert({
    where: { objetoId: 9001 },
    update: {},
    create: {
      objetoId: 9001,
      recintoId: recinto.recintoId,
      recintoHallazgoId: recinto.recintoId,
      tipoObjetoId: tipoMochila.tipoObjetoId,
      registradoPorId: funcionario.usuarioId,
      color: 'Negro',
      descripcion: 'Mochila marca Targus con un llavero de Spider-Man',
      fechaRecepcion: new Date('2026-09-28T10:00:00Z'),
      estado: 'Disponible',
    }
  });

  const aviso = await prisma.aviso.upsert({
    where: { avisoId: 9001 },
    update: {},
    create: {
      avisoId: 9001,
      alumnoId: alumno.usuarioId,
      tipoObjetoId: tipoMochila.tipoObjetoId,
      recintoId: recinto.recintoId,
      color: 'Negro',
      descripcion: 'Mochila Targus, perdí mis cuadernos',
      fechaPerdida: new Date('2026-09-27T15:30:00Z'),
      estado: 'Publicado',
    },
  });

  const tipoTelefono = await prisma.tipoObjeto.upsert({
    where: { nombre: 'Teléfono' }, update: {}, create: { nombre: 'Teléfono', estado: 'Activo' },
  });
  // Distinto tipo, misma fecha, color y recinto: antes aparecía con 60 puntos, ahora NO debe aparecer
  await prisma.aviso.upsert({
    where: { avisoId: 9002 }, update: {},
    create: { avisoId: 9002, alumnoId: alumno.usuarioId, tipoObjetoId: tipoTelefono.tipoObjetoId,
      recintoId: recinto.recintoId, color: 'Negro', descripcion: 'Teléfono con funda negra y rayón',
      fechaPerdida: new Date('2026-09-28'), estado: 'Publicado' },
  });
  // Mismo tipo, otro color, 5 días antes, debe salir con 75 (MEDIA)
  await prisma.aviso.upsert({
    where: { avisoId: 9003 }, update: {},
    create: { avisoId: 9003, alumnoId: alumno.usuarioId, tipoObjetoId: tipoMochila.tipoObjetoId,
      recintoId: recinto.recintoId, color: 'Rojo', descripcion: 'Mochila roja con cierre roto',
      fechaPerdida: new Date('2026-09-23'), estado: 'Publicado' },
  });
  // Objeto reservado, para probar el 409
  await prisma.objeto.upsert({
    where: { objetoId: 9002 }, update: {},
    create: { objetoId: 9002, recintoId: recinto.recintoId, recintoHallazgoId: recinto.recintoId,
      tipoObjetoId: tipoMochila.tipoObjetoId, registradoPorId: funcionario.usuarioId,
      color: 'Azul', descripcion: 'Mochila azul reservada de prueba',
      fechaRecepcion: new Date('2026-09-28'), estado: 'Reservado' },
  });
  // Mismas señas, color y día que el objeto, debe quedar primero (95, ALTA)
  await prisma.aviso.upsert({
    where: { avisoId: 9004 }, update: {},
    create: { avisoId: 9004, alumnoId: alumno.usuarioId, tipoObjetoId: tipoMochila.tipoObjetoId,
      recintoId: recinto.recintoId, color: 'Negro',
      descripcion: 'Mochila negra Targus con un llavero de Spider-Man y un parche',
      fechaPerdida: new Date('2026-09-28'), estado: 'Publicado' },
  });

  console.log('✅ Datos de prueba cargados correctamente.');
  console.log(`Objeto ID: ${objeto.objetoId} | Aviso ID: ${aviso.avisoId}`);
}

main()
  .catch((e) => {
    console.error('Error al cargar los datos de prueba:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });