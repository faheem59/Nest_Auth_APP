// create-review.dto.ts
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  comment: string;
}
