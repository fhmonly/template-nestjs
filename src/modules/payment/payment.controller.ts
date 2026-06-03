import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentDTO, PaymentStatusDTO } from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('generate-token')
  async generateToken(@Body() data: PaymentDTO) {
    return this.paymentService.createTransactionToken({
      gross_amount: data.amount,
      order_id: data.orderId,
    });
  }

  @Get('update-status/:orderId')
  async updateStatus(@Param() data: PaymentStatusDTO) {
    return this.paymentService.updateStatus(data.orderId);
  }
}
