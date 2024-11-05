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
import { BriefListingDto } from './dto/brief-listing.dto';

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
      const { files, ...newListingDto } = createListingDto;
      newListing = this.listingRepository.create({
        ...newListingDto,
      });
      const listingId = newListing.listing_id;
      let listingImages = [];
      for (let file of files) {
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
    } catch (error) {
      throw new InternalServerErrorException(`Something was wrong :( ${error}`);
    }
  }

  async findPopularListings(
    amountListings: number = 8,
  ): Promise<BriefListingDto[]> {
    let listings: Listing[] = await this.listingRepository.find();
    if (listings) {
      const shuffledListings = listings.sort(() => 0.5 - Math.random());
      if (amountListings >= listings.length) {
        return this.parseListingsToBriefListings(shuffledListings);
      } else {
        return this.parseListingsToBriefListings(
          shuffledListings.slice(0, amountListings),
        );
      }
    }
    return [];
  }

  findAll() {
    return `This action returns all listings`;
  }

  async findListingDetails(listing_id: string) {
    const listing = await this.listingRepository
      .createQueryBuilder('listing')
      .innerJoinAndSelect('listing.reviews', 'review')
      .where('listing.listing_id = :listingId', { listingId: listing_id })
      .getOne();
    console.log('listing', listing);
    return listing;
  }

  async findRawListing(listing_id: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { listing_id },
    });
    return listing;
  }

  async findUserListings(user: User) {
    const listings: Listing[] = await this.listingRepository.findBy({
      user,
    });
    const listingBriefs: BriefListingDto[] =
      this.parseListingsToBriefListings(listings);
    return listingBriefs;
  }

  async update(updateListingDto: UpdateListingDto) {
    try {
      console.log('updateListingDto', updateListingDto);
      const { files, listingId, ...newListingDto } = updateListingDto;
      let newListing: Listing = this.listingRepository.create({
        ...newListingDto,
      });
      let listingImages = updateListingDto.oldPhotos;
      for (let file of files) {
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
      await this.listingRepository.update(listingId, newListing);
      return await this.listingRepository.findOne({
        where: { listing_id: listingId },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Something was wrong :( ${error}`);
    }
  }

  async remove(listing_id: string) {
    console.log('this.getListings(', (await this.getListings()).length);
    const response = await this.listingRepository.delete(listing_id);
    console.log('this.getListings(', (await this.getListings()).length);
    return response;
  }

  async getListingById(listingId: string): Promise<Listing | undefined> {
    const listing = this.listingRepository.findOne({
      where: { listing_id: listingId },
    });
    return listing;
  }

  async getListings(): Promise<Listing[]> {
    const listings = await this.listingRepository.find();
    return listings;
  }

  parseListingsToBriefListings(listings: Listing[]): BriefListingDto[] {
    let newListings: BriefListingDto[] = [];
    for (let listing of listings) {
      const briefListingDto: BriefListingDto = {
        listingId: listing.listing_id,
        title: listing.title,
        photo: listing.photos[0],
        pricePerNight: listing.pricePerNight,
        calification: listing.rating,
        maxGuests: listing.maxGuests,
        createdAt: listing.createdAt,
        user: listing.user,
      };
      newListings.push(briefListingDto);
    }
    return newListings;
  }

  private getAverageCalification() {}
}
