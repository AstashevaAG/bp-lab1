import { Body, Controller, NotFoundException, Param, Put } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Put(':ticketId/amenities')
  async updateAmenities(
    @Param('ticketId') ticketId: number,
    @Body('selectedAmenities') selectedAmenities: number[],
  ) {
    if (!selectedAmenities || selectedAmenities.length === 0) {
      throw new NotFoundException('No amenities selected.');
    }

    const result = await this.purchaseService.updateAmenities(ticketId, selectedAmenities);

    return result;
  }
}
