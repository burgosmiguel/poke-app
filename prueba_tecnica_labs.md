# Prueba Técnica — Desarrollador(a) Senior Full Stack

## 1. Objetivo

Desarrollar una pequeña aplicación **full stack** que consuma la [PokéAPI](https://pokeapi.co/) y permita al usuario gestionar sus pokémones favoritos. El desarrollo debe entregarse **dockerizado** y contar con un feature de **comunicación en tiempo real vía sockets** entre frontend y backend.

El foco de esta prueba no es la complejidad funcional, sino evaluar buenas prácticas de programación, manejo de estado, comunicación cliente-servidor y conocimientos de despliegue con contenedores.

---

## 2. Stack técnico

### Backend (elegir una opción)
- Node.js con **Express**

### Frontend (elegir una opción)
- **Vue**
- Manejador de estado a elección del candidato

### Base de datos
- Cualquier motor relacional: **PostgreSQL**
- La BD debe estar dockerizada

### Sockets
- **Socket.IO**

---

## 3. Funcionalidades requeridas

### 3.1 Consumo de PokéAPI
- Listar pokémones con paginación (usando el endpoint `https://pokeapi.co/api/v2/pokemon`)
- Ver detalle de un pokémon (imagen, tipos, stats básicos)

### 3.2 CRUD de Favoritos
- Agregar un pokémon a la lista de favoritos
- Listar favoritos guardados
- Eliminar un pokémon de favoritos
- Agregar una nota personal al favorito, editable

Los favoritos deben persistir en la base de datos local del proyecto.

> **Nota sobre usuarios:** No se requiere autenticación real. Puede asumirse un único usuario, o bien un identificador simple (ej: nombre de usuario por localStorage/header). Lo importante es que los datos persistan en la BD.

### 3.3 Feature en tiempo real (sockets)
Cuando un cliente realice una acción CRUD sobre los favoritos, los demás clientes conectados deben recibir la actualización **sin necesidad de refrescar la página**.

Se requiere que al menos **dos eventos** se propaguen por socket. Ejemplos válidos:
- `favorite:added`
- `favorite:removed`
- `favorite:updated` (si se implementa la edición de nota)

**Flujo esperado:**
1. Cliente A agrega un pokémon a favoritos → `POST /favorites`
2. Backend persiste en BD
3. Backend emite evento socket a todos los clientes conectados
4. Cliente B actualiza su UI automáticamente al recibir el evento

### 3.4 Feature
Mostrar una notificación visual (toast) cuando se reciba un evento remoto.

---

## 4. Requisitos de entrega

### 4.1 Docker
- El proyecto debe levantarse con **un solo comando**: `docker-compose up`
- Incluir `docker-compose.yml` con todos los servicios necesarios (backend, frontend, BD)
- Variables de entorno en archivo `.env.example`

### 4.2 Repositorio
- Entregar link a **repositorio público en GitHub** (u otro proveedor git)
- Commits con mensajes descriptivos (se valorará el historial)

### 4.3 README
El README debe incluir obligatoriamente:
1. **Descripción** breve del proyecto y decisiones técnicas tomadas
2. **Requisitos previos** (versión de Docker, etc.)
3. **Instrucciones de instalación y ejecución** paso a paso
4. **Puertos** utilizados por cada servicio
5. **Sección específica: "Cómo probar el feature de tiempo real"** con pasos claros (ej: *"Abrir dos pestañas del navegador en `http://localhost:XXXX`, agregar un favorito en una, observar en la otra..."*)
6. **Endpoints del backend** (puede ser una tabla simple o un link a colección Postman/Insomnia)

### 4.4 Logging mínimo
- El backend debe loguear en consola:
  - Conexión y desconexión de clientes socket
  - Emisión de eventos socket
  - Errores relevantes

---

## 5. Consideraciones adicionales

- **Validaciones:** Se valoran validaciones básicas en backend (campos requeridos, longitudes, etc.)
- **Manejo de errores:** Respuestas HTTP coherentes y mensajes de error claros
- **Estructura del código:** Separación de responsabilidades (controladores, servicios, repositorios, etc.)
- **Estilo de UI:** No se evalúa diseño estético. Una UI funcional y limpia es suficiente.
- **Tests:** No son obligatorios, pero se valoran positivamente (aunque sea uno o dos tests de ejemplo)

---

## 6. Tiempo y entrega

- **Plazo de entrega:** 1 semana desde la recepción de esta prueba
- **Formato de entrega:** enviar link del repositorio al correo/contacto indicado

---

## 7. Qué se evaluará

- Funcionamiento correcto del CRUD y del feature en tiempo real
- Calidad y organización del código
- Correcta dockerización y facilidad para levantar el entorno
- Calidad del README e instrucciones
- Manejo de errores y validaciones
- Decisiones técnicas razonables y justificadas