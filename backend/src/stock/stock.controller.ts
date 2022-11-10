import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all stocks that contain the given (sub)string in their name' })
  @ApiResponse({ status: 200, description: 'Returns all found stocks as an array of json-objects' })
  async findAll(@Query('name') stockName: string) {
    return this.stockService.searchStocks(stockName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns information about a specific stock' })
  @ApiResponse({ status: 200, description: 'Returns a json-object containing all information about the stock with the sid' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid. No stock-object is returned' })
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }
}
