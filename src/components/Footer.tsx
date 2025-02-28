import { Facebook, Linkedin, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-blue-900 py-12 text-white">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
          <p>Email: donationhelp@example.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Phone: +91 91234 56789</p>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
          <div className="flex gap-4">
            <Facebook className="h-6 w-6" />
            <Twitter className="h-6 w-6" />
            <Linkedin className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Address</h3>
          <p>123, Donation Street, Kindness City</p>
          <p>Helping Hands, India</p>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>
          © {new Date().getFullYear()} Donation Platform | Made with{" "}
          <Heart className="inline h-4 w-4 text-red-500" /> by The Great Vishal
        </p>
      </div>
    </footer>
  );
}
