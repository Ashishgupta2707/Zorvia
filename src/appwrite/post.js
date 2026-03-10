import { Client, Databases, ID, Storage, Query } from "appwrite";
import env from "../config/config";

class PostService {
  client;
  databases;
  bucket;

  constructor() {
    this.client = new Client()
      .setEndpoint(env.appwriteUrl)
      .setProject(env.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // ── CREATE ──────────────────────────────────────────────────────────────────
  createPost = async ({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    authorName, // ✅ NEW — stores author display name at creation time
    category,
    tags,
  }) => {
    try {
      return await this.databases.createDocument(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          authorName,
          category,
          tags,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      throw error;
    }
  };

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  updatePost = async ({
    slug,
    title,
    content,
    featuredImage,
    status,
    authorName, // ✅ NEW — preserve author name on edits
    category,
    tags,
  }) => {
    try {
      return await this.databases.updateDocument(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        slug,
        { title, content, featuredImage, status, authorName, category, tags },
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
      throw error;
    }
  };

  // ── DELETE ──────────────────────────────────────────────────────────────────
  deletePost = async (slug) => {
    try {
      await this.databases.deleteDocument(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        slug,
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      throw error;
    }
  };

  // ── GET ALL ──────────────────────────────────────────────────────────────────
  getAllPosts = async (queries = [Query.equal("status", "Active")]) => {
    try {
      return await this.databases.listDocuments(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        queries,
      );
    } catch (error) {
      console.log("Appwrite service :: getAllPosts :: error", error);
      throw error;
    }
  };

  // ── GET SINGLE ───────────────────────────────────────────────────────────────
  getPost = async (slug) => {
    try {
      return await this.databases.getDocument(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        slug,
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      throw error;
    }
  };

  // ── GET BY CATEGORY ──────────────────────────────────────────────────────────
  getPostsByCategory = async (category) => {
    try {
      return await this.databases.listDocuments(
        env.appwriteDatabaseId,
        env.appwriteCollectionId,
        [Query.equal("status", "Active"), Query.equal("category", category)],
      );
    } catch (error) {
      console.log("Appwrite service :: getPostsByCategory :: error", error);
      throw error;
    }
  };

  // ── FILE UPLOAD ───────────────────────────────────────────────────────────────
  uploadFile = async (file) => {
    try {
      return await this.bucket.createFile(
        env.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      throw error;
    }
  };

  // ── FILE DELETE ───────────────────────────────────────────────────────────────
  deleteFile = async (fileId) => {
    try {
      return await this.bucket.deleteFile(env.appwriteBucketId, fileId);
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      throw error;
    }
  };

  // ── FILE VIEW ─────────────────────────────────────────────────────────────────
  // getFileView() returns raw URL — no transformations, free plan compatible.
  getFilePreview(fileId) {
    return this.bucket.getFileView(env.appwriteBucketId, fileId).toString();
  }
}

const postService = new PostService();
export default postService;
