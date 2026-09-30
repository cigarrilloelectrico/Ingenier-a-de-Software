-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('Alumno', 'Funcionario', 'Administrador');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('NoVerificado', 'Activo', 'Bloqueado', 'Desactivado');

-- CreateEnum
CREATE TYPE "EstadoCatalogo" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "EstadoAviso" AS ENUM ('Publicado', 'Citado', 'Entregado', 'Rechazado', 'Cerrado', 'Inactivo');

-- CreateEnum
CREATE TYPE "MotivoCierre" AS ENUM ('Recuperado', 'ErrorAlDeclarar');

-- CreateEnum
CREATE TYPE "EstadoObjeto" AS ENUM ('Disponible', 'Reservado', 'Entregado');

-- CreateEnum
CREATE TYPE "TipoCitacion" AS ENUM ('Retiro', 'Verificacion');

-- CreateEnum
CREATE TYPE "EstadoCitacion" AS ENUM ('Vigente', 'Resuelta', 'Caducada');

-- CreateEnum
CREATE TYPE "ResultadoVerificacion" AS ENUM ('Acreditada', 'NoAcreditada');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('Coincidencia', 'ListoParaRetiro', 'ReclamoRechazado', 'Strike', 'DatosCorregidos', 'NuevoAviso');

-- CreateEnum
CREATE TYPE "TipoAccionBitacora" AS ENUM ('CrearRecinto', 'EditarRecinto', 'DesactivarRecinto', 'ReactivarRecinto', 'CrearFuncionario', 'CambiarRecinto', 'DesactivarFuncionario', 'ReactivarFuncionario', 'CorregirDatosAlumno', 'DesbloquearAlumno', 'CambiarCatalogo');

-- CreateEnum
CREATE TYPE "PropositoCodigo" AS ENUM ('VerificarCorreo', 'SegundoFactor', 'RecuperarPassword', 'DesactivarSegundoFactor');

-- CreateEnum
CREATE TYPE "EstadoCodigo" AS ENUM ('Vigente', 'Usado', 'Invalidado');

-- CreateTable
CREATE TABLE "Aviso" (
    "avisoId" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "tipoObjetoId" INTEGER NOT NULL,
    "recintoId" INTEGER NOT NULL,
    "avisoCorregidoId" INTEGER,
    "color" VARCHAR(40) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "fechaPerdida" DATE NOT NULL,
    "fotoUrl" VARCHAR(255),
    "estado" "EstadoAviso" NOT NULL DEFAULT 'Publicado',
    "motivoCierre" "MotivoCierre",
    "comentarioCierre" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aviso_pkey" PRIMARY KEY ("avisoId")
);

-- CreateTable
CREATE TABLE "Bitacora" (
    "bitacoraId" SERIAL NOT NULL,
    "administradorId" INTEGER NOT NULL,
    "tipoAccion" "TipoAccionBitacora" NOT NULL,
    "tablaAfectada" VARCHAR(40) NOT NULL,
    "registroAfectadoId" INTEGER NOT NULL,
    "valorAnterior" TEXT,
    "valorNuevo" TEXT,
    "motivo" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bitacora_pkey" PRIMARY KEY ("bitacoraId")
);

-- CreateTable
CREATE TABLE "Carrera" (
    "carreraId" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "estado" "EstadoCatalogo" NOT NULL DEFAULT 'Activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("carreraId")
);

-- CreateTable
CREATE TABLE "Citacion" (
    "citacionId" SERIAL NOT NULL,
    "avisoId" INTEGER NOT NULL,
    "objetoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "tipo" "TipoCitacion" NOT NULL,
    "motivoEvidencia" VARCHAR(500),
    "estado" "EstadoCitacion" NOT NULL DEFAULT 'Vigente',
    "venceAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Citacion_pkey" PRIMARY KEY ("citacionId")
);

-- CreateTable
CREATE TABLE "CodigoVerificacion" (
    "codigoVerificacionId" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "codigoHash" VARCHAR(255) NOT NULL,
    "proposito" "PropositoCodigo" NOT NULL,
    "intentos" SMALLINT NOT NULL DEFAULT 0,
    "estado" "EstadoCodigo" NOT NULL DEFAULT 'Vigente',
    "expiraAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodigoVerificacion_pkey" PRIMARY KEY ("codigoVerificacionId")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "entregaId" SERIAL NOT NULL,
    "verificacionId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("entregaId")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "notificacionId" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "avisoId" INTEGER,
    "tipo" "TipoNotificacion" NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "correoEnviadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("notificacionId")
);

-- CreateTable
CREATE TABLE "Objeto" (
    "objetoId" SERIAL NOT NULL,
    "recintoId" INTEGER NOT NULL,
    "recintoHallazgoId" INTEGER NOT NULL,
    "tipoObjetoId" INTEGER NOT NULL,
    "registradoPorId" INTEGER NOT NULL,
    "color" VARCHAR(40) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "fechaRecepcion" DATE NOT NULL,
    "entregadoPor" VARCHAR(120),
    "estado" "EstadoObjeto" NOT NULL DEFAULT 'Disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objeto_pkey" PRIMARY KEY ("objetoId")
);

-- CreateTable
CREATE TABLE "ObjetoFoto" (
    "objetoFotoId" SERIAL NOT NULL,
    "objetoId" INTEGER NOT NULL,
    "fotoUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObjetoFoto_pkey" PRIMARY KEY ("objetoFotoId")
);

-- CreateTable
CREATE TABLE "Recinto" (
    "recintoId" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "latitud" DECIMAL(9,6) NOT NULL,
    "longitud" DECIMAL(9,6) NOT NULL,
    "horarioAtencion" VARCHAR(150) NOT NULL,
    "estado" "EstadoCatalogo" NOT NULL DEFAULT 'Activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recinto_pkey" PRIMARY KEY ("recintoId")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "sesionId" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tokenHash" VARCHAR(255) NOT NULL,
    "ultimaActividadAt" TIMESTAMP(3) NOT NULL,
    "expiraAt" TIMESTAMP(3) NOT NULL,
    "cerradaAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("sesionId")
);

-- CreateTable
CREATE TABLE "Strike" (
    "strikeId" SERIAL NOT NULL,
    "verificacionId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "motivo" VARCHAR(500) NOT NULL,
    "vigente" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strike_pkey" PRIMARY KEY ("strikeId")
);

-- CreateTable
CREATE TABLE "TipoObjeto" (
    "tipoObjetoId" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "estado" "EstadoCatalogo" NOT NULL DEFAULT 'Activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoObjeto_pkey" PRIMARY KEY ("tipoObjetoId")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "usuarioId" SERIAL NOT NULL,
    "recintoId" INTEGER,
    "carreraId" INTEGER,
    "nombre" VARCHAR(60),
    "apellidos" VARCHAR(60),
    "rut" VARCHAR(12),
    "correo" VARCHAR(254) NOT NULL,
    "fotoUrl" VARCHAR(255),
    "passwordHash" VARCHAR(255),
    "passwordTemporal" BOOLEAN NOT NULL DEFAULT false,
    "passwordExpiredAt" TIMESTAMP(3),
    "rol" "Rol" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'NoVerificado',
    "segundoFactorActivo" BOOLEAN NOT NULL DEFAULT true,
    "intentosFallidos" SMALLINT NOT NULL DEFAULT 0,
    "bloqueoHastaAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "Verificacion" (
    "verificacionId" SERIAL NOT NULL,
    "citacionId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "antecedentes" VARCHAR(1000) NOT NULL,
    "resultado" "ResultadoVerificacion" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verificacion_pkey" PRIMARY KEY ("verificacionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aviso_avisoCorregidoId_key" ON "Aviso"("avisoCorregidoId");

-- CreateIndex
CREATE INDEX "Aviso_alumnoId_idx" ON "Aviso"("alumnoId");

-- CreateIndex
CREATE INDEX "Aviso_estado_idx" ON "Aviso"("estado");

-- CreateIndex
CREATE INDEX "Bitacora_tablaAfectada_registroAfectadoId_idx" ON "Bitacora"("tablaAfectada", "registroAfectadoId");

-- CreateIndex
CREATE INDEX "Bitacora_createdAt_idx" ON "Bitacora"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_nombre_key" ON "Carrera"("nombre");

-- CreateIndex
CREATE INDEX "Citacion_avisoId_idx" ON "Citacion"("avisoId");

-- CreateIndex
CREATE INDEX "Citacion_objetoId_estado_idx" ON "Citacion"("objetoId", "estado");

-- CreateIndex
CREATE INDEX "CodigoVerificacion_usuarioId_proposito_estado_idx" ON "CodigoVerificacion"("usuarioId", "proposito", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_verificacionId_key" ON "Entrega"("verificacionId");

-- CreateIndex
CREATE INDEX "Notificacion_usuarioId_leida_idx" ON "Notificacion"("usuarioId", "leida");

-- CreateIndex
CREATE INDEX "Objeto_recintoId_estado_idx" ON "Objeto"("recintoId", "estado");

-- CreateIndex
CREATE INDEX "ObjetoFoto_objetoId_idx" ON "ObjetoFoto"("objetoId");

-- CreateIndex
CREATE UNIQUE INDEX "Recinto_nombre_key" ON "Recinto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Sesion_tokenHash_key" ON "Sesion"("tokenHash");

-- CreateIndex
CREATE INDEX "Sesion_usuarioId_idx" ON "Sesion"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Strike_verificacionId_key" ON "Strike"("verificacionId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoObjeto_nombre_key" ON "TipoObjeto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_rut_key" ON "Usuario"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Verificacion_citacionId_key" ON "Verificacion"("citacionId");

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_tipoObjetoId_fkey" FOREIGN KEY ("tipoObjetoId") REFERENCES "TipoObjeto"("tipoObjetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_recintoId_fkey" FOREIGN KEY ("recintoId") REFERENCES "Recinto"("recintoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_avisoCorregidoId_fkey" FOREIGN KEY ("avisoCorregidoId") REFERENCES "Aviso"("avisoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bitacora" ADD CONSTRAINT "Bitacora_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citacion" ADD CONSTRAINT "Citacion_avisoId_fkey" FOREIGN KEY ("avisoId") REFERENCES "Aviso"("avisoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citacion" ADD CONSTRAINT "Citacion_objetoId_fkey" FOREIGN KEY ("objetoId") REFERENCES "Objeto"("objetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citacion" ADD CONSTRAINT "Citacion_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodigoVerificacion" ADD CONSTRAINT "CodigoVerificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_verificacionId_fkey" FOREIGN KEY ("verificacionId") REFERENCES "Verificacion"("verificacionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_avisoId_fkey" FOREIGN KEY ("avisoId") REFERENCES "Aviso"("avisoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objeto" ADD CONSTRAINT "Objeto_recintoId_fkey" FOREIGN KEY ("recintoId") REFERENCES "Recinto"("recintoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objeto" ADD CONSTRAINT "Objeto_recintoHallazgoId_fkey" FOREIGN KEY ("recintoHallazgoId") REFERENCES "Recinto"("recintoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objeto" ADD CONSTRAINT "Objeto_tipoObjetoId_fkey" FOREIGN KEY ("tipoObjetoId") REFERENCES "TipoObjeto"("tipoObjetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objeto" ADD CONSTRAINT "Objeto_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetoFoto" ADD CONSTRAINT "ObjetoFoto_objetoId_fkey" FOREIGN KEY ("objetoId") REFERENCES "Objeto"("objetoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strike" ADD CONSTRAINT "Strike_verificacionId_fkey" FOREIGN KEY ("verificacionId") REFERENCES "Verificacion"("verificacionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strike" ADD CONSTRAINT "Strike_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_recintoId_fkey" FOREIGN KEY ("recintoId") REFERENCES "Recinto"("recintoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera"("carreraId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verificacion" ADD CONSTRAINT "Verificacion_citacionId_fkey" FOREIGN KEY ("citacionId") REFERENCES "Citacion"("citacionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verificacion" ADD CONSTRAINT "Verificacion_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;
