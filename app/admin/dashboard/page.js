"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Upload,
  AlertCircle,
  Loader2,
  Sparkles,
  MapPin,
  Phone,
  Edit
} from "lucide-react";
const cleanPrice = (priceStr) => {
  if (!priceStr) return "";
  if (priceStr.length <= 15) return priceStr;

  const match = priceStr.match(/[₹$]\s*[0-9,]+/);
  if (match) return match[0];

  const numberMatch = priceStr.match(/[0-9,]+/);
  if (numberMatch) return "₹" + numberMatch[0];

  if (/custom/i.test(priceStr)) return "Custom";
  return "Custom";
};

const extractDescription = (priceStr, defaultDesc) => {
  if (!priceStr || priceStr.length <= 15) return defaultDesc;
  return priceStr;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Packages state
  const [packagesList, setPackagesList] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [packageFormLoading, setPackageFormLoading] = useState(false);
  const [packageForm, setPackageForm] = useState({
    id: "",
    name: "",
    price: "",
    features: "",
    description: ""
  });

  // Contact state
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    location: "",
  });
  const [contactLoading, setContactLoading] = useState(false);

  // Portfolio state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    id: "",
    title: "",
    category: "BRANDING",
    imageUrl: "",
    client: "",
    description: "",
    year: "",
    scope: "",
    details: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);

  // Redesign Navigation States
  const [activeTab, setActiveTab] = useState("packages");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Verify Auth on Mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        if (!res.ok) {
          router.push("/admin");
        } else {
          setLoading(false);
          fetchPackages();
          fetchContact();
          fetchProjects();
          fetchTestimonials();
        }
      } catch (err) {
        console.error("Auth verification failed", err);
        router.push("/admin");
      }
    };
    verifySession();
  }, [router]);

  // Toast Helper
  const triggerMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Fetch data
  const fetchPackages = async () => {
    setPackagesLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const data = await res.json();
        setPackagesList(data);
      }
    } catch (err) {
      console.error("Fetch packages error", err);
    } finally {
      setPackagesLoading(false);
    }
  };

  const fetchContact = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const data = await res.json();
        setContact(data);
      }
    } catch (err) {
      console.error("Fetch contact error", err);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Fetch projects error", err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Fetch testimonials error", err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Packages CRUD operations
  const handleOpenAddPackage = () => {
    setPackageForm({ id: "", name: "", price: "", features: "", description: "" });
    setIsEditingPackage(false);
    setShowPackageForm(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setPackageForm({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      features: pkg.features || "",
      description: pkg.description || ""
    });
    setIsEditingPackage(true);
    setShowPackageForm(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!packageForm.name.trim() || !packageForm.price.trim()) {
      triggerMessage("Package name and price are required", "error");
      return;
    }

    setPackageFormLoading(true);
    try {
      const method = isEditingPackage ? "PUT" : "POST";
      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageForm),
      });

      if (res.ok) {
        triggerMessage(isEditingPackage ? "Package updated successfully!" : "Package added successfully!");
        setPackageForm({ id: "", name: "", price: "", features: "", description: "" });
        setShowPackageForm(false);
        setIsEditingPackage(false);
        fetchPackages();
      } else {
        triggerMessage("Failed to save package.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerMessage("Error saving package.", "error");
    } finally {
      setPackageFormLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerMessage("Package deleted successfully!");
        fetchPackages();
      } else {
        triggerMessage("Failed to delete package.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerMessage("Error deleting package.", "error");
    }
  };

  // Save Contact Info
  const saveContact = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (res.ok) {
        triggerMessage("Contact information updated successfully!");
      } else {
        triggerMessage("Failed to save contact info.", "error");
      }
    } catch (err) {
      triggerMessage("Server error saving contact info.", "error");
    } finally {
      setContactLoading(false);
    }
  };

  // Image upload & Add Project
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddProject = () => {
    setNewProject({
      id: "",
      title: "",
      category: "BRANDING",
      imageUrl: "",
      client: "",
      description: "",
      year: "",
      scope: "",
      details: ""
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditingProject(false);
    setShowUploadModal(true);
  };

  const handleOpenEditProject = (project) => {
    setNewProject({
      id: project.id,
      title: project.title,
      category: project.category,
      imageUrl: project.imageUrl || "",
      client: project.client || "",
      description: project.description || "",
      year: project.year || "",
      scope: Array.isArray(project.scope) ? project.scope.join(", ") : project.scope || "",
      details: project.details || ""
    });
    setImageFile(null);
    setImagePreview(project.imageUrl || null);
    setIsEditingProject(true);
    setShowUploadModal(true);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      triggerMessage("Project title is required", "error");
      return;
    }
    if (!imageFile && !isEditingProject) {
      triggerMessage("Please select an image file to upload", "error");
      return;
    }

    setUploadingImage(true);
    try {
      let imageUrl = newProject.imageUrl || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || "Image upload failed");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const method = isEditingProject ? "PUT" : "POST";
      const payload = {
        title: newProject.title,
        category: newProject.category,
        imageUrl: imageUrl,
        client: newProject.client || "",
        description: newProject.description || "",
        year: newProject.year || "",
        scope: newProject.scope || "",
        details: newProject.details || ""
      };
      if (isEditingProject) {
        payload.id = newProject.id;
      }

      const res = await fetch("/api/admin/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        triggerMessage(isEditingProject ? "Project updated successfully!" : "New project added to portfolio successfully!");
        setNewProject({
          id: "",
          title: "",
          category: "BRANDING",
          imageUrl: "",
          client: "",
          description: "",
          year: "",
          scope: "",
          details: ""
        });
        setImageFile(null);
        setImagePreview(null);
        fetchProjects();
        setShowUploadModal(false);
        setIsEditingProject(false);
      } else {
        triggerMessage("Failed to save project metadata.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerMessage(err.message || "Error uploading image or saving project details.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to remove this project?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio?id=${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        triggerMessage("Project removed successfully!");
        fetchProjects();
      } else {
        triggerMessage("Failed to remove project.", "error");
      }
    } catch (err) {
      triggerMessage("Error removing project.", "error");
    }
  };

  // Approve/Reject Testimonial
  const handleUpdateTestimonial = async (id, status) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        triggerMessage(`Testimonial has been ${status === "Approved" ? "approved" : "rejected"}!`);
        fetchTestimonials();
      } else {
        triggerMessage("Failed to update status.", "error");
      }
    } catch (err) {
      triggerMessage("Error updating status.", "error");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#000000", gap: "16px" }}>
        <Loader2 className="spinner" style={{ width: "40px", height: "40px", color: "#FF6B00" }} />
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: "500", letterSpacing: "0.05em" }}>VERIFYING SESSION...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Toast notifications */}
      {message.text && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          backgroundColor: message.type === "error" ? "rgba(239, 68, 68, 0.95)" : "rgba(255, 107, 0, 0.95)",
          color: "#ffffff",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          {message.type === "error" ? <AlertCircle size={18} /> : <Sparkles size={18} />}
          <span style={{ fontSize: "13.5px", fontWeight: "600" }}>{message.text}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <aside className="sidebar" style={{
        width: "240px",
        backgroundColor: "#111111",
        borderRight: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* Logo Header */}
        <div style={{ padding: "32px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", backgroundColor: "#FF6B00", borderRadius: "50%", boxShadow: "0 0 10px #FF6B00" }}></span>
          <h1 style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "0.05em", color: "#ffffff", margin: 0, fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            PM GRAPHICS
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="sidebar-nav" style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            { id: "packages", label: "Packages", icon: Package },
            { id: "portfolio", label: "Portfolio", icon: ImageIcon },
            { id: "testimonials", label: "Testimonials", icon: MessageSquare },
            { id: "contact", label: "Contact Info", icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="sidebar-nav-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                  backgroundColor: isActive ? "rgba(255, 107, 0, 0.08)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "3px solid #FF6B00" : "3px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon size={18} style={{ color: isActive ? "#FF6B00" : "inherit" }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div style={{ padding: "24px 16px", borderTop: "1px solid #2a2a2a" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.5)",
              backgroundColor: "transparent",
              border: "1px solid #2a2a2a",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
              e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.borderColor = "#2a2a2a";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Header */}
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #2a2a2a",
            paddingBottom: "20px",
            marginBottom: "8px"
          }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", fontFamily: "var(--font-space-grotesk), sans-serif", margin: 0, textTransform: "capitalize" }}>
                {activeTab === "contact" ? "Contact Info" : activeTab} Panel
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>
                {activeTab === "packages" && "Manage packages and tiers displayed on your site."}
                {activeTab === "portfolio" && "Manage projects and uploads in your creative gallery."}
                {activeTab === "testimonials" && "Moderate client-submitted reviews and testimonials."}
                {activeTab === "contact" && "Configure contact email, phone, and geographic location settings."}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "6px", height: "6px", backgroundColor: "#22c55e", borderRadius: "50%", boxShadow: "0 0 8px #22c55e" }}></span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "600", textTransform: "uppercase" }}>Firebase Connected</span>
            </div>
          </header>

          {/* Active Tab Screen Panels */}
          
          {/* 1. PACKAGES PANEL */}
          {activeTab === "packages" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Stats card */}
              <div style={{ display: "flex", gap: "24px" }}>
                <div style={{
                  flex: 1,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px"
                }}>
                  <div style={{
                    backgroundColor: "rgba(255, 107, 0, 0.08)",
                    padding: "12px",
                    borderRadius: "10px",
                    color: "#FF6B00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Package size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", display: "block", fontWeight: "600" }}>Total Active Packages</span>
                    <span style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>{packagesList.length}</span>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.9)", margin: 0, textTransform: "uppercase" }}>Tiers & Pricing Tiers</h3>
                <button
                  onClick={handleOpenAddPackage}
                  style={{
                    backgroundColor: "#FF6B00",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                >
                  <Plus size={14} /> Add New Package
                </button>
              </div>

              {/* Card List Grid */}
              {packagesLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Loader2 className="spinner" style={{ width: "28px", height: "28px", color: "#FF6B00" }} />
                </div>
              ) : packagesList.length === 0 ? (
                <div className="glass-card" style={{ textAlign: "center", padding: "40px 24px", color: "rgba(255,255,255,0.4)" }}>
                  No packages currently configured. Click "Add New Package" to get started.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {packagesList.map((pkg) => (
                    <div key={pkg.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                      <div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                          <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#FF6B00", margin: 0, fontFamily: "var(--font-space-grotesk), sans-serif", textTransform: "uppercase" }}>
                            {pkg.name}
                          </h4>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                            {cleanPrice(pkg.price)}
                          </div>
                          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.6", fontFamily: "var(--font-inter), sans-serif" }}>
                            {extractDescription(pkg.price, pkg.description)}
                          </p>
                        </div>
                        <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "12px", marginBottom: "16px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                            Features ({pkg.features?.split("\n").filter(Boolean).length || 0})
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {pkg.features?.split("\n").filter(Boolean).map((feat, idx) => (
                              <div key={idx} style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "4px", height: "4px", backgroundColor: "#FF6B00", borderRadius: "50%" }}></span>
                                {feat}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #2a2a2a", paddingTop: "12px" }}>
                        <button
                          onClick={() => handleOpenEditPackage(pkg)}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #2a2a2a",
                            backgroundColor: "transparent",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "12.5px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#FF6B00"; e.currentTarget.style.borderColor = "#FF6B00"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid rgba(239,68,68,0.2)",
                            backgroundColor: "rgba(239,68,68,0.04)",
                            color: "#ef4444",
                            fontSize: "12.5px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.04)"; }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Package Dialog Modal */}
              {showPackageForm && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.85)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: "#111111",
                    border: "1px solid #2a2a2a",
                    borderRadius: "16px",
                    padding: "28px",
                    width: "90%",
                    maxWidth: "520px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.7)"
                  }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FF6B00", textTransform: "uppercase", margin: "0 0 16px 0", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                      {isEditingPackage ? "Edit Package Details" : "Create New Package"}
                    </h3>
                    
                    <form onSubmit={handleSavePackage} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Package Name</label>
                          <input 
                            type="text" 
                            value={packageForm.name} 
                            onChange={(e)=>setPackageForm({...packageForm, name: e.target.value})}
                            className="input-field" 
                            style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                            placeholder="e.g. Starter Pack" 
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Price Tag</label>
                          <input 
                            type="text" 
                            value={packageForm.price} 
                            onChange={(e)=>setPackageForm({...packageForm, price: e.target.value})}
                            className="input-field" 
                            style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                            placeholder="e.g. ₹4,999 or Custom" 
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Short Description</label>
                        <input 
                          type="text" 
                          value={packageForm.description} 
                          onChange={(e)=>setPackageForm({...packageForm, description: e.target.value})}
                          className="input-field" 
                          style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                          placeholder="Brief package summary" 
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Features (one per line)</label>
                        <textarea 
                          rows={4}
                          value={packageForm.features} 
                          onChange={(e)=>setPackageForm({...packageForm, features: e.target.value})}
                          className="input-field" 
                          style={{ resize: "none", borderRadius: "8px", fontSize: "13px", padding: "10px 14px", height: "100px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                          placeholder="Feature line 1&#10;Feature line 2" 
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <button 
                          type="submit" 
                          disabled={packageFormLoading}
                          style={{
                            flex: 1,
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "13px",
                            fontWeight: "700",
                            height: "44px",
                            backgroundColor: "#FF6B00",
                            border: "none",
                            color: "#ffffff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            cursor: "pointer"
                          }}
                        >
                          {packageFormLoading ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                          {isEditingPackage ? "Update Package" : "Create Package"}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setShowPackageForm(false); setIsEditingPackage(false); }}
                          style={{
                            flex: 1,
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "13px",
                            fontWeight: "700",
                            height: "44px",
                            backgroundColor: "transparent",
                            border: "1px solid #2a2a2a",
                            color: "rgba(255,255,255,0.7)",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. PORTFOLIO PANEL */}
          {activeTab === "portfolio" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.9)", margin: 0, textTransform: "uppercase" }}>Creative Designs</h3>
                <button
                  onClick={handleOpenAddProject}
                  style={{
                    backgroundColor: "#FF6B00",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                >
                  <Upload size={14} /> Upload Project
                </button>
              </div>

              {/* Portfolio Grid List */}
              {projectsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Loader2 className="spinner" style={{ width: "28px", height: "28px", color: "#FF6B00" }} />
                </div>
              ) : projects.length === 0 ? (
                <div className="glass-card" style={{ textAlign: "center", padding: "40px 24px", color: "rgba(255,255,255,0.4)" }}>
                  No items in the portfolio. Click "Upload Project" to upload your first work.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="glass-card"
                      style={{
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                      }}
                    >
                      <div style={{ width: "100%", height: "160px", position: "relative", backgroundColor: "#0b0b0b" }}>
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          onError={(e) => { e.currentTarget.src = "/screen.png"; }}
                        />
                        <span style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          backgroundColor: "rgba(0,0,0,0.8)",
                          color: "#FF6B00",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          border: "1px solid rgba(255, 107, 0, 0.25)"
                        }}>
                          {project.category}
                        </span>
                      </div>
                      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {project.title}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button
                            onClick={() => handleOpenEditProject(project)}
                            style={{
                              border: "none",
                              background: "rgba(255, 255, 255, 0.05)",
                              color: "rgba(255, 255, 255, 0.7)",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "8px",
                              display: "inline-flex",
                              alignItems: "center",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e)=> { e.currentTarget.style.backgroundColor="rgba(255, 107, 0, 0.1)"; e.currentTarget.style.color="#FF6B00"; }}
                            onMouseLeave={(e)=> { e.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.05)"; e.currentTarget.style.color="rgba(255, 255, 255, 0.7)"; }}
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            style={{
                              border: "none",
                              background: "rgba(239, 68, 68, 0.05)",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "8px",
                              display: "inline-flex",
                              alignItems: "center",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e)=>e.currentTarget.style.backgroundColor="rgba(239,68,68,0.12)"}
                            onMouseLeave={(e)=>e.currentTarget.style.backgroundColor="rgba(239,68,68,0.05)"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Portfolio Upload Dialog Modal */}
              {showUploadModal && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.85)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  justifyType: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: "#111111",
                    border: "1px solid #2a2a2a",
                    borderRadius: "16px",
                    padding: "28px",
                    width: "90%",
                    maxWidth: "520px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.7)"
                  }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FF6B00", textTransform: "uppercase", margin: "0 0 16px 0", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                      {isEditingProject ? "Edit Portfolio Project" : "Upload Portfolio Project"}
                    </h3>
                    
                    <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Project Title</label>
                        <input 
                          type="text" 
                          value={newProject.title}
                          onChange={(e)=>setNewProject({...newProject, title: e.target.value})}
                          className="input-field" 
                          style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                          placeholder="e.g. Gym Logo Design"
                          required
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Category</label>
                        <select
                          value={newProject.category}
                          onChange={(e)=>setNewProject({...newProject, category: e.target.value})}
                          className="input-field"
                          style={{
                            backgroundColor: "#0a0a0a",
                            border: "1px solid #2a2a2a",
                            color: "#ffffff",
                            fontSize: "13.5px",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            height: "44px",
                            cursor: "pointer"
                          }}
                        >
                          <option value="BRANDING">Branding</option>
                          <option value="BACKDROPS">Backdrops</option>
                          <option value="FLYERS">Flyers</option>
                          <option value="VIDEOS EDITING">Videos Editing</option>
                        </select>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Client (Optional)</label>
                          <input 
                            type="text" 
                            value={newProject.client}
                            onChange={(e)=>setNewProject({...newProject, client: e.target.value})}
                            className="input-field" 
                            style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                            placeholder="e.g. Acme Corp"
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Year (Optional)</label>
                          <input 
                            type="text" 
                            value={newProject.year}
                            onChange={(e)=>setNewProject({...newProject, year: e.target.value})}
                            className="input-field" 
                            style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                            placeholder="e.g. 2026"
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Short Description (Optional)</label>
                        <input 
                          type="text" 
                          value={newProject.description}
                          onChange={(e)=>setNewProject({...newProject, description: e.target.value})}
                          className="input-field" 
                          style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                          placeholder="Brief project summary"
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Scope / Tags (Optional)</label>
                        <input 
                          type="text" 
                          value={newProject.scope}
                          onChange={(e)=>setNewProject({...newProject, scope: e.target.value})}
                          className="input-field" 
                          style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                          placeholder="e.g. Logo Design, Event Flyer (comma separated)"
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>Project Details / Description (Optional)</label>
                        <textarea 
                          rows={3}
                          value={newProject.details}
                          onChange={(e)=>setNewProject({...newProject, details: e.target.value})}
                          className="input-field" 
                          style={{ resize: "none", borderRadius: "8px", fontSize: "13px", padding: "10px 14px", height: "80px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                          placeholder="Detailed overview of the project work..."
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>
                          Project Image File {isEditingProject && "(Optional)"}
                        </label>
                        <div style={{
                          border: "1px dashed rgba(255, 107, 0, 0.3)",
                          borderRadius: "8px",
                          padding: "20px",
                          textAlign: "center",
                          backgroundColor: "#0a0a0a",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "110px",
                          cursor: "pointer",
                          position: "relative"
                        }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                          />
                          {imagePreview ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={{ maxWidth: "100%", maxHeight: "70px", objectFit: "contain", borderRadius: "4px", border: "1px solid #FF6B00" }} 
                              />
                              <span style={{ fontSize: "11px", color: "#ffffff", fontWeight: "600" }}>{imageFile?.name || "Current Image"}</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)" }}>
                              <Upload size={22} style={{ color: "#FF6B00", marginBottom: "2px" }} />
                              <span style={{ fontSize: "12px", fontWeight: "600" }}>Select project image file</span>
                              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>PNG, JPG or WEBP (Max 5MB)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <button 
                          type="submit" 
                          disabled={uploadingImage}
                          style={{
                            flex: 1,
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "13px",
                            fontWeight: "700",
                            height: "44px",
                            backgroundColor: "#FF6B00",
                            border: "none",
                            color: "#ffffff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            cursor: "pointer"
                          }}
                        >
                          {uploadingImage ? <Loader2 size={14} className="spinner" /> : isEditingProject ? <Check size={14} /> : <Plus size={14} />}
                          {uploadingImage ? "Uploading..." : isEditingProject ? "Save Changes" : "Add Project"}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setShowUploadModal(false); setImageFile(null); setImagePreview(null); setIsEditingProject(false); }}
                          style={{
                            flex: 1,
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "13px",
                            fontWeight: "700",
                            height: "44px",
                            backgroundColor: "transparent",
                            border: "1px solid #2a2a2a",
                            color: "rgba(255,255,255,0.7)",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. TESTIMONIALS PANEL */}
          {activeTab === "testimonials" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.9)", margin: 0, textTransform: "uppercase" }}>Client Feedback</h3>
              </div>

              {testimonialsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Loader2 className="spinner" style={{ width: "28px", height: "28px", color: "#FF6B00" }} />
                </div>
              ) : testimonials.length === 0 ? (
                <div className="glass-card" style={{ textAlign: "center", padding: "40px 24px", color: "rgba(255,255,255,0.4)" }}>
                  No testimonials submitted.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {testimonials.map((t) => {
                    const isApproved = t.status === "Approved";
                    const isRejected = t.status === "Rejected";
                    const statusColor = isApproved ? "#22c55e" : isRejected ? "#ef4444" : "#888888";
                    const statusBg = isApproved ? "rgba(34, 197, 94, 0.08)" : isRejected ? "rgba(239, 68, 68, 0.08)" : "rgba(136, 136, 136, 0.08)";
                    
                    return (
                      <div 
                        key={t.id} 
                        className="glass-card"
                        style={{
                          borderLeft: `4px solid ${statusColor}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "24px",
                          flexWrap: "wrap",
                          padding: "16px 20px"
                        }}
                      >
                        <div style={{ flex: 1, minWidth: "240px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", margin: 0 }}>{t.name}</h4>
                            <span style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: statusBg,
                              color: statusColor,
                              border: `1px solid ${statusColor}30`
                            }}>
                              {t.status}
                            </span>
                            <span style={{ color: "#FF6B00", fontSize: "12.5px" }}>
                              {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                            </span>
                          </div>
                          <p style={{ fontSize: "13px", lineHeight: "1.5", color: "rgba(255,255,255,0.75)", margin: 0, fontStyle: "italic" }}>
                            "{t.text}"
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            disabled={isApproved}
                            onClick={() => handleUpdateTestimonial(t.id, "Approved")}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "700",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                              backgroundColor: isApproved ? "transparent" : "rgba(34, 197, 94, 0.08)",
                              color: isApproved ? "rgba(34,197,94,0.35)" : "#22c55e",
                              cursor: isApproved ? "not-allowed" : "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => { if(!isApproved) e.currentTarget.style.backgroundColor="rgba(34, 197, 94, 0.15)"; }}
                            onMouseLeave={(e) => { if(!isApproved) e.currentTarget.style.backgroundColor="rgba(34, 197, 94, 0.08)"; }}
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            disabled={isRejected}
                            onClick={() => handleUpdateTestimonial(t.id, "Rejected")}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "700",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              backgroundColor: isRejected ? "transparent" : "rgba(239, 68, 68, 0.08)",
                              color: isRejected ? "rgba(239,68,68,0.35)" : "#ef4444",
                              cursor: isRejected ? "not-allowed" : "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => { if(!isRejected) e.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.15)"; }}
                            onMouseLeave={(e) => { if(!isRejected) e.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.08)"; }}
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. CONTACT PANEL */}
          {activeTab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <form onSubmit={saveContact} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "580px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", margin: 0, textTransform: "uppercase", borderBottom: "1px solid #2a2a2a", paddingBottom: "14px" }}>
                  Contact Information Configuration
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Email address */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={13} style={{ color: "#FF6B00" }} /> Email Address
                    </label>
                    <input 
                      type="email" 
                      value={contact.email}
                      onChange={(e)=>setContact({...contact, email: e.target.value})}
                      className="input-field" 
                      style={{ fontSize: "13.5px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                      placeholder="e.g. info@pmgraphics.design"
                      required
                    />
                  </div>

                  {/* Phone number */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={13} style={{ color: "#FF6B00" }} /> Phone Number
                    </label>
                    <input 
                      type="text" 
                      value={contact.phone}
                      onChange={(e)=>setContact({...contact, phone: e.target.value})}
                      className="input-field" 
                      style={{ fontSize: "13.5px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={13} style={{ color: "#FF6B00" }} /> Location
                    </label>
                    <input 
                      type="text" 
                      value={contact.location}
                      onChange={(e)=>setContact({...contact, location: e.target.value})}
                      className="input-field" 
                      style={{ fontSize: "13.5px", padding: "10px 14px", borderRadius: "8px", height: "44px", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ffffff" }}
                      placeholder="e.g. Guwahati, Assam, India"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={contactLoading}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: "700",
                    height: "44px",
                    backgroundColor: "#FF6B00",
                    border: "none",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    cursor: contactLoading ? "not-allowed" : "pointer",
                    width: "fit-content",
                    marginTop: "8px"
                  }}
                >
                  {contactLoading ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                  Save Contact Info
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Global CSS redone */}
        <style jsx global>{`
          .admin-container {
            display: flex;
            min-height: 100vh;
            background-color: #0a0a0a;
            color: #ffffff;
          }
          .main-content {
            flex: 1;
            margin-left: 240px;
            padding: 40px 24px;
            min-width: 0;
          }
          .sidebar-nav-btn {
            border: none;
            transition: all 0.2s ease;
          }
          .glass-card {
            background-color: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 12px;
            padding: 20px;
            transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          }
          .glass-card:hover {
            border-color: #FF6B00;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 107, 0, 0.04);
          }
          .input-field {
            outline: none;
            transition: border-color 0.2s ease;
          }
          .input-field:focus {
            border-color: #FF6B00 !important;
          }
          .spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .admin-container {
              flex-direction: column !important;
            }
            .sidebar {
              width: 100% !important;
              position: relative !important;
              height: auto !important;
              border-right: none !important;
              border-bottom: 1px solid #2a2a2a !important;
            }
            .sidebar-nav {
              flex-direction: row !important;
              flex-wrap: wrap !important;
              padding: 12px !important;
              justify-content: space-around !important;
            }
            .sidebar-nav-btn {
              border-left: none !important;
              padding: 8px 12px !important;
            }
            .main-content {
              margin-left: 0 !important;
              padding: 24px 16px !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
