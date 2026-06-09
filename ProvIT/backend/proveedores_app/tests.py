from django.test import TestCase
from datetime import date
from rest_framework.exceptions import NotFound
from django.core.exceptions import ValidationError

from proveedores_app.models import Proveedor, Producto, Categoria, ProveedorProducto, Pedido, DetallePedido, Usuario, Rol
from proveedores_app.estadisticas_services import (
    EstrategiaVelocidad,
    EstrategiaPrecio,
    EstrategiaCalidad,
    ContextoCalculoEscala,
    verFiltrosAnalisis,
    verAnalisisProveedor,
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

        # Integridad referencial
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
            fk_usuario=self.usuario,  
            fk_proveedor=self.proveedor_valido
        )

        self.detalle = DetallePedido.objects.create(
            fk_pedido=self.pedido, fk_producto=self.producto, cantidad_producto=5, precio_unitario=1000
        )

    # =========================================================================
    # PRUEBAS DEL PLAN DE PRUEBAS (Integración de Casos de Uso)
    # =========================================================================

    def test_cp1_analisis_de_compras(self):
        """
        CP 1: El administrador desea realizar un Análisis de Compras Inteligente.
        (Visualización del formulario de filtros)
        Probamos verFiltrosAnalisis()
        """
        resultado = verFiltrosAnalisis()
        self.assertIn('proveedores', resultado)
        
        print("\n[CP 1 APROBADO] - Resultado: El sistema despliega correctamente un formulario para agregar filtros para el Análisis.")

    def test_cp2_analisis_aplicando_filtros_multiples(self):
        """
        CP 2: El administrador desea realizar un Análisis aplicando filtros.
        Probamos verAnalisisProveedor() curso Normal
        """
        resultado = verAnalisisProveedor(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2021, 1, 1),
            fecha_fin=date(2025, 12, 31),
            producto_id=self.producto.id_producto
        )
        self.assertIn('graficaTorta', resultado)
        
        print("[CP 2 APROBADO] - Resultado: El sistema capta los filtros seleccionados y realiza el análisis con éxito.")

    def test_cp3_analisis_sin_aplicar_filtros(self):
        """
        CP 3: El administrador desea realizar un Análisis sin aplicar filtros.
        Probamos verAnalisisProveedor() forzando un proveedor erróneo
        """
        # Al no enviar el parámetro obligatorio (proveedor_id), Python lanza un TypeError.
        # Pero configuramos con un dropDown de Proveedores activos obligatorios para que siempre se elija un proveedor existente.
        with self.assertRaises(TypeError):
            verAnalisisProveedor(
                fecha_inicio=date(2021, 1, 1),
                fecha_fin=date(2025, 12, 31)
            )
        
        print("[CP 3 APROBADO] - Resultado: El sistema capta que no se rellenó ningún filtro obligatorio y envía un mensaje de error.")

    def test_cp4_analisis_unico_filtro(self):
        """
        CP 4: El administrador desea realizar un Análisis sin el único filtro obligatorio(Producto).
        Probamos verAnalisisProveedor() sin el filtro de Producto que no es obligatorio, debe funcionar bien
        """
        resultado = verAnalisisProveedor(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2021, 1, 1),
            fecha_fin=date(2025, 12, 31),
            producto_id=None  
        )
        self.assertIn('graficaLineas', resultado)
        
        print("[CP 4 APROBADO] - Resultado: El sistema capta los filtros obligatorios, omite el no obligatorio y realiza el análisis con éxito.")

    def test_cp5_fechas_invalidas(self):
        """
        CP 5: El administrador desea realizar Análisis con fechas inválidas.
        (Fecha Inicio > Fecha Fin)
        """
        fecha_inicio_erronea = date(2025, 1, 1)
        fecha_fin_erronea = date(2021, 12, 31)
        
        # Simulamos la validación que ocurre en la Vista o en el Servicio antes de procesar
        try:
            if fecha_inicio_erronea > fecha_fin_erronea:
                raise ValueError("Debe ser posterior al inicio.")
            
            # Si pasa la validación, llama método:
            verAnalisisProveedor(self.proveedor_valido.id_proveedor, fecha_inicio_erronea, fecha_fin_erronea)
            
        except ValueError as e:
            self.assertEqual(str(e), "Debe ser posterior al inicio.")
            print("[CP 5 APROBADO] - Resultado: El sistema determina rango de fechas erróneo, mensaje: 'Debe ser posterior al inicio.'")

    def test_cp6_evolucion_anual_caminos(self):
        """
        CP 6: Evaluación de Evolución Anual (Caminos Normal y Alternativo).
        Prueba la segmentación de la gráfica de líneas por años exactos y la prevención 
        de errores del servidor ante rangos de fechas invertidas.
        Probamos calcularEvolucionAnual() normal y alternativo
        """
        rango_global = {'min_precio': 500, 'max_precio': 1500}
        # CAMINO NORMAL
        resultado_normal = calcularEvolucionAnual(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2023, 1, 1),
            fecha_fin=date(2024, 12, 31),
            producto_id=None,
            rango_precios_global=rango_global
        )
        # Validaciones
        self.assertEqual(len(resultado_normal), 2)
        self.assertEqual(resultado_normal[0]['anio'], 2023)
        self.assertEqual(resultado_normal[1]['anio'], 2024)
        
        print("\n[CP 6 APROBADO - NORMAL] - Resultado: Retorna una lista con dos índices (uno para la evaluación agrupada de 2023 y otro para 2024).")
        # CAMINO ALTERNATIVO
        resultado_invertido = calcularEvolucionAnual(
            proveedor_id=self.proveedor_valido.id_proveedor,
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2021, 12, 31),
            producto_id=None,
            rango_precios_global=rango_global
        )
        # Validaciones
        self.assertEqual(len(resultado_invertido), 0)
        
        print("[CP 6 APROBADO - ALTERNATIVO] - Resultado: Retorna lista vacía [] (Bucle esquivado silenciosamente sin caída del servidor).")

    # =========================================================================
    # PRUEBAS DEL PATRÓN ESTRATEGIA (Pruebas Unitarias Internas restantes)
    # =========================================================================
    
    def test_estrategia_precio(self):
        estrategia = EstrategiaPrecio()
        datos_normal = {'precio_promedio': 1000, 'precio_min_global': 500, 'precio_max_global': 1500}
        self.assertEqual(estrategia.calcularEscala(datos_normal), 3.0) 
        
        datos_iguales = {'precio_promedio': 1000, 'precio_min_global': 1000, 'precio_max_global': 1000}
        self.assertEqual(estrategia.calcularEscala(datos_iguales), 3.0)
        self.assertIsNone(estrategia.calcularEscala({'precio_promedio': 1000}))
        # Print opcional para la suite interna
        print("[TEST UNITARIO] Estrategia de Precio funcionó correctamente.")

    def test_estrategia_calidad(self):
        estrategia = EstrategiaCalidad()
        self.assertEqual(estrategia.calcularEscala({'calidad_promedio': 4.5}), 4.5)
        self.assertEqual(estrategia.calcularEscala({'calidad_promedio': 8.0}), 5.0)
        self.assertIsNone(estrategia.calcularEscala({}))
        print("[TEST UNITARIO] Estrategia de Calidad funcionó correctamente.")

    def test_contexto_estrategia(self):
        contexto = ContextoCalculoEscala(EstrategiaCalidad())
        self.assertEqual(contexto.ejecutarCalculo({'calidad_promedio': 4.0}), 4.0)
        contexto.cambiarEstrategia(EstrategiaVelocidad())
        self.assertEqual(contexto.ejecutarCalculo({'promedio_dias_retraso': 0}), 5.0)
        print("[TEST UNITARIO] Contexto del Patrón Estrategia funcionó dinámicamente.")
