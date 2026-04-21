import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings

from proveedores_app.models import Provincia, Localidad

class Command(BaseCommand):
    help = 'Carga las provincias y localidades desde un archivo JSON'

    def handle(self, *args, **kwargs):
        # Ruta al archivo JSON en la raíz del proyecto
        ruta_archivo = os.path.join(settings.BASE_DIR, 'ubicaciones_data.json')

        try:
            with open(ruta_archivo, 'r', encoding='utf-8') as f:
                datos = json.load(f)

            # 1. Cargar Provincias
            for prov in datos.get('provincias', []):
                # get_or_create evita que se dupliquen si corro el comando 2 veces
                Provincia.objects.get_or_create(
                    id_provincia=prov['id'],
                    defaults={'nombre_provincia': prov['nombre']}
                )
            self.stdout.write(self.style.SUCCESS(' Provincias cargadas exitosamente.'))

            # 2. Cargar Localidades
            for loc in datos.get('localidades', []):
                # Obtenemos la instancia de la provincia para asignarla como foreign key
                provincia = Provincia.objects.get(id_provincia=loc['provincia_id'])
                
                Localidad.objects.get_or_create(
                    id_localidad=loc['id'],
                    defaults={
                        'nombre_localidad': loc['nombre'],
                        'codigo_postal': loc['cp'],
                        'fk_provincia': provincia
                    }
                )
            self.stdout.write(self.style.SUCCESS(' Localidades cargadas exitosamente.'))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f' No se encontró el archivo: {ruta_archivo}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f' Ocurrió un error: {str(e)}'))