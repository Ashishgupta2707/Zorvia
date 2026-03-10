// pages/EditPost.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/post";
import AddPost from "./AddPost";

export default function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return navigate("/all-posts");

    appwriteService
      .getPost(slug)
      .then((data) => {
        if (data) setPost(data);
        else navigate("/all-posts");
      })
      .catch(() => navigate("/all-posts"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e1c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7c5cbf] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AddPost post={post} />; // ← same component, just with post prop
}
