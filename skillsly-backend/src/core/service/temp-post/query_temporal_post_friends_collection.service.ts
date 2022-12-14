import { QueryTemporalPostCollectionInteractor } from '@core/domain/temp-post/use-case/interactor/query_temporal_post_collection.interactor';
import { Inject } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import QueryTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/query_temporal_post.gateway';
import QueryPermanentPostCollectionInputModel
  from '@core/domain/post/use-case/input-model/query_permanent_post_collection.input_model';
import { NonExistentUserException } from '@core/domain/post/use-case/exception/permanent_post.exception';
import { NotFoundFriendsTemporalPostsException } from '@core/domain/temp-post/use-case/exception/temp-post.exception';

export class QueryTemporalPostFriendsCollectionService implements QueryTemporalPostCollectionInteractor {
  constructor(
    @Inject(TempPostDITokens.TempPostRepository)
    private readonly temp_post_gateway: QueryTemporalPostGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway,
  ) {
  }

  async execute(input: QueryPermanentPostCollectionInputModel): Promise<any> {
    const owner_id = input.user_id;
    const owner = await this.user_gateway.findOne({ user_id: owner_id });
    if (!owner) {
      throw new NonExistentUserException();
    }
    const posts = await this.temp_post_gateway.findAllWithRelation({ user_id: owner_id });
    if (posts instanceof Object) {
      if (Object.keys(posts).length === 0) {
        throw new NotFoundFriendsTemporalPostsException();
      }
    }
    return posts;
  }

}