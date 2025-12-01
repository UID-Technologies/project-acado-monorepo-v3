// src/modules/location/location.controller.ts
import { Request, Response, NextFunction } from 'express';
import { LocationService } from './location.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { statesQueryDto, citiesQueryDto } from './location.dto.js';

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  getCountries = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await this.locationService.listCountries();
      res.json(successResponse(countries));
    } catch (error) {
      next(error);
    }
  };

  getStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = statesQueryDto.parse(req.query);
      const states = await this.locationService.listStates(query.country);
      res.json(successResponse(states));
    } catch (error) {
      next(error);
    }
  };

  getCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = citiesQueryDto.parse(req.query);
      const cities = await this.locationService.listCities(query.country, query.state);
      res.json(successResponse(cities));
    } catch (error) {
      next(error);
    }
  };
}

export const locationController = new LocationController();

