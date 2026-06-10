create database provitBD
USE [ProvitBD]
GO
/****** Objeto: Table [dbo].[auth_group] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[auth_group](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](150) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[auth_group_permissions] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[auth_group_permissions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[group_id] [int] NOT NULL,
	[permission_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[auth_permission] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[auth_permission](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[content_type_id] [int] NOT NULL,
	[codename] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Categoria] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categoria](
	[ID_Categoria] [int] IDENTITY(1,1) NOT NULL,
	[nombre_categoria] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Categoria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Detalle_Pedido] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Detalle_Pedido](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[cantidad_producto] [int] NOT NULL,
	[precio_unitario] [numeric](12, 2) NOT NULL,
	[ID_pedido] [int] NOT NULL,
	[ID_producto] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Direccion] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Direccion](
	[ID_Direccion] [int] IDENTITY(1,1) NOT NULL,
	[calle] [nvarchar](200) NOT NULL,
	[altura] [int] NOT NULL,
	[ID_localidad] [int] NOT NULL,
	[ID_proveedor] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Direccion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[django_admin_log] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[django_admin_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[action_time] [datetimeoffset](7) NOT NULL,
	[object_id] [nvarchar](max) NULL,
	[object_repr] [nvarchar](200) NOT NULL,
	[action_flag] [smallint] NOT NULL,
	[change_message] [nvarchar](max) NOT NULL,
	[content_type_id] [int] NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[django_content_type] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[django_content_type](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[app_label] [nvarchar](100) NOT NULL,
	[model] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[django_migrations] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[django_migrations](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[app] [nvarchar](255) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[applied] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[django_session] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[django_session](
	[session_key] [nvarchar](40) NOT NULL,
	[session_data] [nvarchar](max) NOT NULL,
	[expire_date] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[session_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Factura] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Factura](
	[ID_Factura] [int] IDENTITY(1,1) NOT NULL,
	[nro_factura] [int] NOT NULL,
	[fecha_emision] [date] NOT NULL,
	[monto_total] [numeric](12, 2) NOT NULL,
	[archivo_url] [nvarchar](500) NOT NULL,
	[datos_crudos_ocr] [nvarchar](max) NULL,
	[estado_validacion] [int] NOT NULL,
	[ID_pedido] [int] NOT NULL,
	[ID_proveedor] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Factura] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Localidad] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Localidad](
	[ID_localidad] [int] IDENTITY(1,1) NOT NULL,
	[codigo_postal] [int] NOT NULL,
	[nombre_localidad] [nvarchar](150) NOT NULL,
	[id_provincia] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_localidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Pedido] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pedido](
	[ID_pedido] [int] IDENTITY(1,1) NOT NULL,
	[estado_pedido] [nvarchar](50) NOT NULL,
	[fecha_emision] [date] NOT NULL,
	[fecha_entrega_esperada] [date] NOT NULL,
	[fecha_entrega_real] [date] NULL,
	[ID_Usuario] [int] NOT NULL,
	[ID_proveedor] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_pedido] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Producto] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Producto](
	[ID_Producto] [int] IDENTITY(1,1) NOT NULL,
	[nombre_producto] [nvarchar](200) NOT NULL,
	[ID_Categoria] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Producto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Proveedor] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Proveedor](
	[ID_proveedor] [int] IDENTITY(1,1) NOT NULL,
	[nombre_proveedor] [nvarchar](200) NOT NULL,
	[telefono] [nvarchar](20) NOT NULL,
	[correo_proveedor] [nvarchar](254) NULL,
	[cuit] [nvarchar](13) NOT NULL,
	[estado] [bit] NOT NULL,
	[score_riesgo_actual] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_proveedor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Proveedor_Producto] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Proveedor_Producto](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[precio_actual] [float] NOT NULL,
	[stock] [bit] NOT NULL,
	[ultima_actualizacion] [date] NOT NULL,
	[calidad] [int] NOT NULL,
	[ID_Producto] [int] NOT NULL,
	[ID_proveedor] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Provincia] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Provincia](
	[ID_provincia] [int] IDENTITY(1,1) NOT NULL,
	[nombre_provincia] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_provincia] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Rol] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rol](
	[ID_Rol] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Usuario] Fecha de script: 09/06/2026 15:47:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[ID_Usuario] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_Usuario] [nvarchar](100) NOT NULL,
	[Apellido_Usuario] [nvarchar](100) NOT NULL,
	[DNI] [int] NOT NULL,
	[Correo_Usuario] [nvarchar](254) NOT NULL,
	[Contrasena] [nvarchar](255) NOT NULL,
	[Estado] [bit] NOT NULL,
	[ID_Rol] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[auth_permission] ON 

INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (1, N'Can add log entry', 1, N'add_logentry')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (2, N'Can change log entry', 1, N'change_logentry')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (3, N'Can delete log entry', 1, N'delete_logentry')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (4, N'Can view log entry', 1, N'view_logentry')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (5, N'Can add permission', 3, N'add_permission')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (6, N'Can change permission', 3, N'change_permission')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (7, N'Can delete permission', 3, N'delete_permission')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (8, N'Can view permission', 3, N'view_permission')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (9, N'Can add group', 2, N'add_group')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (10, N'Can change group', 2, N'change_group')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (11, N'Can delete group', 2, N'delete_group')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (12, N'Can view group', 2, N'view_group')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (13, N'Can add content type', 4, N'add_contenttype')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (14, N'Can change content type', 4, N'change_contenttype')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (15, N'Can delete content type', 4, N'delete_contenttype')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (16, N'Can view content type', 4, N'view_contenttype')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (17, N'Can add session', 5, N'add_session')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (18, N'Can change session', 5, N'change_session')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (19, N'Can delete session', 5, N'delete_session')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (20, N'Can view session', 5, N'view_session')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (21, N'Can add Usuario', 17, N'add_usuario')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (22, N'Can change Usuario', 17, N'change_usuario')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (23, N'Can delete Usuario', 17, N'delete_usuario')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (24, N'Can view Usuario', 17, N'view_usuario')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (25, N'Can add Categoría', 6, N'add_categoria')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (26, N'Can change Categoría', 6, N'change_categoria')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (27, N'Can delete Categoría', 6, N'delete_categoria')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (28, N'Can view Categoría', 6, N'view_categoria')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (29, N'Can add Localidad', 10, N'add_localidad')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (30, N'Can change Localidad', 10, N'change_localidad')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (31, N'Can delete Localidad', 10, N'delete_localidad')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (32, N'Can view Localidad', 10, N'view_localidad')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (33, N'Can add Proveedor', 13, N'add_proveedor')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (34, N'Can change Proveedor', 13, N'change_proveedor')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (35, N'Can delete Proveedor', 13, N'delete_proveedor')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (36, N'Can view Proveedor', 13, N'view_proveedor')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (37, N'Can add Provincia', 15, N'add_provincia')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (38, N'Can change Provincia', 15, N'change_provincia')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (39, N'Can delete Provincia', 15, N'delete_provincia')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (40, N'Can view Provincia', 15, N'view_provincia')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (41, N'Can add Rol', 16, N'add_rol')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (42, N'Can change Rol', 16, N'change_rol')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (43, N'Can delete Rol', 16, N'delete_rol')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (44, N'Can view Rol', 16, N'view_rol')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (45, N'Can add Pedido', 11, N'add_pedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (46, N'Can change Pedido', 11, N'change_pedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (47, N'Can delete Pedido', 11, N'delete_pedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (48, N'Can view Pedido', 11, N'view_pedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (49, N'Can add Producto', 12, N'add_producto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (50, N'Can change Producto', 12, N'change_producto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (51, N'Can delete Producto', 12, N'delete_producto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (52, N'Can view Producto', 12, N'view_producto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (53, N'Can add Factura', 9, N'add_factura')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (54, N'Can change Factura', 9, N'change_factura')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (55, N'Can delete Factura', 9, N'delete_factura')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (56, N'Can view Factura', 9, N'view_factura')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (57, N'Can add Dirección', 8, N'add_direccion')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (58, N'Can change Dirección', 8, N'change_direccion')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (59, N'Can delete Dirección', 8, N'delete_direccion')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (60, N'Can view Dirección', 8, N'view_direccion')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (61, N'Can add Detalle de Pedido', 7, N'add_detallepedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (62, N'Can change Detalle de Pedido', 7, N'change_detallepedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (63, N'Can delete Detalle de Pedido', 7, N'delete_detallepedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (64, N'Can view Detalle de Pedido', 7, N'view_detallepedido')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (65, N'Can add Proveedor - Producto', 14, N'add_proveedorproducto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (66, N'Can change Proveedor - Producto', 14, N'change_proveedorproducto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (67, N'Can delete Proveedor - Producto', 14, N'delete_proveedorproducto')
INSERT [dbo].[auth_permission] ([id], [name], [content_type_id], [codename]) VALUES (68, N'Can view Proveedor - Producto', 14, N'view_proveedorproducto')
SET IDENTITY_INSERT [dbo].[auth_permission] OFF
GO
SET IDENTITY_INSERT [dbo].[Categoria] ON 

INSERT [dbo].[Categoria] ([ID_Categoria], [nombre_categoria]) VALUES (1, N'Hardware')
INSERT [dbo].[Categoria] ([ID_Categoria], [nombre_categoria]) VALUES (2, N'Software y Licencias')
INSERT [dbo].[Categoria] ([ID_Categoria], [nombre_categoria]) VALUES (3, N'Insumos de Oficina')
INSERT [dbo].[Categoria] ([ID_Categoria], [nombre_categoria]) VALUES (4, N'Equipamiento de Redes')
SET IDENTITY_INSERT [dbo].[Categoria] OFF
GO
SET IDENTITY_INSERT [dbo].[Detalle_Pedido] ON 

INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (1, 10, CAST(500.00 AS Numeric(12, 2)), 1, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (2, 10, CAST(500.00 AS Numeric(12, 2)), 2, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (3, 10, CAST(500.00 AS Numeric(12, 2)), 3, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (4, 10, CAST(500.00 AS Numeric(12, 2)), 4, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (5, 10, CAST(500.00 AS Numeric(12, 2)), 5, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (6, 10, CAST(1500.00 AS Numeric(12, 2)), 6, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (7, 10, CAST(1500.00 AS Numeric(12, 2)), 7, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (8, 10, CAST(500.00 AS Numeric(12, 2)), 8, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (9, 10, CAST(500.00 AS Numeric(12, 2)), 9, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (10, 10, CAST(500.00 AS Numeric(12, 2)), 10, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (11, 10, CAST(1500.00 AS Numeric(12, 2)), 11, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (12, 10, CAST(1500.00 AS Numeric(12, 2)), 12, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (13, 10, CAST(1500.00 AS Numeric(12, 2)), 13, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (14, 10, CAST(1500.00 AS Numeric(12, 2)), 14, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (15, 10, CAST(1500.00 AS Numeric(12, 2)), 15, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (16, 10, CAST(500.00 AS Numeric(12, 2)), 16, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (17, 10, CAST(750.00 AS Numeric(12, 2)), 17, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (18, 10, CAST(1000.00 AS Numeric(12, 2)), 18, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (19, 10, CAST(1250.00 AS Numeric(12, 2)), 19, 4)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (20, 10, CAST(1500.00 AS Numeric(12, 2)), 20, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (21, 10, CAST(500.00 AS Numeric(12, 2)), 21, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (22, 10, CAST(1500.00 AS Numeric(12, 2)), 22, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (23, 10, CAST(500.00 AS Numeric(12, 2)), 23, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (24, 10, CAST(1500.00 AS Numeric(12, 2)), 24, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (25, 10, CAST(500.00 AS Numeric(12, 2)), 25, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (26, 10, CAST(500.00 AS Numeric(12, 2)), 26, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (27, 10, CAST(500.00 AS Numeric(12, 2)), 27, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (28, 10, CAST(500.00 AS Numeric(12, 2)), 28, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (29, 10, CAST(500.00 AS Numeric(12, 2)), 29, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (30, 10, CAST(500.00 AS Numeric(12, 2)), 30, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (31, 10, CAST(1500.00 AS Numeric(12, 2)), 31, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (32, 10, CAST(1500.00 AS Numeric(12, 2)), 32, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (33, 10, CAST(1500.00 AS Numeric(12, 2)), 33, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (34, 10, CAST(1500.00 AS Numeric(12, 2)), 34, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (35, 10, CAST(1500.00 AS Numeric(12, 2)), 35, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (36, 10, CAST(1500.00 AS Numeric(12, 2)), 36, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (37, 10, CAST(1250.00 AS Numeric(12, 2)), 37, 4)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (38, 10, CAST(1000.00 AS Numeric(12, 2)), 38, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (39, 10, CAST(750.00 AS Numeric(12, 2)), 39, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (40, 10, CAST(500.00 AS Numeric(12, 2)), 40, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (41, 10, CAST(1000.00 AS Numeric(12, 2)), 41, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (42, 10, CAST(1000.00 AS Numeric(12, 2)), 42, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (43, 10, CAST(1000.00 AS Numeric(12, 2)), 43, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (44, 10, CAST(1000.00 AS Numeric(12, 2)), 44, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (45, 10, CAST(1000.00 AS Numeric(12, 2)), 45, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (46, 10, CAST(500.00 AS Numeric(12, 2)), 46, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (47, 10, CAST(750.00 AS Numeric(12, 2)), 47, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (48, 10, CAST(1000.00 AS Numeric(12, 2)), 48, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (49, 10, CAST(1250.00 AS Numeric(12, 2)), 49, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (50, 10, CAST(1500.00 AS Numeric(12, 2)), 50, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (51, 10, CAST(750.00 AS Numeric(12, 2)), 51, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (52, 10, CAST(750.00 AS Numeric(12, 2)), 52, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (53, 10, CAST(750.00 AS Numeric(12, 2)), 53, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (54, 10, CAST(750.00 AS Numeric(12, 2)), 54, 4)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (55, 10, CAST(750.00 AS Numeric(12, 2)), 55, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (56, 10, CAST(1000.00 AS Numeric(12, 2)), 56, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (57, 10, CAST(1000.00 AS Numeric(12, 2)), 57, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (58, 10, CAST(1000.00 AS Numeric(12, 2)), 58, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (59, 10, CAST(1000.00 AS Numeric(12, 2)), 59, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (60, 10, CAST(1000.00 AS Numeric(12, 2)), 60, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (61, 10, CAST(750.00 AS Numeric(12, 2)), 61, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (62, 10, CAST(1500.00 AS Numeric(12, 2)), 62, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (63, 10, CAST(1500.00 AS Numeric(12, 2)), 63, 5)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (64, 10, CAST(1000.00 AS Numeric(12, 2)), 64, 3)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (65, 10, CAST(500.00 AS Numeric(12, 2)), 65, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (66, 10, CAST(750.00 AS Numeric(12, 2)), 66, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (67, 10, CAST(750.00 AS Numeric(12, 2)), 67, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (68, 10, CAST(750.00 AS Numeric(12, 2)), 68, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (69, 10, CAST(750.00 AS Numeric(12, 2)), 69, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (70, 10, CAST(750.00 AS Numeric(12, 2)), 70, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (71, 1, CAST(500.00 AS Numeric(12, 2)), 71, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (72, 1, CAST(1500.00 AS Numeric(12, 2)), 71, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (73, 1, CAST(500.00 AS Numeric(12, 2)), 72, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (74, 1, CAST(1500.00 AS Numeric(12, 2)), 72, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (75, 1, CAST(500.00 AS Numeric(12, 2)), 73, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (76, 1, CAST(1500.00 AS Numeric(12, 2)), 73, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (77, 1, CAST(500.00 AS Numeric(12, 2)), 74, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (78, 1, CAST(1500.00 AS Numeric(12, 2)), 74, 2)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (79, 1, CAST(500.00 AS Numeric(12, 2)), 75, 1)
INSERT [dbo].[Detalle_Pedido] ([id], [cantidad_producto], [precio_unitario], [ID_pedido], [ID_producto]) VALUES (80, 1, CAST(1500.00 AS Numeric(12, 2)), 75, 2)
SET IDENTITY_INSERT [dbo].[Detalle_Pedido] OFF
GO
SET IDENTITY_INSERT [dbo].[Direccion] ON 

INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (1, N'Calle Falsa', 100, 2, 1)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (2, N'Calle Falsa', 200, 3, 2)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (3, N'Calle Falsa', 300, 1, 3)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (4, N'Calle Falsa', 400, 2, 4)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (5, N'Calle Falsa', 500, 3, 5)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (6, N'Calle Falsa', 600, 1, 6)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (7, N'Calle Falsa', 700, 2, 7)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (8, N'Calle Falsa', 800, 3, 8)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (9, N'Calle Falsa', 900, 1, 9)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (10, N'Calle Falsa', 1000, 2, 10)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (11, N'Calle Falsa', 1100, 3, 11)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (12, N'Calle Falsa', 1200, 1, 12)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (13, N'Calle Falsa', 1300, 2, 13)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (14, N'Calle Falsa', 1400, 3, 14)
INSERT [dbo].[Direccion] ([ID_Direccion], [calle], [altura], [ID_localidad], [ID_proveedor]) VALUES (15, N'Calle Falsa', 1500, 1, 15)
SET IDENTITY_INSERT [dbo].[Direccion] OFF
GO
SET IDENTITY_INSERT [dbo].[django_content_type] ON 

INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (1, N'admin', N'logentry')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (2, N'auth', N'group')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (3, N'auth', N'permission')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (4, N'contenttypes', N'contenttype')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (6, N'proveedores_app', N'categoria')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (7, N'proveedores_app', N'detallepedido')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (8, N'proveedores_app', N'direccion')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (9, N'proveedores_app', N'factura')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (10, N'proveedores_app', N'localidad')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (11, N'proveedores_app', N'pedido')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (12, N'proveedores_app', N'producto')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (13, N'proveedores_app', N'proveedor')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (14, N'proveedores_app', N'proveedorproducto')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (15, N'proveedores_app', N'provincia')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (16, N'proveedores_app', N'rol')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (17, N'proveedores_app', N'usuario')
INSERT [dbo].[django_content_type] ([id], [app_label], [model]) VALUES (5, N'sessions', N'session')
SET IDENTITY_INSERT [dbo].[django_content_type] OFF
GO
SET IDENTITY_INSERT [dbo].[django_migrations] ON 

INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (1, N'proveedores_app', N'0001_initial', CAST(N'2026-06-06T22:57:56.4961400+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (2, N'contenttypes', N'0001_initial', CAST(N'2026-06-06T22:57:56.5303490+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (3, N'admin', N'0001_initial', CAST(N'2026-06-06T22:57:56.5625540+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (4, N'admin', N'0002_logentry_remove_auto_add', CAST(N'2026-06-06T22:57:56.5737550+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (5, N'admin', N'0003_logentry_add_action_flag_choices', CAST(N'2026-06-06T22:57:56.5848230+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (6, N'contenttypes', N'0002_remove_content_type_name', CAST(N'2026-06-06T22:58:12.9824590+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (7, N'auth', N'0001_initial', CAST(N'2026-06-06T22:58:13.0572090+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (8, N'auth', N'0002_alter_permission_name_max_length', CAST(N'2026-06-06T22:58:13.0779890+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (9, N'auth', N'0003_alter_user_email_max_length', CAST(N'2026-06-06T22:58:13.0899670+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (10, N'auth', N'0004_alter_user_username_opts', CAST(N'2026-06-06T22:58:13.1014130+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (11, N'auth', N'0005_alter_user_last_login_null', CAST(N'2026-06-06T22:58:13.1115060+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (12, N'auth', N'0006_require_contenttypes_0002', CAST(N'2026-06-06T22:58:13.1144510+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (13, N'auth', N'0007_alter_validators_add_error_messages', CAST(N'2026-06-06T22:58:13.1342040+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (14, N'auth', N'0008_alter_user_username_max_length', CAST(N'2026-06-06T22:58:13.1427010+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (15, N'auth', N'0009_alter_user_last_name_max_length', CAST(N'2026-06-06T22:58:13.1564550+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (16, N'auth', N'0010_alter_group_name_max_length', CAST(N'2026-06-06T22:58:14.3927260+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (17, N'auth', N'0011_update_proxy_permissions', CAST(N'2026-06-06T22:58:14.4646390+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (18, N'auth', N'0012_alter_user_first_name_max_length', CAST(N'2026-06-06T22:58:14.4806910+00:00' AS DateTimeOffset))
INSERT [dbo].[django_migrations] ([id], [app], [name], [applied]) VALUES (19, N'sessions', N'0001_initial', CAST(N'2026-06-06T22:58:14.4874170+00:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[django_migrations] OFF
GO
SET IDENTITY_INSERT [dbo].[Factura] ON 

INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (1, 13, CAST(N'2021-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 1, 1)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (2, 27, CAST(N'2022-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 2, 1)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (3, 35, CAST(N'2023-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 3, 1)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (4, 42, CAST(N'2024-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 4, 1)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (5, 55, CAST(N'2025-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 5, 1)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (6, 67, CAST(N'2021-06-26' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 6, 2)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (7, 75, CAST(N'2022-06-26' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 7, 2)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (8, 84, CAST(N'2023-06-26' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 8, 2)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (9, 97, CAST(N'2024-06-26' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 9, 2)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (10, 100, CAST(N'2025-06-26' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 10, 2)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (11, 115, CAST(N'2021-07-04' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 11, 3)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (12, 121, CAST(N'2022-07-04' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 12, 3)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (13, 136, CAST(N'2023-07-04' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 13, 3)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (14, 148, CAST(N'2024-07-04' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 14, 3)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (15, 155, CAST(N'2025-07-04' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 15, 3)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (16, 161, CAST(N'2021-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 16, 4)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (17, 175, CAST(N'2022-06-24' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 17, 4)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (18, 180, CAST(N'2023-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 18, 4)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (19, 198, CAST(N'2024-06-30' AS Date), CAST(12500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 19, 4)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (20, 200, CAST(N'2025-07-07' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 20, 4)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (21, 212, CAST(N'2021-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 21, 5)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (22, 222, CAST(N'2022-07-07' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 22, 5)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (23, 238, CAST(N'2023-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 23, 5)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (24, 241, CAST(N'2024-07-07' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 24, 5)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (25, 251, CAST(N'2025-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 25, 5)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (26, 267, CAST(N'2021-07-07' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 26, 6)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (27, 275, CAST(N'2022-07-07' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 27, 6)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (28, 288, CAST(N'2023-07-07' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 28, 6)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (29, 292, CAST(N'2024-07-07' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 29, 6)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (30, 303, CAST(N'2025-07-07' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 30, 6)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (31, 317, CAST(N'2021-06-20' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 31, 7)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (32, 323, CAST(N'2022-06-20' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 32, 7)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (33, 330, CAST(N'2023-06-20' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 33, 7)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (34, 345, CAST(N'2024-06-20' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 34, 7)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (35, 358, CAST(N'2025-06-20' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 35, 7)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (36, 368, CAST(N'2021-07-07' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 36, 8)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (37, 370, CAST(N'2022-06-30' AS Date), CAST(12500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 37, 8)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (38, 383, CAST(N'2023-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 38, 8)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (39, 392, CAST(N'2024-06-24' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 39, 8)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (40, 404, CAST(N'2025-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 40, 8)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (41, 413, CAST(N'2021-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 41, 9)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (42, 422, CAST(N'2022-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 42, 9)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (43, 437, CAST(N'2023-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 43, 9)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (44, 441, CAST(N'2024-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 44, 9)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (45, 458, CAST(N'2025-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 45, 9)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (46, 462, CAST(N'2021-06-23' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 46, 10)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (47, 471, CAST(N'2022-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 47, 10)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (48, 487, CAST(N'2023-06-23' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 48, 10)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (49, 493, CAST(N'2024-06-23' AS Date), CAST(12500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 49, 10)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (50, 508, CAST(N'2025-06-23' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 50, 10)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (51, 514, CAST(N'2021-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 51, 11)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (52, 525, CAST(N'2022-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 52, 11)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (53, 531, CAST(N'2023-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 53, 11)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (54, 548, CAST(N'2024-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 54, 11)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (55, 555, CAST(N'2025-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 55, 11)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (56, 561, CAST(N'2021-07-07' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 56, 12)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (57, 575, CAST(N'2022-06-30' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 57, 12)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (58, 581, CAST(N'2023-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 58, 12)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (59, 596, CAST(N'2024-06-24' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 59, 12)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (60, 607, CAST(N'2025-06-21' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 60, 12)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (61, 610, CAST(N'2021-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 61, 13)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (62, 625, CAST(N'2022-07-07' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 62, 13)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (63, 631, CAST(N'2023-07-07' AS Date), CAST(15000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 63, 13)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (64, 648, CAST(N'2024-06-26' AS Date), CAST(10000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 64, 13)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (65, 651, CAST(N'2025-06-22' AS Date), CAST(5000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 65, 13)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (66, 661, CAST(N'2021-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 66, 14)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (67, 674, CAST(N'2022-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 67, 14)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (68, 685, CAST(N'2023-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 68, 14)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (69, 692, CAST(N'2024-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 69, 14)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (70, 707, CAST(N'2025-06-23' AS Date), CAST(7500.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 70, 14)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (71, 716, CAST(N'2021-06-22' AS Date), CAST(2000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 71, 15)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (72, 721, CAST(N'2022-06-22' AS Date), CAST(2000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 72, 15)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (73, 737, CAST(N'2023-06-22' AS Date), CAST(2000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 73, 15)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (74, 748, CAST(N'2024-06-22' AS Date), CAST(2000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 74, 15)
INSERT [dbo].[Factura] ([ID_Factura], [nro_factura], [fecha_emision], [monto_total], [archivo_url], [datos_crudos_ocr], [estado_validacion], [ID_pedido], [ID_proveedor]) VALUES (75, 753, CAST(N'2025-06-22' AS Date), CAST(2000.00 AS Numeric(12, 2)), N'factura_demo.pdf', N'{"texto": "simulacion QA validada"}', 1, 75, 15)
SET IDENTITY_INSERT [dbo].[Factura] OFF
GO
SET IDENTITY_INSERT [dbo].[Localidad] ON 

INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (1, 3400, N'Corrientes Capital', 1)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (2, 3500, N'Resistencia', 2)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (3, 5000, N'Córdoba Capital', 3)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (4, 7000, N'Tandil', 1)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (5, 1000, N'Ciudad Autónoma de Buenos Aires', 2)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (6, 4700, N'San Fernando del Valle de Catamarca', 3)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (7, 3500, N'Resistencia', 4)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (8, 3700, N'Presidencia Roque Sáenz Peña', 4)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (9, 3540, N'Villa Ángela', 4)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (10, 9103, N'Rawson', 5)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (11, 9000, N'Comodoro Rivadavia', 5)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (12, 5000, N'Córdoba', 6)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (13, 5800, N'Río Cuarto', 6)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (14, 5152, N'Villa Carlos Paz', 6)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (15, 3400, N'Corrientes (Capital)', 7)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (16, 3450, N'Goya', 7)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (17, 3230, N'Paso de los Libres', 7)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (18, 3460, N'Curuzú Cuatiá', 7)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (19, 3470, N'Mercedes', 7)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (20, 3100, N'Paraná', 8)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (21, 3200, N'Concordia', 8)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (22, 2820, N'Gualeguaychú', 8)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (23, 3600, N'Formosa', 9)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (24, 3610, N'Clorinda', 9)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (25, 4600, N'San Salvador de Jujuy', 10)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (26, 6300, N'Santa Rosa', 11)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (27, 5300, N'La Rioja', 12)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (28, 5500, N'Mendoza', 13)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (29, 5600, N'San Rafael', 13)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (30, 3300, N'Posadas', 14)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (31, 3360, N'Oberá', 14)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (32, 3380, N'Eldorado', 14)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (33, 3370, N'Puerto Iguazú', 14)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (34, 8300, N'Neuquén', 15)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (35, 8370, N'San Martín de los Andes', 15)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (36, 8500, N'Viedma', 16)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (37, 8400, N'San Carlos de Bariloche', 16)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (38, 4400, N'Salta', 17)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (39, 4427, N'Cafayate', 17)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (40, 5400, N'San Juan', 18)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (41, 5700, N'San Luis', 19)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (42, 5730, N'Villa Mercedes', 19)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (43, 9400, N'Río Gallegos', 20)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (44, 9405, N'El Calafate', 20)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (45, 3000, N'Santa Fe', 21)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (46, 2000, N'Rosario', 21)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (47, 2300, N'Rafaela', 21)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (48, 4200, N'Santiago del Estero', 22)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (49, 4220, N'Termas de Río Hondo', 22)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (50, 9410, N'Ushuaia', 23)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (51, 9420, N'Río Grande', 23)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (52, 4000, N'San Miguel de Tucumán', 24)
INSERT [dbo].[Localidad] ([ID_localidad], [codigo_postal], [nombre_localidad], [id_provincia]) VALUES (53, 4103, N'Tafí Viejo', 24)
SET IDENTITY_INSERT [dbo].[Localidad] OFF
GO
SET IDENTITY_INSERT [dbo].[Pedido] ON 

INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (1, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-22' AS Date), 1, 1)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (2, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-22' AS Date), 1, 1)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (3, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-22' AS Date), 1, 1)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (4, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-22' AS Date), 1, 1)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (5, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-22' AS Date), 1, 1)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (6, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-26' AS Date), 1, 2)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (7, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-26' AS Date), 1, 2)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (8, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-26' AS Date), 1, 2)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (9, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-26' AS Date), 1, 2)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (10, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-26' AS Date), 1, 2)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (11, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-07-04' AS Date), 1, 3)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (12, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-07-04' AS Date), 1, 3)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (13, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-07-04' AS Date), 1, 3)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (14, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-07-04' AS Date), 1, 3)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (15, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-07-04' AS Date), 1, 3)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (16, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-22' AS Date), 1, 4)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (17, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-24' AS Date), 1, 4)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (18, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-26' AS Date), 1, 4)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (19, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-30' AS Date), 1, 4)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (20, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-07-07' AS Date), 1, 4)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (21, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-22' AS Date), 1, 5)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (22, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-07-07' AS Date), 1, 5)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (23, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-22' AS Date), 1, 5)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (24, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-07-07' AS Date), 1, 5)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (25, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-22' AS Date), 1, 5)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (26, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-07-07' AS Date), 1, 6)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (27, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-07-07' AS Date), 1, 6)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (28, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-07-07' AS Date), 1, 6)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (29, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-07-07' AS Date), 1, 6)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (30, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-07-07' AS Date), 1, 6)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (31, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-20' AS Date), 1, 7)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (32, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-20' AS Date), 1, 7)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (33, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-20' AS Date), 1, 7)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (34, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-20' AS Date), 1, 7)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (35, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-20' AS Date), 1, 7)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (36, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-07-07' AS Date), 1, 8)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (37, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-30' AS Date), 1, 8)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (38, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-26' AS Date), 1, 8)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (39, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-24' AS Date), 1, 8)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (40, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-22' AS Date), 1, 8)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (41, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-26' AS Date), 1, 9)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (42, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-26' AS Date), 1, 9)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (43, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-26' AS Date), 1, 9)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (44, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-26' AS Date), 1, 9)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (45, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-26' AS Date), 1, 9)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (46, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-23' AS Date), 1, 10)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (47, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-23' AS Date), 1, 10)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (48, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-23' AS Date), 1, 10)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (49, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-23' AS Date), 1, 10)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (50, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-23' AS Date), 1, 10)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (51, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-23' AS Date), 1, 11)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (52, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-23' AS Date), 1, 11)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (53, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-23' AS Date), 1, 11)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (54, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-23' AS Date), 1, 11)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (55, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-23' AS Date), 1, 11)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (56, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-07-07' AS Date), 1, 12)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (57, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-30' AS Date), 1, 12)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (58, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-26' AS Date), 1, 12)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (59, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-24' AS Date), 1, 12)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (60, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-21' AS Date), 1, 12)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (61, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-23' AS Date), 1, 13)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (62, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-07-07' AS Date), 1, 13)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (63, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-07-07' AS Date), 1, 13)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (64, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-26' AS Date), 1, 13)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (65, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-22' AS Date), 1, 13)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (66, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-23' AS Date), 1, 14)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (67, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-23' AS Date), 1, 14)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (68, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-23' AS Date), 1, 14)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (69, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-23' AS Date), 1, 14)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (70, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-23' AS Date), 1, 14)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (71, N'Recibido', CAST(N'2021-06-15' AS Date), CAST(N'2021-06-22' AS Date), CAST(N'2021-06-22' AS Date), 1, 15)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (72, N'Recibido', CAST(N'2022-06-15' AS Date), CAST(N'2022-06-22' AS Date), CAST(N'2022-06-22' AS Date), 1, 15)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (73, N'Recibido', CAST(N'2023-06-15' AS Date), CAST(N'2023-06-22' AS Date), CAST(N'2023-06-22' AS Date), 1, 15)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (74, N'Recibido', CAST(N'2024-06-15' AS Date), CAST(N'2024-06-22' AS Date), CAST(N'2024-06-22' AS Date), 1, 15)
INSERT [dbo].[Pedido] ([ID_pedido], [estado_pedido], [fecha_emision], [fecha_entrega_esperada], [fecha_entrega_real], [ID_Usuario], [ID_proveedor]) VALUES (75, N'Recibido', CAST(N'2025-06-15' AS Date), CAST(N'2025-06-22' AS Date), CAST(N'2025-06-22' AS Date), 1, 15)
SET IDENTITY_INSERT [dbo].[Pedido] OFF
GO
SET IDENTITY_INSERT [dbo].[Producto] ON 

INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (1, N'Notebook Dell Latitude 3420', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (2, N'Monitor Samsung 24"', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (3, N'Teclado Mecánico Redragon', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (4, N'Mouse Inalámbrico Logitech', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (5, N'Licencia Windows 11 Pro', 2)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (6, N'Suscripción Office 365', 2)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (7, N'Antivirus ESET NOD32 (10 users)', 2)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (8, N'Licencia Visual Studio Enterprise', 2)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (9, N'Resma Papel A4 500h', 3)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (10, N'Cartucho Tóner HP 85A', 3)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (11, N'Caja de Bolígrafos Azules', 3)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (12, N'Marcadores de Pizarra x4', 3)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (13, N'Router Cisco RV340', 4)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (14, N'Switch TP-Link 24 Puertos', 4)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (15, N'Bobina Cable UTP Cat6', 4)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (16, N'Patch Panel 24 Puertos', 4)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (17, N'Disco SSD Kingston 1TB', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (18, N'Memoria RAM DDR4 16GB', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (19, N'Impresora Multifunción Epson', 1)
INSERT [dbo].[Producto] ([ID_Producto], [nombre_producto], [ID_Categoria]) VALUES (20, N'Rack Mural 9U', 4)
SET IDENTITY_INSERT [dbo].[Producto] OFF
GO
SET IDENTITY_INSERT [dbo].[Proveedor] ON 

INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (1, N'TechCorp Argentina', N'3794-111111', N'ventas@techcorp.com', N'30-11111111-1', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (2, N'Insumos NEA', N'3794-222222', N'contacto@insumosnea.com', N'30-22222222-2', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (3, N'Redes del Litoral', N'3624-333333', N'admin@redeslitoral.com', N'30-33333333-3', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (4, N'Librería Central', N'3794-444444', N'pedidos@libreriacentral.com', N'30-44444444-4', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (5, N'Distribuidora Córdoba', N'351-5555555', N'ventas@districba.com', N'30-55555555-5', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (6, N'SoftSolutions', N'3624-666666', N'info@softsolutions.com', N'30-66666666-6', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (7, N'Global IT', N'3794-777777', N'b2b@globalit.com', N'30-77777777-7', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (8, N'Informatica Chaco', N'3624-888888', N'ventas@infochaco.com', N'30-88888888-8', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (9, N'Mayorista El Puente', N'3794-999999', N'contacto@elpuente.com', N'30-99999999-9', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (10, N'Electro Corrientes', N'3794-101010', N'ventas@electroctes.com', N'30-10101010-0', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (11, N'NetSys Argentina', N'351-1212121', N'comercial@netsys.com', N'30-12121212-1', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (12, N'Impresiones y Copias', N'3794-131313', N'insumos@impresiones.com', N'30-13131313-2', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (13, N'Hardware Express', N'3624-141414', N'ventas@hwexpress.com', N'30-14141414-3', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (14, N'Oficina Total', N'351-1515151', N'empresas@oficinatotal.com', N'30-15151515-4', 1, 0)
INSERT [dbo].[Proveedor] ([ID_proveedor], [nombre_proveedor], [telefono], [correo_proveedor], [cuit], [estado], [score_riesgo_actual]) VALUES (15, N'Servicios Integrales', N'3794-161616', N'ventas@servinteg.com', N'30-16161616-5', 1, 0)
SET IDENTITY_INSERT [dbo].[Proveedor] OFF
GO
SET IDENTITY_INSERT [dbo].[Proveedor_Producto] ON 

INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (82, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 1)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (83, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 2)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (84, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 3)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (85, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 4)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (86, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 5)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (87, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 6)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (88, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 7)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (89, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 8)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (90, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 9)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (91, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 10)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (92, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 11)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (93, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 12)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (94, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 13)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (95, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 14)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (96, 1000, 1, CAST(N'2026-06-07' AS Date), 5, 1, 15)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (97, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 1)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (98, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 2)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (99, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 3)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (100, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 4)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (101, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 5)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (102, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 6)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (103, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 7)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (104, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 8)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (105, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 9)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (106, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 10)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (107, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 11)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (108, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 12)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (109, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 13)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (110, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 14)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (111, 1000, 1, CAST(N'2026-06-07' AS Date), 4, 2, 15)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (112, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 1)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (113, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 2)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (114, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 3)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (115, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 4)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (116, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 5)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (117, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 6)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (118, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 7)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (119, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 8)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (120, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 9)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (121, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 10)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (122, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 11)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (123, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 12)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (124, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 13)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (125, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 14)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (126, 1000, 1, CAST(N'2026-06-07' AS Date), 3, 3, 15)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (127, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 1)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (128, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 2)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (129, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 3)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (130, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 4)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (131, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 5)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (132, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 6)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (133, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 7)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (134, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 8)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (135, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 9)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (136, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 10)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (137, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 11)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (138, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 12)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (139, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 13)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (140, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 14)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (141, 1000, 1, CAST(N'2026-06-07' AS Date), 2, 4, 15)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (142, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 1)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (143, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 2)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (144, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 3)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (145, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 4)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (146, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 5)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (147, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 6)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (148, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 7)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (149, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 8)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (150, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 9)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (151, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 10)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (152, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 11)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (153, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 12)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (154, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 13)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (155, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 14)
INSERT [dbo].[Proveedor_Producto] ([id], [precio_actual], [stock], [ultima_actualizacion], [calidad], [ID_Producto], [ID_proveedor]) VALUES (156, 1000, 1, CAST(N'2026-06-07' AS Date), 1, 5, 15)
SET IDENTITY_INSERT [dbo].[Proveedor_Producto] OFF
GO
SET IDENTITY_INSERT [dbo].[Provincia] ON 

INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (1, N'Corrientes')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (2, N'Chaco')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (3, N'Córdoba')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (4, N'Chaco')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (5, N'Chubut')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (6, N'Córdoba')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (7, N'Corrientes')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (8, N'Entre Ríos')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (9, N'Formosa')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (10, N'Jujuy')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (11, N'La Pampa')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (12, N'La Rioja')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (13, N'Mendoza')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (14, N'Misiones')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (15, N'Neuquén')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (16, N'Río Negro')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (17, N'Salta')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (18, N'San Juan')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (19, N'San Luis')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (20, N'Santa Cruz')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (21, N'Santa Fe')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (22, N'Santiago del Estero')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (23, N'Tierra del Fuego')
INSERT [dbo].[Provincia] ([ID_provincia], [nombre_provincia]) VALUES (24, N'Tucumán')
SET IDENTITY_INSERT [dbo].[Provincia] OFF
GO
SET IDENTITY_INSERT [dbo].[Rol] ON 

INSERT [dbo].[Rol] ([ID_Rol], [nombre]) VALUES (1, N'Operador')
INSERT [dbo].[Rol] ([ID_Rol], [nombre]) VALUES (2, N'Administrador')
INSERT [dbo].[Rol] ([ID_Rol], [nombre]) VALUES (3, N'Directivo')
SET IDENTITY_INSERT [dbo].[Rol] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuario] ON 

INSERT [dbo].[Usuario] ([ID_Usuario], [Nombre_Usuario], [Apellido_Usuario], [DNI], [Correo_Usuario], [Contrasena], [Estado], [ID_Rol]) VALUES (1, N'Administrador', N'Provit', 11111111, N'admin@provit.com', N'pbkdf2_sha256$1200000$T6m1lD3sBiMdmgum0iQFvc$euM23ODV2C7jpVfkNgq60R55Iso9wWyhRqtzUaSAoM0=', 1, 2)
INSERT [dbo].[Usuario] ([ID_Usuario], [Nombre_Usuario], [Apellido_Usuario], [DNI], [Correo_Usuario], [Contrasena], [Estado], [ID_Rol]) VALUES (2, N'Milo Tahiel', N'Antorena', 41281778, N'milotahiel.r@gmail.com', N'pbkdf2_sha256$1200000$bWa46PgZL6PpvUiq7DAw7C$0d7qDkHfoteJWGb7uC61sWI3SQgVU08+kfVKNLJw2Yk=', 1, 1)
INSERT [dbo].[Usuario] ([ID_Usuario], [Nombre_Usuario], [Apellido_Usuario], [DNI], [Correo_Usuario], [Contrasena], [Estado], [ID_Rol]) VALUES (3, N'operador', N'provit', 44572923, N'operador@provit.com', N'pbkdf2_sha256$1200000$xYStRLNqwMduEIeJ99YV18$niqnGj4SxLSSCXeIIem2bS7H3UDFdE+zlHbU8h/LicQ=', 1, 1)
SET IDENTITY_INSERT [dbo].[Usuario] OFF
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [auth_group_name_a6ea08ec_uniq] Fecha de script: 09/06/2026 15:47:16 ******/
ALTER TABLE [dbo].[auth_group] ADD  CONSTRAINT [auth_group_name_a6ea08ec_uniq] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__Proveedo__2CDD9897145C0A3F] Fecha de script: 09/06/2026 15:47:16 ******/
ALTER TABLE [dbo].[Proveedor] ADD UNIQUE NONCLUSTERED 
(
	[cuit] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__Usuario__A7126311060DEAE8] Fecha de script: 09/06/2026 15:47:16 ******/
ALTER TABLE [dbo].[Usuario] ADD UNIQUE NONCLUSTERED 
(
	[Correo_Usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[auth_group_permissions]  WITH CHECK ADD  CONSTRAINT [auth_group_permissions_group_id_b120cbf9_fk_auth_group_id] FOREIGN KEY([group_id])
REFERENCES [dbo].[auth_group] ([id])
GO
ALTER TABLE [dbo].[auth_group_permissions] CHECK CONSTRAINT [auth_group_permissions_group_id_b120cbf9_fk_auth_group_id]
GO
ALTER TABLE [dbo].[auth_group_permissions]  WITH CHECK ADD  CONSTRAINT [auth_group_permissions_permission_id_84c5c92e_fk_auth_permission_id] FOREIGN KEY([permission_id])
REFERENCES [dbo].[auth_permission] ([id])
GO
ALTER TABLE [dbo].[auth_group_permissions] CHECK CONSTRAINT [auth_group_permissions_permission_id_84c5c92e_fk_auth_permission_id]
GO
ALTER TABLE [dbo].[auth_permission]  WITH CHECK ADD  CONSTRAINT [auth_permission_content_type_id_2f476e4b_fk_django_content_type_id] FOREIGN KEY([content_type_id])
REFERENCES [dbo].[django_content_type] ([id])
GO
ALTER TABLE [dbo].[auth_permission] CHECK CONSTRAINT [auth_permission_content_type_id_2f476e4b_fk_django_content_type_id]
GO
ALTER TABLE [dbo].[Detalle_Pedido]  WITH CHECK ADD  CONSTRAINT [Detalle_Pedido_ID_pedido_90d65496_fk_Pedido_ID_pedido] FOREIGN KEY([ID_pedido])
REFERENCES [dbo].[Pedido] ([ID_pedido])
GO
ALTER TABLE [dbo].[Detalle_Pedido] CHECK CONSTRAINT [Detalle_Pedido_ID_pedido_90d65496_fk_Pedido_ID_pedido]
GO
ALTER TABLE [dbo].[Detalle_Pedido]  WITH CHECK ADD  CONSTRAINT [Detalle_Pedido_ID_producto_a4aa2d4a_fk_Producto_ID_Producto] FOREIGN KEY([ID_producto])
REFERENCES [dbo].[Producto] ([ID_Producto])
GO
ALTER TABLE [dbo].[Detalle_Pedido] CHECK CONSTRAINT [Detalle_Pedido_ID_producto_a4aa2d4a_fk_Producto_ID_Producto]
GO
ALTER TABLE [dbo].[Direccion]  WITH CHECK ADD  CONSTRAINT [Direccion_ID_localidad_39336d70_fk_Localidad_ID_localidad] FOREIGN KEY([ID_localidad])
REFERENCES [dbo].[Localidad] ([ID_localidad])
GO
ALTER TABLE [dbo].[Direccion] CHECK CONSTRAINT [Direccion_ID_localidad_39336d70_fk_Localidad_ID_localidad]
GO
ALTER TABLE [dbo].[Direccion]  WITH CHECK ADD  CONSTRAINT [Direccion_ID_proveedor_ec27c1eb_fk_Proveedor_ID_proveedor] FOREIGN KEY([ID_proveedor])
REFERENCES [dbo].[Proveedor] ([ID_proveedor])
GO
ALTER TABLE [dbo].[Direccion] CHECK CONSTRAINT [Direccion_ID_proveedor_ec27c1eb_fk_Proveedor_ID_proveedor]
GO
ALTER TABLE [dbo].[django_admin_log]  WITH CHECK ADD  CONSTRAINT [django_admin_log_content_type_id_c4bce8eb_fk_django_content_type_id] FOREIGN KEY([content_type_id])
REFERENCES [dbo].[django_content_type] ([id])
GO
ALTER TABLE [dbo].[django_admin_log] CHECK CONSTRAINT [django_admin_log_content_type_id_c4bce8eb_fk_django_content_type_id]
GO
ALTER TABLE [dbo].[django_admin_log]  WITH CHECK ADD  CONSTRAINT [django_admin_log_user_id_c564eba6_fk_Usuario_ID_Usuario] FOREIGN KEY([user_id])
REFERENCES [dbo].[Usuario] ([ID_Usuario])
GO
ALTER TABLE [dbo].[django_admin_log] CHECK CONSTRAINT [django_admin_log_user_id_c564eba6_fk_Usuario_ID_Usuario]
GO
ALTER TABLE [dbo].[Factura]  WITH CHECK ADD  CONSTRAINT [Factura_ID_pedido_ae5b352f_fk_Pedido_ID_pedido] FOREIGN KEY([ID_pedido])
REFERENCES [dbo].[Pedido] ([ID_pedido])
GO
ALTER TABLE [dbo].[Factura] CHECK CONSTRAINT [Factura_ID_pedido_ae5b352f_fk_Pedido_ID_pedido]
GO
ALTER TABLE [dbo].[Factura]  WITH CHECK ADD  CONSTRAINT [Factura_ID_proveedor_80f01a9a_fk_Proveedor_ID_proveedor] FOREIGN KEY([ID_proveedor])
REFERENCES [dbo].[Proveedor] ([ID_proveedor])
GO
ALTER TABLE [dbo].[Factura] CHECK CONSTRAINT [Factura_ID_proveedor_80f01a9a_fk_Proveedor_ID_proveedor]
GO
ALTER TABLE [dbo].[Localidad]  WITH CHECK ADD  CONSTRAINT [Localidad_id_provincia_3e418197_fk_Provincia_ID_provincia] FOREIGN KEY([id_provincia])
REFERENCES [dbo].[Provincia] ([ID_provincia])
GO
ALTER TABLE [dbo].[Localidad] CHECK CONSTRAINT [Localidad_id_provincia_3e418197_fk_Provincia_ID_provincia]
GO
ALTER TABLE [dbo].[Pedido]  WITH CHECK ADD  CONSTRAINT [Pedido_ID_proveedor_ed564ec1_fk_Proveedor_ID_proveedor] FOREIGN KEY([ID_proveedor])
REFERENCES [dbo].[Proveedor] ([ID_proveedor])
GO
ALTER TABLE [dbo].[Pedido] CHECK CONSTRAINT [Pedido_ID_proveedor_ed564ec1_fk_Proveedor_ID_proveedor]
GO
ALTER TABLE [dbo].[Pedido]  WITH CHECK ADD  CONSTRAINT [Pedido_ID_Usuario_fce23009_fk_Usuario_ID_Usuario] FOREIGN KEY([ID_Usuario])
REFERENCES [dbo].[Usuario] ([ID_Usuario])
GO
ALTER TABLE [dbo].[Pedido] CHECK CONSTRAINT [Pedido_ID_Usuario_fce23009_fk_Usuario_ID_Usuario]
GO
ALTER TABLE [dbo].[Producto]  WITH CHECK ADD  CONSTRAINT [Producto_ID_Categoria_255003c2_fk_Categoria_ID_Categoria] FOREIGN KEY([ID_Categoria])
REFERENCES [dbo].[Categoria] ([ID_Categoria])
GO
ALTER TABLE [dbo].[Producto] CHECK CONSTRAINT [Producto_ID_Categoria_255003c2_fk_Categoria_ID_Categoria]
GO
ALTER TABLE [dbo].[Proveedor_Producto]  WITH CHECK ADD  CONSTRAINT [Proveedor_Producto_ID_Producto_997bd11a_fk_Producto_ID_Producto] FOREIGN KEY([ID_Producto])
REFERENCES [dbo].[Producto] ([ID_Producto])
GO
ALTER TABLE [dbo].[Proveedor_Producto] CHECK CONSTRAINT [Proveedor_Producto_ID_Producto_997bd11a_fk_Producto_ID_Producto]
GO
ALTER TABLE [dbo].[Proveedor_Producto]  WITH CHECK ADD  CONSTRAINT [Proveedor_Producto_ID_proveedor_ef4c28d6_fk_Proveedor_ID_proveedor] FOREIGN KEY([ID_proveedor])
REFERENCES [dbo].[Proveedor] ([ID_proveedor])
GO
ALTER TABLE [dbo].[Proveedor_Producto] CHECK CONSTRAINT [Proveedor_Producto_ID_proveedor_ef4c28d6_fk_Proveedor_ID_proveedor]
GO
ALTER TABLE [dbo].[Usuario]  WITH CHECK ADD  CONSTRAINT [Usuario_ID_Rol_694a9fdf_fk_Rol_ID_Rol] FOREIGN KEY([ID_Rol])
REFERENCES [dbo].[Rol] ([ID_Rol])
GO
ALTER TABLE [dbo].[Usuario] CHECK CONSTRAINT [Usuario_ID_Rol_694a9fdf_fk_Rol_ID_Rol]
GO
ALTER TABLE [dbo].[django_admin_log]  WITH CHECK ADD  CONSTRAINT [django_admin_log_action_flag_a8637d59_check] CHECK  (([action_flag]>=(0)))
GO
ALTER TABLE [dbo].[django_admin_log] CHECK CONSTRAINT [django_admin_log_action_flag_a8637d59_check]
GO
