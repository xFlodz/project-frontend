// src/config/config.js

export const config = {
    assetsPath: 'D:/Users/xFlod/PycharmProjects/backendFlask/src/assets',  // Путь к папке с изображениями
  
    // Функция для получения полного пути к изображениям
    getImagePath: (imageName) => {
      return `${config.assetsPath}/${imageName}`;
    },
  };
  