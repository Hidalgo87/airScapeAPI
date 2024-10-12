import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ImagesService } from '../images/images.service';
import { v4 as uuid } from 'uuid';
import { Image } from '../images/interfaces/image.interface';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private jwtService: JwtService,
    private imageService: ImagesService,
  ) {}

  
  async create(createListingDto: CreateListingDto) {
    try {
      const { filePhotos, ...newListingDto } = createListingDto;
      const newListing:Listing = this.listingRepository.create({
        ...newListingDto,
      });
      const listingId = newListing.listing_id;
      let listingImages = [];
      for (let file of filePhotos) {
        let imageId = uuid();
        let imageUrl = await this.imageService.upload(
          file,
          'listings',
          `${listingId}/${imageId}`,
        );
        console.log('imageUrl', imageUrl);
        if (imageUrl) {
          let image: Image = {
            listingId: listingId,
            imageId: imageId,
            imageUrl: imageUrl,
          };
          listingImages.push(image);
        }
      }
      newListing.photos = listingImages;
      // FALTA PASAR EL USUARIO (obtenlo desde el token de header) newListing.user = ;
      await this.listingRepository.save(newListing);
    } catch (error) {
      throw new InternalServerErrorException(`Something was wrong :( ${error}`);
    }
    return 'This action adds a new listing';
  }

  findAll() {
    return `This action returns all listings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listing`;
  }

  update(id: number, updateListingDto: UpdateListingDto) {
    return `This action updates a #${id} listing`;
  }

  remove(id: number) {
    return `This action removes a #${id} listing`;
  }
}
