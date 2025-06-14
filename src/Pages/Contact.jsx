
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setSubmitting(true);
    // Simulate static submission (no backend)
    console.log("Form submitted:", formData);
    setTimeout(() => {
      toast.success("Message received! (This is a static demo)");
      setFormData({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-[80%] mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-800 mb-8"
        >
          Contact Us
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27141]"
                placeholder="Your name"
                disabled={submitting}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27141]"
                placeholder="Your email"
                disabled={submitting}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27141]"
                rows="5"
                placeholder="Your message"
                disabled={submitting}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg bg-[#F27141] text-white font-medium transition-colors
                ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e05f35]"}`}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
