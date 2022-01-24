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

export type BooleanResponse = {
  __typename?: 'BooleanResponse';
  errors?: Maybe<Array<FieldError>>;
  status?: Maybe<Scalars['Boolean']>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword?: Maybe<UserResponse>;
  delete: BooleanResponse;
  deleteAllPosts: BooleanResponse;
  forgotPassword: Scalars['Boolean'];
  hitPost: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  newPost: PostResponse;
  register: UserResponse;
  resetPassword: BooleanResponse;
  updatePost: PostResponse;
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationDeleteArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationHitPostArgs = {
  post: Scalars['Int'];
  value: Scalars['Int'];
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


export type MutationResetPasswordArgs = {
  current: Scalars['String'];
  new: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  input: PostInput;
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  id: Scalars['Float'];
  numberOfHits: Scalars['Int'];
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
  hasMorePosts: Scalars['Boolean'];
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


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserPassInput = {
  email?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Post_AllFragment = { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, content: string, numberOfHits: number, creatorId: number, creator: { __typename?: 'User', id: number, username: string } };

export type User_AllFragment = { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string, email: string };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string, email: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } | null | undefined };

export type CreateNewPostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreateNewPostMutation = { __typename?: 'Mutation', newPost: { __typename?: 'PostResponse', post?: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, content: string, numberOfHits: number, creatorId: number, creator: { __typename?: 'User', id: number, username: string } } | null | undefined, errors?: { __typename?: 'PostError', field: string, message: string } | null | undefined } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string, email: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string, email: string } | null | undefined } };

export type ResetPasswordMutationVariables = Exact<{
  current: Scalars['String'];
  new: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'BooleanResponse', status?: boolean | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, createdAt: string, updatedAt: string, username: string, email: string } | null | undefined };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Float'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostsResponse', hasMorePosts: boolean, posts?: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, content: string, numberOfHits: number, creatorId: number, creator: { __typename?: 'User', id: number, username: string } }> | null | undefined } };

export const Post_AllFragmentDoc = gql`
    fragment post_all on Post {
  id
  createdAt
  updatedAt
  title
  content
  numberOfHits
  creatorId
  creator {
    id
    username
  }
}
    `;
export const User_AllFragmentDoc = gql`
    fragment user_all on User {
  id
  createdAt
  updatedAt
  username
  email
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $password: String!) {
  changePassword(token: $token, password: $password) {
    user {
      ...user_all
    }
    errors {
      field
      message
    }
  }
}
    ${User_AllFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateNewPostDocument = gql`
    mutation CreateNewPost($input: PostInput!) {
  newPost(input: $input) {
    post {
      ...post_all
    }
    errors {
      field
      message
    }
  }
}
    ${Post_AllFragmentDoc}`;

export function useCreateNewPostMutation() {
  return Urql.useMutation<CreateNewPostMutation, CreateNewPostMutationVariables>(CreateNewPostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
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
    mutation Register($username: String!, $password: String!, $email: String) {
  register(input: {username: $username, password: $password, email: $email}) {
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
export const ResetPasswordDocument = gql`
    mutation ResetPassword($current: String!, $new: String!) {
  resetPassword(current: $current, new: $new) {
    status
    errors {
      field
      message
    }
  }
}
    `;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
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
    query Posts($limit: Float!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    posts {
      ...post_all
    }
    hasMorePosts
  }
}
    ${Post_AllFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};