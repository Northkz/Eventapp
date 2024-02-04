import React, { useState, useEffect } from "react";
import useAuthStore from "../../AuthStore"; // read token from AuthStore
import "../../App.css";
import "./Programmes.css";
import "./CommentComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";

const CommentComponent = ({ venueId, fetchAverageRating, setCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL; // Your API base URL
  const { email, token } = useAuthStore(); // import token from AuthStore

  // Fetch existing comments for the venue
  async function fetchComments() {
    try {
      const response = await fetch(`${apiUrl}/api/venue/comments?venueId=${venueId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      // Extract the comments array from the data object
      const comments = data.comments;
      console.log("Comments from API: ", comments); // Log the comments from the API
      // Ensure comments is an array before setting comments
      if (Array.isArray(comments)) {
        setComments(comments);
      } else {
        console.error("Comments is not an array: ", comments);
      }
    } catch (error) {
      setError("Could not fetch comments");
    }
  }

  useEffect(() => {
    fetchComments();
  }, [venueId, apiUrl]);

  async function handleAddComment(event) {
    event.preventDefault();
    try {
      event.preventDefault();
      const response = await fetch(`${apiUrl}/api/venue/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentText: newComment,
          email: email,
          venueID: venueId,
          rating: rating,
        }),
      });

      const data = await response.text(); // Use response.text() instead of response.json()
      console.log("Data from addComment API: ", data); // Log the data from the API
      if (!response.ok) throw new Error(data || "Failed to add comment");

      // Fetch the updated comments from the server
      fetchComments();
      setNewComment(""); // Clear the comment input field
      fetchAverageRating();
      setCommentAdded(true);
    } catch (error) {
      setError("Could not post comment: " + error.message || "Unknown error");
    }
  }
  return (
    <div className="card">
      <h4>Comments</h4>
      {/* comments could be undefined  */}
      {comments === undefined || comments.length === 0 ? <p>No comments yet</p> : <p>{comments.length} comments</p>}
      {comments &&
        comments?.length > 0 &&
        comments.map((comment, index) => (
          <div key={index} style={{ margin: "10px", padding: "10px", border: "1px solid black" }}>
            <div>
              <span style={{ fontWeight: "bold" }}>{comment.user_id}</span>
              <span className="ps-2">Rating: {comment.rating}</span>
              <div className="stars d-inline ps-1">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <FontAwesomeIcon icon={ratingValue <= comment.rating + 0.5 ? solid("star") : regular("star")} className="star" />
                    </label>
                  );
                })}
              </div>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      {/* divider */}
      <hr />
      <h4>Add Comment</h4>
      <form onSubmit={handleAddComment} className="comment-form">
        <div className="input-group">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="comment-input" />
          <div class="">
            Rating:
            <div className="rating-input-container d-flex align-items-center">
              <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" className="rating-input" />
              <span>&nbsp;/5</span>
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button w-100">
          Add Comment
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CommentComponent;
