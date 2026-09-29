# UBB Objetos Perdidos · Especificación de Requerimientos Funcionales

**27 de septiembre de 2026 · v1.3 · Vistas: Alumno, Funcionario y Administrador**

Aplicación web para la gestión y trazabilidad de objetos perdidos en la Universidad del Bío-Bío, campus Concepción

*Documento confidencial · Uso interno exclusivo*

## Cambios en la versión 1.3

- El alcance de la plataforma se limita al campus Concepción de la Universidad del Bío-Bío; ya no existen otras sedes ni campus.
- El concepto de sede desaparece: sede y recinto se fusionan en un único concepto, recinto, que es a la vez el lugar donde el alumno declara la pérdida, donde el funcionario encontró el objeto, donde éste queda en custodia y donde se retira.
- Cada recinto se define ahora con una ubicación geográfica (latitud y longitud) para mostrarlo en un mapa y con un horario de atención, en lugar de una dirección y un campus o ciudad.
- RF43 se fusiona en RF33 y RF34: la creación, edición y desactivación de un recinto quedan descritas íntegramente en esos dos requerimientos, y RF43 deja de definir un comportamiento propio.
- La creación de un recinto queda registrada en la bitácora (RF45) con su fecha y el administrador que lo creó, en lugar de ser un dato propio del recinto.

## Alcance del documento

Hoy la gestión de objetos perdidos en la Universidad del Bío-Bío es enteramente manual. No hay registro de qué objetos se han encontrado, dónde están guardados, quién los entregó ni a quién se devolvieron. Esta plataforma reemplaza ese proceso por uno trazable, donde cada objeto que ingresa y cada objeto que se retira queda registrado con su responsable y su fecha.

La plataforma reconoce tres roles: Alumno, Funcionario y Administrador, y este documento especifica los tres. El Administrador corresponde a Rectoría y administra los recintos, los funcionarios, los catálogos y los desbloqueos de cuenta: es el rol del que dependen los otros dos, porque sin recintos creados y sin funcionarios asignados a ellos ninguna otra función del sistema opera.

Los requerimientos se organizan por área funcional y no por rol, porque la mayoría de ellas involucra a ambos actores sobre la misma información. Cada requerimiento indica en su primera línea quién ejecuta la acción.

### El principio que gobierna el sistema

El alumno nunca ve el inventario de objetos encontrados. Declara a ciegas qué se le perdió, y es el funcionario quien compara esa declaración contra los objetos en depósito y verifica la propiedad de manera presencial. El funcionario, en cambio, ve todo: el foro completo de avisos y el inventario de todos los recintos.

Esa asimetría no es una limitación de la interfaz, es el mecanismo antifraude del sistema. Si el alumno pudiera ver la fotografía y la descripción de un objeto encontrado, describirlo con precisión sería trivial y reclamar un objeto ajeno dejaría de tener riesgo, con lo que el régimen de strikes perdería sentido. La declaración a ciegas es lo que convierte la descripción del alumno en prueba de propiedad.

De ese principio se desprenden tres consecuencias que atraviesan todo el documento. Un aviso publicado es evidencia y no contenido editable, por lo que queda congelado. Ninguna comunicación dirigida al alumno describe el objeto encontrado, ni el correo de citación ni el estado del aviso. Y el sistema no resuelve sobre la propiedad: propone coincidencias y exige dejar registro, pero la decisión es siempre del funcionario y queda documentada a su nombre.

### Términos

**Aviso de pérdida.** La publicación con la que un alumno declara que perdió un objeto. El conjunto de los avisos vigentes constituye el foro que el funcionario consulta.

**Recinto.** Un punto físico dentro del campus Concepción (por ejemplo, AC o Gantes), con nombre, ubicación geográfica (latitud y longitud) para mostrarlo en un mapa, y horario de atención. Es simultáneamente el lugar donde el alumno declara haber perdido el objeto, donde el funcionario lo encontró, donde el objeto queda en custodia y donde se retira. Cada funcionario queda asignado a un único recinto.

**Objeto en depósito.** Un objeto encontrado ya registrado en el inventario, bajo custodia de un recinto determinado.

**Citación.** El correo con el que el funcionario solicita la presencia del alumno, sea para retirar un objeto o para acreditar su propiedad.

**Strike.** Sanción que un funcionario asigna al alumno que intenta reclamar como propio un objeto que no le pertenece o que respalda su reclamo con documentación falsa.

## Registro y acceso

### RF1 Registro del alumno con correo institucional

El usuario que se registra por primera vez en la plataforma ingresa su correo institucional y acepta los términos de uso. El sistema acepta únicamente correos con el dominio `@alumnos.ubiobio.cl`, de hasta 254 caracteres y que no estén ya registrados, y rechaza cualquier otro indicando el motivo exacto del rechazo. En este paso no se solicita contraseña. Aceptado el correo, el sistema crea la cuenta con rol de alumno en estado no verificado, sin acceso a ninguna función de la plataforma, y envía el código de verificación.

### RF2 Verificación del correo institucional

El usuario recién registrado con rol de alumno recibe del sistema un correo con un código numérico de seis dígitos y lo escribe en la pantalla de verificación para acreditar que ese correo le pertenece. Dispone de quince minutos de vigencia y de tres intentos, y ante un intento fallido el sistema no le informa si el error estuvo en el código o en el correo, para que nadie averigüe por esa vía qué correos están registrados. Vencidos los quince minutos o agotados los tres intentos, el usuario pide un código nuevo, y puede pedir hasta tres códigos por hora; cada código nuevo deja sin efecto al anterior, de modo que nunca existan dos códigos válidos para una misma cuenta. Mientras no complete esta verificación no puede iniciar sesión ni entrar a ninguna pantalla de la aplicación. Escrito el código correcto, la cuenta queda verificada y pasa de inmediato a definir su contraseña.

### RF3 Definición de la contraseña en el primer ingreso

El usuario con rol de alumno que ingresa por primera vez define su contraseña antes de acceder a cualquier función, escribiéndola dos veces, y en esa misma pantalla lee que su cuenta queda protegida con un segundo factor de autenticación ya activo, que recibirá ese código en el mismo correo institucional con el que se registró y que podrá desactivarlo más adelante desde la configuración de su cuenta. No puede saltarse este paso, ni entrar a ninguna otra pantalla antes de completarlo, ni rechazar la activación del segundo factor.

Su contraseña debe cumplir seis condiciones: tener al menos 10 caracteres, empezar con una letra mayúscula, contener al menos un carácter especial de puntuación o símbolo, no incluir tres o más dígitos consecutivos en orden ascendente ni descendente como 123 o 321, no repetir un mismo carácter tres o más veces seguidas, y no contener su correo institucional ni la parte de éste anterior a la arroba. Desde el momento en que el sistema conoce sus datos personales, esta última condición alcanza además su nombre, sus apellidos y su rut, y rige en todo cambio o recuperación posterior. Mientras la escribe, el usuario ve cuáles de las seis cumple y cuáles no, y si incumple alguna, o si las dos escrituras no coinciden, el sistema la rechaza indicándole cuál falló.

El sistema guarda la contraseña con un algoritmo de resumen diseñado para contraseñas y nunca en texto legible. Definida la contraseña, la cuenta queda activa y el usuario accede a la plataforma.

### RF4 Inicio de sesión del alumno

El usuario con rol de alumno inicia sesión ingresando su correo institucional y su contraseña, y a continuación el código numérico de seis dígitos que recibe en su correo mientras mantenga activo su segundo factor. Ese código tiene quince minutos de vigencia y tres intentos, y queda sin efecto apenas el usuario pida uno nuevo, empiece otro intento de sesión o complete la verificación. Mientras no complete los dos factores no entra a ninguna pantalla de la aplicación.

El sistema deniega el acceso, con un mismo mensaje que no permite deducir si ese correo existe, cuando el correo no está registrado, cuando la contraseña no coincide o cuando la cuenta todavía no está verificada. La única excepción es la cuenta bloqueada por acumulación de strikes: cuando el correo y la contraseña son correctos y la cuenta está bloqueada, el sistema sí indica que la cuenta ha sido bloqueada y que debe contactarse con Rectoría para solucionarlo. La distinción es deliberada y no debilita lo anterior: quien acertó la contraseña ya acreditó ser el titular, de modo que informarle no revela nada a un tercero, y sin ese mensaje el alumno sancionado no tendría cómo saber que su vía de solución es presencial.

Tras cinco intentos fallidos consecutivos el sistema bloquea el acceso a esa cuenta durante quince minutos y envía un correo avisando del bloqueo, de modo que el titular se entere si el intento no fue suyo. Iniciada la sesión, el usuario alcanza únicamente las funciones de su rol y ninguna otra, la sesión caduca a los treinta minutos sin actividad y a las doce horas de haberse abierto, y el usuario puede cerrarla en cualquier momento.

### RF5 Recuperación de contraseña

El usuario con rol de alumno que no recuerda su contraseña la recupera desde la pantalla de inicio de sesión escribiendo su correo institucional. Recibe en ese correo un código de seis dígitos con quince minutos de vigencia y tres intentos, admite hasta tres solicitudes por hora, y ve siempre el mismo mensaje en pantalla exista o no una cuenta asociada a ese correo, para que nadie averigüe por esa vía qué correos están registrados. Verificado el código, escribe una contraseña nueva, que debe cumplir las mismas seis condiciones de su primer ingreso y ser distinta de la anterior. Confirmada, entra con ella de inmediato, la contraseña anterior deja de servir, toda sesión que siguiera abierta con la anterior se cierra y el usuario recibe un correo avisándole de que su contraseña fue cambiada.

### RF6 Inicio de sesión del funcionario

El usuario con rol de funcionario inicia sesión ingresando el correo institucional con el que Rectoría lo dio de alta y su contraseña, que cumple las mismas seis condiciones exigidas a toda cuenta, y a continuación el código de seis dígitos que recibe en su correo mientras mantenga activo su segundo factor, con la misma vigencia de quince minutos y tres intentos. El sistema deniega el acceso con un mismo mensaje, que no permite deducir si ese correo existe, cuando el correo no está registrado, cuando la contraseña no coincide o cuando la cuenta fue desactivada por Rectoría; y tras cinco intentos fallidos consecutivos bloquea el acceso a esa cuenta durante quince minutos y envía un correo avisando del bloqueo. Las cuentas de funcionario no se registran por cuenta propia: solo Rectoría las crea. Iniciada la sesión, el funcionario alcanza únicamente las funciones de su rol, la sesión caduca a los treinta minutos sin actividad y a las doce horas de haberse abierto, y puede cerrarla cuando quiera.

### RF7 Recinto asignado y ámbito de las acciones del funcionario

El usuario logueado con rol de funcionario trabaja con un recinto asignado por Rectoría, que el sistema muestra de forma permanente en pantalla y que determina el alcance de lo que puede hacer: registra objetos, cita alumnos, entrega objetos y asigna strikes únicamente sobre objetos depositados en su recinto, y el sistema rechaza cualquiera de esas acciones sobre un objeto de otro. La consulta, en cambio, alcanza el inventario y el foro completos de todo el campus Concepción, porque es esa visión conjunta la que permite avisarle a un alumno que su objeto está en un recinto distinto del que frecuenta. Un funcionario pertenece a un solo recinto a la vez y únicamente Rectoría modifica esa asignación.

## Perfil del alumno

### RF8 Registro y consulta de los datos personales del alumno

El usuario logueado con rol de alumno completa en su primer ingreso su rut, nombre, apellidos, carrera y fotografía, y desde ahí los consulta cuando quiera, porque es contra esos datos que el funcionario lo reconoce al momento de entregarle un objeto. El sistema valida el dígito verificador del rut, exige que el nombre y los apellidos tengan entre 2 y 60 caracteres, que la carrera se elija de una lista fija y que la fotografía sea JPG o PNG de hasta 5 MB y de al menos 300 por 300 píxeles. El rut, el nombre, los apellidos y la carrera quedan fijos una vez guardados y solo Rectoría los corrige; la fotografía la reemplaza el propio usuario cuando quiera. Mientras estos datos estén incompletos, el sistema no le permite publicar ningún aviso.

## Avisos de pérdida

### RF9 Publicación de un aviso de pérdida

El usuario logueado con rol de alumno, con sus datos personales completos y sin la cuenta bloqueada, publica un aviso declarando que perdió un objeto, completando campos separados y no un texto libre, porque es sobre esos campos que el funcionario compara después: tipo de objeto elegido de una lista fija, color, marca o señas particulares de entre 20 y 500 caracteres, recinto donde lo perdió elegido de la lista de recintos activos y fecha de la pérdida, más una fotografía opcional del objeto en JPG o PNG de hasta 5 MB. El sistema rechaza el aviso si falta cualquier campo obligatorio, si la fecha es futura o anterior a 180 días, si la imagen excede el formato o el peso permitidos, o si el usuario ya tiene cinco avisos abiertos. El usuario no visualiza en ningún momento los objetos que la universidad tiene en depósito, ni su fotografía, descripción, ubicación o cantidad, y no dispone de búsqueda ni de filtros sobre ellos. Publicado el aviso, queda registrado con su fecha y hora, disponible para los funcionarios y visible para nadie más que su autor: ningún otro alumno lo ve.

### RF10 Confirmación previa a la publicación

El usuario logueado con rol de alumno, antes de que su aviso quede registrado, revisa en una pantalla de confirmación todo lo que está por publicar, campo por campo y con la fotografía adjunta si la incorporó, junto a la advertencia explícita de que una vez enviado no lo va a poder editar y de que revise que esté todo correcto. Desde esa misma pantalla vuelve atrás y corrige cualquier campo cuantas veces necesite. El aviso se registra solo cuando el usuario confirma de forma expresa, y desde ese instante ni la descripción ni la fotografía admiten modificación alguna, ni por el usuario ni por el funcionario. Cuando el aviso contiene un error real, el usuario lo cierra y publica uno nuevo, y el sistema deja ambos enlazados para que el funcionario vea esa corrección al evaluar el reclamo.

### RF11 Consulta del estado de los avisos propios

El usuario logueado con rol de alumno consulta el estado de cada uno de sus avisos, que es siempre uno de estos seis: publicado, citado, entregado, rechazado, cerrado o inactivo. El aviso permanece publicado mientras ningún funcionario haya actuado sobre él, y pasa a citado en el momento en que un funcionario le envía el correo solicitando su presencia, con lo que la aplicación muestra el mismo recinto y el mismo horario que indica ese correo, sin agregar información. La aplicación no le informa al alumno que se encontró un objeto, no describe nada y no le adelanta el avance del funcionario: la citación llega por correo y el estado del aviso solo refleja lo que ya se le comunicó por esa vía. El estado lo mueven el funcionario y el sistema, y la única transición que el alumno origina por su cuenta es el cierre del aviso.

### RF12 Cierre de un aviso propio

El usuario logueado con rol de alumno cierra un aviso propio seleccionando un motivo de una lista fija, que incluye haber recuperado el objeto por sus propios medios y haber cometido un error al declarar, y opcionalmente agrega un comentario de hasta 200 caracteres. El sistema exige una confirmación explícita antes de ejecutar el cierre y rechaza la operación si el aviso ya está en estado entregado, porque el cierre es definitivo y el aviso no se puede reabrir. Cerrado el aviso, el sistema lo retira de la lista de trabajo de los funcionarios y lo conserva en el historial del usuario con su motivo, su comentario y su fecha de cierre.

### RF13 Consulta del historial de avisos publicados

El usuario logueado con rol de alumno consulta el listado de todos los avisos que ha publicado, vigentes, cerrados y entregados, viendo de cada uno su fecha de publicación, su estado actual y la fecha del último cambio de estado. El sistema presenta el listado ordenado por fecha de publicación descendente, en páginas de veinte avisos, y permite filtrar por estado y por rango de fechas y abrir el detalle de cualquiera de ellos. El listado es de solo lectura: el usuario no puede editar ni eliminar un aviso ya publicado.

### RF14 Consulta del historial de retiros

El usuario logueado con rol de alumno consulta el registro de los objetos que efectivamente retiró, viendo de cada uno la fecha y hora del retiro, el recinto donde se realizó, el funcionario que se lo entregó y el aviso que le dio origen. El sistema presenta el listado ordenado por fecha de retiro descendente, en páginas de veinte registros. El registro es de solo lectura y no admite eliminación ni edición por parte del usuario, porque constituye el respaldo de la entrega frente a la universidad, y es distinto del historial de avisos: aquel deja constancia de lo que el usuario declaró haber perdido y este de lo que la universidad le entregó.

## Inventario de objetos encontrados

### RF15 Ingreso de un objeto encontrado

El usuario logueado con rol de funcionario registra en el inventario un objeto que llega a su recinto, indicando el tipo elegido de una lista fija, su color, sus marcas o señas particulares con entre 20 y 500 caracteres, el recinto donde se halló, elegido de la lista de recintos, la fecha en que lo recibió y el nombre de quien lo entregó cuando esa persona se identifica, y adjuntando al menos una fotografía en JPG o PNG de hasta 5 MB. El sistema rechaza el registro si falta cualquier campo obligatorio o la fotografía, o si la fecha de recepción es futura. Registrado el objeto, queda en el inventario en estado disponible, asociado al recinto del funcionario, con su fecha, hora y responsable de ingreso, y visible de inmediato para los funcionarios de todos los recintos.

### RF16 Consulta del inventario general

El usuario logueado con rol de funcionario consulta el inventario completo de objetos de todos los recintos, viendo de cada uno su tipo, color, señas, fotografía, recinto donde está depositado, fecha de ingreso, antigüedad en custodia y estado. El sistema presenta el listado en páginas de veinte objetos, permite filtrar por recinto, tipo, estado y rango de fechas de ingreso, y ordenar por antigüedad o por fecha de ingreso. La consulta es transversal a la Universidad y no se restringe a su propio recinto, para que el funcionario pueda reconocer un objeto declarado por un alumno aunque esté depositado en otro recinto.

### RF17 Consulta del detalle y del historial de un objeto

El usuario logueado con rol de funcionario abre el detalle de cualquier objeto del inventario y revisa su historial completo: quién lo ingresó y cuándo, las citaciones enviadas a raíz de él, las verificaciones realizadas con su resultado y su responsable, y la entrega si ya ocurrió, con su fecha y el funcionario que la autorizó. El historial es de solo lectura y ningún funcionario puede editarlo ni eliminar registros de él, porque constituye el respaldo de la actuación de la Universidad sobre ese objeto frente a un eventual reclamo.

## Foro de avisos y cruce con el inventario

### RF18 Consulta del foro de avisos de pérdida

El usuario logueado con rol de funcionario accede al foro con la totalidad de los avisos de pérdida publicados por los alumnos de la Universidad, viendo de cada uno el tipo de objeto, el color, las señas declaradas, el lugar y la fecha de la pérdida, la fotografía cuando el alumno la adjuntó, el alumno que lo publicó, el estado del aviso y su fecha de publicación. El sistema presenta el foro en páginas de veinte avisos, permite filtrar por tipo, lugar, estado y rango de fechas y ordenar por fecha de publicación, y excluye del listado los avisos cerrados, entregados e inactivos salvo que el funcionario los pida expresamente mediante el filtro de estado.

### RF19 Notificación al funcionario de nuevos avisos publicados

El usuario logueado con rol de funcionario recibe un correo electrónico cada vez que se publica un aviso de pérdida cuyo recinto declarado corresponde a su recinto, indicando el tipo de objeto, el recinto y la fecha de la pérdida y un enlace directo al aviso dentro de la plataforma. Con la sesión abierta el aviso nuevo aparece además en pantalla dentro de los cinco segundos siguientes a su publicación, junto a un contador de avisos sin revisar. El funcionario no puede desactivar este correo, porque es el mecanismo que garantiza que ningún aviso quede sin mirar.

### RF20 Búsqueda de coincidencias entre un objeto y los avisos

El usuario logueado con rol de funcionario, situado sobre un objeto del inventario, solicita al sistema los avisos que podrían corresponderle y recibe una lista de hasta veinte candidatos ordenada por grado de coincidencia, calculada sobre el tipo de objeto, el color, las señas declaradas, la cercanía entre el lugar del hallazgo y el lugar de la pérdida, calculada a partir de la ubicación geográfica (latitud y longitud) de ambos recintos, y la proximidad entre ambas fechas. El sistema excluye de esa lista los avisos cerrados, entregados e inactivos. La lista es una ayuda de búsqueda y no una resolución: el sistema no da por encontrada ninguna coincidencia ni cita a nadie por su cuenta, y es el funcionario quien revisa cada candidato y determina si corresponde continuar.

## Citación y verificación

### RF21 Citación del alumno para retirar un objeto

El usuario logueado con rol de funcionario envía al alumno una citación por correo, mediante una acción única sobre un aviso que ha determinado que corresponde a un objeto de su recinto, informándole que se encontró un objeto que corresponde a su aviso y solicitando su presencia en el recinto, con el horario de atención. El correo no describe el objeto ni adjunta su fotografía, porque revelar esos detalles le entregaría al alumno la información con la que después debe acreditar la propiedad. Enviada la citación, el aviso pasa a estado citado, el objeto queda reservado y el sistema impide citar a otro alumno por el mismo objeto mientras esa citación siga vigente.

### RF22 Citación a verificación presencial por evidencia insuficiente

El usuario logueado con rol de funcionario cita al alumno a una verificación presencial mediante un correo que le informa que debe presentarse a acreditar la propiedad de un objeto, sin identificar cuál ni describirlo. El sistema ofrece esta citación como alternativa a la de retiro para los casos en que la descripción del aviso no basta por sí sola, exige que el funcionario registre con al menos 20 caracteres por qué consideró insuficiente la evidencia, y rechaza el envío si ese motivo falta. Enviada la citación, el aviso pasa a estado citado y el objeto queda reservado, sin que el alumno pueda distinguir esta citación de la que se envía cuando la evidencia sí basta, porque saber cuán convencido está el funcionario le permitiría prepararse. Si el alumno no se presenta dentro de los diez días hábiles siguientes, la citación caduca, el objeto vuelve a estado disponible y el aviso regresa a publicado.

### RF23 Registro del resultado de la verificación presencial

El usuario logueado con rol de funcionario registra en el sistema el resultado de la verificación de un objeto citado. Para ello el sistema le presenta en una misma vista el contenido íntegro del aviso publicado por el alumno, los datos de identidad y la fotografía de su perfil, el detalle del objeto en depósito y la cantidad de strikes que esa persona acumula, de modo que disponga de todos los antecedentes al momento de resolver. El sistema le exige registrar, con al menos 20 caracteres, qué antecedentes solicitó y qué obtuvo, y mantiene la resolución deshabilitada mientras ese registro esté vacío. La resolución admite solo dos valores, propiedad acreditada o propiedad no acreditada, y el sistema no la calcula, no la sugiere ni la condiciona por ningún medio. Registrada la resolución, queda asociada de forma permanente al objeto, al aviso y al funcionario que resolvió, y habilita la entrega del objeto o la asignación de un strike según el valor ingresado.

## Entrega del objeto

### RF24 Entrega del objeto y descuento del inventario

El usuario logueado con rol de funcionario registra la entrega del objeto al alumno desde una verificación cuya resolución registrada es propiedad acreditada, y el sistema exige una confirmación explícita porque la operación es definitiva y no admite reversa. Ejecutada la entrega, el sistema descuenta el objeto del inventario y lo deja en estado entregado, con lo que deja de figurar entre los disponibles y de aparecer en las búsquedas de coincidencia; el aviso del alumno pasa a estado entregado; y quedan registradas de forma permanente la fecha, la hora, el recinto, el funcionario que autorizó la entrega y el aviso que le dio origen, tanto en el historial del objeto como en el historial de retiros del alumno.

## Régimen de strikes

### RF25 Asignación de un strike

El usuario logueado con rol de funcionario asigna un strike al alumno desde una verificación cuya resolución registrada es propiedad no acreditada, escribiendo un motivo de entre 20 y 500 caracteres que queda visible para el sancionado. El sistema habilita esta acción únicamente sobre verificaciones con esa resolución y la rechaza en cualquier otro caso. El sistema no asigna strikes por su cuenta ni los deriva automáticamente de una verificación fallida, porque no toda verificación fallida es un intento de fraude y puede tratarse de una confusión de buena fe: es siempre una acción deliberada del funcionario. Asignado el strike, queda registrado con su fecha, su motivo, el funcionario que lo asignó y el aviso que lo originó, el alumno recibe la notificación correspondiente, el objeto vuelve a estado disponible y el aviso pasa a estado rechazado.

### RF26 Consulta por el funcionario de los strikes de un alumno

El usuario logueado con rol de funcionario consulta, desde un aviso o desde la ficha del alumno, cuántos strikes acumula esa persona sobre un total de tres y el detalle de cada uno con su fecha, su motivo, el funcionario que lo asignó y el recinto donde ocurrió, incluidos los asignados en recintos distintos del suyo. Esta consulta está disponible antes de resolver una verificación, porque un historial previo de intentos es un antecedente legítimo para decidir. El funcionario no puede modificar ni eliminar un strike, sea propio o de otro funcionario.

### RF27 Consulta por el alumno de los strikes recibidos

El usuario logueado con rol de alumno consulta la totalidad de los strikes que le han sido asignados, viendo de cada uno su fecha y hora, el motivo escrito por el funcionario, el funcionario que lo asignó y el aviso o reclamo que lo originó. El sistema muestra de forma permanente y visible cuántos strikes acumula sobre un total de tres y cuántos le restan para el bloqueo. Los strikes no caducan con el paso del tiempo ni se reinician por período académico: el contador solo vuelve a cero cuando Rectoría desbloquea la cuenta. El usuario no puede modificarlos ni eliminarlos, y el sistema le indica que las objeciones se presentan presencialmente en Rectoría.

### RF28 Bloqueo de la cuenta al tercer strike

El usuario logueado con rol de alumno que acumula tres strikes queda con su cuenta bloqueada de forma automática e inmediata: el sistema cierra la sesión que tuviera abierta y da de baja todos sus avisos pendientes, que pasan a estado inactivo y dejan de aparecer en el foro y en el trabajo de los funcionarios, conservando íntegro su contenido y su historial. Desde ahí el sistema le niega el acceso a la plataforma, de modo que al intentar iniciar sesión, aun ingresando correctamente su correo y su contraseña, recibe el mensaje de que su cuenta ha sido bloqueada y que debe contactarse con Rectoría para solucionarlo, sin alcanzar ninguna función del sistema. Únicamente Rectoría desbloquea la cuenta de forma presencial, y ejecutado el desbloqueo el contador de strikes vuelve a cero, sus avisos inactivos regresan automáticamente a estado publicado y el usuario recupera la totalidad de sus funciones, quedando sujeto al mismo régimen: si vuelve a acumular tres strikes, su cuenta se bloquea otra vez y sus avisos vuelven a darse de baja.

### RF29 Efecto del tercer strike sobre los avisos del alumno

El usuario logueado con rol de funcionario que asigna el tercer strike a un alumno provoca que el sistema dé de baja automáticamente todos los avisos pendientes de esa persona, que pasan a estado inactivo, dejan de figurar en el foro y en las búsquedas de coincidencia, y liberan los objetos que estuvieran reservados por una citación suya, los cuales vuelven a estado disponible para ser cruzados con otros avisos. Los avisos inactivos no se eliminan ni se cierran: conservan íntegros su contenido y su historial, y si Rectoría desbloquea la cuenta del alumno regresan de forma automática a estado publicado y reaparecen en el foro.

## Notificaciones al alumno

### RF30 Recepción de notificaciones por el alumno

El usuario logueado con rol de alumno recibe una notificación del sistema cada vez que un funcionario registra una coincidencia con alguno de sus avisos, que uno de sus objetos queda listo para retiro, que un reclamo suyo es rechazado y que se le asigna un strike. Con la sesión abierta la notificación aparece en pantalla dentro de los cinco segundos siguientes al hecho; sin sesión abierta el sistema la conserva y el usuario la recupera como no leída al volver a entrar, con un contador de pendientes visible de forma permanente. Cada notificación guarda su fecha y hora, su tipo, el aviso al que corresponde y su condición de leída o no leída, y se conserva mientras exista la cuenta. El usuario no puede desactivar las notificaciones de coincidencia, de retiro ni de strike.

## Administración de la plataforma

El administrador corresponde a Rectoría y **administra la plataforma, no opera el proceso de objetos perdidos**. Da de alta los recintos y los funcionarios, sostiene los catálogos, corrige lo que los demás roles no pueden corregir y levanta los bloqueos de cuenta. No ingresa objetos al inventario, no consulta el foro de avisos, no cita alumnos, no entrega objetos y no asigna ni revoca strikes: esas acciones son del funcionario y quedan a su nombre, y trasladarlas al administrador rompería la cadena de responsabilidad que el resto del documento construye.

Esa frontera tiene una consecuencia que conviene anticipar. El administrador puede corregir el rut de un alumno y puede desbloquear su cuenta, pero no puede eliminar un strike ni revertir una entrega: lo primero es un dato mal escrito y lo segundo es la actuación registrada de un funcionario. Por eso las acciones del administrador sobre cuentas y datos quedan asentadas en una bitácora propia.

### RF31 Inicio de sesión del administrador

El usuario con rol de administrador inicia sesión ingresando el correo institucional de su cuenta y su contraseña, que cumple las mismas seis condiciones exigidas a toda cuenta, y a continuación el código de seis dígitos que recibe en su correo. **El administrador no puede desactivar su segundo factor de autenticación**, a diferencia del alumno y del funcionario, porque es la cuenta con más alcance del sistema y la única que no tiene otra por encima que la audite. El sistema deniega el acceso con un mismo mensaje, que no permite deducir si ese correo existe, cuando las credenciales no coinciden o cuando la cuenta fue desactivada, y tras cinco intentos fallidos consecutivos bloquea el acceso a esa cuenta durante quince minutos y envía un correo avisando del bloqueo. Las cuentas de administrador no se registran por cuenta propia y no se crean desde la plataforma: se establecen en la puesta en marcha del sistema y su alta posterior es un procedimiento interno de Rectoría. Iniciada la sesión, el administrador alcanza únicamente las funciones de su rol, la sesión caduca a los treinta minutos sin actividad y a las doce horas de haberse abierto, y puede cerrarla cuando quiera.

### RF32 Ámbito del administrador

El usuario logueado con rol de administrador actúa sobre la totalidad de la Universidad y no está asignado a ningún recinto, a diferencia del funcionario, que consulta todo pero solo actúa sobre su recinto asignado. El sistema le da acceso a la administración de recintos, funcionarios, cuentas de alumno, catálogos y bitácora, y le niega el acceso al inventario de objetos, al foro de avisos, a las citaciones, a las entregas y a la asignación de strikes, rechazando en el servidor cualquiera de esas operaciones aunque la petición se construya por fuera de la interfaz. El administrador tampoco publica avisos ni retira objetos: su cuenta no tiene rol de alumno y el sistema no le ofrece esas funciones.

### RF33 Creación de un recinto

El usuario logueado con rol de administrador crea un recinto indicando su nombre de entre 3 y 80 caracteres, su ubicación geográfica (latitud y longitud) para mostrarlo en un mapa, y su horario de atención. El sistema rechaza la creación si falta cualquiera de esos campos o si ya existe un recinto con el mismo nombre. Creado el recinto, queda en estado activo y disponible de inmediato para asignarle funcionarios y para aparecer en los formularios de avisos y de objetos, y su creación queda registrada en la bitácora (RF45) con su fecha y el administrador que lo creó. El recinto es la unidad que determina dónde se custodia físicamente un objeto y qué funcionario puede actuar sobre él, de modo que ninguna otra función del sistema opera mientras no exista al menos un recinto.

### RF34 Edición y desactivación de un recinto

El usuario logueado con rol de administrador modifica el nombre, la ubicación geográfica y el horario de atención de un recinto existente, y lo desactiva cuando deja de operar. El sistema rechaza la desactivación si el recinto tiene objetos en estado disponible o reservado en su inventario, o si tiene funcionarios asignados, e indica en pantalla cuántos de cada uno lo impiden, porque desactivar un recinto con objetos en custodia dejaría esos objetos sin nadie que responda por ellos. Desactivado el recinto, deja de ofrecerse para asignar funcionarios y desaparece de los formularios de avisos y de objetos y de los filtros, pero se conserva íntegro en los avisos, en los objetos, en el historial y en las entregas que ya lo referencian, porque un aviso publicado no admite modificación y debe seguir indicando dónde ocurrió la pérdida. Un recinto desactivado se puede reactivar y ningún recinto se elimina.

### RF35 Creación de la cuenta de un funcionario y entrega de sus credenciales

El usuario logueado con rol de administrador crea la cuenta de un funcionario indicando su rut, su nombre, sus apellidos, su correo institucional y el recinto al que queda asignado. El sistema valida el dígito verificador del rut, exige que el nombre y los apellidos tengan entre 2 y 60 caracteres, que el correo no esté ya registrado en ninguna cuenta de la plataforma y que el recinto elegido esté activo, y rechaza la creación indicando el motivo exacto cuando alguna de esas condiciones no se cumple. Creada la cuenta, el sistema genera en ese momento una contraseña temporal y la envía al correo institucional del funcionario junto al aviso de que su cuenta existe, indicando que caduca a los siete días. En su primer ingreso el funcionario reemplaza esa contraseña temporal por una propia, que cumple las mismas seis condiciones exigidas a toda cuenta, y no alcanza ninguna pantalla del sistema sin hacerlo; usada una vez, la temporal queda invalidada de inmediato. Si la contraseña temporal caduca antes de que la use, o si el funcionario la pierde, el administrador le genera otra desde la ficha del funcionario, con lo que la anterior queda invalidada y el plazo de siete días vuelve a correr. El sistema genera la contraseña temporal y la envía directamente al funcionario: el administrador no la conoce, no la elige y no la visualiza en ningún momento, de modo que ninguna acción registrada a nombre de un funcionario pueda atribuirse a que el administrador conocía su clave.

### RF36 Asignación y cambio de recinto de un funcionario

El usuario logueado con rol de administrador cambia el recinto asignado a un funcionario eligiendo un recinto activo de la lista. Un funcionario pertenece a un solo recinto a la vez, y el cambio surte efecto de inmediato: desde ese instante el funcionario deja de poder actuar sobre los objetos de su recinto anterior y pasa a poder hacerlo sobre los del nuevo, sin que su capacidad de consulta sobre el inventario y el foro de toda la Universidad se vea alterada. El sistema advierte al administrador, antes de confirmar, cuántas citaciones vigentes emitidas por ese funcionario quedan en el recinto anterior, porque esas citaciones no se trasladan: siguen vivas y las atiende quien quede en ese recinto. El cambio queda registrado con su fecha, el recinto de origen, el recinto de destino y el administrador que lo ejecutó.

### RF37 Desactivación y reactivación de la cuenta de un funcionario

El usuario logueado con rol de administrador desactiva la cuenta de un funcionario que deja de prestar servicios, con lo que el sistema le cierra la sesión que tuviera abierta y le niega el acceso, mostrándole al intentar entrar que su cuenta fue desactivada. El sistema exige una confirmación explícita y advierte cuántas citaciones vigentes emitió ese funcionario, que no caducan por la desactivación y quedan a cargo de los demás funcionarios del recinto. La desactivación no borra ni anonimiza nada: el nombre del funcionario permanece en los ingresos de objetos que registró, en las citaciones que envió, en las verificaciones que resolvió, en las entregas que autorizó y en los strikes que asignó, porque esos registros son el respaldo de la actuación de la Universidad y deben seguir indicando quién actuó. Una cuenta desactivada se puede reactivar y ninguna cuenta de funcionario se elimina.

### RF38 Consulta del padrón de funcionarios

El usuario logueado con rol de administrador consulta el listado de todos los funcionarios de la Universidad, viendo de cada uno su nombre, su rut, su correo institucional, su recinto asignado, su estado de cuenta y la fecha de su último ingreso al sistema. El sistema presenta el listado en páginas de veinte funcionarios, permite filtrar por recinto y por estado y ordenar por nombre o por recinto, y desde él se abre la ficha de cualquiera de ellos para cambiar su recinto o su estado. El listado indica además, por cada recinto activo, cuántos funcionarios tiene asignados, y señala los recintos que quedaron sin ninguno, porque un recinto sin funcionarios no puede recibir objetos ni atender citaciones.

### RF39 Consulta de la ficha de un alumno

El usuario logueado con rol de administrador busca a un alumno por su rut, su nombre o su correo institucional y abre su ficha, donde ve sus datos personales, el estado de su cuenta, la cantidad de strikes que acumula con el detalle de cada uno y el recuento de sus avisos publicados y de sus retiros realizados. El sistema no le muestra el contenido de los avisos ni las fotografías que el alumno adjuntó, porque el administrador no participa en la evaluación de la propiedad y esos antecedentes son del funcionario que resuelve. La ficha es de consulta y las únicas acciones que ofrece son la corrección de los datos fijos y el desbloqueo de la cuenta.

### RF40 Corrección de los datos fijos de un alumno

El usuario logueado con rol de administrador corrige el rut, el nombre, los apellidos o la carrera de un alumno, que son los campos que el propio alumno no puede modificar una vez guardados. El sistema aplica las mismas validaciones del registro original, exige que el administrador escriba un motivo de entre 20 y 300 caracteres y rechaza la corrección si ese motivo falta. Ejecutada la corrección, el sistema deja asentados en la bitácora el valor anterior, el valor nuevo, el motivo, la fecha y el administrador que la realizó, y notifica al alumno que sus datos fueron corregidos. El administrador no puede modificar el correo institucional de un alumno, porque es la identidad con la que la cuenta fue verificada.

### RF41 Desbloqueo de la cuenta de un alumno

El usuario logueado con rol de administrador desbloquea la cuenta de un alumno bloqueada por acumulación de tres strikes, tras la gestión presencial en que el alumno presenta sus objeciones. El sistema exige que el administrador escriba el fundamento del desbloqueo con entre 20 y 500 caracteres y una confirmación explícita. Ejecutado el desbloqueo, el contador de strikes vuelve a cero, los avisos que habían quedado inactivos regresan de forma automática a estado publicado y reaparecen en el foro de los funcionarios, y el alumno recupera la totalidad de sus funciones, quedando sujeto al mismo régimen: si vuelve a acumular tres strikes, su cuenta se bloquea otra vez. Los strikes que dieron origen al bloqueo no se eliminan y permanecen visibles en el historial del alumno y en el registro de la Universidad, porque el desbloqueo restituye el acceso pero no borra lo ocurrido.

### RF42 Consulta del registro de strikes de la Universidad

El usuario logueado con rol de administrador consulta la totalidad de los strikes asignados en la Universidad, viendo de cada uno el alumno sancionado, la fecha, el motivo escrito por el funcionario, el funcionario que lo asignó y el recinto donde ocurrió. El sistema presenta el registro en páginas de veinte, permite filtrar por recinto, por funcionario, por alumno y por rango de fechas, y señala qué cuentas se encuentran bloqueadas. El registro es de solo lectura: el administrador no puede modificar ni eliminar un strike, y la vía para dejar sin efecto sus consecuencias es el desbloqueo de la cuenta, que queda fundado y registrado a su nombre.

### RF43 Gestión del catálogo de recintos (fusionado en v1.3)

Desde la versión 1.3 los recintos se administran mediante RF33 y RF34; este requerimiento ya no define un comportamiento propio.

### RF44 Gestión de los catálogos de tipos de objeto y de carreras

El usuario logueado con rol de administrador administra la lista fija de tipos de objeto, que el alumno y el funcionario usan para clasificar lo perdido y lo encontrado, y la lista fija de carreras que el alumno elige en su perfil, agregando entradas, editando su nombre y retirándolas de uso. El sistema rechaza el nombre repetido dentro de un mismo catálogo y, al retirar una entrada, la deja de ofrecer en los formularios pero la conserva en los registros que ya la referencian. El tipo de objeto es uno de los campos sobre los que el sistema calcula la coincidencia entre un objeto y un aviso, de modo que un catálogo demasiado grueso o demasiado fino degrada esa búsqueda, y el administrador es quien responde por mantenerlo utilizable.

### RF45 Bitácora de las acciones del administrador

El sistema registra en una bitácora toda acción del administrador que altere cuentas, datos o catálogos: la creación y desactivación de recintos, la creación, el cambio de recinto y la desactivación de funcionarios, la corrección de datos fijos de un alumno, el desbloqueo de cuentas y los cambios en los catálogos. De cada acción quedan asentados la fecha y hora, el administrador que la ejecutó, el elemento afectado, el valor anterior y el valor nuevo cuando corresponde, y el motivo cuando el sistema lo exigió. El usuario logueado con rol de administrador consulta esa bitácora en páginas de veinte registros y la filtra por tipo de acción, por administrador y por rango de fechas. La bitácora es de solo lectura y ningún usuario puede editarla ni eliminar registros de ella, incluido el propio administrador, porque es el único control que existe sobre la cuenta que no tiene otra por encima.

## Cuenta y sesión

Los dos requerimientos de esta sección rigen para todo usuario autenticado, sea alumno, funcionario o administrador, y por eso no se repiten en las secciones de cada rol. Se numeran a continuación de los del administrador porque se incorporaron en la versión 1.2 del documento, no porque sean posteriores en el flujo: en la práctica el usuario los alcanza desde la configuración de su cuenta apenas ingresa por primera vez.

### RF46 Activación y desactivación del segundo factor de autenticación

El usuario logueado que ya ingresó al menos una vez activa o desactiva su segundo factor de autenticación cuando quiera, desde la configuración de su cuenta, donde lee si lo tiene activo o inactivo. Para desactivarlo escribe su contraseña vigente y además el código de seis dígitos que recibe en su correo, con los mismos quince minutos de vigencia y tres intentos, de modo que quien haya tomado una sesión ajena no pueda bajarle la protección a la cuenta. No puede desactivarlo durante su primer ingreso. Cada vez que lo activa o lo desactiva recibe un correo avisándole del cambio. **El administrador no puede desactivarlo en ningún caso** (RF31): la opción no se le ofrece y el sistema rechaza la operación en el servidor.

### RF47 Cambio de contraseña por el propio usuario

El usuario logueado cambia su contraseña cuando quiera desde la configuración de su cuenta, escribiendo la contraseña vigente y la nueva dos veces. El sistema rechaza el cambio si la contraseña actual no coincide, si la nueva incumple alguna de las seis condiciones del primer ingreso o si es igual a la que ya tiene. Confirmado el cambio, el usuario sigue trabajando en la sesión desde la que lo hizo, cualquier otra sesión suya que estuviera abierta se cierra y recibe un correo avisándole del cambio. El funcionario que ingresa por primera vez con una contraseña temporal no usa este requerimiento sino el reemplazo obligatorio de RF35, que ocurre antes de alcanzar ninguna pantalla.
