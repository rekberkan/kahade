import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DisputeService } from './dispute.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

@ApiTags('disputes')
@Controller('disputes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a dispute for a transaction' })
  @ApiResponse({ status: 201, description: 'Dispute created successfully' })
  async create(@CurrentUser('id') userId: string, @Body() createDisputeDto: CreateDisputeDto) {
    return this.disputeService.create(userId, createDisputeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all disputes' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.disputeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispute by ID' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.disputeService.findOne(id, userId);
  }

  @Put(':id/resolve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Resolve a dispute' })
  @ApiResponse({ status: 200, description: 'Dispute resolved' })
  async resolve(@Param('id') id: string, @Body() resolveDisputeDto: ResolveDisputeDto) {
    return this.disputeService.resolve(id, resolveDisputeDto);
  }
}
