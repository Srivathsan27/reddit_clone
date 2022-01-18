import {
  Cache,
  DataFields,
  QueryInput,
  ResolveInfo,
  Variables,
} from "@urql/exchange-graphcache";
import {
  RegisterMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  LogoutMutation,
} from "../generated/graphql";

function updateCache<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  update: (r: Result, oldDataSnapshot: Query) => Query
) {
  cache.updateQuery(
    queryInput,
    (oldData) => update(result, oldData as any) as any
  );
}
export const cacheUpdates = {
  Mutation: {
    register: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      updateCache<RegisterMutation, MeQuery>(
        cache,
        { query: MeDocument },
        result,
        (res, oldData) => {
          if (res.register.errors) {
            return oldData;
          } else {
            return {
              me: res.register.user,
            };
          }
        }
      );
    },
    login: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      updateCache<LoginMutation, MeQuery>(
        cache,
        { query: MeDocument },
        result,
        (res, oldData) => {
          if (res.login.errors) {
            return oldData;
          } else {
            return {
              me: res.login.user,
            };
          }
        }
      );
    },
    logout: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      updateCache<LogoutMutation, MeQuery>(
        cache,
        { query: MeDocument },
        result,
        (result, newData) => {
          if (result.logout === true) {
            return {
              me: null,
            };
          } else {
            return newData;
          }
        }
      );
    },
  },
};
