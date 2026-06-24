export const metadata = {
  title: "Admin Portal — PM Graphics",
  description: "Secure administrative management console for PM Graphics.",
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff" }}>
      {children}
    </div>
  );
}
