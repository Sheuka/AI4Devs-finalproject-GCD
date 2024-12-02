import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../config/dependencies";
import { RatingCreateDTO, RatingResponseDTO } from "src/models/rating.model";

export class RatingService {
    private prisma: PrismaClient;
  
    constructor() {
      this.prisma = getPrismaClient();
    }

    async create(rating: RatingCreateDTO): Promise<RatingResponseDTO> {
        return await this.prisma.rating.create({ data: rating });
    }

    async getAverageRating(userId: string): Promise<number> {
        const ratings = await this.prisma.rating.findMany({ where: { userId } });
        const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        return totalRating / ratings.length;
    }
}