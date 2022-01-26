import {
  Cache,
  cacheExchange,
  DataFields,
  Entity,
  EntityField,
  ResolveInfo,
  Resolver,
  Variables,
} from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  MyPostsQueryVariables,
  PostsQueryVariables,
} from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { cacheUpdates } from "./cacheUpdate";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error.message.includes("not authorized")) {
            Router.replace("/login");
          } else {
            Router.replace("/");
          }
        }
      })
    );
  };

function cursorPagination<FieldArgsType extends Variables>(): Resolver {
  return (
    _parent: DataFields,
    fieldArgs: FieldArgsType,
    cache: Cache,
    info: ResolveInfo
  ) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;

    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache;
    const results: string[] = [];

    let hasMorePosts: boolean = true;
    fieldInfos.forEach((fi) => {
      const data = cache.resolve(
        cache.resolve(entityKey, fi.fieldKey) as string,
        "posts"
      ) as string[];
      const hasMore = cache.resolve(
        cache.resolve(entityKey, fieldKey) as string,
        "hasMorePosts"
      );
      if (!hasMore as boolean) {
        hasMorePosts = hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PostsResponse",
      posts: results,
      hasMorePosts,
    };
  };
}
//   const visited = new Set();
//   let result: NullArray<string> = [];
//   let prevOffset: number | null = null;

//   for (let i = 0; i < size; i++) {
//     const { fieldKey, arguments: args } = fieldInfos[i];
//     if (args === null || !compareArgs(fieldArgs, args)) {
//       continue;
//     }

//     const links = cache.resolve(entityKey, fieldKey) as string[];
//     const currentOffset = args[offsetArgument];

//     if (
//       links === null ||
//       links.length === 0 ||
//       typeof currentOffset !== "number"
//     ) {
//       continue;
//     }

//     const tempResult: NullArray<string> = [];

//     for (let j = 0; j < links.length; j++) {
//       const link = links[j];
//       if (visited.has(link)) continue;
//       tempResult.push(link);
//       visited.add(link);
//     }

//     if (
//       (!prevOffset || currentOffset > prevOffset) ===
//       (mergeMode === "after")
//     ) {
//       result = [...result, ...tempResult];
//     } else {
//       result = [...tempResult, ...result];
//     }

//     prevOffset = currentOffset;
//   }

//   const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
//   if (hasCurrentPage) {
//     return result;
//   } else if (!(info as any).store.schema) {
//     return undefined;
//   } else {
//     info.partial = true;
//     return result;
//   }
// };

export const createURQLClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers:
        cookie !== ""
          ? {
              cookie,
            }
          : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: cacheUpdates,
        resolvers: {
          Query: {
            posts: cursorPagination<PostsQueryVariables>(),
            myPosts: cursorPagination<MyPostsQueryVariables>(),
          },
        },
        keys: {
          PostsResponse: () => null,
        },
      }),
      ssrExchange,
      errorExchange,
      fetchExchange,
    ],
  };
};
