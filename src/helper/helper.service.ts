import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  getPaginationParams(inPage: number, inLimit: number) {
    const page = inPage;
    const limit = inLimit;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }
}
