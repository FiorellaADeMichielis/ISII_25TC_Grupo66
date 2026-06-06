from .models import Producto

def verProductos():
    # Esta función debe traer todos los objetos Producto de la base de datos
    return Producto.objects.all()