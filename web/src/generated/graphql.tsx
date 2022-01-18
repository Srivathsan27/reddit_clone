import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  delete: PostResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  newPost: PostResponse;
  register: UserResponse;
  updatePost: PostResponse;
};


export type MutationDeleteArgs = {
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  input: UserPassInput;
};


export type MutationNewPostArgs = {
  input: PostInput;
};


export type MutationRegisterArgs = {
  input: UserPassInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  input: PostInput;
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PostError = {
  __typename?: 'PostError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostInput = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<PostError>;
  post?: Maybe<Post>;
};

export type PostsResponse = {
  __typename?: 'PostsResponse';
  errors?: Maybe<PostError>;
  numberOfPosts?: Maybe<Scalars['Float']>;
  posts?: Maybe<Array<Post>>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  post: PostResponse;
  posts: PostsResponse;
  users: Array<User>;
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserPassInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type User_AllFragment = { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string } | null | undefined } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string } | null | undefined };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostsResponse', numberOfPosts?: number | null | undefined, posts?: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, content: string }> | null | undefined, errors?: { __typename?: 'PostError', field: string, message: string } | null | undefined } };

export const User_AllFragmentDoc = gql`
    fragment user_all on User {
  id
  createdAt
  updatedAt
  username
}
    `;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(input: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      ...user_all
    }
  }
}
    ${User_AllFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(input: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      ...user_all
    }
  }
}
    ${User_AllFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...user_all
  }
}
    ${User_AllFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    posts {
      id
      createdAt
      updatedAt
      title
      content
    }
    numberOfPosts
    errors {
      field
      message
    }
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};