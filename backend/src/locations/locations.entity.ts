import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({nullable: true})
    photo: string;

    @Column({default: 0})
    availableUnits: number;

    @Column({default: false})
    wifi: boolean;

    @Column({default: false})
    laundry: boolean;
}
