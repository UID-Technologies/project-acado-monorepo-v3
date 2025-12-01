// src/controllers/location.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/location.service.js';

export const getCountries = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await service.listCountries();
    res.json({ data: countries });
  } catch (error) {
    next(error);
  }
};

export const getStates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const country = req.query.country as string;
    const states = await service.listStates(country);
    res.json({ data: states });
  } catch (error) {
    next(error);
  }
};

export const getCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const country = req.query.country as string;
    const state = req.query.state as string;
    const cities = await service.listCities(country, state);
    res.json({ data: cities });
  } catch (error) {
    next(error);
  }
};


