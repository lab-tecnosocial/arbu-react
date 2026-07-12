function puntoEnPoligono(punto, poligono) {
  const [x, y] = punto;
  let dentro = false;

  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [xi, yi] = poligono[i];
    const [xj, yj] = poligono[j];

    const intersecta = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

    if (intersecta) dentro = !dentro;
  }

  return dentro;
}

