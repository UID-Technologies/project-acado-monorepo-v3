// src/modules/dashboard/dashboard.service.ts
import { getDashboardStats } from '../../services/dashboard.service.js';

export class DashboardService {
  async getStats() {
    return getDashboardStats();
  }
}

