import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderFilterDto } from 'src/dtos/order/order-filter.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UserEntity } from '../auth/user/user.entity';
import { SubmitOrderDto } from 'src/dtos/order/submit-order.dto';
import { AssignDeliveryManDto } from 'src/dtos/order/assign-delivery-man.dto';
import { ChangeOrderStatusDto } from 'src/dtos/order/change-order-status.dto';
import { UpdatePaymentDto } from 'src/dtos/order/order-update-payment.dto';
import { OrderStatusEntity } from './order-status/order-status.entity';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
  ) {}

  @Get('/')
  getOrders(
    @Query() orderFilterDto: OrderFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<OrderEntity>> {
    limit = limit > 50 ? 50 : limit;
    return this.orderService.getOrders(orderFilterDto, {
      page,
      limit,
      route: this.configService.get('HOST'),
    });
  }

  @Get('/status')
  getStatus(): Promise<OrderStatusEntity[]> {
    return this.orderService.getStatus();
  }

  @Get('/get-orders-by-delivery-man/:delivery_man_id?')
  getOrderByDeliveryMan(
    @GetUser() user: UserEntity,
    @Param('delivery_man_id') deliveryManId: string,
  ): Promise<OrderEntity[]> {
    deliveryManId = !deliveryManId ? user.id : deliveryManId;
    return this.orderService.getOrdersByDeliveryMan(deliveryManId);
  }

  @Get('/user-history/:user_id?')
  getOrderHistoryByUserId(
    @GetUser() user: UserEntity,
    @Param('user_id') userId: string,
  ): Promise<OrderEntity[]> {
    userId = !userId ? user.id : userId;
    return this.orderService.getOrderHistoryByUserId(userId);
  }

  @Get('/:id')
  getOrderById(@Param('id') id: string): Promise<OrderEntity> {
    return this.orderService.getOrderById(id);
  }

  @Post('/create')
  async create(
    @GetUser() user: UserEntity,
    @Body() submitOrderDto: SubmitOrderDto,
  ): Promise<OrderEntity> {
    return await this.orderService.createOrder(user, submitOrderDto);
  }

  @Put('/:id/update-payment')
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @GetUser() user: UserEntity,
  ): Promise<OrderEntity> {
    return await this.orderService.updatePayment(id, updatePaymentDto, user);
  }

  @Patch('/assign-delivery-man/:order_id/:user_id')
  @HttpCode(204)
  assignDeliveryMan(
    @Param() assignDeliveryManDto: AssignDeliveryManDto,
  ): Promise<void> {
    return this.orderService.assignDeliveryMan(assignDeliveryManDto);
  }

  @Patch('/change-status/:id')
  changeOrderStatus(
    @GetUser() user: UserEntity,
    @Param('id') id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ): Promise<OrderEntity> {
    return this.orderService.changeOrderStatus(id, changeOrderStatusDto, user);
  }

  @Delete('/:id/delete')
  @HttpCode(204)
  deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}
