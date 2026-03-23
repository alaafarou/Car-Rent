import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        // if (process.env.NODE_ENV === 'development') {
        return {
          type: 'sqlite',
          synchronize: false,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
        };

      case 'test':
        return {
          type: 'sqlite',
          synchronize: true,
          migrationsRun: true,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
        };
      case 'production':
        return {
          type: 'postgres',
          synchronize: false,
          migrationsRun: true,
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          ssl: { rejectUnauthorized: false },
        };
      default:
        throw new Error('Unknown environment');

      // case:'production':
    }
    // else if (process.env.NODE_ENV === 'production') {
    //   return {
    //     type: 'sqlite',
    //     synchronize: false,
    //     database: this.configService.get<string>('DB_NAME'),
    //     autoLoadEntities: true,
    //   };
    // }
  }
}

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   constructor(private configService: ConfigService) {}

//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     if (process.env.NODE_ENV === 'development') {
//       return {
//         type: 'sqlite',
//         synchronize: false,
//         database: this.configService.get<string>('DB_NAME'),
//         autoLoadEntities: true,
//       };
//     } else if (process.env.NODE_ENV === 'test') {
//       return {
//         type: 'sqlite',
//         synchronize: true,
//         migrationsRun: true,
//         database: this.configService.get<string>('DB_NAME'),
//         autoLoadEntities: true,
//       };
//     }
//     // else if (process.env.NODE_ENV === 'production') {
//     //   return {
//     //     type: 'sqlite',
//     //     synchronize: false,
//     //     database: this.configService.get<string>('DB_NAME'),
//     //     autoLoadEntities: true,
//     //   };
//     // }
//   }
// }
