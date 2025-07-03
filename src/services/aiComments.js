// Banco de comentarios pre-generados para el slideshow de cumpleaños
const COMMENT_CATEGORIES = {
  celebrative: [
    "¡Qué momento tan especial! ✨",
    "¡Esta foto merece estar enmarcada! 🖼️",
    "¡Pura felicidad en una imagen! 🎉",
    "¡Momentos como estos son los que más importan! 💫",
    "¡Esta sonrisa ilumina todo el lugar! ☀️",
    "¡Un recuerdo que durará para siempre! 📸",
    "¡La alegría se siente hasta aquí! 🌟",
    "¡Perfecto timing para esta foto! ⏰"
  ],
  
  funny: [
    "¡Esa cara de felicidad no tiene precio! 😄",
    "¡Alguien está disfrutando la fiesta al máximo! 🎭",
    "¡La sonrisa más contagiosa del día! 😁",
    "¡Se nota que el pastel estaba delicioso! 🍰",
    "¡Cuando la diversión es real! 🎪",
    "¡Esa risa podría curar cualquier mal día! 😂",
    "¡La felicidad en estado puro! 🤗",
    "¡Momento digno de una película! 🎬"
  ],
  
  loving: [
    "¡Se nota el amor en cada pixel! ❤️",
    "¡Qué hermosa conexión entre todos! 💕",
    "¡Los mejores momentos son los compartidos! 🫶",
    "¡El cariño se siente a través de la pantalla! 💖",
    "¡Familia y amigos, lo más importante! 👨‍👩‍👧‍👦",
    "¡Estos son los tesoros de la vida! 💎",
    "¡Amor puro en una fotografía! 💝",
    "¡Unidos en la celebración! 🤝"
  ],
  
  birthday: [
    "¡Feliz cumpleaños! Que se repitan estos momentos! 🎂",
    "¡Otro año de vida, otro año de felicidad! 🎈",
    "¡Los cumpleaños son para crear recuerdos así! 🎁",
    "¡Celebrando la vida de la mejor manera! 🎊",
    "¡Un año más sabio y más feliz! 🌱",
    "¡Que todos tus deseos se hagan realidad! ⭐",
    "¡La edad es solo un número, la diversión es eterna! 🎯",
    "¡Brindando por muchos cumpleaños más! 🥳"
  ],
  
  memories: [
    "¡Un recuerdo que vale oro! 🏆",
    "¡Esto va directo al álbum de los favoritos! 📚",
    "¡De esos momentos que nunca se olvidan! 🧠",
    "¡Historia familiar en construcción! 🏗️",
    "¡Capturando la esencia de la felicidad! 📷",
    "¡Un pedacito de paraíso guardado en pixels! 🏝️",
    "¡La vida son momentos como este! ⏳",
    "¡Creando recuerdos una foto a la vez! 🖨️"
  ],
  
  motivational: [
    "¡Que siempre tengas motivos para sonreír así! 🌈",
    "¡La felicidad te queda perfecta! 👗",
    "¡Eres la estrella de tu propia celebración! ⭐",
    "¡Sigue brillando como solo tú sabes hacerlo! ✨",
    "¡La vida es hermosa cuando se vive intensamente! 🌺",
    "¡Que este nivel de felicidad sea tu estándar! 📊",
    "¡Mereces toda la alegría del mundo! 🌍",
    "¡Sigue coleccionando momentos como estos! 📦"
  ]
};

/**
 * Obtiene un comentario aleatorio de una categoría específica
 * @param {string} category - Categoría del comentario
 * @returns {string} Comentario aleatorio
 */
export const getCommentByCategory = (category) => {
  const comments = COMMENT_CATEGORIES[category];
  if (!comments || comments.length === 0) {
    return getRandomComment();
  }
  return comments[Math.floor(Math.random() * comments.length)];
};

/**
 * Obtiene un comentario completamente aleatorio de cualquier categoría
 * @returns {string} Comentario aleatorio
 */
export const getRandomComment = () => {
  const allComments = Object.values(COMMENT_CATEGORIES).flat();
  return allComments[Math.floor(Math.random() * allComments.length)];
};

/**
 * Obtiene un comentario inteligente basado en el contexto
 * @param {Object} context - Contexto de la imagen
 * @param {number} context.imageIndex - Índice de la imagen actual
 * @param {number} context.totalImages - Total de imágenes
 * @param {Array} context.usedComments - Comentarios ya usados
 * @returns {string} Comentario contextual
 */
export const getSmartComment = (context = {}) => {
  const { imageIndex = 0, totalImages = 1, usedComments = [] } = context;
  
  // Definir probabilidades por categoría basadas en el contexto
  let categoryWeights = {
    celebrative: 0.3,
    funny: 0.25,
    loving: 0.2,
    birthday: 0.15,
    memories: 0.05,
    motivational: 0.05
  };
  
  // Ajustar pesos según el contexto
  if (imageIndex === 0) {
    // Primera imagen: más celebrativo y de cumpleaños
    categoryWeights.celebrative = 0.4;
    categoryWeights.birthday = 0.3;
  } else if (imageIndex === totalImages - 1) {
    // Última imagen: más nostálgico y motivacional
    categoryWeights.memories = 0.3;
    categoryWeights.motivational = 0.2;
  }
  
  // Seleccionar categoría basada en pesos
  const random = Math.random();
  let accumulator = 0;
  let selectedCategory = 'celebrative';
  
  for (const [category, weight] of Object.entries(categoryWeights)) {
    accumulator += weight;
    if (random <= accumulator) {
      selectedCategory = category;
      break;
    }
  }
  
  // Obtener comentario evitando repeticiones
  let attempts = 0;
  let comment;
  
  do {
    comment = getCommentByCategory(selectedCategory);
    attempts++;
  } while (usedComments.includes(comment) && attempts < 10);
  
  // Si después de 10 intentos sigue siendo repetido, usar uno aleatorio
  if (usedComments.includes(comment)) {
    comment = getRandomComment();
  }
  
  return comment;
};

/**
 * Obtiene las categorías disponibles
 * @returns {Array} Lista de categorías
 */
export const getAvailableCategories = () => {
  return Object.keys(COMMENT_CATEGORIES);
};

/**
 * Obtiene estadísticas de los comentarios
 * @returns {Object} Estadísticas
 */
export const getCommentsStats = () => {
  const categories = Object.keys(COMMENT_CATEGORIES);
  const totalComments = Object.values(COMMENT_CATEGORIES).flat().length;
  
  return {
    totalCategories: categories.length,
    totalComments,
    averagePerCategory: Math.round(totalComments / categories.length),
    categories: categories.map(category => ({
      name: category,
      count: COMMENT_CATEGORIES[category].length
    }))
  };
};