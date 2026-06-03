import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaymentDTO, PaymentStatusDTO } from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('generate-token')
  @HttpCode(201)
  @ApiBearerAuth('access-token')
  async generateToken(@Body() data: PaymentDTO) {
    return this.paymentService.createTransactionToken({
      gross_amount: data.amount,
      order_id: data.orderId,
    });
  }

  @Get('update-status/:orderId')
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  async updateStatus(@Param() data: PaymentStatusDTO) {
    return this.paymentService.updateStatus(data.orderId);
  }
}
