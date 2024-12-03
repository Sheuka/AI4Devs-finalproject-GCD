import { RatingService } from "../services/ratingService";
import { getRatingService } from "../config/dependencies";
import { RatingCreateDTO } from "src/models/rating.model";
import { Request, Response } from 'express';

export class RatingController {
    private _ratingService: RatingService | null = null;
  
    private getRatingService(): RatingService {
      if (!this._ratingService) {
        this._ratingService = getRatingService();
      }
      return this._ratingService;
    }

    create = async (req: Request<{}, {}, RatingCreateDTO>, res: Response) => {
        const ratingService = this.getRatingService();
        const rating = await ratingService.create(req.body);
        res.status(201).json(rating);
    }
}

const ratingController = new RatingController();

export const { create } = ratingController;

