// readme.js
const fs = require('fs');
const path = require('path');

const carpetaSrc = path.join(__dirname, 'src');

function obtenerArchivos(dir) {
  let archivos = [];
  const elementos = fs.readdirSync(dir);

  elementos.forEach((elemento) => {
    const rutaCompleta = path.join(dir, elemento);
    const stat = fs.statSync(rutaCompleta);

    if (stat.isDirectory()) {
      archivos = archivos.concat(obtenerArchivos(rutaCompleta));
    } else if (/\.(js|ts|jsx|tsx)$/.test(rutaCompleta)) {
      archivos.push(rutaCompleta);
    }
  });

  return archivos;
}

const archivos = obtenerArchivos(carpetaSrc);
let contenido = '# Código del Proyecto\n\n';

archivos.forEach((archivo) => {
  const codigo = fs.readFileSync(archivo, 'utf8');
  const rutaRelativa = path.relative(__dirname, archivo);
  contenido += `## ${rutaRelativa}\n\n\`\`\`\n${codigo}\n\`\`\`\n\n`;
});

fs.writeFileSync('README.md', contenido);
console.log('✅ README.md generado con éxito');
