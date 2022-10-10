import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: String;
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
