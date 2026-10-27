# 🤝 Guía para Compartir y Trabajar en Equipo en Nutricenter

Esta guía detalla los pasos para compartir el proyecto **Nutricenter** con tu equipo y trabajar de forma colaborativa sin sobrescribir el trabajo de los demás.

---

## 📌 Método 1: Repositorio en GitHub (Recomendado para trabajo en equipo)

GitHub es el estándar de la industria para que varios desarrolladores trabajen en el mismo código mediante ramas (*branches*), control de cambios y revisiones.

### Paso 1: Configurar tu identidad en Git (si no lo has hecho)
Abre la terminal en la carpeta del proyecto y ejecuta:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu_correo@ejemplo.com"
```

### Paso 2: Crear el primer commit
En la terminal del proyecto:
```bash
git add .
git commit -m "feat: inicializacion del proyecto Nutricenter"
```

### Paso 3: Crear el repositorio en GitHub
1. Ingresa a [GitHub.com](https://github.com/) e inicia sesión.
2. Haz clic en el botón verde **"New"** (o en el ícono `+` en la esquina superior derecha -> **New repository**).
3. Nombre del repositorio: `nutricenter` (o el nombre que prefieras).
4. Elige si será **Público** o **Privado**.
5. **No marques** las casillas de "Add a README", ".gitignore" o "license" (el proyecto ya los tiene).
6. Haz clic en **Create repository**.

### Paso 4: Vincular y subir tu código a GitHub
Copia los comandos que te muestra GitHub en la sección *"push an existing repository from the command line"*:
```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nutricenter.git
git push -u origin main
```
*(GitHub te solicitará iniciar sesión o ingresar tu token de acceso la primera vez).*

### Paso 5: Invitar a tus colaboradores
Para que tus compañeros puedan descargar y subir cambios:
1. En tu repositorio en GitHub, ve a la pestaña **Settings** (Configuración).
2. En el menú izquierdo, selecciona **Collaborators**.
3. Haz clic en **Add people**.
4. Escribe el correo electrónico o nombre de usuario de GitHub de cada compañero y envíales la invitación.
5. Ellos recibirán un correo con un enlace para aceptar la invitación.

---

## 🌿 Flujo de Trabajo en Equipo con Git (Buenas Prácticas)

Para evitar conflictos y no borrarse código entre sí:

### 1. Clonar el proyecto (Lo hace cada compañero nuevo)
```bash
git clone https://github.com/TU-USUARIO/nutricenter.git
cd nutricenter
```

### 2. Siempre trabajar en una rama propia (Branching)
Nunca trabajen directamente sobre `main`. Cada quien crea una rama para su tarea:
```bash
# Actualizar los últimos cambios
git pull origin main

# Crear y pasarse a una rama nueva
git checkout -b feature/modulo-ventas
```

### 3. Guardar y subir cambios
```bash
git add .
git commit -m "feat: agregar validacion de stock en ventas"
git push origin feature/modulo-ventas
```

### 4. Crear un Pull Request (PR) en GitHub
1. En GitHub, aparecerá el botón **"Compare & pull request"**.
2. Tu equipo puede revisar los cambios antes de unirlos a la rama principal `main`.
3. Al aprobarse, se hace **Merge**.

---

## ⚡ Método 2: Programación en Tiempo Real con VS Code Live Share

Si necesitan programar **al mismo tiempo en la misma pantalla**, explicar código o depurar un error juntos:

1. En VS Code, abre la pestaña de **Extensiones** (`Ctrl + Shift + X`).
2. Busca e instala: **Live Share** (de Microsoft).
3. Haz clic en el nuevo botón **Live Share** en la barra de estado inferior (o en la barra lateral).
4. Inicia sesión con tu cuenta de GitHub o Microsoft.
5. Haz clic en **Share (Compartir)**: se copiará un enlace al portapapeles.
6. Pásale ese enlace a tu compañero: él podrá abrir el proyecto en su propio VS Code y ver tu cursor, editar en vivo y compartir la terminal y el servidor local sin necesidad de clonar archivos.

---

## 🛠️ Puesta en Marcha para cada Colaborador

Cada integrante del equipo debe seguir estos pasos en su máquina local:

1. **Configurar Base de Datos:**
   - Iniciar **XAMPP**, **Laragon** o su gestor MySQL preferido.
   - Crear la base de datos `nutricenter_db` en phpMyAdmin o consola MySQL.
   - Importar `database/estructura.sql` y luego `database/datos_iniciales.sql`.

2. **Variables de Entorno (Opcional):**
   - Si su usuario o contraseña de MySQL difiere de los valores por defecto (`root` sin contraseña), pueden guiarse con el archivo `.env.example`.

3. **Ejecutar el Servidor Local:**
   - Con XAMPP/Laragon: colocar la carpeta en `htdocs` o `www`, o crear un VirtualHost.
   - O usando el servidor integrado de PHP en la terminal del proyecto:
     ```bash
     php -S localhost:8000
     ```
   - Abrir en el navegador: `http://localhost:8000/index.html`
