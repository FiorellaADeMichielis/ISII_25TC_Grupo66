from django.test import TestCase
from datetime import date
from rest_framework.exceptions import NotFound

from proveedores_app.models import Proveedor, Producto, Categoria, ProveedorProducto, Pedido, DetallePedido, Usuario, Rol
from proveedores_app.estadisticas_services import (
    EstrategiaVelocidad,
    EstrategiaPrecio,
    EstrategiaCalidad,
    ContextoCalculoEscala,
    verFiltrosAnalisis,
    verAnalisisProveedor,
    verTopProveedores,
    calcularEvolucionAnual
)

class EstadisticasServicesTests(TestCase):
    
    def setUp(self):
        # 1. Mock de datos para hacer las pruebas unitarias
        self.categoria = Categoria.objects.create(nombre_categoria="Hardware")
        self.producto = Producto.objects.create(nombre_producto="Notebook", fk_categoria=self.categoria)
        
        self.proveedor_valido = Proveedor.objects.create(
            nombre_proveedor="TechCorp Test", cuit="20111111112", estado=True
        )
        
        self.prov_prod = ProveedorProducto.objects.create(
            fk_proveedor=self.proveedor_valido, 
            fk_producto=self.producto, 
            precio_actual=1000, 
            stock=True, 
            calidad=4,
            ultima_actualizacion=date.today()
        )

        # --- SOLUCIÓN: Creamos el Rol y Usuario para la integridad referencial ---
        self.rol = Rol.objects.create(nombre="Admin")
        self.usuario = Usuario.objects.create(
            nombre_usuario="Tester",
            apellido_usuario="QA",
            correo_usuario="qa@provit.com",
            dni=11111111,
            contrasena="1234",
            estado=True,
            fk_rol=self.rol
        )

        self.pedido = Pedido.objects.create(
            estado_pedido='Recibido',
            fecha_emision=date(2023, 6, 1),
            fecha_entrega_esperada=date(2023, 6, 8),
            fecha_entrega_real=date(2023, 6, 8),
            fk_usuario=self.usuario,  # Enlazamos directamente la instancia del usuario
            fk_proveedor=self.proveedor_valido
        )
        # -------------------------------------------------------------------------

        self.detalle = DetallePedido.objects.create(
            fk_pedido=self.pedido, fk_producto=self.producto, cantidad_producto=5, precio_unitario=1000
        )

    # =========================================================================
    # PRUEBAS DEL PATRÓN ESTRATEGIA (Lógica Matemática)
    # =========================================================================
    def test_estrategia_precio(self):
        estrategia = EstrategiaPrecio()
        
        # Camino Normal
        datos_normal = {'precio_promedio': 1000, 'precio_min_global': 500, 'precio_max_global': 1500}
        self.assertEqual(estrategia.calcularEscala(datos_normal), 3.0) # Justo en el medio
        
        # Camino Alternativo: Todos venden al mismo precio (min == max)
        datos_iguales = {'precio_promedio': 1000, 'precio_min_global': 1000, 'precio_max_global': 1000}
        self.assertEqual(estrategia.calcularEscala(datos_iguales), 3.0)
        
        # Camino Erróneo: Faltan datos clave
        self.assertIsNone(estrategia.calcularEscala({'precio_promedio': 1000}))

    def test_estrategia_calidad(self):
        estrategia = EstrategiaCalidad()
        
        # Camino Normal
        self.assertEqual(estrategia.calcularEscala({'calidad_promedio': 4.5}), 4.5)
        
        # Camino Alternativo: Intento de superar el máximo (normalización a 5.0)
        self.assertEqual(estrategia.calcularEscala({'calidad_promedio': 8.0}), 5.0)
        
        # Camino Erróneo: Dato faltante
        self.assertIsNone(estrategia.calcularEscala({}))

    def test_contexto_estrategia(self):
        # Camino Normal: Intercambio dinámico de estrategias
        contexto = ContextoCalculoEscala(EstrategiaCalidad())
        self.assertEqual(contexto.ejecutarCalculo({'calidad_promedio': 4.0}), 4.0)
        
        contexto.cambiarEstrategia(EstrategiaVelocidad())
        self.assertEqual(contexto.ejecutarCalculo({'promedio_dias_retraso': 0}), 5.0)

    # =========================================================================
    # PRUEBAS DE SERVICIOS EXPUESTOS
    # =========================================================================
    def test_ver_filtros_analisis(self):
        # Camino Normal
        resultado = verFiltrosAnalisis()
        self.assertIn('proveedores', resultado)
        self.assertIn('productos', resultado)
        self.assertIn('productos_por_proveedor', resultado)
        self.assertTrue(len(resultado['proveedores']) > 0)

    def test_ver_analisis_proveedor(self):
        # Camino Normal
        resultado = verAnalisisProveedor(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2021, 1, 1),
            fecha_fin=date(2025, 12, 31)
        )
        self.assertIn('graficaTorta', resultado)
        self.assertEqual(resultado['proveedor']['nombre'], "TechCorp Test")

        # Camino Erróneo: ID Inexistente
        with self.assertRaises(NotFound):
            verAnalisisProveedor(9999, date(2021, 1, 1), date(2025, 12, 31))

    def test_ver_top_proveedores(self):
        # Camino Normal: Filtro por proveedor
        resultado_prov = verTopProveedores(
            fecha_inicio=date(2021, 1, 1),
            fecha_fin=date(2025, 12, 31),
            variables=['todos'],
            tipo='mejor',
            filtro_por='proveedor',
            limite=3
        )
        self.assertEqual(resultado_prov['filtro_por'], 'proveedor')
        self.assertIn('graficaBarras', resultado_prov)

        # Camino Alternativo: Filtro por producto (Top Productos)
        resultado_prod = verTopProveedores(
            fecha_inicio=date(2021, 1, 1),
            fecha_fin=date(2025, 12, 31),
            variables=['precio', 'calidad'],
            tipo='peor',
            filtro_por='producto',
            limite=1
        )
        self.assertEqual(resultado_prod['filtro_por'], 'producto')
        self.assertEqual(resultado_prod['tipo'], 'peor')

    def test_calcular_evolucion_anual(self):
        # Camino Normal: Rango válido
        rango_global = {'min_precio': 500, 'max_precio': 1500}
        resultado = calcularEvolucionAnual(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2023, 1, 1),
            fecha_fin=date(2024, 12, 31),
            producto_id=None,
            rango_precios_global=rango_global
        )
        # Debería devolverme una lista con dos elementos (año 2023 y 2024)
        self.assertEqual(len(resultado), 2)
        self.assertEqual(resultado[0]['anio'], 2023)
        self.assertEqual(resultado[1]['anio'], 2024)

        # Camino Alternativo: Fechas invertidas (inicio > fin)
        resultado_vacio = calcularEvolucionAnual(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2021, 12, 31),
            producto_id=None,
            rango_precios_global=rango_global
        )
        # El iterador de años falla y me devuelve lista vacía
        self.assertEqual(len(resultado_vacio), 0)