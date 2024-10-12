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
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private imageService: ImagesService,
  ) {}

  
  async create(createListingDto: CreateListingDto) {
    let newListing;
    try {
      const { filePhotos, ...newListingDto } = createListingDto;
      newListing = this.listingRepository.create({
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
            listing_id: listingId,
            image_id: imageId,
            image_url: imageUrl,
          };
          listingImages.push(image);
        }
      }
      newListing.photos = listingImages;
      await this.listingRepository.save(newListing);
      return await this.listingRepository.findOne({ where: {listing_id:listingId}});
    } catch (error) {
      throw new InternalServerErrorException(`Something was wrong :( ${error}`);
    }
    return newListing;
  }

  async findPopularListings(amountListings: number = 8): Promise<Listing[]> {
    let listings: Listing[] = await this.listingRepository.find();
    if (listings) {
      const shuffledListings = listings.sort(() => 0.5 - Math.random());
      if (amountListings >= listings.length) {
        return shuffledListings;
      } else {
        return shuffledListings.slice(0, amountListings);
      }
    }
    return [];
  }

  findAll() {
    return `This action returns all listings`;
  }

  async findOneListing(listing_id: string) {
    const listing: Listing = await this.listingRepository.findOne({where: {listing_id}});
    return listing;
  }

  async findUserListings(user_id: string) {
    const user: User = await this.userRepository.findOne({where: {user_id}})
    const listings: Listing[] = await this.listingRepository.find({where: {user}});
    return listings;
  }

  async update(listing_id: string, updateListingDto: UpdateListingDto) {
    let newListing;
    try {
      const { filePhotos, ...newListingDto } = updateListingDto;
      let newListing:Listing = this.listingRepository.create({
        ...newListingDto,
      });
      
      const listingId = newListing.listing_id;
      let listingImages = updateListingDto.photos;
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
            listing_id: listingId,
            image_id: imageId,
            image_url: imageUrl,
          };
          listingImages.push(image);
        }
      }
      newListing.photos = listingImages;
      newListing.updatedAt = new Date();
      await this.listingRepository.update(listing_id, newListing);
      return await this.listingRepository.findOne({ where: {listing_id}});
    } catch (error) {
      throw new InternalServerErrorException(`Something was wrong :( ${error}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} listing`;
  }
}
