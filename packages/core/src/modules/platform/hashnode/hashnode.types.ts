import type { Types } from "mongoose";

export interface IHashnodeDefaultSettings {
  enable_table_of_contents: boolean;
  send_newsletter: boolean;
  delisted: boolean;
}

export interface IHashnode {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  api_key: string;
  username: string;
  blog_handle: string;
  publication: {
    publication_id: string;
  };
  settings: IHashnodeDefaultSettings;
  created_at: Date;
  updated_at: Date;
}

export type THashnodeCreateInput = Omit<
  IHashnode,
  "_id" | "created_at" | "updated_at"
>;

export type THashnodeUpdateInput = Partial<THashnodeCreateInput>;

export interface IHashnodeUserOutput {
  data: {
    me: {
      id: string;
      username: string;
      profilePicture: string;
      publications: {
        edges: {
          node: {
            id: string;
            url: string;
            favicon: string;
          };
        }[];
        totalDocuments: number;
      };
    };
  } | null;
  errors: {
    message: string;
    locations: {
      line: number;
      column: number;
    }[];
    path: string[];
    extensions: {
      code:
        | "GRAPHQL_VALIDATION_FAILED"
        | "UNAUTHENTICATED"
        | "FORBIDDEN"
        | "BAD_USER_INPUT"
        | "NOT_FOUND";
    };
  }[];
}

export interface IHashnodeCreatePostInput {
  title: string;
  publicationId: string;
  contentMarkdown: string;
  coverImageOptions?: {
    coverImageURL?: string;
  };
  originalArticleURL?: string;
  tags: { id: string; name: string }[];
  settings: {
    enableTableOfContent: boolean;
    isNewsletterActivated: boolean;
    delisted: boolean;
  };
}

export type THashnodeToUpdatePost = Partial<IHashnodeCreatePostInput>;

export interface IOutput {
  isError: boolean;
  data?: {
    publishPost: { post: { id: string; slug: string } };
  };
}

export type THashnodeCreatePostOutput = IOutput extends { isError: false }
  ? { id: string; url: string }
  : IOutput;

export interface IHashnodeUpdatePostOutput {
  isError: boolean;
}

export interface IHashnodeGetAllPostsOutput {
  data: {
    publication: {
      posts: {
        totalDocuments: number;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
        edges: {
          node: {
            id: string;
            title: string;
            url: string;
            canonicalUrl: string;
            coverImage: {
              url: string;
            };
            brief: string;
            content: {
              markdown: string;
            };
            publishedAt: Date;
            seo: {
              title: null | string;
              description: null | string;
            };
          };
        }[];
      };
    };
  };
}
