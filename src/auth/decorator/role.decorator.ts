import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/typeorm/entities/user/user.entity';

export const ROLES_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLES_KEY, role);
