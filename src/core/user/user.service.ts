import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUtilsService } from 'src/core/auth-utils/auth-utils.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { UtilsService } from 'src/core/utils/utils.service';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';
import { UploadedImageMainDetails } from 'src/types/upload.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthUtilsService))
    private authUtilsService: AuthUtilsService,
    private utilsService: UtilsService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOneBy(findOptions);
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

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { cars: true, bookings: true, reviews: true, addresses: true },
    });
    if (!user) throw new NotFoundException('user not found');

    return { user };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inOptions: OptionsQueryDto,
    inCondition?: any,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = {};
    if (inCondition) {
      Object.assign(where, inCondition);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: {
        [inOptions.orderBy]: inOptions.orderDirection,
      },
    });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, users };
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

  async createGoogleUser(userData: DeepPartial<User>) {
    return await this.userRepository.save(userData);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOneBy({ id });
    await this.userRepository.update(id, dto);

    return { message: 'user updated successfully' };
  }

  async saveOrUpdateImage(userId: string, newImage: UploadedImageMainDetails) {
    const { image } = await this.findOneBy({ id: userId });
    await this.userRepository.update(userId, {
      image: newImage,
    });
    return {
      oldImage: image,
    };
  }

  async removeImage(userId: string) {
    const { image } = await this.findOneBy({ id: userId });
    if (!image) {
      throw new NotFoundException('user has no image');
    }
    await this.userRepository.update(userId, { image: null });
    return {
      oldImage: image,
    };
  }

  async remove(id: string) {
    await this.findOneBy({ id });
    await this.userRepository.delete(id);

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
