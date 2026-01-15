import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTimeEntryDto) {
    const existingEntries = await this.prisma.timeEntry.findMany({
      where: { date: dto.date },
    });

    const totalHours = existingEntries.reduce((sum, entry) => sum + entry.hours, 0);

    if (totalHours + dto.hours > 24) {
      throw new BadRequestException(
        `Ліміт перевищено. Вже є ${totalHours} год. Не можна додати ще ${dto.hours} год.`
      );
    }

    return this.prisma.timeEntry.create({
      data: dto,
    });
  }

  async findAll() {

    return this.prisma.timeEntry.findMany({
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: number) { return `This action returns a #${id} timeEntry`; }
  update(id: number, updateTimeEntryDto: any) { return `This action updates a #${id} timeEntry`; }
  remove(id: number) { return `This action removes a #${id} timeEntry`; }
}