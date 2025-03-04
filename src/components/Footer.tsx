import { Facebook, Linkedin, Twitter, Heart } from "lucide-react";
// import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-black py-12 text-white">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-pink-500">Contact Us</h3>
          <p>Email: donorseeker2025@gmail.com</p>
          <p>Phone: +91 1234567890</p>
          <p>Phone: +91 1234567890</p>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-pink-500">Follow Us</h3>
          <div className="flex gap-4">
            <Facebook className="h-6 w-6 text-blue-500 hover:text-pink-500" />
            <Twitter className="h-6 w-6 text-blue-500 hover:text-pink-500" />
            <Linkedin className="h-6 w-6 text-blue-500 hover:text-pink-500" />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-pink-500">Address</h3>
          <p>123, Donation Street, Kindness City</p>
          <p>Helping Hands, India</p>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>
          © {new Date().getFullYear()} Donation Platform | Made with{" "}
          <Heart className="inline h-4 w-4 text-pink-500" /> by Vishal Solanki
        </p>
      </div>
    </footer>
  );
}