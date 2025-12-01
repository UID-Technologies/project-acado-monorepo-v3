// src/routes/location.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/location.controller.js';
import validate from '../middleware/validate.js';
import { statesQuerySchema, citiesQuerySchema } from '../schemas/location.schema.js';

const r = Router();

r.get('/countries', ctrl.getCountries);
r.get('/states', validate(statesQuerySchema), ctrl.getStates);
r.get('/cities', validate(citiesQuerySchema), ctrl.getCities);

export default r;


