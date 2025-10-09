import { Controller, Post, Body } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface Application {
  firstName: string;
  lastName: string;
  email: string;
}

@Controller('applications')
export class ApplicationsController {
  private filePath = path.join(process.cwd(), 'src', 'apply', 'applications.json');

  @Post()
  submitApplication(@Body() body: Application) {
    const applications: Application[] = fs.existsSync(this.filePath)
      ? JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
      : [];

    applications.push(body);

    fs.writeFileSync(this.filePath, JSON.stringify(applications, null, 2));
    return { message: 'Application saved successfully' };
  }
}
