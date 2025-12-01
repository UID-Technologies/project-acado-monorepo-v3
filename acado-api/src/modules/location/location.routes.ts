// src/modules/location/location.routes.ts
import { Router } from 'express';
import { locationController } from './location.controller.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { statesQueryDto, citiesQueryDto } from './location.dto.js';

const router = Router();

router.get('/countries', locationController.getCountries);
router.get('/states', validateRequest(statesQueryDto, 'query'), locationController.getStates);
router.get('/cities', validateRequest(citiesQueryDto, 'query'), locationController.getCities);

export default router;

