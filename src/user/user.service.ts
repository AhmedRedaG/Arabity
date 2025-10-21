import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUtilsService } from 'src/auth-utils/auth-utils.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthUtilsService))
    private authUtilsService: AuthUtilsService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async findByIdWithPassword(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { cars: true, bookings: true, reviews: true },
    });
    if (!user) throw new NotFoundException('user not found');

    return { user };
  }

  async create(dto: CreateUserDto): Promise<User> {
    const isUserExist = await this.findByEmail(dto.email);
    if (isUserExist) {
      throw new ConflictException('user exists with this email');
    }

    const { password, ...user } = await this.userRepository.save(dto);
    password.at(0); // ts -_-

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    Object.assign(user, dto);

    await this.userRepository.save(user);

    return { user };
  }

  async delete(id: string) {
    const user = await this.findById(id);
    await this.userRepository.remove(user);

    return { message: 'user deleted successfully' };
  }

  async confirmVerification(userId: string) {
    await this.userRepository.update(userId, { isVerified: true });
  }

  async setPassword(id: string, password: string) {
    const hashedPassword = await this.authUtilsService.hashPassword(password);

    await this.userRepository.update(id, {
      password: hashedPassword,
    });
  }

  async changePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findByIdWithPassword(id);
    if (!user.password) {
      throw new ConflictException('user has no password set');
    }
    if (dto.oldPassword === dto.newPassword) {
      throw new ConflictException(
        'new password must be different from old password',
      );
    }

    const isValidPassword = await this.authUtilsService.validatePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('invalid old password');
    }

    await this.setPassword(id, dto.newPassword);

    return { message: 'password changed successfully' };
  }
}
