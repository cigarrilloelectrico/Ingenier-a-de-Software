import { z } from "zod";

export const crearAvisoSchema = z.object({
  tipoObjetoId: z.coerce
    .number({
      required_error: "El tipo de objeto es obligatorio",
      invalid_type_error: "El tipo de objeto debe ser un identificador numérico",
    })
    .int("El identificador del tipo de objeto debe ser un entero")
    .positive("Debe seleccionar un tipo de objeto válido"),

  recintoId: z.coerce
    .number({
      required_error: "El recinto es obligatorio",
      invalid_type_error: "El recinto debe ser un identificador numérico",
    })
    .int("El identificador del recinto debe ser un entero")
    .positive("Debe seleccionar un recinto válido"),

  color: z
    .string({ required_error: "El color es obligatorio" })
    .trim()
    .min(1, "El color es obligatorio")
    .max(40, "El color no puede exceder los 40 caracteres"),

  descripcion: z
    .string({ required_error: "Las marcas o señas particulares son obligatorias" })
    .trim()
    .min(20, "Las marcas o señas particulares deben tener entre 20 y 500 caracteres")
    .max(500, "Las marcas o señas particulares deben tener entre 20 y 500 caracteres"),

  fechaPerdida: z
    .string({ required_error: "La fecha de la pérdida es obligatoria" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de pérdida no tiene un formato válido (debe ser AAAA-MM-DD)",
    })
    .refine(
      (val) => {
        // Obtenemos solo la fecha de hoy a medianoche en hora local
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        const fecha = new Date(val);
        return fecha <= hoy;
      },
      {
        message: "La fecha de pérdida no puede ser una fecha futura",
      }
    )
    .refine(
      (val) => {
        const limite180 = new Date();
        limite180.setDate(limite180.getDate() - 180);
        limite180.setHours(0, 0, 0, 0);
        const fecha = new Date(val);
        return fecha >= limite180;
      },
      {
        message: "La fecha de pérdida no puede ser anterior a 180 días",
      }
    ),
});
