import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddProductDto } from './dtos/add-product.dto';
import { Member } from 'src/auth/get-member-decorator';
import { MemberEntity } from 'src/auth/member.entity';
import { MemberDataService } from './member-data.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Member Data Controller')
@Controller('/member-data')
export class MemberDataController {
  constructor(
    private memberDataService: MemberDataService,
  ){}

  @Patch('/add-product')
  @UseGuards(AuthGuard())
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @Member() member: MemberEntity
    ):Promise<void>{
      this.memberDataService.addProduct(addProductDto, member.memberId)
    }
}
