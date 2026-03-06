import { Client, Databases, ID, Storage } from "appwrite";
import env from "../config/config";

class PostService {
  client;
  databases;
  bucket;

  constructor() {
    this.client = new Client()
      .setEndpoint(env.appwriteUrl) // Your API Endpoint
      .setProject(env.appwriteProjectId); // Your project ID

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  createPost = async ({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
  }) => {
    try {
      const data = await this.databases.createDocument({
        databaseId: env.appwriteDatabaseId,
        collectionId: env.appwriteCollectionId,
        documentId: slug,
        data: {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      });

      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
    }
  };

  updatePost = async ({ title, slug, content, featuredImage, status }) => {
    try {
      const data = await this.databases.updateDocument({
        databaseId: env.appwriteDatabaseId,
        collectionId: env.appwriteCollectionId,
        documentId: slug,
        data: {
          title,
          content,
          featuredImage,
          status,
        },
      });

      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: updatePost :: error", error);
    }
  };

  deletePost = async ({ slug }) => {
    try {
      const data = await this.databases.deleteDocument({
        databaseId: env.appwriteDatabaseId,
        collectionId: env.appwriteCollectionId,
        documentId: slug,
      });

      if (data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Appwrite serive :: deletePost :: error", error);
    }
  };

  getAllPosts = async () => {
    try {
      const allPosts = await this.databases.listDocuments({
        databaseId: env.appwriteDatabaseId,
        collectionId: env.appwriteCollectionId,
      });
      if (allPosts) {
        return allPosts;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: getAllPosts :: error", error);
    }
  };

  getPost = async (queries = [Query.equal("status", "active")]) => {
    try {
      const pastData = await this.databases.getDocument(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        queries,
      );
      if (pastData) {
        return pastData;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
    }
  };

  uploadFile = async (file) => {
    try {
      const fileData = await this.bucket.createFile({
        bucketId: env.appwriteBucketId,
        fileId: ID.unique(),
        file: file,
      });

      if (fileData) {
        return fileData;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
    }
  };

  deleteFile = async (fileId) => {
    try {
      const fileData = await this.bucket.deleteFile({
        bucketId: env.appwriteBucketId,
        fileId: fileId,
      });

      if (fileData) {
        return fileData;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
    }
  };

  deleteFile = async (fileId) => {
    try {
      const fileData = await this.bucket.deleteFile({
        bucketId: env.appwriteBucketId,
        fileId: fileId,
      });

      if (fileData) {
        return fileData;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Appwrite serive :: deleteFile :: error", error);
    }
  };

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(env.appwriteBucketId, fileId);
  }
}

const postService = new PostService();

export default postService;
