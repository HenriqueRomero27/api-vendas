import OrdersProducts from '@modules/orders/typeorm/entities/OrdersProducts';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @OneToMany(() => OrdersProducts, order_products => order_products.product)
  order_products: OrdersProducts[];

  @Column()
  name: String;

  @Column('decimal')
  price: Number;

  @Column('int')
  quantity: Number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
