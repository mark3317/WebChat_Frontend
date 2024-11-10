//! ЛУШЧЕ ПЕРЕДЕЛАТЬ ВМЕСТО ЗАПРОСАЛЬ НА ПРОФЛИЬ СДЕЛАТЬ ЗАПРОС ПО НИКНЕЙМУ

//* Получаем свои данные профиля по токену
export async function fetchUserProfile(token) {
  try {
    const response = await fetch("http://94.242.53.252:8081/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Не удалось получить данные профиля:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении данных профиля:", error);
    return null;
  }
}
