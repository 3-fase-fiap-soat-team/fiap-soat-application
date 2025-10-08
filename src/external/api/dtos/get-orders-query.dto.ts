import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusFilter } from 'src/core/orders/enums/order-status-filter.enum';

export class GetOrdersQueryDto {
  @ApiProperty({
    enum: OrderStatusFilter,
    enumName: 'OrderStatusFilter',
    description: 'Status do pedido para filtrar',
    required: false,
    default: OrderStatusFilter.ALL,
    example: OrderStatusFilter.PREPARING,
  })
  @IsOptional()
  @IsEnum(OrderStatusFilter, {
    message: 'Status deve ser um dos valores: received, preparing, ready, finished, all'
  })
  status?: OrderStatusFilter;
}
