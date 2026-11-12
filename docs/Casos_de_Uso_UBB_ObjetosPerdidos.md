# UBB Objetos Perdidos — Casos de Uso

**Versión 2.2 · 7 de septiembre de 2026**
Aplicación web — Gestión y trazabilidad de objetos perdidos en la Universidad del Bío-Bío

_Documento confidencial — Uso interno exclusivo_

---

## Alcance del documento

Este documento especifica los **casos de uso de las tres vistas** de UBB Objetos Perdidos —Alumno,
Funcionario y Administrador—, derivados de la Especificación de Requerimientos Funcionales v1.2 del
7 de septiembre de 2026. Cubre los requerimientos **RF1–RF47** en su totalidad.

La vista de **Administrador** se incorporó en esta versión. Hasta la v1.1 este documento la daba por
especificada en otra parte y registraba a Rectoría como actor externo, pero ese documento separado
nunca existió: el ERF exigía a Rectoría crear funcionarios, asignarles sede, corregir datos fijos y
desbloquear cuentas sin especificar nunca cómo, y **daba por existentes las sedes y los catálogos de
listas fijas sin que ningún requerimiento dijera quién los crea**. Los RF31–RF45 cerraron ese hueco y
el Subsistema E los expande. El apartado 5.4 deja la correspondencia con la versión anterior.

Cada caso de uso declara los RF que cubre. La numeración RF se conserva intacta respecto del ERF:
este documento no reespecifica requerimientos, los organiza en unidades de interacción verificables.

### La asimetría de información como restricción de diseño

Los casos de uso de este documento están construidos sobre el principio que gobierna el sistema: **el
alumno nunca ve el inventario de objetos encontrados**. Declara a ciegas qué se le perdió y es el
funcionario quien compara esa declaración contra el depósito y verifica la propiedad de manera
presencial.

Esa asimetría no es una preferencia de interfaz, es el mecanismo antifraude, y por eso condiciona la
forma de las fichas que siguen. Se manifiesta en tres restricciones que atraviesan todos los flujos:

1. **Ningún flujo del alumno lee el inventario.** No hay caso de uso de alumno que consulte,
   busque o filtre objetos en depósito, ni que reciba su descripción o su fotografía por ningún
   canal. Un flujo que lo permitiera anularía el valor probatorio de su declaración.
2. **Ninguna comunicación dirigida al alumno describe el objeto.** Ni el correo de citación
   (CU-23, CU-24) ni el estado del aviso (CU-12) ni la notificación (CU-17) revelan de qué
   objeto se trata. El alumno no puede distinguir una citación de retiro de una citación a
   verificación: saber cuán convencido está el funcionario le permitiría prepararse.
3. **El sistema no resuelve sobre la propiedad.** CU-22 propone coincidencias y CU-25 exige dejar
   registro, pero la resolución es siempre un acto deliberado del funcionario y queda documentada a
   su nombre. Ningún caso de uso automatiza la decisión, la sugiere ni la condiciona.

Un aviso publicado es evidencia y no contenido editable: de ahí que la confirmación previa sea un
caso de uso incluido y obligatorio (CU-11) y que no exista ningún caso de uso de edición de avisos.

---

## 1. Actores

Un actor es una entidad **externa** al sistema que interactúa con él. Por eso **el sistema no figura
como actor de sus propios casos de uso**: modelarlo así confundiría al ejecutor con lo ejecutado. Su
comportamiento automático —generar y expirar códigos, caducar sesiones y citaciones, bloquear una
cuenta, dar de baja avisos, emitir notificaciones— no desaparece: vive dentro de los flujos de los
casos de uso que lo disparan, y el apartado 5.2 dice exactamente dónde queda especificado cada uno.

### 1.1 Actores principales

| Actor             | Tipo   | Descripción                                                                                                                                                                                                              |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Visitante**     | Humano | Persona no autenticada. Sólo alcanza el registro, la verificación de la cuenta, el inicio de sesión y la recuperación de contraseña (CU-01 a CU-05).                                                                      |
| **Alumno**        | Humano | Titular de un correo `@alumnos.ubiobio.cl`. Ejerce el **conjunto de capacidades de declaración**: publica avisos de pérdida y consulta lo propio (RF8–RF14, RF27, RF30). **No accede a ninguna capacidad de inventario.** |
| **Funcionario**   | Humano | Cuenta creada por Rectoría y asignada a una sede. Ejerce el **conjunto de capacidades de custodia**: inventario, foro, citación, entrega y sanción (RF15–RF26, RF29). **No accede a ninguna capacidad de declaración.**   |
| **Administrador** | Humano | Rectoría. Ejerce el **conjunto de capacidades de administración**: sedes, funcionarios, cuentas de alumno, catálogos y bitácora (RF31–RF45). **No accede al inventario, al foro, a las citaciones, a las entregas ni a los strikes.**                    |

Los tres conjuntos de capacidades son **disjuntos**: ninguna cuenta ejerce dos de ellos. No existe en
este sistema el equivalente a un perfil de doble modalidad, y esa separación es deliberada —un
funcionario que además pudiera publicar avisos podría citarse a sí mismo, y un administrador que
además pudiera entregar objetos se autorizaría a sí mismo la entrega.

El Administrador **administra la plataforma y no opera el proceso de objetos perdidos**. Da de alta
sedes y funcionarios, sostiene los catálogos, corrige lo que los demás roles no pueden corregir y
levanta los bloqueos de cuenta. No ingresa objetos, no consulta el foro, no cita, no entrega y no
asigna strikes: trasladarle esas acciones rompería la cadena de responsabilidad que el resto del
documento construye. Puede corregir el rut de un alumno y desbloquear su cuenta, pero **no puede
eliminar un strike ni revertir una entrega**: lo primero es un dato mal escrito, lo segundo es la
actuación registrada de un funcionario.

### 1.2 Actores secundarios

| Actor                  | Tipo    | Participación                                                                                                                                                                                                                   |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Servicio de correo** | Externo | Entrega el código de verificación (RF2), el enlace de recuperación (RF5), el aviso al funcionario por publicación en su sede (RF19), las dos citaciones al alumno (RF21, RF22) y la contraseña temporal del funcionario nuevo (RF35). Proveedor gestionado. |

Rectoría **ya no figura como actor externo**: sus acciones dejaron de estar fuera de la plataforma y
se especifican en el Subsistema E bajo el actor **Administrador**. Lo único que permanece fuera del
sistema es la gestión presencial en que el alumno presenta sus objeciones a un strike, que es el
paso 1 de CU-37 y no una función de software.

### 1.3 Qué puede hacer cada perfil

La autorización se verifica **en el servidor sobre cada operación**, y no sólo ocultando controles en
la interfaz. Un alumno que construya la petición de un funcionario recibe un rechazo, y un
funcionario que intente actuar sobre un objeto de otra sede también (RF7).

| Perfil            | Declaración (RF8–RF14, RF27, RF30) | Custodia (RF15–RF26, RF29) | Administración (RF31–RF45) | Ámbito de sus acciones                                                                     |
| ----------------- | :--------------------------------: | :------------------------: | :------------------------: | ------------------------------------------------------------------------------------------ |
| **Alumno**        |                 SÍ                 |             NO             |             NO             | Sus propios avisos, retiros, strikes y notificaciones. Nada de otro alumno.                |
| **Funcionario**   |                 NO                 |             SÍ             |             NO             | **Consulta:** inventario y foro de toda la Universidad. **Acción:** sólo su sede asignada. |
| **Administrador** |                 NO                 |             NO             |             SÍ             | Toda la Universidad. **No está asignado a ninguna sede** (RF32).                           |

Esa doble frontera del funcionario es la parte menos obvia del modelo y conviene dejarla explícita,
porque separa dos permisos que suelen ir juntos: **consulta transversal, acción local**. Consulta
transversal porque sólo viendo el inventario completo puede avisarle a un alumno que su objeto está
en un recinto distinto del que frecuenta; acción local porque el objeto está físicamente bajo
custodia de una sede y quien responde por su entrega es quien lo tiene.

---

## 2. Índice de casos de uso

### Subsistema A — Acceso y cuenta

| ID    | Caso de uso                                | Actor principal      | RF       |
| ----- | ------------------------------------------ | -------------------- | -------- |
| CU-01 | Registrarse con el correo institucional    | Visitante            | RF1      |
| CU-02 | Verificar el correo institucional          | Visitante            | RF2      |
| CU-03 | Definir la contraseña en el primer ingreso | Alumno · Funcionario | RF3, RF35 |
| CU-04 | Iniciar sesión                             | Visitante            | RF4, RF6, RF31, RF7, RF32 |
| CU-05 | Recuperar la contraseña                    | Visitante            | RF5      |
| CU-06 | Cerrar sesión                              | Los tres roles       | RF4, RF6, RF31 |
| CU-07 | Activar o desactivar el segundo factor     | Alumno · Funcionario | RF46     |
| CU-08 | Cambiar la contraseña                      | Los tres roles       | RF47     |

### Subsistema B — Alumno: perfil, avisos y consultas

| ID    | Caso de uso                                 | Actor principal | RF        |
| ----- | ------------------------------------------- | --------------- | --------- |
| CU-09 | Completar y consultar los datos personales  | Alumno          | RF8       |
| CU-10 | Publicar un aviso de pérdida                | Alumno          | RF9, RF19 |
| CU-11 | Confirmar el aviso antes de publicarlo      | Alumno          | RF10      |
| CU-12 | Consultar el estado de los avisos propios   | Alumno          | RF11      |
| CU-13 | Cerrar un aviso propio                      | Alumno          | RF12      |
| CU-14 | Consultar el historial de avisos publicados | Alumno          | RF13      |
| CU-15 | Consultar el historial de retiros           | Alumno          | RF14      |
| CU-16 | Consultar los strikes recibidos             | Alumno          | RF27      |
| CU-17 | Consultar el centro de notificaciones       | Alumno          | RF30      |

### Subsistema C — Funcionario: inventario y foro

| ID    | Caso de uso                                       | Actor principal | RF         |
| ----- | ------------------------------------------------- | --------------- | ---------- |
| CU-18 | Ingresar un objeto encontrado al inventario       | Funcionario     | RF15, RF7  |
| CU-19 | Consultar el inventario general                   | Funcionario     | RF16       |
| CU-20 | Consultar el detalle y el historial de un objeto  | Funcionario     | RF17       |
| CU-21 | Consultar el foro de avisos de pérdida            | Funcionario     | RF18, RF19 |
| CU-22 | Buscar coincidencias entre un objeto y los avisos | Funcionario     | RF20       |

### Subsistema D — Funcionario: citación, entrega y sanción

| ID    | Caso de uso                                          | Actor principal | RF                     |
| ----- | ---------------------------------------------------- | --------------- | ---------------------- |
| CU-23 | Citar al alumno para retirar un objeto               | Funcionario     | RF21, RF7              |
| CU-24 | Citar al alumno a verificación presencial            | Funcionario     | RF22, RF7              |
| CU-25 | Registrar el resultado de la verificación presencial | Funcionario     | RF23                   |
| CU-26 | Entregar el objeto y descontarlo del inventario      | Funcionario     | RF24, RF7              |
| CU-27 | Asignar un strike                                    | Funcionario     | RF25, RF7, RF28, RF29  |
| CU-28 | Consultar los strikes de un alumno                   | Funcionario     | RF26                   |

### Subsistema E — Administrador: plataforma, cuentas y catálogos

| ID    | Caso de uso                                              | Actor principal | RF         |
| ----- | -------------------------------------------------------- | --------------- | ---------- |
| CU-29 | Crear una sede                                           | Administrador   | RF33       |
| CU-30 | Editar y desactivar una sede                             | Administrador   | RF34       |
| CU-31 | Crear la cuenta de un funcionario                        | Administrador   | RF35       |
| CU-32 | Cambiar la sede asignada a un funcionario                | Administrador   | RF36       |
| CU-33 | Desactivar y reactivar la cuenta de un funcionario       | Administrador   | RF37       |
| CU-34 | Consultar el padrón de funcionarios                      | Administrador   | RF38       |
| CU-35 | Consultar la ficha de un alumno                          | Administrador   | RF39       |
| CU-36 | Corregir los datos fijos de un alumno                    | Administrador   | RF40       |
| CU-37 | Desbloquear la cuenta de un alumno                       | Administrador   | RF41       |
| CU-38 | Consultar el registro de strikes de la Universidad       | Administrador   | RF42       |
| CU-39 | Gestionar el catálogo de recintos                        | Administrador   | RF43       |
| CU-40 | Gestionar los catálogos de tipos de objeto y de carreras | Administrador   | RF44       |
| CU-41 | Consultar la bitácora de administración                  | Administrador   | RF45       |

**Total: 41 casos de uso**, todos con actor principal humano. El comportamiento automático del
sistema queda especificado dentro de los flujos que lo disparan y se rastrea en el apartado 5.2.

---

## 3. Diagrama de casos de uso

El diagrama está en **[`Casos_de_Uso_UBB_ObjetosPerdidos.drawio`](Casos_de_Uso_UBB_ObjetosPerdidos.drawio)**
— **una sola página**, con los cuatro actores fuera y las 41 acciones repartidas en **seis recuadros
independientes**, uno por bloque funcional:

| Recuadro                                | Casos de uso | Quién lo usa       |
| --------------------------------------- | :----------: | ------------------ |
| **ACCESO Y CUENTA**              |      8       | Los tres roles     |
| **DECLARACIÓN**                  |      9       | Sólo Alumno        |
| **INVENTARIO Y FORO**            |      5       | Sólo Funcionario   |
| **CITACIÓN Y ENTREGA**           |      6       | Sólo Funcionario   |
| **ADMIN · SEDES Y FUNCIONARIOS** |      6       | Sólo Administrador |
| **ADMIN · CUENTAS Y CATÁLOGOS**  |      7       | Sólo Administrador |

Cada recuadro es un bloque distinto del sistema, con su propio límite. Los recuadros de
**DECLARACIÓN** e **INVENTARIO Y FORO** no comparten ninguna acción y ninguna flecha los conecta
directamente: esa separación visual **es** la asimetría de información del sistema, y el único punto
donde los dos mundos se tocan es el recuadro de **CITACIÓN Y ENTREGA**, donde el funcionario cruza un
aviso contra un objeto. Si en el dibujo apareciera una flecha del Alumno hacia el inventario, el
diseño estaría mal.

**ACCESO Y CUENTA reúne a los tres roles en las mismas elipses.** Iniciar sesión, cerrar sesión,
definir o cambiar la contraseña son una sola acción cada una, no una por rol: lo que cambia entre un
alumno, un funcionario y un administrador es el alcance que reciben al entrar, y eso se resuelve
dentro del flujo. Por eso hay tres actores conectados al mismo recuadro y no tres recuadros de
acceso.

Los dos recuadros de **ADMINISTRACIÓN** tampoco tocan al inventario ni al foro, y ninguna flecha los
conecta con **CITACIÓN Y ENTREGA**. Esa es la segunda frontera del sistema: el administrador crea las
condiciones para que el proceso ocurra —sedes, funcionarios, catálogos— pero no interviene en él.

Los casos de uso se nombran con la **acción que el actor ejecuta**. La correspondencia con los
requerimientos está en el apartado 5, nunca en el dibujo.

### 3.1 Relaciones «include»

El caso base **siempre** ejecuta al incluido. La flecha va **del base al incluido**.

| Caso base                          |     | Caso incluido                       | Por qué es obligatorio                                                          |
| ---------------------------------- | :-: | ----------------------------------- | ------------------------------------------------------------------------------- |
| Registrarse con el correo (CU-01)  |  →  | Verificar el correo (CU-02)         | Sin confirmar el código la cuenta queda no verificada y sin acceso (RF1, RF2)   |
| Verificar el correo (CU-02)        |  →  | Definir la contraseña (CU-03)       | El primer ingreso exige definirla antes de alcanzar cualquier función (RF2, RF3) |
| Publicar un aviso (CU-10)          |  →  | Confirmar antes de publicar (CU-11) | El aviso se registra sólo tras confirmación expresa; es irreversible (RF9, RF10) |
| Registrar la verificación (CU-25)  |  →  | Consultar los strikes (CU-28)       | El sistema exhibe los strikes acumulados en la vista de resolución (RF23, RF26) |
| Entregar el objeto (CU-26)         |  →  | Registrar la verificación (CU-25)   | Sólo se entrega desde una resolución «propiedad acreditada» (RF23, RF24)        |
| Asignar un strike (CU-27)          |  →  | Registrar la verificación (CU-25)   | Sólo se sanciona desde una resolución «propiedad no acreditada» (RF23, RF25)    |
| Citar para retirar (CU-23)         |  →  | Consultar el foro (CU-21)           | La citación se ejecuta situado sobre un aviso del foro (RF18, RF21)             |
| Cambiar la sede de un funcionario (CU-32) |  →  | Consultar el padrón (CU-34)  | La ficha del funcionario se abre desde el padrón (RF38, RF36)                   |
| Desactivar un funcionario (CU-33)  |  →  | Consultar el padrón (CU-34)         | Ídem: el estado se cambia desde la ficha, que vive en el padrón (RF38, RF37)    |
| Corregir los datos fijos (CU-36)   |  →  | Consultar la ficha del alumno (CU-35) | La corrección es una de las dos acciones que ofrece la ficha (RF39, RF40)     |
| Desbloquear la cuenta (CU-37)      |  →  | Consultar la ficha del alumno (CU-35) | Ídem, y exige ver antes los strikes que causaron el bloqueo (RF39, RF41)      |

### 3.2 Relaciones «extend»

El caso extensor **agrega comportamiento opcional** al base. La flecha va **del extensor al base**.

| Caso extensor                             |     | Caso base                                 | Cuándo ocurre                                                        |
| ----------------------------------------- | :-: | ----------------------------------------- | -------------------------------------------------------------------- |
| Recuperar la contraseña (CU-05)           |  →  | Iniciar sesión (CU-04)                    | Sólo si el usuario no recuerda sus credenciales (RF5)                |
| Cerrar un aviso propio (CU-13)            |  →  | Consultar el estado de los avisos (CU-12) | Sólo si el alumno decide cerrarlo por sí mismo (RF12)                |
| Consultar el detalle de un objeto (CU-20) |  →  | Consultar el inventario (CU-19)           | Sólo si el funcionario decide profundizar en un objeto (RF17)        |
| Buscar coincidencias (CU-22)              |  →  | Consultar el inventario (CU-19)           | Sólo si el funcionario decide cruzar un objeto contra el foro (RF20) |
| Citar a verificación presencial (CU-24)   |  →  | Citar para retirar (CU-23)                | Sólo cuando la descripción del aviso no basta por sí sola (RF22)     |

### 3.3 Reparto por actor

|                                          | Visitante | Alumno | Funcionario | Administrador |
| ---------------------------------------- | :-------: | :----: | :---------: | :-----------: |
| Acceso y cuenta (8)                      |     4     |   4    |      4      |       2       |
| Declaración — alumno (9)                 |     —     |   9    |      —      |       —       |
| Inventario y foro (5)                    |     —     |   —    |      5      |       —       |
| Citación y entrega (6)                   |     —     |   —    |      6      |       —       |
| Admin · sedes y funcionarios (6)         |     —     |   —    |      —      |       6       |
| Admin · cuentas y catálogos (7)          |     —     |   —    |      —      |       7       |
| **Total**                                |   **4**   | **13** |   **15**    |    **15**     |

Las 47 asociaciones cubren 41 casos de uso. Los seis excedentes son los cuatro casos de uso
compartidos del Subsistema A: **CU-06 Cerrar sesión** y **CU-08 Cambiar la contraseña** los ejercen los
tres roles; **CU-03 Definir la contraseña** y **CU-07 Activar o desactivar el segundo factor** los
ejercen dos —el administrador no define contraseña inicial porque su cuenta se establece en la puesta
en marcha, y no puede desactivar su segundo factor (RF31, RF46)—. La tabla cuenta **actores principales**, que es lo que el diagrama dibuja;
la matriz del apartado 6 responde otra pregunta —quién puede ejercer cada caso de uso— y por eso marca
además al titular de la cuenta en los casos de uso de acceso.

---

## 4. Casos de uso expandidos

### Subsistema A — Acceso y cuenta

---

#### CU-01 · Registrarse con el correo institucional

| Campo                   | Valor                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-01                                                                                                                                  |
| **Actor principal**     | Visitante                                                                                                                              |
| **Actores secundarios** | Servicio de correo                                                                                                                     |
| **RF cubiertos**        | RF1                                                                                                                                    |
| **Precondiciones**      | El visitante no tiene sesión iniciada y posee un correo `@alumnos.ubiobio.cl`.                                                          |
| **Postcondiciones**     | Existe una cuenta con rol de alumno en estado **no verificado**, sin acceso a ninguna función, a la espera de la confirmación del código. |
| **Frecuencia**          | Una vez por alumno.                                                                                                                    |

**Flujo principal**

1. El visitante ingresa a la plataforma e inicia el proceso de registro.
2. El sistema presenta el formulario de registro, que solicita únicamente el correo institucional y
   la aceptación de los términos de uso.
3. El visitante ingresa su correo institucional y acepta los términos de uso.
4. El sistema valida que el correo tenga el dominio `@alumnos.ubiobio.cl`, que no exceda 254
   caracteres y que no esté ya registrado.
5. El sistema crea la cuenta con **rol de alumno** en estado **no verificado**, sin acceso a ninguna
   función de la plataforma.
6. El sistema invoca **CU-02** para la verificación del correo.

**Flujos alternativos**

- _2a. El visitante busca registrarse como funcionario._ La plataforma no ofrece esa opción: las
  cuentas de funcionario no se crean por cuenta propia y sólo Rectoría las da de alta (RF6).

**Excepciones**

- _4a. El dominio del correo no es `@alumnos.ubiobio.cl`._ El sistema rechaza el registro indicando
  el motivo exacto y mantiene el formulario.
- _4b. El correo excede los 254 caracteres._ El sistema rechaza el registro indicando el motivo
  exacto.
- _4c. El correo ya está registrado._ El sistema rechaza el registro indicando el motivo exacto.
- _3a. El visitante no acepta los términos de uso._ El sistema no permite el envío.

**Reglas de negocio**

- **En este paso no se solicita contraseña.** La contraseña se define en el primer ingreso, ya con
  el correo verificado (CU-03). Separar ambos momentos evita que quede una credencial asociada a un
  correo que nunca se acreditó.
- Toda cuenta creada por esta vía nace con rol de alumno. El rol no es seleccionable.

---

#### CU-02 · Verificar el correo institucional

| Campo                   | Valor                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| **Identificador**       | CU-02                                                                                     |
| **Actor principal**     | Visitante                                                                                 |
| **Actores secundarios** | Servicio de correo                                                                        |
| **RF cubiertos**        | RF2                                                                                       |
| **Precondiciones**      | Existe una cuenta con rol de alumno en estado no verificado (CU-01).                      |
| **Postcondiciones**     | La cuenta queda en estado **verificado**, habilitada para el primer ingreso.               |
| **Frecuencia**          | Una vez por alumno, con reenvíos eventuales.                                              |

**Flujo principal**

1. El sistema genera un **código numérico de seis dígitos** y lo remite al correo institucional.
2. El visitante escribe el código en la pantalla de verificación. Dispone de **quince minutos de
   vigencia y tres intentos**.
3. El sistema valida el código.
4. El sistema marca la cuenta como **verificada** y la conduce de inmediato a **CU-03**.

**Flujos alternativos**

- _2a. Vencen los quince minutos o se agotan los tres intentos._ El visitante pide un código nuevo.
  Puede pedir **hasta tres códigos por hora**, y cada código nuevo **deja sin efecto al anterior**, de
  modo que nunca existan dos códigos válidos para una misma cuenta. El flujo retorna al paso 1.
- _2b. El visitante no completa la verificación._ La cuenta **permanece no verificada** y no puede
  iniciar sesión ni entrar a ninguna pantalla de la aplicación.

**Excepciones**

- _3a. El código es incorrecto._ El sistema informa el error **sin decir si estuvo en el código o en
  el correo** y descuenta un intento.
- _2c. El visitante supera las tres solicitudes por hora._ El sistema rechaza la solicitud.

**Reglas de negocio**

- **Ante un intento fallido el sistema no informa si el error estuvo en el código o en el correo, para
  que nadie averigüe por esa vía qué correos están registrados.** Un mensaje que distinguiera ambos
  casos convertiría esta pantalla en un verificador de cuentas.
- Cada código nuevo invalida el anterior: en ningún momento hay dos códigos válidos para la misma
  cuenta.

---

#### CU-03 · Definir la contraseña en el primer ingreso

| Campo                   | Valor                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-03                                                                                        |
| **Actor principal**     | Alumno · Funcionario                                                                         |
| **Actores secundarios** | —                                                                                            |
| **RF cubiertos**        | RF3, RF35                                                                                    |
| **Precondiciones**      | La cuenta está verificada y **no tiene todavía una contraseña propia**. El alumno llega desde CU-02; el funcionario, desde la contraseña temporal que le entregó CU-31. |
| **Postcondiciones**     | La cuenta queda **activa**, con su contraseña almacenada como resumen y **su segundo factor de autenticación activo**. |
| **Frecuencia**          | Una vez por cuenta.                                                                          |

**Flujo principal**

1. El sistema presenta el formulario y muestra **las seis condiciones antes de que el usuario empiece a
   escribir**:
   1. al menos **10 caracteres**;
   2. empezar con una **letra mayúscula**;
   3. contener al menos un **carácter especial** de puntuación o símbolo;
   4. **no incluir tres o más dígitos consecutivos** en orden ascendente ni descendente, como 123 o 321;
   5. **no repetir un mismo carácter tres o más veces seguidas**;
   6. **no contener su correo institucional** ni la parte de éste anterior a la arroba.
2. En esa misma pantalla el sistema le informa que **su cuenta queda protegida con un segundo factor de
   autenticación ya activo**, que recibirá ese código en el mismo correo institucional y que podrá
   desactivarlo más adelante desde la configuración de su cuenta (CU-07).
3. El usuario escribe su contraseña **dos veces**. El sistema marca cada condición como cumplida a
   medida que escribe.
4. El sistema valida las seis condiciones y que ambas escrituras coincidan.
5. El sistema almacena la contraseña con un **algoritmo de resumen diseñado para contraseñas**, nunca
   en texto legible, deja la cuenta **activa** y **activa el segundo factor**.
6. El usuario alcanza las funciones de su rol.

**Flujos alternativos**

- _1a. El usuario es un alumno._ Llega aquí inmediatamente después de verificar su correo (CU-02) y al
  terminar el sistema lo conduce a completar sus datos personales (CU-09).
- _1b. El usuario es un funcionario._ Llega aquí en su primer inicio de sesión, autenticándose con la
  **contraseña temporal** que el administrador le hizo llegar (CU-31). El sistema le exige el reemplazo
  **antes de mostrarle ninguna pantalla**, y **la temporal queda invalidada** en cuanto define la
  propia.
- _1c. La contraseña temporal del funcionario ya caducó._ No alcanza este caso de uso: el
  administrador debe generarle otra (CU-31, flujo alternativo 5a).

**Excepciones**

- _4a. La contraseña incumple una o más condiciones._ El sistema la rechaza **indicando cuál falló** y
  mantiene el formulario.
- _4b. Las dos escrituras no coinciden._ El sistema rechaza la contraseña.
- _2a. El usuario intenta rechazar el segundo factor._ **No puede.** La activación no es opcional en
  este paso y no se le ofrece manera de saltarla.

**Reglas de negocio**

- **Es un solo caso de uso para el alumno y para el funcionario, porque la meta es la misma: dejar la
  cuenta con una contraseña propia antes de usarla.** Lo único que cambia es de dónde viene cada uno
  —el alumno de la verificación de su correo, el funcionario de una contraseña temporal— y eso es una
  variación del flujo, no un caso de uso distinto.
- **El usuario no puede saltarse este paso ni entrar a ninguna otra pantalla antes de completarlo.**
- **Las seis condiciones rigen en todo cambio o recuperación posterior** (CU-05, CU-08). Desde el
  momento en que el sistema conoce sus datos personales (CU-09), la sexta alcanza además su nombre,
  sus apellidos y su rut. En este paso todavía no los conoce, y por eso sólo puede comprobar el correo.
- **El administrador no pasa por este caso de uso**: su cuenta se establece en la puesta en marcha del
  sistema y no se crea desde la plataforma (CU-04, reglas de negocio).
- La retroalimentación en vivo del paso 3 es parte del requerimiento, no una decisión de
  implementación: con seis condiciones, descubrirlas de a una por rechazo sucesivo sería inutilizable.

---

#### CU-04 · Iniciar sesión

| Campo                   | Valor                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-04                                                                                                                     |
| **Actor principal**     | Visitante (titular de una cuenta de cualquier rol)                                                                        |
| **Actores secundarios** | Servicio de correo                                                                                                        |
| **RF cubiertos**        | RF4, RF6, RF31, RF7, RF32                                                                                                 |
| **Precondiciones**      | Existe una cuenta verificada y con contraseña definida, de cualquiera de los tres roles, y no está desactivada.            |
| **Postcondiciones**     | Sesión abierta **con alcance limitado al rol de esa cuenta y ninguno otro**, con caducidad a los 30 minutos sin actividad y a las 12 horas de apertura. |
| **Frecuencia**          | Diaria para el funcionario; varias veces por semana para el alumno en búsqueda activa; semanal para el administrador.     |

**Flujo principal**

1. El visitante ingresa su correo institucional y su contraseña.
2. El sistema valida las credenciales.
3. Con el segundo factor activo, el sistema le envía a su correo un **código de seis dígitos con quince
   minutos de vigencia y tres intentos**, y se lo solicita.
4. El visitante ingresa el código.
5. El sistema abre la sesión y habilita **únicamente las funciones del rol de esa cuenta y ninguna
   otra**.
6. El sistema fija la caducidad: **30 minutos sin actividad** y **12 horas desde su apertura**.

**Flujos alternativos**

- _1a. El visitante no recuerda su contraseña._ Ejecuta **CU-05**.
- _1b. Es el primer ingreso de un funcionario y tiene una contraseña temporal._ El sistema le exige
  reemplazarla antes de mostrarle ninguna pantalla (CU-29).
- _3a. La cuenta es de alumno o de funcionario y tiene el segundo factor desactivado_ (CU-06). El
  flujo salta del paso 2 al paso 5. **La cuenta de administrador no admite este salto**: su segundo
  factor no es desactivable.
- _4a. El código expira, o el visitante pide uno nuevo, o empieza otro intento de sesión._ El código
  anterior **queda sin efecto**.
- _5a. La cuenta es de funcionario._ El sistema muestra además, de forma permanente en pantalla, **la
  sede asignada**, que determina el alcance de todas sus acciones (RF7).
- _5b. La cuenta es de administrador._ La sesión es **transversal a toda la Universidad y sin sede
  asignada**, y el sistema le niega el acceso al inventario, al foro, a las citaciones, a las entregas
  y a la asignación de strikes (RF32).

**Excepciones**

- _2a. El correo no está registrado, la contraseña no coincide, la cuenta no está verificada o la
  cuenta fue desactivada._ El sistema deniega el acceso **con un mismo mensaje en los cuatro casos**,
  que no permite deducir si ese correo existe.
- _2b. Las credenciales son correctas y la cuenta de alumno está bloqueada por tres strikes._ El
  sistema indica **que la cuenta ha sido bloqueada y que debe contactarse con Rectoría para
  solucionarlo**, sin alcanzar ninguna función (CU-26).
- _2c. Cinco intentos fallidos consecutivos._ El sistema **bloquea el acceso a esa cuenta durante
  quince minutos y envía un correo avisando del bloqueo**.
- _4b. Se agotan los tres intentos del código._ El sistema no abre la sesión.

**Reglas de negocio**

- **Es un solo caso de uso para los tres roles, porque la meta del actor es la misma: entrar al
  sistema.** Lo que cambia entre un alumno, un funcionario y un administrador no es el objetivo sino
  el alcance que reciben al entrar, y eso es una variación del flujo, no un caso de uso distinto.
- **El mensaje de rechazo es único cuando la contraseña no es correcta, y específico sólo cuando sí lo
  es.** Ésta es la única distinción que hace el sistema, y es deliberada: quien acertó la contraseña ya
  acreditó ser el titular, de modo que informarle del bloqueo no revela nada a un tercero, y sin ese
  mensaje el alumno sancionado no tendría cómo saber que su vía de solución es presencial.
- **Mientras no complete los dos factores no entra a ninguna pantalla de la aplicación.**
- **Las cuentas de funcionario y de administrador no se registran por cuenta propia**: las primeras
  las crea el administrador (CU-29) y las segundas se establecen en la puesta en marcha del sistema.
  Sólo el alumno llega a esta pantalla por una cuenta que creó él mismo (CU-01).
- El correo del bloqueo por intentos fallidos existe para que **el titular se entere si el intento no
  fue suyo**. Ese bloqueo (15 minutos, automático) es un mecanismo distinto del bloqueo por strikes
  (indefinido, y sólo el administrador lo levanta, CU-35).

---

#### CU-05 · Recuperar la contraseña

| Campo                   | Valor                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-05                                                                                                            |
| **Actor principal**     | Visitante (titular de una cuenta con rol de alumno)                                                              |
| **Actores secundarios** | Servicio de correo                                                                                               |
| **RF cubiertos**        | RF5                                                                                                              |
| **Precondiciones**      | Ninguna verificable antes de responder: el flujo responde igual exista o no la cuenta.                           |
| **Postcondiciones**     | La contraseña queda reemplazada, **toda sesión abierta con la anterior se cierra** y el usuario recibe un correo del cambio. |
| **Frecuencia**          | Eventual.                                                                                                        |

**Flujo principal**

1. El visitante solicita restablecer su contraseña e ingresa su correo institucional.
2. El sistema muestra **siempre el mismo mensaje**, exista o no una cuenta asociada a ese correo.
3. Si la cuenta existe, el sistema envía a ese correo un **código de seis dígitos con quince minutos de
   vigencia y tres intentos**.
4. El visitante ingresa el código.
5. El visitante escribe su contraseña nueva.
6. El sistema valida que cumpla **las mismas seis condiciones del primer ingreso** (CU-03) y que **sea
   distinta de la anterior**.
7. El sistema reemplaza la contraseña, **cierra toda sesión abierta con la anterior** y **envía un
   correo avisándole de que su contraseña fue cambiada**.

**Flujos alternativos**

- _4a. El código expira o se agotan los tres intentos._ El visitante retoma desde el paso 1.

**Excepciones**

- _6a. La contraseña nueva incumple alguna de las seis condiciones._ El sistema la rechaza indicando
  cuál falló.
- _6b. La contraseña nueva coincide con la anterior._ El sistema rechaza el cambio.
- _1a. El visitante supera las tres solicitudes por hora._ El sistema rechaza la solicitud.

**Reglas de negocio**

- El mensaje uniforme del paso 2 es deliberado: **revelar si un correo está registrado permitiría
  enumerar cuentas** de la plataforma.
- El cierre de sesiones del paso 7 es la parte que da sentido al flujo. **Si el motivo del cambio fue
  un acceso indebido, dejar viva la sesión del intruso vaciaría la recuperación de contenido.**
- El correo de aviso del paso 7 permite al titular detectar un restablecimiento que no pidió él.

---


#### CU-06 · Cerrar sesión

| Campo                   | Valor                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| **Identificador**       | CU-06                                                             |
| **Actor principal**     | Alumno · Funcionario · Administrador                              |
| **Actores secundarios** | —                                                                 |
| **RF cubiertos**        | RF4, RF6, RF31                                                    |
| **Precondiciones**      | El usuario tiene una sesión abierta.                              |
| **Postcondiciones**     | La sesión queda cerrada y sus credenciales de sesión invalidadas. |
| **Frecuencia**          | Una vez por sesión.                                               |

**Flujo principal**

1. El usuario solicita cerrar la sesión.
2. El sistema invalida la sesión y retorna a la vista pública.

**Flujos alternativos**

- _1a. El usuario no cierra la sesión y ésta caduca._ El sistema la cierra por su cuenta al cumplirse
  **treinta minutos sin actividad** o **doce horas desde su apertura**, según ocurra primero, e
  invalida sus credenciales. En la siguiente petición conduce al usuario a la vista de inicio de
  sesión.
- _1b. La contraseña de la cuenta fue restablecida (CU-05)._ El sistema cierra la sesión de
  inmediato, sin esperar ninguna de las dos condiciones de caducidad.
- _1c. El alumno alcanzó el tercer strike._ El sistema cierra la sesión de inmediato y bloquea la
  cuenta (CU-27, reglas de negocio).

**Reglas de negocio**

- El cierre está disponible **en cualquier momento** de la sesión, para ambos roles, y no depende de
  que exista o no una operación en curso.
- Las dos condiciones de caducidad son independientes y aplica **la que se cumpla primero**. Una
  sesión con actividad continua caduca de todos modos a las doce horas. Los plazos rigen por igual
  para ambos roles: el ERF fija los mismos para el alumno (RF4) y para el funcionario (RF6).

---


#### CU-07 · Activar o desactivar el segundo factor de autenticación

| Campo                   | Valor                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Identificador**       | CU-07                                                                                                                    |
| **Actor principal**     | Alumno · Funcionario                                                                                                     |
| **Actores secundarios** | Servicio de correo                                                                                                       |
| **RF cubiertos**        | RF46                                                                                                                     |
| **Precondiciones**      | Sesión abierta y **el usuario ya ingresó al menos una vez**. No se ofrece durante el primer ingreso.                     |
| **Postcondiciones**     | El segundo factor queda activo o inactivo, y el usuario recibe un correo avisándole del cambio.                          |
| **Frecuencia**          | Muy baja.                                                                                                                |

**Flujo principal**

1. El usuario abre la configuración de su cuenta, donde **lee si tiene el segundo factor activo o
   inactivo**.
2. El usuario solicita desactivarlo.
3. El sistema le exige **su contraseña vigente y además el código de seis dígitos** que le envía a su
   correo, con quince minutos de vigencia y tres intentos.
4. El usuario ingresa ambos.
5. El sistema desactiva el segundo factor y **le envía un correo avisándole del cambio**.

**Flujos alternativos**

- _2a. El usuario lo tiene inactivo y quiere activarlo._ El sistema lo activa sin exigir el doble
  requisito del paso 3: **subir la protección de una cuenta no necesita las garantías que sí necesita
  bajarla**. El aviso por correo del paso 5 se envía igual.

**Excepciones**

- _3a. La contraseña no coincide, o el código es incorrecto o expiró._ El sistema rechaza la
  desactivación y el segundo factor **permanece activo**.
- _1a. Es el primer ingreso del usuario._ El sistema no ofrece la opción (CU-03).
- _1b. El usuario tiene rol de administrador._ **El sistema no le ofrece la opción y rechaza la
  operación en el servidor** (RF31, RF46).

**Reglas de negocio**

- Para desactivarlo se exige **la contraseña vigente y un código al correo**, **de modo que quien haya
  tomado una sesión ajena no pueda bajarle la protección a la cuenta**. Ésa es toda la razón del doble
  requisito: el atacante que se sentó frente a una sesión abierta no tiene ni la contraseña ni el
  buzón.
- **El administrador no puede desactivarlo en ningún caso**, porque es la cuenta con más alcance del
  sistema y la única que no tiene otra por encima que la audite (CU-04).

---

#### CU-08 · Cambiar la contraseña

| Campo                   | Valor                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-08                                                                                                     |
| **Actor principal**     | Alumno · Funcionario · Administrador                                                                      |
| **Actores secundarios** | Servicio de correo                                                                                        |
| **RF cubiertos**        | RF47                                                                                                      |
| **Precondiciones**      | Sesión abierta.                                                                                           |
| **Postcondiciones**     | La contraseña queda reemplazada, **toda otra sesión del usuario se cierra** y recibe un correo del cambio. |
| **Frecuencia**          | Baja.                                                                                                     |

**Flujo principal**

1. El usuario abre la configuración de su cuenta y solicita cambiar su contraseña.
2. El usuario escribe **la contraseña vigente y la nueva dos veces**.
3. El sistema valida que la actual coincida, que la nueva cumpla **las seis condiciones del primer
   ingreso** (CU-03) y que no sea igual a la que ya tiene.
4. El sistema aplica el cambio. El usuario **sigue trabajando en la sesión desde la que lo hizo** y
   **cualquier otra sesión suya que estuviera abierta se cierra**.
5. El sistema le envía un correo avisándole del cambio.

**Excepciones**

- _3a. La contraseña actual no coincide._ El sistema rechaza el cambio.
- _3b. La nueva incumple alguna de las seis condiciones._ El sistema la rechaza indicando cuál falló.
- _3c. La nueva es igual a la vigente._ El sistema rechaza el cambio.

**Reglas de negocio**

- El cierre de las demás sesiones es lo que da sentido al caso de uso. Si el motivo del cambio fue
  sospecha de acceso indebido, **dejar viva la sesión del intruso vaciaría la operación de contenido**.
  La sesión propia se conserva para no expulsar al usuario de su propio trámite.
- **El funcionario que ingresa por primera vez con una contraseña temporal no usa este caso de uso**,
  sino el reemplazo obligatorio de CU-31, que ocurre antes de que alcance ninguna pantalla.
- El correo de aviso no es cortesía: es la señal que le permite al titular detectar un cambio que no
  hizo él.

---

### Subsistema B — Alumno: perfil, avisos y consultas

Todos los casos de uso de este subsistema asumen como precondición global una sesión abierta con rol
de alumno (CU-04) y se verifican en servidor sobre cada operación. Ninguno de ellos lee el inventario
de objetos encontrados.

---

#### CU-09 · Completar y consultar los datos personales

| Campo                   | Valor                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-09                                                                                                                     |
| **Actor principal**     | Alumno                                                                                                                    |
| **Actores secundarios** | Rectoría                                                                                                                  |
| **RF cubiertos**        | RF8                                                                                                                       |
| **Precondiciones**      | Sesión abierta con rol de alumno.                                                                                         |
| **Postcondiciones**     | Los datos personales quedan registrados. El rut, el nombre, los apellidos y la carrera quedan **fijos**; la fotografía es reemplazable. |
| **Frecuencia**          | Una vez para el registro inicial; consulta libre y reemplazo de fotografía a demanda.                                      |

**Flujo principal**

1. El alumno abre su perfil. En el primer ingreso el sistema lo conduce aquí directamente (CU-03).
2. El sistema presenta el formulario con rut, nombre, apellidos, carrera y fotografía.
3. El alumno completa los campos y adjunta su fotografía.
4. El sistema valida el **dígito verificador del rut**, que el nombre y los apellidos tengan entre 2
   y 60 caracteres, que la carrera corresponda a la lista fija y que la fotografía sea JPG o PNG de
   hasta 5 MB y de al menos 300 × 300 píxeles.
5. El sistema registra los datos y **fija el rut, el nombre, los apellidos y la carrera**.
6. El sistema habilita la publicación de avisos (CU-10).

**Flujos alternativos**

- _1a. Los datos ya están completos._ El alumno los consulta en modo lectura, con la sola excepción
  de la fotografía, que puede reemplazar cuando quiera repitiendo los pasos 3 a 5 sobre ese campo.
- _5a. Un dato fijo quedó mal registrado._ El alumno no puede corregirlo. **Sólo Rectoría lo
  corrige**, por vía presencial y fuera del alcance de este documento.

**Excepciones**

- _4a. El dígito verificador del rut no valida._ El sistema rechaza el guardado indicando el campo.
- _4b. El nombre o los apellidos están fuera del rango de 2 a 60 caracteres._ El sistema rechaza el
  guardado.
- _4c. La carrera no pertenece a la lista fija._ El sistema rechaza el guardado.
- _4d. La fotografía no es JPG o PNG, excede 5 MB o no alcanza los 300 × 300 píxeles._ El sistema
  rechaza el archivo indicando la condición incumplida.

**Reglas de negocio**

- **Mientras estos datos estén incompletos el alumno no puede publicar ningún aviso.** Es una
  precondición dura de CU-10, no una advertencia.
- Los datos son fijos porque **es contra ellos que el funcionario reconoce al alumno al momento de
  entregarle un objeto** (CU-26). Un rut o un nombre editables por el titular convertirían la
  identificación presencial en un trámite sin respaldo.

---

#### CU-10 · Publicar un aviso de pérdida

| Campo                   | Valor                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-10                                                                                                                                     |
| **Actor principal**     | Alumno                                                                                                                                    |
| **Actores secundarios** | —                                                                                                                                         |
| **RF cubiertos**        | RF9                                                                                                                                       |
| **Precondiciones**      | Sesión abierta con rol de alumno, **datos personales completos** (CU-09), cuenta **no bloqueada** y menos de cinco avisos abiertos.        |
| **Postcondiciones**     | El aviso queda registrado con su fecha y hora en estado **publicado**, disponible para los funcionarios y visible para nadie más que su autor. |
| **Frecuencia**          | Eventual; hasta cinco avisos abiertos por alumno de forma simultánea.                                                                     |

**Flujo principal**

1. El alumno inicia la publicación de un aviso de pérdida.
2. El sistema presenta el formulario con **campos separados y no un texto libre**: tipo de objeto de
   una lista fija, color, marca o señas particulares de 20 a 500 caracteres, recinto donde lo perdió
   de una lista fija, fecha de la pérdida, y una fotografía **opcional** del objeto en JPG o PNG de
   hasta 5 MB.
3. El alumno completa los campos obligatorios y adjunta la fotografía si la tiene.
4. El sistema valida que no falte ningún campo obligatorio, que la fecha no sea futura ni anterior a
   180 días, que la imagen respete formato y peso, y que el alumno no tenga ya cinco avisos abiertos.
5. El sistema invoca **CU-11** para la confirmación previa.
6. Confirmado el aviso, el sistema lo registra con su fecha y hora en estado **publicado**, lo pone
   a disposición de los funcionarios de todas las sedes y lo deja **visible únicamente para su
   autor**.
7. El sistema **avisa por correo a los funcionarios de la sede correspondiente al recinto
   declarado**, indicando el tipo de objeto, el lugar y la fecha de la pérdida y un enlace directo al
   aviso (RF19). Con la sesión abierta, el aviso les aparece además en pantalla dentro de los cinco
   segundos siguientes.

**Flujos alternativos**

- _1a. Los datos personales del alumno están incompletos._ El sistema no permite iniciar la
  publicación y lo conduce a **CU-09**.
- _3a. El alumno no tiene fotografía del objeto._ La publica sin ella: el campo es opcional y el
  aviso queda igualmente válido para el cruce del funcionario.

**Excepciones**

- _4a. Falta un campo obligatorio._ El sistema rechaza el aviso indicando cuál.
- _4b. La fecha de la pérdida es futura o anterior a 180 días._ El sistema rechaza el aviso.
- _4c. La imagen excede el formato o el peso permitidos._ El sistema rechaza el archivo.
- _4d. El alumno ya tiene cinco avisos abiertos._ El sistema rechaza la publicación e indica que
  debe cerrar alguno (CU-13) para publicar otro.
- _1b. La cuenta está bloqueada por tres strikes._ El alumno no alcanza esta función: no tiene
  sesión posible (CU-27, reglas de negocio).

**Reglas de negocio**

- **Los campos son separados y no un texto libre porque es sobre esos campos que el funcionario
  compara después** (CU-22). Un párrafo redactado por el alumno no es cruzable de forma consistente.
- **El alumno no visualiza en ningún momento los objetos en depósito**, ni su fotografía,
  descripción, ubicación o cantidad, y no dispone de búsqueda ni de filtros sobre ellos. Esta es la
  restricción central del sistema.
- El aviso **no es visible para otros alumnos**. El «foro» existe sólo del lado del funcionario
  (CU-21).

---

#### CU-11 · Confirmar el aviso antes de publicarlo

| Campo                   | Valor                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-11                                                                                                     |
| **Actor principal**     | Alumno                                                                                                    |
| **Actores secundarios** | —                                                                                                         |
| **RF cubiertos**        | RF10                                                                                                      |
| **Precondiciones**      | El alumno completó el formulario de un aviso y éste pasó las validaciones (CU-10).                        |
| **Postcondiciones**     | El aviso queda registrado y **congelado**: ni su descripción ni su fotografía admiten modificación alguna. |
| **Frecuencia**          | Una vez por aviso, con retornos ilimitados antes de confirmar.                                            |

**Flujo principal**

1. El sistema presenta una pantalla de confirmación con **todo lo que está por publicarse, campo por
   campo**, y con la fotografía adjunta si la incorporó.
2. El sistema muestra la **advertencia explícita** de que una vez enviado no lo va a poder editar y
   de que revise que esté todo correcto.
3. El alumno revisa el contenido.
4. El alumno confirma de forma expresa.
5. El sistema registra el aviso y **cierra la edición de forma definitiva**.

**Flujos alternativos**

- _3a. El alumno detecta un error._ Vuelve atrás desde esa misma pantalla y corrige cualquier campo,
  **cuantas veces necesite**, retornando luego al paso 1.
- _5a. El aviso ya registrado contiene un error real._ El alumno **no puede editarlo**. Lo cierra
  (CU-13) y publica uno nuevo (CU-10), y el sistema **deja ambos enlazados** para que el funcionario
  vea esa corrección al evaluar el reclamo.

**Reglas de negocio**

- Desde el instante de la confirmación, **ni la descripción ni la fotografía admiten modificación
  alguna, ni por el alumno ni por el funcionario**. El aviso es evidencia, no contenido editable.
- Este caso de uso es **incluido y obligatorio** en CU-10. No hay vía de publicación que lo omita,
  precisamente porque el resultado es irreversible.

---

#### CU-12 · Consultar el estado de los avisos propios

| Campo                   | Valor                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-12                                                                                                          |
| **Actor principal**     | Alumno                                                                                                         |
| **Actores secundarios** | —                                                                                                              |
| **RF cubiertos**        | RF11                                                                                                           |
| **Precondiciones**      | Sesión abierta con rol de alumno y al menos un aviso publicado.                                                |
| **Postcondiciones**     | Ninguna. Es una consulta y no altera el estado del sistema.                                                    |
| **Frecuencia**          | Alta durante un proceso de búsqueda activo.                                                                    |

**Flujo principal**

1. El alumno abre la vista de sus avisos.
2. El sistema muestra el estado de cada uno, que es siempre uno de estos seis: **publicado, citado,
   entregado, rechazado, cerrado o inactivo**.
3. Para un aviso en estado **citado**, el sistema muestra la **misma sede, el mismo lugar y el mismo
   horario que indica el correo de citación**, sin agregar información.

**Flujos alternativos**

- _3a. El alumno decide cerrar un aviso._ Ejecuta **CU-13**.

**Reglas de negocio**

- **La aplicación no le informa al alumno que se encontró un objeto, no describe nada y no le
  adelanta el avance del funcionario.** La citación llega por correo y el estado del aviso sólo
  refleja lo que ya se le comunicó por esa vía.
- El estado lo mueven el funcionario y el sistema. **La única transición que el alumno origina por su
  cuenta es el cierre del aviso** (CU-13).
- Un aviso permanece en **publicado** mientras ningún funcionario haya actuado sobre él, y pasa a
  **citado** en el momento en que un funcionario le envía el correo solicitando su presencia (CU-23,
  CU-24).

---

#### CU-13 · Cerrar un aviso propio

| Campo                   | Valor                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-13                                                                                                     |
| **Actor principal**     | Alumno                                                                                                    |
| **Actores secundarios** | —                                                                                                         |
| **RF cubiertos**        | RF12                                                                                                      |
| **Precondiciones**      | Sesión abierta con rol de alumno y un aviso propio que **no esté en estado entregado**.                   |
| **Postcondiciones**     | El aviso queda en estado **cerrado**, retirado de la lista de trabajo de los funcionarios y conservado en el historial con su motivo, comentario y fecha. |
| **Frecuencia**          | Eventual.                                                                                                 |

**Flujo principal**

1. El alumno selecciona un aviso propio y solicita cerrarlo.
2. El sistema presenta la lista fija de motivos, que incluye **haber recuperado el objeto por sus
   propios medios** y **haber cometido un error al declarar**.
3. El alumno selecciona un motivo y, si lo desea, agrega un comentario de hasta 200 caracteres.
4. El sistema exige una **confirmación explícita**.
5. El alumno confirma.
6. El sistema deja el aviso en estado **cerrado**, lo **retira de la lista de trabajo de los
   funcionarios** y lo conserva en el historial del alumno con su motivo, su comentario y su fecha de
   cierre.

**Flujos alternativos**

- _3a. El motivo es un error al declarar._ Tras el cierre el alumno publica un aviso nuevo (CU-10) y
  el sistema deja ambos enlazados (CU-11, regla 5a).

**Excepciones**

- _1a. El aviso ya está en estado entregado._ El sistema rechaza la operación: el objeto ya se
  entregó y el registro es definitivo.
- _5a. El alumno no confirma._ El aviso permanece en su estado anterior.

**Reglas de negocio**

- **El cierre es definitivo y el aviso no se puede reabrir.** De ahí la confirmación explícita del
  paso 4.
- Cerrar un aviso libera una de las cinco posiciones abiertas del alumno (CU-10, excepción 4d).

---

#### CU-14 · Consultar el historial de avisos publicados

| Campo                   | Valor                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-14                                                                                       |
| **Actor principal**     | Alumno                                                                                      |
| **Actores secundarios** | —                                                                                           |
| **RF cubiertos**        | RF13                                                                                        |
| **Precondiciones**      | Sesión abierta con rol de alumno.                                                           |
| **Postcondiciones**     | Ninguna. El listado es de **solo lectura**.                                                 |
| **Frecuencia**          | Eventual.                                                                                   |

**Flujo principal**

1. El alumno abre el historial de sus avisos.
2. El sistema presenta **todos** los avisos que ha publicado —vigentes, cerrados y entregados—
   mostrando de cada uno su fecha de publicación, su estado actual y la fecha del último cambio de
   estado.
3. El sistema ordena el listado por **fecha de publicación descendente**, en **páginas de veinte
   avisos**.
4. El alumno filtra por estado y por rango de fechas, y abre el detalle de cualquier aviso.

**Reglas de negocio**

- **El listado es de solo lectura: el alumno no puede editar ni eliminar un aviso ya publicado.**
- Este historial es distinto del de retiros (CU-15): **aquí queda constancia de lo que el alumno
  declaró haber perdido**, allá de lo que la Universidad efectivamente le entregó.

---

#### CU-15 · Consultar el historial de retiros

| Campo                   | Valor                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| **Identificador**       | CU-15                                                                                     |
| **Actor principal**     | Alumno                                                                                    |
| **Actores secundarios** | —                                                                                         |
| **RF cubiertos**        | RF14                                                                                      |
| **Precondiciones**      | Sesión abierta con rol de alumno.                                                         |
| **Postcondiciones**     | Ninguna. El registro es de **solo lectura** y no admite eliminación ni edición.           |
| **Frecuencia**          | Baja.                                                                                     |

**Flujo principal**

1. El alumno abre el historial de retiros.
2. El sistema presenta los objetos que **efectivamente retiró**, mostrando de cada uno la fecha y
   hora del retiro, el recinto donde se realizó, el **funcionario que se lo entregó** y el aviso que
   le dio origen.
3. El sistema ordena el listado por **fecha de retiro descendente**, en **páginas de veinte
   registros**.

**Reglas de negocio**

- El registro **no admite eliminación ni edición por parte del alumno, porque constituye el respaldo
  de la entrega frente a la Universidad.** Es la contraparte del historial del objeto que ve el
  funcionario (CU-20).
- Cada fila de este historial se origina en una entrega registrada en CU-26, nunca en una acción del
  alumno.

---

#### CU-16 · Consultar los strikes recibidos

| Campo                   | Valor                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-16                                                                                                     |
| **Actor principal**     | Alumno                                                                                                    |
| **Actores secundarios** | —                                                                                                         |
| **RF cubiertos**        | RF27                                                                                                      |
| **Precondiciones**      | Sesión abierta con rol de alumno.                                                                         |
| **Postcondiciones**     | Ninguna. Los strikes no son modificables ni eliminables por el alumno.                                    |
| **Frecuencia**          | Eventual; el contador está visible de forma permanente.                                                   |

**Flujo principal**

1. El alumno abre la vista de sus strikes.
2. El sistema presenta **la totalidad de los strikes** que le han sido asignados, con la fecha y hora
   de cada uno, **el motivo escrito por el funcionario**, el funcionario que lo asignó y el aviso o
   reclamo que lo originó.
3. El sistema muestra **de forma permanente y visible cuántos strikes acumula sobre un total de tres
   y cuántos le restan para el bloqueo**.
4. El sistema le indica que **las objeciones se presentan presencialmente en Rectoría**.

**Reglas de negocio**

- **Los strikes no caducan con el paso del tiempo ni se reinician por período académico.** El
  contador sólo vuelve a cero cuando Rectoría desbloquea la cuenta.
- El alumno **no puede modificarlos ni eliminarlos**, y tampoco puede hacerlo el funcionario que los
  asignó (CU-28).
- El motivo escrito por el funcionario **es visible para el sancionado** (CU-27). La sanción no es
  opaca: el alumno sabe exactamente qué se le imputa.

---

#### CU-17 · Consultar el centro de notificaciones

| Campo                   | Valor                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-17                                                                                                          |
| **Actor principal**     | Alumno                                                                                                         |
| **Actores secundarios** | —                                                                                                              |
| **RF cubiertos**        | RF30                                                                                                           |
| **Precondiciones**      | Sesión abierta con rol de alumno.                                                                              |
| **Postcondiciones**     | Las notificaciones consultadas quedan marcadas como leídas y el contador de pendientes se actualiza.           |
| **Frecuencia**          | Alta durante un proceso de búsqueda activo.                                                                    |

**Flujo principal**

1. El sistema genera una notificación, en condición de **no leída**, cada vez que ocurre uno de los
   cuatro hechos notificables: un funcionario **registra una coincidencia** con alguno de sus avisos,
   uno de sus objetos **queda listo para retiro** (CU-23), **un reclamo suyo es rechazado** o **se le
   asigna un strike** (CU-27).
2. El sistema muestra de forma permanente un **contador de notificaciones pendientes**.
3. El alumno abre el centro de notificaciones.
4. El sistema lista las notificaciones con su fecha y hora, su tipo, **el aviso al que corresponden**
   y su condición de leída o no leída.
5. El alumno abre una notificación y el sistema la marca como leída, actualizando el contador.

**Flujos alternativos**

- _1a. El alumno tiene la sesión abierta cuando ocurre el hecho._ La notificación **aparece en
  pantalla dentro de los cinco segundos siguientes** al hecho.
- _1b. El alumno no tenía sesión abierta._ El sistema **conserva la notificación** y el alumno la
  recupera **como no leída** al volver a entrar.

**Reglas de negocio**

- **Ninguna notificación describe el objeto encontrado.** Informa que hubo una coincidencia, que hay
  un objeto listo para retiro, que un reclamo fue rechazado o que se asignó un strike, y nada más.
- **El alumno no puede desactivar las notificaciones de coincidencia, de retiro ni de strike.**
- Las notificaciones **se conservan mientras exista la cuenta**.

---

### Subsistema C — Funcionario: inventario y foro

Todos los casos de uso de este subsistema asumen como precondición global una sesión abierta con rol
de funcionario y una sede asignada (CU-04). Rige aquí la doble frontera del apartado 1.3: **la
consulta alcanza toda la Universidad, la acción sólo la sede propia** (RF7).

---

#### CU-18 · Ingresar un objeto encontrado al inventario

| Campo                   | Valor                                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-18                                                                                                                                        |
| **Actor principal**     | Funcionario                                                                                                                                  |
| **Actores secundarios** | —                                                                                                                                            |
| **RF cubiertos**        | RF15, RF7                                                                                                                                    |
| **Precondiciones**      | Sesión abierta con rol de funcionario. El objeto llegó **físicamente a su sede asignada**.                                                    |
| **Postcondiciones**     | El objeto queda en el inventario en estado **disponible**, asociado a la sede del funcionario, con su fecha, hora y responsable de ingreso, y visible de inmediato para los funcionarios de **todas** las sedes. |
| **Frecuencia**          | Varias veces al día en sedes de alto tránsito.                                                                                               |

**Flujo principal**

1. El funcionario inicia el registro de un objeto encontrado.
2. El sistema presenta el formulario: tipo de una lista fija, color, marcas o señas particulares de
   20 a 500 caracteres, lugar del hallazgo de una lista fija, fecha de recepción, nombre de quien lo
   entregó **cuando esa persona se identifica**, y **al menos una fotografía** en JPG o PNG de hasta
   5 MB.
3. El funcionario completa los campos y adjunta la fotografía.
4. El sistema valida que no falte ningún campo obligatorio ni la fotografía, y que la fecha de
   recepción no sea futura.
5. El sistema registra el objeto en estado **disponible**, lo asocia a la **sede del funcionario** y
   deja constancia de la fecha, la hora y el responsable del ingreso.
6. El sistema lo hace visible **de inmediato para los funcionarios de todas las sedes** (CU-19).

**Flujos alternativos**

- _3a. Quien entregó el objeto no se identifica._ El funcionario omite ese campo, que es el único no
  obligatorio junto al color según el criterio de la lista, y el registro procede igual.

**Excepciones**

- _4a. Falta un campo obligatorio._ El sistema rechaza el registro indicando cuál.
- _4b. No se adjuntó ninguna fotografía._ El sistema rechaza el registro. **La fotografía es
  obligatoria aquí**, a diferencia del aviso del alumno (CU-10), porque es el respaldo visual de la
  custodia.
- _4c. La fecha de recepción es futura._ El sistema rechaza el registro.
- _4d. Las señas particulares no alcanzan los 20 caracteres._ El sistema rechaza el registro: una
  descripción pobre inutiliza el cruce posterior (CU-22).

**Reglas de negocio**

- El objeto queda asociado a **la sede del funcionario que lo ingresa**, no a una sede
  seleccionable. Quien lo registra es quien responde por su custodia.
- La visibilidad inmediata para todas las sedes es lo que permite después avisarle a un alumno que su
  objeto está en un recinto distinto del que frecuenta (CU-19, CU-23).

---

#### CU-19 · Consultar el inventario general

| Campo                   | Valor                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-19                                                                                                     |
| **Actor principal**     | Funcionario                                                                                               |
| **Actores secundarios** | —                                                                                                         |
| **RF cubiertos**        | RF16                                                                                                      |
| **Precondiciones**      | Sesión abierta con rol de funcionario.                                                                    |
| **Postcondiciones**     | Ninguna. Es una consulta y no altera el estado del sistema.                                               |
| **Frecuencia**          | Alta, diaria.                                                                                             |

**Flujo principal**

1. El funcionario abre el inventario.
2. El sistema presenta el **inventario completo de objetos de todas las sedes**, mostrando de cada
   uno su tipo, color, señas, fotografía, **sede donde está depositado**, fecha de ingreso,
   **antigüedad en custodia** y estado.
3. El sistema pagina el listado en **páginas de veinte objetos**.
4. El funcionario filtra por sede, tipo, estado y rango de fechas de ingreso, y ordena por antigüedad
   o por fecha de ingreso.

**Flujos alternativos**

- _4a. El funcionario quiere ver el detalle completo de un objeto._ Ejecuta **CU-20**.
- _4b. El funcionario quiere cruzar un objeto contra los avisos._ Ejecuta **CU-22**.

**Reglas de negocio**

- **La consulta es transversal a la Universidad y no se restringe a la sede propia**, para que el
  funcionario pueda reconocer un objeto declarado por un alumno aunque esté depositado en otro
  recinto.
- Poder consultar un objeto de otra sede **no habilita a actuar sobre él**: la citación, la entrega y
  el strike quedan reservados a la sede de custodia (CU-23, CU-26, CU-27).

---

#### CU-20 · Consultar el detalle y el historial de un objeto

| Campo                   | Valor                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-20                                                                                                     |
| **Actor principal**     | Funcionario                                                                                               |
| **Actores secundarios** | —                                                                                                         |
| **RF cubiertos**        | RF17                                                                                                      |
| **Precondiciones**      | Sesión abierta con rol de funcionario y un objeto seleccionado del inventario (CU-19).                    |
| **Postcondiciones**     | Ninguna. El historial es de **solo lectura**.                                                             |
| **Frecuencia**          | Alta durante la gestión de un reclamo.                                                                    |

**Flujo principal**

1. El funcionario abre el detalle de un objeto del inventario, **de cualquier sede**.
2. El sistema presenta su historial completo: **quién lo ingresó y cuándo**, las citaciones enviadas
   a raíz de él, las verificaciones realizadas **con su resultado y su responsable**, y la entrega si
   ya ocurrió, con su fecha y el funcionario que la autorizó.

**Reglas de negocio**

- **El historial es de solo lectura y ningún funcionario puede editarlo ni eliminar registros de él,
  porque constituye el respaldo de la actuación de la Universidad sobre ese objeto frente a un
  eventual reclamo.** Esto incluye al funcionario que generó cada registro.
- Es la contraparte institucional del historial de retiros del alumno (CU-15): ambos describen la
  misma entrega desde los dos lados.

---

#### CU-21 · Consultar el foro de avisos de pérdida

| Campo                   | Valor                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-21                                                                                                          |
| **Actor principal**     | Funcionario                                                                                                    |
| **Actores secundarios** | —                                                                                                              |
| **RF cubiertos**        | RF18                                                                                                           |
| **Postcondiciones**     | Ninguna. Es una consulta y no altera el estado del sistema.                                                    |
| **Precondiciones**      | Sesión abierta con rol de funcionario.                                                                         |
| **Frecuencia**          | Alta, diaria.                                                                                                  |

**Flujo principal**

1. El funcionario abre el foro de avisos.
2. El sistema presenta **la totalidad de los avisos de pérdida publicados por los alumnos de la
   Universidad**, mostrando de cada uno el tipo de objeto, el color, las señas declaradas, el lugar y
   la fecha de la pérdida, la fotografía cuando el alumno la adjuntó, **el alumno que lo publicó**,
   el estado del aviso y su fecha de publicación.
3. El sistema pagina el foro en **páginas de veinte avisos** y **excluye del listado los avisos
   cerrados, entregados e inactivos**.
4. El funcionario filtra por tipo, lugar, estado y rango de fechas, y ordena por fecha de
   publicación.

**Flujos alternativos**

- _3a. El funcionario necesita ver avisos cerrados, entregados o inactivos._ Los solicita
  **expresamente mediante el filtro de estado**, y el sistema los incluye.
- _4a. El funcionario determina que un aviso corresponde a un objeto de su sede._ Ejecuta **CU-23**
  o **CU-24** según baste o no la evidencia declarada.

**Reglas de negocio**

- El foro es una vista **exclusiva del funcionario**. Ningún alumno ve los avisos de otro alumno
  (CU-10).
- La exclusión por defecto de los avisos cerrados, entregados e inactivos mantiene el foro como
  **lista de trabajo** y no como archivo histórico.
- **Aviso por correo de publicaciones en su sede (RF19).** Cada vez que se publica un aviso cuyo
  lugar declarado corresponde a su sede, el funcionario recibe un correo con el tipo de objeto, el
  lugar, la fecha y un enlace directo, y con la sesión abierta lo ve en pantalla dentro de los cinco
  segundos, junto a un contador de avisos sin revisar. **No puede desactivar ese correo, porque es el
  mecanismo que garantiza que ningún aviso quede sin mirar.** A diferencia de las citaciones al
  alumno, este correo **sí describe el objeto declarado**: la asimetría de información opera en un
  solo sentido.

---

#### CU-22 · Buscar coincidencias entre un objeto y los avisos

| Campo                   | Valor                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Identificador**       | CU-22                                                                                                                    |
| **Actor principal**     | Funcionario                                                                                                              |
| **Actores secundarios** | —                                                                                                                        |
| **RF cubiertos**        | RF20                                                                                                                     |
| **Precondiciones**      | Sesión abierta con rol de funcionario y un objeto del inventario seleccionado (CU-19).                                   |
| **Postcondiciones**     | Ninguna sobre el estado de los avisos ni de los objetos. **El sistema no da por encontrada ninguna coincidencia.**        |
| **Frecuencia**          | Una o más veces por objeto ingresado.                                                                                    |

**Flujo principal**

1. El funcionario, situado sobre un objeto del inventario, solicita al sistema los avisos que podrían
   corresponderle.
2. El sistema calcula el grado de coincidencia sobre **el tipo de objeto, el color, las señas
   declaradas, la cercanía entre el lugar del hallazgo y el lugar de la pérdida, y la proximidad
   entre ambas fechas**.
3. El sistema devuelve una lista de **hasta veinte candidatos ordenada por grado de coincidencia**,
   **excluyendo los avisos cerrados, entregados e inactivos**.
4. El funcionario revisa cada candidato y determina si corresponde continuar.

**Flujos alternativos**

- _4a. El funcionario determina que un candidato corresponde._ Ejecuta **CU-23** si el objeto está en
  su sede, o **CU-24** si la descripción del aviso no basta por sí sola.
- _4b. Ningún candidato corresponde._ El objeto permanece en estado disponible y el funcionario puede
  repetir la búsqueda más adelante, a medida que se publiquen avisos nuevos.
- _3a. El objeto está depositado en otra sede._ La búsqueda procede igual —es una consulta— pero la
  citación queda reservada al funcionario de la sede de custodia (RF7).

**Reglas de negocio**

- **La lista es una ayuda de búsqueda y no una resolución.** El sistema no da por encontrada ninguna
  coincidencia ni cita a nadie por su cuenta.
- El sistema **no sugiere ni prioriza una decisión**: ordena por grado de coincidencia y nada más. La
  determinación es del funcionario y queda a su nombre (CU-25).
- El tope de veinte candidatos es una restricción de la herramienta, no del universo de avisos: un
  aviso que no aparezca en la lista sigue estando en el foro (CU-21).

---

### Subsistema D — Funcionario: citación, entrega y sanción

Este subsistema es el único punto donde el mundo del alumno y el del inventario se cruzan, y por eso
concentra las restricciones más duras del sistema. Las acciones de este bloque **sólo proceden sobre
objetos depositados en la sede asignada del funcionario** (RF7), y el sistema las rechaza sobre un
objeto de otra sede aunque el funcionario pueda consultarlo.

---

#### CU-23 · Citar al alumno para retirar un objeto

| Campo                   | Valor                                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-23                                                                                                                                        |
| **Actor principal**     | Funcionario                                                                                                                                  |
| **Actores secundarios** | Servicio de correo                                                                                                                  |
| **RF cubiertos**        | RF21, RF7                                                                                                                                    |
| **Precondiciones**      | Sesión abierta con rol de funcionario. Existe un aviso que el funcionario **ha determinado que corresponde a un objeto de su sede**, y el objeto está en estado disponible. |
| **Postcondiciones**     | El aviso pasa a estado **citado**, el objeto queda **reservado** y el sistema **impide citar a otro alumno por el mismo objeto** mientras esa citación siga vigente. |
| **Frecuencia**          | Varias veces por semana.                                                                                                                     |

**Flujo principal**

1. El funcionario, situado sobre un aviso que determinó que corresponde a un objeto de su sede
   (CU-21, CU-22), ejecuta la **acción única** de citar.
2. El sistema compone el correo de citación, que informa al alumno **que se encontró un objeto que
   corresponde a su aviso** y solicita su presencia en la sede, **con el lugar exacto y el horario de
   atención**.
3. El servicio de correo entrega la citación al alumno.
4. El sistema deja el aviso en estado **citado**, **reserva el objeto** y bloquea la citación de
   cualquier otro alumno por ese mismo objeto mientras la citación siga vigente.
5. El sistema genera la notificación en plataforma para el alumno (CU-17).
6. El alumno se presenta en la sede y el funcionario ejecuta **CU-25**.

**Flujos alternativos**

- _1a. La descripción del aviso no basta por sí sola para dar la propiedad por probable._ El
  funcionario ejecuta **CU-24** en lugar de este caso de uso.
- _6a. El alumno no se presenta._ Aplica el mismo régimen de caducidad que en CU-24: a los diez días
  hábiles la citación caduca, el objeto vuelve a **disponible** y el aviso regresa a **publicado**.

**Excepciones**

- _1b. El objeto está depositado en otra sede._ El sistema **rechaza la citación** (RF7). Corresponde
  al funcionario de la sede de custodia.
- _1c. El objeto ya está reservado por una citación vigente de otro alumno._ El sistema rechaza la
  operación.
- _1d. El aviso está en estado cerrado, entregado o inactivo._ El sistema rechaza la citación.

**Reglas de negocio**

- **El correo no describe el objeto ni adjunta su fotografía**, porque revelar esos detalles le
  entregaría al alumno la información con la que después debe acreditar la propiedad (CU-25).
- La reserva del objeto es lo que impide citar a dos alumnos por la misma cosa y que ambos se
  presenten a reclamarla.
- La citación es una **acción única**: un solo gesto del funcionario compone el correo, mueve el
  estado del aviso y reserva el objeto. No es una secuencia de pasos que pueda quedar a medias.

---

#### CU-24 · Citar al alumno a verificación presencial

| Campo                   | Valor                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-24                                                                                                                     |
| **Actor principal**     | Funcionario                                                                                                               |
| **Actores secundarios** | Servicio de correo                                                                                               |
| **RF cubiertos**        | RF22, RF7                                                                                                                 |
| **Precondiciones**      | Sesión abierta con rol de funcionario. Existe un aviso candidato y un objeto de su sede en estado disponible, y **la descripción del aviso no basta por sí sola**. |
| **Postcondiciones**     | El aviso pasa a estado **citado** y el objeto queda **reservado**, en las mismas condiciones que en CU-23 y sin que el alumno pueda distinguir una citación de la otra. |
| **Frecuencia**          | Varias veces por semana.                                                                                                  |

**Flujo principal**

1. El funcionario determina que la descripción del aviso no basta por sí sola para dar la propiedad
   por probable, y elige esta citación como **alternativa a la de retiro**.
2. El sistema le exige registrar, **con al menos 20 caracteres, por qué consideró insuficiente la
   evidencia**.
3. El funcionario escribe ese motivo.
4. El sistema compone el correo, que informa al alumno que **debe presentarse a acreditar la
   propiedad de un objeto, sin identificar cuál ni describirlo**.
5. El servicio de correo entrega la citación.
6. El sistema deja el aviso en estado **citado** y **reserva el objeto**.
7. El alumno se presenta en la sede y el funcionario ejecuta **CU-25**.

**Flujos alternativos**

- _7a. El alumno no se presenta dentro de los diez días hábiles siguientes._ **La citación caduca**:
  el sistema devuelve el objeto a estado **disponible**, con lo que vuelve a ser cruzable con otros
  avisos (CU-22), y devuelve el aviso a estado **publicado**, con lo que reaparece en el foro
  (CU-21). El alumno no pierde su declaración por no haber asistido.

**Excepciones**

- _2a. El motivo falta o no alcanza los 20 caracteres._ El sistema **rechaza el envío** de la
  citación.
- _1a. El objeto está depositado en otra sede._ El sistema rechaza la citación (RF7).
- _1b. El objeto ya está reservado por una citación vigente._ El sistema rechaza la operación.

**Reglas de negocio**

- **El alumno no puede distinguir esta citación de la que se envía cuando la evidencia sí basta**,
  porque saber cuán convencido está el funcionario le permitiría prepararse. Los dos correos son
  indistinguibles desde su lado, y el estado del aviso es el mismo —**citado**— en ambos casos
  (CU-12).
- El motivo de 20 caracteres no es un trámite: **es el registro de por qué el funcionario dudó**, y
  queda como antecedente de su actuación en el historial del objeto (CU-20).

---


#### CU-25 · Registrar el resultado de la verificación presencial

| Campo                   | Valor                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-25                                                                                                                                          |
| **Actor principal**     | Funcionario                                                                                                                                    |
| **Actores secundarios** | —                                                                                                                                              |
| **RF cubiertos**        | RF23                                                                                                                                           |
| **Precondiciones**      | Sesión abierta con rol de funcionario. Existe un objeto citado de su sede y el alumno se presentó.                                              |
| **Postcondiciones**     | La resolución queda asociada **de forma permanente al objeto, al aviso y al funcionario que resolvió**, y habilita la entrega (CU-26) o la asignación de un strike (CU-27). |
| **Frecuencia**          | Una vez por citación atendida.                                                                                                                 |

**Flujo principal**

1. El funcionario abre la vista de verificación del objeto citado.
2. El sistema presenta **en una misma vista** todos los antecedentes: **el contenido íntegro del
   aviso publicado por el alumno**, **los datos de identidad y la fotografía de su perfil** (CU-09),
   **el detalle del objeto en depósito** y **la cantidad de strikes que esa persona acumula**
   (CU-28).
3. El funcionario identifica al alumno contra los datos y la fotografía de su perfil, y contrasta la
   descripción del aviso con el objeto que tiene en custodia.
4. El sistema le exige registrar, **con al menos 20 caracteres, qué antecedentes solicitó y qué
   obtuvo**, y **mantiene la resolución deshabilitada mientras ese registro esté vacío**.
5. El funcionario escribe ese registro.
6. El funcionario ingresa la resolución, que admite **sólo dos valores**: **propiedad acreditada** o
   **propiedad no acreditada**.
7. El sistema asocia la resolución de forma permanente al objeto, al aviso y al funcionario que
   resolvió.
8. Según el valor ingresado, el sistema habilita **CU-26** (propiedad acreditada) o **CU-27**
   (propiedad no acreditada).

**Flujos alternativos**

- _6a. La resolución es propiedad acreditada._ El funcionario continúa con **CU-26**.
- _6b. La resolución es propiedad no acreditada._ El funcionario puede ejecutar **CU-27**, pero no
  está obligado a hacerlo: la asignación del strike es una acción deliberada y separada.

**Excepciones**

- _4a. El registro de antecedentes falta o no alcanza los 20 caracteres._ **La resolución permanece
  deshabilitada** y el funcionario no puede resolver.
- _1a. El objeto pertenece a otra sede._ El sistema rechaza la operación (RF7).

**Reglas de negocio**

- **El sistema no calcula la resolución, no la sugiere ni la condiciona por ningún medio.** Los dos
  valores están disponibles por igual, sin importar el grado de coincidencia que arrojó CU-22 ni los
  strikes previos del alumno.
- La exhibición de los strikes acumulados en el paso 2 está **disponible antes de resolver, porque un
  historial previo de intentos es un antecedente legítimo para decidir** (RF26). Es un antecedente,
  no una regla: tres reclamos previos fallidos no determinan la resolución del cuarto.
- La resolución **queda a nombre del funcionario que resolvió**, de forma permanente y no editable
  (CU-20). Es el punto donde el sistema documenta una decisión humana en lugar de tomarla.

---

#### CU-26 · Entregar el objeto y descontarlo del inventario

| Campo                   | Valor                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Identificador**       | CU-26                                                                                                                                            |
| **Actor principal**     | Funcionario                                                                                                                                      |
| **Actores secundarios** | —                                                                                                                                                |
| **RF cubiertos**        | RF24, RF7                                                                                                                                        |
| **Precondiciones**      | Existe una verificación de su sede cuya **resolución registrada es propiedad acreditada** (CU-25).                                               |
| **Postcondiciones**     | El objeto queda **descontado del inventario** en estado **entregado**, el aviso pasa a estado **entregado**, y queda registro permanente en el historial del objeto y en el historial de retiros del alumno. |
| **Frecuencia**          | Varias veces por semana.                                                                                                                         |

**Flujo principal**

1. El funcionario, desde una verificación con resolución **propiedad acreditada**, registra la
   entrega del objeto al alumno.
2. El sistema exige una **confirmación explícita**, porque la operación es **definitiva y no admite
   reversa**.
3. El funcionario confirma.
4. El sistema **descuenta el objeto del inventario** y lo deja en estado **entregado**, con lo que
   deja de figurar entre los disponibles y de aparecer en las búsquedas de coincidencia (CU-22).
5. El sistema deja el aviso del alumno en estado **entregado**.
6. El sistema registra de forma permanente **la fecha, la hora, la sede, el funcionario que autorizó
   la entrega y el aviso que le dio origen**, tanto en el **historial del objeto** (CU-20) como en el
   **historial de retiros del alumno** (CU-15).
7. El sistema genera la notificación para el alumno (CU-17).

**Excepciones**

- _1a. La resolución registrada es propiedad no acreditada._ El sistema **no habilita la entrega**.
- _1b. No existe una verificación registrada para ese objeto._ El sistema no habilita la entrega: no
  hay vía de entrega que omita CU-25.
- _1c. El objeto pertenece a otra sede._ El sistema rechaza la operación (RF7).
- _3a. El funcionario no confirma._ La entrega no se ejecuta y el objeto permanece reservado.

**Reglas de negocio**

- **La operación es definitiva y no admite reversa.** De ahí la confirmación explícita del paso 2, y
  de ahí también que el aviso entregado no pueda cerrarse después por el alumno (CU-13, excepción
  1a).
- El registro doble del paso 6 —del lado del objeto y del lado del alumno— es lo que permite
  reconstruir una entrega desde cualquiera de los dos extremos ante un reclamo posterior.

---

#### CU-27 · Asignar un strike

| Campo                   | Valor                                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-27                                                                                                                                    |
| **Actor principal**     | Funcionario                                                                                                                              |
| **Actores secundarios** | —                                                                                                                                        |
| **RF cubiertos**        | RF25, RF7                                                                                                                                |
| **Precondiciones**      | Existe una verificación de su sede cuya **resolución registrada es propiedad no acreditada** (CU-25).                                    |
| **Postcondiciones**     | El strike queda registrado con su fecha, su motivo, el funcionario que lo asignó y el aviso que lo originó; el alumno recibe la notificación; **el objeto vuelve a estado disponible** y **el aviso pasa a estado rechazado**. |
| **Frecuencia**          | Baja. Es una sanción, no un resultado ordinario.                                                                                         |

**Flujo principal**

1. El funcionario, desde una verificación con resolución **propiedad no acreditada**, decide asignar
   un strike.
2. El sistema exige un **motivo de entre 20 y 500 caracteres**, advirtiendo que **queda visible para
   el sancionado**.
3. El funcionario escribe el motivo.
4. El sistema registra el strike con su fecha, su motivo, el funcionario que lo asignó y el aviso que
   lo originó.
5. El sistema devuelve el objeto a estado **disponible** y deja el aviso en estado **rechazado**.
6. El sistema genera la notificación para el alumno (CU-17).
7. Si el strike asignado es **el tercero**, el sistema **bloquea la cuenta del alumno de forma
   automática e inmediata**, cierra la sesión que tuviera abierta, **da de baja todos sus avisos
   pendientes** —que pasan a estado **inactivo** y dejan de figurar en el foro y en las búsquedas de
   coincidencia— y **libera los objetos que estuvieran reservados por una citación suya**, que
   vuelven a estado **disponible**.

**Flujos alternativos**

- _1a. La verificación falló pero el funcionario estima que fue una confusión de buena fe._ **No
  asigna el strike.** La verificación queda registrada como no acreditada, el objeto vuelve a
  disponible y no hay sanción.

**Excepciones**

- _1b. La resolución registrada es propiedad acreditada, o no existe verificación._ El sistema
  **habilita esta acción únicamente sobre verificaciones con resolución de propiedad no acreditada y
  la rechaza en cualquier otro caso**.
- _2a. El motivo está fuera del rango de 20 a 500 caracteres._ El sistema rechaza la asignación.
- _1c. El objeto pertenece a otra sede._ El sistema rechaza la operación (RF7).

**Reglas de negocio**

- **El sistema no asigna strikes por su cuenta ni los deriva automáticamente de una verificación
  fallida, porque no toda verificación fallida es un intento de fraude y puede tratarse de una
  confusión de buena fe: es siempre una acción deliberada del funcionario.** Esta es la razón por la
  que CU-25 y CU-27 son casos de uso separados y no un solo flujo.
- El motivo **es visible para el sancionado** (CU-16). El funcionario escribe sabiendo que el alumno
  lo va a leer.
- El objeto vuelve a **disponible** y no queda inmovilizado por la sanción: sigue siendo de alguien y
  debe poder cruzarse con otros avisos.
- **Bloqueo al tercer strike (RF28, RF29).** Bloqueada la cuenta, el alumno que intente iniciar
  sesión **aun ingresando correctamente su correo y su contraseña** recibe el mensaje de que su
  cuenta ha sido bloqueada y que debe contactarse con Rectoría, sin alcanzar ninguna función
  (CU-04, excepción 2d). El bloqueo es **indefinido**, a diferencia del de quince minutos por
  intentos fallidos, que se levanta solo.
- **Los avisos inactivos no se eliminan ni se cierran: conservan íntegros su contenido y su
  historial.** Un aviso inactivo no es un aviso cerrado (CU-13), y esa distinción es lo que permite
  reactivarlo tal cual estaba.
- **Únicamente Rectoría desbloquea la cuenta, y de forma presencial.** Ejecutado el desbloqueo el
  contador vuelve a cero, los avisos inactivos **regresan automáticamente a publicado** y el alumno
  recupera todas sus funciones, sujeto al mismo régimen: si vuelve a acumular tres strikes, la cuenta
  se bloquea otra vez. No hay vía de desbloqueo en la plataforma.

---

#### CU-28 · Consultar los strikes de un alumno

| Campo                   | Valor                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-28                                                                                                          |
| **Actor principal**     | Funcionario                                                                                                    |
| **Actores secundarios** | —                                                                                                              |
| **RF cubiertos**        | RF26                                                                                                           |
| **Precondiciones**      | Sesión abierta con rol de funcionario, situado sobre un aviso o sobre la ficha de un alumno.                    |
| **Postcondiciones**     | Ninguna. El funcionario **no puede modificar ni eliminar un strike**, sea propio o de otro funcionario.         |
| **Frecuencia**          | Alta; es paso incluido de toda verificación (CU-25).                                                           |

**Flujo principal**

1. El funcionario, desde un aviso o desde la ficha del alumno, consulta sus strikes.
2. El sistema muestra **cuántos strikes acumula esa persona sobre un total de tres** y el detalle de
   cada uno con su fecha, su motivo, el funcionario que lo asignó y **la sede donde ocurrió**,
   **incluidos los asignados en sedes distintas de la suya**.

**Reglas de negocio**

- **Esta consulta está disponible antes de resolver una verificación, porque un historial previo de
  intentos es un antecedente legítimo para decidir.** Por eso es una relación «include» de CU-25 y no
  una consulta opcional.
- El alcance es **transversal a las sedes**: un alumno sancionado en Concepción llega con ese
  historial a Chillán. La consulta sigue la regla general del funcionario —consulta transversal,
  acción local— y aquí la acción local es la asignación (CU-27).
- **El funcionario no puede modificar ni eliminar un strike, sea propio o de otro funcionario.** La
  corrección de una sanción es materia de Rectoría.

---




### Subsistema E — Administrador: plataforma, cuentas y catálogos

Todos los casos de uso de este subsistema asumen como precondición global una sesión abierta con rol
de administrador (CU-04). Rige aquí la frontera del apartado 1.3: el administrador **administra la
plataforma y no opera el proceso de objetos perdidos**. Ninguna ficha de este subsistema ingresa
objetos, consulta el foro, cita alumnos, entrega objetos ni asigna strikes.

---


#### CU-29 · Crear una sede

| Campo                   | Valor                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-29                                                                                                                       |
| **Actor principal**     | Administrador                                                                                                               |
| **Actores secundarios** | —                                                                                                                           |
| **RF cubiertos**        | RF33                                                                                                                        |
| **Precondiciones**      | Sesión abierta con rol de administrador.                                                                                    |
| **Postcondiciones**     | La sede queda en estado **activa**, disponible de inmediato para asignarle funcionarios y recintos, con su fecha de creación y el administrador que la creó. |
| **Frecuencia**          | Muy baja. Es una operación de puesta en marcha y de apertura de recintos nuevos.                                            |

**Flujo principal**

1. El administrador inicia la creación de una sede.
2. El sistema presenta el formulario: nombre de entre 3 y 80 caracteres, dirección, horario de
   atención y campus o ciudad al que pertenece.
3. El administrador completa los campos.
4. El sistema valida que no falte ninguno y que no exista ya una sede con el mismo nombre.
5. El sistema crea la sede en estado **activa** y deja registrada su fecha de creación y su autor.
6. La sede queda disponible para asignarle funcionarios (CU-31, CU-32) y recintos (CU-39).

**Excepciones**

- _4a. Falta un campo obligatorio._ El sistema rechaza la creación indicando cuál.
- _4b. El nombre está fuera del rango de 3 a 80 caracteres._ El sistema rechaza la creación.
- _4c. Ya existe una sede con ese nombre._ El sistema rechaza la creación.

**Reglas de negocio**

- **La sede es la unidad que determina dónde se custodia físicamente un objeto y qué funcionario
  puede actuar sobre él** (RF7). **Ninguna otra función del sistema opera mientras no exista al menos
  una sede**: sin sedes no hay funcionarios asignables, no hay recintos que ofrecer al alumno y no hay
  dónde ingresar un objeto.

---

#### CU-30 · Editar y desactivar una sede

| Campo                   | Valor                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-30                                                                                                                     |
| **Actor principal**     | Administrador                                                                                                             |
| **Actores secundarios** | —                                                                                                                         |
| **RF cubiertos**        | RF34                                                                                                                      |
| **Precondiciones**      | Sesión abierta con rol de administrador y una sede existente.                                                             |
| **Postcondiciones**     | La sede queda con sus datos modificados, o desactivada y fuera de los formularios, **conservada íntegra en el historial de los objetos que pasaron por ella**. |
| **Frecuencia**          | Muy baja.                                                                                                                 |

**Flujo principal**

1. El administrador abre una sede existente.
2. El administrador modifica su nombre, su dirección o su horario de atención.
3. El sistema aplica las mismas validaciones de la creación y guarda los cambios.

**Flujos alternativos**

- _2a. La sede deja de operar._ El administrador solicita desactivarla. El sistema verifica que no
  tenga objetos en estado disponible ni reservado en su inventario y que no tenga funcionarios
  asignados; cumplido eso, la desactiva. Desactivada, **deja de ofrecerse para asignar funcionarios y
  recintos y desaparece de los filtros de alta de objetos**.
- _2b. La sede vuelve a operar._ El administrador la reactiva y queda otra vez disponible.

**Excepciones**

- _2c. La sede tiene objetos en estado disponible o reservado._ El sistema **rechaza la
  desactivación** e indica en pantalla cuántos lo impiden.
- _2d. La sede tiene funcionarios asignados._ El sistema rechaza la desactivación e indica cuántos
  son. El administrador debe reasignarlos primero (CU-32).

**Reglas de negocio**

- El sistema rechaza desactivar una sede con objetos en custodia **porque dejaría esos objetos sin
  nadie que responda por ellos**. La restricción no es formal: es la cadena de responsabilidad.
- **Ninguna sede se elimina.** Una sede desactivada se conserva íntegra en el historial de los objetos
  que pasaron por ella (CU-20) y en los registros de entrega ya realizados (CU-15, CU-26).

---

#### CU-31 · Crear la cuenta de un funcionario y entregar sus credenciales

| Campo                   | Valor                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-31                                                                                                                                      |
| **Actor principal**     | Administrador                                                                                                                              |
| **Actores secundarios** | Servicio de correo                                                                                                                         |
| **RF cubiertos**        | RF35                                                                                                                                       |
| **Precondiciones**      | Sesión abierta con rol de administrador y **al menos una sede activa** (CU-29).                                                            |
| **Postcondiciones**     | Existe una cuenta de funcionario asignada a una sede, con una **contraseña temporal vigente por siete días** y **sin acceso a ninguna pantalla mientras no la reemplace**. |
| **Frecuencia**          | Baja.                                                                                                                                      |

**Flujo principal**

1. El administrador inicia la creación de una cuenta de funcionario.
2. El sistema presenta el formulario: rut, nombre, apellidos, correo institucional y sede asignada,
   elegida de entre las sedes activas.
3. El administrador completa los campos.
4. El sistema valida el **dígito verificador del rut**, que el nombre y los apellidos tengan entre 2
   y 60 caracteres, que el correo **no esté ya registrado en ninguna cuenta de la plataforma** y que
   la sede elegida esté activa.
5. El sistema crea la cuenta, **genera en ese momento una contraseña temporal** y la envía al correo
   institucional del funcionario junto al aviso de que su cuenta existe, indicando que **caduca a los
   siete días**.
6. El funcionario inicia sesión con la contraseña temporal (CU-04) y el sistema invoca **CU-03** para
   que la reemplace por una propia antes de mostrarle ninguna pantalla. Usada una vez, la temporal
   queda invalidada.

**Flujos alternativos**

- _5a. La contraseña temporal caduca antes de que el funcionario la use._ El administrador **le genera
  otra** desde la ficha del funcionario: la anterior queda invalidada y el plazo de siete días vuelve
  a correr. La cuenta permanece sin acceso mientras tanto.
- _5b. El funcionario pierde la contraseña temporal._ Mismo procedimiento que en 5a. El administrador
  no puede recuperarla ni consultarla, sólo reemplazarla.
- _6a. La contraseña propia no cumple las condiciones de seguridad._ El sistema la rechaza y **el
  funcionario permanece sin alcanzar ninguna pantalla** hasta definir una válida.

**Excepciones**

- _4a. El dígito verificador del rut no valida._ El sistema rechaza la creación indicando el campo.
- _4b. El correo ya está registrado en otra cuenta._ El sistema rechaza la creación indicando el
  motivo exacto.
- _4c. La sede elegida no está activa._ El sistema rechaza la creación.
- _2a. No existe ninguna sede activa._ El sistema no permite iniciar la creación y conduce al
  administrador a **CU-29**.

**Reglas de negocio**

- **El sistema genera la contraseña temporal y la envía directamente al funcionario: el administrador
  no la conoce, no la elige y no la visualiza en ningún momento**, ni siquiera al generarla. Sólo
  puede ordenar que se genere otra. Así, ninguna acción registrada a nombre de un funcionario puede
  atribuirse a que el administrador conocía su clave.
- La contraseña temporal **es de un solo uso y con plazo**: se invalida al usarse y caduca a los siete
  días aunque no se use. Una credencial que viaja por correo no debe quedar viva en el buzón, y estas
  dos condiciones son las que lo evitan.
- Esta es la única vía de alta de una cuenta de funcionario: **no existe autorregistro** para ese rol
  (RF6, CU-04).

---

#### CU-32 · Cambiar la sede asignada a un funcionario

| Campo                   | Valor                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-32                                                                                                                                |
| **Actor principal**     | Administrador                                                                                                                        |
| **Actores secundarios** | —                                                                                                                                    |
| **RF cubiertos**        | RF36                                                                                                                                 |
| **Precondiciones**      | Sesión abierta con rol de administrador, un funcionario existente y una sede activa de destino.                                      |
| **Postcondiciones**     | El funcionario queda asignado a la sede nueva **con efecto inmediato**, y el cambio queda registrado con su fecha, la sede de origen, la de destino y el administrador que lo ejecutó. |
| **Frecuencia**          | Baja.                                                                                                                                |

**Flujo principal**

1. El administrador abre la ficha de un funcionario desde el padrón (CU-34).
2. El administrador elige la sede de destino de entre las sedes activas.
3. El sistema **advierte cuántas citaciones vigentes emitidas por ese funcionario quedan en la sede
   anterior**.
4. El administrador confirma.
5. El sistema aplica el cambio de inmediato: el funcionario **deja de poder actuar sobre los objetos
   de su sede anterior y pasa a poder hacerlo sobre los de la nueva**, sin que su capacidad de
   consulta sobre el inventario y el foro de toda la Universidad se vea alterada.
6. El sistema registra el cambio en la bitácora (CU-41).

**Excepciones**

- _2a. La sede de destino no está activa._ El sistema no la ofrece en la lista.
- _4a. El administrador no confirma._ El funcionario permanece en su sede anterior.

**Reglas de negocio**

- **Un funcionario pertenece a una sola sede a la vez** (RF7).
- **Las citaciones vigentes no se trasladan con el funcionario**: siguen vivas y las atiende quien
  quede en esa sede. Por eso el sistema las cuenta y las muestra antes de confirmar: el
  administrador debe saber qué queda pendiente donde ya no habrá quien lo emitió.
- El cambio altera **solo la capacidad de acción**, nunca la de consulta. La doble frontera del
  funcionario —consulta transversal, acción local— se mantiene intacta.

---

#### CU-33 · Desactivar y reactivar la cuenta de un funcionario

| Campo                   | Valor                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-33                                                                                                                                       |
| **Actor principal**     | Administrador                                                                                                                               |
| **Actores secundarios** | —                                                                                                                                           |
| **RF cubiertos**        | RF37                                                                                                                                        |
| **Precondiciones**      | Sesión abierta con rol de administrador y un funcionario existente.                                                                         |
| **Postcondiciones**     | La cuenta queda desactivada y sin acceso, con su sesión cerrada, **conservando su nombre en todos los registros de su actuación**.           |
| **Frecuencia**          | Baja.                                                                                                                                       |

**Flujo principal**

1. El administrador abre la ficha de un funcionario desde el padrón (CU-34) y solicita desactivar su
   cuenta.
2. El sistema **advierte cuántas citaciones vigentes emitió ese funcionario** y exige una
   confirmación explícita.
3. El administrador confirma.
4. El sistema **cierra la sesión** que el funcionario tuviera abierta y le niega el acceso: al
   intentar entrar recibe el mensaje de que su cuenta fue desactivada (CU-04, excepción 2b).

**Flujos alternativos**

- _4a. El funcionario vuelve a prestar servicios._ El administrador reactiva la cuenta y recupera el
  acceso con su misma contraseña y su misma sede.

**Reglas de negocio**

- **La desactivación no borra ni anonimiza nada.** El nombre del funcionario permanece en los
  ingresos de objetos que registró (CU-18), en las citaciones que envió (CU-23, CU-24), en las
  verificaciones que resolvió (CU-25), en las entregas que autorizó (CU-26) y en los strikes que
  asignó (CU-27), **porque esos registros son el respaldo de la actuación de la Universidad y deben
  seguir indicando quién actuó**.
- **Las citaciones vigentes no caducan por la desactivación** y quedan a cargo de los demás
  funcionarios de la sede.
- **Ninguna cuenta de funcionario se elimina.**

---

#### CU-34 · Consultar el padrón de funcionarios

| Campo                   | Valor                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **Identificador**       | CU-34                                                                                          |
| **Actor principal**     | Administrador                                                                                  |
| **Actores secundarios** | —                                                                                              |
| **RF cubiertos**        | RF38                                                                                           |
| **Precondiciones**      | Sesión abierta con rol de administrador.                                                       |
| **Postcondiciones**     | Ninguna. Es una consulta y no altera el estado del sistema.                                    |
| **Frecuencia**          | Media.                                                                                         |

**Flujo principal**

1. El administrador abre el padrón de funcionarios.
2. El sistema lista **todos los funcionarios de la Universidad** con su nombre, su rut, su correo
   institucional, su sede asignada, su estado de cuenta y **la fecha de su último ingreso al
   sistema**.
3. El sistema pagina en **páginas de veinte funcionarios** y permite filtrar por sede y por estado y
   ordenar por nombre o por sede.
4. El sistema indica, **por cada sede activa, cuántos funcionarios tiene asignados, y señala las
   sedes que quedaron sin ninguno**.
5. El administrador abre la ficha de cualquiera de ellos para ejecutar **CU-32** o **CU-33**.

**Reglas de negocio**

- La alerta de sedes sin funcionarios del paso 4 no es decorativa: **una sede sin funcionarios no
  puede recibir objetos ni atender citaciones**, de modo que el sistema queda parcialmente inoperante
  en ese recinto y el administrador es el único que puede verlo.
- La fecha de último ingreso permite detectar cuentas activas que ya nadie usa, que son las
  candidatas a desactivarse (CU-33).

---

#### CU-35 · Consultar la ficha de un alumno

| Campo                   | Valor                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-35                                                                                                        |
| **Actor principal**     | Administrador                                                                                                |
| **Actores secundarios** | —                                                                                                            |
| **RF cubiertos**        | RF39                                                                                                         |
| **Precondiciones**      | Sesión abierta con rol de administrador.                                                                     |
| **Postcondiciones**     | Ninguna. La ficha es de consulta.                                                                            |
| **Frecuencia**          | Baja; se abre a raíz de una gestión presencial del alumno.                                                   |

**Flujo principal**

1. El administrador busca a un alumno por su **rut, su nombre o su correo institucional**.
2. El administrador abre su ficha.
3. El sistema muestra sus datos personales, el estado de su cuenta, **la cantidad de strikes que
   acumula con el detalle de cada uno** y el recuento de sus avisos publicados y de sus retiros
   realizados.
4. Desde la ficha el administrador ejecuta **CU-36** o **CU-37**, que son las únicas acciones que
   ofrece.

**Reglas de negocio**

- **El sistema no le muestra el contenido de los avisos ni las fotografías que el alumno adjuntó**,
  solo su recuento. **El administrador no participa en la evaluación de la propiedad** y esos
  antecedentes son del funcionario que resuelve (CU-25). Mostrárselos ampliaría sin motivo el
  conjunto de personas que conoce la evidencia.

---

#### CU-36 · Corregir los datos fijos de un alumno

| Campo                   | Valor                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Identificador**       | CU-36                                                                                                                              |
| **Actor principal**     | Administrador                                                                                                                      |
| **Actores secundarios** | —                                                                                                                                  |
| **RF cubiertos**        | RF40                                                                                                                               |
| **Precondiciones**      | Sesión abierta con rol de administrador y la ficha de un alumno abierta (CU-35).                                                   |
| **Postcondiciones**     | El dato queda corregido, la bitácora registra el valor anterior y el nuevo con su motivo, y **el alumno queda notificado** de la corrección. |
| **Frecuencia**          | Baja.                                                                                                                              |

**Flujo principal**

1. El administrador selecciona el campo a corregir: **rut, nombre, apellidos o carrera**, que son los
   que el propio alumno no puede modificar una vez guardados (CU-09).
2. El administrador ingresa el valor nuevo.
3. El sistema aplica **las mismas validaciones del registro original**.
4. El sistema exige un **motivo de entre 20 y 300 caracteres**.
5. El administrador escribe el motivo y confirma.
6. El sistema aplica la corrección, asienta en la bitácora el **valor anterior, el valor nuevo, el
   motivo, la fecha y el administrador** (CU-41), y **notifica al alumno** que sus datos fueron
   corregidos.

**Excepciones**

- _3a. El valor nuevo no pasa las validaciones._ El sistema rechaza la corrección indicando cuál
  falló.
- _4a. El motivo falta o no alcanza los 20 caracteres._ El sistema rechaza la corrección.

**Reglas de negocio**

- **El administrador no puede modificar el correo institucional de un alumno, porque es la identidad
  con la que la cuenta fue verificada** (CU-01, CU-02). Cambiarlo equivaldría a transferir la cuenta a
  otra persona.
- La notificación al alumno es obligatoria: un dato suyo cambió sin que él lo pidiera y debe
  enterarse.

---

#### CU-37 · Desbloquear la cuenta de un alumno

| Campo                   | Valor                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Identificador**       | CU-37                                                                                                                                          |
| **Actor principal**     | Administrador                                                                                                                                  |
| **Actores secundarios** | —                                                                                                                                              |
| **RF cubiertos**        | RF41                                                                                                                                           |
| **Precondiciones**      | Sesión abierta con rol de administrador y la ficha de un alumno **con la cuenta bloqueada por tres strikes** (CU-35, CU-27).                    |
| **Postcondiciones**     | El contador de strikes vuelve a cero, **los avisos inactivos regresan automáticamente a estado publicado** y el alumno recupera todas sus funciones. |
| **Frecuencia**          | Baja.                                                                                                                                          |

**Flujo principal**

1. El alumno presenta sus objeciones **de forma presencial** en Rectoría (CU-16).
2. El administrador, desde la ficha del alumno, solicita desbloquear la cuenta.
3. El sistema exige el **fundamento del desbloqueo, de entre 20 y 500 caracteres**, y una
   confirmación explícita.
4. El administrador escribe el fundamento y confirma.
5. El sistema **pone el contador de strikes en cero**, devuelve los avisos inactivos a estado
   **publicado** —con lo que reaparecen en el foro de los funcionarios (CU-21)— y restituye al alumno
   la totalidad de sus funciones.
6. El sistema registra el desbloqueo en la bitácora (CU-41).

**Excepciones**

- _2a. La cuenta no está bloqueada._ El sistema no ofrece la acción.
- _3a. El fundamento falta o no alcanza los 20 caracteres._ El sistema rechaza el desbloqueo.

**Reglas de negocio**

- **Los strikes que dieron origen al bloqueo no se eliminan** y permanecen visibles en el historial
  del alumno (CU-16) y en el registro de la Universidad (CU-38), **porque el desbloqueo restituye el
  acceso pero no borra lo ocurrido**.
- El alumno desbloqueado queda **sujeto al mismo régimen**: si vuelve a acumular tres strikes, su
  cuenta se bloquea otra vez y sus avisos vuelven a darse de baja (CU-27).
- Es la **única** vía de desbloqueo. No existe una automática ni una a solicitud del alumno.

---

#### CU-38 · Consultar el registro de strikes de la Universidad

| Campo                   | Valor                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-38                                                                                                    |
| **Actor principal**     | Administrador                                                                                            |
| **Actores secundarios** | —                                                                                                        |
| **RF cubiertos**        | RF42                                                                                                     |
| **Precondiciones**      | Sesión abierta con rol de administrador.                                                                 |
| **Postcondiciones**     | Ninguna. El registro es de **solo lectura**.                                                             |
| **Frecuencia**          | Baja.                                                                                                    |

**Flujo principal**

1. El administrador abre el registro de strikes.
2. El sistema lista **la totalidad de los strikes asignados en la Universidad** con el alumno
   sancionado, la fecha, **el motivo escrito por el funcionario**, el funcionario que lo asignó y la
   sede donde ocurrió.
3. El sistema pagina en **páginas de veinte**, permite filtrar por sede, por funcionario, por alumno y
   por rango de fechas, y **señala qué cuentas se encuentran bloqueadas**.

**Reglas de negocio**

- **El administrador no puede modificar ni eliminar un strike.** La vía para dejar sin efecto sus
  consecuencias es el desbloqueo de la cuenta (CU-37), **que queda fundado y registrado a su nombre**.
  La diferencia importa: el sistema no permite borrar la sanción, solo levantar su efecto dejando
  constancia de quién lo hizo y por qué.
- La vista por funcionario permite detectar un patrón de sanción anómalo, que es un antecedente de
  gestión y no una función automática del sistema.

---

#### CU-39 · Gestionar el catálogo de recintos

| Campo                   | Valor                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-39                                                                                                                   |
| **Actor principal**     | Administrador                                                                                                           |
| **Actores secundarios** | —                                                                                                                       |
| **RF cubiertos**        | RF43                                                                                                                    |
| **Precondiciones**      | Sesión abierta con rol de administrador y al menos una sede activa (CU-29).                                             |
| **Postcondiciones**     | El catálogo queda actualizado. Los recintos retirados **se conservan en los avisos y objetos que ya los referencian**.   |
| **Frecuencia**          | Baja.                                                                                                                   |

**Flujo principal**

1. El administrador abre el catálogo de recintos.
2. El administrador agrega un recinto con su **nombre de entre 3 y 80 caracteres y la sede a la que
   pertenece**, edita el nombre de uno existente o lo retira de uso.
3. El sistema valida que el nombre no esté repetido **dentro de la misma sede**.
4. El sistema aplica el cambio y lo registra en la bitácora (CU-41).

**Excepciones**

- _3a. El nombre ya existe en esa sede._ El sistema rechaza la operación.

**Reglas de negocio**

- Al retirar un recinto, el sistema **lo deja de ofrecer en los formularios pero lo conserva en los
  avisos y en los objetos que ya lo referencian, porque un aviso publicado no admite modificación** y
  debe seguir indicando dónde ocurrió la pérdida (CU-11).
- **La pertenencia de cada recinto a una sede es lo que permite que el sistema dirija el aviso de un
  alumno a los funcionarios que corresponden** (CU-10, paso 7). Un recinto mal asignado manda el aviso
  a la sede equivocada.

---

#### CU-40 · Gestionar los catálogos de tipos de objeto y de carreras

| Campo                   | Valor                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-40                                                                                                         |
| **Actor principal**     | Administrador                                                                                                 |
| **Actores secundarios** | —                                                                                                             |
| **RF cubiertos**        | RF44                                                                                                          |
| **Precondiciones**      | Sesión abierta con rol de administrador.                                                                      |
| **Postcondiciones**     | El catálogo queda actualizado. Las entradas retiradas **se conservan en los registros que ya las referencian**. |
| **Frecuencia**          | Baja.                                                                                                         |

**Flujo principal**

1. El administrador abre el catálogo de **tipos de objeto** o el de **carreras**.
2. El administrador agrega una entrada, edita su nombre o la retira de uso.
3. El sistema valida que el nombre no esté repetido dentro de ese mismo catálogo.
4. El sistema aplica el cambio y lo registra en la bitácora (CU-41).

**Excepciones**

- _3a. El nombre ya existe en ese catálogo._ El sistema rechaza la operación.

**Reglas de negocio**

- **El tipo de objeto es uno de los campos sobre los que el sistema calcula la coincidencia entre un
  objeto y un aviso** (CU-22), de modo que **un catálogo demasiado grueso o demasiado fino degrada esa
  búsqueda**: con un solo tipo «Electrónica» todo coincide con todo, y con cincuenta tipos casi nada
  coincide. **El administrador es quien responde por mantenerlo utilizable.**
- El catálogo de carreras alimenta el perfil del alumno (CU-09) y sus entradas retiradas se conservan
  en los perfiles ya guardados.

---

#### CU-41 · Consultar la bitácora de administración

| Campo                   | Valor                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Identificador**       | CU-41                                                                                                        |
| **Actor principal**     | Administrador                                                                                                |
| **Actores secundarios** | —                                                                                                            |
| **RF cubiertos**        | RF45                                                                                                         |
| **Precondiciones**      | Sesión abierta con rol de administrador.                                                                     |
| **Postcondiciones**     | Ninguna. La bitácora es de **solo lectura** y **ningún usuario puede editarla ni eliminar registros de ella**. |
| **Frecuencia**          | Baja.                                                                                                        |

**Flujo principal**

1. El sistema registra en la bitácora **toda acción del administrador que altere cuentas, datos o
   catálogos**: creación y desactivación de sedes (CU-29, CU-30), creación, cambio de sede y
   desactivación de funcionarios (CU-31, CU-32, CU-33), corrección de datos fijos de un alumno
   (CU-36), desbloqueo de cuentas (CU-37) y cambios en los catálogos (CU-39, CU-40).
2. De cada acción quedan asentados **la fecha y hora, el administrador que la ejecutó, el elemento
   afectado, el valor anterior y el valor nuevo cuando corresponde, y el motivo cuando el sistema lo
   exigió**.
3. El administrador consulta la bitácora en **páginas de veinte registros** y la filtra por tipo de
   acción, por administrador y por rango de fechas.

**Reglas de negocio**

- **Ningún usuario puede editar la bitácora ni eliminar registros de ella, incluido el propio
  administrador, porque es el único control que existe sobre la cuenta que no tiene otra por encima**
  (CU-04). Si el administrador pudiera borrar su propia bitácora, no habría control alguno.
- La bitácora registra las acciones **del administrador**. Las del funcionario quedan registradas en
  el historial del objeto (CU-20) y en el registro de strikes (CU-38), que cumplen la misma función
  para ese rol.

---

## 5. Trazabilidad

### 5.1 De requerimiento a caso de uso

| RF   | Título                                                        | Caso(s) de uso                                           |
| ---- | ------------------------------------------------------------- | -------------------------------------------------------- |
| RF1  | Registro del alumno con correo institucional                  | CU-01                                                    |
| RF2  | Verificación del correo institucional                         | CU-02                                                    |
| RF3  | Definición de la contraseña en el primer ingreso              | CU-03                                                    |
| RF4  | Inicio de sesión del alumno                                   | CU-04, CU-06                                             |
| RF5  | Recuperación de contraseña                                    | CU-05                                                    |
| RF6  | Inicio de sesión del funcionario                              | CU-04, CU-06                                             |
| RF7  | Sede asignada y ámbito de las acciones del funcionario        | CU-04, y como regla en CU-18, CU-23, CU-24, CU-26, CU-27 |
| RF8  | Registro y consulta de los datos personales del alumno        | CU-09                                                    |
| RF9  | Publicación de un aviso de pérdida                            | CU-10                                                    |
| RF10 | Confirmación previa a la publicación                          | CU-11                                                    |
| RF11 | Consulta del estado de los avisos propios                     | CU-12                                                    |
| RF12 | Cierre de un aviso propio                                     | CU-13                                                    |
| RF13 | Consulta del historial de avisos publicados                   | CU-14                                                    |
| RF14 | Consulta del historial de retiros                             | CU-15                                                    |
| RF15 | Ingreso de un objeto encontrado                               | CU-18                                                    |
| RF16 | Consulta del inventario general                               | CU-19                                                    |
| RF17 | Consulta del detalle y del historial de un objeto             | CU-20                                                    |
| RF18 | Consulta del foro de avisos de pérdida                        | CU-21                                                    |
| RF19 | Notificación al funcionario de nuevos avisos publicados       | CU-10 (paso 7) y CU-21 (reglas de negocio)               |
| RF20 | Búsqueda de coincidencias entre un objeto y los avisos        | CU-22                                                    |
| RF21 | Citación del alumno para retirar un objeto                    | CU-23                                                    |
| RF22 | Citación a verificación presencial por evidencia insuficiente | CU-24, y su caducidad en CU-24 (flujo 7a) y CU-23 (6a)   |
| RF23 | Registro del resultado de la verificación presencial          | CU-25                                                    |
| RF24 | Entrega del objeto y descuento del inventario                 | CU-26                                                    |
| RF25 | Asignación de un strike                                       | CU-27                                                    |
| RF26 | Consulta por el funcionario de los strikes de un alumno       | CU-28, y como paso incluido de CU-25                     |
| RF27 | Consulta por el alumno de los strikes recibidos               | CU-16                                                    |
| RF28 | Bloqueo de la cuenta al tercer strike                         | CU-27 (paso 7 y reglas), y como excepción en CU-04       |
| RF29 | Efecto del tercer strike sobre los avisos del alumno          | CU-27 (paso 7 y reglas)                                  |
| RF30 | Recepción de notificaciones por el alumno                     | CU-17                                                    |
| RF31 | Inicio de sesión del administrador                            | CU-04, CU-06                                             |
| RF32 | Ámbito del administrador                                      | CU-04, y como regla en todo el Subsistema E              |
| RF33 | Creación de una sede                                          | CU-29                                                    |
| RF34 | Edición y desactivación de una sede                           | CU-30                                                    |
| RF35 | Creación de la cuenta de un funcionario                       | CU-31, y el reemplazo de la temporal en CU-03            |
| RF36 | Asignación y cambio de sede de un funcionario                 | CU-32                                                    |
| RF37 | Desactivación y reactivación de la cuenta de un funcionario   | CU-33                                                    |
| RF38 | Consulta del padrón de funcionarios                           | CU-34                                                    |
| RF39 | Consulta de la ficha de un alumno                             | CU-35                                                    |
| RF40 | Corrección de los datos fijos de un alumno                    | CU-36                                                    |
| RF41 | Desbloqueo de la cuenta de un alumno                          | CU-37                                                    |
| RF42 | Consulta del registro de strikes de la Universidad            | CU-38                                                    |
| RF43 | Gestión del catálogo de recintos                              | CU-39                                                    |
| RF44 | Gestión de los catálogos de tipos de objeto y de carreras     | CU-40                                                    |
| RF45 | Bitácora de las acciones del administrador                    | CU-41                                                    |
| RF46 | Activación y desactivación del segundo factor de autenticación | CU-07, y como negativa en CU-04                         |
| RF47 | Cambio de contraseña por el propio usuario                    | CU-08                                                    |

**Los cuarenta y siete requerimientos del ERF quedan cubiertos.** No hay requerimiento sin
trazabilidad.

### 5.2 Comportamiento automático del sistema

El sistema no es un actor, así que su comportamiento automático **no se modela como caso de uso**.
Tampoco se pierde: cada conducta queda especificada dentro del flujo que la dispara. Esta tabla
existe para que la verificación pueda encontrarla, porque es la parte del sistema que ningún actor
solicita y que por eso es fácil dejar sin probar.

| Comportamiento automático                                | RF         | Dónde queda especificado                                                                     |
| -------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| Generar el código de seis dígitos y expirarlo a los 15 minutos | RF2  | **CU-02**, flujo principal paso 1 y flujo alternativo 2a.                                    |
| Habilitar el reenvío del código una vez por minuto       | RF2        | **CU-02**, flujo alternativo 2a y excepción 2c.                                              |
| Bloquear el acceso 15 minutos tras cinco intentos fallidos | RF4, RF6 | **CU-04**, excepción 2e · **CU-04**, excepción 2c.                                           |
| Caducar la sesión a los 30 minutos sin actividad y a las 12 horas | RF4, RF6 | **CU-06**, flujo alternativo 1a y reglas de negocio.                                  |
| Cerrar toda sesión abierta al restablecerse la contraseña | RF5        | **CU-05**, paso 6 · **CU-06**, flujo alternativo 1b.                                         |
| Expirar el enlace de recuperación y limitarlo a tres por hora | RF5    | **CU-05**, flujo alternativo 4a y excepción 1a.                                              |
| Avisar por correo al funcionario de un aviso nuevo de su sede | RF19   | **CU-10**, paso 7 · **CU-21**, reglas de negocio.                                            |
| Caducar la citación no atendida a los diez días hábiles   | RF22       | **CU-24**, flujo alternativo 7a · **CU-23**, flujo alternativo 6a.                           |
| Bloquear la cuenta al tercer strike y cerrar su sesión    | RF28       | **CU-27**, paso 7 y reglas de negocio · **CU-06**, flujo alternativo 1c.                     |
| Dar de baja los avisos pendientes y liberar sus objetos   | RF29       | **CU-27**, paso 7 y reglas de negocio.                                                       |
| Generar y conservar las notificaciones del alumno         | RF30       | **CU-17**, paso 1 y flujos alternativos 1a y 1b.                                             |
| Generar la contraseña temporal del funcionario y caducarla a los 7 días | RF35 | **CU-31**, paso 5 y flujo alternativo 5a.                                        |
| Generar el código del segundo factor y caducarlo a los 15 minutos | RF4, RF6, RF31 | **CU-04** paso 3 · **CU-04** paso 3 · **CU-04** paso 3.                   |
| Invalidar el código del segundo factor al pedir otro o iniciar otro intento | RF4 | **CU-04**, flujo alternativo 4a.                                       |
| Enviar el correo de aviso tras cinco intentos fallidos    | RF4, RF6, RF31 | **CU-04** excepción 2c · **CU-04** 2b · **CU-04** 2b.                                |
| Cerrar las demás sesiones al cambiar la contraseña        | RF47       | **CU-08**, paso 4.                                                                           |

### 5.3 Requerimientos que además operan como restricción transversal

Estos requerimientos **sí** originan un caso de uso propio, pero su contenido no se agota en él:
funcionan además como regla verificada dentro de otros flujos. Se registran aquí para que la
verificación no se limite a su caso de uso principal.

| RF   | Título                                                 | Alcance transversal                                                                                                                                                   | Dónde se verifica además                                                                                                                          |
| ---- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF7  | Sede asignada y ámbito de las acciones del funcionario | Es la **regla de autorización** del rol de funcionario: consulta transversal a la Universidad, acción restringida a la sede propia. No es una interacción por sí sola. | Verificado en servidor sobre **cada operación de acción**: CU-18, CU-23, CU-24, CU-26, CU-27. Consulta libre en CU-19, CU-20, CU-21, CU-22, CU-28. |
| RF4  | Inicio de sesión del alumno                            | Fija la **precondición global de sesión** y los plazos de caducidad de todo el Subsistema B.                                                                          | Precondición de CU-09 a CU-17. Plazos en CU-06.                                                                                                   |
| RF6  | Inicio de sesión del funcionario                       | Fija la **precondición global de sesión** y los plazos de caducidad de los Subsistemas C y D.                                                                          | Precondición de CU-18 a CU-28. Plazos en CU-06.                                                                                                   |
| RF10 | Confirmación previa a la publicación                   | Establece que **el aviso publicado es evidencia y no contenido editable**. De ahí que no exista ningún caso de uso de edición de avisos.                               | CU-11 como flujo. Como restricción, la ausencia de edición en CU-12 y CU-14, y el mecanismo de corrección por cierre y republicación en CU-13.     |
| RF32 | Ámbito del administrador                               | Es la **regla de autorización** del rol de administrador: alcance transversal sin sede, y negación de acceso al inventario, foro, citaciones, entregas y strikes.       | CU-04 como postcondición. Verificado en servidor sobre **cada operación** de CU-29 a CU-41, y como negativa sobre CU-10 a CU-28.                   |

### 5.4 Acciones de Rectoría que antes quedaban fuera del alcance

La versión 1.1 de este documento registraba seis acciones de Rectoría como externas a la plataforma,
porque el ERF no las había especificado. Con los RF31–RF45 **todas quedaron dentro del sistema** y se
expanden como casos de uso del Administrador. Se deja la correspondencia para quien venga de la
versión anterior.

| Acción de Rectoría                                          | Antes                     | Ahora            |
| ----------------------------------------------------------- | ------------------------- | ---------------- |
| Crear la cuenta del funcionario con su correo institucional | Externa, fuera de alcance | **CU-31** (RF35) |
| Asignar y modificar la sede del funcionario                 | Externa, fuera de alcance | **CU-32** (RF36) |
| Desactivar la cuenta de un funcionario                      | Externa, fuera de alcance | **CU-33** (RF37) |
| Corregir el rut, nombre, apellidos o carrera de un alumno   | Externa, fuera de alcance | **CU-36** (RF40) |
| Desbloquear la cuenta de un alumno con tres strikes         | Externa, fuera de alcance | **CU-37** (RF41) |
| Crear y administrar las sedes                               | **No especificada**       | **CU-29, CU-30** (RF33, RF34) |
| Sostener los catálogos de listas fijas                      | **No especificada**       | **CU-39, CU-40** (RF43, RF44) |

Las dos últimas filas son las que faltaban por completo: el ERF daba las sedes y los catálogos por
existentes —RF7 y RF16 filtran por sede, RF8, RF9 y RF15 eligen de listas fijas— sin que ningún
requerimiento dijera nunca quién los crea.

Lo único que permanece fuera del sistema es **la gestión presencial en que el alumno presenta sus
objeciones a un strike** (RF27), que es el paso 1 de CU-37 y no una función de software.

---

## 6. Matriz de actores por caso de uso

| Caso de uso                                      | Visitante | Alumno | Funcionario | Administrador |
| ------------------------------------------------ | :-------: | :----: | :---------: | :-----------: |
| CU-01 Registrarse con el correo institucional    |     ●     |   —    |      —      |       —       |
| CU-02 Verificar el correo institucional          |     ●     |   —    |      —      |       —       |
| CU-03 Definir la contraseña en el primer ingreso |           |   ●    |      ●      |       —       |
| CU-04 Iniciar sesión                             |     ●     |   ●    |      ●      |       ●       |
| CU-05 Recuperar la contraseña                    |     ●     |   ●    |      —      |       —       |
| CU-06 Cerrar sesión                              |           |   ●    |      ●      |       ●       |
| CU-07 Activar o desactivar el segundo factor     |           |   ●    |      ●      |       —       |
| CU-08 Cambiar la contraseña                      |           |   ●    |      ●      |       ●       |
| CU-09 Completar los datos personales             |           |   ●    |      —      |       —       |
| CU-10 Publicar un aviso de pérdida               |           |   ●    |      —      |       —       |
| CU-11 Confirmar el aviso antes de publicarlo     |           |   ●    |      —      |       —       |
| CU-12 Consultar el estado de los avisos propios  |           |   ●    |      —      |       —       |
| CU-13 Cerrar un aviso propio                     |           |   ●    |      —      |       —       |
| CU-14 Consultar el historial de avisos           |           |   ●    |      —      |       —       |
| CU-15 Consultar el historial de retiros          |           |   ●    |      —      |       —       |
| CU-16 Consultar los strikes recibidos            |           |   ●    |      —      |       —       |
| CU-17 Consultar el centro de notificaciones      |           |   ●    |      —      |       —       |
| CU-18 Ingresar un objeto al inventario           |           |   —    |      ●      |       —       |
| CU-19 Consultar el inventario general            |           |   —    |      ●      |       —       |
| CU-20 Consultar el detalle de un objeto          |           |   —    |      ●      |       —       |
| CU-21 Consultar el foro de avisos                |           |   —    |      ●      |       —       |
| CU-22 Buscar coincidencias                       |           |   —    |      ●      |       —       |
| CU-23 Citar para retirar un objeto               |           |   —    |      ●      |       —       |
| CU-24 Citar a verificación presencial            |           |   —    |      ●      |       —       |
| CU-25 Registrar el resultado de la verificación  |           |   —    |      ●      |       —       |
| CU-26 Entregar el objeto                         |           |   —    |      ●      |       —       |
| CU-27 Asignar un strike                          |           |   —    |      ●      |       —       |
| CU-28 Consultar los strikes de un alumno         |           |   —    |      ●      |       —       |
| CU-29 Crear una sede                             |           |   —    |      —      |       ●       |
| CU-30 Editar y desactivar una sede               |           |   —    |      —      |       ●       |
| CU-31 Crear la cuenta de un funcionario          |           |   —    |      —      |       ●       |
| CU-32 Cambiar la sede de un funcionario          |           |   —    |      —      |       ●       |
| CU-33 Desactivar la cuenta de un funcionario     |           |   —    |      —      |       ●       |
| CU-34 Consultar el padrón de funcionarios        |           |   —    |      —      |       ●       |
| CU-35 Consultar la ficha de un alumno            |           |   —    |      —      |       ●       |
| CU-36 Corregir los datos fijos de un alumno      |           |   —    |      —      |       ●       |
| CU-37 Desbloquear la cuenta de un alumno         |           |   —    |      —      |       ●       |
| CU-38 Consultar el registro de strikes           |           |   —    |      —      |       ●       |
| CU-39 Gestionar el catálogo de recintos          |           |   —    |      —      |       ●       |
| CU-40 Gestionar tipos de objeto y carreras       |           |   —    |      —      |       ●       |
| CU-41 Consultar la bitácora de administración    |           |   —    |      —      |       ●       |

**●** ejerce el caso de uso · **—** el servidor rechaza la operación (RF7, RF32, RF46 y separación
de conjuntos de capacidades) · celda vacía: no aplica

Las cuatro filas del Subsistema A con más de una marca —CU-03, CU-04, CU-06 y CU-08— son casos de uso
**únicos ejercidos por varios roles**, no casos de uso repetidos por rol. El alcance que cada uno
recibe se resuelve dentro del flujo.

Las 76 celdas marcadas **—** son la parte verificable de las fronteras del sistema: la que separa al
alumno del inventario, la que separa al administrador de la operación y la que le impide bajar la
protección de su propia cuenta. No es que la interfaz no ofrezca el control: **es que el servidor
rechaza la petición** aunque se construya a mano.

---

_Documento confidencial — Uso interno exclusivo_
_UBB Objetos Perdidos · Casos de Uso v2.2 · 7 de septiembre de 2026 · Derivado del ERF v1.2 del 7 de septiembre de 2026_
