import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { s3Service } from 'src/core/storage/s3/s3.service';

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService,private s3Service: s3Service){}
  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const url = await this.s3Service.uploadFile(file,'images')
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        image_url: url as string,
        
      }
    })
    return user
  }
}