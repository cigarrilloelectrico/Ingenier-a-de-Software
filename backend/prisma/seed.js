"use strict";
import { prisma } from "../src/config/configDb.js";

// Datos de prueba para ver el inventario en desarrollo. Se puede correr varias veces sin duplicar datos.

const RECINTOS = [
  { nombre: "AC", latitud: -36.8295, longitud: -73.0367, horarioAtencion: "Lunes a viernes 09:00 - 18:00" },
  { nombre: "Gantes", latitud: -36.8302, longitud: -73.0349, horarioAtencion: "Lunes a viernes 08:30 - 17:30" },
  { nombre: "Biblioteca Central", latitud: -36.8288, longitud: -73.0375, horarioAtencion: "Lunes a sábado 08:00 - 20:00" },
];

const TIPOS_OBJETO = ["Mochila", "Celular", "Audífonos", "Billetera", "Llaves", "Polerón"];

const COLORES = ["Negro", "Azul", "Rojo", "Gris", "Blanco", "Verde"];
const ESTADOS = ["Disponible", "Disponible", "Disponible", "Reservado", "Entregado"];
const DESCRIPCIONES = [
  "Tiene un llavero de Pikachu y el cierre izquierdo roto",
  "Funda transparente con una foto adentro y la pantalla trizada",
  "Estuche con las iniciales M.A. marcadas con plumón",
  "Contiene una credencial universitaria y boletas antiguas",
  "Llavero con tres llaves y una tarjeta de acceso azul",
  "Talla M, con el logo de la carrera bordado en la espalda",
];

async function main() {
  //Nunca cargar datos de prueba en producción
  if (process.env.NODE_ENV === "production") {
    throw new Error("La seed de desarrollo no se puede ejecutar en producción.");
  }

  //Recintos y tipos de objeto: se crean solo si no existen (upsert por nombre)
  const recintos = [];
  for (const recinto of RECINTOS) {
    recintos.push(await prisma.recinto.upsert({ where: { nombre: recinto.nombre }, update: {}, create: recinto }));
  }

  const tipos = [];
  for (const nombre of TIPOS_OBJETO) {
    tipos.push(await prisma.tipoObjeto.upsert({ where: { nombre }, update: {}, create: { nombre } }));
  }

  //Funcionario de prueba sin contraseña: solo sirve para ser el responsable de los objetos
  const funcionario = await prisma.usuario.upsert({
    where: { correo: "funcionario.prueba@ubiobio.cl" },
    update: {},
    create: {
      correo: "funcionario.prueba@ubiobio.cl",
      rol: "Funcionario",
      estado: "Activo",
      nombre: "Ana",
      apellidos: "Pérez Soto",
      recintoId: recintos[0].recintoId,
    },
  });

  //Objetos: solo si esta seed no los cargó antes; los objetos de otras seeds no cuentan
  const objetosDeEstaSeed = await prisma.objeto.count({ where: { registradoPorId: funcionario.usuarioId } });
  if (objetosDeEstaSeed > 0) {
    console.log(`Los ${objetosDeEstaSeed} objetos de prueba ya existen, no se agregan más.`);
    return;
  }

  for (let i = 0; i < 40; i++) {
    await prisma.objeto.create({
      data: {
        recintoId: recintos[i % 3].recintoId,
        recintoHallazgoId: recintos[(i + 1) % 3].recintoId,
        tipoObjetoId: tipos[i % 6].tipoObjetoId,
        registradoPorId: funcionario.usuarioId,
        color: COLORES[i % 6],
        descripcion: DESCRIPCIONES[i % 6],
        // Un objeto recibido por día, hacia atrás desde hoy
        fechaRecepcion: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        estado: ESTADOS[i % 5],
      },
    });
  }

  console.log("Seed lista: 3 recintos, 6 tipos de objeto, 1 funcionario y 40 objetos.");
}

try {
  await main();
} catch (error) {
  console.error("Error al ejecutar la seed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
