from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from datetime import date
from ..models import Pedido, DetallePedido, Proveedor, Producto

def verPedidos():
    """
    Obtiene todos los pedidos con sus detalles y facturas.
    Usamos select_related y prefetch_related para optimizar las consultas a SQL.
    """
    pedidos = Pedido.objects.select_related('fk_proveedor').prefetch_related(
        'detalles__fk_producto', 'facturas'
    ).order_by('-id_pedido')

    resultado = []
    for p in pedidos:
        # Armamos los detalles
        detalles_list = []
        for d in p.detalles.all():
            detalles_list.append({
                "fk_producto": d.fk_producto.id_producto,
                "nombre_producto": d.fk_producto.nombre_producto,
                "cantidad_producto": d.cantidad_producto,
                "precio_unitario": str(d.precio_unitario)
            })

        # Armamos las facturas
        facturas_list = []
        for f in p.facturas.all():
            facturas_list.append({
                "id_factura": f.id_factura,
                "nro_factura": f.nro_factura,
                "monto_total": str(f.monto_total),
                "estado_validacion": f.estado_validacion
            })

        resultado.append({
            "id_pedido": p.id_pedido,
            "estado_pedido": p.estado_pedido,
            "fecha_emision": str(p.fecha_emision),
            "fecha_entrega_esperada": str(p.fecha_entrega_esperada),
            "fecha_entrega_real": str(p.fecha_entrega_real) if p.fecha_entrega_real else None,
            "fk_proveedor": p.fk_proveedor.id_proveedor,
            "nombre_proveedor": p.fk_proveedor.nombre_proveedor,
            "detalles": detalles_list,
            "facturas": facturas_list
        })
        
    return resultado

def verPedidoPorId(pedido_id):
    """ Helper para devolver 1 solo pedido formateado reutilizando la lógica """
    todos = verPedidos()
    for p in todos:
        if p["id_pedido"] == pedido_id:
            return p
    return None

@transaction.atomic
def registrarPedido(data, usuario_actual):
    """
    Registra un pedido y sus detalles en una sola transacción.
    """
    proveedor = Proveedor.objects.get(id_proveedor=data['fk_proveedor'])

    fecha_real = data.get('fecha_entrega_real')
    estado_inicial = "Entregado" if fecha_real else "Pendiente"

    nuevo_pedido = Pedido.objects.create(
        estado_pedido=estado_inicial,
        fecha_emision=date.today(),
        fecha_entrega_esperada=data['fecha_entrega_esperada'],
        fecha_entrega_real=fecha_real,
        fk_proveedor=proveedor,
        fk_usuario=usuario_actual
    )

    for det in data.get('detalles', []):
        producto = Producto.objects.get(id_producto=det['fk_producto'])
        DetallePedido.objects.create(
            fk_pedido=nuevo_pedido,
            fk_producto=producto,
            cantidad_producto=det['cantidad_producto'],
            precio_unitario=det['precio_unitario']
        )

    return verPedidoPorId(nuevo_pedido.id_pedido)

def registrarEntrega(pedido_id: int, fecha_entrega: str):
    """
    Método de clase: registrarEntrega(fecha:Date):void
    """
    try:
        pedido = Pedido.objects.get(id_pedido=pedido_id)
        pedido.fecha_entrega_real = fecha_entrega
        pedido.estado_pedido = "Entregado"
        pedido.save()
        
        return verPedidoPorId(pedido.id_pedido)
    except Pedido.DoesNotExist:
        raise ObjectDoesNotExist("El pedido especificado no existe.")

def cambiarEstado(pedido_id: int, nuevo_estado: str):
    """
    Método de clase: cambiarEstado(nuevoEstado:String):void
    """
    try:
        pedido = Pedido.objects.get(id_pedido=pedido_id)
        pedido.estado_pedido = nuevo_estado
        pedido.save()
        
        return verPedidoPorId(pedido.id_pedido)
    except Pedido.DoesNotExist:
        raise ObjectDoesNotExist("El pedido especificado no existe.")