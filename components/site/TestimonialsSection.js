"use client";

import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

export default function TestimonialsSection() {
  // Pre-written reviews by owner
  const preWrittenReviews = [
    {
      id: "pre-1",
      name: "Rahul Sharma",
      text: "PM Graphics completely transformed our brand. The logo design was clean, bold, and exactly what we needed.",
      isApproved: true,
    },
    {
      id: "pre-2",
      name: "Priya Das",
      text: "The event backdrop designed by PM Graphics was stunning. Everyone at the event was impressed.",
      isApproved: true,
    },
    {
      id: "pre-3",
      name: "Amit Bora",
      text: "Best flyer designer I have worked with. Fast delivery and premium quality every time.",
      isApproved: true,
    },
    {
      id: "pre-4",
      name: "Sneha Gogoi",
      text: "Our YouTube channel intro looks so professional now. Highly recommend PM Graphics.",
      isApproved: true,
    },
    {
      id: "pre-5",
      name: "Rajan Paul",
      text: "The branding package was worth every penny. Our business looks so much more credible now.",
      isApproved: true,
    },
    {
      id: "pre-6",
      name: "Meghna Singh",
      text: "PM Graphics understood our vision perfectly and delivered beyond expectations.",
      isApproved: true,
    },
    {
      id: "pre-7",
      name: "Deepak Nath",
      text: "The social media flyers got us so many compliments. Will definitely work again.",
      isApproved: true,
    },
    {
      id: "pre-8",
      name: "Kabita Devi",
      text: "Very professional and creative. The event graphics were the highlight of our ceremony.",
      isApproved: true,
    },
  ];

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", text: "", rating: 5 });

  // Load reviews from Airtable backend API
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setReviews(data.records || []);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.text?.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          text: formData.text,
          rating: Number(formData.rating),
        }),
      });

      if (res.ok) {
        setFormData({ name: "", text: "", rating: 5 });
        setShowReviewForm(false);
        alert("Thank you! Your review has been submitted and is pending moderation.");
        // Refresh testimonials lists
        const refreshRes = await fetch("/api/testimonials");
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setReviews(refreshData.records || []);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine pre-written + Airtable reviews for the marquee
  const allReviews = [...preWrittenReviews, ...reviews];
  // Duplicate for seamless infinite loop
  const marqueeReviews = [...allReviews, ...allReviews];

  return (
    <section
  id="testimonials"
  className="section-spacing container"
  style={{ pointerEvents: "auto", overflow: "hidden", marginTop: "200PX" }}
>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--stack-md)",
          marginBottom: "48px",
        }}
      >
        <div className="font-label-caps" style={{ color: "var(--accent)" }}>
          CLIENT TESTIMONIALS
        </div>
        <h2
          className="font-headline-lg"
          style={{ textTransform: "uppercase", marginBottom: "16px" }}
        >
          WHAT OUR CLIENTS SAY
        </h2>
      </div>

      {/* Testimonials Carousel */}
      <div className="testimonials-carousel-container" style={{ marginBottom: "40px" }}>
        <div className="testimonials-carousel-track">
          {marqueeReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="testimonial-card"
              style={{
                width: "320px",
                flexShrink: 0,
                padding: "28px",
                borderRadius: "16px",
                backgroundColor: "rgba(26,26,26,0.5)",
                border: "1px solid rgba(255,106,0,0.14)",
                boxShadow: "0 8px 16px rgba(255,106,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(35,35,35,0.85)";
                e.currentTarget.style.borderColor = "rgba(255,106,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(26,26,26,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,106,0,0.14)";
              }}
            >
              {/* Star Rating */}
              <div style={{ display: "flex", gap: "4px" }}>
                {[...Array(5)].map((_, i) => {
                  const isFilled = i < (review.rating || 5);
                  return (
                    <Star
                      key={i}
                      size={16}
                      style={{
                        fill: isFilled ? "var(--accent)" : "none",
                        color: "var(--accent)",
                      }}
                    />
                  );
                })}
              </div>

              {/* Review Text */}
              <p
                className="font-body-md"
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.7",
                  margin: 0,
                  fontSize: "14px",
                  flexGrow: 1,
                }}
              >
                &quot;{review.text}&quot;
              </p>

              {/* Client Info */}
              <div style={{ borderTop: "1px solid rgba(255,106,0,0.1)", paddingTop: "16px", marginTop: "auto" }}>
                <div style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                  {review.name}
                </div>
                {review.role && (
                  <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                    {review.role}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave a Review Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="btn-primary"
          style={{
            padding: "14px 32px",
            fontSize: "16px",
          }}
        >
          {showReviewForm ? "Cancel" : "Leave a Review"}
        </button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div
          onClick={() => setShowReviewForm(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(15px)",
            zIndex: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "rgba(19,19,19,0.95)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255,106,0,0.2)",
              borderRadius: "24px",
              padding: "40px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowReviewForm(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.2)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            <h3
              className="font-headline-md"
              style={{ marginBottom: "24px", textTransform: "uppercase" }}
            >
              Share Your Feedback
            </h3>

            <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={handleFormChange}
                className="input-field"
                style={{ padding: "14px 18px" }}
                disabled={isSubmitting}
              />
              <textarea
                name="text"
                required
                minLength={20}
                placeholder="Your Review (min 20 characters)"
                value={formData.text}
                onChange={handleFormChange}
                className="input-field"
                rows={5}
                style={{ padding: "14px 18px", resize: "vertical" }}
                disabled={isSubmitting}
              />

              {/* Star Rating Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "var(--text-primary)" }}>
                  Rating *
                </label>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isFilled = val <= formData.rating;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, rating: val }))}
                        disabled={isSubmitting}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: isSubmitting ? "default" : "pointer",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) e.currentTarget.style.transform = "scale(1.15)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <Star
                          size={24}
                          style={{
                            fill: isFilled ? "var(--accent)" : "none",
                            color: "var(--accent)",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  padding: "14px 28px",
                  width: "100%",
                  marginTop: "8px",
                  justifyContent: "center",
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}



      <style jsx global>{`
        .testimonials-carousel-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
        }

        .testimonials-carousel-container::before,
        .testimonials-carousel-container::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }

        .testimonials-carousel-container::before {
          left: 0;
          background: linear-gradient(90deg, #0B0B0B 0%, transparent 100%);
        }

        
        .testimonials-carousel-container::after {
          right: 0;
          background: linear-gradient(-90deg, #0B0B0B 0%, transparent 100%);
        }

        .testimonials-carousel-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: testimonialsMarquee 45s linear infinite;
        }

        .testimonials-carousel-container:hover .testimonials-carousel-track {
          animation-play-state: paused;
        }

        @keyframes testimonialsMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px));
          }
        }

        @media (max-width: 768px) {
          .testimonials-carousel-container::before,
          .testimonials-carousel-container::after {
            width: 40px;
          }
          .testimonials-carousel-track {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  );
}
