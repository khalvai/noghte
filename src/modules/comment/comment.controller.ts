import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { userInfo } from 'os';
import { Public } from 'src/common/decorators';
import { TokenInterceptor } from 'src/common/interceptors/token.interceptor';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/types/roles.enum';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReactionDto } from './dto/reaction.comment.Dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(Role.Admin)
  @Get('unverifieds')
  async getUnverifieds() {
    return await this.commentService.getUnverifieds();
  }

  @Public()
  @UseInterceptors(TokenInterceptor)
  @Get(':professorId')
  async getCommentToProfessorAndUserReactions(
    @Param('professorId', ParseIntPipe) professorId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.commentService.getCommentsToProfessorAndUserReactions(
      professorId,
      userId,
    );
  }

  @Post(':professorId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('professorId', ParseIntPipe) professorId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.commentService.create(createCommentDto, professorId, userId);
  }

  @Get('duplicate/:professorId')
  async canComment(
    @GetCurrentUserId() userId: number,
    @Param('professorId', ParseIntPipe) professorId: number,
  ) {
    return await this.commentService.checkAlreadyCommented(professorId, userId);
  }

  @Roles(Role.Admin)
  @Post('accept/:id')
  async accept(@Param('id', ParseIntPipe) commentId: number) {
    return await this.commentService.acceptAndUpdateAverge(commentId);
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  async reject(@Param('id', ParseIntPipe) commentId: number) {
    return await this.commentService.delete(commentId);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Post(':commentId/react')
  async react(
    @GetCurrentUserId() userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() reaction: ReactionDto,
  ) {
    return await this.commentService.saveUserReaction(
      userId,
      commentId,
      reaction.type,
    );
  }
}
