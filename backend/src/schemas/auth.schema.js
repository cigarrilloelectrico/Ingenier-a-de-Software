import { z } from "zod";

export const loginSchema = z.object({
  correo: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .toLowerCase()
    .email("El formato del correo electrónico no es válido.")
    .refine((val) => val.endsWith("@alumnos.ubiobio.cl"), {
      message: "Debe ingresar un correo institucional válido con dominio @alumnos.ubiobio.cl",
    }),
  password: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(1, "La contraseña no puede estar vacía."),
});

export const loginFuncionarioSchema = z.object({
  correo: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .toLowerCase()
    .email("El formato del correo electrónico no es válido.")
    .refine((val) => val.endsWith("@ubiobio.cl"), {
      message: "Debe ingresar un correo institucional válido.",
    }),
  password: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(1, "La contraseña no puede estar vacía."),
});
