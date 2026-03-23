import { Expose } from 'class-transformer';

//remember we used this way to avoid the exclude problem that if we have an admin panel we won't show the entities too ,, so we used expose (we make a dto and put it in the serialize interceptors)
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  admin: boolean;
}
