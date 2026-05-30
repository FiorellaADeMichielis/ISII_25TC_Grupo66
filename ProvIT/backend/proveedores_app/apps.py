import os
import sys
import json
from django.apps import AppConfig
from django.conf import settings

class ProveedoresAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'proveedores_app'

    def ready(self):
        # 1. Evitamos que esto se ejecute en comandos como makemigrations o migrate
        if 'runserver' not in sys.argv:
            return
            
        # 2. Evitamos la doble ejecución del auto-reloader de Django
        if os.environ.get('RUN_MAIN', None) != 'true':
            return

        # 3. Llamamos a nuestra función de carga
        self.cargar_datos_maestros()

    def cargar_datos_maestros(self):
        # IMPORTANTE: Los modelos deben importarse ACÁ ADENTRO del método.
        # Si los importás arriba de todo, Django lanzará un error "AppRegistryNotReady".
        from .models import Provincia, Localidad

        json_path = os.path.join(settings.BASE_DIR, 'init_data.json')
        
        if not os.path.exists(json_path):
            print(f"\n[!] ADVERTENCIA: No se encontró {json_path} al iniciar el servidor.\n")
            return

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Insertar Provincias
            for p in data.get('provincias', []):
                Provincia.objects.get_or_create(
                    id_provincia=p['id'], 
                    defaults={'nombre_provincia': p['nombre']}
                )

            # Insertar Localidades ( JSON usa 'cp')
            for l in data.get('localidades', []):
                Localidad.objects.get_or_create(
                    id_localidad=l['id'],
                    defaults={
                        'nombre_localidad': l['nombre'],
                        'codigo_postal': l['cp'], 
                        'fk_provincia_id': l['provincia_id']
                    }
                )
            
            print("\n[INFO] Catálogo de Provincias y Localidades verificado en el arranque.\n")
            
        except Exception as e:
            print(f"\n[ERROR] Falla al procesar init_data.json: {e}\n")