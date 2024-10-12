import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login-dto.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });
      await this.userRepository.save(newUser);
      const { password: _, ...user } = newUser;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Username ${createUserDto.username} or Email ${createUserDto.email} already exists`,
        );
      }
      throw new InternalServerErrorException(`Something was wrong :(`);
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException('User or password incorrects');
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('User or password incorrects');
    }

    const { password: _, ...rest } = user;
    const token = this.getJwtToken({ id: user.user_id, username: user.username });
    return {
      user: rest,
      token: token,
    };
  }

  async findById(user_id: string){
    const users = await this.userRepository.find({where: {user_id}});
    if (users.length === 0){
      return undefined;
    }
    const { password, ...user } = users[0];
    return user;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
