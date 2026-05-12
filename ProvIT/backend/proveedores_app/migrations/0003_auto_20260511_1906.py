import os
import json
from django.db import migrations
from django.contrib.auth.hashers import make_password
from django.conf import settings

def seed_hibrido(apps, schema_editor):
    # Modelos históricos para evitar conflictos con cambios futuros en models.py
    Rol = apps.get_model('proveedores_app', 'Rol')
    Usuario = apps.get_model('proveedores_app', 'Usuario')
    Provincia = apps.get_model('proveedores_app', 'Provincia')
    Localidad = apps.get_model('proveedores_app', 'Localidad')

    # --- PARTE A: HARDCODED (Reglas de Negocio) ---
    # Los roles no deben depender de un archivo externo.
    roles_data = [
        {"id": 1, "nombre": "Operador"},
        {"id": 2, "nombre": "Administrador"},
        {"id": 3, "nombre": "Gerente"}
    ]
    for r in roles_data:
        Rol.objects.get_or_create(id_rol=r['id'], defaults={'nombre': r['nombre']})

    # El usuario semilla es vital para entrar al sistema la primera vez.
    rol_admin = Rol.objects.get(id_rol=2)
    Usuario.objects.get_or_create(
        correo_usuario='admin@provit.com',
        defaults={
            'nombre_usuario': 'Admin',
            'apellido_usuario': 'Provit',
            'dni': 12345678,
            'contrasena': make_password('admin1234'), 
            'fk_rol_id': rol_admin.id_rol,
            'estado': True
        }
    )

    # --- PARTE B: JSON (Catálogos Voluminosos) ---
    json_path = os.path.join(settings.BASE_DIR, 'init_data.json')
    
    if not os.path.exists(json_path):
        print(f"\n[!] ERROR: El archivo {json_path} es necesario para cargar provincias/localidades.")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        catalog_data = json.load(f)

    # Cargar Provincias
    for p in catalog_data.get('provincias', []):
        Provincia.objects.get_or_create(id_provincia=p['id'], defaults={'nombre_provincia': p['nombre']})

    # Cargar Localidades
    for l in catalog_data.get('localidades', []):
        Localidad.objects.get_or_create(
            id_localidad=l['id'],
            defaults={
                'nombre_localidad': l['nombre'],
                'codigo_postal': l['cp'],
                'fk_provincia_id': l['provincia_id']
            }
        )

class Migration(migrations.Migration):
    dependencies = [
        ('proveedores_app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_hibrido),
    ]