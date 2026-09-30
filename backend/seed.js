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