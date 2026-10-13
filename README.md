# API REST de Solicitudes Comerciales

API desarrollada con NestJS, TypeScript, TypeORM y postgres para registrar y gestionar solicitudes comerciales.

## Requisitos

* Node.js y npm.
* NestJS CLI.
* Base de datos postgresql, gestionada mediante TypeORM.

## Instalación

```bash
npm install
```

Crear el archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=3000
API_KEYS=clave-prueba-uno,clave-prueba-dos
```

Las claves del ejemplo son ficticias.

## Ejecución

```bash
docker compose up --build
```

La API estará disponible en `http://localhost:3000`.

Documentación Swagger: `http://localhost:3000/docs`.

## Encabezados requeridos

Todas las rutas funcionales requieren:

* `x-api-key`: una de las claves configuradas en `API_KEYS`.
* `x-user`: un usuario de prueba válido.


## Endpoints

| Método | Ruta                      | Descripción                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/solicitudes`            | Crear solicitud                 |
| GET    | `/solicitudes`            | Listar solicitudes según el rol |
| GET    | `/solicitudes/:id`        | Consultar solicitud por ID      |
| PATCH  | `/solicitudes/:id/estado` | Cambiar estado                  |

## Estados y transiciones

Estados válidos: `PENDIENTE`, `EN_GESTION` y `RESUELTA`.

Transiciones permitidas:

* `PENDIENTE` → `EN_GESTION`
* `EN_GESTION` → `RESUELTA`

Las nuevas solicitudes siempre se crean en `PENDIENTE`.

## Arquitectura

* **Controller:** recibe las peticiones HTTP.
* **Service:** aplica las reglas de negocio y los permisos.
* **DAO:** concentra las consultas y operaciones de persistencia.
* **Entity:** define las tablas y relaciones de TypeORM.
* **DTO:** valida los datos recibidos.
* **Guards:** verifican API Key, usuario y rol.
* **Interceptor:** estandariza las respuestas exitosas.
* **Exception Filter:** normaliza los errores.
* **Swagger:** documenta los endpoints.

## Persistencia

Los registros se guardan en Postgresql mediante TypeORM. La entidad `Solicitud` se relaciona con la entidad `Estado`. Los usuarios se mantienen en memoria para esta prueba.
