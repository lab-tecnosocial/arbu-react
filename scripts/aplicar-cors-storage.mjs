import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const corsFile = resolve(root, 'storage-cors.json')
const env = Object.fromEntries(
  readFileSync(resolve(root, '.env'), 'utf8')
    .split('\n')
    .filter((linea) => linea && !linea.startsWith('#') && linea.includes('='))
    .map((linea) => {
      const i = linea.indexOf('=')
      return [linea.slice(0, i), linea.slice(i + 1)]
    }),
)

const buckets = [
  env.VITE_STORAGE_BUCKET,
  'arbu-test.firebasestorage.app',
  'arbu-c574d.appspot.com',
].filter((nombre, i, all) => nombre && all.indexOf(nombre) === i)

const intentar = (comando, args) => spawnSync(comando, args, { stdio: 'inherit' })

for (const bucket of buckets) {
  console.log(`CORS → gs://${bucket}`)
  const gsutil = intentar('gsutil', ['cors', 'set', corsFile, `gs://${bucket}`])
  if (gsutil.status === 0) continue
  const gcloud = intentar('gcloud', [
    'storage', 'buckets', 'update', `gs://${bucket}`, `--cors-file=${corsFile}`,
  ])
  if (gcloud.status !== 0) {
    console.error(`No se pudo aplicar CORS en ${bucket}. Instala gsutil o gcloud e inicia sesión.`)
    process.exitCode = 1
  }
}
