from django.db import models
"""
Descripción de los modelos: 
Modelos Django que mapean las tablas Proveedor, Direccion,Localidad y Provincia del DER de SQL Server.
Baja lógica mediante campo 'estado' (RF1.3 / HU#3.3).
"""
class Provincia(models.Model):
    """
    Tabla: Provincia
    Catálogo de provincias. Se usa como lookup de sólo lectura en el CRUD.
    """
    id_provincia = models.AutoField(primary_key=True)
    nombre_provincia = models.CharField(max_length=100)
 
    class Meta:
        db_table = "Provincia"
        verbose_name = "Provincia"
        verbose_name_plural = "Provincias"
 
    def __str__(self):
        return self.nombre_provincia
 
 
class Localidad(models.Model):
    """
    Tabla: Localidad
    Catálogo de localidades vinculadas a una Provincia.
    """
    id_localidad = models.AutoField(primary_key=True)
    codigo_postal = models.IntegerField()
    nombre_localidad = models.CharField(max_length=150)
    fk_provincia = models.ForeignKey(
        Provincia,
        on_delete=models.PROTECT,           # No se puede borrar una provincia con localidades
        db_column="fk_Provincia",
        related_name="localidades",
    )
 
    class Meta:
        db_table = "Localidad"
        verbose_name = "Localidad"
        verbose_name_plural = "Localidades"
 
    def __str__(self):
        return f"{self.nombre_localidad} ({self.codigo_postal})"
 
 
class Proveedor(models.Model):
    """
    Tabla: Proveedor
    Entidad central del módulo. Soporta baja lógica (estado=False).
    El campo 'cuit' es único (xq HU#3.1 — no puede existir dos veces el mismo CUIT).
    El campo 'score_riesgo_actual' es calculado por el módulo de análisis predictivo (RF-04).
    """
    id_proveedor = models.AutoField(primary_key=True)
    nombre_proveedor = models.CharField(max_length=200)
    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Teléfono de contacto del proveedor",
    )
    correo_proveedor = models.EmailField(
        max_length=254,
        blank=True,
        null=True,
        help_text="Correo electrónico de contacto",
    )
    cuit = models.CharField(
        max_length=13,
        unique=True,
        help_text="CUIT sin guiones, ej: 20123456789",
    )
    # Baja lógica: True = activo, False = inactivo (HU#3.3)
    estado = models.BooleanField(
        default=True,
        help_text="True: activo | False: dado de baja",
    )
    # Calculado por el módulo de IA (RF-04). Default 0 hasta que existan pedidos.
    score_riesgo_actual = models.IntegerField(
        default=0,
        help_text="Score de riesgo 0-100. Calculado por el módulo predictivo.",
    )
 
    class Meta:
        db_table = "Proveedor"
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"
 
    def __str__(self):
        return f"{self.nombre_proveedor} (CUIT: {self.cuit})"
 
 
class Direccion(models.Model):
    """
    Tabla: Direccion
    Dirección física asociada a un Proveedor.
    Un proveedor puede tener una o más direcciones (ej. sede central + depósito).
    """
    id_direccion = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=200)
    altura = models.IntegerField(help_text="Número de puerta / altura de la calle")
    fk_proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.CASCADE,           # Si se elimina el proveedor, se eliminan sus direcciones
        db_column="fk_Proveedor",
        related_name="direcciones",
    )
    fk_localidad = models.ForeignKey(
        Localidad,
        on_delete=models.PROTECT,
        db_column="fk_Localidad",
        related_name="direcciones",
    )
 
    class Meta:
        db_table = "Direccion"
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"
 
    def __str__(self):
        return f"{self.calle} {self.altura} - {self.fk_localidad}"
 
