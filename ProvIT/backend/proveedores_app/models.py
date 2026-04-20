from django.db import models
"""

Descripción: Modelos Django que mapean TODAS las tablas del DER de ProvitBD.
             Los nombres de tablas y columnas coinciden exactamente con el
             script SQL del proyecto que exportamos desde el DER en ERD PLUS.

Tablas:
    - Rol
    - Usuario
    - Provincia
    - Localidad
    - Proveedor
    - Direccion
    - Pedido
    - Factura
    - Categoria
    - Producto
    - Detalle_Pedido
    - Proveedor_Producto
"""

# =============================================================================
# ROL
# =============================================================================

class Rol(models.Model):
    """
    Tabla: Rol
    roles del sistema (Operador, Administrador, Directivo).
    """
    id_rol = models.AutoField(
        primary_key=True,
        db_column="ID_Rol"
    )
    nombre = models.CharField(
        max_length=50,
        db_column="nombre"
    )

    class Meta:
        db_table = "Rol"
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.nombre


# =============================================================================
# USUARIO
# =============================================================================

class Usuario(models.Model):
    """
    Tabla: Usuario
    Usuarios del sistema con su rol asignado.
    El campo Estado maneja la baja lógica del usuario (BIT → BooleanField).
    """
    id_usuario = models.AutoField(
        primary_key=True,
        db_column="ID_Usuario"
    )
    nombre_usuario = models.CharField(
        max_length=100,
        db_column="Nombre_Usuario"
    )
    # Corregido: en el SQL figura como INT por error del ERDplus, es VARCHAR
    apellido_usuario = models.CharField(
        max_length=100,
        db_column="Apellido_Usuario"
    )
    dni = models.IntegerField(
        db_column="DNI"
    )
    correo_usuario = models.EmailField(
        max_length=254,
        unique=True,
        db_column="Correo_Usuario"
    )
    # Almacena la contraseña hasheada (RNF-01)
    contrasena = models.CharField(
        max_length=255,
        db_column="Contrasena"
    )
    # Baja lógica del usuario: True = activo, False = inactivo
    estado = models.BooleanField(
        default=True,
        db_column="Estado"
    )
    fk_rol = models.ForeignKey(
        Rol,
        on_delete=models.PROTECT,
        db_column="ID_Rol",
        related_name="usuarios"
    )

    class Meta:
        db_table = "Usuario"
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return f"{self.nombre_usuario} {self.apellido_usuario}"


# =============================================================================
# PROVINCIA
# =============================================================================

class Provincia(models.Model):
    """
    Tabla: Provincia
    Catálogo de provincias.
    """
    id_provincia = models.AutoField(
        primary_key=True,
        db_column="ID_provincia"
    )
    nombre_provincia = models.CharField(
        max_length=100,
        db_column="nombre_provincia"
    )

    class Meta:
        db_table = "Provincia"
        verbose_name = "Provincia"
        verbose_name_plural = "Provincias"

    def __str__(self):
        return self.nombre_provincia


# =============================================================================
# LOCALIDAD
# =============================================================================

class Localidad(models.Model):
    """
    Tabla: Localidad
    Catálogo de localidades vinculadas a una Provincia.
    """
    id_localidad = models.AutoField(
        primary_key=True,
        db_column="ID_localidad"
    )
    codigo_postal = models.IntegerField(
        db_column="codigo_postal"
    )
    nombre_localidad = models.CharField(
        max_length=150,
        db_column="nombre_localidad"
    )
    fk_provincia = models.ForeignKey(
        Provincia,
        on_delete=models.PROTECT,
        db_column="id_provincia",
        related_name="localidades"
    )

    class Meta:
        db_table = "Localidad"
        verbose_name = "Localidad"
        verbose_name_plural = "Localidades"

    def __str__(self):
        return f"{self.nombre_localidad} ({self.codigo_postal})"


# =============================================================================
# PROVEEDOR
# =============================================================================

class Proveedor(models.Model):
    """
    Tabla: Proveedor
    Entidad central del módulo. Soporta baja lógica mediante estado (BIT).
    El score_riesgo_actual es calculado por el módulo predictivo pero incluye valor por default.
    """
    id_proveedor = models.AutoField(
        primary_key=True,
        db_column="ID_proveedor"
    )
    nombre_proveedor = models.CharField(
        max_length=200,
        db_column="nombre_proveedor"
    )
    # Teléfono como CharField para soportar formatos como "3794-123456"
    telefono = models.CharField(
        max_length=20,
        db_column="telefono"
    )
    correo_proveedor = models.EmailField(
        max_length=254,
        db_column="correo_proveedor",
        null=True,
        blank=True
    )
    # CUIT único — validado en serializer (HU#3.1)
    cuit = models.CharField(
        max_length=13,
        unique=True,
        db_column="cuit"
    )
    # Baja lógica: True = activo, False = inactivo (HU#3.3 / RF1.3)
    estado = models.BooleanField(
        default=True,
        db_column="estado"
    )
    # Score calculado por módulo de IA (RF-04). Default 0.
    score_riesgo_actual = models.IntegerField(
        default=0,
        db_column="score_riesgo_actual"
    )

    class Meta:
        db_table = "Proveedor"
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"

    def __str__(self):
        return f"{self.nombre_proveedor} (CUIT: {self.cuit})"


# =============================================================================
# DIRECCION
# =============================================================================

class Direccion(models.Model):
    """
    Tabla: Direccion
    Dirección física de un Proveedor.Un proveedor puede tener una o más direcciones.
    """
    id_direccion = models.AutoField(
        primary_key=True,
        db_column="ID_Direccion"
    )
    calle = models.CharField(
        max_length=200,
        db_column="calle"
    )
    altura = models.IntegerField(
        db_column="altura"
    )
    fk_proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.CASCADE,
        db_column="ID_proveedor",
        related_name="direcciones"
    )
    fk_localidad = models.ForeignKey(
        Localidad,
        on_delete=models.PROTECT,
        db_column="ID_localidad",
        related_name="direcciones"
    )

    class Meta:
        db_table = "Direccion"
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"

    def __str__(self):
        return f"{self.calle} {self.altura}"


# =============================================================================
# PEDIDO
# =============================================================================

class Pedido(models.Model):
    """
    Tabla: Pedido
    Registro de pedidos realizados a proveedores.
    Usamos para el análisis predictivo para calcular el Lead Time y el score de riesgo del proveedor.
    """
    id_pedido = models.AutoField(
        primary_key=True,
        db_column="ID_pedido"
    )
    estado_pedido = models.CharField(
        max_length=50,
        db_column="estado_pedido"
    )
    fecha_emision = models.DateField(
        db_column="fecha_emision"
    )
    fecha_entrega_esperada = models.DateField(
        db_column="fecha_entrega_esperada"
    )
    # Puede ser null hasta que el pedido sea recibido (RF 4.1)
    fecha_entrega_real = models.DateField(
        null=True,
        blank=True,
        db_column="fecha_entrega_real"
    )
    fk_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column="ID_Usuario",
        related_name="pedidos"
    )
    fk_proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.PROTECT,
        db_column="ID_proveedor",
        related_name="pedidos"
    )

    class Meta:
        db_table = "Pedido"
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    def __str__(self):
        return f"Pedido #{self.id_pedido} - {self.estado_pedido}"


# =============================================================================
# FACTURA
# =============================================================================

class Factura(models.Model):
    """
    Tabla: Factura
    Facturas asociadas a pedidos. Cargadas manualmente o via OCR.
    El campo datos_crudos_ocr almacena el JSON raw extraído por EasyOCR antes de ser validado por el operador.
    """
    id_factura = models.AutoField(
        primary_key=True,
        db_column="ID_Factura"
    )
    nro_factura = models.IntegerField(
        db_column="nro_factura"
    )
    # Corregido: en el SQL figura como INT por error del ERDplus, es DATE
    fecha_emision = models.DateField(
        db_column="fecha_emision"
    )
    monto_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        db_column="monto_total"
    )
    # URL del archivo PDF o imagen subido (RF 2.1)
    archivo_url = models.CharField(
        max_length=500,
        db_column="archivo_url"
    )
    # JSON raw del OCR antes de validación (RF 2.2 / HU#4.3)
    # Corregido: en el SQL figura como VARCHAR(1) por error del ERDplus
    datos_crudos_ocr = models.TextField(
        null=True,
        blank=True,
        db_column="datos_crudos_ocr"
    )
    estado_validacion = models.IntegerField(
        default=0,
        db_column="estado_validacion",
        help_text="0: pendiente | 1: validado | 2: rechazado"
    )
    fk_pedido = models.ForeignKey(
        Pedido,
        on_delete=models.PROTECT,
        db_column="ID_pedido",
        related_name="facturas"
    )
    fk_proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.PROTECT,
        db_column="ID_proveedor",
        related_name="facturas"
    )

    class Meta:
        db_table = "Factura"
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"

    def __str__(self):
        return f"Factura #{self.nro_factura}"


# =============================================================================
# CATEGORIA
# =============================================================================

class Categoria(models.Model):
    """
    Tabla: Categoria
    Categorías de productos. Usamos para los gráficos comparativos de evolución de precios en reportes.
    """
    id_categoria = models.AutoField(
        primary_key=True,
        db_column="ID_Categoria"
    )
    nombre_categoria = models.CharField(
        max_length=100,
        db_column="nombre_categoria"
    )

    class Meta:
        db_table = "Categoria"
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre_categoria


# =============================================================================
# PRODUCTO
# =============================================================================

class Producto(models.Model):
    """
    Tabla: Producto
    Productos que los proveedores ofrecen.
    Relacionado con Categoria y con Proveedor via Proveedor_Producto.
    """
    id_producto = models.AutoField(
        primary_key=True,
        db_column="ID_Producto"
    )
    nombre_producto = models.CharField(
        max_length=200,
        db_column="nombre_producto"
    )
    fk_categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        db_column="ID_Categoria",
        related_name="productos"
    )

    class Meta:
        db_table = "Producto"
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.nombre_producto


# =============================================================================
# DETALLE_PEDIDO
# =============================================================================

class DetallePedido(models.Model):
    """
    Tabla: Detalle_Pedido. Es la intermedia entre Pedido y Producto.
    Clave primaria compuesta: (ID_pedido, ID_producto).
    Registra la cantidad y precio unitario de cada producto en un pedido.
    """
    cantidad_producto = models.IntegerField(
        db_column="cantidad_producto"
    )
    # Precio al momento del pedido (puede diferir del precio actual)
    precio_unitario = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        db_column="precio_unitario"
    )
    fk_pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        db_column="ID_pedido",
        related_name="detalles"
    )
    fk_producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        db_column="ID_producto",
        related_name="detalles_pedido"
    )

    class Meta:
        db_table = "Detalle_Pedido"
        # Clave primaria compuesta (ID_pedido, ID_producto)
        unique_together = [["fk_pedido", "fk_producto"]]
        verbose_name = "Detalle de Pedido"
        verbose_name_plural = "Detalles de Pedido"

    def __str__(self):
        return f"Pedido #{self.fk_pedido_id} - Producto #{self.fk_producto_id}"


# =============================================================================
# PROVEEDOR_PRODUCTO
# =============================================================================

class ProveedorProducto(models.Model):
    """
    Tabla: Proveedor_Producto. Intermedia entre Proveedor y Producto.
    Clave primaria compuesta: (ID_proveedor, ID_Producto).
    Registra el precio actual, stock y calidad del producto para ese proveedor.
    Usada por el Asesor de Compras Inteligente para comparar precios y disponibilidad entre proveedores del mismo rubro.
    """
    precio_actual = models.FloatField(
        db_column="precio_actual"
    )
    # Stock disponible: True = disponible, False = sin stock (RF 3.2)
    stock = models.BooleanField(
        default=True,
        db_column="stock"
    )
    ultima_actualizacion = models.DateField(
        db_column="ultima_actualizacion"
    )
    # Puntaje de calidad del producto para este proveedor (RF 3.4)
    calidad = models.IntegerField(
        db_column="calidad"
    )
    fk_proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.CASCADE,
        db_column="ID_proveedor",
        related_name="productos_proveedor"
    )
    fk_producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        db_column="ID_Producto",
        related_name="proveedores_producto"
    )

    class Meta:
        db_table = "Proveedor_Producto"
        # Clave primaria compuesta (ID_proveedor, ID_Producto)
        unique_together = [["fk_proveedor", "fk_producto"]]
        verbose_name = "Proveedor - Producto"
        verbose_name_plural = "Proveedores - Productos"

    def __str__(self):
        return f"{self.fk_proveedor} → {self.fk_producto} (${self.precio_actual})"