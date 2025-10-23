export interface User {
  id: number;
  sub: string;
  nombre: string;
  apellido: string;
  dni?: string;
  numero?: string;
  correo: string;
  habilitado: boolean;
  tipo_usuario: TypeUser;
}

export interface TypeUser {
  id: number;
  nombre: string;
  users?: User[];
}

// es de formulario o para dto
export interface UpdateUser {
  nombre: string;
  apellido: string;
  dni: number;
  numero: number;
}
// es de formulario o para dto


export interface Order {
  id: number;
  codigo: string;
  fecha: Date;
  hora: Date;
  total: number;
  direccion: { x: number; y: number };
  ultima_fecha?: Date | null;
  estado_pedido: OrderStatus;
  tipo_entrega: DeliveryType;
  metodo_pago: PaymentMethod;
  usuario: User;
  detalles: OrderDetail[];
  comprobante: Invoice;
}

export interface OrderStatus {
  id: number;
  nombre: string;
  pedidos?: Order[];
}
export interface DeliveryType {
  id: number;
  nombre: string;
  pedidos?: Order[];
}
export interface PaymentMethod {
  id: number;
  nombre: string;
  pedidos?: Order[];
}
export interface OrderDetail {
  id: number;
  precio: number;
  cantidad: number;
  subtotal: number;
  producto: Product;
  pedido?: Order;
}

export interface Invoice {
  id: number;
  comprobante?: string;
  xml?: string;
  cdr?: string;
  tipo_comprobante: InvoiceType;
  pedido: Order;
}
export interface InvoiceType {
  id: number;
  nombre: string;
  comprobantes?: Invoice[];
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  peso_kg: number;
  precio: number;
  habilitado: boolean;
  porcentaje_descuento: number;
  precio_final?: number;
  categoria: Category;
  marca: Brand;
  imagenes?: ProductImage[];
  detallesEntrada?: EntryDetail[];
  detallesPedido?: OrderDetail[];
  stock?: number;
}

export interface Category {
  id: number;
  nombre: string;
  habilitado: boolean;
  public_id: string;
  secure_url: string;
  productos?: Product[];
}
export interface Brand {
  id: number;
  nombre: string;
  habilitado: boolean;
  public_id: string;
  secure_url: string;
  productos?: Product[];
}


export interface ProductImage {
  id: number;
  public_id: string;
  secure_url: string;
  producto?: Product;
}


export interface EntryDetail {
  id: number;
  cantidad: number;
  producto: Product;
  entrada?: Entry;
}
export interface Entry {
  id: number;
  fecha: Date;
  hora: Date;
  habilitado: boolean;
  detalles?: EntryDetail[];
}
export interface Publication {
  id: number;
  titulo: string;
  url_redireccion?: string;
  public_id: string;
  secure_url: string;
}

export interface Cart {
  id: number;
  updated_at: Date;
  usuario: User;
  detalles: CartDetail[];
}

export interface CartDetail {
  id: number;
  cantidad: number;
  producto: Product;
  carrito: Cart;
}