# 🎉 Celebración React

Una aplicación web para crear presentaciones mágicas de cumpleaños con fotos desde Google Drive. Convierte tus carpetas de fotos en un slideshow interactivo con efectos especiales como confetti, corazones y brillos.

## ✨ Funcionalidades

- **Integración con Google Drive**: Accede a tus carpetas de fotos directamente
- **Slideshow interactivo**: Controles de reproducción, pausa, anterior/siguiente
- **Efectos especiales**: Confetti, corazones flotantes y brillos animados
- **Configuración personalizable**: Ajusta la velocidad del slideshow
- **Diseño responsive**: Optimizado para diferentes tamaños de pantalla
- **Tema de cumpleaños**: Colores vibrantes y animaciones festivas

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework CSS para estilos
- **Google Drive API** - Integración con Google Drive
- **Lucide React** - Iconos

## 🏗️ Arquitectura

La aplicación está estructurada de forma modular para facilitar el mantenimiento y escalabilidad:

```
src/
├── components/          # Componentes React reutilizables
│   ├── Auth/           # Pantalla de autenticación
│   ├── FolderSelection/ # Selección de carpetas
│   ├── Slideshow/      # Componentes del slideshow
│   └── Effects/        # Efectos especiales
├── hooks/              # Custom hooks para lógica reutilizable
│   ├── useGoogleAPI.js    # Inicialización de Google API
│   ├── useGoogleAuth.js   # Autenticación
│   ├── useGoogleDrive.js  # Operaciones de Drive
│   ├── useEffects.js      # Gestión de efectos
│   └── useSlideshow.js    # Lógica del slideshow
├── config/             # Configuración y constantes
├── utils/              # Utilidades y helpers
└── App.jsx            # Componente principal (107 líneas)
```

## 🚀 Instalación y Deploy

### Desarrollo Local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/hhsantos/celebracion-react.git
   cd celebracion-react
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus credenciales de Google:
   ```
   VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
   VITE_GOOGLE_API_KEY=tu_api_key_aqui
   ```

4. **Ejecuta la aplicación**
   ```bash
   npm run dev
   ```

### Deploy Automático con Vercel

Este proyecto está configurado para deploy automático a Vercel usando GitHub Actions.

#### Configuración en Vercel:
1. **Conecta tu repositorio** en [vercel.com](https://vercel.com)
2. **Configura variables de entorno** en Vercel:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_API_KEY`

#### Configuración en GitHub:
Añade estos secrets en tu repositorio (Settings → Secrets):
- `VERCEL_TOKEN` - Token de Vercel
- `VERCEL_ORG_ID` - ID de tu organización
- `VERCEL_PROJECT_ID` - ID del proyecto
- `VITE_GOOGLE_CLIENT_ID` - Client ID de Google
- `VITE_GOOGLE_API_KEY` - API Key de Google

#### Deploy automático:
- **Push a `main`** → Deploy a producción
- **Pull Request** → Deploy preview automático

## 🔧 Configuración de Google Drive API

Para usar la aplicación necesitas configurar las credenciales de Google Drive API:

### 1. Crear proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Drive

### 2. Configurar credenciales
1. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente OAuth 2.0**
2. Configura los orígenes JavaScript autorizados:
   - `http://localhost:3000` (para desarrollo)
   - `http://localhost:5173` (para Vite dev server)
   - `https://tu-app.vercel.app` (tu dominio de Vercel)
   - Tu dominio personalizado (si tienes uno)
3. Copia el **Client ID** y **API Key**

**Importante**: Después del deploy a Vercel, debes añadir tu URL de producción a los orígenes autorizados en Google Cloud Console para que funcione correctamente.

### 3. Variables de entorno
Añade las credenciales a tu archivo `.env`:
```
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
VITE_GOOGLE_API_KEY=tu_api_key_aqui
```

## 📱 Uso

1. **Autenticación**: Haz clic en "Conectar con Google Drive"
2. **Selecciona carpeta**: Elige una carpeta que contenga imágenes
3. **Disfruta**: La aplicación cargará las imágenes y comenzará el slideshow
4. **Controles**: Usa los botones para pausar, avanzar o retroceder
5. **Configuración**: Ajusta la velocidad y activa más efectos especiales

## 🎨 Efectos Especiales

- **Confetti**: Partículas de colores que caen desde arriba
- **Corazones**: Corazones flotantes que suben desde abajo
- **Brillos**: Sparkles que parpadean por toda la pantalla
- **Transiciones**: Animaciones suaves entre imágenes

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Ejecuta ESLint para revisar el código

## 🔒 Seguridad

- Las credenciales de Google están protegidas por variables de entorno
- El archivo `.env` no se versiona (está en `.gitignore`)
- Solo se requiere acceso de lectura a Google Drive

## 🌟 Características Técnicas

### Arquitectura Modular
- **Separación de responsabilidades**: Cada componente tiene una función específica
- **Custom hooks**: Lógica reutilizable separada de la UI
- **Componentes pequeños**: Fáciles de mantener y testear
- **App.jsx limpio**: Solo 107 líneas vs 1000+ líneas originales

### Rendimiento y UX
- **Manejo de errores**: Fallbacks automáticos para imágenes que no cargan
- **Optimización**: Uso de thumbnails de alta calidad (1600px)
- **Responsive**: Funciona en desktop, tablet y móvil
- **Accesibilidad**: Controles de teclado y navegación intuitiva

### Escalabilidad
- **Hooks reutilizables**: `useGoogleAPI`, `useGoogleAuth`, `useGoogleDrive`, etc.
- **Componentes modulares**: Fácil añadir nuevas pantallas o efectos
- **Configuración centralizada**: Constantes en archivos separados
- **Utils compartidos**: Funciones de utilidad reutilizables

## 🤝 Contribuir

La arquitectura modular hace que contribuir sea fácil:

### Añadir nuevos efectos
1. Crea un componente en `src/components/Effects/`
2. Añade la lógica en `src/hooks/useEffects.js`
3. Actualiza `EffectsContainer.jsx`

### Añadir nuevas pantallas
1. Crea componentes en `src/components/NuevaPantalla/`
2. Añade la lógica en un custom hook si es necesario
3. Integra en `App.jsx`

### Proceso de desarrollo
1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo `LICENSE` para más detalles.

## 🎯 Roadmap

### Nuevas funcionalidades
- [ ] Soporte para videos
- [ ] Música de fondo
- [ ] Modo pantalla completa
- [ ] Compartir slideshow por enlace
- [ ] Integración con otros servicios de almacenamiento

### Mejoras técnicas
- [ ] Tests unitarios para componentes
- [ ] Tests de integración para hooks
- [ ] Storybook para documentar componentes
- [ ] TypeScript migration
- [ ] Performance monitoring
- [ ] Lazy loading de componentes

### Efectos especiales
- [ ] Más tipos de partículas personalizables
- [ ] Transiciones entre imágenes
- [ ] Filtros y efectos de imagen
- [ ] Modo presentación automática

---

¡Hecho con ❤️ para celebrar momentos especiales!
