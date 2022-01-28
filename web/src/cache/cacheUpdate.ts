import {
  Cache,
  DataFields,
  QueryInput,
  ResolveInfo,
  Variables,
} from "@urql/exchange-graphcache";
import { gql } from "urql/core";
import {
  RegisterMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  LogoutMutation,
  HitPostMutationVariables,
  ChangePasswordMutation,
  DeletePostMutationVariables,
  UpdatePostMutationVariables,
  CommentPostMutationVariables,
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
    hitPost: (
      result: DataFields,
      { post, value }: HitPostMutationVariables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      const data = cache.readFragment(
        gql`
          fragment _ on Post {
            id
            numberOfHits
            hitStatus
          }
        `,
        { id: post } as any
      ); // Data or null

      if (data) {
        let hits = data.numberOfHits;
        let newHitStatus = data.hitStatus;

        if (data.hitStatus === value) {
          newHitStatus = 0;
          hits -= value;
        } else if (data.hitStatus === 0) {
          newHitStatus = value;
          hits += value;
        } else {
          newHitStatus = value;
          hits += 2 * value;
        }

        cache.writeFragment(
          gql`
            fragment __ on Post {
              id
              numberOfHits
              hitStatus
            }
          `,
          { id: post, numberOfHits: hits, hitStatus: newHitStatus }
        );
      }
    },
    addComment: (
      result: DataFields,
      args: CommentPostMutationVariables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "post", {
        id: args.post,
      });
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
    },
    updateComment: (
      result: DataFields,
      args: CommentPostMutationVariables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "post", {
        id: args.post,
      });
      cache.invalidate("Query", "myComments");

      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
    },
    deleteComment: (
      result: DataFields,
      args: CommentPostMutationVariables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "post", {
        id: args.post,
      });
      cache.invalidate("Query", "myComments");
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
    },
    newPost: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
    },
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
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
      const allPostFields = allFields.filter(
        (info) => info.fieldName === "post"
      );
      allPostFields.forEach((fi) => {
        cache.invalidate("Query", "post", fi.arguments);
      });
    },
    login: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });

      const allPostFields = allFields.filter(
        (info) => info.fieldName === "post"
      );
      allPostFields.forEach((fi) => {
        cache.invalidate("Query", "post", fi.arguments);
      });

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
    changePassword: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });

      const allPostFields = allFields.filter(
        (info) => info.fieldName === "post"
      );
      allPostFields.forEach((fi) => {
        cache.invalidate("Query", "post", fi.arguments);
      });

      updateCache<ChangePasswordMutation, MeQuery>(
        cache,
        { query: MeDocument },
        result,
        (res, oldData) => {
          if (res.changePassword?.errors) {
            return oldData;
          } else {
            return {
              me: res.changePassword?.user,
            };
          }
        }
      );
    },
    resetPassword: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "me");
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
    },
    logout: (
      result: DataFields,
      args: Variables,
      cache: Cache,
      info: ResolveInfo
    ) => {
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });

      const allPostFields = allFields.filter(
        (info) => info.fieldName === "post"
      );
      allPostFields.forEach((fi) => {
        console.log(fi.arguments);
        cache.invalidate("Query", "post", fi.arguments);
      });

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
    delete: (
      result: any,
      args: DeletePostMutationVariables,
      cache: Cache,
      info: any
    ) => {
      cache.invalidate("Query", "post", {
        id: args.id,
      });
      cache.invalidate("Query", "posts", {
        limit: 10,
      });
      const allFields = cache.inspectFields("Query");
      const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
      fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments);
      });
    },
    updatePost: (
      result: any,
      { id, input: { title, content } }: UpdatePostMutationVariables,
      cache: Cache,
      info: any
    ) => {
      const data = cache.readFragment(
        gql`
          fragment _ on Post {
            id
            title
            content
          }
        `,
        { id }
      );
      if (data) {
        cache.writeFragment(
          gql`
            fragment __ on Post {
              id
              title
              content
              contentSnip
            }
          `,
          { id, title, content, contentSnip: content.slice(0, 80) }
        );
      }
    },
  },
};
