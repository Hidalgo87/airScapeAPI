import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchListingDto {
	@IsOptional()
	@IsString()
	cityName: string;
	@IsOptional()
	@IsNumber()
	guestsNumber: number;
	@IsOptional()
	@IsString()
    startDate: string;
	@IsOptional()
	@IsString()
    endDate: string;
}
