import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ServiceService } from '../service/service.service';
import { ComponentService } from '../component/component.service';

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private serviceService: ServiceService,
    private componentService: ComponentService,
  ) {}
}
