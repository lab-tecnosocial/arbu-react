#!/usr/bin/env bash
# Da a cada persona que YA tenía acceso a Arbu Pro los permisos equivalentes a
# lo que podía hacer antes del modelo por áreas, para que nadie pierda acceso
# al desplegar. Se ejecuta UNA vez; después todo se gestiona desde
# /admin/accesos.
#
#   ./scripts/migrar-permisos.sh
#
# Requiere estar autenticado con una cuenta con acceso al proyecto:
#   gcloud auth login
set -euo pipefail

PROYECTO="arbu-c574d"
DOC="https://firestore.googleapis.com/v1/projects/$PROYECTO/databases/(default)/documents/usuariosAutorizados/accesoTablas"
TODAS='[{"stringValue":"campanas"},{"stringValue":"proyectos"},{"stringValue":"tabla"},{"stringValue":"mapeoScout"},{"stringValue":"dashboard"}]'

TOKEN=$(gcloud auth print-access-token)

echo "Antes:"
curl -s -H "Authorization: Bearer $TOKEN" "$DOC" | python3 -c "
import sys, json
f = json.load(sys.stdin).get('fields', {})
print('  roles   :', {k: v['stringValue'] for k, v in f.get('roles', {}).get('mapValue', {}).get('fields', {}).items()})
print('  permisos:', list(f.get('permisos', {}).get('mapValue', {}).get('fields', {}).keys()) or '(no existe todavia)')
"

curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "$DOC?updateMask.fieldPaths=permisos" \
  -d "{\"fields\":{\"permisos\":{\"mapValue\":{\"fields\":{
        \"alex.r.ojeda@gmail.com\":{\"arrayValue\":{\"values\":[]}},
        \"valeria@labtecnosocial.org\":{\"arrayValue\":{\"values\":[]}},
        \"agoriztribe@gmail.com\":{\"arrayValue\":{\"values\":$TODAS}},
        \"erickxs78@gmail.com\":{\"arrayValue\":{\"values\":$TODAS}}
      }}}}}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if 'error' in d:
    print('ERROR:', d['error']['message']); raise SystemExit(1)
f = d['fields']
print()
print('Despues:')
for k, v in f['permisos']['mapValue']['fields'].items():
    vals = [x['stringValue'] for x in v['arrayValue'].get('values', [])]
    print('  %-32s %s' % (k, vals if vals else '(superadmin: entra a todo)'))
"
